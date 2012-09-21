<?php require_once '../conn.inc'; ?>

<?php //init field

if($_POST["action"]=="addFolder"){
$con->cur_db("ms");
$s="INSERT INTO drive (field,name,time,privilege,parent) 
VALUES (
'".$_POST["field"]."',
'".$_POST["name"]."',
'".$_POST["time"]."',
'".$_COOKIE["userID"]."',
'".$_POST["parent"]."'
)";
$result=$con->o_tb($s);
echo '{"return_folderId":"'.mysql_insert_id().'"}';
}




if($_POST["action"]=="modify"){
$con->cur_db("ms");
$s="UPDATE drive set name='".$_POST["name"]."',time='".$_POST["time"]."' where id='".$_POST["id"]."'";
$con->o_tb($s);	
echo '{"info":"succeed"}';	
}		
?> 


<?php //init field
function del_drive($id){
	global $con;
	$con->cur_db("ms");
	$ss="SELECT * FROM drive where id='".$id."'";
	$field=$con->o_tb($ss);
	$info_p = mysql_fetch_array($field);
	if($info_p["url"]!=""){
		if(file_exists("../upload/".$info_p["url"])){ 
			unlink("../upload/".$info_p["url"]);
		}
	$s="DELETE FROM drive where id='".$id."'";
	$con->o_tb($s);
	return 0;
		}
	if($info_p["url"]==""){
	$s="DELETE FROM drive where id='".$id."'";
	$con->o_tb($s);
	$ss="SELECT * FROM drive where parent='".$id."'";
	$field=$con->o_tb($ss);	
	while($info_p = mysql_fetch_array($field)){
		del_drive($info_p["id"]);
		}
	return 0;
		}
		
	}
if($_POST["action"]=="delete"){
	echo file_exists("test.txt");
	while (count($_POST["id"])>0) {
	$_id=array_pop($_POST["id"]);
	del_drive($_id);
	}
	
	echo '{"info":"succeed"}';
}

?> 