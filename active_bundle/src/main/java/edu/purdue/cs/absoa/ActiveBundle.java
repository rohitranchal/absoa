package edu.purdue.cs.absoa;

import java.util.UUID;

public class ActiveBundle {
	
	public static void main(String[] args) {
		
		ActiveBundle obj = new ActiveBundle();
		System.out.println("Unique ID : " + obj.generateUniqueKey());
	
	}
	
	public String generateUniqueKey(){
		 
    	String id = UUID.randomUUID().toString();
    	return id;
    	
    }

}
