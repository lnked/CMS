<?
/**
* Face detection
*
*
* @param $image string should be the path to your jpeg
*
* @return string xml output of my api
*
* @author andreas beder <office@codejungle.org>
* @license http://opensource.org/licenses/gpl-license.php GNU Public License
**/

function face_detection($image){

    $data = array("face" => "@".$image);
    $Curl_Session = curl_init("http://www.codejungle.org/api/face.php");
    curl_setopt ($Curl_Session, CURLOPT_POST, 1);
    curl_setopt ($Curl_Session, CURLOPT_POSTFIELDS, $data);
    curl_setopt ($Curl_Session, CURLOPT_FOLLOWLOCATION, 1);
    curl_setopt ($Curl_Session, CURLOPT_RETURNTRANSFER, 1);
    $response=curl_exec($Curl_Session);
    curl_close ($Curl_Session);
    return $response;
}
