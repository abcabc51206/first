package com.wind.core.common.email;

import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.Date;
import java.util.Properties;

import javax.mail.Address;
import javax.mail.Message;
import javax.mail.MessagingException;
import javax.mail.Session;
import javax.mail.Transport;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;

public class MailSender {
	
	private static MailSender instance = null;
	
	private Properties emailInfo = null; 
	
	private MailSender() {
		super();
	}

	public static MailSender getInstance(){
		if(null == instance){
            synchronized (MailSender.class) {  
                if(null == instance){
                    instance = new MailSender(); 
                    initServerInfo();
                }  
            }  
		}
		return instance;
	}
	
	private static void initServerInfo(){
		Properties properties = null;
		InputStream is = null;
		if(null != instance){
			try {
				properties = new Properties();
				is = MailSender.class.getClassLoader().getResourceAsStream("config/mail.properties");
				is = new FileInputStream("F:\\develop_person\\project\\person\\WIND-COMMON\\config\\mail.properties");
				properties.load(is);
				instance.emailInfo = properties;
			} catch (IOException e) {
				e.printStackTrace();
			}
		}
	}
	
	
    public boolean sendTextMail(MailSenderInfo mailInfo) {  
    	LocalAuthenticator authenticator = null;  
        Properties properties = this.emailInfo;
        String userName = properties.getProperty("mail.fromaddress");
        String passWord = properties.getProperty("mail.password");
        String needValidate = properties.getProperty("mail.smtp.auth");
        String mailProtocol = properties.getProperty("mail.transport.protocol");
        String mailHost = properties.getProperty("mail.smtp.host");
        String mailPort = properties.getProperty("mail.smtp.port");
        
        Properties serverInfo = new Properties();                    
        serverInfo.setProperty("mail.transport.protocol", mailProtocol);   
        serverInfo.setProperty("mail.smtp.host", mailHost);   
        serverInfo.setProperty("mail.smtp.port", mailPort); 
        serverInfo.setProperty("mail.smtp.auth", needValidate);

        boolean validateFlag = Boolean.parseBoolean(needValidate);
        
        if (validateFlag) {  
            authenticator = new LocalAuthenticator(userName, passWord);  
        }  
        // 根据邮件会话属性和密码验证器构造一个发送邮件的session  
        Session sendMailSession = Session.getDefaultInstance(serverInfo, authenticator);  
        try {  
            // 根据session创建一个邮件消息  
            Message mailMessage = new MimeMessage(sendMailSession);  
            // 创建邮件发送者地址  
            Address from = new InternetAddress(userName);  
            // 设置邮件消息的发送者  
            mailMessage.setFrom(from);  
            // 创建邮件的接收者地址，并设置到邮件消息中  
            InternetAddress[] internetAddressTo = new InternetAddress().parse(mailInfo.getToAddress());
            mailMessage.setRecipients(Message.RecipientType.TO, internetAddressTo);  
            
            InternetAddress[] internetAddressCC = new InternetAddress().parse(mailInfo.getCopyToAddress());
            mailMessage.setRecipients(Message.RecipientType.CC, internetAddressCC);  
            
            // 设置邮件消息的主题  
            mailMessage.setSubject(mailInfo.getSubject());  
            // 设置邮件消息发送的时间  
            mailMessage.setSentDate(new Date());  
            // 设置邮件消息的主要内容  
            String mailContent = mailInfo.getContent();  
            mailMessage.setText(mailContent);  
            // 发送邮件  
            Transport.send(mailMessage);  
            return true;  
        } catch (MessagingException ex) {  
            ex.printStackTrace();  
        }  
        return false;  
    } 
	
    
    public static void main(String[] args) {
    	MailSender sender = MailSender.getInstance();
    	MailSenderInfo senderInfo = new MailSenderInfo();
    	senderInfo.setContent("邮件测试");
    	senderInfo.setSubject("测试");
    	senderInfo.setToAddress("abcabc51206@163.com,617288949@qq.com");
    	senderInfo.setCopyToAddress("287494502@qq.com");
    	sender.sendTextMail(senderInfo);
    	
    	
	}
	
}
