package com.wind.core.common.email;

import javax.mail.Authenticator;
import javax.mail.PasswordAuthentication;

public class LocalAuthenticator extends Authenticator {  
    String userName = null;  
    String password = null;  
  
    public LocalAuthenticator() {  
    }  
  
    public LocalAuthenticator(String username, String password) {  
        this.userName = username;  
        this.password = password;  
    }  
  
    protected PasswordAuthentication getPasswordAuthentication() {  
        return new PasswordAuthentication(userName, password);  
    }  
}
