<?php
/**
 * This module handles team management functions such as:
 * <li>creating new team(s)</li>
 * <li>reading team information</li>
 * <li>deleting team(s)</li>
 * @author Adebayo .A. Okutubo
 */
    require_once "backend/repository/dbInstance.php";

    global $table;
    $table = "club";

    global $response;

    $response = [
        "successful" => false,
        "message" => "operation failed!"
    ];

    function addTeam($jsonData): array{
        $tblName = $GLOBALS["tblName"];

        $response = [
            "successful" => false
        ];

        try{
            $data = json_encode($jsonData);
            //input field validation: check that compulsory fields are not empty.
            if(isValidTeam($data)){
                //checks if user already exist
                $result = fetchARecordWithOneWhereClause($tblName, "name",$data["name"]);

                if($result->rowCount() > 0){
                    $response['message'] = "Team already exists";
                    return $response;
                }

                $data = [
                    "id" => uniqid(),
                    "name" =>$data["name"],
                    "city" =>$data["city"],
                    "manager" => $data["manager"],
                    "established" => $data["established"],
                    "president" => $data["president"],
                    "noOfTrophies" => $data["noOfTrophies"],
                    "played" => $data["played"],
                    "won" => $data["won"],
                    "drawn" => $data["drawn"],
                    "lost" => $data["lost"],
                    "gf" => $data["gf"],
                    "against" => $data["against"],
                    "points" => $data["points"],
                    "dateCreated" => date("Y/m/d h:i:s"),
                    "dateModified" => date("Y/m/d h:i:s")
                ];

                $result = insertRecord($tblName, $data);

                if($result){
                    $response['successful'] = true;
                    $response['message'] = "registration successful";
                }
            }
            else{
                $response['message'] = "Fields can't be empty";
            }
        }catch(Throwable $th){
            $response['message'] = $th->getMessage();
        }
        return $response;
    }



    function isValidTeam($data){
        $name = $data["name"];
        $city = $data["city"];
        $manager = $data["manager"];
        $established = $data["established"];
        $president = $data["president"];
        $noOfTrophies = $data["noOfTrophies"];
        $played = $data["played"];
        $won = $data["won"];
        $drawn = $data["drawn"];
        $lost = $data["lost"];
        $gf = $data["gf"];
        $against = $data["against"];
        $gd = $data["gd"];
        $points = $data["points"];

        return ((!empty($name)) && (!empty($manager)) && (!empty($played)) && (!empty($won)) &&
            (!empty($drawn)) && (!empty($lost)) && (!empty($gf)) && (!empty($against)) &&
            (!empty($gd)) && (!empty($points)));
    }


    function updateTeam($jsonData){
        $tblName = $GLOBALS["tblName"];
    }

    function deleteTeam($jsonData){
        $tblName = $GLOBALS["tblName"];
    }

    function fetchAllTeams($header)
    {

    }

?>
