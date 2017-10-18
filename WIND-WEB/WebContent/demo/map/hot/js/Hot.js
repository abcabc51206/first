/**
 * 地图热点 模块对象
 * @author 朱泽江
 * @version 1.0 2012/8/6
 */
 (function(){
 	var Hot = window.Hot = function(){
 		return new Hot.fn.init();
 	};
 	
 	Hot.url = {
 		add:"hot/saveHot.do",
 		getAll:"hot/findAllByHotCategoryId.do",
 		searchByKey:"hot/findAllByKeyWords.do",
 		findById:"hot/findById.do",
 		delHot:"hot/deleteHotInfo.do",
 		updateHot:"hot/updateHotInfo.do",
 		updateFile:"hot/updateFile.do",
 		uploadFile:"hot/uploadFile.do",
 		viewFile:"hot/viewFile.do",
 		up:"hot/up.do",
 		down:"hot/down.do",
 		upToTop:"hot/upToTop.do",
 		downToBottom:"hot/upToBottom.do",
 		treeNode:"hotCategory/getTreeNode.do",
 		addHotCategory:"hotCategory/addTreeNode.do",
 		updateHotCategory:"hotCategory/updateTreeNode.do",
 		delHotCategory:"hotCategory/deleteTreeNode.do"
 	};
 	
 	
 	Hot.pageNum = 1;
 	Hot.pageSize = 10;
 	Hot.selTree = undefined;
 	
 	Hot.loadingImgSrc = "../images/loading.gif";
 	
 	Hot.validateErrorImgSrc = "../images/error.gif";
	
	//表单验证提示信息
	Hot.validateTip = {
		
		hotName : {
			empty : "热点名称不能为空，请输入",
			length : "标题长度不能超过50个字符"
		},
		categoryChName : {
			empty : "中文名称不能为空，请输入",
			length : "标题长度不能超过50个字符"
		},
		file:{
			type:"图片格式为jpg|jpeg|png",
			empty:"请选择上传文件 "
		}
	};
 	
 	Hot.fn = Hot.prototype = {
 		init:function(){
 			return this;
 		},
 		saveHot:function(){
 			var url = Hot.url["add"];
			var isValidate = this.validateHotForm("add");
			if(isValidate){
				TDT.formSubmit("hotAddForm",url, null, true, function(json){
					if(json.result){
		    			TDT.baseDialog("操作成功！", "确认并继续添加", "返回列表", function(){
		    				TDT.go('hot-add.html');
		    			},
		    			function(){
		    				TDT.go('hot.html');
		    			});
					}
				});
			}
 		},
 		 updateHot:function(){
 			var url = Hot.url["updateHot"];
 			var isValidate = this.validateHotForm("edit");
			if(isValidate){
				TDT.formSubmit("hotUpdateForm",url, null, true, function(json){
					if(json.result){
		    			TDT.go('hot.html');
					}
				});
			}
 		},
 		delHot:function(ids){
 			var url = Hot.url["delHot"];
			var params = "sid="+ids;
			TDT.getDS(url,params,true,function(json){
				if(json.result){
					TDT.go('hot.html');	
				}
			});
 		},
 		findAllByPage:function(sid){
			var url = Hot.url["getAll"];
			var params = "sid="+sid+"&pageNum="+Hot.pageNum+"&pageSize="+Hot.pageSize;
			TDT.getDS(url,params,true,function(json){
				if(json.result){
					if(json.hotList.length>0){
						Hot.fn.bindHotList(json.hotList,"hot");
						var pagerObj = document.getElementById("pager");
						TDT.pager(Hot.pageNum, Hot.pageSize, json.page.recordCount, pagerObj, function(p){
							Hot.pageNum = p;
							Hot.fn.findAllByPage(sid);
						});
						
						$("#nomessage").hide();
					}
				} else {
						$("#hotList").html("");
						$("#nomessage").show();
						$("#pager").html("");
				}
			});
 		},
 		searchByKey:function(sid){
			var url = Hot.url["searchByKey"];
			var params = "sid="+sid+"&pageNum="+Hot.pageNum+"&pageSize="+Hot.pageSize;
			TDT.getDS(url,params,true,function(json){
				if(json.result){
					if(json.hotList.length>0){
						Hot.fn.bindHotList(json.hotList,"hot");
						var pagerObj = document.getElementById("pager");
						TDT.pager(Hot.pageNum, Hot.pageSize, json.page.recordCount, pagerObj, function(p){
							Hot.pageNum = p;
							Hot.fn.searchByKey(sid);
						});
						
						$("#nomessage").hide();
					}
				} else {
						$("#sarList").html("");
						$("#nomessage").show();
						$("#pager").html("");
				}
			});
 		},
 		findById:function(id,type){
 			var url = Hot.url["findById"];
			var params = "sid="+id;
			TDT.getDS(url,params,true,function(json){
				if(json.result){
					Hot.fn.bindHotView(json.hot,type);
				}
			});
 		},
 		 bindHotView:function (data,type){
 			if(type == "view"){
 				$("#hotName").html(data.hotName);
 				$("#address").html(data.address);
 				$("#lon").html(data.lon);
 				$("#lat").html(data.lat);
 				$("#zoom").html(data.zoom);
 				$("#createTime").html((data.createTime).replace("T","&nbsp;&nbsp;"));
 				$("#hotType").html(data.hotCategory.chName);
 				$("#file-id").val(data.fileId);
 				if(data.fileId)
 					this.viewFile(data.fileId);
 			}else {
 				$("#hotName").val(data.hotName);
 				$("#hot-address").val(data.address);
 				$("#hot-lon").val(data.lon);
 				$("#hot-lat").val(data.lat);
 				$("#hot-zoom").val(data.zoom);
 				$("#hot-brief").val(data.brief);
 				$("#hot-sort").val(data.sort);
 				$("#hot-fileId").val(data.fileId);
 				$("#hot-id").val(data.id);
 				
	 			if(Hot.selTree){
					Hot.selTree.addValue(data.hotCategory.chName, data.hotCategory.id);
				}
 				$("#hot-fileId").val(data.fileId);
 				$("#file-id").val(data.fileId);
 				if(data.fileId)
 					this.viewFile(data.fileId);
 			}
		},
		getTreeNode:function(){
			var url = TDT.getAppPath(Hot.url["treeNode"]);
			Hot.selTree = new Select("hot-category",{
				expand:true,
				hidden_name:"hot.hotCategory.id",
				onLazyRead : function(node){
					node.appendAjax({
			          debugLazyDelay: 0,
			          url : url,
			          data : {id : node.data.id}
			        });
				},
				children : [{title:"地图热点类型","isFolder": true, "isLazy": true, id:"root"}]
			});
			Hot.selTree.addValue("地图热点类型", "root");
			var rootNode = $("#"+Hot.selTree.tid).dynatree("getRoot");
			if(rootNode.childList.length > 0){
				rootNode.childList[0].toggleExpand();
			}
		},
		getHotTreeNode:function(){
			var url = TDT.getAppPath(Hot.url["treeNode"]);
			$("#tree-container").dynatree({
					onActivate: function(node) {
						Hot.fn.findAllByPage(node.data.id);
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
							    Hot.fn.bindContextMenu();
				            }
				    	});
					},
				children : [{title:"地图热点类型","isFolder": true, "isLazy": true, id:"root"}]
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
			      switch(action) {
				      case "add":
				      //地图热点的添加
				      	Hot.fn.addHotCategory(node);
				      	break;
				      case "edit":
				      	if(node.data.id == "root"){
				      		TDT.alert("根目录不允许编辑！");
				      		break;
				      	}
				      	//地图热点的修改
				      	Hot.fn.updateHotCategory(node);
				      	break;
				      case "delete":
				      	if(node.data.id == "root"){
				      		TDT.alert("根目录不允许删除！");
				      		break;
				      	}
				      	//地图热点的删除
				      	TDT.confirm("删除此数据的同时会删除其下级分类，您确认删除吗？",function(){
					   		Hot.fn.deleteHotCategory(node);
				   		});
				        break;
				      default:
				        alert("Todo: appply action '" + action + "' to node " + node);
			      }
		    });
		} ,
		addHotCategory : function(node){
			var url = Hot.url["addHotCategory"];
			art.dialog({
			    title: '添加地图热点类型',
			    content: $("#hotCategoryAddDia").html(),
			    ok: function(){
			    	var isValidate = Hot.fn.validateHotCategoryForm("add");
			    	if(isValidate){
			    		$("#hotCategoryAddForm").find("#parentId").val(node.data.id);
			    		TDT.formSubmit("hotCategoryAddForm",url, null, true, function(json){
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
		updateHotCategory : function(node){
			var url = Hot.url["updateHotCategory"];
			art.dialog({
			    title: '编辑地图热点类型',
			    content: $("#hotCategoryUpdateDia").html(),
			    ok: function(){
			    	var isValidate = Hot.fn.validateHotCategoryForm("update");
			    	if(isValidate){
			    		TDT.formSubmit("hotCategoryUpdateForm",url, null, true, function(json){
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
			$("#hotCategoryUpdateForm").find("#parentId").val(node.parent.data.id);
			$("#hotCategoryUpdateForm").find("#id").val(node.data.id);
			$("#hotCategoryUpdateForm").find("#hotCategory-chName").val(node.data.title);
		},
		deleteHotCategory : function(node){
			var url = Hot.url["delHotCategory"];
			var params = "hotCategory.id="+node.data.id;
			TDT.getDS(url,params,true,function(json){
				if(json.result){
					node.remove();
				}
			});
		},
		validateHotCategoryForm:function(type){
			if(type=="add"){
				var chName = $("#hotCategoryAddForm").find("#chName");
				if(chName.val() ==""){
					chName.parents("td").find(".required").html("<img src='"+Hot.validateErrorImgSrc+"'/>"+Hot.validateTip.categoryChName.empty);
					chName.focus(function(){
						$(this).parents("td").find(".required").html("*");
					});
					return false;
				}
				if(chName.val().length > 50){
					chName.parents("td").find(".required").html("<img src='"+Hot.validateErrorImgSrc+"'/>"+Hot.validateTip.categoryChName.length);
					chName.focus(function(){
						$(this).parents("td").find(".required").html("*");
					});
					return false;
				}
			}else {
				var chName = $("#hotCategoryUpdateForm").find("#hotCategory-chName");
				if(chName.val() ==""){
					chName.parents("td").find(".required").html("<img src='"+Hot.validateErrorImgSrc+"'/>"+Hot.validateTip.categoryChName.empty);
					chName.focus(function(){
						$(this).parents("td").find(".required").html("*");
					});
					return false;
				}
				if(chName.val().length > 50){
					chName.parents("td").find(".required").html("<img src='"+Hot.validateErrorImgSrc+"'/>"+Hot.validateTip.categoryChName.length);
					chName.focus(function(){
						$(this).parents("td").find(".required").html("*");
					});
					return false;
				}
			}
			return true;
		},
		validateHotForm:function (type){
			var hotName = $("#hotName");
 			if(hotName.val() ==""){
				hotName.parents("td").find(".required").html("<img src='"+Hot.validateErrorImgSrc+"'/>"+Hot.validateTip.hotName.empty);
				hotName.focus(function(){
					$(this).parents("td").find(".required").html("*");
				});
				return false;
			}
			if(hotName.val().length>50){
				hotName.parents("td").find(".required").html("<img src='"+Hot.validateErrorImgSrc+"'/>"+Hot.validateTip.hotName.length);
				hotName.focus(function(){
					$(this).parents("td").find(".required").html("*");
				});
				return false;
			}
				
			return true;
		},
		//查询后通过json返回的数据,显示 到页面中
 		bindHotList:function(json,key){
 			var list = $("#"+key+"List");
 			var html= [];
 			list.html("");
 			
 			var template = $("#"+key+"Template");
 			var temp = template.html();
 			
 			$.each(json,function(i,data){
 				var row =temp;
 				 row = row.replace(/\%{rowid}%/g, data.id);
 				 row = row.replace(/\%{hotType}%/g, data.hotCategory.chName);
				 row = row.replace(/\%{hotName}%/g, data.hotName);
				 row = row.replace(/\%{adress}%/g, data.address);
				 row = row.replace(/\%{lon}%/g, data.lon);
				 row = row.replace(/\%{lat}%/g, data.lat);
				 row = row.replace(/\%{zoom}%/g, data.zoom);
				 row = row.replace(/\%{createTime}%/g, (data.createTime).replace("T","&nbsp;&nbsp;"));
 				html.push(row);
 			});
 			list.html(html.join(""));
 			this.calTreeHeight();
 		},
		/**
		 * 更新文件
		 */
		updateFile : function(form){
			var url = Hot.url["updateFile"];
			var isValidate = this.validateUploadForm();
			if(isValidate){
				this.upload(form, url);
			}
		},

 		/**
		 * 上传文件
		 */
 		uploadFile:function(form){
 			var url = Hot.url["uploadFile"];
			var isValidate = this.validateUploadForm();
			if(isValidate){
				this.upload(form, url);
			}
 		},
 		/**
		 * 构建文件上传域
		 */
		buildFileUploadFields : function(form){
			var fileValue = $("#"+form)[0].file.value;
			var fileFullName = fileValue.substr(fileValue.lastIndexOf("\\")+1);
			$("#file-name").val(fileFullName.substr(0,fileFullName.lastIndexOf("\.")));
			$("#file-type").val(fileFullName.substr(fileFullName.lastIndexOf("\.")+1));
		},
		/**
		 * 上传
		 * @param form 上传表单
		 * @param url 上传地址
		 */
		upload : function(form, url){
			$("#uploadForm").find(".required").html("<img src='"+Hot.loadingImgSrc+"'/>");
			this.buildFileUploadFields(form);
			$(document).ready(function(){
				var options = {
					url : TDT.getAppPath(url),
					type : "POST",
					dataType : "html",
					success : function(data){
						var json = eval("(" + data + ")");
						if(json.fileId){
							$("#uploadForm").find(".required").html("");
							$("#hot-fileId").val(json.fileId);
							$("#file-id").val(json.fileId);
							Hot.fn.viewFile(json.fileId);
						}else if(json.msg){
							$("#uploadForm").find(".required").html("<img src='"+Hot.validateErrorImgSrc+"'/>"+json.msg);
						}
					}
				};
				$("#"+form).ajaxSubmit(options);
				return false;
			});
		},
		/**
		 * 显示文件
		 */
		viewFile : function(id){
			var url = Hot.url["viewFile"];
			var params = "fileId="+id+"&t="+Date.parse(new Date());
			var action = TDT.getAppPath(url)+"?"+params;
			$("#pic-src").attr("src",action);
		},
 		validateUploadForm : function(){
			var jqUploadForm = $("#uploadForm");
			jqUploadForm.find(".required").html("");
			var fileValue = jqUploadForm[0].file.value;
			if(fileValue != ""){
				var reg = /^.*?\.(jpg|jpeg|png)$/gi;
				var r = fileValue.match(reg);
				if(!r){
					jqUploadForm.find(".required").html("<img src='"+Hot.validateErrorImgSrc+"'/>"+Hot.validateTip.file.type);
					return false;
				}
			} else{
				jqUploadForm.find(".required").html("<img src='"+Hot.validateErrorImgSrc+"'/>"+Hot.validateTip.file.empty);
				return false;
			}
			return true;
		},
		 calTreeHeight:function(){
			$(".hot-panel").height($(".hot-box-table").height()-18);
			//$(".tree-container").height($(".hot-panel").height()-$(".tree-title").height());
		},
		up:function(id){
			var url = Hot.url["up"];
			var params = "sid="+id;
			TDT.getDS(url,params,true,function(json){
				if(json.result){
					TDT.go('hot.html');	
				}
			});
		},
		upToTop:function(id){
			var url = Hot.url["upToTop"];
			var params = "sid="+id;
			TDT.getDS(url,params,true,function(json){
				if(json.result){
					TDT.go('hot.html');	
				}
			});
		},
		down:function(id){
			var url = Hot.url["down"];
			var params = "sid="+id;
			TDT.getDS(url,params,true,function(json){
				if(json.result){
					TDT.go('hot.html');	
				}
			});
		},
		downToBottom:function(id){
			var url = Hot.url["downToBottom"];
			var params = "sid="+id;
			TDT.getDS(url,params,true,function(json){
				if(json.result){
					TDT.go('hot.html');	
				}
			});
		}
 	};
 	
 	Hot.fn.init.prototype = Hot.fn;
 	
 })();