<?php
$ipAddress = $_GET['ipAddress'];
if(!isset($ipAddress)){
    $ipAddress = "216.125.253.212";
}

$url = 'http://' . $ipAddress . '/Eniscope/?meterId[]=all&'.time();
$json = file_get_contents($url);
?>
<?php echo $json ?>
