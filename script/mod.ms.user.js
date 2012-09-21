ms.mod.user=function(){
	//*被多次调用的方法
	//**脚手架方法
	//把系统用户信息存储为JSON字符串到localStronge("data.ms.user")中
	ms.mod.user.getJSON=function(){
		$.get("mod/mod.ms.user.php",function(data){
			data=data.trim()
			localStorage.setItem("data.ms.user",data);
			ms.modToShowMain["script/mod.ms.user.js"]=true;
		})
	}
	//把系统用户信息从JSON字符串转换为数组，其中过滤用户帐户和用户级别
	ms.mod.user.jsonToArray=function(){
		var newArray=[];
		var originalArray=JSON.parse(localStorage.getItem("data.ms.user"),function(i,v){
			if(i=="userAccount"){return undefined;}
			if(i=="userClass"){return undefined;}
			return v
		});
		for(var i=0;i<originalArray.length;i++){
			newArray[originalArray[i].userId]=originalArray[i].userName;
		}
		return newArray
	}
	//*初始化推入事务队列
	ms.queue.push({"execution":ms.mod.user.getJSON,"arguments":""});
}

ms.mod.user.init=function(){
}

ms.mod.user();
ms.mod.user.init();