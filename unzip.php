<?php
$zip = new ZipArchive;
$res = $zip->open('out.zip');
if ($res === TRUE) {
  $zip->extractTo('./');
  $zip->close();
  echo 'SUCCESS';
} else {
  echo 'FAILED';
}
unlink('out.zip');
unlink('unzip.php');
?>
