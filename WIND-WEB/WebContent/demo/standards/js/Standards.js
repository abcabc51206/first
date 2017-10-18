/**
 * 标准规范模块对象
 * @author wangshoudong
 * @version 1.0 2012/7/26
 */
(function(){
var Standards = window.Standards = function(){
		return new Standards.fn.init();
	};
	
	Standards.url = {
		getAll : "standar/findAllByPage.do",
		search : "standar/searchByKey.do",
		add : "standar/addStandarDoc.do",
		update : "standar/updateStandarDoc.do",
		view : "standar/viewStandarDoc.do",
		del : "standar/deleteStandarDoc.do",
		uploadFile : "standar/uploadFile.do",
		updateFile : "standar/updateFile.do",
		downloadFile : "standar/downloadFile.do",
		standardsType : "standarCategory/getChild.do",
		addSc : "standarCategory/addStandarCategory.do",
		updateSc : "standarCategory/updateStandarCategory.do",
		deleteSc : "standarCategory/deleteStandarCategory.do"
		
		
	};
	
	//下拉列表选择树
	Standards.selTree = undefined;
	
	Standards.loadingImgSrc = "../images/loading.gif";
	
	Standards.validateErrorImgSrc = "../images/error.gif";
	
	Standards.uploadSuccessImgSrc = "../images/success.gif";
	
	//标准规范表单验证提示信息
	Standards.validateTip = {
		file : {
			empty : "请选择上传文件",
			type : "文件格式为pdf|doc|docx|txt，请重新选择"
		},
		
		code : {
			empty : "文件代码不能为空，请输入",
			length : "文件代码不能超过50个字符"
		},
		
		name : {
			empty : "文件名称不能为空，请输入",
			length : "文件名称不能超过50个字符"
		},
		
		year : {
			empty : "发布年份不能为空，请输入",
			length : "发布年份只能为4个数字，如2012"
		}
	};
	
	//标准规范目录表单验证提示信息
	Standards.categoryValidateTip = {
		
		name : {
			empty : "名称不能为空，请输入",
			length : "名称长度不能超过10个字符"
		}
	};
	
	//初始当前页
	Standards.pageNum = 1;
	
	//当前页记录条数
	Standards.pageSize = 10;
	
	Standards.fn = Standards.prototype = {
	
		/**
		 * 初始化
		 */
		init:function(){
			return this;
		},
		
		/**
		 * 新增标准规范
		 */
		addStandards : function(){
			var fileId = $("#file-id").val();
			$("#standards-file-id").val(fileId);
			var url = Standards.url["add"];
			var isValidate = this.validateStandardsForm();
			if(isValidate){
				TDT.formSubmit("standardsAddForm",url, null, true, function(json){
					if(json.result){
		    			TDT.baseDialog("操作成功！", "确认并继续添加", "返回列表", function(){
		    				TDT.go('standards-add.html');
		    			}, 
		    			function(){
		    				TDT.go('standards.html');
		    			});
					}
				});
			}
		},
		
		/**
		 * 更新标准规范
		 */
		updateStandards : function(){
			var fileId = $("#file-id").val();
			$("#standards-file-id").val(fileId);
			var url = Standards.url["update"];
			var isValidate = this.validateStandardsForm();
			if(isValidate){
				TDT.formSubmit("standardsUpdateForm",url, null, true, function(json){
					if(json.result){
						TDT.go("standards.html");
					}
				});
			}
		},
		
		/**
		 * 删除标准规范
		 */
		deleteStandards : function(ids){
			var url = Standards.url["del"];
			var params = "ids="+ids;
			TDT.getDS(url,params,true,function(json){
				if(json.result){
					TDT.go("standards.html");
				}
			});
		},
		
		/**
		 * 获取标准规范明细
		 */
		findStandardsById : function(id){
			var url = Standards.url["view"];
			var params = "standarDoc.id="+id;
			TDT.getDS(url,params,true,function(json){
				if(json.result){
					Standards.fn.bindStandards(json.standarDoc);
				}
			});
		},
		
		/**
		 * 获取标准规范分类（添加页面）
		 */
		getStandardsDocType : function(){
			var url = TDT.getAppPath(Standards.url["standardsType"]);
			Standards.selTree = new Select("standards-type",{
				expand:true,
				hidden_name:"standarDoc.standarCategory.id",
				onLazyRead : function(node){
					node.appendAjax({
			          debugLazyDelay: 0,
			          url : url,
			          data : {id : node.data.id}
			        });
				},
				children : [{title:"下载类型","isFolder": true, "isLazy": true, id:"root"}]
			});
			Standards.selTree.addValue("下载类型", "root");
			var rootNode = $("#"+Standards.selTree.tid).dynatree("getRoot");
			if(rootNode.childList.length > 0){
				rootNode.childList[0].toggleExpand();
			}
		},
		
		/**
		 * 获取标准规范类型（列表页面）
		 */
		getStandardsType : function(){
			var url = TDT.getAppPath(Standards.url["standardsType"]);
			$("#tree-container").dynatree({
					onActivate: function(node) {
						Standards.fn.findAllByPage(node.data.id);
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
							    Standards.fn.bindContextMenu();
				            }
				    	});
					},
				children : [{title:"下载类型","isFolder": true, "isLazy": true, id:"root"}]
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
						Standards.fn.addSc(node);			      	
				      	break;
				      case "edit":
				      	if(node.data.id == "root"){
				      		TDT.alert("根目录不允许编辑！");
				      		break;
				      	}
				      	Standards.fn.updateSc(node);
				      	break;
				      case "delete":
				      	if(node.data.id == "root"){
				      		TDT.alert("根目录不允许删除！");
				      		break;
				      	}
				      	TDT.confirm("删除该目录同时会删除与该目录相关的子目录和文件，您确认删除吗？",function(){
				      		Standards.fn.deleteSc(node);
				      	});
				        break;
				      default:
				        alert("Todo: appply action '" + action + "' to node " + node);
			      }
		    });
		},
		
		
		/**
		 * 分页获取标准规范列表
		 */
		findAllByPage : function(type){
			var url = Standards.url["getAll"];
			var params = "standarDoc.standarCategory.id="+type+"&pageNum="+Standards.pageNum+"&pageSize="+Standards.pageSize;
			TDT.getDS(url,params,true,function(json){
				if(json.result){
					Standards.fn.bindStandardsList(json.standarDocList,"standarDoc");
					var pagerObj = document.getElementById("pager");
					TDT.pager(Standards.pageNum, Standards.pageSize, json.page.recordCount, pagerObj, function(p){
						Standards.pageNum = p;
						Standards.fn.findAllByPage();
					});
				} else{
					$("#standarDocList").html("");
					$("#pager").html("");
					$("#noData").show();
				}
			});
			
		},
		
		/**
		 * 关键字搜索标准规范
		 */
		searchStandards : function(keyword){
			var url = Standards.url["search"];
			var params = "keyword="+encodeURIComponent(keyword)+"&pageNum="+Standards.pageNum+"&pageSize="+Standards.pageSize;
			TDT.getDS(url,params,true,function(json){
				if(json.result){
					Standards.fn.bindStandardsList(json.standarDocList,"standarDoc");
					var pagerObj = document.getElementById("pager");
					TDT.pager(Standards.pageNum, Standards.pageSize, json.page.recordCount, pagerObj, function(p){
						Standards.pageNum = p;
						Standards.fn.searchStandards(keyword);
					});
				} else{
					$("#standarDocList").html("");
					$("#pager").html("&nbsp;");
					$("#noData").show();
				}
			});
			
		},
		
		/**
		 * 验证标准规范表单域
		 */
		validateStandardsForm : function(){
			//标准代码
			var jqCode = $("#standards-code");
			var code = jqCode.val();
			if(code == ""){
				jqCode.parents("td").find(".required").html("<img src='"+Standards.validateErrorImgSrc+"'/>"+Standards.validateTip.code.empty);
				jqCode.focus(function(){
					$(this).parents("td").find(".required").html("");
				});
				return false;
			} else {
				if(code.length > 50){
					jqCode.parents("td").find(".required").html("<img src='"+Standards.validateErrorImgSrc+"'/>"+Standards.validateTip.code.length);
					jqCode.focus(function(){
						$(this).parents("td").find(".required").html("");
					});
					return false;
				}
			}
			
			//标准名称
			var jqName = $("#standards-name");
			var name = jqName.val();
			if(name == ""){
				jqName.parents("td").find(".required").html("<img src='"+Standards.validateErrorImgSrc+"'/>"+Standards.validateTip.name.empty);
				jqName.focus(function(){
					$(this).parents("td").find(".required").html("");
				});
				return false;
			} else {
				if(name.length > 50){
					jqName.parents("td").find(".required").html("<img src='"+Standards.validateErrorImgSrc+"'/>"+Standards.validateTip.name.length);
					jqName.focus(function(){
						$(this).parents("td").find(".required").html("");
					});
					return false;
				}
			}
			
			//发布年份
			var jqYear = $("#standards-year");
			var year = jqYear.val();
			if(year == ""){
				jqYear.parents("td").find(".required").html("<img src='"+Standards.validateErrorImgSrc+"'/>"+Standards.validateTip.year.empty);
				jqYear.focus(function(){
					$(this).parents("td").find(".required").html("");
				});
				return false;
			} else {
				if(year.length > 4){
					jqYear.parents("td").find(".required").html("<img src='"+Standards.validateErrorImgSrc+"'/>"+Standards.validateTip.year.length);
					jqYear.focus(function(){
						$(this).parents("td").find(".required").html("");
					});
					return false;
				}
			}
			
			return true;
			
		},
		
		/**
		 * 验证示范应用文件上传表单域
		 */
		validateUploadForm : function(){
			var jqUploadForm = $("#uploadForm");
			jqUploadForm.find(".required").html("");
			var fileValue = jqUploadForm[0].file.value;
			if(fileValue != ""){
				var reg = /^.*?\.(pdf|docx|doc|txt)$/i;
				var r = fileValue.match(reg);
				if(!r){
					jqUploadForm.find(".required").html("<img src='"+Standards.validateErrorImgSrc+"'/>"+Standards.validateTip.file.type);
					return false;
				}
			} else{
				jqUploadForm.find(".required").html("<img src='"+Standards.validateErrorImgSrc+"'/>"+Standards.validateTip.file.empty);
				return false;
			}
			return true;
			
		},
		
		bindStandards : function(data){
			if(data.stFileId){
				$("#file-id").val(data.stFileId);
			}
			//编辑页面数据绑定
			$("#standards-code").val(data.stCode);
			$("#standards-name").val(data.stName);
			$("#standards-brief").val(data.stBrief);
			$("#standards-year").val(data.stYear);
			if(Standards.selTree){
				Standards.selTree.addValue(data.standarCategory.chName, data.standarCategory.id);
			}
		},
		
		/*
		 * 绑定标准规范数据列表
		 */
		bindStandardsList : function(json, key){
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
		        row = row.replace(/\%{fileid}%/g, data.stFileId);
				row = row.replace(/\%{code}%/g, data.stCode);
				row = row.replace(/\%{name}%/g, TDT.strCut(data.stName,20));
				row = row.replace(/\%{year}%/g, data.stYear);
				row = row.replace(/\%{type}%/g, data.standarCategory.chName);
				row = row.replace(/\%{createTime}%/g, (data.createTime).replace("T","&nbsp;&nbsp;"));
				html.push(row);
			});
			list.html(html.join(""));
			calTreeHeight();
		},
		
		/**
		 * 上传文件
		 */
		uploadFile : function(form){
			var url = Standards.url["uploadFile"];
			var isValidate = this.validateUploadForm();
			if(isValidate){
				this.buildFileUploadFields(form);
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
		 * 更新文件
		 */
		updateFile : function(form){
			var url = Standards.url["updateFile"];
			var isValidate = this.validateUploadForm();
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
			$("#uploadForm").find(".required").html("<img src='"+Standards.loadingImgSrc+"'/>");
			this.buildFileUploadFields(form);
			$(document).ready(function(){
				var options = {
					url : TDT.getAppPath(url),
					type : "POST",
					dataType : "html",
					success : function(data){
						var json = eval("(" + data + ")");
						if(json.fileId){
							$("#file-id").val(json.fileId);
							$("#uploadForm").find(".required").html("<img src='"+Standards.uploadSuccessImgSrc+"'/>上传成功");
						}else if(json.msg){
							$("#uploadForm").find(".required").html("<img src='"+Standards.validateErrorImgSrc+"'/>"+json.msg);
						}
					}
				};
				$("#"+form).ajaxSubmit(options);
				return false;
			});
		},
		
		/**
		 * 下载文件
		 */
		downloadFile : function(id){
			var url = Standards.url["downloadFile"];
			var params = "fileId="+id+"&t="+Date.parse(new Date());
			var action = TDT.getAppPath(url)+"?"+params;
		},
		
		/**
		 * 新增标准规范目录
		 */
		addSc : function(node){
			var url = Standards.url["addSc"];
			art.dialog({
			    title: '添加下载文件目录',
			    content: $("#sdAddDia").html(),
			    ok: function(){
			    	var isValidate = Standards.fn.validateScForm("scAddForm");
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
		 * 更新标准规范目录
		 */
		updateSc : function(node){
			var url = Standards.url["updateSc"];
			art.dialog({
			    title: '编辑下载文件目录',
			    content: $("#sdUpdateDia").html(),
			    ok: function(){
			    	var isValidate = Standards.fn.validateScForm("scUpdateForm");
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
		 * 删除标准规范目录
		 */
		deleteSc : function(node){
			var url = Standards.url["deleteSc"];
			var params = "id="+node.data.id;
			TDT.getDS(url,params,true,function(json){
				if(json.result){
					node.remove();
				}
			});
		},
		
		/**
		 * 验证标准规范目录表单
		 */
		validateScForm : function(formId){
			var jqForm = $("#"+formId);
			//名称
			var jqName = jqForm.find("#scName");
			var name = jqName.val();
			if(name == ""){
				jqName.parent().find(".required").html("<img src='"+Standards.validateErrorImgSrc+"'/>"+Standards.categoryValidateTip.name.empty);
				jqName.focus(function(){
					$(this).parent().find(".required").html("");
				});
				return false;
			} else {
				if(name.length > 50){
					jqName.parent().find(".required").html("<img src='"+Standards.validateErrorImgSrc+"'/>"+Standards.categoryValidateTip.name.length);
					jqName.focus(function(){
						$(this).parent().find(".required").html("");
					});
					return false;
				}
			}
			
			return true;
		}
	
	};
	
	Standards.fn.init.prototype = Standards.fn;
	
})();
