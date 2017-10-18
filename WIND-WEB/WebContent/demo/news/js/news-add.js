var news = new News();
$(document).ready(function(){  
    News.editor = CKEDITOR.replace( 'news-content' );
	news.getNewsType();    
}); 

function addNews(){
	var newsHtml = News.editor.getData();
	$("#news-content").val(newsHtml);
	news.addNews();
}

function uploadPic(form){
	var fileId = $("#file-id").val();
	if(fileId){
		news.updateFile(form);
	} else{
		news.uploadFile(form);
	}
}

