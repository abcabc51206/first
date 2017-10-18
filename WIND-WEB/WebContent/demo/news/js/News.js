/**
 * 新闻模块对象
 * @author wangshoudong
 * @version 1.0 2012/7/26
 */
(function(){
var News = window.News = function(){
		return new News.fn.init();
	};
	
	News.url = {
		getAll : "news/findAllByPage.do",
		getAllByCategory : "news/findNewsByCategoryId.do",
		search : "news/searchByKey.do",
		add : "news/addNews.do",
		update : "news/updateNews.do",
		view : "news/viewNews.do",
		del : "news/deleteNews.do",
		upToTop : "news/upToTop.do",
		up : "news/up.do",
		down : "news/down.do",
		downToBottom : "news/downToBottom.do",
		uploadFile : "news/uploadFile.do",
		updateFile : "news/updateFile.do",
		viewFile : "news/viewFile.do",
		newsType : "newsCategory/getChild.do"
		
	};
	
	//编辑器
	News.editor = undefined;
	
	//下拉列表选择树
	News.selTree = undefined;
	
	News.loadingImgSrc = "../images/loading.gif";
	
	News.validateErrorImgSrc = "../images/error.gif";
	
	//表单验证提示信息
	News.validateTip = {
		file : {
			empty : "请选择上传文件",
			type : "图片格式为jpg|jpeg|png，请重新选择"
		},
		
		title : {
			empty : "标题不能为空，请输入",
			length : "标题长度不能超过50个字符"
		},
		
		brief : {
			empty : "导读不能为空，请输入",
			length : "导读长度不能超过500个字符"
		},
		
		keyword : {
			empty : "关键字不能为空，请输入",
			length : "关键字长度不能超过100个字符"
		}
	};
	
	//初始当前页
	News.pageNum = 1;
	
	//当前页记录条数
	News.pageSize = 10;
	
	News.fn = News.prototype = {
	
		/**
		 * 初始化
		 */
		init:function(){
			return this;
		},
		
		/**
		 * 新增新闻
		 */
		addNews : function(){
			var fileId = $("#file-id").val();
			$("#news-file-id").val(fileId);
			var url = News.url["add"];
			var isValidate = this.validateNewsForm();
			if(isValidate){
				TDT.formSubmit("newsAddForm",url, null, true, function(json){
					if(json.result){
		    			TDT.baseDialog("操作成功！", "确认并继续添加", "返回列表", function(){
		    				TDT.go('news-add.html');
		    			}, 
		    			function(){
		    				TDT.go('news.html');
		    			});
					}
				});
			}
		},
		
		/**
		 * 更新新闻
		 */
		updateNews : function(){
			var fileId = $("#file-id").val();
			$("#news-file-id").val(fileId);
			var url = News.url["update"];
			var isValidate = this.validateNewsForm();
			if(isValidate){
				TDT.formSubmit("newsUpdateForm",url, null, true, function(json){
					if(json.result){
						TDT.go("news.html");
					}
				});
			}
		},
		
		/**
		 * 删除新闻
		 */
		deleteNews : function(ids){
			var url = News.url["del"];
			var params = "ids="+ids;
			TDT.getDS(url,params,true,function(json){
				if(json.result){
					TDT.go("news.html");
				}
			});
		},
		
		/**
		 * 获取新闻明细
		 */
		findNewsById : function(id){
			var url = News.url["view"];
			var params = "news.id="+id;
			TDT.getDS(url,params,true,function(json){
				if(json.result){
					News.fn.bindNews(json.news);
				}
			});
		},
		
		/**
		 * 获取新闻类型
		 */
		getNewsType : function(){
			var url = TDT.getAppPath(News.url["newsType"]);
			News.selTree = new Select("news-type",{
				expand:true,
				hidden_name:"news.newsCategory.id",
				onLazyRead : function(node){
					node.appendAjax({
			          debugLazyDelay: 0,
			          url : url,
			          data : {id : node.data.id}
			        });
				},
				children : [{title:"新闻类型","isFolder": true, "isLazy": true, id:"root"}]
			});
			News.selTree.addValue("新闻类型", "root");
			var rootNode = $("#"+News.selTree.tid).dynatree("getRoot")
			if(rootNode.childList.length > 0){
				rootNode.childList[0].toggleExpand();
			}
		},
		/**
		 * 分页获取新闻列表
		 */
		getAllByCategory : function(categoryId){
			var url = News.url["getAllByCategory"];
			var params = "news.newsCategory.id="+categoryId+"&pageNum="+News.pageNum+"&pageSize="+News.pageSize;
			TDT.getDS(url,params,true,function(json){
				if(json.result){
					News.fn.bindNewsList(json.newsList,"news");
					var pagerObj = document.getElementById("pager");
					TDT.pager(News.pageNum, News.pageSize, json.page.recordCount, pagerObj, function(p){
						News.pageNum = p;
						News.fn.getAllByCategory(categoryId);
					});
				} else{
					$("#newsList").html("");
					$("#pager").html("");
					$("#noData").show();

				}
			});
			
		},
		getTreeNode : function(){
			var url = TDT.getAppPath(News.url["newsType"]);
			$("#tree-container").dynatree({
					onActivate: function(node) {
							News.fn.getAllByCategory(node.data.id);
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
							    //Sar.fn.bindContextMenu();
				            }
				    	});
					},
				children : [{title:"新闻类型","isFolder": true, "isLazy": true, id:"root"}]
			});
			
			var rootNode = $("#tree-container").dynatree("getRoot")
			if(rootNode.childList.length > 0){
				rootNode.childList[0].toggleExpand();
			}
			this.getAllByCategory("root");

		},
		
		/**
		 * 上移至顶部
		 */
		upToTop : function(id){
			var url = News.url["upToTop"];
			var params = "news.id="+id;
			TDT.getDS(url,params,true,function(json){
				if(json.result){
					TDT.go("news.html");
				}
			});
		},
		
		/**
		 * 上移
		 */
		up : function(id){
			var url = News.url["up"];
			var params = "news.id="+id;
			TDT.getDS(url,params,true,function(json){
				if(json.result){
					TDT.go("news.html");
				}
			});
		},
		
		/**
		 * 下移
		 */
		down : function(id){
			var url = News.url["down"];
			var params = "news.id="+id;
			TDT.getDS(url,params,true,function(json){
				if(json.result){
					TDT.go("news.html");
				}
			});
		},
		
		/**
		 * 下移至底部
		 */
		downToBottom : function(id){
			var url = News.url["downToBottom"];
			var params = "news.id="+id;
			TDT.getDS(url,params,true,function(json){
				if(json.result){
					TDT.go("news.html");
				}
			});
		},
		
		/**
		 * 分页获取新闻列表
		 */
		findAllByPage : function(){
			var url = News.url["getAll"];
			var params = "pageNum="+News.pageNum+"&pageSize="+News.pageSize;
			TDT.getDS(url,params,true,function(json){
				if(json.result){
					News.fn.bindNewsList(json.newsList,"news");
					var pagerObj = document.getElementById("pager");
					TDT.pager(News.pageNum, News.pageSize, json.page.recordCount, pagerObj, function(p){
						News.pageNum = p;
						News.fn.findAllByPage();
					});
				} else{
					$("#newsList").html("");
					$("#pager").html("");
					$("#noData").show();
				}
			});
			
		},
		
		/**
		 * 关键字搜索新闻
		 */
		searchNews : function(keyword){
			var url = News.url["search"];
			var params = "keyword="+encodeURIComponent(keyword)+"&pageNum="+News.pageNum+"&pageSize="+News.pageSize;
			TDT.getDS(url,params,true,function(json){
				if(json.result){
					News.fn.bindNewsList(json.newsList,"news");
					var pagerObj = document.getElementById("pager");
					TDT.pager(News.pageNum, News.pageSize, json.page.recordCount, pagerObj, function(p){
						News.pageNum = p;
						News.fn.searchNews(keyword);
					});
				} else{
					$("#newsList").html("");
					$("#pager").html("&nbsp;");
					$("#noData").show();
				}
			});
			
		},
		
		/**
		 * 验证新闻表单域
		 */
		validateNewsForm : function(){
			//标题
			var jqTitle = $("#news-title");
			var title = jqTitle.val();
			if(title == ""){
				jqTitle.parents("td").find(".required").html("<img src='"+News.validateErrorImgSrc+"'/>"+News.validateTip.title.empty);
				jqTitle.focus(function(){
					$(this).parents("td").find(".required").html("*");
				});
				return false;
			} else {
				if(title.length > 50){
					jqTitle.parents("td").find(".required").html("<img src='"+News.validateErrorImgSrc+"'/>"+News.validateTip.title.length);
					jqTitle.focus(function(){
						$(this).parents("td").find(".required").html("*");
					});
					return false;
				}
			}
			
			//导读
			var jqBrief = $("#news-brief");
			var brief = jqBrief.val();
			if(brief == ""){
				jqBrief.parent().find(".required").html("<img src='"+News.validateErrorImgSrc+"'/>"+News.validateTip.brief.empty);
				jqBrief.focus(function(){
					$(this).parent().find(".required").html("*");
				});
				return false;
			} else {
				if(brief.length > 500){
					jqBrief.parent().find(".required").html("<img src='"+News.validateErrorImgSrc+"'/>"+News.validateTip.brief.length);
					jqBrief.focus(function(){
						$(this).parent().find(".required").html("*");
					});
					return false;
				}
			}
			
			//关键字
			var jqKeyword = $("#news-keyword");
			var keyword = jqKeyword.val();
			if(keyword == ""){
				jqKeyword.parent().find(".required").html("<img src='"+News.validateErrorImgSrc+"'/>"+News.validateTip.keyword.empty);
				jqKeyword.focus(function(){
					$(this).parent().find(".required").html("*");
				});
				return false;
			} else {
				if(keyword.length > 500){
					jqKeyword.parent().find(".required").html("<img src='"+News.validateErrorImgSrc+"'/>"+News.validateTip.keyword.length);
					jqKeyword.focus(function(){
						$(this).parent().find(".required").html("*");
					});
					return false;
				}
			}
			
			var newType = $("#news-type_ipt");
			if(newType.val()== "新闻类型"){
				TDT.alert("新闻类型不能选择根目录，要选择具体类型！")
				return false;
			}
			
			return true;
			
		},
		
		/**
		 * 验证新闻图片上传表单域
		 */
		validateUploadForm : function(){
			var jqUploadForm = $("#uploadForm");
			jqUploadForm.find(".required").html("");
			var fileValue = jqUploadForm[0].file.value;
			if(fileValue != ""){
				var reg = /^.*?\.(jpg|jpeg|png)$/i;
				var r = fileValue.match(reg);
				if(!r){
					jqUploadForm.find(".required").html("<img src='"+News.validateErrorImgSrc+"'/>"+News.validateTip.file.type);
					return false;
				}
			} else{
				jqUploadForm.find(".required").html("<img src='"+News.validateErrorImgSrc+"'/>"+News.validateTip.file.empty);
				return false;
			}
			return true;
			
		},
		
		bindNews : function(data){
			if(data.fileId){
				$("#file-id").val(data.fileId);
				this.viewFile(data.fileId);
			}
			//编辑页面数据绑定
			$("#news-title").val(data.title);
			$("#news-src").val(data.src);
			$("#news-brief").val(data.brief);
			$("#news-keyword").val(data.keyword);
			$("#news-author").val(data.author);
			$("#news-reviewers").val(data.reviewers);
			$("#news-sort").val(data.sort);
			if(News.editor){
				News.editor.setData(data.htmlTx);
			}
			
			if(News.selTree){
				News.selTree.addValue(data.newsCategory.chName, data.newsCategory.id);
			}
			
			//查看页面数据绑定
			$("#view-news-title").text(data.title);
			$("#view-news-time").html((data.createTime).replace("T","&nbsp;&nbsp;"));
			$("#view-news-src").text(data.src || "");
			$("#view-news-brief").text(data.brief);
			$("#view-news-html").html(data.htmlTx || "");
		},
		
		/*
		 * 绑定新闻数据列表
		 */
		bindNewsList : function(json, key){
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
		        var title = data.title.replace(/<.*?>/g,"");
				row = row.replace(/\%{title}%/g, TDT.strCut(title,10));
				row = row.replace(/\%{author}%/g, TDT.strCut(data.author,6) || "");
				row = row.replace(/\%{type}%/g, data.newsCategory.chName);
				row = row.replace(/\%{createTime}%/g, (data.createTime).replace("T","&nbsp;&nbsp;"));
				html.push(row);
			});
			list.html(html.join(""));
		},
		
		/**
		 * 上传文件
		 */
		uploadFile : function(form){
			var url = News.url["uploadFile"];
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
			var url = News.url["updateFile"];
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
			$("#uploadForm").find(".required").html("<img src='"+News.loadingImgSrc+"'/>");
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
							News.fn.viewFile(json.fileId);
						}else if(json.msg){
							$("#uploadForm").find(".required").html("<img src='"+News.validateErrorImgSrc+"'/>"+json.msg);
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
			var url = News.url["viewFile"];
			var params = "fileId="+id+"&t="+Date.parse(new Date());
			var action = TDT.getAppPath(url)+"?"+params;
			$("#pic-src").attr("src",action);
		}
	
	};
	
	News.fn.init.prototype = News.fn;
	
})();
