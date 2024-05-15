<?php
/**
 * This module handles user onboarding and authentication functions such as:
 * <li>creating user account</li>
 * <li>user login</li>
 * <li>authentication mechanism</li>
 * @author Adebayo .A. Okutubo
 */


    global $response;
    global $tblName;

    $response = [
        "successful" => false,
        "message" => "operation failed!"
    ];

    $tblName = "staff";

    /** validates account information passed is valid and generates access token
     * @param $request - account information (username and password)
     * @return array - response information
     */
    function login($jsonData): array
    {
        $response = [
            "successful" => false,
            "message" => "login failed!"
        ];

        try{
            $data = json_decode($jsonData, true);
            $emailAddress = $data['email'];
            $password = $data['password'] ;

            if((!empty($emailAddress)) && (!empty($password))){
                $tblName = $GLOBALS['tblName'];
                $result =fetchARecordWithOneWhereClause($tblName, 'email', $emailAddress);
                if(!$result){
                    return $response;
                }
                $data = $result->fetch();
                $hashedPassword = $data['pword'];

                if(password_verify($password, $hashedPassword)){
                    $response["successful"] = true;
                    $response["message"] = "login successful";
                    $response["data"] = generateJwtToken($data);
                }

            }
        }catch(Throwable $th){
            $response["message"] = $th->getMessage();
        }
        return $response;
    }

    /**
     * Registers user information into the system's database
     * @param $request - user information
     * @return array - response information
     */
    function register($jsonData): array
    {
        $tblName = $GLOBALS["tblName"];

        $response = [
            "successful" => false
        ];

        try{
            $data = json_encode($jsonData);

            $fname = $data["firstName"];
            $lname = $data["lastName"];
            $email = $data["email"];
            $password = $data["password"];
            $confirmPassword = $data["confirmPassword"];

            //input field validation: check that compulsory fields are not empty.
            if((!empty($email)) && (!empty($password)) && (!empty($fname)) && (!empty($lname))){
                //check password is consistent
                if(!($password === $confirmPassword)){
                    $response['message'] = "Inconsistent Password";
                    return $response;
                }

                //checks if user already exist
                $result = fetchARecordWithOneWhereClause($tblName, "email",$email);

                if($result->rowCount()> 0){
                    $response['message'] = "User already exists";
                    return $response;
                }
                $hashedPassword = hashPassword($password);
                $id = uniqid();

                $data = [
                    "id" => $id,
                    "firstName" =>$fname,
                    "lastName" =>$lname,
                    "email" =>$email,
                    "pword" => $hashedPassword,
                    "dateCreated" => date("Y/m/d h:i:s"),
                    "dateModified" => date("Y/m/d h:i:s")
                ];

                $result = insertRecord($tblName, $data);

                if($result){
                    $response['successful'] = true;
                    $response['message'] = "registration successful";
                }
            }
            else{
                $response['message'] = "Fields can't be empty";
            }
        }catch(Throwable $th){
            $response['message'] = $th->getMessage();
        }
        return $response;
    }

    function hashPassword($pass): string
    {
        return password_hash($pass, PASSWORD_DEFAULT);
    }


?>
