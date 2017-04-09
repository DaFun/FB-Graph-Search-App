<?php
  require_once __DIR__ . '/php-graph-sdk-5.0.0/src/Facebook/autoload.php';

  use Facebook\FacebookRequest;

  $access_token = 'EAADstsKuf0MBAO67Hm3DRV5bUx34NzfZAcrSPXid0Eky1ZAMin7YoamWnusmRj7mxF7Ns3J8Au1qNL11iDQCx7Fp4RFZADbXskaszqwCTXwmMQoIpO74FlODxtKPviXbUxHxKMnaJts0wihu8XKoj1bxlgjQfkZD';

  $fb = new Facebook\Facebook([
    'app_id' => '260269694418755',
    'app_secret' => 'fee999ddd97b2b0a9013dedb3c22449c',
  ]);


  if(isset($_GET['type'])) {
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

  if(isset($_GET['link'])) {
    $request = $_GET['link'];
    $response = file_get_contents($request);
    echo $response;
  }


  if(isset($_POST['id'])) {
    try {
      $request = $fb->request (
        'GET',
        $_POST['id'],
        array (
          'fields' => 'id,name,picture.width(700).height(700),albums.limit(5){name,photos.limit(2){name, picture}},posts.limit(5)',
        ),
        $access_token,
        null, null
      );

      $response = $fb->getClient()->sendRequest($request);
      $nodes = $response->getGraphNode();
    } catch (Facebook\Exceptions\FacebookResponseException $ex) {
      echo $ex->getMessage();
      exit;
    } catch (Facebook\Exceptions\FacebookSDKException $ex) {
      echo $ex->getMessage();
      exit;
    }
    //print_r($nodes);
    $albums = $nodes->getField('albums');
    $posts = $nodes->getField('posts');
    //print_r((array)$albums);

    if (count($albums) == 0) {
      echo "<table class='tab_1'><tr><td class='th_1'>No Albums have been found</td></tr></table>";
    } else {
      foreach($albums as $node) {
        $node = $node->asJson();
        //print_r($node);
        $node = json_decode($node);
        $name = $node->name;
        if (array_key_exists('photos', $node)) {
          foreach($node->photos as $pic) {
            $pics[] = array($pic->picture, $pic->id);
          }
          $row = array($name => $pics,);
        } else {
          $row = array($name => [],);
        }
        //print_r($row);
        $table[] = $row;
        unset($pics);
        unset($row);
      }
      echo "<table class='tab_2'><tr><th class='th_1'><a href='javascript:hideAndShow(0);'>Albums</a></th></tr></table>";

      echo "<div id='hideDiv0' style='display:none'><table class='tab_1'>";
      $index = 0;
      foreach ($table as $row) {
        $index++;
        foreach ($row as $key => $value) {
          if (empty($value)) {
            echo "<tr><td class='td_1'>{$key}</td></tr>";
            echo "<tr><td class='td_1'><div id='hideDiv{$index}' style='display:none'>";
            //echo "<p>No photos</p>";
          } else {
            echo "<tr><td class='td_1'><a href='javascript:hideAndShow({$index});'>{$key}</a></td></tr>";
            echo "<tr><td class='td_1'><div id='hideDiv{$index}' style='display:none'>";
            foreach ($value as $cell) {
              echo "<a href='{$cell[1]}' class='photoHandle'><img src='{$cell[0]}' height='80' width='80' hspace='3'></a>";
            }
          }
          echo "</div></td></tr>";
        }
      }
      echo "</table></div>";
      unset($table);
    }

    if (count($posts) == 0) {
      echo "<table class='tab_1'><tr><td class='th_1'>No Posts have been found</td></tr></table>";
    } else {
      foreach($posts as $node) {
        $node = $node->asJson();
        $node = json_decode($node);
        if (array_key_exists('message', $node)) {
          $message = $node->message;
          $table[] = $message;
        }
        unset($message);
      }
      echo "<table class='tab_2'><tr><th class='th_1'><a href='javascript:hideAndShow(6);'>Posts</a></th></tr></table>";

      echo "<div id='hideDiv6' style='display:none'><table class='tab_1'><tr><th bgcolor='#ddd' align='left'>Message</th></tr>";
      foreach ($table as $row) {
        //print_r($row);
        echo "<tr><td class='td_1'><p>{$row}</p></td></tr>";
      }
      echo "</table></div>";
    }
  }

?>
