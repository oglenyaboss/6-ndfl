import { NextApiRequest } from "next";

const dataStore = require("../save-file/route").dataStore;

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const id = body.id;

    console.log("datastore", dataStore);

    console.log("Полученные данные:", body);

    if (dataStore[id]) {
      return Response.json(dataStore[id]);
    } else {
      throw Error;
    }
  } catch (error) {
    console.error("Ошибка при обработке запроса:", error);

    return Response.json({ error: String(error) }, { status: 500 });
  }
}
