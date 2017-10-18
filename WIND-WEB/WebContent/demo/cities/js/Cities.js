/**
 * 市区互联模块对象
 * @author wangshoudong
 * @version 1.0 2012/7/26
 */
(function(){
var Cities = window.Cities = function(){
		return new Cities.fn.init();
	};
	
	Cities.url = {
		getDigCity:"cities/findAllCityNames.do",
		getAll : "cities/findAllByPage.do",
		search : "cities/searchByKey.do",
		add : "cities/addCities.do",
		update : "cities/updateCities.do",
		view : "cities/viewCities.do",
		del : "cities/deleteCities.do",
		upToTop : "cities/upToTop.do",
		up : "cities/up.do",
		down : "cities/down.do",
		downToBottom : "cities/downToBottom.do",
		uploadFile : "cities/uploadFile.do",
		updateFile : "cities/updateFile.do",
		viewFile : "cities/viewFile.do",
		findLocalDistrict:"cities/findLocalDistrict.do",
		checkArea:"cities/checkArea.do"
	};
	
	Cities.loadingImgSrc = "../images/loading.gif";
	
	Cities.validateErrorImgSrc = "../images/error.gif";
	
	//表单验证提示信息
	Cities.validateTip = {
		file : {
			empty : "请选择上传文件",
			type : "图片格式为jpg|jpeg|png，请重新选择"
		},
		
		title : {
			empty : "标题不能为空，请输入",
			length : "标题长度不能超过50个字符",
			duplicate : "地区名称已经存在"
		},
		
		url : {
			empty : "链接地址不能为空，请输入",
			length : "链接地址长度不能超过100个字符"
		},
		
		districtManageAdds : {
			empty : "管理地址不能为空，请输入",
			length : "管理地址长度不能超过100个字符"
		}
	};
	
	//初始当前页
	Cities.pageNum = 1;
	
	//当前页记录条数
	Cities.pageSize = 10;
	
	Cities.fn = Cities.prototype = {
	
		/**
		 * 初始化
		 */
		init:function(){
			return this;
		},
		
		/**
		 * 新增市区互联
		 */
		addCities : function(){
			var fileId = $("#file-id").val();
			$("#cities-file-id").val(fileId);
			$("#addC").die();
			var url = Cities.url["add"];
			var isValidate = this.validateCitiesForm("add");
			if(isValidate){
				TDT.formSubmit("citiesAddForm",url, null, true, function(json){					
					if(json.result){
		    			TDT.baseDialog("操作成功！", "确认并继续添加", "返回列表", function(){
		    				$("#addC").live();
		    				TDT.go('cities-add.html');
		    			}, 
		    			function(){
		    				$("#addC").live();
		    				TDT.go('cities.html');
		    			});
					}
				});
			}else{
				$("#addC").live();
			}
		},
		/**
		 * 更新市区互联
		 */
		updateCities : function(){
			var fileId = $("#file-id").val();
			$("#cities-file-id").val(fileId);
			var url = Cities.url["update"];
			var isValidate = this.validateCitiesForm("update");
			if(isValidate){
				TDT.formSubmit("citiesUpdateForm",url, null, true, function(json){
					if(json.result){
						TDT.go("cities.html");
					}
				});
			}
		},
		
		/**
		 * 删除市区互联
		 */
		deleteCities : function(ids){
			var url = Cities.url["del"];
			var params = "ids="+ids;
			TDT.getDS(url,params,true,function(json){
				if(json.result){
					TDT.go("cities.html");
				}
			});
		},
		
		/**
		 * 获取市区互联明细
		 */
		findCitiesById : function(id,type){
			var url = Cities.url["view"];
			var params = "cities.id="+id;
			TDT.getDS(url,params,true,function(json){
				if(json.result){
					Cities.fn.bindCities(json.cities,type);
				}
			});
		},
		
		
		/**
		 * 上移至顶部
		 */
		upToTop : function(id){
			var url = Cities.url["upToTop"];
			var params = "cities.id="+id;
			TDT.getDS(url,params,true,function(json){
				if(json.result){
					TDT.go("cities.html");
				}
			});
		},
		
		/**
		 * 上移
		 */
		up : function(id){
			var url = Cities.url["up"];
			var params = "cities.id="+id;
			TDT.getDS(url,params,true,function(json){
				if(json.result){
					TDT.go("cities.html");
				}
			});
		},
		
		/**
		 * 下移
		 */
		down : function(id){
			var url = Cities.url["down"];
			var params = "cities.id="+id;
			TDT.getDS(url,params,true,function(json){
				if(json.result){
					TDT.go("cities.html");
				}
			});
		},
		
		/**
		 * 下移至底部
		 */
		downToBottom : function(id){
			var url = Cities.url["downToBottom"];
			var params = "cities.id="+id;
			TDT.getDS(url,params,true,function(json){
				if(json.result){
					TDT.go("cities.html");
				}
			});
		},
		
		/**
		 * 分页获取市区互联列表
		 */
		findAllByPage : function(){
			var url = Cities.url["getAll"];
			var params = "pageNum="+Cities.pageNum+"&pageSize="+Cities.pageSize;
			TDT.getDS(url,params,true,function(json){
				if(json.result){
					Cities.fn.bindCitiesList(json.citiesList,"cities");
					var pagerObj = document.getElementById("pager");
					TDT.pager(Cities.pageNum, Cities.pageSize, json.page.recordCount, pagerObj, function(p){
						Cities.pageNum = p;
						Cities.fn.findAllByPage();
					});
				} else{
					$("#citiesList").html("");
					$("#pager").html("&nbsp;");
					$("#noData").show();
				}
			});
			
		},
		
		/**
		 * 关键字搜索市区互联
		 */
		searchCities : function(key){
			var url = Cities.url["search"];
			var params = "key="+encodeURIComponent(key)+"&pageNum="+Cities.pageNum+"&pageSize="+Cities.pageSize;
			TDT.getDS(url,params,true,function(json){
				if(json.result){
					Cities.fn.bindCitiesList(json.citiesList,"cities");
					var pagerObj = document.getElementById("pager");
					TDT.pager(Cities.pageNum, Cities.pageSize, json.page.recordCount, pagerObj, function(p){
						Cities.pageNum = p;
						Cities.fn.searchCities(key);
					});
				} else{
					$("#citiesList").html("");
					$("#pager").html("&nbsp;");
					$("#noData").show();
				}
			});
			
		},
		
		/**
		 * 验证市区互联表单域
		 */
		validateCitiesForm : function(type){
			//标题
			var jqTitle = $("#cities-title");
			var jqCode = $("#cities-code");
			
			var title = jqTitle.val();
			if(title == ""){
				jqCode.parents("td").find(".required").html("<img src='"+Cities.validateErrorImgSrc+"'/>"+Cities.validateTip.title.empty);
				jqCode.click(function(){
					$(this).parents("td").find(".required").html("");
				});
				return false;
			} else {
				if(title.length > 50){
					jqTitle.parents("td").find(".required").html("<img src='"+Cities.validateErrorImgSrc+"'/>"+Cities.validateTip.title.length);
					jqTitle.focus(function(){
						$(this).parents("td").find(".required").html("");
					});
					return false;
				}
			}
			
			//链接地址
			var jqUrl = $("#cities-url");
			var url = jqUrl.val();
			if(url == "" || url == "http://"){
				jqUrl.parents("td").find(".required").html("<img src='"+Cities.validateErrorImgSrc+"'/>"+Cities.validateTip.url.empty);
				jqUrl.focus(function(){
					$(this).parents("td").find(".required").html("");
				});
				return false;
			} else {
				if(url.length > 100){
					jqUrl.parents("td").find(".required").html("<img src='"+Cities.validateErrorImgSrc+"'/>"+Cities.validateTip.url.length);
					jqUrl.focus(function(){
						$(this).parents("td").find(".required").html("");
					});
					return false;
				}
			}
			if(type == "add"){
				var isExsit = false;
				var url = Cities.url["checkArea"];
				var params = "cities.code="+jqCode.val();
				TDT.getDS(url,params,false,function(json){		
					isExsit = json.result;
				});
				if(isExsit == true){
					jqCode.parents("td").find(".required").html("<img src='"+Cities.validateErrorImgSrc+"'/>"+Cities.validateTip.title.duplicate);
					jqCode.click(function(){
						$(this).parents("td").find(".required").html("");
					});
					return false;
				}
			}
			
			return true;
			
		},
		
		/**
		 * 验证市区互联文件上传表单域
		 */
		validateUploadForm : function(){
			var jqUploadForm = $("#uploadForm");
			jqUploadForm.find(".required").html("");
			var fileValue = jqUploadForm[0].file.value;
			if(fileValue != ""){
				var reg = /^.*?\.(jpg|jpeg|png)$/gi;
				var r = fileValue.match(reg);
				if(!r){
					jqUploadForm.find(".required").html("<img src='"+Cities.validateErrorImgSrc+"'/>"+Cities.validateTip.file.type);
					return false;
				}
			} else{
				jqUploadForm.find(".required").html("<img src='"+Cities.validateErrorImgSrc+"'/>"+Cities.validateTip.file.empty);
				return false;
			}
			return true;
			
		},
		
		bindCities : function(data, type){
			if(type== "edit"){
				if(data.fileId){
					$("#file-id").val(data.fileId);
					this.viewFile(data.fileId);
				}
				$("#cities-code").val(data.code);
				$("#cities-title").val(data.title);
				$("#cities-url").val(data.url);
				$("#cities-districtManageAdds").val(data.districtManageAdds);
				$("#cities-type").val(data.type);
				$("#cities-brief").val(data.brief);
				$("#cities-sort").val(data.sort);
			}
			else if(type =="view"){
				if(data.fileId){
					$("#file-id").val(data.fileId);
					this.viewFile(data.fileId);
				}
				$("#cities-code").val(data.code);
				$("#cities-title").val(data.title);
				$("#cities-url").val(data.url);
				$("#cities-districtManageAdds").val(data.districtManageAdds);
				$("#cities-type").val(this.getTypeName(data.type));
				$("#cities-brief").val(data.brief);
				$("#cities-sort").val(data.sort);
			}
			
		},
		
		getTypeName : function(typeId){
			if(typeId == "1"){
				return "标准基线版";
			} else if(typeId == "2"){
				return "小型化LITE版";
			}
		},
		
		/*
		 * 绑定市区互联数据列表
		 */
		bindCitiesList : function(json, key){
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
				row = row.replace(/\%{href}%/g, "href='"+data.districtManageAdds+"'");
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
			var url = Cities.url["uploadFile"];
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
			var url = Cities.url["updateFile"];
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
			$("#uploadForm").find(".required").html("<img src='"+Cities.loadingImgSrc+"'/>");
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
							Cities.fn.viewFile(json.fileId);
						}else if(json.msg){
							$("#uploadForm").find(".required").html("<img src='"+Cities.validateErrorImgSrc+"'/>"+json.msg);
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
			var url = Cities.url["viewFile"];
			var params = "fileId="+id+"&t="+Date.parse(new Date());
			var action = TDT.getAppPath(url)+"?"+params;
			$("#pic-src").attr("src",action);
		},
		
		findLocalDistrict:function(id, type){
			var url = Cities.url["findLocalDistrict"];
			var params = "";
			TDT.getDS(url,params,true,function(json){
				if(json.result){
					 $("<option value='0'>请选择地区</option>").appendTo("#cities-code");
					$.each(json.sarList,function(i,data){
						 $("<option value='"+data.code+"'>"+data.areaName+"</option>").appendTo("#cities-code");
					});
					if(type == "edit"){
						Cities.fn.findCitiesById(id,"edit");
					}
				}
			});
			
		}
	};
	
	
	
	Cities.fn.init.prototype = Cities.fn;
	
})();
