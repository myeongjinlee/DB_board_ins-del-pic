<?php
    $db = new mysqli('localhost','root','dlaudwls2!','tutorial');

    if($db->connect_error){
        die('db오류');
    }

    $db->set_charset('utf-8');
    date_default_timezone_set('Asia/Seoul');
?>