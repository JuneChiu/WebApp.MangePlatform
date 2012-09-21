<?php require_once '../conn.inc';?>
<?php //init field
if($_COOKIE["userClass"]==1){
	$s="SELECT * FROM clientinfo where charge ='".$_COOKIE["userID"]."' order by id desc";
}
else{
	$s="SELECT * FROM clientinfo order by id desc";
}

$field=$con->o_tb($s);
?> 
<?php
$_string=array();
	while($field_p = mysql_fetch_array($field)){
	array_push($_string,'{"clientId":"'.$field_p["id"].'"');
	array_push($_string,'"clientCode":"'.$field_p["code"].'"');
	array_push($_string,'"clientCompany":"'.$field_p["company"].'"');
	array_push($_string,'"clientPerson":"'.$field_p["person"].'"');
	array_push($_string,'"clientContact":"'.$field_p["contact"].'"');
	array_push($_string,'"clientAddress":"'.$field_p["address"].'"');
	array_push($_string,'"clientCharge":"'.$field_p["charge"].'"}');
}
echo "[".join(",",$_string)."]";
?>
