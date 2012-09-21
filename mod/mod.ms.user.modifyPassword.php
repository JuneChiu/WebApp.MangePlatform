<?php require_once '../conn.inc';?>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<title>修改帐户密码</title>
<?php //init field




if(isset($_POST["p1"])&&isset($_POST["p1"])&&isset($_COOKIE["userID"])){
	if($_POST["p1"]==$_POST["p2"]){
		$s="update userinfo set password ='".$_POST["p2"]."' where id ='".$_COOKIE["userID"]."'";
		$field=$con->o_tb($s);
		echo "修改成功";
		echo "<script type='text/javascript'>setTimeout('window.close()',1000)</script>";
		setcookie("userID", "", time()-3600,"/");
	}
	else{
?>
<form method="post" action="mod.ms.user.modifyPassword.php">
<h4>You won't see this ugly window later :)</h4>
密码：<input type="password" name="p1"/><br/>
确认：<input type="password" name="p2"/><br/>
<button>保存</button>
</from>
<?php
	}
}
else{
?>

<form method="post" action="mod.ms.user.modifyPassword.php">
<h4>You won't see this ugly window later :)</h4>
密码：<input type="password" name="p1"/><br/>
确认：<input type="password" name="p2"/><br/>
<button>保存</button>
</from>
 

<?php
}
?>
