export async function onRequest(context) {
  const { request, env } = context;
  
  // Auth check
  const auth = request.headers.get('Authorization');
  if (!auth || !checkAuth(auth)) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
  }

  const visitors = await env.KV.get('visits:latest', 'json') || [];
  return new Response(JSON.stringify(visitors.slice().reverse()), {
    status: 200, headers: { 'Content-Type': 'application/json' }
  });
}

function checkAuth(authHeader) {
  try {
    const base64 = authHeader.split(' ')[1] || '';
    const decoded = atob(base64);
    const [user, pass] = decoded.split(':');
    return user === 'admin' && pass === 'musamim2024';
  } catch { return false; }
}
