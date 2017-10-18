/**
 * 分类搜索 模块对象
 * @author 朱泽江
 * @version 1.0 2012/8/1
 */
(function($,exports){
 	var SearchType = function(id,index){
			return this.init(id,index);
	}
 	SearchType.prototype = {
	 	url:{
	 		parentId:"searchType/getParentNode.do"
	 	},
	 	checkflag:false,//初始化的时候默认选中标识
	 	
		init:function(id,index){
			var _that = this;
			if(typeof(index) == "number"){//如果index为数字则默认显示该索引对应的分类
				this.checkflag = true;
			}
			var url = TDT.getAppPath(this.url["parentId"]);
			var selTree = new Select(id,{
				expand:true,
				hidden_name:id+"-id",
				onActivate: function(node) {
					$("#"+id+"-code").val(node.data.code);
					$("#"+id+"_hidden").parents("li").find(".required").html("*");
			    },
				onLazyRead : function(node){
					node.appendAjax({
			          debugLazyDelay: 0,
			          url : url,
			          data : {id : node.data.id},
			          success : function(node){
			          			if(_that.checkflag && node.childList.length>index){
				          			selTree.addValue(node.childList[index].data.title,node.childList[index].data.id);
				          			$("#"+id+"-code").val(node.childList[index].data.code);
			          			}
			          			_that.checkflag = false;
				            }
			        });
				},
				children : [{title:"分类搜索目录","isFolder": true, "isLazy": true, id:"root"}]
			});
			$("#"+id+"_hidden").removeAttr("name");
			selTree.addValue("分类搜索目录", "root");
			var rootNode = $("#"+selTree.tid).dynatree("getRoot")
			if(rootNode.childList.length > 0){
				rootNode.childList[0].toggleExpand();
			}
			this.selTree = selTree;
			return this;
		}

 	};
	exports.SearchType = SearchType;
})(jQuery,window);