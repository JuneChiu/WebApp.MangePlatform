<?php require_once '../conn.inc';?>
<?php //init
if(isset($_POST["action"])&&$_POST["action"]=="add"){
	$con->cur_db("ms");
  	$s="INSERT INTO clientinfo (code,company,person,contact,address,charge) VALUES (
	'".$_POST["code"]."',
	'".$_POST["company"]."',
	'".$_POST["person"]."',
	'".$_POST["contact"]."',
	'".$_POST["address"]."',
	'".$_POST["charge"]."'
	)";
	$result=$con->o_tb($s);
	echo '{"info":"succeed","return_clientId":"'.mysql_insert_id().'"}';
}
elseif(isset($_POST["action"])&&$_POST["action"]=="modify"){
	$con->cur_db("ms");
    $s="UPDATE clientinfo set code='".$_POST["code"]."',
    company='".$_POST["company"]."',
    person='".$_POST["person"]."',
    contact='".$_POST["contact"]."',
    address='".$_POST["address"]."',
    charge='".$_POST["charge"]."' where id='".$_POST["id"]."'";
	$result=$con->o_tb($s);
	echo '{"info":"succeed"}';
}
elseif(isset($_POST["action"])&&$_POST["action"]=="delete"){
	$con->cur_db("ms");
	while (count($_POST["id"])>0) {
	$_id=array_pop($_POST["id"]);
	$s="DELETE FROM clientinfo where id='".$_id."'";
	$con->o_tb($s);	
	}
	echo '{"info":"succeed"}';

}

else{
	echo '{"info":"null"}';
}
?>
<?php
$content ='{"date":"'.time().'"}'; 
$fp = fopen ("json/"."mod.ms.client.json" . '.html',"w");
fwrite ($fp,$content);
?>

