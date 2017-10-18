/**
 * 友情链接模块对象
 * @author wangshoudong
 * @version 1.0 2012/7/26
 */
(function(){
var Links = window.Links = function(){
		return new Links.fn.init();
	};
	
	Links.url = {
		getAll : "links/findAllByPage.do",
		search : "links/searchByKey.do",
		add : "links/addLinks.do",
		update : "links/updateLinks.do",
		view : "links/viewLinks.do",
		del : "links/deleteLinks.do",
		linksType : "linksCategory/getChild.do",
		addSc : "linksCategory/addLinksCategory.do",
		updateSc : "linksCategory/updateLinksCategory.do",
		deleteSc : "linksCategory/deleteLinksCategory.do"
		
		
	};
	
	//下拉列表选择树
	Links.selTree = undefined;
	
	Links.validateErrorImgSrc = "../images/error.gif";
	
	Links.uploadSuccessImgSrc = "../images/success.gif";
	
	//友情链接表单验证提示信息
	Links.validateTip = {
		name : {
			empty : "友情链接名称不能为空，请输入",
			length : "友情链接名称不能超过50个字符"
		},
		
		url : {
			empty : "链接地址不能为空，请输入",
			length : "链接地址不能超过100个字符"
		}
	};
	
	//友情链接目录表单验证提示信息
	Links.categoryValidateTip = {
		
		name : {
			empty : "名称不能为空，请输入",
			length : "名称长度不能超过10个字符"
		}
	};
	
	//初始当前页
	Links.pageNum = 1;
	
	//当前页记录条数
	Links.pageSize = 10;
	
	Links.fn = Links.prototype = {
	
		/**
		 * 初始化
		 */
		init:function(){
			return this;
		},
		
		/**
		 * 新增友情链接
		 */
		addLinks : function(){
			var url = Links.url["add"];
			var isValidate = this.validateLinksForm();
			if(isValidate){
				TDT.formSubmit("linksAddForm",url, null, true, function(json){
					if(json.result){
		    			TDT.baseDialog("操作成功！", "确认并继续添加", "返回列表", function(){
		    				TDT.go('links-add.html');
		    			}, 
		    			function(){
		    				TDT.go('links.html');
		    			});
					}
				});
			}
		},
		
		/**
		 * 更新友情链接
		 */
		updateLinks : function(){
			var url = Links.url["update"];
			var isValidate = this.validateLinksForm();
			if(isValidate){
				TDT.formSubmit("linksUpdateForm",url, null, true, function(json){
					if(json.result){
						TDT.go("links.html");
					}
				});
			}
		},
		
		/**
		 * 删除友情链接
		 */
		deleteLinks : function(ids){
			var url = Links.url["del"];
			var params = "ids="+ids;
			TDT.getDS(url,params,true,function(json){
				if(json.result){
					TDT.go("links.html");
				}
			});
		},
		
		/**
		 * 获取友情链接明细
		 */
		findLinksById : function(id){
			var url = Links.url["view"];
			var params = "links.id="+id;
			TDT.getDS(url,params,true,function(json){
				if(json.result){
					Links.fn.bindLinks(json.links);
				}
			});
		},
		
		/**
		 * 获取友情链接分类（添加页面）
		 */
		getLinksType : function(){
			var url = TDT.getAppPath(Links.url["linksType"]);
			Links.selTree = new Select("links-type",{
				expand:true,
				hidden_name:"links.linksCategory.id",
				onLazyRead : function(node){
					node.appendAjax({
			          debugLazyDelay: 0,
			          url : url,
			          data : {id : node.data.id}
			        });
				},
				children : [{title:"友情链接类型","isFolder": true, "isLazy": true, id:"root"}]
			});
			Links.selTree.addValue("友情链接类型", "root");
			var rootNode = $("#"+Links.selTree.tid).dynatree("getRoot")
			if(rootNode.childList.length > 0){
				rootNode.childList[0].toggleExpand();
			}
		},
		
		/**
		 * 获取友情链接类型（列表页面）
		 */
		getLinksCategoryType : function(){
			var url = TDT.getAppPath(Links.url["linksType"]);
			$("#tree-container").dynatree({
					onActivate: function(node) {
						Links.fn.findAllByPage(node.data.id);
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
				            data : {id : node.data.id},
				            success : function(){
				            	// Add context menu handler to tree nodes
							    Links.fn.bindContextMenu();
				            }
				    	});
					},
				children : [{title:"友情链接类型","isFolder": true, "isLazy": true, id:"root"}]
			});
			var rootNode = $("#tree-container").dynatree("getRoot")
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
						Links.fn.addSc(node);			      	
				      	break;
				      case "edit":
				      	if(node.data.id == "root"){
				      		TDT.alert("根目录不允许编辑！");
				      		break;
				      	}
				      	Links.fn.updateSc(node);
				      	break;
				      case "delete":
				      	if(node.data.id == "root"){
				      		TDT.alert("根目录不允许删除！");
				      		break;
				      	}
				      	TDT.confirm("删除该目录同时会删除与该目录相关的子目录和友情链接，您确认删除吗？",function(){
				      		Links.fn.deleteSc(node);
				      	});
				        break;
				      default:
				        alert("Todo: appply action '" + action + "' to node " + node);
			      }
		    });
		},
		
		
		/**
		 * 分页获取友情链接列表
		 */
		findAllByPage : function(type){
			var url = Links.url["getAll"];
			var params = "links.linksCategory.id="+type+"&pageNum="+Links.pageNum+"&pageSize="+Links.pageSize;
			TDT.getDS(url,params,true,function(json){
				if(json.result){
					Links.fn.bindLinksList(json.linksList,"links");
					var pagerObj = document.getElementById("pager");
					TDT.pager(Links.pageNum, Links.pageSize, json.page.recordCount, pagerObj, function(p){
						Links.pageNum = p;
						Links.fn.findAllByPage();
					});
				} else{
					$("#linksList").html("");
					$("#pager").html("");
					$("#noData").show();
				}
			});
			
		},
		
		/**
		 * 关键字搜索友情链接
		 */
		searchLinks : function(keyword){
			var url = Links.url["search"];
			var params = "keyword="+encodeURIComponent(keyword)+"&pageNum="+Links.pageNum+"&pageSize="+Links.pageSize;
			TDT.getDS(url,params,true,function(json){
				if(json.result){
					Links.fn.bindLinksList(json.linksList,"links");
					var pagerObj = document.getElementById("pager");
					TDT.pager(Links.pageNum, Links.pageSize, json.page.recordCount, pagerObj, function(p){
						Links.pageNum = p;
						Links.fn.searchLinks(keyword);
					});
				} else{
					$("#linksList").html("");
					$("#pager").html("&nbsp;");
					$("#noData").show();
				}
			});
			
		},
		
		/**
		 * 验证友情链接表单域
		 */
		validateLinksForm : function(){
			//友情链接名称
			var jqName = $("#links-name");
			var name = jqName.val();
			if(name == ""){
				jqName.parents("td").find(".required").html("<img src='"+Links.validateErrorImgSrc+"'/>"+Links.validateTip.name.empty);
				jqName.focus(function(){
					$(this).parents("td").find(".required").html("");
				});
				return false;
			} else {
				if(name.length > 50){
					jqName.parents("td").find(".required").html("<img src='"+Links.validateErrorImgSrc+"'/>"+Links.validateTip.name.length);
					jqName.focus(function(){
						$(this).parents("td").find(".required").html("");
					});
					return false;
				}
			}
			
			//友情链接地址
			var jqLinksUrl = $("#links-url");
			var linksUrl = jqLinksUrl.val();
			if(linksUrl == ""){
				jqLinksUrl.parents("td").find(".required").html("<img src='"+Links.validateErrorImgSrc+"'/>"+Links.validateTip.url.empty);
				jqLinksUrl.focus(function(){
					$(this).parents("td").find(".required").html("");
				});
				return false;
			} else {
				if(linksUrl.length > 100){
					jqLinksUrl.parents("td").find(".required").html("<img src='"+Links.validateErrorImgSrc+"'/>"+Links.validateTip.url.length);
					jqLinksUrl.focus(function(){
						$(this).parents("td").find(".required").html("");
					});
					return false;
				}
			}
			
			return true;
			
		},
		
		bindLinks : function(data){
			//编辑页面数据绑定
			$("#links-name").val(data.linksName);
			$("#links-url").val(data.linksUrl);
			if(Links.selTree){
				Links.selTree.addValue(data.linksCategory.chName, data.linksCategory.id);
			}
		},
		
		/*
		 * 绑定友情链接数据列表
		 */
		bindLinksList : function(json, key){
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
		        row = row.replace(/\%{rowid}%/g, data.id);
				row = row.replace(/\%{name}%/g, data.linksName);
				row = row.replace(/\%{url}%/g, data.linksUrl);
				row = row.replace(/\%{type}%/g, data.linksCategory.chName);
				row = row.replace(/\%{createTime}%/g, (data.createTime).replace("T","&nbsp;&nbsp;"));
				html.push(row);
			});
			list.html(html.join(""));
			calTreeHeight();
		},
		
		
		/**
		 * 新增友情链接目录
		 */
		addSc : function(node){
			var url = Links.url["addSc"];
			art.dialog({
			    title: '添加友情链接目录',
			    content: $("#sdAddDia").html(),
			    ok: function(){
			    	var isValidate = Links.fn.validateScForm("scAddForm");
			    	if(isValidate){
			    		$("#scAddForm").find("#scParentId").val(node.data.id);
			    		TDT.formSubmit("scAddForm",url, null, true, function(json){
							if(json.result){
								node.reloadChildren();
							}
						});
			    		return true;
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
		 * 更新友情链接目录
		 */
		updateSc : function(node){
			var url = Links.url["updateSc"];
			art.dialog({
			    title: '编辑友情链接目录',
			    content: $("#sdUpdateDia").html(),
			    ok: function(){
			    	var isValidate = Links.fn.validateScForm("scUpdateForm");
			    	if(isValidate){
			    		TDT.formSubmit("scUpdateForm",url, null, true, function(json){
							if(json.result){
								node.parent.reloadChildren();
							}
						});
			    		return true;
			    	} else{
			    		return false;
			    	}
			    },
			    cancel: function(){
			    	return true;
			    }
			});
			$("#scUpdateForm").find("#scParentId").val(node.parent.data.id);
			$("#scUpdateForm").find("#scId").val(node.data.id);
			$("#scUpdateForm").find("#scName").val(node.data.title);
		},
		
		/**
		 * 删除友情链接目录
		 */
		deleteSc : function(node){
			var url = Links.url["deleteSc"];
			var params = "id="+node.data.id;
			TDT.getDS(url,params,true,function(json){
				if(json.result){
					node.remove();
				}
			});
		},
		
		/**
		 * 验证友情链接目录表单
		 */
		validateScForm : function(formId){
			var jqForm = $("#"+formId);
			//名称
			var jqName = jqForm.find("#scName");
			var name = jqName.val();
			if(name == ""){
				jqName.parent().find(".required").html("<img src='"+Links.validateErrorImgSrc+"'/>"+Links.categoryValidateTip.name.empty);
				jqName.focus(function(){
					$(this).parent().find(".required").html("");
				});
				return false;
			} else {
				if(name.length > 50){
					jqName.parent().find(".required").html("<img src='"+Links.validateErrorImgSrc+"'/>"+Links.categoryValidateTip.name.length);
					jqName.focus(function(){
						$(this).parent().find(".required").html("");
					});
					return false;
				}
			}
			
			return true;
		}
	
	};
	
	Links.fn.init.prototype = Links.fn;
	
})();
