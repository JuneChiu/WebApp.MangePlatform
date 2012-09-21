<?php require_once '../conn.inc';?>
<?php //init field
$q="";
if(isset($_GET["q"])){
if($_GET["q"]==""){$q="%";}
else{$q=$_GET["q"];}}
?> 
<?php //init field
$s="SELECT * FROM productinfo  where (num='".$q."' or name like '%".$q."%') order by id desc";
$field=$con->o_tb($s);
?> 
<?php
$_string=array();
	while($field_p = mysql_fetch_array($field)){
	array_push($_string,'{"productionId":"'.$field_p["id"].'"');
	array_push($_string,'"productionNum":"'.$field_p["num"].'"');
	array_push($_string,'"productionName":"'.$field_p["name"].'"');
	array_push($_string,'"productionSize":"'.$field_p["size"].'"');
	array_push($_string,'"productionUnit":"'.$field_p["unit"].'"');
	array_push($_string,'"productionPrice":"'.$field_p["price"].'"');
	array_push($_string,'"productionStore":"'.$field_p["store"].'"}');
}
echo "[".join(",",$_string)."]";
?>
