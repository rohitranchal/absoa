namespace java edu.purdue.cs.absoa
  
typedef i64 long
typedef i32 int
  
service ABService
{
	string authenticateChallenge(),
	string authenticateResponse(1:string token, 2:string signedChallenge, 3:string certificate),
	string getValue(1:string certificate, 2:string sessionID, 3:string key),
}