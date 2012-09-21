<?php require_once '../conn.inc'; ?>

<?php //init field
$con->cur_db("ms");
$s;
if($_COOKIE["userClass"]==1){
	$s="select * from drive where privilege ='".$_COOKIE["userID"]."' order by id desc";
}
else{
	$s="select * from drive order by id desc";
}
$field=$con->o_tb($s);
?>
<?php
$_string=array();
	while($field_p = mysql_fetch_array($field)){
	array_push($_string,'{"fileId":"'.$field_p["id"].'"');
	array_push($_string,'"fileField":"'.$field_p["field"].'"');
	array_push($_string,'"fileName":"'.$field_p["name"].'"');
	array_push($_string,'"fileUrl":"'.$field_p["url"].'"');
	array_push($_string,'"fileParent":"'.$field_p["parent"].'"');
	array_push($_string,'"filePrivilege":"'.$field_p["privilege"].'"');
	array_push($_string,'"fileTime":"'.$field_p["time"].'"}');
}
echo "[".join(",",$_string)."]";
?>
