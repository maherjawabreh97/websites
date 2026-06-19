export async function onRequest(context) {
  const { request, env } = context;
  
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405, headers: { 'Content-Type': 'application/json' } });
  }

  try {
    const { page, referrer } = await request.json();
    const visitor = {
      page: page || '/',
      referrer: referrer || '',
      ip: request.headers.get('cf-connecting-ip') || request.headers.get('x-forwarded-for') || '',
      userAgent: request.headers.get('user-agent') || '',
      timestamp: new Date().toISOString()
    };

    // Store in KV
    const key = `visit_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    await env.KV.put(key, JSON.stringify(visitor), { expirationTtl: 86400 * 90 });

    // Also maintain a list of recent visits
    const list = await env.KV.get('visits:latest', 'json') || [];
    list.push(visitor);
    if (list.length > 200) list.shift();
    await env.KV.put('visits:latest', JSON.stringify(list), { expirationTtl: 86400 * 90 });

    return new Response(JSON.stringify({ ok: true }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (e) {
    return new Response(JSON.stringify({ ok: true }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  }
}
