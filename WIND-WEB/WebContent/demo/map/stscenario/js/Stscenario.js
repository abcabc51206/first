/**
 * 专题方案授权模块对象
 * @author wsd
 * @version 1.0 2013/3/14
 */
 
 (function(){
var Stscenario = window.Stscenario = function(){
		return new Stscenario.fn.init();
	};
	
	Stscenario.url = {
		findMySpecialTopicScenario : "stScenario/findMySpecialTopicScenario.do",
		searchMySpecialTopicScenario : "stScenario/searchMySpecialTopicScenario.do",
		findStsUserPerm : "stScenario/findStsUserPerm.do",
		searchStsUserPerm : "stScenario/searchStsUserPerm.do",
		authorizeStsToUser : "stScenario/authorizeStsToUser.do",
		findStsRolePerm : "stScenario/findStsRolePerm.do",
		searchStsRolePerm : "stScenario/searchStsRolePerm.do",
		authorizeStsToRole : "stScenario/authorizeStsToRole.do",
		viewStsOrgPerm : "stScenario/viewStsOrgPerm.do",
		authorizeStsToOrg : "stScenario/authorizeStsToOrg.do"
	};

	
	//初始当前页
	Stscenario.pageNum = 1;
	
	//当前页记录条数
	Stscenario.pageSize = 10;
	
	Stscenario.fn = Stscenario.prototype = {
	
		/**
		 * 初始化
		 */
		init:function(){
			return this;
		},
		
		/**
		 * 获取我的专题方案
		 */
		findMySpecialTopicScenario : function(){
			var url = Stscenario.url["findMySpecialTopicScenario"];
			var params = "pageNum="+Stscenario.pageNum+"&pageSize="+Stscenario.pageSize;
			TDT.getDS(url,params,true,function(json){
				if(json.result){
					if(json.stScenarioList.length>0 ){
						Stscenario.fn.bindScenarioList(json.stScenarioList,"stscenario");
						var pagerObj = document.getElementById("pager");
						TDT.pager(Stscenario.pageNum, Stscenario.pageSize, json.page.recordCount, pagerObj, function(p){
							Stscenario.pageNum = p;
							Stscenario.fn.findMySpecialTopicScenario();
						});
						$("#nomessage").hide();	
					}
				} else {
					$("#stscenarioList").html("");
					$("#nomessage").show();	
					$("#pager").html("");
				}
			});
			
		},
		
		/**
		 * 搜索方案
		 * @param keyword 关键字（方案名称）
		 * @param type 方案类型
		 */
		searchMySpecialTopicScenario : function(keyword){
			var url = Stscenario.url["searchMySpecialTopicScenario"];
			var params = "keyword="+keyword+"&pageNum="+Stscenario.pageNum+"&pageSize="+Stscenario.pageSize;
			TDT.getDS(url,params,true,function(json){
				if(json.result){
					if(json.stScenarioList.length>0 ){
						Stscenario.fn.bindScenarioList(json.stScenarioList,"stscenario");
						var pagerObj = document.getElementById("pager");
						TDT.pager(Stscenario.pageNum, Stscenario.pageSize, json.page.recordCount, pagerObj, function(p){
							Stscenario.pageNum = p;
							Stscenario.fn.searchByKeyAndType(keyword, type);
						});
						$("#nomessage").hide();	
					}
				} else {
					$("#stscenarioList").html("");
					$("#nomessage").show();		
					$("#pager").html("");
				}
			});
			
		},
		
		/**
		 * 绑定专题方案列表
		 */
		bindScenarioList : function(json, key){
			var list = $("#"+key+"List");
			var html = [];
			list.html("");
			var template = $("#"+key+"Template");
			var temp = template.html();
			
			$.each(json,function(i,data){
		        var row = temp;
		        row = row.replace(/\%{rowid}%/g, data.id);
				row = row.replace(/\%{name}%/g, data.usName || "");
				row = row.replace(/\%{createTime}%/g, (data.createTime).replace("T","&nbsp;&nbsp;"));
				row = row.replace(/\%{desc}%/g, TDT.strCut(data.usScRemark,20));
				html.push(row);
			});
			list.html(html.join(""));
		},
		
		/**
		 * 获取用户权限
		 * @param stsId 专题方案ID
		 */
		getStsUserPerm : function(stsId){
			var url = Stscenario.url["findStsUserPerm"];
			var params = "scenarioId="+stsId+"&pageNum="+Stscenario.pageNum+"&pageSize=1000000000";
			TDT.getDS(url,params,false,function(json){
				if(json.result && json.result.length > 0){
					Stscenario.fn.bindUserList(json.result,"user");
				} else{
					$("#userList").html("");
					$("#pager").html("");
					$("#noData").show();
				}
			});
			
		},
		
		/**
		 * 搜索用户权限
		 * @param stsId 专题方案ID
		 * @param keyword 搜索关键字
		 */
		searchStsUserPerm : function(stsId, keyword){
			var url = Stscenario.url["searchStsUserPerm"];
			var params = "scenarioId="+stsId+"&keyword="+keyword+"&pageNum="+Stscenario.pageNum+"&pageSize=1000000000";
			TDT.getDS(url,params,false,function(json){
				if(json.result && json.result.length > 0){
					Stscenario.fn.bindUserList(json.result,"user");
				} else{
					$("#userList").html("");
					$("#pager").html("");
					$("#noData").show();
				}
			});
			
		},
		
		/**
		 * 给专题图授予用户
		 * @param stsId 专题方案ID
		 * @param userIds 用户ID集合
		 */
		authorizeStsToUser : function(stsId, userIds){
			var url = Stscenario.url["authorizeStsToUser"];
			var params = "scenarioId="+stsId+"&userIds="+userIds;
			TDT.getDS(url,params,true,function(json){
				if(json.result){
					TDT.baseDialog("授权成功，是否继续授权？", "确认并继续授权", "返回列表", function(){
	    			},
	    			function(){
	    				TDT.go('stscenario.html');
	    			});
				}
			});
		},
		
		/**
		 * 绑定用户权限列表数据
		 */
		bindUserList : function(json, key){
			var list = $("#"+key+"List");
			var html = [];
			list.html("");
			var template = $("#"+key+"Template");
			var temp = template.html();
			$.each(json,function(i,data){   
		        var row = temp;
		        if(data.isUserPerm == true){
		        	row = row.replace(/\%{checked}%/g, "checked='checked'");
		        }
		        row = row.replace(/\%{rowid}%/g, data.userId);
				row = row.replace(/\%{userLoginName}%/g, data.userLoginName);
				row = row.replace(/\%{userName}%/g, data.userName);
				row = row.replace(/\%{email}%/g, data.userEmail);
				row = row.replace(/\%{userCreateTime}%/g, TDT.formatTime(data.userCreateTime));
				html.push(row);
			});
			list.html(html.join(""));
		},
		
		/**
		 * 获取角色权限
		 * @param stsId 专题方案ID
		 */
		getStsRolePerm : function(stsId){
			var url = Stscenario.url["findStsRolePerm"];
			var params = "scenarioId="+stsId+"&pageNum="+Stscenario.pageNum+"&pageSize=1000000000";
			TDT.getDS(url,params,false,function(json){
				if(json.result && json.result.length > 0){
					Stscenario.fn.bindRoleList(json.result,"role");
				} else{
					$("#roleList").html("");
					$("#pager").html("");
					$("#noData").show();
				}
			});
			
		},
		
		/**
		 * 搜索角色权限
		 * @param stsId 专题方案ID
		 * @param keyword 搜索关键字
		 */
		searchStsRolePerm : function(stsId, keyword){
			var url = Stscenario.url["searchStsRolePerm"];
			var params = "scenarioId="+stsId+"&keyword="+keyword+"&pageNum="+Stscenario.pageNum+"&pageSize=1000000000";
			TDT.getDS(url,params,false,function(json){
				if(json.result && json.result.length > 0){
					Stscenario.fn.bindRoleList(json.result,"role");
				} else{
					$("#roleList").html("");
					$("#pager").html("");
					$("#noData").show();
				}
			});
			
		},
		
		/**
		 * 给专题图授予角色
		 * @param stsId 专题方案ID
		 * @param roleIds 用户ID集合
		 */
		authorizeStsToRole : function(stsId, roleIds){
			var url = Stscenario.url["authorizeStsToRole"];
			var params = "scenarioId="+stsId+"&roleIds="+roleIds;
			TDT.getDS(url,params,true,function(json){
				if(json.result){
					TDT.baseDialog("授权成功，是否继续授权？", "确认并继续授权", "返回列表", function(){
	    			},
	    			function(){
	    				TDT.go('stscenario.html');
	    			});
				}
			});
		},
		
		/**
		 * 绑定角色权限列表数据
		 */
		bindRoleList : function(json, key){
			var list = $("#"+key+"List");
			var html = [];
			list.html("");
			var template = $("#"+key+"Template");
			var temp = template.html();
			$.each(json,function(i,data){   
		        var row = temp;
		        if(data.isRolePerm == true){
		        	row = row.replace(/\%{checked}%/g, "checked='checked'");
		        }
		        row = row.replace(/\%{rowid}%/g, data.roleId);
				row = row.replace(/\%{roleName}%/g, (data.roleName).replace("ROLE_","") || "");
				row = row.replace(/\%{roleRemark}%/g, TDT.strCut(data.roleRemark,20));
				html.push(row);
			});
			list.html(html.join(""));
		},
		
		/**
		 * 获取专题方案机构权限树
		 * @param loginName 用户登录账号
		 */
		getStsOrgPermTree : function(scenarioId){
			var url = TDT.getAppPath(Stscenario.url["viewStsOrgPerm"]);
			art.dialog({
			    title: '赋予机构权限',
			    resize: false,
			    content: $("#stscenario-orgPerm-panel").html(),
			    ok: function(){
			    	var node = $("#tree-container").dynatree("getRoot");
			    	// Display list of selected nodes
			        var selNodes = node.tree.getSelectedNodes();
			        // convert to title/key array
			        var selKeys = $.map(selNodes, function(node){
			        	 if(node.data.id != "root"){
				             return node.data.id;
			        	 }
			        });
			        $("#orgIds").val(selKeys.join(","));
			    	$("#scenarioId").val(scenarioId);
			    	Stscenario.fn.authorizeStsToOrg();
			    	return false;
			    },
			    cancel: function(){
			    	return true;
			    }
			});
			$("#tree-container").dynatree({
					checkbox: true,
					selectMode: 2,
					onLazyRead : function(node){
						node.appendAjax({
				            debugLazyDelay: 0,
				            url : url,
				            data : {parentId : node.data.id, "scenarioId": scenarioId},
				            success : function(node){
				            	if(node.childList && node.childList.length > 0){
				            		for(var i=0; i< node.childList.length; i++){
										node.childList[i].toggleExpand();
				            		}
								}
				            }
				    	});
					},
				children : [{title:"权限资源","isFolder": false, "isLazy": true, id:"root"}]
			});
			var rootNode = $("#tree-container").dynatree("getRoot");
			if(rootNode.childList.length > 0){
				rootNode.childList[0].toggleExpand();
			}
			
		},
		/**
		 * 给专题方案授予机构权限
		 * @param scenarioId 专题方案ID
		 * @param permIds 资源权限ID集合
		 */
		authorizeStsToOrg : function(){
			var url = Stscenario.url["authorizeStsToOrg"];
			TDT.formSubmit("stscenarioPermForm",url, null, true, function(json){
				if(json.result){
	    			TDT.baseDialog("授权成功，是否继续授权？", "确认并继续授权", "返回列表", function(){
	    			},
	    			function(){
	    				TDT.go('stscenario.html');
	    			});
				}
			});
		}
		
	};
	Stscenario.fn.init.prototype = Stscenario.fn;
 })();