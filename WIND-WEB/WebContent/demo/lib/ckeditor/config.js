/*
Copyright (c) 2003-2011, CKSource - Frederico Knabben. All rights reserved.
For licensing, see LICENSE.html or http://ckeditor.com/license
*/

CKEDITOR.editorConfig = function( config )
{
	// Define changes to default configuration here. For example:
	// config.language = 'fr';
	// config.uiColor = '#AADC6E';]
	config.filebrowserImageUploadUrl  = TDT.getAppPath("")+'ckeditor/uploadFile.do?type=Images';
	//config.filebrowserImageUploadUrl  = 'ckeditor/uploader?type=Images';
	config.filebrowserFlashUploadUrl = TDT.getAppPath("")+'ckeditor/uploadFile.do??type=Flash';
	//config.filebrowserFlashUploadUrl  = 'ckeditor/uploader?type=Flash';
	config.filebrowserUploadUrl = TDT.getAppPath("")+'ckeditor/uploadFile.do?type=File';
	

    
    //当从word里复制文字进来时，是否进行文字的格式化去除 plugins/pastefromword/plugin.js
    config.pasteFromWordIgnoreFontFace = true; //默认为忽略格式 

};
