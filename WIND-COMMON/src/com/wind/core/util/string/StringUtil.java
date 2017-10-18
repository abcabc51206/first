package com.wind.core.util.string;

public class StringUtil {
	
	public static boolean isNull(String oriStr){
		boolean isNull  = false;
		if(null == oriStr){
			isNull = true;
		}else{
			String tempStr = oriStr.trim();
			if(tempStr.length() == 0){
				isNull = true;
			}
		}
		return isNull;
	}

	
}
