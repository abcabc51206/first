var searchType = new SearchType();

$(document).ready(function(){
	var id = TDT.getParam("id");
	searchType.findById(id,"view");
});

