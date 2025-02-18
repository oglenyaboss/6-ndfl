import { v4 as uuidv4 } from "uuid";

export const dataStore: { [key: string]: any } = {};

export async function POST(req: Request) {
  try {
    const body = await req.json();

    console.log("Полученные данные:", body);

    const id = uuidv4();

    dataStore[id] = body.xml;

    console.log(id);

    console.log("datastore", dataStore);

    return Response.json(id);
  } catch (error) {
    console.error("Ошибка при обработке запроса:", error);

    return Response.json({ error: String(error) }, { status: 500 });
  }
}
