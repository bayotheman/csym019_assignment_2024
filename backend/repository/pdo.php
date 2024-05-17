<?php
require_once '/Applications/XAMPP/xamppfiles/htdocs/internet_programming/task2/backend/vendor/autoload.php';

$dotenv = Dotenv\Dotenv::createImmutable(__DIR__);
$dotenv->load();

//accessing database info from .env file
$host = $_ENV["DB_HOST"];
$user_name = $_ENV["DB_USER"];
$password = $_ENV["DB_PASSWORD"];
$db = $_ENV["DB_NAME"];
//$schema = $_ENV["DB_SCHEMA"];

/**
 * Declare and initialize the pdo object that connects to the database.
 */
global $pdo;
try {
    $pdo = new PDO("mysql:host=$host; dbname=$db;", $user_name, $password,
    [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]);
    $created = date("Y:m:d h:i:s");
} catch (PDOException $e) {
    //handle database connection error
    echo "Error!: " . $e->getMessage() . "<br/>";
}

$current_file  = $_SERVER['SCRIPT_NAME'];
$http_referer = isset($_SERVER['HTTP_REFERER']) ? $_SERVER['HTTP_REFERER'] : "";
/**
 * a helper function that requests the database for information requested in the query object.
 * @param $query- the query to be executed
 * @return mixed return the result obtained from the database
 */

//create this function to avoid calling the $GLOBALS['pdo'] everytime I want to query the database
function executeQuery($query): mixed {
    $stmt = $GLOBALS['pdo']->prepare($query);
    $stmt->execute();
    return $stmt;
}

function executeQueryWithCriteria($query, $criteria): mixed {
    $stmt = $GLOBALS['pdo']->prepare($query);
    $stmt->execute($criteria);
    return $stmt;
}


/**
 * @param $record
 * @return array
 */
//function queryInnerFormatParser($delimiter, $record): array
//{
//    $keys = array_keys($record); //retrieves the key set in the mixed array as an array
//    $values = implode(',', $keys);// join the elements in the keyset seperated by ',' to specify columns to write data to
//    $valuesWithColon = implode($delimiter, $keys);
//    return array($values, $valuesWithColon); //join the elements in the keyset seperated by ',:' to specify placeholders for columns
//}
function queryTextFormatter($delimiter, $record): array
{
    $values = implodeForMixed(',', $record);
    $valuesWithColon = implodeForMixed($delimiter, $record);
    return array($values, $valuesWithColon);
}


function implodeForMixed($separator, $mixed, $values = false): string{
    if($values){
        $keys = array_values($mixed); //retrieves the value set in the mixed array as an associative array
    }else{
        $keys = array_keys($mixed); //retrieves the key set in the mixed array as an associative array
    }
    return implode($separator, $keys);
}

function prepareInsertQuery($table, $record):string{
    list($values, $valuesWithColon) = queryTextFormatter(',:',$record);
    return 'INSERT INTO ' . $table . ' (' . $values . ') VALUES (:' . $valuesWithColon . ')';
}

function prepareLogicalAndWhereClause($criteria):string{
    $values = implodeForMixed(',', $criteria);// join the elements in the keyset seperated by ',' to specify columns to write data to
    $valuesWithColon = implodeForMixed(',:', $criteria);
    return '(' . $values . ' OR ' . $valuesWithColon . ')';
}


//function prepareInsertQueryWithWhereClause($table, $field, $value, $record): string{
//    list($values, $valuesWithColon) = queryInnerFormatParser($record);
//    return 'INSERT INTO ' . $table . ' (' . $values . ') VALUES (:' . $valuesWithColon . ') WHERE '.$field.' = '.$value.' ';
//}

//function prepareWhereQuery($table, $field, $value, $record): string{
//    $keys = array_keys($record);
//    $values = implode(', ', $keys);
//    $valuesWithColon = implode(', :', $keys);
//    return 'INSERT INTO ' . $table . ' (' . $values . ') VALUES (:' . $valuesWithColon . ') WHERE '.$field.' = '.$value.' ';
//}

function insertRecord($table, $record):mixed{
    list($values, $valuesWithColon) = queryTextFormatter(', :',$record);
    $query = 'INSERT INTO ' . $table . ' (' . $values . ') VALUES (:' . $valuesWithColon . ')';
    return executeQueryWithCriteria($query, $record);
}



function updateRecord($table, $record, $where):mixed{
    $keys = array_keys($record);
    return null;
}

//function deleteRecord($table, $where):mixed{}

//delete student record from database and handle ajax request

function deleteRecord($table, $field, $value){
    $query = 'DELETE FROM ' . $table . ' WHERE ' . $field . ' = :value';
    $criteria = [
        'value' => $value
    ];
    return executeQueryWithCriteria($query, $criteria);
}

function update (string $table, $data, $id, string $whereClause)
{
    $setPart = array();
    $criteria = array();

    foreach ($data as $key => $value)
    {
        $setPart[] = "{$key} = :{$key}";
        $criteria[":{$key}"] = $value;
    }

    $criteria[":id"] = $id;

    $query = "UPDATE $table SET ".implode(', ', $setPart)." WHERE $whereClause = :id";
    return executeQueryWithCriteria($query, $criteria);
}


function fetchAllRecords($table){
   $query = 'SELECT * FROM ' . $table ;
   $stmt = executeQuery($query);
   return $stmt->fetchAll();
}


function fetchARecordWithOneWhereClause($table, $field, $value)
{
    $query = 'SELECT * FROM ' . $table . ' WHERE ' . $field . ' = :value';
    $criteria = [
        'value' => $value
    ];
    return executeQueryWithCriteria($query, $criteria);
}

//function fetchARecordWithOneWhereClause($table, $field, $value)
//{
//    $stmt = $GLOBALS['pdo']->prepare('SELECT * FROM ' . $table . ' WHERE ' . $field . ' = :value');
//    echo "statement: " . json_encode($stmt);
//    $criteria = [
//        'value' => $value
//    ];
//    $stmt->execute($criteria);
//    echo "statement: " . json_encode($stmt);
//    return $stmt;
//}


?>
