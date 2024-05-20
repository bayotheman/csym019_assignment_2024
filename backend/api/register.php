<?php
// Allow requests from any origin
header("Access-Control-Allow-Origin: *");

// Allow the following HTTP methods
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");

// Allow the following headers in the request
header("Access-Control-Allow-Headers: Content-Type");


    require_once '/Applications/XAMPP/xamppfiles/htdocs/internet_programming/task2/backend/service/auth-service.php';
    // Decode the JSON data into a PHP associative array
    $jsonData = file_get_contents('php://input');

    $response = register($jsonData); //calls the register function from the auth-service to register new users

    header('Content-Type: application/json; charset-utf-8'); //set the content type of the response being sent to the client in the header.

    echo json_encode($response); //converts the response to json type and display it to the client.[2]

?>
