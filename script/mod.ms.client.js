ms.mod.client=function(){
	//*一次性初始化过程
	ms.mod.client.temp=[];
	//ms.mod.client.getJSON();
	//*被多次调用的方法
	//身份验证，仅限ROOT，管理员，业务管理员，业务员可以通行
	ms.mod.client.limit=function(flag_inMod){
		var level=ms.level;
		if(!!flag_inMod&&!(level==9||level==8||level==1||level==10)&&ms.posistion=="production"){return true;}
		if(!(level==9||level==8||level==1||level==10)){return true;}
	}
	//向服务器获取客户信息
	ms.mod.client.getJSON=function(updateStatusBar){
		$.get("mod/mod.ms.client.php",function(data){
			data=data.trim()//清除回调数据前后留白
			localStorage.setItem("data.ms.client",data);
			ms.mod.client.jsonFilter();
			ms.modToShowMain["script/mod.ms.client.js"]=true;
		if(!!updateStatusBar){ms.mod.client.updateStatusBar();}
		})	
	};
	//提前建立JSON过滤器，加快点击事件速度
	ms.mod.client.jsonFilter=function(){
		//过滤不同客户
		var userName=ms.mod.user.jsonToArray();
		ms.mod.client.temp["currentObject"]=JSON.parse(localStorage.getItem("data.ms.client"),function(key,value){
		if(key=="clientCharge"){
			return (userName[value]||"无");
			}
		return value;
		});
	}
	ms.queue.push({"execution":ms.mod.client.getJSON,"arguments":""});
};
ms.mod.client.init=function(){
	//调用身份验证
	if(ms.mod.client.limit()){return false};
	//*一次性初始化过程
	//**事件绑定
	//点击触发切换客户模块方法
	$("#plug").delegate("a#client_bar","click",function(e){
		ms.mod.client.getTime=Date.now();/////////////////////////////////////////////////////
		if(ms.posistion!="client"){
			ms.clear();
			ms.mod.client.display();//不采用事务队列，减少视觉延缓
			ms.posistion="client";
		}
	});
	//点击触发创建客户方法
	$("#middleSection").delegate("a#client_bar_create","click",function(e){	
		ms.mod.client.temp["_flag_create"]=ms.mod.client.temp["_flag_create"]||0;
		if(!ms.mod.client.temp["_flag_create"]){
		$(this).text("保存");
		var newTr=$("<tr class='unfinish' id='operationing'><td><input style='width:95%' /></td><td><input style='width:95%' /></td><td><input style='width:95%' /></td><td><input style='width:95%' /></td><td><input style='width:95%' /></td><td><input style='width:95%' /></td></tr>");
		newTr.hide().prependTo($("tbody:first")).fadeIn("fast");
		var cancelButton=$("<a id='client_bar_create_cancle'>").text("取消")
		.addClass("middleSection_bar_man white f14 block").hide();
		$("#client_bar_create").after(cancelButton.fadeIn("fast"));	
		ms.mod.client.temp["_flag_create"]=1;
		}
		else{
		$("#client_bar_create_cancle").remove();
		ms.queue.push({"execution":ms.mod.client.add,"arguments":"queue"+Date.now()});
		$(this).text("创建");
		}
	});
	//点击触发取消创建客户方法
	$("#middleSection").delegate("a#client_bar_create_cancle","click",function(e){
		$("tr.unfinish").remove();		
		$("#client_bar_create_cancle").remove();
		$("#client_bar_create").text("创建");
		ms.mod.client.temp["_flag_create"]=0;
	});
	//点击触发修改客户方法
	$("#middleSection").delegate("a#client_bar_modify","click",function(e){
		if(!ms.mod.client.temp["_flag_modify"]){
		$("#client_bar_delete").fadeOut("fast");
		$(this).text("保存");
		$("table.client tbody tr.trFocus").each(function(i,o){
			$(o).removeClass("trFocus").addClass("modify").find("td").each(function(i,o){
				var _text=$(o).text();
				$(o).html($("<input style='width:95%' />").val(_text));	
			})
		});
		ms.mod.client.temp["_flag_modify"]=1;
		}
		else{
			ms.queue.push({"execution":ms.mod.client.modify,"arguments":$("table.client tbody tr.modify").attr("id")});
			$(this).hide();
			$(this).text("修改");

		}
	});
	//点击触发删除客户方法
	$("#middleSection").delegate("a#client_bar_delete","click",function(e){
		$("#client_bar_modify").fadeOut("fast");
		var _deleteObject=[];
		$("table.client tbody tr.trFocus").each(function(i,o){
			_deleteObject.push(o.id)
		});
		$(this).hide();
		ms.queue.push({"execution":ms.mod.client.delete,"arguments":_deleteObject});
	});
	//点击触发加载更多条目方法
	$("#plugShow").delegate("#loadMore","click",function(e){
		if(ms.posistion=="client"){
		$(this).remove();
		ms.queue.push({"execution":ms.mod.client.displayData,"arguments":""});
	}
	});
	//定义选取条目行为
	$("#plugShow").delegate("table.client tbody tr:not(.unfinish):not(.modify)","click",function(e){
		$(this).toggleClass("trFocus");
		if($("table.client tr.trFocus").length>0){
			if($("table.client tr.trFocus").length==1){$("#client_bar_modify").fadeIn("fast")};
			if($("table.client tr.trFocus").length>1&&$("table.client tr.modify").length==0){$("#client_bar_modify").fadeOut("fast");}
			$("#client_bar_delete").fadeIn("fast");
		}
		else{
			if($("table.client tr.modify").length==0){$("#client_bar_modify").fadeOut("fast")};
			$("#client_bar_delete").fadeOut("fast");
		}
		ms.mod.client.updateStatusBar();//更新状态栏
	});
	//**DOM操作
	//创建导航条目
	$("<a>").text("客户资料")
	.addClass("plug")
	.attr("id","client_bar")
	.insertAfter($("#general_bar"))
	.wrap("<li></li>");
	//*被多次调用的方法
	//创建显示数据方法
	ms.mod.client.display=function(){
		if(!!!ms.mod.client.temp["template"]){
			$.get("template/mod.ms.client.html",function(data){
				$(data).appendTo("body");//记得修改
				ms.mod.client.decoration();
				ms.mod.client.temp["template"]=1;
			})	
		}
		else{
			ms.mod.client.temp["currentObject"]=JSON.parse(localStorage.getItem("data.ms.client"));//关键更新数据，勿轻易移位
			ms.mod.client.jsonFilter();
			ms.mod.client.decoration();
		}
	};
	//创建客户页外围显示，按钮，表头
	ms.mod.client.decoration=function(){
		//创建下部状态栏
		$("<div class='info' id='infoClient'></div>")
		.text("共有客户条目")
		.prependTo($("#plugSideShow"));	
		//创建创建客户条目
		$("<a id='client_bar_create'>")
		.text("创建")
		.addClass("middleSection_bar_man white f14 block")
		.appendTo($("#middleSection"));			
		//创建修改客户条目	
		$("<a id='client_bar_modify'>")
		.text("修改")
		.addClass("middleSection_bar_man white f14 block")
		.hide()
		.appendTo($("#middleSection"))
		//创建删除客户条目
		$("<a id='client_bar_delete'>")
		.text("删除")
		.addClass("middleSection_bar_sub white f14 block")
		.hide()
		.appendTo($("#middleSection"))
		$("#plugShow").html($("#clientTemple_frame").tmpl());
		//执行状态栏
		ms.mod.client.updateStatusBar();
		ms.mod.client.displayData();//不采用事务队列，减少视觉延缓
	};
	//显示客户条目方法
	ms.mod.client.displayData=function(step) {
		var _object=ms.mod.client.temp["currentObject"];
		var currentTrNumber=$("table.client tbody tr:not(.unfinish):not(.modify)").length;	
		var numberPerPage=25,flag2=0,_object_afterOperation=[];//设定每页显示25条
		var flag=numberPerPage;
		if(!!step){flag=numberPerPage-currentTrNumber};
		while(_object.length>0&&flag>0){
			_object_afterOperation[flag2]=_object.shift();
			flag--;
			flag2++;
		};
		var _object_display=$("#clientTemple_content").tmpl(_object_afterOperation).hide();
		$("tbody:first").append(_object_display.show());//条目插入方式
		console.log("the reaction of mod.client is:",Date.now()-ms.mod.client.getTime,"ms");///////////////////////////////////
		if(!!!step&&_object.length>0){$('<div id="loadMore">加载更多</div>').appendTo("#plugShow");}
	};
	//添加客户条目方法
	ms.mod.client.add=function(queue){
		var userName=ms.mod.user.jsonToArray();
		var _addObject=[];
		$("#operationing input").each(function(i,o){
			var v=(o.value).trim()
			_addObject.push(v);
		});
		$("#operationing input").remove();
		///////////设置默认值///////////
		_addObject[0]=_addObject[0]||"空";
		_addObject[1]=_addObject[1]||"未命名";
		_addObject[2]=_addObject[2]||"空";
		_addObject[3]=_addObject[3]||"空";
		_addObject[4]=_addObject[4]||"空";
		_addObject[5]=userName[_addObject[5]]||0;	
		////////////////////////////////
		$("#operationing td").each(function(i,o){
			$(o).text(_addObject[i]);
		});
		$("#operationing").attr("id",queue);
		ms.mod.client.temp["_flag_create"]=0;
		var postData={action:"add",code:_addObject[0],company:_addObject[1],person:_addObject[2],contact:_addObject[3],address:_addObject[4],charge:_addObject[5]};
		$.post("mod/mod.ms.client.db.php",postData,function(data){
			data=data.trim()//清除回调数据前后留白
			var _object=JSON.parse(data);
			if(_object.return_clientId>0){
				$("#"+queue).removeClass("unfinish").attr("id",_object.return_clientId);
				_addObject.unshift("("+_object.return_clientId+")");
				ms.queue.push({"execution":ms.mod.client.getJSON,"arguments":"1"});//重新获取客户信息
				ms.queue_record.push({"method":"client.add","param":_addObject});
			}	
		})
	};
	//修改客户条目方法
	ms.mod.client.modify=function(oid){
		var _modifyObject=[];
		$(".modify input").each(function(i,o){
			var v=(o.value).trim()
			_modifyObject.push(v);
		});
		$(".modify input").remove();
		///////////设置默认值///////////
		_modifyObject[0]=_modifyObject[0]||"空";
		_modifyObject[1]=_modifyObject[1]||"未命名";
		_modifyObject[2]=_modifyObject[2]||"空";
		_modifyObject[3]=_modifyObject[3]||"空";
		_modifyObject[4]=_modifyObject[4]||"空";
		_modifyObject[5]=_modifyObject[5]||0;	
		////////////////////////////////
		$(".modify td").each(function(i,o){
			$(o).text(_modifyObject[i]);
		});
		ms.mod.client.temp["_flag_modify"]=0;
		var postData={action:"modify",id:oid,code:_modifyObject[0],company:_modifyObject[1],person:_modifyObject[2],contact:_modifyObject[3],address:_modifyObject[4],charge:_modifyObject[5]};
		$.post("mod/mod.ms.client.db.php",postData,function(data){
			data=data.trim()//清除回调数据前后留白
			var _object=JSON.parse(data);
			if(_object.info=="succeed"){
				$("#"+oid).removeClass("modify");
				_modifyObject.unshift("("+oid+")");
				ms.queue.push({"execution":ms.mod.client.getJSON,"arguments":"1"});//重新获取客户信息
				ms.queue_record.push({"method":"client.modify","param":_modifyObject});
			}
		})	
	};
	//删除客户条目方法
	ms.mod.client.delete=function(idArray){
		var focusElement=$("table.client tbody tr.trFocus");
		var _log=[focusElement.length]
		focusElement.each(function(i,o){
			_log[i]=[];
			$(o).find("td").each(function(j,o){
				_log[i][j]=$(o).text();
			});
		})
		focusElement.fadeOut("normal");
		var postData={action:"delete","id":idArray};
		$.post("mod/mod.ms.client.db.php",postData,function(data){
			data=data.trim()//清除回调数据前后留白
			var _object=JSON.parse(data);
			if(_object.info=="succeed"){
			focusElement.remove();
			ms.queue_record.push({"method":"client.delete","param":_log});
			ms.queue.push({"execution":ms.mod.client.displayData,"arguments":focusElement.length});//删除条目后回填条目
			ms.queue.push({"execution":ms.mod.client.getJSON,"arguments":"1"});//重新获取客户信息
			}
		})
	};
	//客户状态栏方法
	ms.mod.client.updateStatusBar=function(){
		var trFocus=0;
		if($("tr.trFocus")!=undefined){
			var trFocus=$("tr.trFocus").length||0;
		}
		$("#infoClient").text("共有客户信息"+JSON.parse(localStorage.getItem("data.ms.client")).length+"，当前选取了 "+trFocus)
	}
};
ms.mod.client();
ms.mod.client.init();