<?
  require('db.php');
  $data = json_decode(file_get_contents('php://input'));
  $tokens = $data;
  foreach($tokens as $token){
    if($token->{'stale'}){
      $check = str_replace('"', "\"", $token->{'token'});
      $token->{'correction'} = explode("\n", shell_exec("autosyntax \"$check\""))[0];
      $token->{'stale'} = false;
    }
  }
  echo json_encode([true, $tokens]);
?>
