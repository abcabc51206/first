/**
 * 示范应用模块对象
 * @author wangshoudong
 * @version 1.0 2012/7/26
 */
(function(){
var DemoApp = window.DemoApp = function(){
		return new DemoApp.fn.init();
	};
	
	DemoApp.url = {
		getAll : "demoapp/findAllByPage.do",
		search : "demoapp/searchByKey.do",
		add : "demoapp/addDemoApp.do",
		update : "demoapp/updateDemoApp.do",
		view : "demoapp/viewDemoApp.do",
		del : "demoapp/deleteDemoApp.do",
		upToTop : "demoapp/upToTop.do",
		up : "demoapp/up.do",
		down : "demoapp/down.do",
		downToBottom : "demoapp/downToBottom.do",
		uploadFile : "demoapp/uploadFile.do",
		updateFile : "demoapp/updateFile.do",
		viewFile : "demoapp/viewFile.do"
		
	};
	
	DemoApp.loadingImgSrc = "../images/loading.gif";
	
	DemoApp.validateErrorImgSrc = "../images/error.gif";
	
	//表单验证提示信息
	DemoApp.validateTip = {
		file : {
			empty : "请选择上传文件",
			type : "图片格式为jpg|jpeg|png，请重新选择"
		},
		
		title : {
			empty : "标题不能为空，请输入",
			length : "标题长度不能超过50个字符"
		},
		
		url : {
			empty : "链接地址不能为空，请输入",
			length : "链接地址长度不能超过100个字符"
		}
	};
	
	//初始当前页
	DemoApp.pageNum = 1;
	
	//当前页记录条数
	DemoApp.pageSize = 10;
	
	DemoApp.fn = DemoApp.prototype = {
	
		/**
		 * 初始化
		 */
		init:function(){
			return this;
		},
		
		/**
		 * 新增示范应用
		 */
		addDemoApp : function(){
			var fileId = $("#file-id").val();
			$("#demoapp-file-id").val(fileId);
			var url = DemoApp.url["add"];
			var isValidate = this.validateDemoAppForm();
			if(isValidate){
				TDT.formSubmit("demoappAddForm",url, null, true, function(json){
					if(json.result){
		    			TDT.baseDialog("操作成功！", "确认并继续添加", "返回列表", function(){
		    				TDT.go('demoapp-add.html');
		    			}, 
		    			function(){
		    				TDT.go('demoapp.html');
		    			});
					}
				});
			}
		},
		
		/**
		 * 更新示范应用
		 */
		updateDemoApp : function(){
			var fileId = $("#file-id").val();
			$("#demoapp-file-id").val(fileId);
			var url = DemoApp.url["update"];
			var isValidate = this.validateDemoAppForm();
			if(isValidate){
				TDT.formSubmit("demoappUpdateForm",url, null, true, function(json){
					if(json.result){
						TDT.go("demoapp.html");
					}
				});
			}
		},
		
		/**
		 * 删除示范应用
		 */
		deleteDemoApp : function(ids){
			var url = DemoApp.url["del"];
			var params = "ids="+ids;
			TDT.getDS(url,params,true,function(json){
				if(json.result){
					TDT.go("demoapp.html");
				}
			});
		},
		
		/**
		 * 获取示范应用明细
		 */
		findDemoAppById : function(id){
			var url = DemoApp.url["view"];
			var params = "demoApp.id="+id;
			TDT.getDS(url,params,true,function(json){
				if(json.result){
					DemoApp.fn.bindDemoApp(json.demoApp);
				}
			});
		},
		
		
		/**
		 * 上移至顶部
		 */
		upToTop : function(id){
			var url = DemoApp.url["upToTop"];
			var params = "demoApp.id="+id;
			TDT.getDS(url,params,true,function(json){
				if(json.result){
					TDT.go("demoapp.html");
				}
			});
		},
		
		/**
		 * 上移
		 */
		up : function(id){
			var url = DemoApp.url["up"];
			var params = "demoApp.id="+id;
			TDT.getDS(url,params,true,function(json){
				if(json.result){
					TDT.go("demoapp.html");
				}
			});
		},
		
		/**
		 * 下移
		 */
		down : function(id){
			var url = DemoApp.url["down"];
			var params = "demoApp.id="+id;
			TDT.getDS(url,params,true,function(json){
				if(json.result){
					TDT.go("demoapp.html");
				}
			});
		},
		
		/**
		 * 下移至底部
		 */
		downToBottom : function(id){
			var url = DemoApp.url["downToBottom"];
			var params = "demoApp.id="+id;
			TDT.getDS(url,params,true,function(json){
				if(json.result){
					TDT.go("demoapp.html");
				}
			});
		},
		
		/**
		 * 分页获取示范应用列表
		 */
		findAllByPage : function(){
			var url = DemoApp.url["getAll"];
			var params = "pageNum="+DemoApp.pageNum+"&pageSize="+DemoApp.pageSize;
			TDT.getDS(url,params,true,function(json){
				if(json.result){
					DemoApp.fn.bindDemoAppList(json.demoAppList,"demoApp");
					var pagerObj = document.getElementById("pager");
					TDT.pager(DemoApp.pageNum, DemoApp.pageSize, json.page.recordCount, pagerObj, function(p){
						DemoApp.pageNum = p;
						DemoApp.fn.findAllByPage();
					});
				} else{
					$("#demoAppList").html("");
					$("#pager").html("&nbsp;");
					$("#noData").show();
				}
			});
			
		},
		
		/**
		 * 关键字搜索示范应用
		 */
		searchDemoApp : function(key){
			var url = DemoApp.url["search"];
			var params = "key="+encodeURIComponent(key)+"&pageNum="+DemoApp.pageNum+"&pageSize="+DemoApp.pageSize;
			TDT.getDS(url,params,true,function(json){
				if(json.result){
					DemoApp.fn.bindDemoAppList(json.demoAppList,"demoApp");
					var pagerObj = document.getElementById("pager");
					TDT.pager(DemoApp.pageNum, DemoApp.pageSize, json.page.recordCount, pagerObj, function(p){
						DemoApp.pageNum = p;
						DemoApp.fn.searchDemoApp(key);
					});
				} else{
					$("#demoAppList").html("");
					$("#pager").html("&nbsp;");
					$("#noData").show();
				}
			});
			
		},
		
		/**
		 * 验证示范应用表单域
		 */
		validateDemoAppForm : function(){
			//标题
			var jqTitle = $("#demoapp-title");
			var title = jqTitle.val();
			if(title == ""){
				jqTitle.parents("td").find(".required").html("<img src='"+DemoApp.validateErrorImgSrc+"'/>"+DemoApp.validateTip.title.empty);
				jqTitle.focus(function(){
					$(this).parents("td").find(".required").html("");
				});
				return false;
			} else {
				if(title.length > 50){
					jqTitle.parents("td").find(".required").html("<img src='"+DemoApp.validateErrorImgSrc+"'/>"+DemoApp.validateTip.title.length);
					jqTitle.focus(function(){
						$(this).parents("td").find(".required").html("");
					});
					return false;
				}
			}
			
			//链接地址
			var jqUrl = $("#demoapp-url");
			var url = jqUrl.val();
			if(url == ""){
				jqUrl.parents("td").find(".required").html("<img src='"+DemoApp.validateErrorImgSrc+"'/>"+DemoApp.validateTip.url.empty);
				jqUrl.focus(function(){
					$(this).parents("td").find(".required").html("");
				});
				return false;
			} else {
				if(url.length > 100){
					jqUrl.parents("td").find(".required").html("<img src='"+DemoApp.validateErrorImgSrc+"'/>"+DemoApp.validateTip.url.length);
					jqUrl.focus(function(){
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
				var reg = /^.*?\.(jpg|jpeg|png)$/gi;
				var r = fileValue.match(reg);
				if(!r){
					jqUploadForm.find(".required").html("<img src='"+DemoApp.validateErrorImgSrc+"'/>"+DemoApp.validateTip.file.type);
					return false;
				}
			} else{
				jqUploadForm.find(".required").html("<img src='"+DemoApp.validateErrorImgSrc+"'/>"+DemoApp.validateTip.file.empty);
				return false;
			}
			return true;
			
		},
		
		bindDemoApp : function(data){
			if(data.fileId){
				$("#file-id").val(data.fileId);
				this.viewFile(data.fileId);
			}
			$("#demoapp-title").val(data.title);
			$("#demoapp-url").val(data.url);
			$("#demoapp-brief").val(data.brief);
			$("#demoapp-sort").val(data.sort);
		},
		
		/*
		 * 绑定示范应用数据列表
		 */
		bindDemoAppList : function(json, key){
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
				row = row.replace(/\%{title}%/g, data.title);
				row = row.replace(/\%{createTime}%/g, (data.createTime).replace("T","&nbsp;&nbsp;"));
				row = row.replace(/\%{url}%/g, data.url);
				html.push(row);
			});
			list.html(html.join(""));
		},
		
		/**
		 * 上传文件
		 */
		uploadFile : function(form){
			var url = DemoApp.url["uploadFile"];
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
			var url = DemoApp.url["updateFile"];
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
			$("#uploadForm").find(".required").html("<img src='"+DemoApp.loadingImgSrc+"'/>");
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
							$("#file-id").val(json.fileId);
							DemoApp.fn.viewFile(json.fileId);
						}else if(json.msg){
							$("#uploadForm").find(".required").html("<img src='"+DemoApp.validateErrorImgSrc+"'/>"+json.msg);
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
			var url = DemoApp.url["viewFile"];
			var params = "fileId="+id+"&t="+Date.parse(new Date());
			var action = TDT.getAppPath(url)+"?"+params;
			$("#pic-src").attr("src",action);
		}
	
	};
	
	DemoApp.fn.init.prototype = DemoApp.fn;
	
})();
