<?php

    require_once 'backend/service/team-mgt-service.php';
    // Decode the JSON data into a PHP associative array
    $jsonData = file_get_contents('php://input');

    $response = updateTeam($jsonData);

    header('Content-Type: application/json; charset-utf-8');
    echo json_encode($response);
?>