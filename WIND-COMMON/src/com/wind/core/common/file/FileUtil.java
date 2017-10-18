package com.wind.core.common.file;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;

import com.wind.core.util.string.StringUtil;

public class FileUtil {
	
	public static File createFile(String absolutePath){
		File targetFile = null;
		try {
			if(!StringUtil.isNull(absolutePath)){
				targetFile = new File(absolutePath);
				File parentFile = targetFile.getParentFile();
				if(!parentFile.exists()){
					parentFile.mkdirs();
					parentFile = null;
				}
				targetFile.createNewFile();
			}
		} catch (IOException e) {
			e.printStackTrace();
		}finally{
			return targetFile;
		} 
	}
	
	public static File createFile(String directoryPath, String fileName){
		File targetFile = null;
		File directoryFile = null;
		StringBuffer filePathSB = null;
		try {
			if(!StringUtil.isNull(directoryPath) && !StringUtil.isNull(fileName) ){
				directoryFile = new File(directoryPath);
				if(!directoryFile.exists()){
					directoryFile.mkdirs();
					directoryFile = null;
				}
				filePathSB = new StringBuffer();
				filePathSB.append(directoryPath).append(File.separator).append(fileName);
				targetFile = new File(filePathSB.toString());
				targetFile.createNewFile();
				filePathSB = null;
			}
		} catch (IOException e) {
			e.printStackTrace();
		}finally{
			return targetFile;
		} 
	}
	
	public static boolean deleteFile(String fileName){
		boolean successFlag = false;
		File targetFile = null;
		if(!StringUtil.isNull(fileName)){
			targetFile = new File(fileName);
			if(!targetFile.isDirectory()){
				targetFile.delete();
				targetFile = null;
				successFlag = true;
			}else{
				File[] downLeverFiles = targetFile.listFiles();
				int length = downLeverFiles.length;
				while(length > 0){
					deleteFile(downLeverFiles[--length].getAbsolutePath());
				}
				targetFile.delete();
				successFlag = true;
			}
		}
		return successFlag;
	}
	
	public static void removeFileToDestinationFold(String sourceFilePath, String destinationFoldPath){
		boolean successFlag = false;
		File sourceFile = null;
		if(!StringUtil.isNull(sourceFilePath)){
			sourceFile = new File(sourceFilePath);
			if(!sourceFile.isDirectory()){
				String fileName = sourceFile.getName();
				StringBuffer filePathSB = new StringBuffer();
				filePathSB.append(destinationFoldPath).append(File.separator).append(fileName);
				successFlag = copyOrRemoveFile(sourceFilePath, filePathSB.toString(), false);
			}else{
				String sourceFoldName = sourceFile.getName();
				File[] downLeverFiles = sourceFile.listFiles();
				int length = downLeverFiles.length;
				int index = 0;
				File currentFile = null;
				while(index < length){
					currentFile = downLeverFiles[index];
					StringBuffer filePathSB = new StringBuffer();
					filePathSB.append(destinationFoldPath).append(File.separator).append(sourceFoldName);
					removeFileToDestinationFold(currentFile.getAbsolutePath(), filePathSB.toString());
					++index;
				}
			}
		}
	} 
	
	
	
	public static boolean copyOrRemoveFile(String sourceFilePath, String targetFilePath, boolean isDeleteSourceFile){
		boolean successFlag = false;
		File sourceFile = null;
		File targetFile = null;
		File parentFile = null;
		InputStream sin = null;
		OutputStream sout = null;
		try {
		if(!StringUtil.isNull(sourceFilePath) && !StringUtil.isNull(targetFilePath)){
			sourceFile = new File(sourceFilePath);
			targetFile = new File(targetFilePath);
			parentFile = targetFile.getParentFile();
			
			sin = new FileInputStream(sourceFile);
			if(!parentFile.exists()){
				parentFile.mkdirs();
			}
			if(!targetFile.exists()){
				targetFile.createNewFile();
				sout = new FileOutputStream(targetFile);
			}else{
				sout = new FileOutputStream(targetFile, false);
			}
			int currentLength = 0;
			while((currentLength = sin.read()) != -1){
				sout.write(currentLength);
			}
			if(isDeleteSourceFile){
				sourceFile.delete();
			}
			sourceFile = null;
			targetFile = null;
			parentFile = null;
			sin.close();
			sout.close();
			successFlag = true;
		}
			} catch (Exception e) {
				e.printStackTrace();
			}
		return successFlag;
	}
	
	public static void main(String[] args) {
		
	String sourceFilePath = "E:/GGGGGGGGGGG/AAAAAAA/";
	String targetFilePath = "E:/GGGGGGGGGGG/CCCCCC";
	removeFileToDestinationFold(sourceFilePath, targetFilePath);
		
	}
	
	
}
