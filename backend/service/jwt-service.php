<?php
    use Firebase\JWT\JWT;
    use Firebase\JWT\Key;

/**
 * a function that generates JWT token based on the user information
 * @param $data - an array containing user information
 * @return array an array containing response data with user authentication token
 */
    function generateJwtToken($data): array
    {
        $secret_key  = $_ENV["SECRET_KEY"];
        $date   = new DateTimeImmutable();
        $expire_at     = $date->modify('+6000 minutes')->getTimestamp(); //modify the date to add 6000 minutes and get the Unix timestamp for the expiration time.

        $domainName = "localhost";
        $username   = $data['email'];                 // Retrieved from filtered POST data
        $request_data = [
            'iat'  => $date->getTimestamp(),         // Issued at: time when the token was generated
            'iss'  => $domainName,                       // Issuer: localhost (this system)
            'nbf'  => $date->getTimestamp(),         // Not before time
            'exp'  => $expire_at,                           // Expiration time
            'userName' => $username,                     // User name
        ];
        $token = JWT::encode($request_data, $secret_key, 'HS512');
        $expires = date("d-m-Y H:i:s", $expire_at);

        return [
            "email" => $username,
            "token" => $token,
            "expires" => $expires
        ];

    }



    /**
     * validates the jwt token from the input data.
     * @param mixed $header contains Jwt token
     * @return array an array that contains the outcome information of validation
     */
    function validateJwt(mixed $header): array
    {

        $response =[
            "successful" => false,
        ] ;

        $len = strlen($header['Authorization']);
        $jwt = substr($header['Authorization'], 7, $len);


        //checks if authorization token is present
        if (!$jwt) {

            $response["successful"] = false;
            return $response;
        }
        $secretKey = $_ENV['SECRET_KEY'];
        try{
            $token = JWT::decode($jwt, new Key($secretKey,'HS512')); //decode jwt authorization token with secret key and HS512 algorithm to get
            //constituent object, and assigns the object to $token
            $now = new DateTimeImmutable();
            $serverName = "localhost";

            //Validate the token's claims: 1. checks if the issuer matches the server name. 2. checks if the token is not valid before the current time.
            //3. checks if the token has expired.
            //If any check fails, set the response to unsuccessful.
            if ($token->iss !== $serverName || $token->nbf > $now->getTimestamp() ||  $token->exp < $now->getTimestamp()){
                $response["successful"] = false;
            }else{
                $response["successful"] = true;
                $response["data"] = $token->userName;
            }
        }catch(Throwable){
            $response["successful"] = false;
        }
        return $response;

    }


?>