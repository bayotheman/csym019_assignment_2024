<?php

header("Access-Control-Allow-Origin: *");// allow requests from any origin


header("Access-Control-Allow-Methods: POST, GET, OPTIONS"); // allow the following HTTP methods


header("Access-Control-Allow-Headers: Content-Type"); // allow the following headers in the request



require_once '/Applications/XAMPP/xamppfiles/htdocs/internet_programming/task2/backend/service/team-mgt-service.php';// include the team management service file

    $jsonData = file_get_contents('php://input');// decode the JSON data into a PHP associative array
    $headers = apache_request_headers(); // get all request headers



$response = updateTeam($jsonData, $headers); // call the updateTeam function with the JSON data and headers, storing the response


header('Content-Type: application/json; charset-utf-8');// set the content type of the response to JSON with UTF-8 encoding

echo json_encode($response);// encode the response array as a JSON string and output it

?>