var news = new News();
$(document).ready(function(){
	News.editor = CKEDITOR.replace( 'news-content' );  
    var id = TDT.getParam("id");
    $("#news-id").val(id);
    news.findNewsById(id);
    news.getNewsType();
}); 

function uploadPic(form){
	var fileId = $("#file-id").val();
	if(fileId){
		news.updateFile(form);
	} else{
		news.uploadFile(form);
	}
}

function editNews(){
	var newsHtml = News.editor.getData();
	$("#news-content").val(newsHtml);
    news.updateNews();
}
