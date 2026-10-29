/** Stateless documentation demo. No profile is persisted and no external service is called. */
export async function POST(request: Request) {
  const headers = { "Cache-Control": "no-store" };
  try {
    const text = await request.text();
    if (text.length > 4096) {
      return Response.json({ error: "Demo payload too large." }, { status: 413, headers });
    }
    const data: unknown = JSON.parse(text);
    if (!data || typeof data !== "object" || !("name" in data)
      || typeof data.name !== "string" || !data.name.trim() || data.name.length > 120) {
      return Response.json({ error: "Provide a name of 1 to 120 characters." }, { status: 400, headers });
    }
    return Response.json({ accepted: true, name: data.name.trim(), persisted: false }, { headers });
  } catch {
    return Response.json({ error: "Provide a valid JSON payload." }, { status: 400, headers });
  }
}
