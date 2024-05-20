<?php
    use Firebase\JWT\JWT;
    use Firebase\JWT\Key;


    function generateJwtToken($data): array
    {
        $secret_key  = $_ENV["SECRET_KEY"];
        $date   = new DateTimeImmutable();
        $expire_at     = $date->modify('+6000 minutes')->getTimestamp();

        $domainName = "localhost";
        $username   = $data['email'];                 // Retrieved from filtered POST data
        $request_data = [
            'iat'  => $date->getTimestamp(),         // Issued at: time when the token was generated
            'iss'  => $domainName,                       // Issuer
            'nbf'  => $date->getTimestamp(),         // Not before
            'exp'  => $expire_at,                           // Expire
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

        // echo "inside validate jwt ";
        $len = strlen($header['Authorization']);
        $jwt = substr($header['Authorization'], 7, $len);

        if (!$jwt) {
            $response["successful"] = false;
            return $response;
        }
        $secretKey = $_ENV['SECRET_KEY'];
        try{
            $token = JWT::decode($jwt, new Key($secretKey,'HS512'));
            $now = new DateTimeImmutable();
            $serverName = "localhost";
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