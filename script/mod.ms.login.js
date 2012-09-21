
var ms={};ms.mod={};//创建命名空间，减少全局污染
ms.mod.login=function(){
	//创建提示框
	$("<div id='bottomTip'></div>")
	.append($("<span></span>"))
	.hide()
	.addClass("")
	.appendTo($("body"))
	//---------------------------------------------
	//首先定义验证成功后的操作
	function succeed(){
		$('#header').show();
		$('#centre').fadeIn("fast");
		//读取加载代码
		$.getScript("script/mod.ms.load.js",function(data,status){
			$("#centre_div").fadeOut("fast").queue(function(){
				$('#load').fadeIn("fast");
				$("#bottomTip").slideUp("fast");
				$("#centre_div").remove();//移除登录界面节点
			})
		});
	};
	//若已经存在则直接执行验证成功操作
	if(!!$.cookie("userID")){	
			succeed();
			return false;//停止执行往下操作
	}
	//提交验证表单开关，避免多次提交
	var onOff=0;
	//创建验证错误提示
	var _tips=$('<div></div>')
				.css({display:"inline",backgroundColor:"rgb(247,140,146)",color:"#fff",padding:"5px",marginLeft:"15px"})
				.html("信息有误，请重新输入").hide().insertAfter('#login_submit');
	//提交按钮文字提示变化
	$('#login_submit')
	.ajaxStart(function(){onOff=1;$(this).val("验证中");})
	.ajaxStop(function(){onOff=0;$(this).val("登录");});
	//定义提交验证表单方法
	$('#login_form').submit(function(e){
		var _account=$('#account').val();
		var _password=$('#password').val();
		if(onOff==0){
		$.get("mod/mod.ms.login.php",{account:_account,password:_password},function(data){
			if(data==1){succeed();}
        	else {_tips.show().fadeOut(2000);}//验证失败后弹出提示框
			});
		}
		return false;//取消默认事件
		});
	//一些列界面载入操作**************
	$('#load').fadeOut("fast");//移除读取提示条
	$('#centre_div').show("fast");//显示登录界面
	$('#header').slideDown("normal");//下推头部界面
	//淡入显示主界面
	$('#centre').fadeIn("slow").queue(function(){
	//显示提示框
	var _bottomTip=$("#bottomTip");
	if(!$.browser.webkit){
		_bottomTip.find("span").html("<a href='http://www.google.com/chrome/' target='_blank'>请使用Chrome浏览器以获得更佳的体验</a>");
	}
	else{
		_bottomTip.find("span").html("<a title='点击发送邮件给管理员' href='mailto:june.chiu.s@gmail.com'>欢迎使用WebApp管理平台</a>");
	}
	_bottomTip.slideDown("normal");
	});
	//********************************
}