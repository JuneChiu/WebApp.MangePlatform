<?php require_once '../conn.inc'; ?>
<?php
$_upload_name=$_FILES['file']['name'];//上传文件名称
$_upload_name_suffix=strrchr($_upload_name,".");//上传文件名称后缀
$_upload_size=$_FILES['file']['size'];//上传文件大小
$_upload_server_name=$_POST['fileName'];//存放在服务器文件名称
$_upload_file_field=$_POST['field'];//上传文件属于域
$_upload_file_parent=$_POST['parent'];//上传文件父级ID
$_upload_tmp_url=$_FILES['file']['tmp_name'];//临时文件路径
$file_path = '../upload/';
$file_new=$_upload_server_name.$_upload_name_suffix;
$file_up = $file_path.$file_new;//最终存放到服务器的路径
if(move_uploaded_file($_upload_tmp_url,$file_up)){	
	$con->cur_db("ms");
	$time=date("Ymd");
	$s="INSERT INTO drive (field,name,size,url,time,privilege,parent) 
	VALUES (
	'".$_upload_file_field."',
	'".$_upload_name."',
	'".$_upload_size."',
	'".$file_new."',
	'".$time."',
	'".$_COOKIE["userID"]."',
	'".$_upload_file_parent."'
	)";
$result=$con->o_tb($s);

echo '{"returnInfo":"succeed","returnId":"'.mysql_insert_id().'","returnTime":"'.$time.'","returnName":"'.$_upload_name.'","returnOwner":"'.$_COOKIE["userID"].'","returnUrl":"'.$file_new.'"}';
    	
} 

?>



