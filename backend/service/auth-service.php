<?php
/**
 * This module handles user onboarding and authentication functions such as:
 * <li>creating user account</li>
 * <li>user login</li>
 * <li>authentication mechanism</li>
 * @autor Adebayo .A. Okutubo
 */

require_once '/Applications/XAMPP/xamppfiles/htdocs/internet_programming/task2/backend/service/jwt-service.php';


require_once '/Applications/XAMPP/xamppfiles/htdocs/internet_programming/task2/backend/repository/dbInstance.php';


global $response; //declares the global variable $response
global $tblName; //declares the global variable $tblName(table name)

$response = [
    "successful" => false,
    "message" => "operation failed!"
]; // initializes the $response array with default values indicating failure

$tblName = "staff";// set the table name to "staff"

/**
 * Validates account information passed is valid and generates access token
 * @param $jsonData - account information (username and password)
 * @return array - response information with access token
 */
function login($jsonData): array
{
    $response = [
        "successful" => false,
        "message" => "login failed!"
    ];

    try {
        $data = json_decode($jsonData, true);// decode the JSON data into a PHP array

        // extract email and password from the data array
        $emailAddress = $data['email'];
        $password = $data['password'];

        // validation: Checks if both email and password are not empty
        if ((!empty($emailAddress)) && (!empty($password))) {

            $tblName = $GLOBALS['tblName'];// get the table name from the global scope

            $result = fetchARecordWithOneWhereClause($tblName, 'email', $emailAddress);

            // if no record is found, return the response indicating failure
            if (!$result) {
                return $response;
            }


            $data = $result->fetch();

            $hashedPassword = $data['pword'];

            //password verification: verify the provided password against the hashed password
            if (password_verify($password, $hashedPassword)) {


                $response["message"] = "login successful";
                $response["data"] = generateJwtToken($data);// generate a JWT token and add it to the response data

                $response["successful"] = true;

            } else {
                $response["message"] = "incorrect email or password";

            }
        }
    } catch (Throwable $th) {
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
    $tblName = $GLOBALS["tblName"]; // get the table name from the global scope

    // initialize the response array with default registration failure
    $response = [
        "successful" => false
    ];


    try {
        $data = json_decode($jsonData, true);// decode the JSON data into a PHP array

        // extract user information from the data array
        $fname = $data['firstName'];
        $lname = $data["lastName"];
        $email = $data["email"];
        $password = $data["password"];
        $confirmPassword = $data["confirmPassword"];

        // input field validation: check that compulsory fields are not empty
        if ((!empty($email)) && (!empty($password)) && (!empty($confirmPassword)) && (!empty($fname)) && (!empty($lname))) {
            // check password is consistent
            if (!($password === $confirmPassword)) {
                // if passwords do not match, set the message and return the response
                $response['message'] = "Inconsistent Password";
                return $response;
            }

            // check if user already exists
            $result = fetchARecordWithOneWhereClause($tblName, "email", $email);
            if ($result->rowCount() > 0) {
                // if a record with the provided email exists, set the message and return the response
                $response['message'] = "User already exists";
                return $response;

            }

            $hashedPassword = hashPassword($password);
            $id = uniqid();// generate a unique ID for the user

            $data = [
                "id" => $id,
                "firstName" => $fname,
                "lastName" => $lname,
                "email" => $email,
                "pword" => $hashedPassword,
                "dateCreated" => date("Y/m/d h:i:s"),
                "dateModified" => date("Y/m/d h:i:s")
            ];


            $result = insertRecord($tblName, $data);

            if ($result) {
                // if the insert is successful, set the response to indicate success
                $response['successful'] = true;
                $response['message'] = "registration successful";

            }
        } else {
            $response['message'] = "Fields can't be empty";
        }
    } catch (Throwable $th) {
        $response['message'] = $th->getMessage();
    }
    return $response;
}

/**
 * a wrapper function that uses bcrypt algorithm to hash string text(usually password).
 * @param $pass - password to be hashed
 * @return string hashed password string
 */
function hashPassword($pass): string
{
    return password_hash($pass, PASSWORD_DEFAULT);

}

?>

