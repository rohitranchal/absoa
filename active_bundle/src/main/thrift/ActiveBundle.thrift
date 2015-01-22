namespace java edu.purdue.cs.absoa
  
typedef i64 long
typedef i32 int

struct ABObject 
{
	1: string sessionID;
    2: string sessionKey; 
}

struct ABSLA 
{
	1: int activeTime; // Time in secs
	2: string expirationTime; // Format should be yyyy.MM.dd.HH:mm:ss
	3: int numRequests;    
}
  
service ABService
{
	string authenticateChallenge(),
	ABObject authenticateResponse(1:string challenge, 2:string signedChallenge, 3:string certificate),
	string getValue(1:string sessionKey, 2:string dataKey),
	ABSLA getSLA()	
}