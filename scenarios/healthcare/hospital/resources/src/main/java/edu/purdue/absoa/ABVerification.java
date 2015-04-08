package edu.purdue.absoa;

public class ABVerification {
	
	private static ABAuthentication au;
	private static ABAuthorization az;
	
	public ABVerification() {
		au = new ABAuthentication();
		az = new ABAuthorization();
	}
	
	public boolean verify(String request, byte[] signature, byte[] certificate) {
		if (ABServiceHandler.getABData(request) != null) {
			if (au.authenticate(request, signature, certificate)) {
				ABIntegrity.checkIntegrity("edu.purdue.absoa.ABAuthentication", "class");
				if (az.authorize(request, certificate)) {
					ABIntegrity.checkIntegrity("edu.purdue.absoa.ABAuthorization", "class");
					return true;
				} else {
					System.out.println("ABServer authorization failed");
				}				
			} else {
				System.out.println("ABServer authentication failed deccert: " + certificate);
			}    		
		} else {
			System.out.println("ABServer validation failed req: " + request);
		}
		return false;
	}	
}
