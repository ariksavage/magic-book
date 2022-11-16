<?php
error_reporting(E_ALL);
$root = '../../../assets/Library';

function get_dir_contents($root, $root_sub = null){
  $dirs = scandir($root);
  $items = Array();
  foreach($dirs as $dir){
    if ($dir[0] !== '.'){
      $item = new stdClass();
      $item->name = $dir;
      $path = $root . '/' . $dir;
      if (is_dir($path)){
        $item->children = get_dir_contents($path);
      }
      if ($rooot_sub){
        $path = str_replace($root, $root_sub, $path);
      }
      $item->path =  $path;

      $items[] = $item;
    }
  }
  return $items;
}

$library = get_dir_contents($root, './src/assets/Library/');
header('Content-Type: application/json');
echo json_encode($library, JSON_PRETTY_PRINT);
?>
