package edu.purdue.cs.absoa;

import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.Charset;
import java.nio.charset.StandardCharsets;
import java.util.Scanner;

public class ABDataParser 
{
	private final InputStream fFilePath;
	private final static Charset ENCODING = StandardCharsets.UTF_8;  
	private static String dataType; // = "data" or = "sla"

	public ABDataParser(InputStream aFileName, String dType) 
	{
		fFilePath = aFileName;
		dataType = dType;
	}

	/** Template method that calls {@link #processLine(String)}.  */
	public final void processLineByLine() throws IOException {
		try (Scanner scanner =  new Scanner(fFilePath, ENCODING.name())){
			while (scanner.hasNextLine()){
				processLine(scanner.nextLine());
			}      
		}
	}

	protected void processLine(String aLine) {
		//use a second Scanner to parse the content of each line 
		Scanner scanner = new Scanner(aLine);
		scanner.useDelimiter("=");
		if (scanner.hasNext()){
			//assumes the line has a certain structure
			String name = scanner.next();
			String value = scanner.next();
			//log("Name is : " + quote(name.trim()) + ", and Value is : " + quote(value.trim()));
			if(dataType.equals("data")) {
				ABServiceHandler.setABData(name.trim(), value.trim());
			} else if(dataType.equals("sla")) {
				ABServiceHandler.setABSLA(name.trim(), value.trim());
			}
		}
		else {
			log("Empty or invalid line. Unable to process.");
		}
		scanner.close();
	}

	private static void log(Object aObject){
		System.out.println(String.valueOf(aObject));
	}
} 