 <?php
 header("Access-Control-Allow-Origin: *");
 $URL = $_GET["URL"];
 echo file_get_contents($URL);

?>
