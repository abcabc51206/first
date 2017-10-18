/**
 * 行政区化模块对象
 * @author 朱泽江
 * @version 1.0 2012/8/1
 */
 (function(){
 	var Sar = window.Sar = function(){
 		return new Sar.fn.init();
 	};
 	
 	Sar.url = {
 		getAll:"sar/findAllByPage.do",
 		add:"sar/addSar.do",
 		del:"sar/deleteSar.do",
 		findById:"sar/findById.do",
 		expExcel:"sar/expExcel.do",
 		impExcel:"sar/impExcel.do",
 		update: "sar/updateSar.do",
 		upToTop : "sar/upToTop.do",
		up : "sar/up.do",
		down : "sar/down.do",
		downToBottom : "sar/downToBottom.do",
 		searchByKey:"sar/searchByKey.do",
 		parentArea:"sar/getParentNode.do"
 	};
 	
 	
 	Sar.pageNum = 1;
 	Sar.pageSize = 10;
 	Sar.selTree = undefined;
 	Sar.parentNum= 0;
 	Sar.validateErrorImgSrc = "../images/error.gif";
	Sar.uploadSuccessImgSrc = "../images/success.gif";
	Sar.loadingImgSrc = "../images/loading.gif";
	
	//表单验证提示信息
	Sar.validateTip = {
		
		code : {
			empty : "区域编码不能为空，请输入",
			length : "标题长度不能超过50个字符"
		},
		abbr : {
			empty : "名称简称不能为空，请输入",
			length : "标题长度不能超过50个字符"
		},
		parentArea : {
			empty : "上级行政区不能为空，请输入",
			length : "标题长度不能超过50个字符"
		},
		
		areaName : {
			empty : "区域名称不能为空，请输入",
			length : "链接地址长度不能超过100个字符"
		}
	};
 	
 	Sar.fn = Sar.prototype = {
 		init:function(){
 			return this;
 		},
 		addSar:function(){
 			var url = Sar.url["add"];
			var isValidate = this.validateSarForm("add");
			if(isValidate){
				TDT.formSubmit("sarAddForm",url, null, true, function(json){
					if(json.result){
		    			TDT.baseDialog("操作成功！", "确认并继续添加", "返回列表", function(){
		    				TDT.go('sar-add.html');
		    			},
		    			function(){
		    				TDT.go('sar.html');
		    			});
					}
				});
			}
 		},
 		updateSar:function(){
 			var url = Sar.url["update"];
 			var isValidate = this.validateSarForm("edit");
			if(isValidate){
				TDT.formSubmit("sarUpdateForm",url, null, true, function(json){
					if(json.result){
		    			TDT.go('sar.html');
					}
				});
			}
 		},
 		findAllByPage:function(keyWords){
			var url = Sar.url["getAll"];
			var params = "keyWords="+keyWords+"&pageNum="+Sar.pageNum+"&pageSize="+Sar.pageSize;
			TDT.getDS(url,params,true,function(json){
				if(json.result){
					if(json.sarList.length>0){
						Sar.fn.bindSarList(json.sarList,"sar");
						var pagerObj = document.getElementById("pager");
						TDT.pager(Sar.pageNum, Sar.pageSize, json.page.recordCount, pagerObj, function(p){
							Sar.pageNum = p;
							Sar.fn.findAllByPage(keyWords);
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
 			var url = Sar.url["findById"];
			var params = "sid="+id;
			TDT.getDS(url,params,true,function(json){
				if(json.result){
					Sar.fn.bindSarView(json.sar,type);
				}
			});
 		},
 		
 		findByIdBySyn : function(id){
 			var url = Sar.url["findById"];
			var params = "sid="+id;
			var s;
			TDT.getDS(url,params,false,function(json){
				if(json.result){
					s = json.sar;
				}
			});
			return s;
 		},
 		
 		searchByKey:function(keyWords){
 			var url = Sar.url["searchByKey"];
			var params = "keyWords="+keyWords+"&pageNum="+Sar.pageNum+"&pageSize="+Sar.pageSize;
			TDT.getDS(url,params,true,function(json){
				if(json.result){
					if(json.sarList.length>0){
						Sar.fn.bindSarList(json.sarList,"sar");
						var pagerObj = document.getElementById("pager");
						TDT.pager(Sar.pageNum, Sar.pageSize, json.page.recordCount, pagerObj, function(p){
							Sar.pageNum = p;
							Sar.fn.searchByKey(keyWords);
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
 		deleteSar:function(ids){
 			var url = Sar.url["del"];
			var params = "ids="+ids;
			TDT.getDS(url,params,true,function(json){
				if(json.result){
					TDT.go('sar.html');	
				}
			});
 		},
 		/**
		 * 获取上级行政区
		 */
		getParentNode : function(){
			var _that = this;
			var url = TDT.getAppPath(Sar.url["parentArea"]);
			Sar.selTree = new Select("sar-prev",{
				expand:true,
				hidden_name:"sar.mapAdministrationDistrict.id",
			 	onActivate:function(node){
			 		Sar.parentNum = 0;
			 		if(node.data.parentId == "root"){
			 			Sar.parentNum ++;
			 		}else {
			 			Sar.parentNum ++;
			 			_that.calcParentNum(node.parent);
			 		}
			 		$("#sar-level").val(Sar.parentNum);
			    },
				onLazyRead : function(node){
					node.appendAjax({
			          debugLazyDelay: 0,
			          url : url,
			          data : {id : node.data.id}
			        });
				},
				children : [{title:"行政区划","isFolder": true, "isLazy": true, id:"root"}]
			});
			Sar.selTree.addValue("行政区划", "root");
			var rootNode = $("#"+Sar.selTree.tid).dynatree("getRoot")
			if(rootNode.childList.length > 0){
				rootNode.childList[0].toggleExpand();
			}
		},
		calcParentNum:function(node){
			if(node.data.parentId=="root"){
				Sar.parentNum ++;
			}else {
				Sar.parentNum ++;
				this.calcParentNum(node.parent);
			}
		},
 		/**
		 * 获取上级行政区
		 */
		getTreeNode : function(){
			var url = TDT.getAppPath(Sar.url["parentArea"]);
			$("#tree-container").dynatree({
					onActivate: function(node) {
						Sar.fn.findAllByPage(node.data.id);
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
							    Sar.fn.bindContextMenu();
				            }
				    	});
					},
				children : [{title:"行政区划","isFolder": true, "isLazy": true, id:"root"}]
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
			      switch(action) {
				      case "add":
						TDT.go('sar-add.html?id='+node.data.id+"&title="+node.data.title);		      	
				      	break;
				      case "edit":
				      	if(node.data.id == "root"){
				      		TDT.alert("根目录不允许编辑！");
				      		break;
				      	}
				      	
				      	TDT.go('sar-edit.html?id='+node.data.id);
				      	break;
				      case "delete":
				      	if(node.data.id == "root"){
				      		TDT.alert("根目录不允许删除！");
				      		break;
				      	}
				      	TDT.confirm("删除此数据的同时会删除其下级分类，您确认删除吗？",function(){
					   		Sar.fn.deleteSar(node.data.id);
				   		});
				        break;
				      default:
				        alert("Todo: appply action '" + action + "' to node " + node);
			      }
		    });
		} ,
 		validateSarForm:function (type){
 			var areaName = $("#sar-name");
 			if(areaName.val() ==""){
				areaName.parents("td").find(".required").html("<img src='"+Sar.validateErrorImgSrc+"'/>"+Sar.validateTip.areaName.empty);
				areaName.focus(function(){
					$(this).parents("td").find(".required").html("*");
				});
				return false;
			}
			
 			if(type == "add"){
	 			var code = $("#sar-code");
	 			var abbr = $("#sar-short");
	 			if(code.val() ==""){
					code.parents("td").find(".required").html("<img src='"+Sar.validateErrorImgSrc+"'/>"+Sar.validateTip.code.empty);
					code.focus(function(){
						$(this).parents("td").find(".required").html("*");
					});
					return false;
				}
	 			if(abbr.val() ==""){
					abbr.parents("td").find(".required").html("<img src='"+Sar.validateErrorImgSrc+"'/>"+Sar.validateTip.abbr.empty);
					abbr.focus(function(){
						$(this).parents("td").find(".required").html("*");
					});
					return false;
				}
 			}
 			return true;
 		},
 		bindSarView:function (data,type){
 			if(type == "view"){
 				$("#areaName").html(data.areaName);
 				$("#parentAreaName").html(data.mapAdministrationDistrict.areaName);
 				$("#level").html(data.level);
 				$("#zoom").html(data.zoom);
 				$("#brief").html(data.brief);
 				$("#code").html(data.code);
 				$("#abbr").html(data.abbr);
 				$("#lat").html(data.lat);
 				$("#lon").html(data.lon);
 			}else {
 				$("#sar-name").val(data.areaName);
 				$("#sar-lon").val(data.lon);
 				$("#sar-lat").val(data.lat);
 				$("#sar-abbr").val(data.abbr);
 				$("#sar-code").val(data.code);
 				$("#sar-level").val(data.level);
 				$("#sar-zoom").val(data.zoom);
 				$("#sar-brief").val(data.brief);
 				$("#sar-id").val(data.id);
 				$("#sar-sort").val(data.sort);
 				
	 			if(Sar.selTree){
					Sar.selTree.addValue(data.mapAdministrationDistrict.areaName, data.mapAdministrationDistrict.id);
				}
 				
 			}
		},
		setTreenode:function(nodeName,nodeId){
			if(Sar.selTree){
					Sar.selTree.addValue(nodeName, nodeId);
				}
		},
		
		//查询后通过json返回的数据,显示 到页面中
 		bindSarList:function(json,key){
 			var list = $("#"+key+"List");
 			var html= [];
 			list.html("");
 			
 			var template = $("#"+key+"Template");
 			var temp = template.html();
 			
 			$.each(json,function(i,data){
 				var row =temp;
 				row = row.replace(/\%{rowid}%/g, data.id);
 				row = row.replace(/\%{areaName}%/g, data.areaName);
 				row = row.replace(/\%{parentArea}%/g, data.mapAdministrationDistrict.areaName);
 				row = row.replace(/\%{level}%/g, data.level);
 				row = row.replace(/\%{zoom}%/g, data.zoom);
 				row = row.replace(/\%{brief}%/g, data.brief ||"");
 				html.push(row);
 			});
 			list.html(html.join(""));
 			this.calTreeHeight();
 		},
 		expExcel:function(){
 			var url = Sar.url["expExcel"];
 			window.location.href = TDT.getAppPath(url);
 		},
 		/**
		 * 上传文件
		 */
		uploadFile : function(form){
			var url = Sar.url["impExcel"];
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
			$("#"+form).find(".required").html("<img src='"+Sar.loadingImgSrc+"'/>");
			$(document).ready(function(){
				var options = {
					url : TDT.getAppPath(url),
					type : "POST",
					dataType : "html",
					//async:true,
					success : function(data){
						var json = eval("(" + data + ")");
						if(json.result){
							$("#"+form).find(".required").html("<img src='"+Sar.uploadSuccessImgSrc+"'/>上传成功");
							setTimeout(function () {
								location = location;
							}, 1000); 
						}else if(json.msg){
							$("#"+form).find(".required").html("<img src='"+Sar.validateErrorImgSrc+"'/>"+json.msg);
						}
					}
				};
				$("#"+form).ajaxSubmit(options);
				return false;
			});
		},
 		/**
		 * 验证示范应用文件上传表单域
		 */
		validateUploadForm : function(form){
			var jqUploadForm = $("#"+form);
			jqUploadForm.find(".required").html("");
			var fileValue = $("#addImpExcelForm input[type='file']").val();
			if(fileValue != ""){
				var reg = /^.*?\.(xls)$/i;
				var r = fileValue.match(reg);
				if(!r){
					jqUploadForm.find(".required").html("<img src='"+Sar.validateErrorImgSrc+"'/>格式不正确,请上传格式为xls");
					setTimeout(function () {
						jqUploadForm.find(".required").html("");
					}, 1000); 
					return false;
				}
			} else{
				jqUploadForm.find(".required").html("<img src='"+Sar.validateErrorImgSrc+"'/>请选择上传文件");
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
			var url = Sar.url["upToTop"];
			var params = "sar.id="+id;
			TDT.getDS(url,params,true,function(json){
				if(json.result){
					TDT.go("sar.html");
				}
			});
		},
		
		/**
		 * 上移
		 */
		up : function(id){
			var url = Sar.url["up"];
			var params = "sar.id="+id;
			TDT.getDS(url,params,true,function(json){
				if(json.result){
					TDT.go("sar.html");
				}
			});
		},
		
		/**
		 * 下移
		 */
		down : function(id){
			var url = Sar.url["down"];
			var params = "sar.id="+id;
			TDT.getDS(url,params,true,function(json){
				if(json.result){
					TDT.go("sar.html");
				}
			});
		},
		
		/**
		 * 下移至底部
		 */
		downToBottom : function(id){
			var url = Sar.url["downToBottom"];
			var params = "sar.id="+id;
			TDT.getDS(url,params,true,function(json){
				if(json.result){
					TDT.go("sar.html");
				}
			});
		},
 		calTreeHeight:function(){
			$(".sar-panel").height($(".sar-box-table").height()-18);
			//$(".tree-container").height($(".sar-panel").height()-$(".tree-title").height());
 		}
 	};
 	
 	Sar.fn.init.prototype = Sar.fn;
 	
 })();