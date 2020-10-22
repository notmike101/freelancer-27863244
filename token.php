<?php
  require_once(__DIR__.'/vendor/autoload.php');
  
  $dotenv = Dotenv\Dotenv::createImmutable(__DIR__);
  $dotenv->load();

  $ch = curl_init();
  $apiKey = $_ENV['APIKEY'];

  curl_setopt(
    $ch,
    CURLOPT_URL,
    "https://iam.bluemix.net/identity/token?grant_type=urn:ibm:params:oauth:grant-type:apikey&apikey=$apiKey&response_type=cloud_iam"
  );
  curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
  curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'POST');

  $result = curl_exec($ch);
  if (curl_errno($ch)) {
    echo 'Error: '.curl_error($ch);
  } else {
    echo $result;
  }

  curl_close($ch);
?>
