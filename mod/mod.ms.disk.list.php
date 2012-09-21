<?php require_once '../conn.inc'; ?>

<?php
$con->cur_db("ms");
$s="select * from drive_list order by field";
$field=$con->o_tb($s);
?>

<?php
$_string=array();
	while($field_p = mysql_fetch_array($field)){
	array_push($_string,'{"diskId":"'.$field_p["id"].'"');
	array_push($_string,'"diskField":"'.$field_p["field"].'"');
	array_push($_string,'"diskName":"'.$field_p["name"].'"}');
}
echo "[".join(",",$_string)."]";
?>
