package edu.purdue.absoa;

import java.io.InputStream;
import java.nio.charset.Charset;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.Scanner;

public class ABParser 
{
	private final InputStream fFilePath;
	private final static Charset ENCODING = StandardCharsets.UTF_8;
	private static HashMap<String, String> data;

	public ABParser(InputStream aFileName) 
	{
		data = new HashMap<String, String>();
		fFilePath = aFileName;
	}

	public final HashMap<String, String> processLineByLine() {
		try (Scanner scanner =  new Scanner(fFilePath, ENCODING.name())){
			while (scanner.hasNextLine()){
				processLine(scanner.nextLine());
			}
			return data;
		} catch(Exception e) {
			e.printStackTrace();
		}
		return null;
	}

	protected void processLine(String aLine) {
		Scanner scanner = new Scanner(aLine);
		scanner.useDelimiter("=");
		if (scanner.hasNext()) {
			String name = scanner.next();
			String value = scanner.next();			
			data.put(name.trim(), value.trim());
		}
		scanner.close();
	}
} 