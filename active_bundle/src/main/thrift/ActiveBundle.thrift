namespace java edu.purdue.cs.absoa
  
typedef i64 long
typedef i32 int
  
service ABService
{
	string authenticate(1: string str),
	string hello(1:string  str),
}