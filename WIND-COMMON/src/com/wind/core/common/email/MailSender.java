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
        // �����ʼ��Ự���Ժ�������֤������һ�������ʼ���session  
        Session sendMailSession = Session.getDefaultInstance(serverInfo, authenticator);  
        try {  
            // ����session����һ���ʼ���Ϣ  
            Message mailMessage = new MimeMessage(sendMailSession);  
            // �����ʼ������ߵ�ַ  
            Address from = new InternetAddress(userName);  
            // �����ʼ���Ϣ�ķ�����  
            mailMessage.setFrom(from);  
            // �����ʼ��Ľ����ߵ�ַ�������õ��ʼ���Ϣ��  
            InternetAddress[] internetAddressTo = new InternetAddress().parse(mailInfo.getToAddress());
            mailMessage.setRecipients(Message.RecipientType.TO, internetAddressTo);  
            
            InternetAddress[] internetAddressCC = new InternetAddress().parse(mailInfo.getCopyToAddress());
            mailMessage.setRecipients(Message.RecipientType.CC, internetAddressCC);  
            
            // �����ʼ���Ϣ������  
            mailMessage.setSubject(mailInfo.getSubject());  
            // �����ʼ���Ϣ���͵�ʱ��  
            mailMessage.setSentDate(new Date());  
            // �����ʼ���Ϣ����Ҫ����  
            String mailContent = mailInfo.getContent();  
            mailMessage.setText(mailContent);  
            // �����ʼ�  
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
    	senderInfo.setContent("�ʼ�����");
    	senderInfo.setSubject("����");
    	senderInfo.setToAddress("abcabc51206@163.com,617288949@qq.com");
    	senderInfo.setCopyToAddress("287494502@qq.com");
    	sender.sendTextMail(senderInfo);
    	
    	
	}
	
}
