export async function GET(req: Request): Promise<Response> {
  return Response.json({ message: "Hello World" });
}
