package edu.purdue.cs.absoa;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.util.Enumeration;
import java.util.zip.ZipEntry;
import java.util.zip.ZipFile;
import java.util.zip.ZipInputStream;
import java.util.zip.ZipOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.OutputStream;
import java.io.Reader;

public class JarManager {

	// 4MB buffer
	private static final byte[] BUFFER = new byte[4096 * 1024];

	/**
	 * copy input to output stream - available in several StreamUtils or Streams classes 
	 */    
	public static void copy(InputStream input, OutputStream output) throws IOException {
		int bytesRead;
		while ((bytesRead = input.read(BUFFER))!= -1) {
			output.write(BUFFER, 0, bytesRead);
		}
	}

	public static void main(String[] args) throws Exception {
		// read archive and write to archive new
		ZipFile war = new ZipFile("AB.jar");
		ZipOutputStream append = new ZipOutputStream(new FileOutputStream("ABNew.jar"));

		// first, copy contents from existing war
		Enumeration<? extends ZipEntry> entries = war.entries();
		while (entries.hasMoreElements()) {
			ZipEntry e = entries.nextElement();
			System.out.println("copy: " + e.getName());

			if(e.getName().equals("data.txt")) {
				// now append some extra content
				ZipEntry f = new ZipEntry("data.txt");
				System.out.println("append: " + f.getName());
				append.putNextEntry(f);
				append.write("ab.user.name = AB Owner\n".getBytes());
				append.write("ab.user.zip = 47906\n".getBytes());
				append.write("ab.user.data = AB sensitive data\n".getBytes());
			} else {            
				append.putNextEntry(e);
			}
			if (!e.isDirectory()) {
				copy(war.getInputStream(e), append);
			}
			append.closeEntry();
		}       

		// close
		war.close();
		append.close();        
	}    

}
