/**
 * 用户模块对象
 * @author wangshoudong
 * @version 1.0 2012/8/6
 */
 
(function(){
var User = window.User = function(){
		return new User.fn.init();
	};
	
	User.url = {
		getAll : "user/findAllByPage.do",
		getUserInfo : "user/getUserInfo.do",
		search : "user/searchByKey.do",
		getUserRole : "user/viewUserRole.do",
		add : "user/addUser.do",
		update : "user/updateUser.do",
		modifyPwd : "user/modifyPwd.do",
		initializePwd : "user/initializePwd.do",
		authorizeRoleToUser : "user/authorizeRoleToUser.do",
		authorizePermToUser : "user/authorizePermToUser.do",
		viewUserPerm :　"user/viewUserPerm.do",
		enabled : "user/enabledUser.do",
		disabled : "user/disabledUser.do",
		view : "user/viewUser.do",
		checkLoginName : "user/checkLoginName.do",
		del : "user/deleteUser.do"
		
	};
	 
	
	//初始当前页
	User.pageNum = 1;
	
	//当前页记录条数
	User.pageSize = 10;
	
 	User.validateErrorImgSrc = "../images/error.gif";
	
	//表单验证提示信息
	User.validateTip = {
		loginName : {
			empty : "登录账号不能为空，请输入",
			length : "登录账号5-20位字母、数字或下划线组合，首字符必须为字母",
			duplicate : "账号已存在，请重新输入"
		},
		
		email : {
			empty : "邮箱地址不能为空，请输入",
			verify : "邮箱地址不正确，例如：example@163.com"
		},
		
		password : {
			empty : "密码不能为空，请输入",
			length : "密码长度需大于6位"
		},
		
		password2 : {
			empty : "确认密码不能为空，请输入",
			unsame : "密码不一致，请重新输入"
		}
	};
	
	User.fn = User.prototype = {
	
		/**
		 * 初始化
		 */
		init:function(){
			return this;
		},
		
		getUseStatus : function(flag){
			if(flag == "0"){
				return "停用";
			} else if(flag == "1"){
				return "正常";
			}
		},
		
		/**
		 * 新增用户
		 */
		addUser : function(){
		 	var url = User.url["add"];
			var isValidate = this.validateUserForm();
			if(isValidate){
				TDT.formSubmit("userAddForm",url, null, true, function(json){
					if(json.result){
						TDT.baseDialog("操作成功！", "确认并继续添加", "返回列表", function(){
		    				TDT.go('user-add.html');
		    			},
		    			function(){
		    				TDT.go('user.html');
		    			});
					}
				});
			}
		},
		
		/**
		 * 更新用户
		 */
		updateUser : function(){
			var url = User.url["update"];
			
			//邮箱地址
			var jqEmail = $("#user-userEmail");
			var email = jqEmail.val();
			if(email == ""){
				jqEmail.parents("td").find(".required").html("<img src='"+User.validateErrorImgSrc+"'/>"+User.validateTip.email.empty);
				jqEmail.focus(function(){
					$(this).parents("td").find(".required").html("");
				});
				return false;
			} else {
				var reg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/
				var r = email.match(reg);
				if(!r){
					jqEmail.parents("td").find(".required").html("<img src='"+User.validateErrorImgSrc+"'/>"+User.validateTip.email.verify);
					jqEmail.focus(function(){
						$(this).parents("td").find(".required").html("");
					});
					return false;
				}
			}
			
			
			TDT.formSubmit("userUpdateForm",url, null, true, function(json){
				if(json.result){
					TDT.go("user.html");
				}
			});
		},
		
		/**
		 * 获取用戶登录信息
		 */
		getUserInfo : function(){
			var url = User.url["getUserInfo"];
			var userInfo;
			TDT.getDS(url,null,false,function(json){
				userInfo = json;
			});
			return userInfo;
		},
		
		/**
		 * 初始化密码
		 */
		initializePwd : function(ids){
			var url = User.url["initializePwd"];
			var params = "ids="+ids;
			TDT.getDS(url,params,true,function(json){
				if(json.result){
					TDT.alert("密码初始化成功，密码为000000");
				} else{
					TDT.alert("密码初始化失败，请联系管理员。");
				}
			});
		},
		
		/**
		 * 修改密码
		 */
		modifyPwd : function(){
			var loginName = $("#user-loginname").val();
			$("#m-user-loginname").val(loginName);
			var url = User.url["modifyPwd"];
			art.dialog({
			    title: '修改密码',
			    content: $("#modify-password").html(),
			    ok: function(){
			    	var isValidate = User.fn.validateModifyPwdForm("pwdUpdateForm");
			    	if(isValidate){
			    		var success = false;
			    		TDT.formSubmit("pwdUpdateForm",url, null, false, function(json){
			    			success = json.result;
						});
						if(success){
							TDT.alert("修改成功！");
				    		return true;
						}else{
							TDT.alert("原始密码不正确，请重新输入！");
							return false;
						}
			    	} else{
			    		return false;
			    	}
			    },
			    cancel: function(){
			    	return true;
			    }
			});
		},
		
		/**
		 * 给用户授予角色
		 * @param loginName 用户登录账号
		 * @param roleIds 角色ID集合
		 */
		authorizeRoleToUser : function(loginName, roleIds){
			var url = User.url["authorizeRoleToUser"];
			var params = "user.userLoginName="+loginName+"&roleIds="+roleIds;
			TDT.getDS(url,params,true,function(json){
				if(json.result){
					TDT.alert("恭喜您，授权成功！");
				}
			});
		},
		
		/**
		 * 给用户授予权限资源
		 * @param loginName 用户登录账号
		 * @param permIds 资源权限ID集合
		 */
		authorizePermToUser : function(loginName, permIds){
			var url = User.url["authorizePermToUser"];
			TDT.formSubmit("userPermForm",url, null, true, function(json){
				if(json.result){
	    			TDT.baseDialog("授权成功，是否继续授权？", "确认并继续授权", "返回列表", function(){
	    			},
	    			function(){
	    				TDT.go('user.html');
	    			});
				}
			});
		},
		
		/**
		 * 获取用户角色列表
		 * @param loginName 用户登录账号
		 */
		getUserRole : function(loginName){
			var url = User.url["getUserRole"];
			var params = "user.userLoginName="+loginName;
			TDT.getDS(url,params,true,function(json){
				if(json.result){
					User.fn.bindUserRoleList(json.userRoleList,"userRole");
				}
			});
			
		},
		
		/**
		 * 获取用户权限树
		 * @param loginName 用户登录账号
		 */
		getPermTree : function(loginName){
			var url = TDT.getAppPath(User.url["viewUserPerm"]);
			art.dialog({
			    title: '赋予用户权限',
			    resize: false,
			    content: $("#user-panel").html(),
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
			        $("#permIds").val(selKeys.join(","));
			    	$("#loginName").val(loginName);
			    	User.fn.authorizePermToUser();
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
				            data : {parentId : node.data.id, "user.userLoginName": loginName},
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
		
		getUseStatus : function(flag){
			if(flag == "0"){
				return "否";
			} else if(flag == "1"){
				return "是";
			}
		},
		
		/*
		 * 绑定用户角色数据列表
		 */
		bindUserRoleList : function(json, key){
			var list = $("#"+key+"List");
			var html = [];
			list.html("");
			var template = $("#"+key+"Template");
			var temp = template.html();
			$.each(json,function(i,data){
		        var row = temp;
		        if(i % 2 == 0){
		        	row = row.replace(/\%{class}%/g, "even");
		        } else {
		        	row = row.replace(/\%{class}%/g, "odd");
		        }
		        if(data.isUserRole == true){
		        	row = row.replace(/\%{checked}%/g, "checked='checked'");
		        }
		        row = row.replace(/\%{rowid}%/g, data.roleId);
				row = row.replace(/\%{roleName}%/g, (data.roleName).replace("ROLE_","") || "");
				row = row.replace(/\%{roleStatus}%/g, User.fn.getUseStatus(data.roleUsesMark));
				row = row.replace(/\%{roleRemark}%/g, TDT.strCut(data.roleRemark,20));
				html.push(row);
			});
			list.html(html.join(""));
		},
		
		
		
		/**
		 * 启用用户
		 */
		enabledUser : function(id){
			var url = User.url["enabled"];
			var params = "user.userId="+id;
			TDT.getDS(url,params,true,function(json){
				if(json.result){
					TDT.go("user.html");
				}
			});
		},
		
		/**
		 * 停用用户
		 */
		disabledUser : function(id){
			var url = User.url["disabled"];
			var params = "user.userId="+id;
			TDT.getDS(url,params,true,function(json){
				if(json.result){
					TDT.go("user.html");
				}
			});
		},
		
		/**
		 * 删除用户
		 */
		deleteUser : function(ids){
			var url = User.url["del"];
			var params = "ids="+ids;
			TDT.getDS(url,params,true,function(json){
				if(json.result){
					TDT.go("user.html");
				}
			});
		},
		
		/**
		 * 获取用户明细
		 */
		findUserById : function(id, op){
			var url = User.url["view"];
			var params = "user.userId="+id;
			TDT.getDS(url,params,true,function(json){			 
				if(json.result){
					User.fn.bindUser(json.user, op);
				}
			});
		},
		
	 
		/**
		 * 分页获取用户列表
		 */
		findAllByPage : function(){
			var url = User.url["getAll"];
			var params = "pageNum="+User.pageNum+"&pageSize="+User.pageSize;
			TDT.getDS(url,params,true,function(json){
				if(json.result){
					User.fn.bindUserList(json.userList,"user");
					var pagerObj = document.getElementById("pager");
					TDT.pager(User.pageNum, User.pageSize, json.page.recordCount, pagerObj, function(p){
						User.pageNum = p;
						User.fn.findAllByPage();
					});
				} else{
					$("#userList").html("");
					$("#pager").html("");
					$("#noData").show();
				}
			});
			
		},
		
		/**
		 * 关键字搜索用户
		 */
		searchUser : function(key){
			var url = User.url["search"];
			var params = "key="+encodeURIComponent(key)+"&pageNum="+User.pageNum+"&pageSize="+User.pageSize;
			TDT.getDS(url,params,true,function(json){
				if(json.result){
					User.fn.bindUserList(json.userList,"user");
					var pagerObj = document.getElementById("pager");
					TDT.pager(User.pageNum, User.pageSize, json.page.recordCount, pagerObj, function(p){
						User.pageNum = p;
						User.fn.searchUser(key);
					});
				} else{
					$("#userList").html("");
					$("#pager").html("");
					$("#noData").show();
				}
			});
			
		},
		
		/**
		 * 验证修改密码表单域
		 */
		validateModifyPwdForm : function(form){
			var jqForm = $("#"+form);
			//密码
			var jqPwd = jqForm.find("#user-newPwd");
			var pwd = jqPwd.val();
			if(pwd == ""){
				jqPwd.parent().parent("td").find(".required").html("<img src='"+User.validateErrorImgSrc+"'/>"+User.validateTip.password.empty);
				jqPwd.focus(function(){
					$(this).parent().parent("td").find(".required").html("");
				});
				return false;
			} else {
				if(pwd.length < 5){
					jqPwd.parent().parent("td").find(".required").html("<img src='"+User.validateErrorImgSrc+"'/>"+User.validateTip.password.length);
					jqPwd.focus(function(){
						$(this).parent().parent("td").find(".required").html("");
					});
					return false;
				}
			}
			
			//确认密码
			var jqPwd2 = jqForm.find("#user-newPwd2");
			var pwd2 = jqPwd2.val();
			if(pwd2 == ""){
				jqPwd2.parent().parent("td").find(".required").html("<img src='"+User.validateErrorImgSrc+"'/>"+User.validateTip.password2.empty);
				jqPwd2.focus(function(){
					$(this).parent().parent("td").find(".required").html("");
				});
				return false;
			} else {
				if(pwd2 != pwd){
					jqPwd2.parent().parent("td").find(".required").html("<img src='"+User.validateErrorImgSrc+"'/>"+User.validateTip.password2.unsame);
					jqPwd2.focus(function(){
						$(this).parent().parent("td").find(".required").html("");
					});
					return false;
				}
			}
			
			return true;
			
		},
		
		
		/**
		 * 验证用户表单域
		 */
		validateUserForm : function(){
			//登录账号
			var jqLoginName = $("#user-loginname");
			var loginName = jqLoginName.val();
			if(loginName == ""){
				jqLoginName.parents("td").find(".required").html("<img src='"+User.validateErrorImgSrc+"'/>"+User.validateTip.loginName.empty);
				jqLoginName.focus(function(){
					$(this).parents("td").find(".required").html("");
				});
				return false;
			} else {
				var reg = /^[a-zA-Z]{1}[a-zA-Z0-9_]{4,19}$/
				var r = loginName.match(reg);
				if(!r){
					jqLoginName.parents("td").find(".required").html("<img src='"+User.validateErrorImgSrc+"'/>"+User.validateTip.loginName.length);
					jqLoginName.focus(function(){
						$(this).parents("td").find(".required").html("");
					});
					return false;
				}else{
					var url = User.url["checkLoginName"];
					var params = "user.userLoginName="+loginName;
					var isExsit = false;
					TDT.getDS(url,params,false,function(json){		
						isExsit = json.result;
					});
					if(isExsit == true){
						jqLoginName.parents("td").find(".required").html("<img src='"+User.validateErrorImgSrc+"'/>"+User.validateTip.loginName.duplicate);
						jqLoginName.focus(function(){
							$(this).parents("td").find(".required").html("");
						});
						return false;
					}
				}
			}
			
			//密码
			var jqPwd = $("#user-pwd");
			var pwd = jqPwd.val();
			if(pwd == ""){
				jqPwd.parents("td").find(".required").html("<img src='"+User.validateErrorImgSrc+"'/>"+User.validateTip.password.empty);
				jqPwd.focus(function(){
					$(this).parents("td").find(".required").html("");
				});
				return false;
			} else {
				if(pwd.length < 5){
					jqPwd.parents("td").find(".required").html("<img src='"+User.validateErrorImgSrc+"'/>"+User.validateTip.password.length);
					jqPwd.focus(function(){
						$(this).parents("td").find(".required").html("");
					});
					return false;
				}
			}
			
			//确认密码
			var jqPwd2 = $("#user-pwd2");
			var pwd2 = jqPwd2.val();
			if(pwd2 == ""){
				jqPwd2.parents("td").find(".required").html("<img src='"+User.validateErrorImgSrc+"'/>"+User.validateTip.password2.empty);
				jqPwd2.focus(function(){
					$(this).parents("td").find(".required").html("");
				});
				return false;
			} else {
				if(pwd2 != pwd){
					jqPwd2.parents("td").find(".required").html("<img src='"+User.validateErrorImgSrc+"'/>"+User.validateTip.password2.unsame);
					jqPwd2.focus(function(){
						$(this).parents("td").find(".required").html("");
					});
					return false;
				}
			}
			
			//邮箱地址
			var jqEmail = $("#user-userEmail");
			var email = jqEmail.val();
			if(email == ""){
				jqEmail.parents("td").find(".required").html("<img src='"+User.validateErrorImgSrc+"'/>"+User.validateTip.email.empty);
				jqEmail.focus(function(){
					$(this).parents("td").find(".required").html("");
				});
				return false;
			} else {
				var reg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/
				var r = email.match(reg);
				if(!r){
					jqEmail.parents("td").find(".required").html("<img src='"+User.validateErrorImgSrc+"'/>"+User.validateTip.email.verify);
					jqEmail.focus(function(){
						$(this).parents("td").find(".required").html("");
					});
					return false;
				}
			}
			
			return true;
			
		},
		
 
		bindUser : function(data, op){
			if(op == "edit"){
				$("#user-id").val(data.userId);
				$("#user-loginname").html(data.userLoginName);
				$("input[name='user\.userUsesMark'][value="+data.userUsesMark+"]").attr("checked",true);
				$("#user-userEmail").val(data.userInfo.userEmail);
				var org = new Organization();
				org.getOrgTreeForSel("user-org", "user.organization.orgId"); 
				org.setTreeNode(data.organization.orgName, data.organization.orgId);
				$("#user-userEnabledTime").val(data.userEnabledTime);
				$("#user-userInvalidTime").val(data.userInvalidTime);
			}else if(op == "view"){
				$("#user-loginname").val(data.userLoginName);
				$("#user-userUsesMark").val(this.getUseStatus(data.userUsesMark));
				$("#user-userEmail").val(data.userInfo.userEmail);
				$("#user-orgName").val(data.organization.orgName);
				$("#user-userEnabledTime").val(data.userEnabledTime);
				$("#user-userInvalidTime").val(data.userInvalidTime);
			}
			 
		},
		
		/*
		 * 绑定用户数据列表
		 */
		bindUserList : function(json, key){
			var list = $("#"+key+"List");
			var html = [];
			list.html("");
			var template = $("#"+key+"Template");
			var temp = template.html();
			
			$.each(json,function(i,data){   
		        var row = temp;
		        if(i % 2 == 0){
		        	row = row.replace(/\%{class}%/g, "even");
		        } else {
		        	row = row.replace(/\%{class}%/g, "odd");
		        }
		        row = row.replace(/\%{rowid}%/g, data.userId);
				row = row.replace(/\%{userLoginName}%/g, data.userLoginName);
				row = row.replace(/\%{email}%/g, data.userInfo.userEmail);
				row = row.replace(/\%{orgName}%/g, data.organization.orgName);
				row = row.replace(/\%{userMark}%/g, User.fn.getUseStatus(data.userUsesMark));
				row = row.replace(/\%{enabled}%/g, data.userUsesMark == 0 ? "" : "disabled=true");
				row = row.replace(/\%{disabled}%/g, data.userUsesMark == 0 ? "disabled=true" : "");
				row = row.replace(/\%{userCreateTime}%/g, (data.userCreateTime).replace("T","&nbsp;&nbsp;"));
				html.push(row);
			});
			list.html(html.join(""));
			$("a[disabled]").addClass("disable");//添加新的class 注意这里不会覆盖标签原有的class
			$("a[disabled]").removeAttr("onclick");//移除onClick事件
		}
		
	};
	
	User.fn.init.prototype = User.fn;
	
})();
