<?php
  require_once __DIR__ . '/php-graph-sdk-5.0.0/src/Facebook/autoload.php';

  use Facebook\FacebookRequest;

  $access_token = 'EAADstsKuf0MBAO67Hm3DRV5bUx34NzfZAcrSPXid0Eky1ZAMin7YoamWnusmRj7mxF7Ns3J8Au1qNL11iDQCx7Fp4RFZADbXskaszqwCTXwmMQoIpO74FlODxtKPviXbUxHxKMnaJts0wihu8XKoj1bxlgjQfkZD';

  $fb = new Facebook\Facebook([
    'app_id' => '260269694418755',
    'app_secret' => 'fee999ddd97b2b0a9013dedb3c22449c',
  ]);


  if (isset($_GET['type'])) {
    if ($_GET['type'] == 'place') {
      $loc = $_GET['lat'].','.$_GET['lon'];
      $fields = 'id,name,picture.width(700).height(700)';
      $request = 'https://graph.facebook.com/v2.8/search?q='.$_GET['q'].'&type='.$_GET['type'].'&fields='.$fields.'&center='.$loc.'&access_token='.$access_token;
      $response = file_get_contents($request);
      echo $response;
    } else {
      $fields = 'id,name,picture.width(700).height(700)';
      $request = 'https://graph.facebook.com/v2.8/search?q='.$_GET['q'].'&type='.$_GET['type'].'&fields='.$fields.'&access_token='.$access_token;
      $response = file_get_contents($request);
      echo $response;
      /*try {
        $request = $fb->request (
          'GET',
          '/search',
          array (
            'type' => $_GET['type'],
            'q' => $_GET['q'],
            'fields' => 'id,name,picture.width(700).height(700)',
          ),
          $access_token,
          null, null
        );
        $response = $fb->getClient()->sendRequest($request);

        $graphObject = $response->getGraphEdge();
        echo $graphObject->asJson();
      } catch (Facebook\Exceptions\FacebookResponseException $ex) {
        echo $ex->getMessage();
        exit;
      } catch (Facebook\Exceptions\FacebookSDKException $ex) {
        echo $ex->getMessage();
        exit;
      }*/
    }
  }

  if (isset($_GET['link'])) {
    $request = $_GET['link'];
    $response = file_get_contents($request);
    echo $response;
  }


  if (isset($_GET['id'])) {
    $fields = 'name,albums.limit(5){name,photos.limit(2){name,picture}},posts.limit(5)';
    $request = 'https://graph.facebook.com/v2.8/'.$_GET['id'].'?fields='.$fields.'&access_token='.$access_token;
    $response = file_get_contents($request);
    echo $response;
  }
?>