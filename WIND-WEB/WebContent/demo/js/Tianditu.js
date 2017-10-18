/**
 * 天地图基线公用类
 * @author wangshoudong
 * @version 1.0 2012/6/5
 */
(function() {
var Tianditu = window.Tianditu = function(){
		return new Tianditu.fn.init();
	},
	
	_TDT = window.TDT,
	
	//应用路径
	appPath = "/admin/";
	
Tianditu.fn = Tianditu.prototype = {
	
	/**
	 * 初始化
	 */
	init:function(){
		return this;
	},

	/**
	 * 版本号
	 */
	version:"1.0"
	
};
	
Tianditu.fn.init.prototype = Tianditu.fn;
	
Tianditu.extend = Tianditu.fn.extend = function() {
	// copy reference to target object
	var target = arguments[0] || {}, i = 1, length = arguments.length, deep = false, options, name, src, copy;

	// Handle a deep copy situation
	if ( typeof target === "boolean" ) {
		deep = target;
		target = arguments[1] || {};
		// skip the boolean and the target
		i = 2;
	}

	// Handle case when target is a string or something (possible in deep copy)
	if ( typeof target !== "object" && !Tianditu.isFunction(target) ) {
		target = {};
	}

	// extend Tianditu itself if only one argument is passed
	if ( length === i ) {
		target = this;
		--i;
	}

	for ( ; i < length; i++ ) {
		// Only deal with non-null/undefined values
		if ( (options = arguments[ i ]) != null ) {
			// Extend the base object
			for ( name in options ) {
				src = target[ name ];
				copy = options[ name ];

				// Prevent never-ending loop
				if ( target === copy ) {
					continue;
				}

				// Recurse if we're merging object values
				if ( deep && copy && typeof copy == "object" && !copy.nodeType )
					target[ name ] = Tianditu.extend( deep, 
						// Never move original objects, clone them
						src || ( copy.length != null ? [ ] : { } )
					, copy );

				// Don't bring in undefined values
				else if ( copy !== undefined )
					target[ name ] = copy;
			}
		}
	}

	// Return the modified object
	return target;
};


/**
 * 扩展方法
 */
Tianditu.extend({
	
	/**
	 * 获取应用路径
	 */
	getAppPath: function(url) {
		return appPath + url;
	},
	
	/**
	 * 判断某个元素是否在数组中
	 * @return 若在返回下标，否则返回-1 
	 */
	inArray : function( elem, array ) {
		for ( var i = 0, length = array.length; i < length; i++ )
		// Use === because on IE, window == document
			if ( array[ i ] === elem )
				return i;

		return -1;
	},
	
	/**
	 * 从指定数组中去除指定值
	 * @return 新的数组 
	 */
	removeValFromArr : function(val, arr){
		var len = arr.length;
		for(var i = 0; i < len; i++){
			if(arr[i] == val){
				arr.splice(i,1);
			}
		}
		return arr;
	},
	
	/**
	 * 获取URL问号后面的值
	 * @return 返回指定key的value
	 */
	getParam : function(param){
		var local = document.location.search.substring(1);
		var splits = local.split("&");
		for (var i = 0; i < splits.length; i++) {
			var sp = splits[i];
			if (sp.indexOf(param+"=") == 0) {
				var val = sp.substring(param.length+1);
				return decodeURIComponent(val);
			}
		}
	}, 
	
	/**
	 * 判断对象是否为空
	 * return true:为空 false:不为空 
	 */
	 isEmptyObjec : function(obj){
		for(var o in obj){
			return false;
		}
		return true;
	},
	
	isFunction: function( obj ) {
		return toString.call(obj) === "[object Function]";
	},

	isArray: function( obj ) {
		return toString.call(obj) === "[object Array]";
	},
	
	 /**
	  * 截取字符串指定长度，超过指定长度则"..."显示
	  * @param str-原字符串
	  * @param len要截取的字符个数
	  * 
	  * @return string 截取后的字符串
	  */
	strCut : function(str,len){
		var s=str||"";
		var l=s.length;
		return l>parseInt(len)?s.substr(0,len)+"...":s;
	},
	
	/**
	 *检查所传递的参数中是否有undefined或null存在,如果有则改为空
	 *可以检查一串查询字符串,也可以检查单个值.
	 */
	formatParam : function(param){
		if(param == null || param == undefined){
			return "";
		}
		
		param+="&";
		param=param.replace(/=undefined&/g,"=&");
		param=param.replace(/=null&/g,"=&");
		return param.substring(param,param.lastIndexOf("&"));
	},
	
	
	/**
	 * 远程调用获取服务器数据
	 * @param URL 服务器URL
	 * @param params 传递到服务器参数，例如：username=aaa&password=111
	 * @param isAsync 是否是异步传输
	 * @param callback 回调函数
	 */	                                      			    
	getDS : function(URL,params,isAsync,callback){
		URL = $.trim(URL);
		URL = this.formatParam(URL);
		params = this.formatParam(params);
		var async = (typeof isAsync == "undefined") ? true : isAsync;	
		async = async === false ? false: true;
		$.ajax({
		          type:"post",
		          url:this.getAppPath(URL),
		          data:params,
		          dataType:"json",
		          async:async,
		          success:function(json){	          	
		          		 if(callback && (typeof callback != "undefined")){
			          			if(json){
			          			    callback(json); 
			          			}
		          		 }else{
		          		  	return json;
		          		 }
		          }
		});
	},
	
	/**
	 * 表单提交
	 * @param id 表单DOM对象ID
	 * @param URL 服务器URL
	 * @param params 传递到服务器参数，例如：username=aaa&password=111
	 * @param isAsync 是否是异步传输
	 * @param callback 回调函数
	 */	 		 			                
	formSubmit : function(id, URL, params, isAsync, callback){
		//检查提交的参数值是否合法,不合法则将参数值设为空
		URL = this.formatParam(URL);	
		params = this.formatParam(params);
		var async = (typeof isAsync == "undefined") ? true : isAsync;	
		async = async === false ? false: true;
	    var option={
	          url:this.getAppPath(URL),
	          data:params,
	          dataType:'json',
	          contentType:'application/x-www-form-urlencoded;charset=UTF-8',
	          async:async,
	          success:function(json){
	          		if(callback && (typeof callback != "undefined")){
		          			if(json){
		          			    callback(json);     	     			          	     		          	     			          	   			          				          	        			          
		          			}
	          		  }else{
	          		  	return json;
	          		  }
	          }
	    }
	    $("#"+id).ajaxSubmit(option);
							   	
	},
	
	
	
	/**
	 * 分页控件
	 * @param pageNum 页码
	 * @param pageSize 页大小
	 * @param totalRecords 总记录数
	 * @param container 分页容器
	 * @param func 分页函数
	 */
	 pager : function(pageNum, pageSize, totalRecords, container, func){
	 	
	 	var showPage = "";
	 	var currPage = pageNum;//当前页码
	 	var pageN = totalRecords/pageSize;//分页总数
	 	if (totalRecords % pageSize > 0) pageN = parseInt(totalRecords/pageSize) + 1;
	 	
	 	if (pageNum > 1){
			showPage='<a class="first-page" href="javascript:void(0);">首页</a> <a class="prev-page" href="javascript:void(0);">上一页</a>'
		} else{
			showPage='&nbsp;&nbsp;<span disabled="disabled">首页</span>&nbsp;&nbsp;&nbsp;&nbsp;<span disabled="disabled">上一页</span>&nbsp;&nbsp;';
		}
		
		var showPageNum = 10;//最多显示页码数量
		if(pageN <= showPageNum){
			for(var i = 1; i <= pageN; i++){
				showPage += ' <a class="page-num" href="javascript:void(0);">'+i+'</a> ';
			}
		} else {
			if(pageNum < 6){
				for(var i = 1; i <= showPageNum; i++){
					showPage += ' <a class="page-num" href="javascript:void(0);">'+i+'</a> ';
				}	
			} else if(pageNum >= pageN - 5 && pageNum <= pageN){
				var start = pageN - showPageNum + 1;
				for(var i = start; i <= pageN; i++){
					showPage += ' <a class="page-num" href="javascript:void(0);">'+i+'</a> ';
				}
			} else {
				var start = pageNum - 4;
				for(var i = start; i < pageNum; i++){
					showPage += ' <a class="page-num" href="javascript:void(0);">'+i+'</a> ';
				}
				
				var end = pageNum + 5;
				for(var i = pageNum; i < end; i++){
					showPage += ' <a class="page-num" href="javascript:void(0);">'+i+'</a> ';
				}
				
			}
		}
		
		if (pageNum < pageN){
			showPage += ' <a class="next-page" href="javascript:void(0);">下一页</a> <a class="last-page" href="javascript:void(0);">尾页</a> '
		} else{
			showPage +='&nbsp;&nbsp;<span disabled="disabled">下一页</span>&nbsp;&nbsp;&nbsp;&nbsp;<span disabled="disabled">尾页</span>';
		}
		var jContainer = $(container);
	 	jContainer.html('页次：'+pageNum+'/<font color=red>'+pageN+'</font><font class="word">共<font>：<font color=red>'+totalRecords+'</font> 条 '+showPage);
		
		
		//绑定页码事件
		jContainer.find(".page-num").each(function(){
			var p = parseInt($(this).text());
			if(p == currPage){
				$(this).attr("class","curr-page-num");
			}
			$(this).click(function(){
				func(p);
			});
		});
		
		//绑定首页事件
		jContainer.find(".first-page").click(function(){
			func(1);
		});	
		
		//绑定上一页事件
		jContainer.find(".prev-page").click(function(){
			func(currPage - 1);
		});	
		
		//绑定下一页事件
		jContainer.find(".next-page").click(function(){
			func(currPage + 1);
		});	
		
		//绑定尾页事件
		jContainer.find(".last-page").click(function(){
			func(pageN);
		});	 
	 },
	 /**
	  * 选中checkbox,则加亮显示
	  * @param obj:选中的checkbox对象
	  * @param tbody_id:实际绑定列表的tbody_id
	  * @param cssObj:样式(默认样式为visitChecked)
	  */
	 brightShow : function (obj,tbody_id,cssObj){
		if(!cssObj){
		 	cssObj = "visitChecked";
		}
		var row;
		if($(obj).parent().attr("rowid") != undefined){
			row = $(obj).parent();
		} else if($(obj).parent().parent().attr("rowid") != undefined){
			row = $(obj).parent().parent();
		} 
		row.find("input[type=checkbox]").each(function(){
			if($(this).attr("checked")){
				 row.addClass(cssObj);
			} else{
				 row.removeClass(cssObj);
			}
		});
		
		//如果列表中所有的行都被选中时，那么全选框也同时被选中 
		
		var checkObj = "#"+tbody_id+" input[type=checkbox]";
		var chooseAllObj = $("#chooseall");
		$(checkObj).click(function(){
	        if(!this.checked){
	            chooseAllObj.attr("checked",false);
	        }else{
	            if($(checkObj).size() == $(checkObj+":checked").size()){
	                chooseAllObj.attr("checked","checked");
	            }
	        }
	    });
	 },
	 
	 /** 
	  * 全选、取消所有选择
	  * @param obj 全选checkbox对象
	  * @param bodyObj 列表主题对象
	  * @param cssObj样式字符串(默认visitChecked) 
	  */
	chooseall : function(obj,bodyObj,cssObj){
		if(!cssObj)
			cssObj = "visitChecked"
		var grp_slctr = "#"+bodyObj+" input[type=checkbox]";
		if(obj.checked){
			$(grp_slctr).attr("checked","checked");
			//加样式
			$(grp_slctr).each(function(){
					var row;
					if($(this).parent().attr("rowid") != undefined){
						row = $(this).parent();
					} else if($(this).parent().parent().attr("rowid") != undefined){
						row = $(this).parent().parent();
					} 
					row.find("input[type=checkbox]").each(function(){
						 row.addClass(cssObj);
					});
			});
		}else{
			$(grp_slctr).attr("checked",false);
			//去除样式
			$(grp_slctr).each(function(){
					var row;
					if($(this).parent().attr("rowid") != undefined){
						row = $(this).parent();
					} else if($(this).parent().parent().attr("rowid") != undefined){
						row = $(this).parent().parent();
					} 
					row.find("input[type=checkbox]").each(function(){
						 row.removeClass(cssObj);
					});
			});
		}
	    $(grp_slctr).click(function(){
	        if(!this.checked){
	            $(obj).attr('checked',false);
	        }else{
	            if($(grp_slctr).size()==$(grp_slctr+":checked").size()){
	                $(obj).attr('checked','checked');
	            }
	        }
	     });
	},
	
	/**
	 * 收集选中的IDS
	 * @param jListObj
	 * 			绑定数据的列表对象
	 * @param attrField
	 * 			需要获取属性域（不传默认就取属性为id的域）
	 */
	getIds : function (jListObj,attrField){
		if(!attrField){
			attrField = "rowid";
		}
		var ids = [];
		jListObj.find("input[type=checkbox]:checked").each(function(){
			    var row;
			    if($(this).parent().attr(attrField) != undefined){
					row = $(this).parent();
				}else if($(this).parent().parent().attr(attrField) != undefined){
					row = $(this).parent().parent();
				}
				ids.push(row.attr(attrField));
			});
		//把收集的id转换成servlet要的字符串
		return  ids.join(",");
	}, 
	
	/**
	 * @param msg  提示信息
	 * @param okVal 默认确定按钮值 
	 * @param cancelVal 默认取消按钮值
	 * @param okFuc 默认确认按钮回调函数
	 * @param cancelFuc 默认取消按钮回调函数
	 */
	baseDialog : function(msg, okVal, cancelVal, okFuc, cancelFuc){
		art.dialog({
		    title: '友情提示',
		    content: msg,
		    lock : true, //锁屏
		    background: '#FFFFFF', // 背景色
		    icon: 'warning',
		    okVal: okVal,
		    cancelVal: cancelVal,
		    ok: function(){
		    	okFuc();
		    	return true;
		    },
		    cancel: function(){
		    	cancelFuc();
		    	return true;
		    }
		});
	},
	
	/**
	 * 模仿window.alert();
	 */
	alert : function(msg){
		art.dialog({
		    title: '友情提示',
		    content: msg,
		    icon: 'warning',
		    ok: function(){
		    	return true;
		    }
		});
	},
	
	/**
	 * 模仿window.confirm();
	 */
	confirm : function(msg, fun){
		art.dialog({
		    title: '友情提示',
		    content: msg,
		    lock : true, //锁屏
		    background: '#FFFFFF', // 背景色
		    icon: 'warning',
		    ok: function(){
		    	fun();
		    	return true;
		    },
		    
		    cancel: function(){
		    	return true;
		    }
		});
	},
	 
	/**
	 * 页面跳转
	 * @param url 页面的路径 
	 */
	 go:function(url){
	 		var timestr="t="+Date.parse(new Date);
	 		//qindex为查询?索引
	 		var qindex=url.indexOf("?");
	 		if(qindex>0){
	 			url+="&"+timestr
	 		}else{
	 		//jindex为#索引
	 		var jindex=url.indexOf("#");
	 			if(jindex>0){
	 				url=url.substring(0,jindex);
	 			}
	 				url+="?"+timestr;
	 		}
	 		var iframe=$(".main-page iframe");
			if(iframe.length>0){
				$(".main-page iframe").attr("src",url);
			}else{
				location.href=url;
			}
	 },
	 
	 formatTime : function(jsonDate){
	 	return (jsonDate.year+1900)+"-"+(jsonDate.month+1)+"-"+jsonDate.date+" "+jsonDate.hours+":"+jsonDate.minutes+":"+jsonDate.seconds;
	 },
	 
	 /**
	  * @param lev 层级
	  * @param title 显示名称
	  * @param url 跳转地址
	  */
	  showLevel:function(lev,title,url){
//	  	return true;
//	  	var isContainer=true;
//	  	if($(".index-navigation").size()==0){
//	  		isContainer=false;
//	  	}
//	  	var nav=$(".index-navigation").size()>0?$(".index-navigation"):window.parent.$(".index-navigation");
//	  	if(isContainer){
//	  		this.urlStore=this.urlStore?this.urlStore:[];
//	  	}else{
//	  		this.urlStore=window.parent.Tianditu.urlStore;
//	  	}
//	  	this.urlStore[lev]={title:title,url:url};
//	  	var str=""
//	  	for(var i =0;i<=lev;i++){
//			if(i==lev){
//				if(lev==0){
//					str+="<a lev='"+i+"' href='javascript:void(0)' onclick='Tianditu.go(\""+this.urlStore[i].url+"\")'>"+this.urlStore[i].title+"</a>"
//				}
//			}else{
//				str+="<a lev='"+i+"' href='javascript:void(0)' onclick='Tianditu.go(\""+this.urlStore[i].url+"\")'>"+this.urlStore[i].title+"</a>"
//				if(i==lev-1){
//				}else{
//					str+="<span class='split'>></span>";
//				}
//			}
//	  	}
//	  	nav.html(str);
	  },
	  //目前只针对数字数组
	  combineArray:function(array1,array2){
	  	var array = [];
	  	var newarray = array1.concat(array2);
	  	newarray.sort();
	  	var map = {};
	  	for(var i =0;i<newarray.length;i++){
			if(typeof map[newarray[i]] == "undefined"){
				map[newarray[i]]=1;
				array.push(newarray[i]);
			}
	  	}
	  	array.reverse();
	  	return array;
	  }
});

// Expose Tianditu to the global object
window.Tianditu = window.TDT = Tianditu;
	
})();

