$(document).ready(function(){  
    var id = TDT.getParam("id");
    var demoApp = new DemoApp();
    demoApp.findDemoAppById(id);
}); 