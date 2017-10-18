/**
 * 方案配置模块对象
 * @author zy
 * @version 1.0 2013/3/6
 */
var scenario = new Scenario();

var currSceType;

$(document).ready(function(){  
	$(".select-button").live({
		click:function(){
			$(".fright-content-list").toggle();
		}
	});
	
	$(".select").live({
		mouseleave:function(){
			$(".fright-content-list").hide();
		}
	});
	$(".fright-content-list li").live({
		click:function(){
			var content=$(this).attr("name");
			currSceType = content;
			document.getElementById("fright-content").value=$(this).text();
			scenario.findAllByType(content);
			$(".fright-content-list").toggle();
		}
	});
	
	//创建方案
	$(".createScenario").click(function(){
		TDT.go('../page/scenario-add.html');
	});
	
    scenario.findAllByType("");
});
function onFocus(){
	$(".search").val("");
}

//关键字查找方案
function search(){
	var keyword = $(".search").val();
	scenario.searchByKeyAndType(keyword, currSceType);
}
//设置为默认方案
function setDefault(obj,e){

	var oEvent = e ? e : window.event;  
	//阻止超链接  
	if ( oEvent && oEvent.preventDefault ){
		oEvent.preventDefault();
	} else {
		window.event.returnValue = false;
	}   
    var tar;   
    if(navigator.appName=="Microsoft Internet Explorer"){  
        tar = oEvent.srcElement;  
    }else{  
        tar=oEvent.target;  
    }  
    if(tar.getAttribute("disabled")){         
        return false;//阻止点击事件  
    }     
	

	var id = $(obj).parent().parent().attr("rowid");
	var type = $(obj).parent().parent().attr("type");
	scenario.setDefaultScenario(currSceType, type, id);
}

//删除方案
function delScenario(obj){
	var id = $(obj).parent().parent().attr("rowid");
	scenario.deleteScenario(id,currSceType);
}

//编辑方案
function editScenario(obj){
	var scenarioId = $(obj).parent().parent().attr("rowid");
	TDT.go("../page/scenario-edit.html?id="+scenarioId);
}

//查看方案
function goViewScenario(obj){
	var type = $(obj).parent().parent().attr("type");
	var id = $(obj).parent().parent().attr("rowid");
	TDT.go("service.html?id="+id+"&type="+type);
}




