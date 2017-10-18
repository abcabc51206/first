/**
 * 机构模块对象
 * @author wangshoudong
 * @version 1.0 2012/8/6
 */
 
(function(){
var Organization = window.Organization = function(){
		return new Organization.fn.init();
	};
	
	Organization.url = {
		getAll : "org/findAllByPage.do",
		getChild : "org/getChild.do",
		search : "org/searchByKey.do",
		add : "org/addOrg.do",
		update : "org/updateOrg.do",
		check : "org/checkOrgCodeAndName.do",
		view : "org/viewOrg.do",
		del : "org/deleteOrg.do"
		
	};
	
	//表单验证提示信息
	Organization.validateTip = {
		code : {
			empty : "机构编号不能为空，请输入",
			exist:"机构代码已存在，不能重复录入",
			length : "机构编号长度不能超过50个字符"
		},
		
		name : {
			empty : "机构名称不能为空，请输入",
			exist: "机构名称已存在，不能重复录入",
			length : "机构名称长度不能超过50个字符"
		}
	};
	
	//初始当前页
	Organization.pageNum = 1;
	
	//当前页记录条数
	Organization.pageSize = 10;
	Organization.type = undefined;
	
	Organization.selTree = undefined;
 	
 	Organization.validateErrorImgSrc = "../images/error.gif";
	
	Organization.fn = Organization.prototype = {
	
		/**
		 * 初始化
		 */
		init:function(){
			return this;
		},
		
		/**
		 * 新增机构
		 */
		addOrganization : function(){
			var url = Organization.url["add"];
			Organization.type = "add";
			var isValidate = this.validateOrganizationForm();
			if(isValidate){
				TDT.formSubmit("organizationAddForm",url, null, true, function(json){
					if(json.result){
		    			TDT.baseDialog("操作成功！", "确认并继续添加", "返回列表", function(){
		    				TDT.go('organization-add.html');
		    			},
		    			function(){
		    				TDT.go('organization.html');
		    			});
					}
				});
			}
		},
		
		/**
		 * 更新机构
		 */
		updateOrganization : function(){
			var url = Organization.url["update"];
			var isValidate = this.validateOrganizationForm();
			if(isValidate){
				TDT.formSubmit("organizationUpdateForm",url, null, true, function(json){
					if(json.result){
						TDT.go("organization.html");
					}
				});
			}
		},
		
		/**
		 * 删除机构
		 */
		deleteOrganization : function(ids){
			var url = Organization.url["del"];
			var params = "ids="+ids;
			TDT.getDS(url,params,true,function(json){
				if(json.result){
					TDT.go("organization.html");
				}
			});
		},
		
		/**
		 * 获取机构明细
		 */
		findOrganizationById : function(id,op){
			var url = Organization.url["view"];
			var params = "org.orgId="+id;
			TDT.getDS(url,params,true,function(json){			 
				if(json.result){
					Organization.fn.bindOrganization(json.org, op);
				}
			});
		},
		
		/**
		 * 获取组织机构树（添加/编辑页面选择框）
		 */
		getOrgTreeForSel : function(selTreeId, hiddenFiledName){
			var url = TDT.getAppPath(Organization.url["getChild"]);
			Organization.selTree = new Select(selTreeId,{
				expand:true,
				hidden_name: hiddenFiledName,
				onLazyRead : function(node){
					node.appendAjax({
			          debugLazyDelay: 0,
			          url : url,
			          data : {parentId : node.data.id}
			        });
				},
				children : [{title:"组织机构","isFolder": true, "isLazy": true, id:"root"}]
			});
			this.setTreeNode("组织机构", "root");
			var rootNode = $("#"+Organization.selTree.tid).dynatree("getRoot");
			if(rootNode.childList.length > 0){
				rootNode.childList[0].toggleExpand();
			}
		},
		
		/**
		 * 获取组织机构树（列表页面）
		 */
		getOrgTree : function(){
			var url = TDT.getAppPath(Organization.url["getChild"]);
			$("#tree-container").dynatree({
					onActivate: function(node) {
						Organization.fn.findAllByPage(node.data.id);
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
							    Organization.fn.bindContextMenu();
				            }
				    	});
					},
				children : [{title:"组织机构","isFolder": true, "isLazy": true, id:"root"}]
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
						TDT.go('organization-add.html?id='+node.data.id+"&title="+node.data.title);		      	
				      	break;
				      case "edit":
				      	if(node.data.id == "root"){
				      		TDT.alert("根目录不允许编辑！");
				      		break;
				      	}
				      	TDT.go('organization-edit.html?id='+node.data.id);
				      	break;
				      case "delete":
				      	if(node.data.id == "root"){
				      		TDT.alert("根目录不允许删除！");
				      		break;
				      	}
				      	TDT.confirm("删除此机构的同时会删除其下级组织机构和包含的用户，您确认删除吗？",function(){
					   		Organization.fn.deleteOrganization(node.data.id);
				   		});
				        break;
				      default:
				        alert("Todo: appply action '" + action + "' to node " + node);
			      }
		    });
		},
	 
		/**
		 * 分页获取机构列表
		 */
		findAllByPage : function(parentId){
			var url = Organization.url["getAll"];
			var params = "parentId="+parentId+"&pageNum="+Organization.pageNum+"&pageSize="+Organization.pageSize;
			TDT.getDS(url,params,true,function(json){
				if(json.result){
					Organization.fn.bindOrganizationList(json.orgList,"org");
					var pagerObj = document.getElementById("pager");
					TDT.pager(Organization.pageNum, Organization.pageSize, json.page.recordCount, pagerObj, function(p){
						Organization.pageNum = p;
						Organization.fn.findAllByPage();
					});
				} else{
					$("#orgList").html("");
					$("#pager").html("");
					$("#noData").show();
				}
			});
			
		},
		
		/**
		 * 关键字搜索机构
		 */
		searchOrganization : function(key){
			var url = Organization.url["search"];
			var params = "key="+encodeURIComponent(key)+"&pageNum="+Organization.pageNum+"&pageSize="+Organization.pageSize;
			TDT.getDS(url,params,true,function(json){
				if(json.result){
					Organization.fn.bindOrganizationList(json.orgList,"org");
					var pagerObj = document.getElementById("pager");
					TDT.pager(Organization.pageNum, Organization.pageSize, json.page.recordCount, pagerObj, function(p){
						Organization.pageNum = p;
						Organization.fn.searchOrganization(key);
					});
				} else{
					$("#orgList").html("");
					$("#pager").html("");
					$("#noData").show();
				}
			});
			
		},
		
		/**
		 * 验证机构表单域
		 */
		validateOrganizationForm : function(){
			//机构编号
			var jqOrgCode = $("#org-code");
			var orgCode = jqOrgCode.val();
			if(orgCode == ""){
				jqOrgCode.parents("td").find(".required").html("<img src='"+Organization.validateErrorImgSrc+"'/>"+Organization.validateTip.code.empty);
				jqOrgCode.focus(function(){
					$(this).parents("td").find(".required").html("");
				});
				return false;
			} else {
				if(orgCode.length > 50){
					jqOrgCode.parents("td").find(".required").html("<img src='"+Organization.validateErrorImgSrc+"'/>"+Organization.validateTip.code.length);
					jqOrgCode.focus(function(){
						$(this).parents("td").find(".required").html("");
					});
					return false;
				}
			}
			
			//机构名称
			var jqOrgName = $("#org-name");
			var orgName = jqOrgName.val();
			if(orgName == ""){
				jqOrgName.parents("td").find(".required").html("<img src='"+Organization.validateErrorImgSrc+"'/>"+Organization.validateTip.name.empty);
				jqOrgName.focus(function(){
					$(this).parents("td").find(".required").html("");
				});
				return false;
			} else {
				if(orgName.length > 50){
					jqOrgName.parents("td").find(".required").html("<img src='"+Organization.validateErrorImgSrc+"'/>"+Organization.validateTip.name.length);
					jqOrgName.focus(function(){
						$(this).parents("td").find(".required").html("");
					});
					return false;
				}
			}
			
			if(Organization.type){
				//验证机构代码和机构名称是已存在
				var exist = true;
				var url = Organization.url["check"];
				var params = "org.orgCode="+orgCode+"&org.orgName="+orgName;
				TDT.getDS(url,params,false,function(json){
					if(json.result){
						if(json.b){
							if(json.orgCode){
								TDT.alert(Organization.validateTip.code.exist);
								jqOrgCode.focus();
								exist = false;
							}else {
								TDT.alert(Organization.validateTip.name.exist);
								jqOrgName.focus();
								exist = false;
							}
						}
					}
				});
				if(!exist) return exist; 
			}
			
			
			
			return true;
			
		},
		
		setTreeNode : function(nodeName,nodeId){
			if(Organization.selTree){
					Organization.selTree.addValue(nodeName, nodeId);
			}
		},
		
 
		bindOrganization : function(data, op){
		 	if(op == "edit"){
		 		$("#org-id").val(data.orgId);
				$("#org-code").val(data.orgCode);
				$("#org-name").val(data.orgName);
				this.setTreeNode(data.parentOrg.orgName, data.parentOrg.orgId);
				$("#org-tel").val(data.orgTelephone);
				$("#org-fax").val(data.orgFax);
				$("#org-remark").val(data.orgRemark);
				$("#org-zipCode").val(data.orgZipCode);
				$("#org-address").val(data.orgAddress);
			} else if(op == "view"){
				$("#org-code").html(data.orgCode);
				$("#org-name").html(data.orgName);
				$("#org-parent").html(data.parentOrg.orgName);
				$("#org-tel").html(data.orgTelephone);
				$("#org-fax").html(data.orgFax);
				$("#org-remark").html(data.orgRemark);
				$("#org-zipCode").html(data.orgZipCode);
				$("#org-address").html(data.orgAddress);
			}
			 
		},
		
		/*
		 * 绑定机构数据列表
		 */
		bindOrganizationList : function(json, key){
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
		        row = row.replace(/\%{rowid}%/g, data.orgId);
		        row = row.replace(/\%{orgCode}%/g, data.orgCode);
				row = row.replace(/\%{orgName}%/g, data.orgName);
				row = row.replace(/\%{parentOrg}%/g, data.parentOrg.orgName);
				row = row.replace(/\%{tel}%/g, data.orgTelephone || "");
				row = row.replace(/\%{fax}%/g, data.orgFax || "");
				html.push(row);
			});
			list.html(html.join(""));
			this.calTreeHeight();
		},
		
		calTreeHeight : function (){
			$(".org-panel").height($(".org-box-table").height()-18);
			//$(".tree-container").height($(".org-panel").height()-$(".tree-title").height());
		}
	 
	};
	
	Organization.fn.init.prototype = Organization.fn;
	
})();
