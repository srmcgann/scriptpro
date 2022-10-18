<?
  require('db.php');
  $data = json_decode(file_get_contents('php://input'));
  $success = false;
  $ret = '';
  $tokens = mysqli_real_escape_string($link, $data->{'tokens'});
  if(strlen($tokens)){
    $check = str_replace("'", "\'", $tokens);
    $ret = shell_exec("echo '$check' | autosyntax");
    $success = true;
  }
  echo json_encode([$success, $ret]);
?>
