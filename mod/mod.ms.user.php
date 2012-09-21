<?php require_once '../conn.inc';?>
<?php //init field
$q="";
if(isset($_GET["q"])){
if($_GET["q"]==""){$q="%";}
else{$q=$_GET["q"];}}
?> 
<?php //init field
$s="SELECT * FROM userinfo order by id desc";
$field=$con->o_tb($s);
?> 
<?php
$_string=array();
	while($field_p = mysql_fetch_array($field)){
	array_push($_string,'{"userId":"'.$field_p["id"].'"');
	array_push($_string,'"userAccount":"'.$field_p["account"].'"');
	array_push($_string,'"userName":"'.$field_p["name"].'"');
	array_push($_string,'"userClass":"'.$field_p["class"].'"}');
}
echo "[".join(",",$_string)."]";
?>
