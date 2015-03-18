namespace java edu.purdue.cs.absoa

typedef i64 long
typedef i32 int

struct ABSLA
{
	1: int activeTime; // Time in secs
	2: string expirationTime; // Format should be yyyy.MM.dd.HH:mm:ss
	3: int numRequests;
}

service ABService
{
	string authenticateChallenge(),
	string getValue(1:string sessionKey, 2:string dataKey),
	ABSLA getSLA()
}