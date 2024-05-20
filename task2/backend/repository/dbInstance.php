<?php
ob_start(); // turn on output buffering to prevent headers from being sent before the script is ready
session_start(); // start a new session or resume the existing session
require 'pdo.php'; // include the PDO configuration file which contains database connection setup
?>

