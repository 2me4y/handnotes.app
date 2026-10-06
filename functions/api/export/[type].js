/**
 * Cloudflare Pages Function: /api/export/:type
 * Handles tracking beacons for PDF, PNG, JPG, and Print exports.
 * 
 * Every invocation is automatically logged and counted in:
 * 1. Cloudflare Dashboard -> Analytics & Logs -> Traffic (Filter by Path: /api/export/*)
 * 2. Cloudflare Pages -> Project -> Metrics -> Functions Invocations
 */

export async function onRequest(context) {
  const { request, params } = context;
  const type = params.type || 'unknown';

  // Handle CORS Preflight
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  }

  return new Response(
    JSON.stringify({
      ok: true,
      action: 'track_export',
      format: type,
      timestamp: Date.now(),
    }),
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'no-store, no-cache, must-revalidate',
      },
    }
  );
}
