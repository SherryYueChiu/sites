 <?php
 header("Access-Control-Allow-Origin: *");
 header("Access-Control-Allow-Methods:*");
 header("Access-Control-Allow-Headers:x-requested-with,content-type");
 $URL = $_GET["URL"];
 echo file_get_contents($URL);
?>
