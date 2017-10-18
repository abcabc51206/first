package com.wind.core.util.collections;

import java.util.ArrayList;
import java.util.List;


public class CollectionsUtil {
	
	//split list to some package
	public static  List<List<Object>> splitList (List<Object>  list,int packageSize){
		int listSize = list.size(); 
        int page = (listSize + (packageSize - 1)) / packageSize;
        List<List<Object>> listArray = new ArrayList<List<Object>>();
        for (int i = 0; i < page; i++) {
            List<Object> subList = new ArrayList<Object>(); 
            for (int j = 0; j < listSize; j++) { 
                int pageIndex = ((j + 1) + (packageSize - 1)) / packageSize;
                if (pageIndex == (i + 1)) {  
                    subList.add(list.get(j));   
                }  
                if ((j + 1) == ((i + 1) * packageSize)) {  
                    break;  
                }  
            }  
            listArray.add(subList);
        }  
        return listArray;  
	}
	
}