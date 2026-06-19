export async function onRequest(context) {
  const { request, env } = context;
  
  const auth = request.headers.get('Authorization');
  if (!auth || !checkAuth(auth)) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
  }

  const visitors = await env.KV.get('visits:latest', 'json') || [];
  const submissions = await env.KV.get('submissions:all', 'json') || [];

  const today = new Date().toISOString().split('T')[0];
  const todayVisits = visitors.filter(v => v.timestamp && v.timestamp.startsWith(today)).length;
  const uniqueIPs = new Set(visitors.map(v => v.ip)).size;
  const unread = submissions.filter(s => !s.read).length;
  const pages = {};
  visitors.forEach(v => { if (v.page) pages[v.page] = (pages[v.page] || 0) + 1; });

  return new Response(JSON.stringify({
    totalVisits: visitors.length,
    todayVisits,
    uniqueVisitors: uniqueIPs,
    totalSubmissions: submissions.length,
    unreadSubmissions: unread,
    topPages: Object.entries(pages).sort((a, b) => b[1] - a[1]).slice(0, 10)
  }), { status: 200, headers: { 'Content-Type': 'application/json' } });
}

function checkAuth(authHeader) {
  try {
    const base64 = authHeader.split(' ')[1] || '';
    const decoded = atob(base64);
    const [user, pass] = decoded.split(':');
    return user === 'admin' && pass === 'musamim2024';
  } catch { return false; }
}
