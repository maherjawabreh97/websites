export async function onRequest(context) {
  const { request, env, params } = context;
  
  const auth = request.headers.get('Authorization');
  if (!auth || !checkAuth(auth)) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
  }

  const { id } = params;

  if (request.method === 'POST') {
    // Mark as read
    const list = await env.KV.get('submissions:all', 'json') || [];
    const idx = list.findIndex(s => s.id === id);
    if (idx !== -1) {
      list[idx].read = true;
      await env.KV.put('submissions:all', JSON.stringify(list), { expirationTtl: 86400 * 365 });
    }
    return new Response(JSON.stringify({ ok: true }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  }

  if (request.method === 'DELETE') {
    // Delete
    let list = await env.KV.get('submissions:all', 'json') || [];
    list = list.filter(s => s.id !== id);
    await env.KV.put('submissions:all', JSON.stringify(list), { expirationTtl: 86400 * 365 });
    await env.KV.delete(`sub_${id}`);
    return new Response(JSON.stringify({ ok: true }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  }

  return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405, headers: { 'Content-Type': 'application/json' } });
}

function checkAuth(authHeader) {
  try {
    const base64 = authHeader.split(' ')[1] || '';
    const decoded = atob(base64);
    const [user, pass] = decoded.split(':');
    return user === 'admin' && pass === 'musamim2024';
  } catch { return false; }
}
