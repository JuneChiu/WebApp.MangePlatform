//基础控制模块
ms.queue=[];//当前系统事务队列
ms.queue_record=[];//事务队列记录
ms.posistion="";//当前系统所处的模块
ms.level=$.cookie("userClass");//当前用户级别
ms.userId=$.cookie("userID");//当前用户ID
ms.temp=[];
ms.init=function(){
	//*一次性初始化过程
	//定义事件队列管理方法，默认间隔150毫秒出栈函数一次
	ms.eventManger=(function(){
			if (ms.queue.length>0) {
				var currentMission=ms.queue.pop();
				//console.log(currentMission.execution+"("+currentMission.arguments+")");//控制台输出当前操作
				currentMission.execution(currentMission.arguments);		
			}
			setTimeout(arguments.callee,150)
		})();
	//系统合法性验证，间隔6秒检查一次
	ms.offline=(function(){
			if(!!!$.cookie("userID")){
				$("#infoBar").text("失去认证，5秒后退出系统").fadeIn("fast");
				setTimeout(function(){
					location.reload()
				},5200)
			};
			setTimeout(arguments.callee,6000)
		})();
	//**事件绑定
	//绑定侧栏#plug，点击插件事件
	$("#plug").delegate("a.plug","click",function(e){
		$("#plug").find("a.plug").removeClass("focusPlug");
		$(this).addClass("focusPlug");
	});
	//$("<form id='searchForm'></form>")
	$("#header").delegate("#searchForm","submit",function(e){
		e.preventDefault();
	});	
	//绑定#general_bar点击载入ms.mod.check事件
	$("#plug").delegate("a#general_bar","click",function(e){
		ms.mod.check();
	});
	//绑定#lock_button点击注销用户
	$("#plugSideShow").delegate("a#lock_button","click",function(e){
		$.removeCookie('userID', {path: '/' });
		$("a#lock_button").text("已注销");
	});
	//点击触发修改密码事件
	$("#plugSideShow").delegate("a#change_password","click",function(e){
		window.open("mod/mod.ms.user.modifyPassword.php","","menubar=no,location=no,height=150px,width=300px,left="+(window.innerWidth/2-150)+"px,top="+(window.innerHeight/2-120)+"px");
	});	
	//**DOM操作
	//插入系统概况模块#plug，并触发一次点击事件
	$("<a>").text("系统概况")
	.addClass("plug")
	.addClass("focusPlug")
	.attr("id","general_bar")
	.appendTo($("#plug ul:first"))
	.wrap("<li></li>");
	//插入系统概况模板
	(function(){
		$.get("template/mod.ms.general.html",function(data){
			$(data).appendTo("body");//记得修改
			$("#general_bar").trigger("click");
		})		
	})();
	//*被多次调用的方法
	//**脚手架方法
	//获取用户级描述
	ms.levelDescription=function(level){
		var levelDescription=[];
		levelDescription[9]="ROOT";
		levelDescription[8]="管理员";
		levelDescription[1]="业务员";
		levelDescription[10]="业务管理员";
		levelDescription[2]="行政人员";
		levelDescription[3]="仓库人员";
		return levelDescription[level];
	}
	//定义获取当前时间YYYYMMDDHHmmSS方法
	ms.getNow=function(){
		var newDate=new Date(),returnValue=[];
		returnValue.push(newDate.getFullYear());
		returnValue.push(((newDate.getMonth()+1)<10?"0"+(newDate.getMonth()+1):(newDate.getMonth()+1)));
		returnValue.push(((newDate.getDate())<10?"0"+newDate.getDate():newDate.getDate()));
		returnValue.push(((newDate.getHours())<10?"0"+newDate.getHours():newDate.getHours()));
		returnValue.push(((newDate.getMinutes())<10?"0"+newDate.getMinutes():newDate.getMinutes()));
		return(returnValue.join(""))
	}
	//定义清空模块显示方法
	ms.clear=function(){
		$("#middleSection").empty();
		$("#plugShow").empty();
		$("#plugSideShow").empty();
	};
	ms.displayMain=function(){
		var flag=true;
		for(var j in ms.modToShowMain){
				flag=flag&&ms.modToShowMain[j];
			}
		if(flag){
			//删除网站读取条
			$('#load').remove();
			//当开始AJAX请求时候，显示#operatingBar；结束AJAX请求时候，隐藏#operatingBar
			$("#operatingBar")
			.ajaxStart(function(){
			$(this).fadeIn("fast");
			})	
			.ajaxStop(function(){
			$(this).fadeOut("fast");
			});
			$("#main").fadeIn("fast");
			//创建搜索框
			$("<form id='searchForm'></form>")
			.append($("<input>").attr("id","searchInput").attr("title","输入后回车搜索"))
			.appendTo($("#header"));
		}
		else{
			setTimeout(ms.displayMain,1000);
		}	
	}
	//定义载入模块方法，@url:脚本路径，@ps：脚本说明
	ms.loadScript=function(url){
		ms.loadScript_url=ms.loadScript_url||[];
		if(url){
			ms.loadScript_url=ms.loadScript_url.concat(url);
			ms.modToShowMain=[];
			for(var i=0;i<url.length;i++){
				ms.modToShowMain[url[i]]=false;
			}
		}
	if(ms.loadScript_url.length>0){
		$.getScript(ms.loadScript_url.shift(),function(){
			ms.loadScript();
		});	
	}
	else{
		ms.displayMain();
		}
	}
	//定义查看系统概况方法
	ms.mod.check=function(){
	if(ms.posistion!="general"){
		ms.clear();
		ms.posistion="general";
		$("<a id='change_password'>").text("更改密码")
			.prependTo($("#plugSideShow"));
		$("<a id='lock_button'>").text("注销帐户")
			.prependTo($("#plugSideShow"));
		$("#plugShow").append("<div id='general'></div");
		var o={
			"generalUrl":window.location,
			"generalSystemName":"WebApp Manage Platform",
			"generalSystemVersion":"1.09192012",
			"generalClient":window.navigator.userAgent,
			"generalClientBand":window.navigator.vendor,
			"generalClientLanguage":window.navigator.language,
			"generalThirdparty":"jQuery Framework v1.7.2;jQuery Templates Plugin v1.0.0;jQuery Cookie Plugin v1.2;",
			"generalAccountName":$.cookie("userName")||"未命名",			
			"generalAccountLevel":ms.levelDescription(ms.level),
			"generalAccountId":ms.userId,
			"generalAccountPassword":"window.navigator.language",			
			}
		$("#general").hide().html($("#generalTemple_frame").tmpl(o))
		$("#general").show();
	}
	}
	//*初始化推入事务队列
	
	///////////////////载入一系列的必要模块///////////////////////
	ms.loadScript(["script/mod.ms.user.js","script/mod.ms.production.js","script/mod.ms.client.js","script/mod.ms.disk.js"]);
	//////////////////////////////////////////////////////////////
	
}
//初始化系统
ms.init();