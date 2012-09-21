<?php
require_once '../conn.inc';
?>
<?php
$con->cur_db("ms");
$s="select * from userinfo where account='".$_GET["account"]."' and password ='".$_GET["password"]."'";
$result=$con->o_tb($s);
$row=mysql_fetch_array($result);
if(mysql_num_rows($result)>0){
	setcookie("userName", $row["name"], time()+36000,"/");
	setcookie("userID", $row["id"], time()+36000,"/");
	setcookie("userClass", $row["class"], time()+36000,"/");
	echo 1;}
else {echo 0;}
?>