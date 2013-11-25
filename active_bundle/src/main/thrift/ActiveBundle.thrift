namespace java edu.purdue.cs.absoa
  
typedef i64 long
typedef i32 int

struct ABObject 
{
	1: string sessionID;
    2: string sessionKey; 
}
  
service ABService
{
	string authenticateChallenge(),
	ABObject authenticateResponse(1:string challenge, 2:string signedChallenge, 3:string certificate),
	string getValue(1:string sessionKey, 2:string dataKey),
}