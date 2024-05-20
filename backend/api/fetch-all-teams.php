<?php

// Allow requests from any origin
header("Access-Control-Allow-Origin: *");

// Allow the following HTTP methods
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");

// Allow the following headers in the request
header("Access-Control-Allow-Headers: Content-Type,  Authorization");


    require_once '/Applications/XAMPP/xamppfiles/htdocs/internet_programming/task2/backend/service/team-mgt-service.php';

    $headers = apache_request_headers();// retrieves the contents of the request header.

    $response = fetchAllTeams($headers);

    header('Content-Type: application/json; charset-utf-8');
    echo json_encode($response);
?>