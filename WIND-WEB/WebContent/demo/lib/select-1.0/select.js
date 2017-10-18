var Select=function(id,option){
	var _select=this;

	//要渲染的select id
	_select.id=id;

	//父DOM
	_select.pid=id+"_pid"

	//要渲染的ipt id
	_select.iid=id+"_ipt"

	//handler id
	_select.hdid=id+"_handler";

	//隐藏域id
	_select.hid=id+"_hidden";

	//树id
	_select.tid=id+"_tree";

	_select.option=option?option:{};

	//隐藏域name字段
	_select.hname=_select.option["hidden_name"];

	//树对象
	_select.tree=null;

	if(!document.getElementById(_select.id)) return;

	_select.bind=function(){
		$("#"+_select.iid).focus(function(){
			$("#"+_select.tid).show();
		});
		$("#"+_select.hdid).click(function(){
			$("#"+_select.tid).show();
		});
		$("#"+_select.pid).bind("mouseleave",function(){
			$("#"+_select.tid).hide();
		});
		
		$("#"+_select.iid).blur(function(){
			if($.trim($(this).val())===""){
				$("#"+_select.hid).val("");
			}
		});
	}

	_select.addValue=function(title,value){
		$("#"+_select.iid).val(title);
		$("#"+_select.hid).val(value);
	}
	
	_select.getValue=function(){
		return $("#"+_select.iid).val();
	}

	_select.init=function(){
		//生成dom节点
		var selNode=document.getElementById(_select.id);
		//父节点
		var pNode=selNode.parentNode;
		//外包容器,以免与其他样式冲突
		var cdiv=document.createElement("div");
			cdiv.className="ct-sel-cn";
			cdiv.id=_select.pid;
		//text外包容器,重置浮动
		var cipth=document.createElement("div");
			cipth.className="groupbox ct-sel-ipth-cn";
		//树外包容器
		var ctree=document.createElement("div");
			ctree.className="groupbox ct-sel-list-cn";
			ctree.id=_select.tid;
		var ipt=document.createElement("input");
			ipt.type="text";
			ipt.readOnly="readOnly";
			ipt.id=_select.iid;
			
		var iphid=document.createElement("span");
			iphid.style.display="none";
		var iphid_input="<input type='hidden' id='"+_select.hid+"' name='"+_select.hname+"'/>"
			iphid.innerHTML=iphid_input;

		var handler_div=document.createElement("div");
			handler_div.id=_select.hdid;
			handler_div.className="ct-sel-han-cn";
			cipth.appendChild(ipt);
			cipth.appendChild(iphid);
			cipth.appendChild(handler_div);

			cdiv.appendChild(cipth);
			cdiv.appendChild(ctree)
			$(selNode).after(cdiv);
			$(selNode).hide();
			_select.tree=$("#"+_select.tid).dynatree(_select.option).width($("#"+_select.iid).outerWidth()+$("#"+_select.hdid).outerWidth()).hide();
			if(_select.option.checkbox){
				$("#"+_select.tid).dynatree({onSelect:function(flag,node,evt){
					_select.addValue(node.data.title,node.data.id);
				}})
			}else{
				$("#"+_select.tid).dynatree({onClick:function(node,evt){
					if(evt.target.className == "dynatree-title"){
						_select.addValue(node.data.title,node.data.id);
					}
				}})
			}
			
			_select.bind()
	};





	(function(){
		_select.init();
	})();
	return this;
}