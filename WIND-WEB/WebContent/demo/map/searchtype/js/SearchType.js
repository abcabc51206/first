/**
 * 分类搜索 模块对象
 * @author 朱泽江
 * @version 1.0 2012/8/1
 */
 (function(){
 	var SearchType = window.SearchType = function(){
 		return new SearchType.fn.init();
 	};
 	
 	SearchType.url = {
 		getAll:"searchType/findAllByPage.do",
 		add:"searchType/addSearchType.do",
 		update:"searchType/updateSearchType.do",
 		del:"searchType/deleteSearchType.do",
 		searchByKey:"searchType/searchByKey.do",
 		findById:"searchType/findById.do",
 		findListByTreeId:"searchType/findListByTreeId.do",
 		uploadFile : "searchType/uploadFile.do",
		updateFile : "searchType/updateFile.do",
		viewFile : "searchType/viewFile.do",
		expExcel:"searchType/expExcel.do",
 		impExcel:"searchType/impExcel.do",
 		upToTop : "searchType/upToTop.do",
 		uploadByRUL : "searchType/uploadByRUL.do",
		up : "searchType/up.do",
		down : "searchType/down.do",
		downToBottom : "searchType/downToBottom.do",
 		parentId:"searchType/getParentNode.do"
 	};
 	
 	
 	SearchType.pageNum = 1;
 	SearchType.pageSize = 10;
 	SearchType.selTree = undefined;
 	SearchType.parentNum = 0;
 	SearchType.validateErrorImgSrc = "../images/error.gif";
 	SearchType.loadingImgSrc = "../images/loading.gif";
	SearchType.uploadSuccessImgSrc = "../images/success.gif";
	
	//表单验证提示信息
	SearchType.validateTip = {
		img : {
			empty : "请选择上传文件",
			type : "图片格式为jpg|jpeg|png，请重新选择"
		},
		excel : {
			empty : "请选择上传文件",
			type : "文件格式为xls|xlsx，请重新选择"
		},
		url : {
			empty : "请输入地址",
			fail : "输入的服务地址无效"
		},
		chName : {
			empty : "分类名称不能为空，请输入" 
		}, 
		code : {
			empty : "分类编码不能为空，请输入" 
		} 
	};
 	
 	SearchType.fn = SearchType.prototype = {
 		init:function(){
 			return this;
 		},
 		addSearchType:function(){
 			var fileId = $("#file-id").val();
			$("#searchType-file-id").val(fileId);
 			var url = SearchType.url["add"];
			var isValidate = this.validateSearchTypeForm("add");
			if(isValidate){
				TDT.formSubmit("researchAddForm",url, null, true, function(json){
					if(json.result){
		    			TDT.baseDialog("操作成功！", "确认并继续添加", "返回列表", function(){
		    				TDT.go('searchtype-add.html');
		    			},
		    			function(){
		    				TDT.go('searchtype.html');
		    			});
					}
				});
			}
 		},
 		updateSearchType:function(){
 			var fileId = $("#file-id").val();
			$("#searchType-file-id").val(fileId);
 			var url = SearchType.url["update"];
 			var isValidate = this.validateSearchTypeForm("edit");
			if(isValidate){
				TDT.formSubmit("searchTypeUpdateForm",url, null, true, function(json){
					if(json.result){
		    			TDT.go('searchtype.html');
					}
				});
			}
 		},
 		findAllByPage:function(){
			var url = SearchType.url["getAll"];
			var params = "pageNum="+SearchType.pageNum+"&pageSize="+SearchType.pageSize;
			TDT.getDS(url,params,true,function(json){
				if(json.result){
					if(json.searchTypeList.length>0){
						SearchType.fn.bindSearchTypeList(json.searchTypeList,"searchType");
						var pagerObj = document.getElementById("pager");
						TDT.pager(SearchType.pageNum, SearchType.pageSize, json.page.recordCount, pagerObj, function(p){
							SearchType.pageNum = p;
							SearchType.fn.findAllByPage();
						});
						
						$("#nomessage").hide();
					}
				} else {
						$("#searchTypeList").html("");
						$("#nomessage").show();
						$("#pager").html("");
				}
			});
 		},
 		findListByTreeId:function(treeId){
			var url = SearchType.url["findListByTreeId"];
			var params = "keyWords="+treeId+"&pageNum="+SearchType.pageNum+"&pageSize="+SearchType.pageSize;
			TDT.getDS(url,params,true,function(json){
				if(json.result){
					if(json.searchTypeList.length>0){
						SearchType.fn.bindSearchTypeList(json.searchTypeList,"searchType");
						var pagerObj = document.getElementById("pager");
						TDT.pager(SearchType.pageNum, SearchType.pageSize, json.page.recordCount, pagerObj, function(p){
							SearchType.pageNum = p;
							SearchType.fn.findListByTreeId(treeId);
						});
						
						$("#nomessage").hide();
					}
				} else {
						$("#searchTypeList").html("");
						$("#nomessage").show();
						$("#pager").html("");
				}
			});
 		},
 		findById:function(id,type){
 			var url = SearchType.url["findById"];
			var params = "sid="+id;
			TDT.getDS(url,params,true,function(json){
				if(json.result){
					SearchType.fn.bindSearchTypeView(json.searchType,type);
				}
			});
 		},
 		searchByKey:function(keyWords){
 			var _that = this;
 			var url = SearchType.url["searchByKey"];
			var params = "keyWords="+keyWords+"&pageNum="+SearchType.pageNum+"&pageSize="+SearchType.pageSize;
			TDT.getDS(url,params,true,function(json){
				if(json.result){
					if(json.searchTypeList.length>0){
						_that.bindSearchTypeList(json.searchTypeList,"searchType");
						var pagerObj = document.getElementById("pager");
						TDT.pager(SearchType.pageNum, SearchType.pageSize, json.page.recordCount, pagerObj, function(p){
							SearchType.pageNum = p;
							_that.searchByKey(keyWords);
						});
						
						$("#nomessage").hide();
					}
				} else {
						$("#searchTypeList").html("");
						$("#nomessage").show();
						$("#pager").html("");
				}
			});
 		},
 		deleteSearchType:function(ids){
 			var url = SearchType.url["del"];
			var params = "ids="+ids;
			TDT.getDS(url,params,true,function(json){
				if(json.result){
					TDT.go('searchtype.html');	
				}
			});
 		},
 		/**
		 * 获取上级行政区
		 */
		getParentNode : function(){
			var _that = this;
			var url = TDT.getAppPath(SearchType.url["parentId"]);
			SearchType.selTree = new Select("searchType-parentId",{
				expand:true,
				hidden_name:"searchType.mapSearchType.id",
				onActivate: function(node) {
					SearchType.parentNum = 0;
			 		if(node.data.parentId == "root"){
			 			SearchType.parentNum ++;
			 		}else {
			 			SearchType.parentNum ++;
			 			_that.calcParentNum(node.parent);
			 		}
			 		$("#searchType-level").val(SearchType.parentNum);
			    },
				onLazyRead : function(node){
					node.appendAjax({
			          debugLazyDelay: 0,
			          url : url,
			          data : {id : node.data.id}
			        });
				},
				children : [{title:"分类搜索目录","isFolder": true, "isLazy": true, id:"root"}]
			});
			SearchType.selTree.addValue("分类搜索目录", "root");
			var rootNode = $("#"+SearchType.selTree.tid).dynatree("getRoot")
			if(rootNode.childList.length > 0){
				rootNode.childList[0].toggleExpand();
			}
		},
		calcParentNum:function(node){
			if(node.data.parentId=="root"){
				SearchType.parentNum ++;
			}else {
				SearchType.parentNum ++;
				this.calcParentNum(node.parent);
			}
		},
		getTreeNode:function(){
			var url = TDT.getAppPath(SearchType.url["parentId"]);
			$("#tree-container").dynatree({
					onActivate: function(node) {
						SearchType.fn.findListByTreeId(node.data.id);
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
							    SearchType.fn.bindContextMenu();
				            }
				    	});
					},
				children : [{title:"分类搜索目录","isFolder": true, "isLazy": true, id:"root"}]
			});
			var rootNode = $("#tree-container").dynatree("getRoot")
			if(rootNode.childList.length > 0){
				rootNode.childList[0].toggleExpand();
			}
			this.findListByTreeId("findAll");
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
						TDT.go('searchtype-add.html?id='+node.data.id+"&title="+node.data.title);		      	
				      	break;
				      case "edit":
				      	if(node.data.id == "root"){
				      		TDT.alert("根目录不允许编辑！");
				      		break;
				      	}
				      	TDT.go('searchtype-edit.html?id='+node.data.id);
				      	break;
				      case "delete":
				      	if(node.data.id == "root"){
				      		TDT.alert("根目录不允许删除！");
				      		break;
				      	}
				      	TDT.confirm("删除此数据的同时会删除其下级分类，您确认删除吗？",function(){
					   		SearchType.fn.deleteSearchType(node.data.id);
				   		});
				        break;
				      default:
				        alert("Todo: appply action '" + action + "' to node " + node);
			      }
		    });
		} ,
 		validateSearchTypeForm:function (type){
 			//type 暂时未使用
 			var code = $("#searchType-code");
 			if(code.val() ==""){
				code.parents("td").find(".required").html("<img src='"+SearchType.validateErrorImgSrc+"'/>"+SearchType.validateTip.code.empty);
				code.focus(function(){
					$(this).parents("td").find(".required").html("*");
				});
				return false;
			}
 			var chName = $("#searchType-chName");
 			if(chName.val() ==""){
				chName.parents("td").find(".required").html("<img src='"+SearchType.validateErrorImgSrc+"'/>"+SearchType.validateTip.chName.empty);
				chName.focus(function(){
					$(this).parents("td").find(".required").html("*");
				});
				return false;
			}
			
 			return true;
 		},
 		
 		bindSearchTypeView:function (data,type){
 			if(type == "view"){
 				$("#classCode").html(data.code);
 				$("#chName").html(data.chName);
 				$("#parentcnName").html(data.mapSearchType.chName);
 				$("#level").html(data.level);
 				$("#remark").html(data.remark);
 			}else {
 				$("#searchType-code").val(data.code);
 				$("#searchType-chName").val(data.chName);
 				$("#searchType-level").val(data.level);
 				$("#searchType-remark").val(data.remark);
 				$("#searchType-id").val(data.id);
 				$("#searchType-sort").val(data.sort);
 				
	 			if(SearchType.selTree){
					SearchType.selTree.addValue(data.mapSearchType.chName, data.mapSearchType.id);
				}
 			}
 			if(data.fileId){
				$("#file-id").val(data.fileId);
				this.viewFile(data.fileId);
			}
		},
		setTreenode:function(nodeName,nodeId){
			if(SearchType.selTree){
					SearchType.selTree.addValue(nodeName, nodeId);
				}
		},
		//查询后通过json返回的数据,显示 到页面中
 		bindSearchTypeList:function(json,key){
 			var list = $("#"+key+"List");
 			var html= [];
 			list.html("");
 			
 			var template = $("#"+key+"Template");
 			var temp = template.html();
 			
 			$.each(json,function(i,data){
 				var row =temp;
 				row = row.replace(/\%{rowid}%/g, data.id);
 				row = row.replace(/\%{classCode}%/g, data.code || "");
 				row = row.replace(/\%{classChName}%/g, data.chName);
 				row = row.replace(/\%{parentChName}%/g, data.mapSearchType.chName);
 				row = row.replace(/\%{level}%/g, data.level);
 				row = row.replace(/\%{remark}%/g, data.remark ||"");
 				html.push(row);
 			});
 			list.html(html.join(""));
 			this.calTreeHeight();
 		},
 		calTreeHeight:function(){
			$(".research-panel").height($(".research-box-table").height()-18);
			//$(".tree-container").height($(".research-panel").height()-$(".tree-title").height());
 		},
 		
 		
 		/**
		 * 服务导入
		 */
		uploadByRUL : function(form){
			var url = SearchType.url["uploadByRUL"];
			var isValidate = this.validateUploadRULForm(form);
			if(isValidate){
				this.upload(form, url);
			}
		},
		 		/**
		 * 验证服务导入表单域
		 */
		validateUploadRULForm : function(form){
			var jqUploadForm = $("#"+form);
			jqUploadForm.find(".required").html("");
			var url = $("#addImpServiceURL").val();
			if(url == ""){
				jqUploadForm.find(".required").html("<img src='"+SearchType.validateErrorImgSrc+"'/>"+SearchType.validateTip.url.empty);
				$("#addImpServiceURL").focus();
				return false;
			}
			return true;
			
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
		 * 显示文件
		 */
		viewFile : function(id){
			var url = SearchType.url["viewFile"];
			var params = "fileId="+id+"&t="+Date.parse(new Date());
			var action = TDT.getAppPath(url)+"?"+params;
			$("#pic-src").attr("src",action);
		},
		expExcel:function(){
 			var url = SearchType.url["expExcel"];
 			window.location.href = TDT.getAppPath(url);
 		},
		/**
		 * 上传Excel
		 */
		updateExcelFile : function(form){
			var url = SearchType.url["impExcel"];
			var isValidate = this.validateUploadForm(form);
			if(isValidate){
				this.upload(form, url);
			}
		},
 		/**
		 * 上传文件
		 */
		uploadFile : function(form){
			var url = SearchType.url["uploadFile"];
			var isValidate = this.validateUploadForm(form);
			if(isValidate){
				this.upload(form, url);
			}
		},
		/**
		 * 更新文件
		 */
		updateFile : function(form){
			var url = SearchType.url["updateFile"];
			var isValidate = this.validateUploadForm(form);
			if(isValidate){
				this.upload(form, url);
			}
		},
		/**
		 * 上传
		 * @param form 上传表单
		 * @param url 上传地址
		 */
		upload : function(form, url){
			var _that = this;
			$("#"+form).find(".required").html("<img src='"+SearchType.loadingImgSrc+"'/>");
			$(document).ready(function(){
				var options = {
					url : TDT.getAppPath(url),
					type : "POST",
					dataType : "html",
					//async:true,
					success : function(data){
						var json = eval("(" + data + ")");
						if(json.result){
							$("#"+form).find(".required").html("<img src='"+SearchType.uploadSuccessImgSrc+"'/>上传成功");
							setTimeout(function () {
								location = location;
							}, 1000); 
						}else if(json.fileId){
							 $("#"+form).find(".required").html("");
							 $("#file-id").val(json.fileId);
							 SearchType.fn.viewFile(json.fileId);
						}else if(json.msg){
							$("#"+form).find(".required").html("<img src='"+SearchType.validateErrorImgSrc+"'/>"+json.msg);
						}
					}
				};
				$("#"+form).ajaxSubmit(options);
				return false;
			});
		},
		/**
		 * 验证分类搜索文件上传表单域
		 */
		validateUploadForm : function(form){
			var jqUploadForm = $("#"+form);
			jqUploadForm.find(".required").html("");
			var fileValue = jqUploadForm.find("input[type='file']").val();
			var reg = /^.*?\.(xls|xlsx)$/i;
			var validateError = SearchType.validateTip.excel;
			if(form == "uploadForm"){//验证图片
				reg = /^.*?\.(jpg|jpeg|png)$/i;
				validateError = SearchType.validateTip.img;
			}else if(form == "addImpExcelForm"){//验证excel
				reg = /^.*?\.(xls|xlsx)$/i;
				validateError = SearchType.validateTip.excel;
			}
			SearchType.validateTip
			if(fileValue != ""){
				var r = fileValue.match(reg);
				if(!r){
					jqUploadForm.find(".required").html("<img src='"+SearchType.validateErrorImgSrc+"'/>"+validateError.type);
					setTimeout(function () {
						jqUploadForm.find(".required").html("");
					}, 1000); 
					return false;
				}
			} else{
				jqUploadForm.find(".required").html("<img src='"+SearchType.validateErrorImgSrc+"'/>"+validateError.empty);
				setTimeout(function () {
					jqUploadForm.find(".required").html("");
				}, 1000); 
				return false;
			}
			return true;
			
		},
		/**
		 * 上移至顶部
		 */
		upToTop : function(id){
			var url = SearchType.url["upToTop"];
			var params = "searchType.id="+id;
			TDT.getDS(url,params,true,function(json){
				if(json.result){
					TDT.go("searchtype.html");
				}
			});
		},
		
		/**
		 * 上移
		 */
		up : function(id){
			var url = SearchType.url["up"];
			var params = "searchType.id="+id;
			TDT.getDS(url,params,true,function(json){
				if(json.result){
					TDT.go("searchtype.html");
				}
			});
		},
		
		/**
		 * 下移
		 */
		down : function(id){
			var url = SearchType.url["down"];
			var params = "searchType.id="+id;
			TDT.getDS(url,params,true,function(json){
				if(json.result){
					TDT.go("searchtype.html");
				}
			});
		},
		
		/**
		 * 下移至底部
		 */
		downToBottom : function(id){
			var url = SearchType.url["downToBottom"];
			var params = "searchType.id="+id;
			TDT.getDS(url,params,true,function(json){
				if(json.result){
					TDT.go("searchtype.html");
				}
			});
		}
 	};
 	
 	SearchType.fn.init.prototype = SearchType.fn;
 	
 })();