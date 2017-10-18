/**
 * 通用配置模块对象
 * @author 朱泽江
 * @version 1.0 2012/7/31
 */
 
 (function(){
var Sysconf = window.Sysconf = function(){
		return new Sysconf.fn.init();
	};
	
	Sysconf.url = {
		getAll : "sysconf/findAllByPage.do",
		add:"sysconf/addSysconf.do",
		del:"sysconf/delSysconf.do",
		findById:"sysconf/findById.do",
		update:"sysconf/updateSysconf.do",
		searchByKey:"sysconf/searchByKey.do"
	};
	Sysconf.validateErrorImgSrc = "../images/error.gif";
	
	Sysconf.cityInfo={};//中心城市信息
	
	//表单验证提示信息
	Sysconf.validateTip = {
		
		argsName : {
			empty : "名称不能为空，请输入",
			length : "标题长度不能超过50个字符"
		},
		
		argsValue : {
			empty : "配置值不能为空，请输入",
			length : "链接地址长度不能超过100个字符"
		}
	};
	
	//初始当前页
	Sysconf.pageNum = 1;
	
	//当前页记录条数
	Sysconf.pageSize = 10;
	
	Sysconf.fn = Sysconf.prototype = {
	
		/**
		 * 初始化
		 */
		init:function(){
			return this;
		},
		/**
		 * 新增通用配置
		 */
		addSysconf : function(){
			var url = Sysconf.url["add"];
			var isValidate = this.validateSysconfForm();
			if(isValidate){
				TDT.formSubmit("sysconfAddForm",url, null, true, function(json){
					if(json.result){
		    			TDT.baseDialog("操作成功！", "确认并继续添加", "返回列表", function(){
		    				TDT.go('sysconf-add.html');
		    			}, 
		    			function(){
		    				TDT.go('sysconf.html');
		    			});
					}
				});
			}
		},
		/**
		 * 删除配置信息
		 */
		delsysconf:function(ids){
			var url = Sysconf.url["del"];
			var params = "ids="+ids;
			TDT.getDS(url,params,true,function(json){
				if(json.result){
					TDT.go("sysconf.html");
				}
			});
		},
		//提交更新表单
		updateSysconf:function(){
			var url = Sysconf.url["update"];
			var isValidate = this.validateSysconfForm();
			if(isValidate){
				TDT.formSubmit("sysconfUpdateForm",url, null, true, function(json){
					if(json.result){
		    			TDT.go('sysconf.html');
					}
				});
			}
		},
		findById:function(id,type){
			var url = Sysconf.url["findById"];
			var params = "sysconf.id="+id;
			TDT.getDS(url,params,true,function(json){
				if(json.result){
					Sysconf.fn.bindSysconfEdit(json.sysconf,type);
				}
			});
		
		},
		
		/**
		 * 获取所有配置
		 */
		getAllConf : function(){
			var url = Sysconf.url["getAll"];
			var params = "pageNum=1&pageSize=100000";
			var allConfValue;
			TDT.getDS(url,params,false,function(json){
				if(json.result){
					allConfValue = json.sysconfList;
				}
			});
			return allConfValue;
		},
		
		saveSysMailConf : function(){
			var url = Sysconf.url["update"];
			var sysconfId = $("#sysconf-id").val();
			var sysconfName = $("#sysconf-name").val();
			var sysconfValueJson = {};
			sysconfValueJson["mailServerHost"] = $("#mailServerHost").val();
			sysconfValueJson["mailServerPort"] = $("#mailServerPort").val();
			sysconfValueJson["isEnable"] = $("#isEnable").val() == "true" ? true : false;
			sysconfValueJson["isValidate"] = $("#isValidate").val() == "true" ? true : false;
			sysconfValueJson["userName"] = $("#userName").val();
			sysconfValueJson["password"] = $("#password").val();
			var adminEmailsArr = $("#adminEmails").val().split(",");
			//Sysconf.fn.compereEmail(adminEmailsArr);
			for(var i=0;i<adminEmailsArr.length;i++){
				var filter  = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
				var mail = adminEmailsArr[i];
				if (filter.test(mail)){
					
				}else{
					TDT.alert("管理员邮箱格式不正确！");
					return;
				}
			}
			sysconfValueJson["adminEmails"] = adminEmailsArr;
			sysconfValueJson["subject"] = $("#subject").val();
			var params = "sysconf.id="+sysconfId+"&sysconf.argsName="+sysconfName+"&sysconf.argsValue="+$.toJSON(sysconfValueJson);
			TDT.getDS(url, params, false, function(json){});
			TDT.alert("恭喜您，更新成功！");
		},
		
		compereEmail : function(emailArray){
			for(var i=0;i<emailArray.length;i++){
				var filter  = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
				var mail = emailArray[i];
				if (filter.test(mail)){
					
				}else{
					TDT.alert("邮箱格式不正确！");
					return;
				}
			}			 
		},
		
		saveSysBasicConf : function(){
			var url = Sysconf.url["update"];
			TDT.formSubmit("portalConfForm",url, null, false, function(json){});
			TDT.formSubmit("resourceCenterConfForm",url, null, false, function(json){});
			TDT.formSubmit("managerConfForm",url, null, false, function(json){});
			TDT.formSubmit("globeServerConfForm",url, null, false, function(json){});
			TDT.formSubmit("securityGatewayConfForm",url, null, false, function(json){});
			if(Sar.selTree){
				var cityId = $("#"+Sar.selTree.hid).val();
				var currCityConf = Sar.fn.findByIdBySyn(cityId);
				var json = {};
				json["name"] = currCityConf.areaName;
				json["lon"] = currCityConf.lon;
				json["lat"] = currCityConf.lat;
				json["zoom"] = currCityConf.zoom;
				json["proId"] = currCityConf.id;
				$("#cityConf-sysconf-value").val($.toJSON(json));
				TDT.formSubmit("cityConfForm",url, null, false, function(json){});
			}
			
			TDT.alert("恭喜您，更新成功！");
		},
		
		getBasicConf : function(){
			var sv = this.getAllConf();
			this.bindSysBasicConf(sv);
		},
		
		getMailConf : function(){
			var sv = this.getAllConf();
			this.bindSysMailConf(sv);
		},
		
		/**
		 * 分页获取示通用配置列表
		 */
		findAllByPage : function(){
			var url = Sysconf.url["getAll"];
			var params = "pageNum="+Sysconf.pageNum+"&pageSize="+Sysconf.pageSize;
			TDT.getDS(url,params,true,function(json){
				if(json.result){
					if(json.sysconfList.length>0 ){
						Sysconf.fn.bindSysconfList(json.sysconfList,"sysconf");
						var pagerObj = document.getElementById("pager");
						TDT.pager(Sysconf.pageNum, Sysconf.pageSize, json.page.recordCount, pagerObj, function(p){
							Sysconf.pageNum = p;
							Sysconf.fn.findAllByPage();
						});
						$("#nomessage").hide();	
					}
				} else {
					$("#sysconfList").html("");
					$("#nomessage").show();		
					$("#pager").html("");
				}
			});
			
		},
		validateSysconfForm:function(){
			var argsName = $("#sysconf-argsName");
			var argsValue = $("#sysconf-argsValue");
			
			if(argsName.val() ==""){
				argsName.parents("td").find(".required").html("<img src='"+Sysconf.validateErrorImgSrc+"'/>"+Sysconf.validateTip.argsName.empty);
				argsName.focus(function(){
					$(this).parents("td").find(".required").html("");
				});
				return false;
			}
			if(argsValue.val() == ""){
				argsValue.parents("td").find(".required").html("<img src='"+Sysconf.validateErrorImgSrc+"'/>"+Sysconf.validateTip.argsValue.empty);
				argsValue.focus(function(){
					$(this).parents("td").find(".required").html("");				
				});
				return false;
			}
			return true;
		},
		searchByKey:function(keyWords){
			var url = Sysconf.url["searchByKey"];
			var params = "keyWords="+keyWords+"&pageNum="+Sysconf.pageNum+"&pageSize="+Sysconf.pageSize;
			TDT.getDS(url,params,true,function(json){
				if(json.result){
					if(json.sysconfList.length>0){
						Sysconf.fn.bindSysconfList(json.sysconfList,"sysconf");
						var pagerObj = document.getElementById("pager");
						TDT.pager(Sysconf.pageNum, Sysconf.pageSize, json.page.recordCount, pagerObj, function(p){
							Sysconf.pageNum = p;
							Sysconf.fn.searchByKey();
						});
						$("#nomessage").hide();
					}
				}else {
					$("#sysconfList").html("");
					$("#nomessage").show();		
					$("#pager").html("");
				}
			});
		},
		bindSysconfEdit:function(data,type){
			if(type == "edit"){
				$("#sysconf-argsName").val(data.argsName);
				$("#sysconf-argsValue").val(data.argsValue);
				$("#sysconf-argsDesc").val(data.argsDesc);
				$("#sysconf-id").val(data.id);
			}else {
				$("#sysconf-argsName").html(data.argsName);
				$("#sysconf-argsValue").html(data.argsValue);
				$("#sysconf-argsDesc").html(data.argsDesc);
			}
		},
		
		bindSysMailConf : function(json){
			$.each(json,function(i,data){
				if(data.argsName == "mailConf"){
					var mailConf = data.argsValue;
					var jsonObj = $.evalJSON(mailConf);
					$("#sysconf-id").val(data.id);
					$("#sysconf-name").val(data.argsName);
					$("#mailServerHost").val(jsonObj.mailServerHost);
					$("#mailServerPort").val(jsonObj.mailServerPort);
					$("#isEnable").val(jsonObj.isEnable == true ? "true" : "false");
					$("#isValidate").val(jsonObj.isValidate == true ? "true" : "false");
					$("#userName").val(jsonObj.userName);
					$("#password").val(jsonObj.password);
					$("#adminEmails").val(jsonObj.adminEmails.join(","));
					$("#subject").val(jsonObj.subject);
				}
			});
		},
		
		bindSysBasicConf : function(json){
			$.each(json,function(i,data){
				if(data.argsName == "portal"){
					$("#portal-sysconf-id").val(data.id);
					$("#portal-sysconf-name").val(data.argsName);
					$("#portal-sysconf-value").val(data.argsValue);
				} else if(data.argsName == "resourceCenter"){
					$("#resourceCenter-sysconf-id").val(data.id);
					$("#resourceCenter-sysconf-name").val(data.argsName);
					$("#resourceCenter-sysconf-value").val(data.argsValue);
				} else if(data.argsName == "manager"){
					$("#manager-sysconf-id").val(data.id);
					$("#manager-sysconf-name").val(data.argsName);
					$("#manager-sysconf-value").val(data.argsValue);
				} else if(data.argsName == "globeServer"){
					$("#globeServer-sysconf-id").val(data.id);
					$("#globeServer-sysconf-name").val(data.argsName);
					$("#globeServer-sysconf-value").val(data.argsValue);
				} else if(data.argsName == "securityGateway"){
					$("#securityGateway-sysconf-id").val(data.id);
					$("#securityGateway-sysconf-name").val(data.argsName);
					$("#securityGateway-sysconf-value").val(data.argsValue);
				} else if(data.argsName == "cityConf"){
					$("#cityConf-sysconf-id").val(data.id);
					$("#cityConf-sysconf-name").val(data.argsName);
					$("#cityConf-sysconf-value").val(data.argsValue);
					var jsonConf =$.evalJSON(data.argsValue);
					if(Sar.selTree){
						Sar.selTree.addValue(jsonConf.name, jsonConf.proId);
					}
				} 
			});
		},
		
		/*
		 * 绑定 通用配置数据列表
		 */
		bindSysconfList : function(json, key){
			var list = $("#"+key+"List");
			var html = [];
			list.html("");
			var template = $("#"+key+"Template");
			var temp = template.html();
			
			$.each(json,function(i,data){
		        var row = temp;
		        row = row.replace(/\%{rowid}%/g, data.id);
				row = row.replace(/\%{name}%/g, data.argsName || "");
				row = row.replace(/\%{value}%/g, data.argsValue || "");
				row = row.replace(/\%{desc}%/g, TDT.strCut(data.argsDesc,20));
				html.push(row);
			});
			list.html(html.join(""));
		}
	};
	Sysconf.fn.init.prototype = Sysconf.fn;
 })();