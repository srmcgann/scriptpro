<?

  require('config.php');

  if(!($dict_hdl = fopen(dirname(__FILE__) . "/$dictfile", 'r'))) die();
  $dictwords = [];
  while($dictwords[] = trim(str_replace("\n", '', fgets($dict_hdl))));
  $dictwords = array_filter($dictwords);

  function cmp($a, $b){
    return $a['perc'] < $b['perc'];
  }

  function checkWord($word){
    global $caps_master, $enforce_caps, $dictwords, $max_hit_size, $target_similarity;
    $hits = [];
    forEach($dictwords as $dictword){
      if(strtoupper($word) === strtoupper($dictword)){
        return $enforce_caps && $caps_master == 'dict' ? $dictword : $word;
      }
      if(sizeof($hits) < $max_hit_size){
        $perc = 1 - levenshtein(strtoupper($word), strtoupper($dictword)) / max(strlen($word), strlen($dictword));
        if($perc > $target_similarity){
          $hits[] = ['word' => $dictword, 'perc' => $perc];
        }
      }
    }
    if(sizeof($hits)){
      $hits = array_filter($hits);
      usort($hits, 'cmp');
      return $hits[0]['word'];
    }else{
      return $word;
    }
  }

  function tokenize($str){
    $ret = [];
    $fpos = -1;
    $ar = str_split($str);
    $token = '';
    $ct = 0;
    for($i=0; $i<sizeof($ar); ++$i){
      $code = ord($ar[$i]);
      $good = true;
      if(strlen($token) && !ctype_alpha($ar[$i]) && !ctype_digit($ar[$i]) && $ar[$i] != '_' && $ar[$i]){
        $correction = checkWord($token);
        $ret[] = ['token' => $token, 'correction' => $correction, 'pos'=> $fpos, 'olen' => $ct-$fpos];
        $token = '';
        $fpos = -1;
      }else{
        if(ctype_alpha($ar[$i])){
          $token .= $ar[$i];
          if($fpos === -1){
            $fpos = $ct = $i;
          }else{
            $ct++;
          }
        }
      }
    }
    $correction = checkWord($token);
    if(strlen($token)) $ret[] = ['token' => $token, 'correction' => $correction, 'pos' => $fpos, 'olen' => $ct-$fpos];
    return $ret;
  }

  require('../db.php');
  if(isset($_GET['i'])) $text = urldecode($_GET["i"]);
  if(!isset($text)){
    $data = json_decode(file_get_contents('php://input'));
    if($data) $text = $data->{'text'};
  }
  if(isset($text)){
    $input_mode = 'php';
  }else{
    $input = $argv;
    $text = '';
    if(sizeof($input)<2){
      while($val = fgets(STDIN)){
        $text .= $val;
      };
      $input_mode = 'STDIN';
    }else{
      array_shift($input);
      $text = implode(' ', $input);
      $input_mode = 'argv';
    }
  } 

  $words = tokenize($text);
  //forEach($words as $word){
  //  echo $word['token'] . "\n";
  //}

  $data = str_split($text);
  for($i = 0; $i<sizeof($data); ++$i){
    $idx = array_search($i, array_column($words, 'pos'));
    if($idx !== false){
      if($enforce_caps){
        if(strlen($words[$idx]['correction']) === strlen($words[$idx]['token'])){
          for($j=0; $j<strlen($words[$idx]['token']); ++$j){
            if(ctype_upper($caps_master == 'dict' ? $words[$idx]['correction'][$j] : $words[$idx]['token'][$j])){
              echo strtoupper($words[$idx]['correction'][$j]);
            }else{
              echo strtolower($words[$idx]['correction'][$j]);
            }
          }
        }else{
          echo $words[$idx]['correction'];
        }
      }else{
        echo strtolower($words[$idx]['correction']);
      }
      $i += $words[$idx]['olen'];
    }else{
      echo $data[$i];
    }
  }

  if($input_mode === 'argv') echo "\n";
?>
