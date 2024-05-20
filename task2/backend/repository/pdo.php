<?php

/**
 * a module that provides database access functionalities such as inserting, updating, reading and deleting a record(s).
 */

require_once '/Applications/XAMPP/xamppfiles/htdocs/internet_programming/task2/backend/vendor/autoload.php';// Include Composer's autoloader, which will automatically load required classes


$dotenv = Dotenv\Dotenv::createImmutable(__DIR__);// Create a Dotenv instance to handle environment variables, ensuring they are immutable

$dotenv->load();// Load the environment variables from the .env file


// Accessing database info from .env file
$host = $_ENV["DB_HOST"];
$user_name = $_ENV["DB_USER"];
$password = $_ENV["DB_PASSWORD"];
$db = $_ENV["DB_NAME"];
/**
 * Declare and initialize the PDO object that connects to the database.
 */
global $pdo; // Declare a global variable to hold the PDO instance
try {
    $pdo = new PDO("mysql:host=$host; dbname=$db;", $user_name, $password, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
    ]);// Create a new PDO instance for MySQL with the specified host, database name, user, and password.

} catch (PDOException $e) {// Handle database connection error

    echo "Error!: " . $e->getMessage() . "<br/>";// Print the error message

}


/**
 * A helper function to execute a query without a criteria.
 * @param $query - The query to be executed
 * @return mixed - Return the result obtained from the database
 */
function executeQuery($query): mixed
{

    $stmt = $GLOBALS['pdo']->prepare($query);

    $stmt->execute();

    return $stmt;

}


/**
 * A helper function to execute a query with criteria
 * @param $query - query to be executed
 * @param $criteria - criteria for query execution
 * @return mixed - the statement object
 */
function executeQueryWithCriteria($query, $criteria): mixed {

    $stmt = $GLOBALS['pdo']->prepare($query);

    $stmt->execute($criteria);

    return $stmt;

}

/**
 * Function that formats a record for a query by creating comma-seperated and delimiter-seperated values with delimiters.
 * @param $delimiter - separator to be used for processing
 * @param $record - the record to be formated
 * @return array containing both comma-seperated string and delimiter-seprated string
 */
function queryTextFormatter($delimiter, $record): array {

    $values = implodeForMixed(',', $record);// Convert the record to a comma-separated string

    $valuesWithColon = implodeForMixed($delimiter, $record);// Convert the record to a delimiter-separated string

    return array($values, $valuesWithColon); // Return both formatted strings as an array

}


/**
 * a function that joins elements of an array with a separator, optionally using keys or values
 * @param $separator - seperator value used to join the elements of the array
 * @param $mixed - the array
 * @param $values - optional true or false value to determine if the key or value array of the mixed array should be used. defaults to false
 * @return string separator separated string.
 */
function implodeForMixed($separator, $mixed, $values = false): string {

    if ($values) {
        $keys = array_values($mixed);// Get the values of the array if $values is true

    } else {
        $keys = array_keys($mixed);// Get the keys of the array if $values is false

    }
    return implode($separator, $keys); // Join the elements with the specified separator and return the string

}

/**
 * Inserts a record into a table
 * @param $table - table name
 * @param $record - record to be inserted
 * @return mixed - array containing the result of the output records
 */

function insertRecord($table, $record): mixed {

    list($values, $valuesWithColon) = queryTextFormatter(', :', $record);// Format the record into values and values with colons

    $query = 'INSERT INTO ' . $table . ' (' . $values . ') VALUES (:' . $valuesWithColon . ')';

    return executeQueryWithCriteria($query, $record);
}

/**
 * Delete a record from a table based on a column and value
 * @param $table - table name
 * @param $column - column name
 * @param $value - associated column value
 * @return mixed  array containing the result of the output records
 */
function deleteRecord($table, $column, $value): mixed
{
    //
    $query = 'DELETE FROM ' . $table . ' WHERE ' . $column . ' = :value';

    $criteria = ['value' => $value];

    return executeQueryWithCriteria($query, $criteria);

}


/**
 * Updates a record in a table
 * @param string $table table name
 * @param $data input data to add to record
 * @param $id - record identifier value
 * @param string $whereClause - column name of the record identifier
 * @return mixed array containing the result of the output records
 */
function update(string $table, $data, $id, string $whereClause) {

    $setPart = array();// Initialize an array to hold the set part of the query

    $criteria = array(); // Initialize an array to hold the criteria


    foreach ($data as $key => $value) {// Loop through each data item

        $setPart[] = "{$key} = :{$key}"; // Add each key-value pair to the set part array

        $criteria[":{$key}"] = $value; // Add each key-value pair to the criteria array

    }

    $criteria[":id"] = $id;


    $query = "UPDATE $table SET " . implode(', ', $setPart) . " WHERE $whereClause = :id";

    return executeQueryWithCriteria($query, $criteria);

}

/**
 * fetches all records from a table
 * @param $table - table name
 * @return mixed an array of all records.
 */
function fetchAllRecords($table): mixed{

    $query = 'SELECT * FROM ' . $table;

    $stmt = executeQuery($query);

    return $stmt->fetchAll();

}

/**
 * fetches a record from a table based on the value of a colummn
 * @param $table - table name
 * @param $column - column name
 * @param $value - column value
 * @return mixed array containing the result of the output records
 */
function fetchARecordWithOneWhereClause($table, $column, $value): mixed {

    $query = 'SELECT * FROM ' . $table . ' WHERE ' . $column . ' = :value';

    $criteria = ['value' => $value];

    return executeQueryWithCriteria($query, $criteria);
}

?>

