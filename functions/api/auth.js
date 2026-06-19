export async function onRequest(context) {
  const { request } = context;
  
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405, headers: { 'Content-Type': 'application/json' } });
  }

  try {
    const { user, pass } = await request.json();
    if (user === 'admin' && pass === 'musamim2024') {
      const token = btoa('admin:musamim2024');
      return new Response(JSON.stringify({ ok: true, token }), {
        status: 200, headers: { 'Content-Type': 'application/json' }
      });
    }
  } catch (e) {}

  return new Response(JSON.stringify({ error: 'بيانات الدخول غير صحيحة' }), {
    status: 401, headers: { 'Content-Type': 'application/json' }
  });
}
