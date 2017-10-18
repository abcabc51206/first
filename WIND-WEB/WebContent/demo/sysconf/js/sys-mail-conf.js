var sysconf = new Sysconf();

$(document).ready(function(){
	sysconf.getMailConf();
});

function saveSysMailConf(){
	sysconf.saveSysMailConf();
}

function resetSysMailConf(){
	sysconf.getMailConf();
}