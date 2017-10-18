package com.wind.core.common.email;

import java.util.Properties;


public class MailSenderInfo {
	
	private String toAddress; 
	
	private String copyToAddress;
	 
    private String subject;  
    
    private String content; 
    
    private String[] attachFileNames;

    
	public MailSenderInfo() {
		super();
	}

	public String getToAddress() {
		return toAddress;
	}

	public void setToAddress(String toAddress) {
		this.toAddress = toAddress;
	}

	public String getCopyToAddress() {
		return copyToAddress;
	}

	public void setCopyToAddress(String copyToAddress) {
		this.copyToAddress = copyToAddress;
	}

	public String getSubject() {
		return subject;
	}

	public void setSubject(String subject) {
		this.subject = subject;
	}

	public String getContent() {
		return content;
	}

	public void setContent(String content) {
		this.content = content;
	}

	public String[] getAttachFileNames() {
		return attachFileNames;
	}

	public void setAttachFileNames(String[] attachFileNames) {
		this.attachFileNames = attachFileNames;
	}  
    
    
}
