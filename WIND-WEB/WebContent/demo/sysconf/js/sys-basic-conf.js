var sysconf = new Sysconf();
var sar = new Sar();

$(document).ready(function(){
	sar.getParentNode();
	sysconf.getBasicConf();
});

function saveSysBasicConf(){
	sysconf.saveSysBasicConf();
}

function resetSysBasicConf(){
	sysconf.getBasicConf();
}