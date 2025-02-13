import { correctTax } from "@/utils/functionsBackend";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("Полученные данные:", body);
    const result = await correctTax(body.xml);

    return Response.json(result);
  } catch (error) {
    console.error("Ошибка при обработке запроса:", error);

    return Response.json({ error: String(error) }, { status: 500 });
  }
}
