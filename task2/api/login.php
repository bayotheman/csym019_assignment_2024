<?php
    require_once 'service/auth-service.php';
    // Decode the JSON data into a PHP associative array
    $jsonData = file_get_contents('php://input');

    $response = [
        "successful" => false,
    ];

    if($jsonData != null){
        $data = json_decode($jsonData, true);
        $result = login($data);
        if($result['successful'] === true){
            $response['successful'] = true;
            $response['data'] = $result['data'];
        }
        $response['message'] = $result['message'];
    }

    header('Content-Type: application/json; charset-utf-8');
    echo json_encode($response);
?>

