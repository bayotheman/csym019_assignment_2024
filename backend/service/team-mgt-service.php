<?php
/**
 * This module handles team management functions such as:
 * <li>creating new team(s)</li>
 * <li>reading team information</li>
 * <li>deleting team(s)</li>
 * @author Adebayo .A. Okutubo
 */
    require_once "/Applications/XAMPP/xamppfiles/htdocs/internet_programming/task2/backend/repository/dbInstance.php";
    require_once "/Applications/XAMPP/xamppfiles/htdocs/internet_programming/task2/backend/service/jwt-service.php";

    global $tblName;
    $tblName = "club";

    global $response;

    $response = [
        "successful" => false,
        "message" => "operation failed!"
    ];

    function addTeam($jsonData, $header): array{
        $tblName = $GLOBALS["tblName"];

        $response = [
            "successful" => false
        ];

        try{
            $validate = validateJwt($header);
            if(!$validate["successful"]){
                $response['message'] ="Unauthorized access";
                return $response;
            }
            $user = $validate["data"];
            $data = json_decode($jsonData, true);
            //input field validation: check that compulsory fields are not empty.
            if(isValidTeam($data)){
                //checks if user already exist
//                echo "name: ".$data["name"]."<br>";
//                echo "user: ".$user."<br>";
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
                    "gd" => ($data["gf"] - $data["against"]),
                    "against" => $data["against"],
                    "points" => $data["points"],
                    "createdBy" => $user,
                    "modifiedBy" => $user,
                    "dateCreated" => date("Y/m/d h:i:s"),
                    "dateModified" => date("Y/m/d h:i:s")
                ];
//                echo "data: ".json_encode($data)."\n";
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

        return ((!empty($name)) && (!empty($manager)) && (!is_null($played)) && (!is_null($won)) &&
            (!is_null($drawn)) && (!is_null($lost)) && (!is_null($gf)) && (!is_null($against)) && (!is_null($points)));
    }


    function updateTeam($jsonData, $header): array
    {
        $tblName = $GLOBALS["tblName"];

        $response = [
            "successful" => false
        ];

        try{
            $validate = validateJwt($header);
            if(!$validate["successful"]){
                $response['message'] ="Unauthorized access";
                return $response;
            }
            $user = $validate["data"];
            $data = json_decode($jsonData, true);
            //input field validation: check that compulsory fields are not empty.
            if(!empty($data["name"])){
                $result = fetchARecordWithOneWhereClause($tblName, "name",$data["name"]);

                if($result->rowCount() == 0){
                    $response['message'] = "Team doesn't exist";
                    return $response;
                }

                $dbData["name"] = $data["name"];
                $dbData["dateModified"] = date("Y/m/d h:i:s");
                $dbData["modifiedBy"] = $user;

                if(!is_null($data["city"])){
                    $dbData["city"] = $data["city"];
                }
                if(!is_null($data["manager"])){
                    $dbData["manager"] = $data["manager"];
                }
                if(!is_null($data["president"])){
                    $dbData["president"] = $data["president"];
                }
                if(!is_null($data["noOfTrophies"])){
                    $dbData["noOfTrophies"] = $data["noOfTrophies"];
                }
                if(!is_null($data["played"])){
                    $dbData["played"] = $data["played"];
                }
                if(!is_null($data["won"])){
                    $dbData["won"] = $data["won"];
                }
                if(!is_null($data["drawn"])){
                    $dbData["drawn"] = $data["drawn"];
                }
                if(!is_null($data["lost"])){
                    $dbData["lost"] = $data["lost"];
                }
                if(!is_null($data["gf"])){
                    $dbData["gf"] = $data["gf"];
                }
                if(!is_null($data["against"])){
                    $dbData["against"] = $data["against"];
                }
                if(!is_null($data["points"])){
                    $dbData["points"] = $data["points"];
                }

//                echo "data: ".json_encode($data)."\n";
                $result = update($tblName, $dbData, $dbData["name"], "name");

                if($result){
                    $response['successful'] = true;
                    $response['message'] = "successfully updated";
                }
            }
            else{
                $response['message'] = "id can't be empty";
            }
        }catch(Throwable $th){
            $response['message'] = $th->getMessage();
        }
        return $response;

    }

    function deleteTeam($headers): array
    {
        $response = [
            "successful" => false
        ];
        $validate = validateJwt($headers);
        if(!$validate["successful"]){
            $response['message'] ="Unauthorized access";
            return $response;
        }

        $tblName = $GLOBALS["tblName"];
        $id = $headers["id"];
        if(empty($id)){
            $response['message'] ="invalid id specified";
            return $response;
        }
        try{
            $result = fetchARecordWithOneWhereClause($tblName, "name",$id);
            if($result->rowCount() == 0){
                $response['message'] = "Team doesn't exist";
                return $response;
            }
            $result = deleteRecord($tblName, "name", $id);
            if($result){
                $response["successful"] = true;
                $response["message"] = "Successful deleted";
            }

        }catch (Throwable $th){
            $response['message'] = $th->getMessage();
        }

        return $response;
    }

    function fetchAllTeams($header): array
    {
        $response =[
            "successful" => false
        ];
        $validate = validateJwt($header);
        if(!$validate["successful"]){
            $response['message'] ="Unauthorized access";
            return $response;
        }
        $tblName = $GLOBALS["tblName"];
        try{
//            echo "fetching records";
            $result = fetchAllRecords($tblName);
//            echo "result: ".json_encode($result ) ."<br/>";
            $users = $result;
//            $users = $result->f;
            $data = [];
            for($i=0; $i <sizeof($users); $i++){
                $user = transform_user_data($users[$i]);
                array_push($data, $user);
            }
            $response["successful"] = true;
            $response["message"] = "Successful";
            $response["data"] = $data;
        }catch (Throwable $th){
            $response['message'] = $th->getMessage();
        }

        return $response;

    }

    function transform_user_data($data): array{
        return [
            "id" => $data['id'],
            "name" =>$data['name'],
            "city" =>$data['city'],
            "manager" =>$data['manager'],
            "president" => $data['president'],
            "noOfTrophies" => $data['noOfTrophies'],
            "established" => $data['established'],
            "played" => $data['played'],
            "won" => $data['won'],
            "drawn" => $data['drawn'],
            "lost" => $data['lost'],
            "gf" =>$data['gf'],
            "ga"=>$data['against'],
            "gd" => $data['gd'],
            "points" => $data['points'],
            "createdBy" => $data['createdBy'],
            "dateCreated" => $data['dateCreated'],
            "modifiedBy" => $data['modifiedBy'],
            "dateModified" => $data['dateModified']
        ];

    }

?>
