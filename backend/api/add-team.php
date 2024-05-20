<?php

// Allow requests from any origin
header("Access-Control-Allow-Origin: *");

// Allow the following HTTP methods
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");

// Allow the following headers in the request
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");


    require_once '/Applications/XAMPP/xamppfiles/htdocs/internet_programming/task2/backend/service/team-mgt-service.php';

    // Decode the JSON data into a PHP associative array
    $jsonData = file_get_contents('php://input');
    $headers = apache_request_headers();

    $response = addTeam($jsonData, $headers); //calls the add team function from the team-mgt-service to add a new team

    header('Content-Type: application/json; charset-utf-8');
    echo json_encode($response);
?>
