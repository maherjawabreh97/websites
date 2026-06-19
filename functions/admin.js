export async function onRequest(context) {
  const html = `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>لوحة التحكم - مصمم</title>
  <link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800&display=swap" rel="stylesheet">
  <style>
    *{margin:0;padding:0;box-sizing:border-box}
    body{font-family:'Tajawal',sans-serif;background:#f0f2f5;color:#1a1a2e;direction:rtl}
    .login-screen{min-height:100vh;display:flex;align-items:center;justify-content:center;background:linear-gradient(135deg,#1a1a2e,#0f0f1a)}
    .login-box{background:#fff;padding:3rem;border-radius:16px;box-shadow:0 20px 60px rgba(0,0,0,.3);width:380px;max-width:90%;text-align:center}
    .login-box h2{font-size:1.3rem;margin-bottom:.3rem}
    .login-box p{color:#6c757d;font-size:.9rem;margin-bottom:1.5rem}
    .login-box input{width:100%;padding:.9rem 1rem;border:2px solid #e9ecef;border-radius:8px;font-family:inherit;font-size:.95rem;margin-bottom:.8rem;outline:none;transition:.3s}
    .login-box input:focus{border-color:#6C63FF}
    .login-box button{width:100%;padding:.9rem;background:#6C63FF;color:#fff;border:none;border-radius:8px;font-family:inherit;font-size:1rem;font-weight:700;cursor:pointer;transition:.3s}
    .login-box button:hover{background:#5A52E0}
    .login-error{color:#FF6584;font-size:.85rem;margin-top:.5rem;display:none}
    .dashboard{display:none}
    .dashboard.active{display:block}
    .topbar{background:#fff;padding:1rem 2rem;display:flex;justify-content:space-between;align-items:center;box-shadow:0 2px 10px rgba(0,0,0,.05)}
    .topbar h2{font-size:1.1rem}
    .topbar .logout{background:none;border:1px solid #e9ecef;padding:.4rem 1rem;border-radius:8px;font-family:inherit;cursor:pointer;font-size:.85rem;transition:.3s}
    .topbar .logout:hover{background:#FF6584;color:#fff;border-color:#FF6584}
    .content{padding:2rem;max-width:1200px;margin:0 auto}
    .stats-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:1rem;margin-bottom:2rem}
    .stat-card{background:#fff;padding:1.5rem;border-radius:12px;box-shadow:0 2px 15px rgba(0,0,0,.04)}
    .stat-card h3{font-size:1.8rem;color:#6C63FF;font-weight:800}
    .stat-card p{color:#6c757d;font-size:.85rem}
    .stat-card .sub{font-size:.75rem;color:#adb5bd;margin-top:.3rem}
    .section-card{background:#fff;border-radius:12px;box-shadow:0 2px 15px rgba(0,0,0,.04);margin-bottom:1.5rem;overflow:hidden}
    .section-card .header{padding:1.2rem 1.5rem;border-bottom:1px solid #f0f2f5;display:flex;justify-content:space-between;align-items:center}
    .section-card .header h3{font-size:1rem}
    .section-card .header .badge{background:#FF6584;color:#fff;padding:.15rem .6rem;border-radius:50px;font-size:.75rem}
    .table-wrap{overflow-x:auto}
    table{width:100%;border-collapse:collapse;font-size:.9rem}
    th{text-align:right;padding:.8rem 1.2rem;background:#f8f9fe;font-weight:600;font-size:.8rem;color:#6c757d}
    td{padding:.8rem 1.2rem;border-top:1px solid #f0f2f5}
    td .msg{max-width:250px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
    tr.unread{background:#f0eeff}
    tr.unread td{font-weight:600}
    .status{font-size:.75rem;padding:.2rem .6rem;border-radius:50px}
    .status.new{background:#FF6584;color:#fff}
    .status.read{background:#e9ecef;color:#6c757d}
    .btn-sm{padding:.3rem .8rem;border:none;border-radius:6px;font-family:inherit;font-size:.75rem;cursor:pointer;transition:.3s}
    .btn-sm.del{background:#fee;color:#c00}
    .btn-sm.del:hover{background:#c00;color:#fff}
    .btn-sm.view{background:#e8eaff;color:#6C63FF}
    .btn-sm.view:hover{background:#6C63FF;color:#fff}
    .empty{text-align:center;padding:3rem;color:#adb5bd;font-size:.9rem}
    .toast{position:fixed;bottom:2rem;left:50%;transform:translateX(-50%);background:#1a1a2e;color:#fff;padding:.8rem 2rem;border-radius:50px;font-size:.9rem;opacity:0;transition:.3s;pointer-events:none}
    .toast.show{opacity:1}
    .refresh-bar{display:flex;justify-content:space-between;align-items:center;margin-bottom:1rem}
    .refresh-bar .btn-refresh{background:#6C63FF;color:#fff;border:none;padding:.5rem 1.2rem;border-radius:8px;font-family:inherit;cursor:pointer;font-size:.85rem}
    .refresh-bar .btn-refresh:hover{background:#5A52E0}
    @media(max-width:600px){.content{padding:1rem}.stats-grid{grid-template-columns:1fr 1fr}}
  </style>
</head>
<body>
  <div class="login-screen" id="loginScreen">
    <div class="login-box">
      <img src="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='100' height='100' rx='12' fill='%236C63FF'/><text x='50' y='68' text-anchor='middle' fill='white' font-size='40' font-weight='bold'>م</text></svg>" alt="شعار" style="height:50px;margin-bottom:1rem;border-radius:10px;">
      <h2>لوحة التحكم</h2>
      <p>يدخل فقط صاحب الموقع</p>
      <input type="text" id="loginUser" placeholder="اسم المستخدم" value="admin">
      <input type="password" id="loginPass" placeholder="كلمة المرور">
      <button onclick="login()">دخول</button>
      <div class="login-error" id="loginError">بيانات الدخول غير صحيحة</div>
    </div>
  </div>
  <div class="dashboard" id="dashboard">
    <div class="topbar">
      <h2>📊 لوحة التحكم</h2>
      <button class="logout" onclick="logout()">تسجيل خروج</button>
    </div>
    <div class="content">
      <div class="refresh-bar">
        <button class="btn-refresh" onclick="loadData()">🔄 تحديث</button>
        <span id="lastUpdate">...</span>
      </div>
      <div class="stats-grid">
        <div class="stat-card"><h3 id="statToday">0</h3><p>زوار اليوم</p></div>
        <div class="stat-card"><h3 id="statTotal">0</h3><p>إجمالي الزوار</p></div>
        <div class="stat-card"><h3 id="statUnique">0</h3><p>زوار فريدون</p></div>
        <div class="stat-card"><h3 id="statMsgs">0</h3><p>رسائل واردة</p><div class="sub" id="statUnread"></div></div>
      </div>
      <div class="section-card">
        <div class="header"><h3>📩 طلبات التواصل</h3><span class="badge" id="unreadBadge">0</span></div>
        <div class="table-wrap">
          <table><thead><tr><th>الحالة</th><th>الاسم</th><th>البريد</th><th>نوع الموقع</th><th>الرسالة</th><th>التاريخ</th><th></th></tr></thead><tbody id="submissionsBody"><tr><td colspan="7" class="empty">لا توجد رسائل بعد</td></tr></tbody></table>
        </div>
      </div>
      <div class="section-card">
        <div class="header"><h3>👁️ آخر الزوار</h3></div>
        <div class="table-wrap">
          <table><thead><tr><th>الصفحة</th><th>الجهاز</th><th>الوقت</th></tr></thead><tbody id="visitorsBody"><tr><td colspan="3" class="empty">لا زوار بعد</td></tr></tbody></table>
        </div>
      </div>
    </div>
  </div>
  <div class="toast" id="toast"></div>
  <script>
    let token = localStorage.getItem('adminToken');
    function login() {
      const user = document.getElementById('loginUser').value;
      const pass = document.getElementById('loginPass').value;
      fetch('/api/auth', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({user,pass}) })
      .then(r=>r.json()).then(data=>{
        if(data.ok){ token=data.token; localStorage.setItem('adminToken',token);
          document.getElementById('loginScreen').style.display='none';
          document.getElementById('dashboard').classList.add('active'); loadData(); setInterval(loadData,30000);
        } else { document.getElementById('loginError').style.display='block'; }
      }).catch(()=>{ document.getElementById('loginError').style.display='block'; });
    }
    function logout(){ token=null; localStorage.removeItem('adminToken');
      document.getElementById('dashboard').classList.remove('active');
      document.getElementById('loginScreen').style.display='flex'; }
    function showToast(m){ const t=document.getElementById('toast'); t.textContent=m; t.classList.add('show'); setTimeout(()=>t.classList.remove('show'),2000); }
    function loadData(){
      if(!token) return; const h={'Authorization':'Basic '+token};
      fetch('/api/stats',{headers:h}).then(r=>r.json()).then(s=>{
        document.getElementById('statToday').textContent=s.todayVisits;
        document.getElementById('statTotal').textContent=s.totalVisits;
        document.getElementById('statUnique').textContent=s.uniqueVisitors;
        document.getElementById('statMsgs').textContent=s.totalSubmissions;
        document.getElementById('statUnread').textContent=s.unreadSubmissions>0?(s.unreadSubmissions+' غير مقروءة'):'';
        document.getElementById('unreadBadge').textContent=s.unreadSubmissions; });
      fetch('/api/submissions',{headers:h}).then(r=>r.json()).then(s=>{
        const b=document.getElementById('submissionsBody');
        if(!s.length){ b.innerHTML='<tr><td colspan="7" class="empty">لا توجد رسائل بعد</td></tr>'; return; }
        b.innerHTML=s.map(x=>{
          const d=new Date(x.timestamp).toLocaleString('ar-SA');
          return '<tr class="'+(x.read?'':'unread')+'" data-id="'+x.id+'"><td>'+(x.read?'<span class="status read">مقروءة</span>':'<span class="status new">جديدة</span>')+'</td><td>'+x.name+'</td><td>'+x.email+'</td><td>'+x.type+'</td><td><div class="msg" title="'+x.message+'">'+(x.message||'-')+'</div></td><td style="font-size:.8rem;color:#6c757d;">'+d+'</td><td><button class="btn-sm view" onclick="markRead(\''+x.id+'\')"'+(x.read?' disabled style="opacity:.4"':'')+'>✓</button> <button class="btn-sm del" onclick="deleteSub(\''+x.id+'\')">✕</button></td></tr>';
        }).join(''); });
      fetch('/api/visitors',{headers:h}).then(r=>r.json()).then(v=>{
        const b=document.getElementById('visitorsBody');
        if(!v.length){ b.innerHTML='<tr><td colspan="3" class="empty">لا زوار بعد</td></tr>'; return; }
        b.innerHTML=v.slice(0,30).map(x=>{
          const d=new Date(x.timestamp).toLocaleString('ar-SA');
          const p=x.page||'/'; const dev=(x.userAgent||'').includes('Mobile')?'📱 جوال':'💻 كمبيوتر';
          return '<tr><td>'+p+'</td><td>'+dev+'</td><td style="font-size:.8rem;color:#6c757d;">'+d+'</td></tr>';
        }).join(''); });
      document.getElementById('lastUpdate').textContent='آخر تحديث: '+new Date().toLocaleString('ar-SA');
    }
    function markRead(id){
      if(!token) return;
      fetch('/api/submissions/'+id+'/read',{method:'POST',headers:{'Authorization':'Basic '+token}}).then(r=>r.json()).then(()=>{loadData();showToast('تم التأشير كمقروءة');});
    }
    function deleteSub(id){
      if(!token||!confirm('حذف هذه الرسالة؟')) return;
      fetch('/api/submissions/'+id,{method:'DELETE',headers:{'Authorization':'Basic '+token}}).then(r=>r.json()).then(()=>{loadData();showToast('تم الحذف');});
    }
    if(token){ document.getElementById('loginScreen').style.display='none';
      document.getElementById('dashboard').classList.add('active'); loadData(); setInterval(loadData,30000); }
  </script>
</body>
</html>`;

  return new Response(html, {
    status: 200,
    headers: { 'Content-Type': 'text/html; charset=utf-8' }
  });
}
