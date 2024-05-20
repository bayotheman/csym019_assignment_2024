<?php

header("Access-Control-Allow-Origin: *");// Allow requests from any origin

header("Access-Control-Allow-Methods: POST, GET, OPTIONS");// Allow the following HTTP methods


header("Access-Control-Allow-Headers: Content-Type");// Allow the following headers in the request


    require_once '/Applications/XAMPP/xamppfiles/htdocs/internet_programming/task2/backend/service/team-mgt-service.php'; //include team management service file for team management operations

    $jsonData = file_get_contents('php://input');
    $headers = apache_request_headers();


    $response = deleteTeams($headers, $jsonData);

    header('Content-Type: application/json; charset-utf-8');
    echo json_encode($response);
?>