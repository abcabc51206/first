/**
页面布局
*/
$(document).ready(function(){
	var layout=$(".layout-container").layout({
		center__paneSelector:".outer-center",
		west__paneSelector:".outer-west",
		north__paneSelector:".outer-north",
		south__paneSelector:".outer-south",
		north__size:78,
		spacing_open:0,
		spacing_closed:0
		,center__childOptions:{
			center__paneSelector:".middle-center",
			west__paneSelector:".middle-west",
			south__paneSelector:".middle-south",
			north__paneSelector:".middle-north",
			south__size:18,
			west__size:234,
			north__size:8,
			spacing_open:0,
			spacing_closed:0
		}
	});
	$(".mask").fadeOut(1000);
	// var innerLayout=$(".inner-layout").layout({
	// 	south__size:100,
	// 	spacing_open:0,
	// 	spacing_closed:0
	// })
	$("li").hover(function(){
		$(this).addClass("hover");
	},function(){
		$(this).removeClass("hover");
	});

	$(".west-toggle").hover(function(){
		$(this).addClass("hover");
	},function(){
		$(this).removeClass("hover");
	}).click(function(){
		$(this).toggleClass("open");
		var _flag=$(this).hasClass("open");
		if(!_flag){
			layout.close("west");
		}else{
			layout.open("west");
		}
	});
	/*绑定开关*/
	// $(".leftbottom").click(function(){
	// 	$(this).parent().addClass("open");
	// 	layout.center.child.open("east");
	// });
	$(".inner-container .lefttop").click(function(){
		layout.center.child.close("east");
		$(".overview-map-container").removeClass("open");
	})
	$(".overview-map-container .lefttop").click(function(){
		//resetView();
		$(this).parent().addClass("min");
	});
	$(".overview-map-container .rightbottom").click(function(){
		//resetView();
		if($(this).parent().hasClass("min")){
			$(this).parent().removeClass("min");
		}else{
			$(".overview-map-container").addClass("open");
			layout.center.child.open("east");
		}
	});
	// $(".righttop").click(function(){
	// 	$(this).parent().addClass("open");
	// 	layout.center.child.open("south");
	// })


	/**
	重置视图
	*/
	function resetView(){
		$(".overview-map-container").removeClass("open");
		layout.center.child.close("east");
		layout.center.child.close("south");
	}
	/*
	页面跳转
	*/
	function goToUrl(url){
		Tianditu.go(url,0)
	}

	$(".handler").live("click",function(){
		var pNode=$(this).parent();
		if(pNode.hasClass("open")){
		pNode.removeClass("open");	
		}else{
			$(".lv1-list li").removeClass("open");
			pNode.addClass("open");	
		}; 
		
		//如果当前菜单被打开了,则点开第一个子节点
		if(pNode.hasClass("open")){
			$(pNode.find(".lv2-list li").get(0)).click();
		}
	});
	$(".lv2-list li").live("click",function(){
		var $a = $(this).find("a");
		if($a.attr("target") == "_blank") return;
		$(".lv2-list li").removeClass("selected");
		$(this).addClass("selected");
		goToUrl($(this).find("a").attr("href"));
		return false;
	})
	
	//鼠标滑到输入框上的样式
	$(".shadow").live({mouseenter:function(){
		$(this).parent("td").addClass("hover");
	}})
	$(".logined").live({mouseenter:function(){
		$(".loginfo-user").toggleClass("loginfo-select");
		$(".user-action-td").toggle();
	},mouseleave:function(){
		$(".user-action-td").hide();
		$(".loginfo-user").removeClass("loginfo-select");
	}})
})