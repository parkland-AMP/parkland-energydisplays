<?php
$url = 'http://216.125.253.212/Eniscope/?meterId[]=all&'.time();
$json = file_get_contents($url);
?>
<?php echo $json ?>
