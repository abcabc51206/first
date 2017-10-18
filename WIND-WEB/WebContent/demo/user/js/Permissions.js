/**
 * 资源权限模块对象
 * @author wangshoudong
 * @version 1.0 2012/8/6
 */
 
(function(){
var Permissions = window.Permissions = function(){
		return new Permissions.fn.init();
	};
	
	Permissions.url = {
		getAll : "perm/findAllByPage.do",
		getChild : "perm/getChild.do",
		search : "perm/searchByKey.do",
		add : "perm/addPerm.do",
		update : "perm/updatePerm.do",
		view : "perm/viewPerm.do",
		upToTop : "perm/upToTop.do",
		up : "perm/up.do",
		down : "perm/down.do",
		downToBottom : "perm/downToBottom.do",
		del : "perm/deletePerm.do"
		
	};
	
	Permissions.type = {
		Portal : "门户网站",
		Resource : "资源中心",
		Admin : "管理中心"
	};
	
	//表单验证提示信息
	Permissions.validateTip = {
		code : {
			empty : "资源代码不能为空，请输入",
			length : "资源代码长度不能超过50个字符"
		},
		
		name : {
			empty : "资源名称不能为空，请输入",
			length : "资源名称长度不能超过50个字符"
		}
	};
	
	//初始当前页
	Permissions.pageNum = 1;
	
	//当前页记录条数
	Permissions.pageSize = 10;
	
	Permissions.selTree = undefined;
 	
 	Permissions.validateErrorImgSrc = "../images/error.gif";
	
	Permissions.fn = Permissions.prototype = {
	
		/**
		 * 初始化
		 */
		init:function(){
			return this;
		},
		
		/**
		 * 新增权限
		 */
		addPermissions : function(){
			var url = Permissions.url["add"];
			var isValidate = this.validatePermissionsForm();
			if(isValidate){
				TDT.formSubmit("permissionsAddForm",url, null, true, function(json){
					if(json.result){
		    			TDT.baseDialog("操作成功！", "确认并继续添加", "返回列表", function(){
		    				TDT.go('permissions-add.html');
		    			},
		    			function(){
		    				TDT.go('permissions.html');
		    			});
					}
				});
			}
		},
		
		/**
		 * 更新权限
		 */
		updatePermissions : function(){
			var url = Permissions.url["update"];
			var isValidate = this.validatePermissionsForm();
			if(isValidate){
				TDT.formSubmit("permissionsUpdateForm",url, null, true, function(json){
					if(json.result){
						TDT.go("permissions.html");
					}
				});
			}
		},
		
		/**
		 * 删除权限
		 */
		deletePermissions : function(ids){
			var url = Permissions.url["del"];
			var params = "ids="+ids;
			TDT.getDS(url,params,true,function(json){
				if(json.result){
					TDT.go("permissions.html");
				}
			});
		},
		
		/**
		 * 获取权限明细
		 */
		findPermissionsById : function(id, op){
			var url = Permissions.url["view"];
			var params = "perm.permId="+id;
			TDT.getDS(url,params,true,function(json){			 
				if(json.result){
					Permissions.fn.bindPermissions(json.perm, op);
				}
			});
		},
		
		/**
		 * 获取权限树（添加页面选择框）
		 */
		getPermTreeForSel : function(){
			var url = TDT.getAppPath(Permissions.url["getChild"]);
			Permissions.selTree = new Select("parent-perm",{
				expand:true,
				hidden_name:"perm.parentPerm.permId",
				onLazyRead : function(node){
					node.appendAjax({
			          debugLazyDelay: 0,
			          url : url,
			          data : {parentId : node.data.id}
			        });
				},
				children : [{title:"权限资源","isFolder": true, "isLazy": true, id:"root"}]
			});
			this.setTreeNode("权限资源", "root");
			
			var rootNode = $("#"+Permissions.selTree.tid).dynatree("getRoot")
			if(rootNode.childList.length > 0){
				rootNode.childList[0].toggleExpand();
			}
		},
		
		/**
		 * 获取权限树（列表页面）
		 */
		getPermTree : function(){
			var url = TDT.getAppPath(Permissions.url["getChild"]);
			$("#tree-container").dynatree({
					onActivate: function(node) {
						Permissions.fn.findAllByPage(node.data.id);
				    },
				    onClick:function(){
					    if( $(".contextMenu:visible").length > 0 ){
				          return false;
				        }
				    },
					onLazyRead : function(node){
						node.appendAjax({
				            debugLazyDelay: 0,
				            url : url,
				            data : {parentId : node.data.id},
				            success : function(){
				            	// Add context menu handler to tree nodes
							    Permissions.fn.bindContextMenu();
				            }
				    	});
					},
				children : [{title:"权限资源","isFolder": true, "isLazy": true, id:"root"}]
			});
			var rootNode = $("#tree-container").dynatree("getRoot");
			if(rootNode.childList.length > 0){
				rootNode.childList[0].toggleExpand();
			}
			this.findAllByPage("root");
		},
		
		bindContextMenu : function() {
		    // Add context menu to all nodes:
		    $("span.dynatree-node")
		      .destroyContextMenu() // unbind first, to prevent duplicates
		      .contextMenu({menu: "myMenu"}, function(action, el, pos) {
			      // The event was bound to the <span> tag, but the node object
			      // is stored in the parent <li> tag
			      var node = el.parent().attr("dtnode");
			      switch( action ) {
				     case "add":
						TDT.go('permissions-add.html?id='+node.data.id+"&title="+node.data.title);		      	
				      	break;
				      case "edit":
				      	if(node.data.id == "root"){
				      		TDT.alert("根目录不允许编辑！");
				      		break;
				      	}
				      	TDT.go('permissions-edit.html?id='+node.data.id);
				      	break;
				      case "delete":
				      	if(node.data.id == "root"){
				      		TDT.alert("根目录不允许删除！");
				      		break;
				      	}
				      	TDT.confirm("删除此权限资源的同时会删除其下级权限资源，您确认删除吗？",function(){
					   		Permissions.fn.deletePermissions(node.data.id);
				   		});
				        break;
				      default:
				        alert("Todo: appply action '" + action + "' to node " + node);
			      }
		    });
		},
	 
		/**
		 * 分页获取权限资源
		 */
		findAllByPage : function(parentId){
			var url = Permissions.url["getAll"];
			var params = "parentId="+parentId+"&pageNum="+Permissions.pageNum+"&pageSize="+Permissions.pageSize;
			TDT.getDS(url,params,true,function(json){
				if(json.result){
					Permissions.fn.bindPermissionsList(json.permList,"perm");
					var pagerObj = document.getElementById("pager");
					TDT.pager(Permissions.pageNum, Permissions.pageSize, json.page.recordCount, pagerObj, function(p){
						Permissions.pageNum = p;
						Permissions.fn.findAllByPage(parentId);
					});
				} else{
					$("#permList").html("");
					$("#pager").html("");
					$("#noData").show();
				}
			});
			
		},
		
		/**
		 * 关键字搜索权限资源
		 */
		searchPermissions : function(key){
			var url = Permissions.url["search"];
			var params = "key="+encodeURIComponent(key)+"&pageNum="+Permissions.pageNum+"&pageSize="+Permissions.pageSize;
			TDT.getDS(url,params,true,function(json){
				if(json.result){
					Permissions.fn.bindPermissionsList(json.permList,"perm");
					var pagerObj = document.getElementById("pager");
					TDT.pager(Permissions.pageNum, Permissions.pageSize, json.page.recordCount, pagerObj, function(p){
						Permissions.pageNum = p;
						Permissions.fn.searchPermissions(key);
					});
				} else{
					$("#permList").html("");
					$("#pager").html("");
					$("#noData").show();
				}
			});
			
		},
		
		/**
		 * 验证权限表单域
		 */
		validatePermissionsForm : function(){
			//资源权限编号
			var jqPermCode = $("#perm-code");
			var permCode = jqPermCode.val();
			if(permCode == ""){
				jqPermCode.parents("td").find(".required").html("<img src='"+Permissions.validateErrorImgSrc+"'/>"+Permissions.validateTip.code.empty);
				jqPermCode.focus(function(){
					$(this).parents("td").find(".required").html("");
				});
				return false;
			} else {
				if(permCode.length > 50){
					jqPermCode.parents("td").find(".required").html("<img src='"+Permissions.validateErrorImgSrc+"'/>"+Permissions.validateTip.code.length);
					jqPermCode.focus(function(){
						$(this).parents("td").find(".required").html("");
					});
					return false;
				}
			}
			
			//资源权限名称
			var jqPermName = $("#perm-name");
			var permName = jqPermName.val();
			if(permName == ""){
				jqPermName.parents("td").find(".required").html("<img src='"+Permissions.validateErrorImgSrc+"'/>"+Permissions.validateTip.name.empty);
				jqPermName.focus(function(){
					$(this).parents("td").find(".required").html("");
				});
				return false;
			} else {
				if(permName.length > 50){
					jqPermName.parents("td").find(".required").html("<img src='"+Permissions.validateErrorImgSrc+"'/>"+Permissions.validateTip.name.length);
					jqPermName.focus(function(){
						$(this).parents("td").find(".required").html("");
					});
					return false;
				}
			}
			
			return true;
			
		},
		
		setTreeNode : function(nodeName,nodeId){
			if(Permissions.selTree){
					Permissions.selTree.addValue(nodeName, nodeId);
			}
		},
		
 
		bindPermissions : function(data, op){
		 	if(op == "edit"){
				$("#perm-id").val(data.permId);
				$("#perm-code").val(data.permCode);
				$("#perm-name").val(data.permName);
				this.setTreeNode(data.parentPerm.permName, data.parentPerm.permId);
				$("#perm-type").val(data.permType);
				$("#perm-url").val(data.permUrl);
				$("#perm-urlType").val(data.permUrlType);
				$("input[name='perm\.permDisplay'][value="+data.permDisplay+"]").attr("checked",true);
				$("input[name='perm\.permUsesMark'][value="+data.permUsesMark+"]").attr("checked",true);
				$("#perm-remark").val(data.permRemark);
		 	} else if(op == "view"){
				$("#perm-code").html(data.permCode);
				$("#perm-name").html(data.permName);
				$("#parent-perm").html(data.parentPerm.permName);
				$("#perm-type").html(data.permType);
				$("#perm-url").html(data.permUrl);
				$("#perm-urlType").html(data.permUrlType);
				$("#perm-display").html(data.permDisplay=="1"?"是":"否");
				$("#perm-status").html(data.permUsesMark=="1"?"启用":"停用");
				$("#perm-remark").html(data.permRemark);
		 	}
			 
		},
		
		/*
		 * 绑定权限数据列表
		 */
		bindPermissionsList : function(json, key){
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
		        row = row.replace(/\%{rowid}%/g, data.permId);
		        row = row.replace(/\%{permCode}%/g, data.permCode);
				row = row.replace(/\%{permName}%/g, data.permName);
				row = row.replace(/\%{parentPerm}%/g, data.parentPerm.permName);
				row = row.replace(/\%{permType}%/g, Permissions.type[data.permType] || "");
				row = row.replace(/\%{permUrl}%/g, data.permUrl || "");
				html.push(row);
			});
			list.html(html.join(""));
			this.calTreeHeight();
		},
		/**
		 * 上移至顶部
		 */
		upToTop : function(id){
			var url = Permissions.url["upToTop"];
			var params = "perm.permId="+id;
			TDT.getDS(url,params,true,function(json){
				if(json.result){
					TDT.go("permissions.html");
				}
			});
		},
		
		/**
		 * 上移
		 */
		up : function(id){
			var url = Permissions.url["up"];
			var params = "perm.permId="+id;
			TDT.getDS(url,params,true,function(json){
				if(json.result){
					TDT.go("permissions.html");
				}
			});
		},
		
		/**
		 * 下移
		 */
		down : function(id){
			var url = Permissions.url["down"];
			var params = "perm.permId="+id;
			TDT.getDS(url,params,true,function(json){
				if(json.result){
					TDT.go("permissions.html");
				}
			});
		},
		
		/**
		 * 下移至底部
		 */
		downToBottom : function(id){
			var url = Permissions.url["downToBottom"];
			var params = "perm.permId="+id;
			TDT.getDS(url,params,true,function(json){
				if(json.result){
					TDT.go("permissions.html");
				}
			});
		},
		calTreeHeight : function (){
			$(".perm-panel").height($(".perm-box-table").height()-18);
			//$(".tree-container").height($(".perm-panel").height()-$(".tree-title").height());
		}
	 
	};
	
	Permissions.fn.init.prototype = Permissions.fn;
	
})();
