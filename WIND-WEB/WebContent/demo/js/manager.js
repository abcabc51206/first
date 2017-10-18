In.add('a1',{path:'lib/jQuery/jquery.layout-latest.js',type:'js',charset:'utf-8'});
In.add('a2',{path:'js/Tianditu.js',type:'js',charset:'utf-8',rely:['a1']});
In.add('a3',{path:'user/js/User.js',type:'js',charset:'utf-8',rely:['a2']});
In.add('a4',{path:'sysconf/js/Sysconf.js',type:'js',charset:'utf-8',rely:['a2']});
In.add('b',{path:'js/UI.js',type:'js',charset:'utf-8',rely:['a1','a2']});

In('a1','a2','a3','a4','b',function(){
	//登录信息
	var user = new User();
	var userInfo = user.getUserInfo();
	if(userInfo && userInfo.loginName){
		$(".unlogin").hide();
		$(".logined").show();
		$(".logined").find(".username").text(userInfo.userName);
	}
	//配置信息
	var sysConf = new Sysconf();
	var allConfValue = sysConf.getAllConf();
	if(allConfValue.length > 0){
		$.each(allConfValue, function(i, data){
			if(data.argsName == "portal"){
				$(".logo").append("<a href='"+data.argsValue+"/index1.html'></a>");
				$("#myInfo").attr("href",data.argsValue + "/user/page/userinfo.html");
				$("#modifypassword").attr("href",data.argsValue + "/user/page/modifypassword.html");
				//return false;
			} else if(data.argsName == "manager"){
				$("#manager-site").attr("href", data.argsValue);
			} else if(data.argsName == "securityGateway"){
				$("#security-gateway").attr("href", data.argsValue);
			}else if(data.argsName == "globeServer"){
				$("#globe-server-site").attr("href", data.argsValue);
			}
		});
	}
	Tianditu.showLevel(0,"首页","welcome.html");
	
	
});