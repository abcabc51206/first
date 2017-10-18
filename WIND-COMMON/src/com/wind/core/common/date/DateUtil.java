package com.wind.core.common.date;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;

import com.wind.core.util.string.StringConstants;
import com.wind.core.util.string.StringUtil;

public class DateUtil {

	//base function format date to string
	public String formatDateToString(Date oriDate, String formatString){
		SimpleDateFormat dateFormat = null;
		String result = null;
		if(null != oriDate && !StringUtil.isNull(formatString)){
			dateFormat = new SimpleDateFormat(formatString);
			try {
				result = dateFormat.format(oriDate);
				dateFormat = null;
			} catch (Exception e) {
				result = StringConstants.BLANK_STRING_LENGTH_NONE;
				dateFormat = null;
			}
		}
		return result;
	}
	
	//base function parse string to date
	public Date parseStringToDate(String dateString, String formatString){
		SimpleDateFormat dateFormat = null;
		Date result = null;
		if(!StringUtil.isNull(dateString) && !StringUtil.isNull(formatString)){
			try {
				dateFormat = new SimpleDateFormat(formatString);
				result = dateFormat.parse(dateString);
				dateFormat = null;
			} catch (ParseException e) {
				try {
					dateFormat = new SimpleDateFormat(StringConstants.DATE_FORMAT_CONNECT_SEPARATOR);
					result = dateFormat.parse(dateString);
					dateFormat = null;
				} catch (ParseException e1) {
					result = null;
					dateFormat = null;
				}
			}
		}
		return result;
	}
	
	//calculate times ×ó±ÕÓÒ¿ª [2018-08-08 00:00:00 2018-08-09 00:00:00 )
	public int calculateCurrentTimes(Date basicDate, Date currentDate, int circleNumber, String circleUnit){
		boolean checkSuccess = false;
		int resultTimes = 0;
		Date[] intervalDate = new Date[0];
		Date beginDate = null;
		while(true){
			resultTimes++;
			if( null  == beginDate){
				beginDate = basicDate;
			}else{
				beginDate = intervalDate[1];
			}
			intervalDate = calculateIntervalEndPoint(beginDate, circleNumber, circleUnit);
			checkSuccess = checkCurrentDateInInterval(currentDate, intervalDate);
			if(checkSuccess){
				break;
			}
		}
		return resultTimes;
	}
	
	public Date[] calculateIntervalEndPoint(Date currentBeginDate, int circleNumber, String circleUnit){
		SimpleDateFormat dateFormat = null;
		SimpleDateFormat timeFormat = null;
		Calendar beginCalendar = null;
		Date[] endPointDate = new Date[0];
		try {
			if(null != currentBeginDate){
				beginCalendar = Calendar.getInstance();
				beginCalendar.setTime(currentBeginDate);
				dateFormat = new SimpleDateFormat(StringConstants.DATE_FORMAT_CONNECT_SEPARATOR);
				timeFormat = new SimpleDateFormat(StringConstants.DATE_FORMAT_ZERO_TIME);
				int dateType = 0;
				int dateSpan = 0;
				if(circleNumber > 0 && !StringUtil.isNull(circleUnit)){
					if(StringConstants.CIRCLE_UNIT_YEAR.equals(circleUnit)){
						dateType = Calendar.YEAR;
						dateSpan = circleNumber;
					}else if(StringConstants.CIRCLE_UNIT_MONTH.equals(circleUnit)){
						dateType = Calendar.MONTH;
						dateSpan = circleNumber;
					}else if(StringConstants.CIRCLE_UNIT_WEEK.equals(circleUnit)){
						dateType = Calendar.DATE;
						dateSpan = circleNumber * 7;
					}else if(StringConstants.CIRCLE_UNIT_DAY.equals(circleUnit)){
						dateType = Calendar.DATE;
						dateSpan = circleNumber;
					}
					beginCalendar.add(dateType, dateSpan);
				}
			}
			if(null != beginCalendar){
				StringBuffer beginSB = new StringBuffer();
				StringBuffer endSB = new StringBuffer();
				
				String beginStr = dateFormat.format(currentBeginDate);
				String endStr = dateFormat.format(beginCalendar.getTime());
				
				System.out.println(beginStr);
				System.out.println(endStr);
				
				beginSB.append(beginStr).append(StringConstants.BLANK_STRING_LENGTH_ONE).append(StringConstants.TIME_FORMAT_ZERO_TIME);
				endSB.append(endStr).append(StringConstants.BLANK_STRING_LENGTH_ONE).append(StringConstants.TIME_FORMAT_ZERO_TIME);
				
				Date begin = timeFormat.parse(beginSB.toString());
				Date end = timeFormat.parse(endSB.toString());
				
				endPointDate = new Date[]{begin , end };
			}
		} catch (ParseException e) {
			e.printStackTrace();
		}
		return endPointDate;
	}
	
	public boolean checkCurrentDateInInterval(Date currentBeginDate, Date[] endPointDate){
		boolean belongFlag = false;
		long currentTime = 0L;
		long beginTime = 0L;
		long endTime = 0L;
		
		if(null != currentBeginDate && endPointDate.length > 0 ){
			currentTime = currentBeginDate.getTime();
			beginTime = endPointDate[0].getTime();
			endTime = endPointDate[1].getTime();
		}
		if(beginTime <= currentTime && currentTime < endTime){
			belongFlag = true;
		}
		return belongFlag;
	}
	
	public Date calculateNextExecuteDate(Date basicDate, int circleNumber, String circleUnit, int currentTimes ){
		Date nextExecuteDate = null;
		Calendar nextCalendar = null;
		if(circleNumber > 0 && !StringUtil.isNull(circleUnit)){
			currentTimes = currentTimes + 1;
			nextCalendar = Calendar.getInstance();
			nextCalendar.setTime(basicDate);
			int dateType = 0;
			int dateSpan = 0;
			if(StringConstants.CIRCLE_UNIT_YEAR.equals(circleUnit)){
				dateType = Calendar.YEAR;
				dateSpan = circleNumber * currentTimes;
			}else if(StringConstants.CIRCLE_UNIT_MONTH.equals(circleUnit)){
				dateType = Calendar.MONTH;
				dateSpan = circleNumber * currentTimes;
			}else if(StringConstants.CIRCLE_UNIT_WEEK.equals(circleUnit)){
				dateType = Calendar.DATE;
				dateSpan = circleNumber * 7 * currentTimes;
			}else if(StringConstants.CIRCLE_UNIT_DAY.equals(circleUnit)){
				dateType = Calendar.DATE;
				dateSpan = circleNumber * currentTimes;
			}
			nextCalendar.add(dateType, dateSpan);
			nextExecuteDate = nextCalendar.getTime();
		}
		return nextExecuteDate;
	}
}
