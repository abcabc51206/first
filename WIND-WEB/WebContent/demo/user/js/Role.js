/**
 * 角色管理模块对象
 * @author wangshoudong
 * @version 1.0 2012/8/6
 */
 
 (function(){
var Role = window.Role = function(){
		return new Role.fn.init();
	};
	
	Role.url = {
		getAll : "role/findAllByPage.do",
		add:"role/addRole.do",
		del:"role/deleteRole.do",
		view:"role/viewRole.do",
		getRolePerm : "role/viewRolePerm.do",
		authorizePermToRole : "role/authorizePermToRole.do",
		update:"role/updateRole.do",
		searchByKey:"role/searchByKey.do"
	};
	Role.validateErrorImgSrc = "../images/error.gif";
	
	//表单验证提示信息
	Role.validateTip = {
		
		name : {
			empty : "角色名称不能为空，请输入",
			length : "角色名称长度不能超过50个字符"
		}
	};
	
	//初始当前页
	Role.pageNum = 1;
	
	//当前页记录条数
	Role.pageSize = 10;
	
	Role.fn = Role.prototype = {
	
		/**
		 * 初始化
		 */
		init:function(){
			return this;
		},
		/**
		 * 新增角色
		 */
		addRole : function(){
			var url = Role.url["add"];
			var isValidate = this.validateRoleForm();
			if(isValidate){
				TDT.formSubmit("roleAddForm",url, null, true, function(json){
					if(json.result){
		    			TDT.baseDialog("操作成功！", "确认并继续添加", "返回列表", function(){
		    				TDT.go('role-add.html');
		    			}, 
		    			function(){
		    				TDT.go('role.html');
		    			});
					}
				});
			}
		},
		/**
		 * 删除角色
		 */
		delRole:function(ids){
			var url = Role.url["del"];
			var params = "ids="+ids;
			TDT.getDS(url,params,true,function(json){
				if(json.result){
					TDT.go("role.html");
				}
			});
		},
		
		//更新角色
		updateRole:function(){
			var url = Role.url["update"];
			var isValidate = this.validateRoleForm();
			if(isValidate){
				TDT.formSubmit("roleUpdateForm",url, null, true, function(json){
					if(json.result){
		    			TDT.go('role.html');
					}
				});
			}
		},
		findRoleById:function(id, op){
			var url = Role.url["view"];
			var params = "role.roleId="+id;
			TDT.getDS(url,params,true,function(json){
				if(json.result){
					Role.fn.bindRole(json.role, op);
				}
			});
		
		},
		/**
		 * 分页获取角色列表
		 */
		findAllByPage : function(){
			var url = Role.url["getAll"];
			var params = "pageNum="+Role.pageNum+"&pageSize="+Role.pageSize;
			TDT.getDS(url,params,true,function(json){
				if(json.result){
					Role.fn.bindRoleList(json.roleList,"role");
					var pagerObj = document.getElementById("pager");
					TDT.pager(Role.pageNum, Role.pageSize, json.page.recordCount, pagerObj, function(p){
						Role.pageNum = p;
						Role.fn.findAllByPage();
					});
				} else {
					$("#roleList").html("");
					$("#pager").html("");
					$("#noData").show();						
				}
			});
			
		},
		validateRoleForm:function(){
			var jqRoleName = $("#role-name");
			var roleName = jqRoleName.val();
			if(roleName ==""){
				jqRoleName.parents("td").find(".required").html("<img src='"+Role.validateErrorImgSrc+"'/>"+Role.validateTip.name.empty);
				jqRoleName.focus(function(){
					$(this).parents("td").find(".required").html("");
				});
				return false;
			}else{
				if(roleName.length > 50){
					jqRoleName.parents("td").find(".required").html("<img src='"+Role.validateErrorImgSrc+"'/>"+Role.validateTip.name.length);
					jqRoleName.focus(function(){
						$(this).parents("td").find(".required").html("");
					});
					return false;
				}
			}
			
			return true;
		},
		
		searchByKey:function(keyWords){
			var url = Role.url["searchByKey"];
			var params = "key="+encodeURIComponent(keyWords)+"&pageNum="+Role.pageNum+"&pageSize="+Role.pageSize;
			TDT.getDS(url,params,true,function(json){
				if(json.result){
					Role.fn.bindRoleList(json.roleList,"role");
					var pagerObj = document.getElementById("pager");
					TDT.pager(Role.pageNum, Role.pageSize, json.page.recordCount, pagerObj, function(p){
						Role.pageNum = p;
						Role.fn.searchByKey();
					});
				} else {
					$("#roleList").html("");
					$("#pager").html("");
					$("#noData").show();						
				}
			});
		},
		
		/**
		 * 给角色授予权限资源
		 * @param cbUrl 操作完成后返回URL
		 */
		authorizePermToRole : function(cbUrl){
			var url = Role.url["authorizePermToRole"];
			TDT.formSubmit("rolePermForm",url, null, true, function(json){
				if(json.result){
	    			TDT.baseDialog("授权成功，是否继续授权？", "确认并继续授权", "返回列表", function(){
	    			},
	    			function(){
	    				TDT.go(cbUrl);
	    			});
				}
			});
		},
		
		/**
		 * 获取角色权限列表
		 * @param roleId 角色ID
		 * @param cbUrl 操作完成后返回URL
		 */
		getPermTree : function(roleId, cbUrl){
			var url = TDT.getAppPath(Role.url["getRolePerm"]);
			art.dialog({
			    title: '赋予角色权限',
			    resize: false,
			    content: $("#role-panel").html(),
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
			    	$("#roleId").val(roleId);
			    	Role.fn.authorizePermToRole(cbUrl);
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
				            data : {parentId : node.data.id, roleId: roleId},
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
		
		bindRole:function(data,op){
			if(op == "edit"){
				$("#role-id").val(data.roleId);
				$("#role-name").val((data.roleName).replace("ROLE_",""));
				$("input[name='role\.roleUsesMark'][value="+data.roleUsesMark+"]").attr("checked",true);
				$("#role-remark").val(data.roleRemark);
			}else if(op == "view") {
				$("#role-name").html((data.roleName).replace("ROLE_",""));
				$("#role-status").html(this.getUseStatus(data.roleUsesMark));
				$("#role-remark").html(data.roleRemark);
			}
		},
		
		getUseStatus : function(flag){
			if(flag == "0"){
				return "否";
			} else if(flag == "1"){
				return "是";
			}
		},
		
		isSysDefaultRole : function(roleId){
			if(roleId == "10001" || roleId == "10002" || roleId == "10003"){
				return true;
			}
			return false;
		}, 
		
		/*
		 * 绑定角色数据列表
		 */
		bindRoleList : function(json, key){
			$("#noData").hide();
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
		        row = row.replace(/\%{rowid}%/g, data.roleId);
		        row = row.replace(/\%{disabled}%/g, Role.fn.isSysDefaultRole(data.roleId) == true ? "disabled=true" : "");
				row = row.replace(/\%{roleName}%/g, (data.roleName).replace("ROLE_","") || "");
				row = row.replace(/\%{roleStatus}%/g, Role.fn.getUseStatus(data.roleUsesMark));
				row = row.replace(/\%{roleRemark}%/g, TDT.strCut(data.roleRemark,20));
				html.push(row);
			});
			list.html(html.join(""));
			$("a[disabled]").addClass("disable");//添加新的class 注意这里不会覆盖标签原有的class
		}
		
		
	};
	Role.fn.init.prototype = Role.fn;
 })();