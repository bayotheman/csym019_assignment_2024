<?php
/**
 * This module handles user onboarding and authentication functions such as:
 * <li>creating user account</li>
 * <li>user login</li>
 * <li>authentication mechanism</li>
 * @author Adebayo .A. Okutubo
 */

    global $response;

    $response = [
        "successful" => false,
        "message" => "operation failed!"
    ];

    /** validates account information passed is valid and generates access token
     * @param $request - account information (username and password)
     * @return mixed - response information
     */
    function login($request){

        //TODO: implement logic
        return $GLOBALS["response"];
    }

    /**
     * Registers user information into the system's database
     * @param $request - user information
     * @return mixed - response information
     */
    function register($request){
        return $GLOBALS["response"];
    }


?>
