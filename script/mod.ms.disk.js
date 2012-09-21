ms.mod.disk=function(){
	//*一次性初始化过程
	ms.mod.disk.temp=[];
	//*被多次调用的方法	
	//向服务器获取网盘盘符信息
	ms.mod.disk.getJSON=function(){
		$.get("mod/mod.ms.disk.list.php",function(data){
			data=data.trim()//清除回调数据前后留白
			localStorage.setItem("data.ms.disk.list",data);
		});
	};
	//向服务器获取网盘全部目录信息
	ms.mod.disk.getfileJSON=function(){
		$.get("mod/mod.ms.disk.file.php",function(data){
				data=data.trim()//清除回调数据前后留白
				localStorage.setItem("data.ms.disk.file",data);
				ms.modToShowMain["script/mod.ms.disk.js"]=true;
		});
	};

	ms.queue.push({"execution":ms.mod.disk.getJSON,"arguments":""});
	ms.queue.push({"execution":ms.mod.disk.getfileJSON,"arguments":""});	
}

ms.mod.disk.init=function(){
	//*一次性初始化过程
	//**一次性函数
	//创建盘符
	ms.mod.disk.addMenu=(function(){
	if($("#diskArea").length!=1){
	$("<div id='diskArea'><span>云端硬盘 - 读取中</span></div>").appendTo($("#plug ul:first"));}
	if(!localStorage.getItem("data.ms.disk.list")){setTimeout(arguments.callee,500);return false};
	ms.mod.disk.disk_list=JSON.parse(localStorage.getItem("data.ms.disk.list"),function(key,value){	
		if(ms.level==9||ms.level==8){return value;}
		if(ms.level==1||ms.level==11){
			if(key&&!isNaN(key)){
				if(this[key].diskField!=1){
					return undefined;
				}
			}
		}
		if(ms.level==2){
			if(key&&!isNaN(key)){
				if(this[key].diskField!=2){
					return undefined;
				}
			}
		}
		if(ms.level==3){
			if(key&&!isNaN(key)){
				if(this[key].diskField!=3){
					return undefined;
				}
			}
		}
		return value;
	});
	//创建函数用于重排过滤后的数组
	var resortArray=function(_array){
			var i=0,
				_array_length=_array.length,
				newArray=[];
			for(;_array_length;_array_length--,i++){
				if(_array[i]){newArray.push(_array[i])}
			}
			return newArray;
	}
	//重排盘符
	ms.mod.disk.disk_list=resortArray(ms.mod.disk.disk_list);
	var disk_list=ms.mod.disk.disk_list;
	for(var i=0;i<disk_list.length;i++){
		$("<a>").text(disk_list[i].diskName)
				.addClass("plug")
				.addClass("disk_list")
				.attr("id","diskField_"+disk_list[i].diskId)
				.appendTo($("#diskArea"))
				.wrap("<li></li>");
	};
	$("#diskArea span").text("云端硬盘")
	})()
	//创建网络硬盘外围显示，按钮，表头
	ms.mod.disk.decoration=(function(){
		$.get("template/mod.ms.disk.html",function(data){
			$(data).appendTo("body");
			ms.mod.disk.decoration=function(){
				$("#plugShow").html($("#diskTemple_frame").tmpl());
			}
		});
	})();
	//创建隐藏上传框
	$("<input id='uploadInput' type='file' multiple>").hide().appendTo("body");
	//**事件绑定
	//点击触发切换网盘模块方法
	$("#plug").delegate(".disk_list","click",function(){
		ms.mod.disk.getTime=Date.now();
		ms.clear();
		ms.posistion="disk";
		//创建创建目录按钮
		$("<a id='folder_bar_create'>")
		.text("创建目录")
		.addClass("middleSection_bar_man white f14 block")
		.appendTo($("#middleSection"));
		//创建上传文件按钮
		$("<a id='folder_bar_upload'>")
		.text("上传文件")
		.attr("title","支持拖曳上传")
		.addClass("middleSection_bar_man white f14 block")
		.appendTo($("#middleSection"));
		//创建重命名文件按钮
		$("<a id='file_bar_modify'>")
		.text("重命名")
		.hide()
		.addClass("middleSection_bar_man white f14 block")
		.appendTo($("#middleSection"));			
		//创建预览按钮
		$("<a id='file_bar_preview'>")
		.text("预览")
		.attr("title","使用Google文档进行预览")
		.hide()
		.addClass("middleSection_bar_man white f14 block")
		.appendTo($("#middleSection"));
		//创建删除文件按钮
		$("<a id='file_bar_delete'>")
		.text("删除")
		.hide()
		.addClass("middleSection_bar_sub white f14 block")
		.appendTo($("#middleSection"));
		ms.mod.disk.decoration();
		var currentTargetName=$(this).text();
		var diskField=(this.id).replace("diskField_","");
		ms.mod.disk.diskField=diskField;
		ms.mod.disk.nextParent=0;
		ms.mod.disk.diskOperation([ms.mod.disk.diskField,,currentTargetName]);//不采用事务队列，减少视觉延缓
	});
	//点击触发关闭上传进度框方法
	$("body").delegate("#closeProgress","click",function(e){
		e.preventDefault();
		$("#uploadProgress").slideUp("fast");
	});
	//点击最小化上传进度框方法
	$("body").delegate("#miniProgress","click",function(e){
		e.preventDefault();
		if($(this).text()=="隐藏"){$(this).text("显示");}
		else{$(this).text("隐藏");}
		$("#uploadProgress div.ul").animate({height:"toggle"},"fast");
	});
	
	//点击触发创建文件夹方法
	$("#middleSection").delegate("#folder_bar_create","click",function(e){
		if(!ms.mod.disk.temp["_flag_create"]){
		$(this).text("保存");
		var newTr=$("<tr class='unfinish' id='operationing'><td><input style='width:50%' /></td><td></td><td></td></tr>");
		newTr.hide().prependTo($("tbody:first")).fadeIn("fast");
		var cancelButton=$("<a id='folder_bar_create_cancle'>").text("取消")
		.addClass("middleSection_bar_man white f14 block").hide();
		$("#folder_bar_create").after(cancelButton.fadeIn("fast"));	
		ms.mod.disk.temp["_flag_create"]=1;
		}
		else{
		$("#folder_bar_create_cancle").remove();
		ms.queue.push({"execution":ms.mod.disk.addFolder,"arguments":"queue"+Date.now()});
		$(this).text("创建");
		}
	});
	//点击触发取消创建文件夹方法
	$("#middleSection").delegate("a#folder_bar_create_cancle","click",function(e){
		$("tr.unfinish").remove();		
		$("#folder_bar_create_cancle").remove();
		$("#folder_bar_create").text("创建目录");
		ms.mod.disk.temp["_flag_create"]=0;
	});
	//点击触发上传文件方法
	$("#middleSection").delegate("#folder_bar_upload","click",function(e){
		$("#uploadInput").trigger("click");	
	});
	//当隐藏文件框值改变时触发上传事件，被#folder_bar_upload点击触发
	$("body").delegate("#uploadInput","change",function(e){
		ms.mod.disk.uploadFile(this.files,ms.mod.disk.diskField,ms.mod.disk.nextParent);
	});
	//点击触发修改文件名方法
	$("#middleSection").delegate("#file_bar_modify","click",function(e){	
		if(!ms.mod.disk.temp["_flag_modify"]){
		$("#file_bar_delete").fadeOut("fast");
		$("#file_bar_preview").fadeOut("fast");
		$(this).text("保存");
		var focusElement=$("table.disk tbody tr.trFocus")[0];
		$(focusElement).removeClass("trFocus").addClass("modify");
		var focusElementInsertPlace=$(focusElement).find("td:first");
		ms.mod.disk.temp["argumentsUrl"]=$(focusElementInsertPlace).find("a:first").attr("href");
		var newPopWindow=$("<div></div>")
		.append($("<input type='text'/>").val(focusElementInsertPlace.text()));
		focusElementInsertPlace.html(newPopWindow);
		ms.mod.disk.temp["_flag_modify"]=1;
		}
		else{
			ms.queue.push({"execution":ms.mod.disk.fileModify,"arguments":[$("table.disk tbody tr.modify").attr("id"),ms.mod.disk.temp["argumentsUrl"]]});
			$(this).hide();
			$(this).text("修改");
		}
	});
	//点击触发预览文件方法
	$("#middleSection").delegate("a#file_bar_preview","click",function(e){
		var focusElement=$("table.disk tbody tr.trFocus a");
		var suffix=($(focusElement).attr("href")).split(".").pop();
		if(suffix=="doc"||suffix=="xls"||suffix=="ppt"||suffix=="pdf"){
			window.open(" http://docs.google.com/viewer?url="+window.location+"upload/"+$(focusElement).attr("href"));
		}
		$("table.disk tbody tr.trFocus").removeClass("trFocus");
		$(this).hide();
	});
	//点击触发删除文件方法
	$("#middleSection").delegate("#file_bar_delete","click",function(e){
		e.preventDefault();
		$("#file_bar_modify").fadeOut("fast");
		$("#file_bar_preview").fadeOut("fast");
		var _deleteObject=[];
		$("table.disk tbody tr.trFocus").each(function(i,o){
			_deleteObject.push(o.id)
		});
		$(this).hide();
		ms.queue.push({"execution":ms.mod.disk.fileDelete,"arguments":_deleteObject});
	});
	//定义选取条目行为
	$("#plugShow").delegate("table.disk tbody tr:not(.modify):not(.unfinish)","click",function(e){
		$(this).toggleClass("trFocus");
		if($("table.disk tr.trFocus").length>0){
			if($("table.disk tr.trFocus").length==1){
				$("#file_bar_modify").fadeIn("fast");
				var suffix=($("tr.trFocus a").attr("href")).split(".").pop();
				if(suffix=="doc"||suffix=="xls"||suffix=="ppt"||suffix=="pdf"){
				$("#file_bar_preview").fadeIn("fast");
			}
			}
			if($("table.disk tr.trFocus").length>1&&$("table.disk tr.modify").length==0){
				$("#file_bar_modify").fadeOut("fast");
				$("#file_bar_preview").fadeOut("fast");
			}
			$("#file_bar_delete").fadeIn("fast");
		}
		else{
			$("#file_bar_delete").fadeOut("fast");
			if($("table.disk tr.modify").length==0){
				$("#file_bar_modify").fadeOut("fast");
				$("#file_bar_preview").fadeOut("fast");
			}
		}
	});
	//定义点击条目行为
	$("#plugShow").delegate("tbody a","click",function(e){
		e.preventDefault();
		e.stopPropagation();
		$("#file_bar_delete").fadeOut("fast");
		$("#file_bar_modify").fadeOut("fast");
		var currentTarget=$(this);
		var currentTargetName=currentTarget.text();
		var currentTargetId=currentTarget.attr("id").replace("fileId_","");
		ms.mod.disk.nextParent=currentTargetId;
		var isFolder=((currentTarget.attr("href")).indexOf(".")==-1);
		if(isFolder){
			ms.queue.push({"execution":ms.mod.disk.diskOperation,"arguments":[ms.mod.disk.diskField,ms.mod.disk.nextParent,currentTargetName]});
		}
		else{
			window.open("upload/"+currentTarget.attr("href"));
		}
	});
	//定义点击触发面包屑路径行为
	$("#plugSideShow").delegate("#diskUrlBar a","click",function(e){
		e.preventDefault();	
		var currentTarget=$(this),
			diskField=currentTarget.attr("data-field"),
			diskFile=currentTarget.attr("data-file");
			ms.mod.disk.nextParent=diskFile;
		currentTarget.parent().nextAll().remove();//删除面包屑尾后元素
		ms.queue.push({"execution":ms.mod.disk.diskOperation,"arguments":[diskField,diskFile]});
	});
	//定义结束拖放行为
	$("#main").delegate("#plugShow","dragover",function(e){
		if(ms.posistion!="disk"){return false};
		var e=e.originalEvent;
		$("#plugShow").css({backgroundColor:"rgb(245,242,220)"})
		e.stopPropagation();
		e.preventDefault();
	});
	//定义离开拖放区域行为
	$("#main").delegate("#plugShow","dragleave",function(e){
		if(ms.posistion!="disk"){return false};
		var e=e.originalEvent;
		$("#plugShow").css({backgroundColor:""})
		e.stopPropagation();
		e.preventDefault();
	});
	//定义释放拖放区域行为
	$("#main").delegate("#plugShow","drop",function(e){
		if(ms.posistion!="disk"){return false};
		var e=e.originalEvent;
		$("#plugShow").css({backgroundColor:""});
		ms.mod.disk.uploadFile(e.dataTransfer.files,ms.mod.disk.diskField,ms.mod.disk.nextParent);
		e.stopPropagation();
		e.preventDefault();
	});
	//**创建节点
	//创建上传进度框
	var uploadProgress=$("<div id='uploadProgress'></div>")
	.append($("<div></div>").addClass("title").append($("<span>上传进度</span>")))
	.append($("<div></div>").addClass("ul"))
	.addClass("")
	.hide()
	.appendTo($("body"));
	$("<a id='closeProgress'></a>")
	.text("关闭")
	.appendTo($("#uploadProgress div.title"));	
	$("<a id='miniProgress'></a>")
	.text("隐藏")
	.appendTo($("#uploadProgress div.title"));
	//---------------------------------------------

	//*被多次调用的方法
	//打开文件操作
	ms.mod.disk.diskOperation=function(o){
		//创建面包屑导航栏
		var diskField=o[0],
			diskFile=o[1]||0,
			fileName=o[2];
			if($("#diskUrlBar").length==0){
				$("<ul id='diskUrlBar'></ul>").hide().appendTo($("#plugSideShow")).fadeIn("fast");
				};
			if(!!fileName){
				$("<a></a>")
				.text(fileName)
				.hide()
				.attr("title",fileName)
				.attr("href","view")
				.attr("data-field",diskField)
				.attr("data-file",diskFile)
				.appendTo($("#plugSideShow ul"))
				.wrap("<li></li>")
				.fadeIn("fast");
			}
		//-------------------------------------
		if(!!localStorage.getItem("data.ms.disk.file")){
			var data=localStorage.getItem("data.ms.disk.file");
			$("#plugShow table tbody").empty();
			var userName=ms.mod.user.jsonToArray();
			var filterJSON=JSON.parse(data,function(key,value){
					if(key&&!isNaN(key)){
				
						if(!((this[key].fileField==diskField)&&(this[key].fileParent==diskFile))){
							return undefined;
						}
					}
					if(key=="filePrivilege"){
						return userName[value];
					}
					if(key=="fileTime"){
						return value.slice(0,8);
					}
				
				//}
				return value;
			});
			var displayJSON=$("#disk_content").tmpl(filterJSON);
			$("tbody:first").append($(displayJSON).fadeIn("fast"));
			console.log("the reaction of mod.disk is:",Date.now()-ms.mod.disk.getTime,"ms");///////////////////////////////////
		}
	};
	//定义添加文件夹操作
	ms.mod.disk.addFolder=function(queue){
		var userName=ms.mod.user.jsonToArray();
		var _addObject=[];
		$("#operationing input").each(function(i,o){
			var v=(o.value).trim()
			_addObject.push(v);
		});
		$("#operationing input").remove();
		///////////设置默认值///////////
		_addObject[0]=_addObject[0]||"未命名";
		_addObject[1]=ms.userId;
		_addObject[2]=ms.getNow();
		////////////////////////////////
		$("#operationing td").each(function(i,o){
			if(i==0){$(o).html("<a>"+_addObject[i]+"</a>");return true;}
			if(i==1){$(o).html(userName[_addObject[i]]);return true;}
			if(i==2){$(o).html((_addObject[i]).slice(0,8));return true;}
			$(o).html(_addObject[i]);
		});
		$("#operationing").attr("id",queue);
		ms.mod.disk.temp["_flag_create"]=0;
		var postData={action:"addFolder",name:_addObject[0],"field":ms.mod.disk.diskField,"parent":ms.mod.disk.nextParent,"time":_addObject[2]};
		$.post("mod/mod.ms.disk.db.php",postData,function(data){
			data=data.trim()//清除回调数据前后留白
			var _object=JSON.parse(data);
			if(_object.return_folderId>0){
				$("#"+queue).find("a").attr("id","fileId_"+_object.return_folderId).attr("href","");
				$("#"+queue).removeClass("unfinish").attr("id",_object.return_folderId);
				_addObject.unshift("("+_object.return_folderId+")");
				ms.queue.push({"execution":ms.mod.disk.getfileJSON,"arguments":""});//重新获取文件信息
				ms.queue_record.push({"method":"disk.add","param":_addObject});
			}
			
		})
	};
	//定义上传文件操作
	ms.mod.disk.uploadFile=function(objectFiles,_diskField,_nextParent){
		var userName=ms.mod.user.jsonToArray();
		var files=objectFiles,files_length=files.length,counter=0;
		var MAX_SIZE=1024*1024*5;
		for(;counter<files_length;counter++){
			if(files[counter].type==""){
				$("#bottomTip span").html("<a>"+files[counter].name+" 上传不成功</a>")
				$("#bottomTip").slideDown("fast");
				setTimeout(function(){
					$("#bottomTip").slideUp("fast");
				},3000);				
				continue;
			}
			if(files[counter].size>MAX_SIZE){
				$("#bottomTip span").html("<a>"+files[counter].name+" 超出文件上传限制 <b>"+(MAX_SIZE/1024/1024)+"</b> MB</a>")
				$("#bottomTip").slideDown("fast");
				setTimeout(function(){
					$("#bottomTip").slideUp("fast");
				},3000);
				continue;
			}
			$("#uploadProgress").slideDown("fast");//弹出上传进度框	
			var formdata = new FormData();
			sendLockFlag=0;
			var dateNow=Date.now();
			var fileObject=files[counter];
			formdata.append("file",files[counter]);
			formdata.append("field",_diskField);
			formdata.append("parent",_nextParent);
			formdata.append("fileName",dateNow);
			var details=$("<ul></ul>").attr("id",dateNow);
			details.append($("<li></li>").html(fileObject.name))
			.append($("<li></li>").html($("<div class='progressBarOuter'><div class='progressBarInner'></div></div>")));
			details.prependTo("#uploadProgress div.ul");
			var xhr_provider = function(_dateNow){
			return function() {
				var onprogress=function(evt) {
					$("#"+_dateNow).find(".progressBarInner").css({width:Math.round(evt.position/evt.totalSize*100)+"%"});
					if(Math.round(evt.position/evt.totalSize*100)==100){$("#"+_dateNow).append($("<span></span>").text("完成"));}
				};
				var xhr = new XMLHttpRequest();
					if(onprogress && xhr.upload) {
						xhr.upload.addEventListener('progress', onprogress, false);
					}
				return xhr;
			}}(dateNow);
		$.ajax({
			url:"mod/mod.ms.disk.uploadFile.php",
			type:"post",
			contentType: false,
			data:formdata,
			processData:false,
 			xhr: xhr_provider,
			success:function(data,text,XHR){
				data=data.trim();
				
				var returnInfo=JSON.parse(data);	
				if(returnInfo.returnInfo=="succeed"){				
					ms.queue.push({"execution":ms.mod.disk.getfileJSON,"arguments":""});
					if((ms.posistion=="disk")&&(ms.mod.disk.diskField==_diskField)&&(ms.mod.disk.nextParent==_nextParent)){
						var newTr=$("<tr></tr>")
									.attr("id",returnInfo.returnId)
									.append($("<td></td>").html('<a id="fileId_'+returnInfo.returnId+'" href="'+returnInfo.returnUrl+'">'+returnInfo.returnName+'</a>'))
									.append($("<td></td>").html(userName[returnInfo.returnOwner]))
									.append($("<td></td>").html((returnInfo.returnTime).slice(0,8)));
						$("tbody:first").prepend(newTr);
					}
				}
						},
			error:function(){
				alert("网络连接出错")
			}
		});	
		}	
	};
	//定义文件修改操作
	ms.mod.disk.fileModify=function(o){
		var oid=o[0];
		var url=o[1];
		var _modifyObject=[];
		$(".modify input").each(function(i,o){
			var v=(o.value).trim()
			_modifyObject.push(v);
		});
		$(".modify input").remove();
		///////////设置默认值///////////
		_modifyObject[0]=_modifyObject[0]||"未命名";
		_modifyObject[2]=ms.getNow();
		////////////////////////////////
		$(".modify td").each(function(i,o){
			if(i==0){
				$(o).html($("<a>"+_modifyObject[0]+"</a>")
					.attr("id","fileId_"+oid)
					.attr("href",url));
				return true;
			}
			$(o).text(_modifyObject[i]);
		});
		ms.mod.disk.temp["_flag_modify"]=0;
		var postData={"action":"modify","id":oid,"name":_modifyObject[0],"time":_modifyObject[2]};
		$.post("mod/mod.ms.disk.db.php",postData,function(data){
			data=data.trim()//清除回调数据前后留白
			var _object=JSON.parse(data);
			if(_object.info=="succeed"){
				$("#"+oid).removeClass("modify");
				_modifyObject.unshift("("+oid+")");
				ms.queue.push({"execution":ms.mod.disk.getfileJSON,"arguments":""});//重新获取文件信息
				ms.queue_record.push({"method":"disk.modify","param":_modifyObject});
			}
		})
	};
	//定义删除文件操作
	ms.mod.disk.fileDelete=function(idArray){
		var focusElement=$("table.disk tbody tr.trFocus");
		var _log=[focusElement.length]
		focusElement.each(function(i,o){
			_log[i]=[];
			$(o).find("td").each(function(j,o){
				_log[i][j]=$(o).text();
			});
		});
		focusElement.fadeOut("normal");
		var postData={action:"delete","id":idArray};
		$.post("mod/mod.ms.disk.db.php",postData,function(data){
			data=data.trim()//清除回调数据前后留白
			var _object=JSON.parse(data);
			if(_object.info=="succeed"){
			focusElement.remove();
			ms.queue_record.push({"method":"diskFile.delete","param":_log});
			ms.queue.push({"execution":ms.mod.disk.getfileJSON,"arguments":""});//重新获取信息
			}
		})
	};
};
ms.mod.disk();
ms.mod.disk.init();