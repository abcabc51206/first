package com.wind.core.common.property;

import java.io.IOException;
import java.io.InputStream;
import java.text.MessageFormat;
import java.util.Properties;

import com.wind.core.util.string.StringUtil;

public class ReportMessageUtil {
	
	private static Properties reportProp = null;

	public static Properties init(){
	    if (reportProp == null)
	    	reportProp = new Properties();
	    InputStream is = ReportMessageUtil.class.getClassLoader().getResourceAsStream("config/report.properties");
	    try {
	    	reportProp.load(is);
		} catch (IOException e) {
			e.printStackTrace();
		}
	    return reportProp;
	}
	
	public static String getProperty(String key, String defaultValue){
		if (reportProp == null) {
			init();
		}
		return reportProp.getProperty(key, defaultValue);
	}
	
	/**
	 * Get the property value
	 * @param key The property key 
	 * @return The Property value. 
	 * @throws Exception
	 */
	public static String getProperty(String key){
		if (reportProp == null) {
			init();
		}
		return reportProp.getProperty(key);
	}
	
	public static String getProperty(String key, Object[] arguments){
		String srcValue = null;
		String targetValue = null;
		if (reportProp == null) {
			init();
		}
		srcValue = reportProp.getProperty(key);
		if(!StringUtil.isNull(srcValue)){
			targetValue = MessageFormat.format(srcValue, arguments);
		}
		return targetValue;
	}
}