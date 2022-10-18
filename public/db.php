<?
  $db_user="user";
  $db_pass=explode("\n", file_get_contents('/home/cantelope/plorgpw'))[0];
  $db_host="localhost";
  $db="scriptpro";
  $maxResultsPerPage = 4;
  $baseURL='scriptpro.dweet.net';
  $baseProtocol = 'https';
  $demoSandbox='demo.dweet.net';
  $baseAssetsURL = 'https://assets.dweet.net';
  $local = false;
	$baseFullURL = ($local ? 'http://' : 'https://') . $baseURL;
  $link = mysqli_connect($db_host, $db_user, $db_pass, $db);
?>


