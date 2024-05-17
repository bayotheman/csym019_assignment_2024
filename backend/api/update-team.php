<?php

// Allow requests from any origin
header("Access-Control-Allow-Origin: *");

// Allow the following HTTP methods
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");

// Allow the following headers in the request
header("Access-Control-Allow-Headers: Content-Type");

// Respond to preflight requests
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

    require_once '/Applications/XAMPP/xamppfiles/htdocs/internet_programming/task2/backend/service/team-mgt-service.php';
    // Decode the JSON data into a PHP associative array
    $jsonData = file_get_contents('php://input');
    $headers = apache_request_headers();


    $response = updateTeam($jsonData, $headers);

    header('Content-Type: application/json; charset-utf-8');
    echo json_encode($response);
?>