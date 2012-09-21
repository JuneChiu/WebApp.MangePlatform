ms.mod.production=function(){
	//*一次性初始化过程	
	ms.mod.production.temp=[];
	//*被多次调用的方法
	//身份验证，仅限ROOT，管理员，业务管理员，业务员可以通行
	ms.mod.production.limit=function(flag_inMod){
		var level=ms.level;
		if(!!flag_inMod&&!(level==9||level==8||level==1||level==10)&&ms.posistion=="production"){return true;}
		if(!(level==9||level==8||level==1||level==10)){return true;}
	}
	//向服务器获取产品信息
	ms.mod.production.getJSON=function(updateStatusBar){
	$.get("mod/json/mod.ms.production.json.html?id="+Date.now(),function(data){
		data=JSON.parse(data.trim())//清除回调数据前后留白
			var _time=data.date;
			if(!localStorage.getItem("data.ms.production")||localStorage.getItem("data.ms.production.time")!=_time){
				$.get("mod/mod.ms.production.php",function(data){
					data=data.trim()//清除回调数据前后留白
					localStorage.setItem("data.ms.production",data);
					localStorage.setItem("data.ms.production.time",_time);
					//更新将要显示的产品数据 important
					ms.mod.production.temp["currentObject"]=JSON.parse(localStorage.getItem("data.ms.production"));
					ms.modToShowMain["script/mod.ms.production.js"]=true;
					if(!!updateStatusBar){ms.mod.production.updateStatusBar();}
				})
			}
			else{
				ms.mod.production.temp["currentObject"]=JSON.parse(localStorage.getItem("data.ms.production"));
				ms.modToShowMain["script/mod.ms.production.js"]=true;
			}
		});
	
	}
	ms.queue.push({"execution":ms.mod.production.getJSON,"arguments":""});
}
ms.mod.production.init=function(level){
	//调用身份验证
	if(ms.mod.production.limit()){return false};
	//*一次性初始化过程
	//**事件绑定
	//定义切换产品模块方法
	$("#plug").delegate("a#production_bar","click",function(e){
		ms.mod.production.getTime=Date.now();/////////////////////////////////////////////////////
	if(ms.posistion!="production"){
		ms.clear();
		ms.mod.production.display();//不采用事务队列，减少视觉延缓
		ms.posistion="production";}
	});
	//定义创建产品方法
	$("#middleSection").delegate("a#production_bar_create","click",function(e){	
		ms.mod.production.temp["_flag_create"]=ms.mod.production.temp["_flag_create"]||0;//创建产品标志位
		if(!ms.mod.production.temp["_flag_create"]){
		$(this).text("保存");
		var newTr=$("<tr class='unfinish' id='operationing'><td><input style='width:95%' /></td><td><input style='width:95%' /></td><td><input style='width:95%' /></td><td><input style='width:95%' /></td><td><input style='width:95%' /></td><td><input style='width:95%' /></td></tr>");
		newTr.hide().prependTo($("tbody:first")).fadeIn("fast");
		var cancelButton=$("<a id='production_bar_create_cancle'>").text("取消")
		.addClass("middleSection_bar_man white f14 block").hide();
		$("#production_bar_create").after(cancelButton.fadeIn("fast"));	
		ms.mod.production.temp["_flag_create"]=1;
		}
		else{
		$("#production_bar_create_cancle").remove();
		ms.queue.push({"execution":ms.mod.production.add,"arguments":"queue"+Date.now()});
		$(this).text("创建");
		}
	})
	//定义取消创建产品方法
	$("#middleSection").delegate("a#production_bar_create_cancle","click",function(e){
		$("tr.unfinish").remove();		
		$("#production_bar_create_cancle").remove();
		$("#production_bar_create").text("创建");
		ms.mod.production.temp["_flag_create"]=0;
	});
	//定义修改产品方法
	$("#middleSection").delegate("a#production_bar_modify","click",function(e){
		ms.mod.production.temp["_flag_modify"]=ms.mod.production.temp["_flag_modify"]||0;//修改产品标志位
		if(!ms.mod.production.temp["_flag_modify"]){
		$("#production_bar_delete").fadeOut("fast");
		$(this).text("保存");
		$("table.production tbody tr.trFocus").each(function(i,o){
			$(o).removeClass("trFocus").addClass("modify").find("td").each(function(i,o){
				var _text=$(o).text();
				$(o).html($("<input style='width:95%' />").val(_text));	
			})
		});
		ms.mod.production.temp["_flag_modify"]=1;
		}
		else{
			ms.queue.push({"execution":ms.mod.production.modify,"arguments":$("table.production tbody tr.modify").attr("id")});
			$(this).hide();
			$(this).text("修改");
		}
	});
	//定义删除产品方法
	$("#middleSection").delegate("a#production_bar_delete","click",function(e){
		$("#production_bar_modify").fadeOut("fast");
		var _deleteObject=[];
		$("table.production tbody tr.trFocus").each(function(i,o){
			_deleteObject.push(o.id)
		});
		$(this).hide();
		ms.queue.push({"execution":ms.mod.production.delete,"arguments":_deleteObject});
	});
	//定义加载更多条目方法
	$("#plugShow").delegate("#loadMore","click",function(e){
		if(ms.posistion=="production"){
		$(this).remove();
		ms.queue.push({"execution":ms.mod.production.displayData,"arguments":""});
	}
	});
	//定义选取条目行为
	$("#plugShow").delegate("table.production tbody tr:not(.unfinish):not(.modify)","click",function(e){
		$(this).toggleClass("trFocus");
		if($("table.production tr.trFocus").length>0){
			if($("table.production tr.trFocus").length==1){$("#production_bar_modify").fadeIn("fast")};
			if($("table.production tr.trFocus").length>1&&$("table.production tr.modify").length==0){$("#production_bar_modify").fadeOut("fast");}
			$("#production_bar_delete").fadeIn("fast");
		}
		else{
			if($("table.production tr.modify").length==0){$("#production_bar_modify").fadeOut("fast")};
			$("#production_bar_delete").fadeOut("fast");
		}
		ms.mod.production.updateStatusBar();//更新状态栏
	})
	//**DOM操作
	//创建导航条目
	$("<a>").text("产品资料")
	.addClass("plug")
	.attr("id","production_bar")
	.insertAfter($("#general_bar"))
	.wrap("<li></li>");
	//创建显示数据方法
	ms.mod.production.display=function(){
		if(!!!ms.mod.production.temp["template"]){
			$.get("template/mod.ms.production.html",function(data){
				$(data).appendTo("body");//记得修改
				ms.mod.production.decoration();
				ms.mod.production.temp["template"]=1;
		})
		}
		else{
		ms.mod.production.temp["currentObject"]=JSON.parse(localStorage.getItem("data.ms.production"));//关键更新数据，勿轻易移位
		ms.mod.production.decoration();
		}
	}
	//创建产品页外围显示，按钮，表头
	ms.mod.production.decoration=function(){
		//创建下部状态栏
		$("<div class='info' id='infoProduction'></div>")
		.text("共有产品条目")
		.prependTo($("#plugSideShow"));		
		//创建创建产品条目	
		$("<a id='production_bar_create'>")
		.text("创建")
		.addClass("middleSection_bar_man white f14 block")
		.appendTo($("#middleSection"));					
		//创建修改产品条目
		$("<a id='production_bar_modify'>")
		.text("修改")
		.addClass("middleSection_bar_man white f14 block")
		.hide()
		.appendTo($("#middleSection"))							
		//创建删除产品条目
		$("<a id='production_bar_delete'>")
		.text("删除")
		.addClass("middleSection_bar_sub white f14 block")
		.hide()
		.appendTo($("#middleSection"))
		//载入模板显示
		$("#plugShow").html($("#productionTemple_frame").tmpl());
		//执行状态栏
		ms.mod.production.updateStatusBar();
		//执行显示产品数据
		ms.mod.production.displayData();//不采用事务队列，减少视觉延缓
	};
	//显示产品条目方法
	ms.mod.production.displayData=function(step) {
		var _object=ms.mod.production.temp["currentObject"];
		var currentTrNumber=$("table.production tbody tr:not(.unfinish):not(.modify)").length;	
		var numberPerPage=25,flag2=0,_object_afterOperation=[];//设定每页显示25条
		var flag=numberPerPage;
		if(!!step){flag=numberPerPage-currentTrNumber};
		while(_object.length>0&&flag>0){
			_object_afterOperation[flag2]=_object.shift();
			flag--;
			flag2++;
		}
		var _object_display=$("#productionTemple_content").tmpl(_object_afterOperation).hide();
		$("tbody:first").append(_object_display.show());//插入方式
		console.log("the reaction of mod.production is:",Date.now()-ms.mod.production.getTime,"ms");///////////////////////////////////
		if(!!!step&&_object.length>0){$('<div id="loadMore">加载更多</div>').appendTo("#plugShow");}
		
	}
	//添加产品条目方法
	ms.mod.production.add=function(queue){
		var _addObject=[];
		$("#operationing input").each(function(i,o){
			var v=(o.value).trim()
			_addObject.push(v);
		});
		$("#operationing input").remove();
		///////////设置默认值///////////
		_addObject[0]=_addObject[0]||"空";
		_addObject[1]=_addObject[1]||"未命名";
		_addObject[2]=_addObject[2]||"";
		_addObject[3]=_addObject[3]||"";
		_addObject[4]=_addObject[4]||0;
		_addObject[5]=_addObject[5]||0;	
		////////////////////////////////
		$("#operationing td").each(function(i,o){
			$(o).text(_addObject[i]);
		});
		$("#operationing").attr("id",queue);
		ms.mod.production.temp["_flag_create"]=0;
		var postData={action:"add",num:_addObject[0],name:_addObject[1],size:_addObject[2],unit:_addObject[3],price:_addObject[4],store:_addObject[5]};
		$.post("mod/mod.ms.production.db.php",postData,function(data){
			data=data.trim()//清除回调数据前后留白
			var _object=JSON.parse(data);
			if(_object.return_productId>0){
				$("#"+queue).removeClass("unfinish").attr("id",_object.return_productId);
				_addObject.unshift("("+_object.return_productId+")");
				ms.queue.push({"execution":ms.mod.production.getJSON,"arguments":"1"});//重新获取产品信息
				ms.queue_record.push({"method":"production.add","param":_addObject});
			}			
		})
	}
	//修改产品条目方法
	ms.mod.production.modify=function(oid){
		var _modifyObject=[];
		$(".modify input").each(function(i,o){
			var v=(o.value).trim()
			_modifyObject.push(v);
		});
		$(".modify input").remove();
		///////////设置默认值///////////
		_modifyObject[0]=_modifyObject[0]||"空";
		_modifyObject[1]=_modifyObject[1]||"未命名";
		_modifyObject[2]=_modifyObject[2]||"";
		_modifyObject[3]=_modifyObject[3]||"";
		_modifyObject[4]=_modifyObject[4]||0;
		_modifyObject[5]=_modifyObject[5]||0;	
		////////////////////////////////
		$(".modify td").each(function(i,o){
			$(o).text(_modifyObject[i]);
		});
		ms.mod.production.temp["_flag_modify"]=0;
		var postData={action:"modify",id:oid,num:_modifyObject[0],name:_modifyObject[1],size:_modifyObject[2],unit:_modifyObject[3],price:_modifyObject[4],store:_modifyObject[5]};
		$.post("mod/mod.ms.production.db.php",postData,function(data){
			data=data.trim()//清除回调数据前后留白
			var _object=JSON.parse(data);
			if(_object.info=="succeed"){
				$("#"+oid).removeClass("modify");
				_modifyObject.unshift("("+oid+")");
				ms.queue.push({"execution":ms.mod.production.getJSON,"arguments":"1"});//重新获取产品信息
				ms.queue_record.push({"method":"production.modify","param":_modifyObject});
			}
		})	
	}
	//删除产品条目方法
	ms.mod.production.delete=function(idArray){
		var focusElement=$("table.production tbody tr.trFocus");
		var _log=[focusElement.length]
		focusElement.each(function(i,o){
			_log[i]=[];
			$(o).find("td").each(function(j,o){
				_log[i][j]=$(o).text();
			});
		})
		focusElement.fadeOut("normal");
		var postData={action:"delete","id":idArray};
		$.post("mod/mod.ms.production.db.php",postData,function(data){
			data=data.trim()//清除回调数据前后留白
			var _object=JSON.parse(data);
			if(_object.info=="succeed"){
			focusElement.remove();
			ms.queue_record.push({"method":"production.delete","param":_log});
			ms.queue.push({"execution":ms.mod.production.displayData,"arguments":focusElement.length});//删除条目后回填条目
			ms.queue.push({"execution":ms.mod.production.getJSON,"arguments":"1"});//重新获取产品信息
			}
		})
	}
	//产品状态栏方法
	ms.mod.production.updateStatusBar=function(){
		var trFocus=0;
		if($("tr.trFocus")!=undefined){
			var trFocus=$("tr.trFocus").length||0;
		}
		$("#infoProduction").text("共有产品信息"+JSON.parse(localStorage.getItem("data.ms.production")).length+"，当前选取了 "+trFocus)
	}	
}
ms.mod.production();
ms.mod.production.init(ms.level);