export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const maxDuration = 30;

export async function GET(request: Request): Promise<Response> {
  const respond = (status: number) => Response.json(
    { ok: status === 200 },
    { status, headers: { "Cache-Control": "no-store" } },
  );
  const secret = process.env.CRON_SECRET?.trim();
  if (!secret) return respond(503);
  if (request.headers.get("authorization") !== `Bearer ${secret}`) return respond(401);

  const url = process.env.SUPABASE_URL?.trim();
  const key = process.env.SUPABASE_SECRET_KEY?.trim();
  if (!url || !key) return respond(503);

  try {
    const endpoint = new URL("/rest/v1/tools?select=id&limit=1", url);
    if (endpoint.protocol !== "https:") return respond(503);
    const response = await fetch(endpoint, {
      headers: { apikey: key, Authorization: `Bearer ${key}` },
      cache: "no-store",
      signal: AbortSignal.timeout(15_000),
    });
    if (!response.ok) return respond(502);
    const rows: unknown = await response.json();
    return respond(Array.isArray(rows) ? 200 : 502);
  } catch {
    return respond(502);
  }
}
