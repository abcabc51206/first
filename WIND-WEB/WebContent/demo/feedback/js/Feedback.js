/**
 * 意见反馈 模块对象
 * @author 朱泽江
 * @version 1.0 2012/7/31
 */
 
 (function(){
	var Feedback = window.Feedback = function(){
		return new Feedback.fn.init();
	};
	
	Feedback.url = {
		getAll : "feedback/findAll.do",
		del:"feedback/delFeedback.do",
		findById:"feedback/findById.do",
		addReply:"feedback/addReply.do",
		addAudit:"feedback/updateAudit.do",
		searchByKey:"feedback/findByKeyWords.do"
	};
	Feedback.validateErrorImgSrc = "../images/error.gif";
	
	//表单验证提示信息
	Feedback.validateTip = {
		restore : {
			empty : "回复内容不能为空，请输入"
		} 
	};
	
	//初始当前页
	Feedback.pageNum = 1;
	
	//当前页记录条数
	Feedback.pageSize = 10;
	
	Feedback.fn = Feedback.prototype = {
	
		/**
		 * 初始化
		 */
		init:function(){
			return this;
		},
		/**
		 * 分页获取示通用配置列表
		 */
		findAllByPage : function(){
			var url = Feedback.url["getAll"];
			var params = "pageNum="+Feedback.pageNum+"&pageSize="+Feedback.pageSize;
			TDT.getDS(url,params,true,function(json){
				if(json.result){
					if(json.feedbackList.length>0){
						Feedback.fn.bindFeedbackList(json.feedbackList,"feedback");
						var pagerObj = document.getElementById("pager");
						TDT.pager(Feedback.pageNum, Feedback.pageSize, json.page.recordCount, pagerObj, function(p){
							Feedback.pageNum = p;
							Feedback.fn.findAllByPage();
						});
						$("#nomessage").hide();
					}
				} else{
						$("#feedbackList").html("");
						$("#nomessage").show();
						$("#pager").html("");
				}
			});
			
		},
		findByKeyWords : function(keyWords){
			var url = Feedback.url["searchByKey"];
			var params = "keyWords="+keyWords+"&pageNum="+Feedback.pageNum+"&pageSize="+Feedback.pageSize;
			TDT.getDS(url,params,true,function(json){
				if(json.result){
					if(json.feedbackList.length >0){
						Feedback.fn.bindFeedbackList(json.feedbackList,"feedback");
						var pagerObj = document.getElementById("pager");
						TDT.pager(Feedback.pageNum, Feedback.pageSize, json.page.recordCount, pagerObj, function(p){
							Feedback.pageNum = p;
							Feedback.fn.findByKeyWords();
						});
						$("#nomessage").hide();
					}
				} else{
						$("#feedbackList").html("");
						$("#nomessage").show();
						$("#pager").html("");
				}
			});
			
		},
		findById:function (id){
			var url = Feedback.url["findById"];
			var params = "feedback.id="+id;
			TDT.getDS(url,params,true,function(json){
				if(json.result){
					$("#userName").html(json.feedback.userName);
					$("#content").html(json.feedback.content);
					$("#createTime").html((json.feedback.createTime).replace("T","&nbsp;&nbsp;"));
					if(json.feedback.feedbackReply.length > 0){
						$("#reply-content").html(json.feedback.feedbackReply[0].content || "");
					}
					$("#feedback-id").val(json.feedback.id);
					if($("#userNameEmail")){
						$("#userNameEmail").html(json.feedback.userNameEmail);
						$("#replyState").html(json.feedback.replyState==0?"未回复":"已回复");
						$("#auditStatus").html((json.feedback.auditStatus==0 || json.feedback.auditStatus =="")?"未审核": (json.feedback.auditStatus==1)?"审核拒绝":"审核通过");
						$("#reviewers").html(json.feedback.reviewers);
						$("#auditSuggerstion").html(json.feedback.auditSuggerstion);
					}
					 
				}
			});
		},
		deleteFeedback : function (ids){
			var url = Feedback.url["del"];
			var params = "ids="+ids;
			TDT.getDS(url,params,true,function(json){
				if(json.result){
					TDT.go('feedback.html');	
				}
			});
		},
				//提交更新表单
		replySub:function(){
			var url = Feedback.url["addReply"];
			var isValidate = this.validateFeedbackForm();
			if(isValidate){
				TDT.formSubmit("feedbackUpdateForm",url, null, true, function(json){
					if(json.result){
		    			TDT.go('feedback.html');
					}
				});
			}
		},
				//提交更新表单
		updateAudit:function(id){
			var url = Feedback.url["addAudit"];
			TDT.formSubmit("feedbackAuditForm",url, null, true, function(json){
				if(json.result){
					
					//1-审核拒绝  2-审核通过
					var auditStatus = $("#feedback-auditStatus").val();
					
					if(auditStatus == "1"){
		    			TDT.baseDialog("操作成功！", "确认", "取消", function(){
			    			TDT.go('feedback.html');
		    			}, 
		    			function(){
		    			});
					} else if(auditStatus == "2"){
		    			TDT.baseDialog("操作成功！", "是否立刻回复", "返回列表", function(){
			    			TDT.go('feedback-restore.html?id='+id);
		    			}, 
		    			function(){
		    				TDT.go('feedback.html');
		    			});
					}
				}
			});
		},
		validateFeedbackForm:function(){
			var restore = $("#feedback-restore");
			if(restore.val() == ""){
				restore.parents("td").find(".required").html("<img src='"+Feedback.validateErrorImgSrc+"'/>"+Feedback.validateTip.restore.empty);
				restore.focus(function(){
					$(this).parents("td").find(".required").html("");
				});
				return false;
			}
			return true;
		},
		bindFeedbackList : function(json, key){
			var list = $("#"+key+"List");
			var html = [];
			list.html("");
			var template = $("#"+key+"Template");
			var temp = template.html();
			
			$.each(json,function(i,data){
		        var row = temp;
		        row = row.replace(/\%{rowid}%/g, data.id);
				row = row.replace(/\%{feedbackContent}%/g, TDT.strCut(data.content,15) || "");
				row = row.replace(/\%{userName}%/g, data.userName || "");
				row = row.replace(/\%{auditStatus}%/g, (data.auditStatus==0 || "")?"未审核": (data.auditStatus==1)?"审核拒绝":"审核通过" );
				row = row.replace(/\%{replyStatus}%/g, (data.replyState==0)?"未回复":"已回复");
				row = row.replace(/\%{createTime}%/g, (data.createTime).replace("T","&nbsp;&nbsp;"));
				row = row.replace(/\%{replyview}%/g, (data.replyState==0)?"":"");
				
				if(data.auditStatus == 1){
					row = row.replace(/\%{replyedit}%/g, "disabled='disabled'");
				} else if(data.replyState == 1){
					row = row.replace(/\%{replyedit}%/g, "disabled='disabled'");
				} else {
					row = row.replace(/\%{replyedit}%/g, "");
				}
				row = row.replace(/\%{audit}%/g, (data.auditStatus==0)?"":"disabled='disabled'");
				
				html.push(row);
			});
			list.html(html.join(""));
			$("a[disabled]").addClass("disable");//添加新的class 注意这里不会覆盖标签原有的class
			$("a[disabled]").removeAttr("onclick");//移除onClick事件
		}
	};
	Feedback.fn.init.prototype = Feedback.fn;
 })();