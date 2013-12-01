package edu.purdue.cs.absoa;

import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.Charset;
import java.nio.charset.StandardCharsets;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Scanner;
import java.net.URL;

public class ABDataParser 
{

	/** Assumes UTF-8 encoding. JDK 7+. */

	//	  public static void main(String... aArgs) throws IOException {
	//	    ABDataParser parser = new ABDataParser("C:\\Temp\\test.txt");
	//	    parser.processLineByLine();
	//	    log("Done.");
	//	  }

	/**
	   Constructor.
	   @param aFileName full name of an existing, readable file.
	 */
	//	  public ABDataParser(String aFileName) {
	//		  
	//		URL url = getClass().getResource(aFileName);
	//	    fFilePath = Paths.get(url.getFile());
	//	    
	//	    System.out.println("URL identified in Parser: " + url);
	//	    System.out.println("Path identified in Parser: " + fFilePath);
	//
	//	    
	//	  }

	public ABDataParser(InputStream aFileName) {

		fFilePath = aFileName;	   
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
			log("Name is : " + quote(name.trim()) + ", and Value is : " + quote(value.trim()));
			ABServiceHandler.setABData(name.trim(), value.trim());

		}
		else {
			log("Empty or invalid line. Unable to process.");
		}
	}

	// PRIVATE 
//	private final Path fFilePath;
	private final InputStream fFilePath;

	private final static Charset ENCODING = StandardCharsets.UTF_8;  

	private static void log(Object aObject){
		System.out.println(String.valueOf(aObject));
	}

	private String quote(String aText){
		String QUOTE = "'";
		return QUOTE + aText + QUOTE;
	}
} 