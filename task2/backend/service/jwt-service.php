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
     * @param mixed $data contains Jwt token
     * @return bool an array that contains the outcome information of validation
     */
    function validate_jwt(mixed $data): bool
    {
        // echo "inside validate jwt ";
        $len = strlen($data['Authorization']);
        $jwt = substr($data['Authorization'], 7, $len);

        if (!$jwt) {
            return false;
        }
        $secretKey = $_ENV['SECRET_KEY'];
        try{
            $token = JWT::decode($jwt, new Key($secretKey,'HS512'));
            $now = new DateTimeImmutable();
            $serverName = "localhost";
            if ($token->iss !== $serverName || $token->nbf > $now->getTimestamp() ||  $token->exp < $now->getTimestamp()){
                return false;
            }
        }catch(Throwable){
           return false;
        }
        return true;

    }

function transform_user_data($data): array{
    return [
        "id" => $data['id'],
        "firstName" =>$data['firstName'],
        "lastName" =>$data['lastName'],
        "email" =>$data['email'],
        "organization" => $data['organization'],
        "phone" => $data['phone'],
        "address" => $data['address'],
        "country" => $data['country'],
        "city" => $data['city'],
        "state" => $data['state'],
        "postcode" => $data['postcode'],
        "role" =>$data['role'],
        "createdBy"=>$data['createdBy'],
        "dateCreated" => $data['dateCreated'],
        "dateModified" => $data['dateModified']
    ];

}
?>