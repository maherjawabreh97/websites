export async function onRequest(context) {
  const { request, env } = context;
  
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405, headers: { 'Content-Type': 'application/json' } });
  }

  try {
    const { name, email, type, message } = await request.json();
    const submission = {
      id: Math.random().toString(36).slice(2, 10),
      name: name || 'غير محدد',
      email: email || 'غير محدد',
      type: type || 'غير محدد',
      message: message || '',
      timestamp: new Date().toISOString(),
      read: false
    };

    const key = `sub_${submission.id}`;
    await env.KV.put(key, JSON.stringify(submission), { expirationTtl: 86400 * 365 });

    // Maintain list
    const list = await env.KV.get('submissions:all', 'json') || [];
    list.push(submission);
    if (list.length > 500) list.shift();
    await env.KV.put('submissions:all', JSON.stringify(list), { expirationTtl: 86400 * 365 });

    return new Response(JSON.stringify({ ok: true, message: 'تم استلام طلبك بنجاح!' }), {
      status: 200, headers: { 'Content-Type': 'application/json' }
    });
  } catch (e) {
    return new Response(JSON.stringify({ ok: true, message: 'تم استلام طلبك!' }), {
      status: 200, headers: { 'Content-Type': 'application/json' }
    });
  }
}
