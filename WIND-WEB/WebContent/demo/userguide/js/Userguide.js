/**
 * 新闻模块对象
 * @author wangshoudong
 * @version 1.0 2012/7/26
 */
(function(){
var Userguide = window.Userguide = function(){
		return new Userguide.fn.init();
	};
	
	Userguide.url = {
		getAllByCategory : "userguide/findUserguideByCategoryId.do",
		search : "userguide/searchByKey.do",
		add : "userguide/addUserguide.do",
		update : "userguide/updateUserguide.do",
		view : "userguide/viewUserguide.do",
		del : "userguide/deleteUserguide.do",
		upToTop : "userguide/upToTop.do",
		up : "userguide/up.do",
		down : "userguide/down.do",
		downToBottom : "userguide/downToBottom.do",
		userguideType : "userguideCategory/getChild.do"
		
	};
	
	//编辑器
	Userguide.editor = undefined;
	
	//下拉列表选择树
	Userguide.selTree = undefined;
	
	Userguide.validateErrorImgSrc = "../images/error.gif";
	
	Userguide.categorychName = "userguide";
	
	//表单验证提示信息
	Userguide.validateTip = {
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
			length : "关键字长度不能超过100个字符"
		}
	};
	
	//初始当前页
	Userguide.pageNum = 1;
	
	//当前页记录条数
	Userguide.pageSize = 10;
	
	Userguide.fn = Userguide.prototype = {
	
		/**
		 * 初始化
		 */
		init:function(){
			return this;
		},
		
		/**
		 * 新增新闻
		 */
		addUserguide : function(){
			var fileId = $("#file-id").val();
			$("#userguide-file-id").val(fileId);
			var url = Userguide.url["add"];
			var isValidate = this.validateUserguideForm();
			if(isValidate){
				TDT.formSubmit("userguideAddForm",url, null, true, function(json){
					if(json.result){
		    			TDT.baseDialog("操作成功！", "确认并继续添加", "返回列表", function(){
		    				TDT.go('userguide-add.html');
		    			}, 
		    			function(){
		    				TDT.go('userguide.html');
		    			});
					}
				});
			}
		},
		
		/**
		 * 更新新闻
		 */
		updateUserguide : function(){
			var fileId = $("#file-id").val();
			$("#userguide-file-id").val(fileId);
			var url = Userguide.url["update"];
			var isValidate = this.validateUserguideForm();
			if(isValidate){
				TDT.formSubmit("userguideUpdateForm",url, null, true, function(json){
					if(json.result){
						TDT.go("userguide.html");
					}
				});
			}
		},
		
		/**
		 * 删除新闻
		 */
		deleteUserguide : function(ids){
			var url = Userguide.url["del"];
			var params = "ids="+ids;
			TDT.getDS(url,params,true,function(json){
				if(json.result){
					TDT.go("userguide.html");
				}
			});
		},
		
		/**
		 * 获取新闻明细
		 */
		findUserguideById : function(id){
			var url = Userguide.url["view"];
			var params = "userguide.id="+id;
			TDT.getDS(url,params,true,function(json){
				if(json.result){
					Userguide.fn.bindUserguide(json.userguide);
				}
			});
		},
		
		/**
		 * 获取新闻类型
		 */
		getUserguideType : function(){
			var url = TDT.getAppPath(Userguide.url["userguideType"])+"?type="+Userguide.categorychName;
			Userguide.selTree = new Select("userguide-type",{
				expand:true,
				hidden_name:"userguide.userguideCategory.id",
				onLazyRead : function(node){
					node.appendAjax({
			          debugLazyDelay: 0,
			          url : url,
			          data : {id : node.data.id}
			        });
				},
				children : [{title:"用户指南","isFolder": true, "isLazy": true, id:"root"}]
			});
			Userguide.selTree.addValue("用户指南", "root");
			var rootNode = $("#"+Userguide.selTree.tid).dynatree("getRoot");
			if(rootNode.childList.length > 0){
				rootNode.childList[0].toggleExpand();
			}
		},
		/**
		 * 分页获取新闻列表
		 */
		getAllByCategory : function(categoryId){
			var url = Userguide.url["getAllByCategory"];
			var params = "userguide.userguideCategory.id="+categoryId+"&pageNum="+Userguide.pageNum+"&pageSize="+Userguide.pageSize;
			TDT.getDS(url,params,true,function(json){
				if(json.result){
					Userguide.fn.bindUserguideList(json.userguideList,"userguide");
					var pagerObj = document.getElementById("pager");
					TDT.pager(Userguide.pageNum, Userguide.pageSize, json.page.recordCount, pagerObj, function(p){
						Userguide.pageNum = p;
						Userguide.fn.getAllByCategory(categoryId);
					});
				} else{
					$("#userguideList").html("");
					$("#pager").html("");
					$("#noData").show();
				}
			});
			
		},
		getTreeNode : function(){
			var url = TDT.getAppPath(Userguide.url["userguideType"])+"?type="+Userguide.categorychName;
			$("#tree-container").dynatree({
					onActivate: function(node) {
							Userguide.fn.getAllByCategory(node.data.id);
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
				children : [{title:"用户指南分类","isFolder": true, "isLazy": true, id:"root"}]
			});
			
			var rootNode = $("#tree-container").dynatree("getRoot");
			if(rootNode.childList.length > 0){
				rootNode.childList[0].toggleExpand();
			}
			this.getAllByCategory("root");
			
			
		},
		
		/**
		 * 关键字搜索新闻
		 */
		searchUserguide : function(keyword){
			var url = Userguide.url["search"];
			var params = "keyword="+encodeURIComponent(keyword)+"&pageNum="+Userguide.pageNum+"&pageSize="+Userguide.pageSize;
			TDT.getDS(url,params,true,function(json){
				if(json.result){
					Userguide.fn.bindUserguideList(json.userguideList,"userguide");
					var pagerObj = document.getElementById("pager");
					TDT.pager(Userguide.pageNum, Userguide.pageSize, json.page.recordCount, pagerObj, function(p){
						Userguide.pageNum = p;
						Userguide.fn.searchUserguide(keyword);
					});
				} else{
					$("#userguideList").html("");
					$("#pager").html("&nbsp;");
					$("#noData").show();
				}
			});
			
		},
		
		/**
		 * 验证新闻表单域
		 */
		validateUserguideForm : function(){
			//标题
			var jqTitle = $("#userguide-title");
			var title = jqTitle.val();
			if(title == ""){
				jqTitle.parents("td").find(".required").html("<img src='"+Userguide.validateErrorImgSrc+"'/>"+Userguide.validateTip.title.empty);
				jqTitle.focus(function(){
					$(this).parents("td").find(".required").html("*");
				});
				return false;
			} else {
				if(title.length > 50){
					jqTitle.parents("td").find(".required").html("<img src='"+Userguide.validateErrorImgSrc+"'/>"+Userguide.validateTip.title.length);
					jqTitle.focus(function(){
						$(this).parents("td").find(".required").html("*");
					});
					return false;
				}
			}
			
			var userGuide = $("#userguide-type_ipt");
			if(userGuide.val() == "用户指南"){
				TDT.alert("类别不能选择根目录，要选择具体类型！");
				return false;
			}
		  
			
			return true;
			
		},
 
		bindUserguide : function(data){
			
			//编辑页面数据绑定
			$("#userguide-title").val(data.title);
			$("#userguide-reviewers").val(data.reviewers);
			$("#userguide-sort").val(data.sort);
			if(Userguide.editor){
				Userguide.editor.setData(data.htmlTx);
			}
			
			if(Userguide.selTree){
				Userguide.selTree.addValue(data.userguideCategory.chName, data.userguideCategory.id);
			}
			
			//查看页面数据绑定
			$("#view-userguide-title").text(data.title);
			//$("#view-userguide-time").html((data.createTime).replace("T","&nbsp;&nbsp;"));
			$("#view-userguide-type").text(data.userguideCategory.chName);
			//$("#view-userguide-brief").text(data.brief);
			$("#view-userguide-html").html(data.htmlTx || "");
		},
		
		/*
		 * 绑定新闻数据列表
		 */
		bindUserguideList : function(json, key){
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
				row = row.replace(/\%{title}%/g, TDT.strCut(data.title,15));
				//row = row.replace(/\%{author}%/g, data.author);
				row = row.replace(/\%{type}%/g, data.userguideCategory.chName);
				row = row.replace(/\%{createTime}%/g, (data.createTime).replace("T","&nbsp;&nbsp;"));
				html.push(row);
			});
			list.html(html.join(""));
		},
		/**
		 * 上移至顶部
		 */
		upToTop : function(id){
			var url = Userguide.url["upToTop"];
			var params = "userguide.id="+id;
			TDT.getDS(url,params,true,function(json){
				if(json.result){
					TDT.go("userguide.html");
				}
			});
		},
		
		/**
		 * 上移
		 */
		up : function(id){
			var url = Userguide.url["up"];
			var params = "userguide.id="+id;
			TDT.getDS(url,params,true,function(json){
				if(json.result){
					TDT.go("userguide.html");
				}
			});
		},
		
		/**
		 * 下移
		 */
		down : function(id){
			var url = Userguide.url["down"];
			var params = "userguide.id="+id;
			TDT.getDS(url,params,true,function(json){
				if(json.result){
					TDT.go("userguide.html");
				}
			});
		},
		
		/**
		 * 下移至底部
		 */
		downToBottom : function(id){
			var url = Userguide.url["downToBottom"];
			var params = "userguide.id="+id;
			TDT.getDS(url,params,true,function(json){
				if(json.result){
					TDT.go("userguide.html");
				}
			});
		}
		
	
	};
	
	Userguide.fn.init.prototype = Userguide.fn;
	
})();
