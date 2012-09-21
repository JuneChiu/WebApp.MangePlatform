<?php require_once '../conn.inc';?>
<?php //init
if(isset($_POST["action"])&&$_POST["action"]=="add"){
	$con->cur_db("ms");
  	$s="INSERT INTO productinfo (num,name,size,unit,price,store) VALUES (
	'".$_POST["num"]."',
	'".$_POST["name"]."',
	'".$_POST["size"]."',
	'".$_POST["unit"]."',
	'".$_POST["price"]."',
	'".$_POST["store"]."'
	)";
	$result=$con->o_tb($s);
	echo '{"info":"succeed","return_productId":"'.mysql_insert_id().'"}';
}
elseif(isset($_POST["action"])&&$_POST["action"]=="modify"){
	$con->cur_db("ms");
    $s="UPDATE productinfo set num='".$_POST["num"]."',
    name='".$_POST["name"]."',
    size='".$_POST["size"]."',
    unit='".$_POST["unit"]."',
    price='".$_POST["price"]."',
    store='".$_POST["store"]."' where id='".$_POST["id"]."'";
	$result=$con->o_tb($s);
	echo '{"info":"succeed"}';
}
elseif(isset($_POST["action"])&&$_POST["action"]=="delete"){
	$con->cur_db("ms");
	while (count($_POST["id"])>0) {
	$_id=array_pop($_POST["id"]);
	$s="DELETE FROM productinfo where id='".$_id."'";
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
$fp = fopen ("json/"."mod.ms.production.json" . '.html',"w");
fwrite ($fp,$content);
?>

