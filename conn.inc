<?php
class db_con{
private $con;
private $current_db;
var $_v="IF you can see this word, you are smart!";
function returnTheSame($v1,$v2)
	{
		for($i=0;$i<count($v1);$i++){
			for($j=0;$j<count($v2);$j++){
				if($v1[$i]==$v2[$j]){return $i+1;}
			}
		}
	}
function cur_db($db_name) //current db pointer
      {	if($this->db($db_name)){
	  		$this->current_db=$db_name;
	 		return $this->current_db;}
	    else{return 0;}
      }	  
	  
function __construct() //for PHP5.0
      {
		 $_arg=func_get_args ();
		 if(func_num_args ()==3){$this->con = mysql_connect($_arg[0],$_arg[1],$_arg[2]);mysql_query("set names utf8");}
      }
function db($db_name) //check the database by name
      {  
		 $msd=mysql_select_db($db_name,$this->con);
		 return($msd)?1:0;		 
      }
function tb($s) //check the operation of the table the 1st arg is method the 2nd is line
      { $s=str_replace(" ","|",str_replace("("," ",trim($s)));
	    $arr=explode("|",str_replace("\n"," ",$s),100);
	  	for($i=0;$i<count($arr);$i++)$arr[$i]=trim($arr[$i]);
		$_a1=$arr;
		$_a2=array("from","table","into","update");
		for($i=0;$i<count($_a1);$i++)$_a1[$i]=strtoupper($_a1[$i]);
		for($i=0;$i<count($_a2);$i++)$_a2[$i]=strtoupper($_a2[$i]);
		$_r=array($arr[0],$arr[$this->returnTheSame($_a1,$_a2)]);
		return $_r;
      }
function c_db($db_name) //create databse
      {	if(!$this->db($db_name)){
	  	if(mysql_query("CREATE DATABASE ".$db_name,$this->con)){
			mysql_query("ALTER DATABASE " . $db_name . " DEFAULT CHARACTER SET utf8 COLLATE utf8_bin",$this->con);
			$this->current_db=$db_name;
			return 1;}
		else{echo "Error creating database: " . mysql_error();}
	  }
	  else {return 0;}
      }
function d_db($db_name) //drop databse
      {	if($this->db($db_name)){
	  	if(mysql_query("DROP DATABASE ".$db_name,$this->con)){return 1;}
		else{echo "Error deleting database: " . mysql_error();}
	  }
	  else {return 0;}
      }
function o_tb() //create table
      {	$_arg=func_get_args ();
	    if(func_num_args ()==2){if($this->db($db_name))mysql_select_db($_arg[1], $this->con);}
		if(func_num_args ()==1){if($this->db($this->current_db))mysql_select_db($this->current_db, $this->con);}
		$tb_name=$this->tb($_arg[0]);		
		if(!strcasecmp($tb_name[0],"create")&&!mysql_query("SELECT * FROM ".$tb_name[1],$this->con)){
			if(mysql_query($_arg[0],$this->con)){return 1;}
			else{echo "Error creating table: " . mysql_error();}}
		if(!strcasecmp($tb_name[0],"drop")&&mysql_query("SELECT * FROM ".$tb_name[1],$this->con)){	
		  	if(mysql_query($_arg[0],$this->con)){return 1;}
				else{echo "Error droping table: " . mysql_error();}}
		if(!strcasecmp($tb_name[0],"insert")&&mysql_query("SELECT * FROM ".$tb_name[1],$this->con)){			 
		  	if(mysql_query($_arg[0],$this->con)){return 1;}
				else{echo "Error inserting table: " . mysql_error();}}      	    	
		if(!strcasecmp($tb_name[0],"select")&&mysql_query("SELECT * FROM ".$tb_name[1],$this->con)){			$_r=mysql_query($_arg[0],$this->con);
		  	if($_r){return $_r;}
				else{echo "Error selecting table: " . mysql_error();}}
		if(!strcasecmp($tb_name[0],"update")&&mysql_query("SELECT * FROM ".$tb_name[1],$this->con)){			$_r=mysql_query($_arg[0],$this->con);
		  	if($_r){return $_r;}
				else{echo "Error updating table: " . mysql_error();}}					
		if(!strcasecmp($tb_name[0],"delete")&&mysql_query("SELECT * FROM ".$tb_name[1],$this->con)){			 
		  	if(mysql_query($_arg[0],$this->con)){return 1;}
				else{echo "Error deleting record: " . mysql_error();}}  			
					
      	}	  
	  
function close_db(){
	mysql_close($this->con);	
}	  
}
$con=new db_con("localhost","root","");
$con->cur_db("ms");
?>