/**
 * 方案配置模块对象
 * @author wsd
 * @version 1.0 2012/9/10
 */
 
 (function(){
var Scenario = window.Scenario = function(){
		return new Scenario.fn.init();
	};
	
	Scenario.url = {
		getAll : "userScenario/findAllByType.do",
		findScenarioById : "userScenario/findScenarioById.do",
		searchByKey : "userScenario/searchByKey.do",
		setDefault : "userScenario/setDefaultScenario.do",
		saveScenario : "userScenario/saveScenario.do",
		deleteUrl : "userScenario/deleteScenario.do",
		updateUrl : "userScenario/updateScenario.do",
		uploadFile : "userScenario/uploadFile.do",
		updateFile : "userScenario/updateFile.do",
		viewFile : "userScenario/viewFile.do"
	};

	
	//初始当前页
	Scenario.pageNum = 1;
	
	//当前页记录条数
	Scenario.pageSize = 10;
	
	Scenario.loadingImgSrc = "../images/loading.gif";
	
	Scenario.validateErrorImgSrc="../images/error.gif";
	
	//表单验证提示信息
	Scenario.validateTip = {
		file : {
			empty : "请选择上传文件",
			type : "图片格式为jpg|jpeg|png，请重新选择"
		}
	};
	
	Scenario.fn = Scenario.prototype = {
	
		/**
		 * 初始化
		 */
		init:function(){
			return this;
		},
		

		/**
		 * 设置为默认方案
		 * @param currSelSceType 页面选择框方案类型
		 * @param type 当前设置为默认方案的方案类型， Vector(矢量),Image(影像), Globe(三维)
		 * @param scenarioId 方案ID
		 */
		setDefaultScenario : function(currSelSceType, type, scenarioId){
			var url = Scenario.url["setDefault"];
			var params = "userScenario.usScenarioType="+type+"&userScenario.id="+scenarioId;
			TDT.getDS(url,params,false, function(json){
				if(json.result){
					Scenario.fn.findAllByType(currSelSceType);
				}
			});
		},
		
		findScenarioById : function(scenarioId){
			var url = Scenario.url["findScenarioById"];
			var params = "userScenario.id="+scenarioId;
			TDT.getDS(url,params,true,function(json){
					if(json.UserScenarios.UserScenario.length > 0){
						var data = json.UserScenarios.UserScenario[0];
						$("#edit-Input").val(data.ScenarioName);
						$("#edit-Type").attr("value",data.ScenarioType);
						$("#edit-usScRemark").val(data.ScenarioRemark);
						if(data.FileId) {
							scenario.viewFile(data.FileId,"edit");
							$("#edit-file-id").val(data.FileId);
							$("#edit-usScDef").val(data.IsDefault);
						}
					}
			});
		},
		
		/**
		 * 删除方案
		 * param scenarioId 方案ID
		 * **/
		deleteScenario: function(scenarioId,currSelSceType){
			TDT.confirm("确认要删除此方案吗？",function(){
				var url = Scenario.url["deleteUrl"];
				var params = "userScenario.id="+scenarioId;
				TDT.getDS(url,params,true,function(json){
					if(json.result){
						Scenario.fn.findAllByType(currSelSceType);
					}
				}); 
			});
			
		},
		/**
		 * 方案编辑
		 *  param scenarioId 方案ID
		 * **/
		editScenario: function(obj){
			  //编辑
			var scenarioId = $("#scenario-id").val();
	     	var usName = $("#editDiv input:first").val();
	     	if(usName==''){
				TDT.alert("请填写方案名称!");
				return false;
			}
			var usScenarioType = $("#editDiv select:first").val();
			if(usScenarioType == ''){
				TDT.alert("请选择方案类型!");
				return false;
			}
	     	var fileId = $("#editDiv input:first").next().val();
			var usScRemark = $("#editDiv textarea:first").val();
			var def = $("#editDiv textarea:first").next().val();
			var url = Scenario.url["updateUrl"];
			var params = "userScenario.id="+scenarioId+"&userScenario.usName="+usName
			+"&userScenario.usScenarioType="+usScenarioType+"&userScenario.usScRemark="+usScRemark
			+"&userScenario.fileId="+fileId+"&userScenario.usScDefault="+def;
			TDT.getDS(url,params,true,function(json){
				if(json.result){
					//TDT.alert ("操作成功！");
					TDT.go('../page/scenario.html');
				}
			}); 
			return false;
	    
		},
        
		/**
		 * 分页获取方案列表
		 * @param type 方案类型 Vector(矢量),Image(影像), Globe(三维)
		 */
		findAllByType : function(type){
			var url = Scenario.url["getAll"];
			var params = "userScenario.usScenarioType="+type+"&pageNum="+Scenario.pageNum+"&pageSize="+Scenario.pageSize;
			TDT.getDS(url,params,true,function(json){
				if(json.result){
					if(json.userScenList.length>0 ){
						Scenario.fn.bindScenarioList(json.userScenList,"scenario");
						var pagerObj = document.getElementById("pager");
						TDT.pager(Scenario.pageNum, Scenario.pageSize, json.page.recordCount, pagerObj, function(p){
							Scenario.pageNum = p;
							Scenario.fn.findAllByType(type);
						});
						$("#nomessage").hide();	
					}
				} else {
					$("#scenarioList").html("");
					$("#nomessage").show();	
					$("#pager").html("");
				}
			});
			
		},
		
		/**
		 * 搜索方案
		 * @param keyword 关键字（方案名称）
		 * @param type 方案类型
		 */
		searchByKeyAndType : function(keyword, type){
			var url = Scenario.url["searchByKey"];
			var params = "keyword="+keyword+"&userScenario.usScenarioType="+type+"&pageNum="+Scenario.pageNum+"&pageSize="+Scenario.pageSize;
			TDT.getDS(url,params,true,function(json){
				if(json.result){
					if(json.userScenList.length>0 ){
						Scenario.fn.bindScenarioList(json.userScenList,"scenario");
						var pagerObj = document.getElementById("pager");
						TDT.pager(Scenario.pageNum, Scenario.pageSize, json.page.recordCount, pagerObj, function(p){
							Scenario.pageNum = p;
							Scenario.fn.searchByKeyAndType(keyword, type);
						});
						$("#nomessage").hide();	
					}
				} else {
					$("#scenarioList").html("");
					$("#nomessage").show();		
					$("#pager").html("");
				}
			});
			
		},
		
		getTypeName : function(type){
			if(type == "Vector"){
				return "矢量";
			} else if(type == "Image"){
				return "影像";
			} else if(type == "DEM"){
			    return "地形";
			}else if(type == "Globe"){
				return "三维";
			}
		},

		/*
		 * 绑定 通用配置数据列表
		 */
		bindScenarioList : function(json, key){
			var list = $("#"+key+"List");
			var html = [];
			list.html("");
			var template = $("#"+key+"Template");
			var temp = template.html();
			
			$.each(json,function(i,data){
		        var row = temp;
		        row = row.replace(/\%{rowid}%/g, data.id);
				row = row.replace(/\%{name}%/g, data.usName || "");
				row = row.replace(/\%{typeEnName}%/g, data.usScenarioType || "");
				row = row.replace(/\%{type}%/g, Scenario.fn.getTypeName(data.usScenarioType) || "");
				row = row.replace(/\%{createTime}%/g, (data.createTime).replace("T","&nbsp;&nbsp;"));
				row = row.replace(/\%{desc}%/g, TDT.strCut(data.usScRemark,20));
				if(data.usScDefault == "0"){
					row = row.replace(/\%{disabled}%/g, "");
				} else if (data.usScDefault == "1"){
					row = row.replace(/\%{disabled}%/g, "disabled='disabled'");
				}
				if(data.usScIsSpecialTopic == "0"||data.usScIsSpecialTopic==null){
				    row = row.replace(/\%{STset}%/g, "");
				    row = row.replace(/\%{STsetcancle}%/g, "style=\"display:none;\"");
				}else if (data.usScIsSpecialTopic == "1"){
					row = row.replace(/\%{STset}%/g, "style=\"display:none;\"");
				    row = row.replace(/\%{STsetcancle}%/g, "");
				}
				html.push(row);
			});
			list.html(html.join(""));
			$("a[disabled]").addClass("disable");//添加新的class 注意这里不会覆盖标签原有的class
		},
		//保存
		saveUserScenario:function(){
			var usName = $("#addDiv input:first").val();
			var usScenarioType = $("#addDiv select:first").val();
			if(usName==''){
				TDT.alert("请填写方案名称!");
				return false;
			}
			if(usScenarioType == ''){
				TDT.alert("请选择方案类型!");
				return false;
			}
			var fileId = $("#addDiv input:first").next().val();
			var url = Scenario.url["saveScenario"];
			var usScRemark = $("#addDiv textarea:first").val();
			
			var params = "userScenario.usName="+usName+"&userScenario.usScenarioType="+usScenarioType
			+"&userScenario.usScRemark="+usScRemark+"&userScenario.fileId="+fileId;
			var flag = false;
			TDT.getDS(url,params,false,function(json){
				if(json.result){
					TDT.baseDialog("操作成功！", "确认并继续添加", "返回列表", function(){
	    				TDT.go('scenario-add.html');
	    			},
	    			function(){
	    				TDT.go('scenario.html');
	    			});
				}
			}); 
		},
		/**
		 * 上传文件
		 */
		uploadFile : function(form,type){
			var url = Scenario.url["uploadFile"];
			var isValidate = this.validateUploadForm(type);
			if(isValidate){
				this.buildFileUploadFields(form,type);
				this.upload(form, url,type);
			}
		},
		
		/**
		 * 构建文件上传域
		 */
		buildFileUploadFields : function(form,type){
			var fileValue = $("#"+form)[0].file.value;
			var fileFullName = fileValue.substr(fileValue.lastIndexOf("\\")+1);
			if(type){
				$("#edit-file-name").val(fileFullName.substr(0,fileFullName.lastIndexOf("\.")));
				$("#edit-file-type").val(fileFullName.substr(fileFullName.lastIndexOf("\.")+1));
			}else {
				$("#file-name").val(fileFullName.substr(0,fileFullName.lastIndexOf("\.")));
				$("#file-type").val(fileFullName.substr(fileFullName.lastIndexOf("\.")+1));
			}
		},
		
		/**
		 * 更新文件
		 */
		updateFile : function(form){
			var url = Scenario.url["updateFile"];
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
		upload : function(form, url,type){
			if(type){
				$("#edit-uploadForm").find(".required").html("<img src='"+Scenario.loadingImgSrc+"'/>");
				this.buildFileUploadFields(form);
				$(document).ready(function(){
					var options = {
						url : TDT.getAppPath(url),
						type : "POST",
						dataType : "html",
						success : function(data){
							var json = eval("(" + data + ")");
							if(json.fileId){
								$("#edit-uploadForm").find(".required").html("");
								$("#edit-file-id").val(json.fileId);
								Scenario.fn.viewFile(json.fileId,type);
							}else if(json.msg){
								$("#edit-uploadForm").find(".required").html("<img src='"+Scenario.validateErrorImgSrc+"'/>"+json.msg);
							}
						}
					};
					$("#"+form).ajaxSubmit(options);
					return false;
				});
			}else{
				$("#uploadForm").find(".required").html("<img src='"+Scenario.loadingImgSrc+"'/>");
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
								Scenario.fn.viewFile(json.fileId);
							}else if(json.msg){
								$("#uploadForm").find(".required").html("<img src='"+Scenario.validateErrorImgSrc+"'/>"+json.msg);
							}
						}
					};
					$("#"+form).ajaxSubmit(options);
					return false;
				});
			}
		},
		/**
		 * 显示文件
		 */
		viewFile : function(id,type){
			var url = Scenario.url["viewFile"];
			var params = "fileId="+id+"&t="+Date.parse(new Date());
			var action = TDT.getAppPath(url)+"?"+params;
			if(type){
				$("#edit-pic-src").attr("src",action);
			}else{
				$("#pic-src").attr("src",action);
			}
		},
		/**
		 * 验证新闻图片上传表单域
		 */
		validateUploadForm : function(type){
			var jqUploadForm = $("#uploadForm");
			if(type){
				jqUploadForm = $("#edit-uploadForm");
			}
			jqUploadForm.find(".required").html("");
			var fileValue = jqUploadForm[0].file.value;
			if(fileValue != ""){
				var reg = /^.*?\.(jpg|jpeg|png)$/i;
				var r = fileValue.match(reg);
				if(!r){
					jqUploadForm.find(".required").html("<img src='"+Scenario.validateErrorImgSrc+"'/>"+Scenario.validateTip.file.type);
					return false;
				}
			} else{
				jqUploadForm.find(".required").html("<img src='"+Scenario.validateErrorImgSrc+"'/>"+Scenario.validateTip.file.empty);
				return false;
			}
			return true;
			
		}
		
	};
	Scenario.fn.init.prototype = Scenario.fn;
 })();