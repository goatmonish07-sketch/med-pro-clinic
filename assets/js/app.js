/* MediBill Pro — shared shell + interactions */
(function () {
  'use strict';

  var ICON = {
    dashboard:'<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/>',
    billing:'<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 9h18"/><path d="M8 14h4"/>',
    sales:'<path d="M3 17l6-6 4 4 8-8"/><path d="M21 7v6"/><path d="M15 7h6"/>',
    purchases:'<path d="M4 4h2l2.4 12.5a1 1 0 0 0 1 .8h8.7a1 1 0 0 0 1-.8L21 8H7"/><circle cx="10" cy="20" r="1"/><circle cx="18" cy="20" r="1"/>',
    inventory:'<path d="M3 7l9-4 9 4-9 4-9-4z"/><path d="M3 7v10l9 4 9-4V7"/><path d="M12 11v10"/>',
    expiry:'<circle cx="12" cy="13" r="8"/><path d="M12 9v4l2.5 2"/><path d="M9 2h6"/>',
    returns:'<path d="M3 7v6h6"/><path d="M3 13a9 9 0 1 0 3-7l-3 3"/>',
    suppliers:'<rect x="3" y="4" width="18" height="14" rx="2"/><path d="M3 9h18"/><path d="M8 14h3"/>',
    customers:'<circle cx="9" cy="8" r="3.2"/><path d="M3 20a6 6 0 0 1 12 0"/><path d="M16 5.5a3 3 0 0 1 0 5.5"/><path d="M18 20a6 6 0 0 0-3-5"/>',
    prescriptions:'<path d="M6 3h9l4 4v14H6z"/><path d="M15 3v4h4"/><path d="M9 12h6M9 16h4"/>',
    reports:'<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>',
    settings:'<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.6 1.6 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.6 1.6 0 0 0-2.7 1.1V21a2 2 0 0 1-4 0v-.1A1.6 1.6 0 0 0 6.7 19.4l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1A1.6 1.6 0 0 0 3 13.9H3a2 2 0 0 1 0-4h.1A1.6 1.6 0 0 0 4.6 6.7l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1A1.6 1.6 0 0 0 10 3.6V3a2 2 0 0 1 4 0v.1a1.6 1.6 0 0 0 2.7 1.1l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.6 1.6 0 0 0 1.1 2.7H21a2 2 0 0 1 0 4h-.1a1.6 1.6 0 0 0-1.5 1z"/>',
    logout:'<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="M16 17l5-5-5-5"/><path d="M21 12H9"/>'
  };
  function svg(p){return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">'+p+'</svg>';}

  var NAV = [
    ['MAIN', [
      ['dashboard','Dashboard','dashboard.html'],
      ['billing','Billing / POS','billing.html'],
      ['sales','Sales','sales.html'],
      ['purchases','Purchases','purchases.html']
    ]],
    ['STOCK', [
      ['inventory','Inventory','inventory.html'],
      ['expiry','Expiry Management','expiry.html',7],
      ['returns','Returns','returns.html']
    ]],
    ['DIRECTORY', [
      ['suppliers','Suppliers','suppliers.html'],
      ['customers','Customers','customers.html'],
      ['prescriptions','Prescriptions','prescriptions.html']
    ]],
    ['SYSTEM', [
      ['reports','Reports','reports.html'],
      ['settings','Settings','settings.html']
    ]]
  ];

  // ---- Roles (demo RBAC, simulated client-side) ---------------------
  var ROLES = {
    owner:    { key:'owner',    tag:'Owner View',    name:'Rajesh Kumar',     role:'Owner · Admin',      av:'RK', home:'dashboard.html', allow:null },
    salesman: { key:'salesman', tag:'Salesman View', name:'Divya Ramanathan', role:'Salesman · Counter', av:'DR', home:'billing.html',
                allow:['billing','sales','customers','prescriptions'] }
  };
  function currentRole() {
    var q; try { q = new URLSearchParams(location.search).get('role'); } catch (e) {}
    if (q && ROLES[q]) { try { localStorage.setItem('mb_role', q); } catch (e) {} return ROLES[q]; }
    var r; try { r = localStorage.getItem('mb_role'); } catch (e) {}
    return ROLES[r] || ROLES.owner;
  }
  var PAGE_NAMES = { dashboard:'the Dashboard', inventory:'Inventory', expiry:'Expiry Management', returns:'Returns', purchases:'Purchases', suppliers:'Suppliers', reports:'Reports & Analytics', settings:'Settings' };
  window.MB_ROLE = currentRole();

  function buildSidebar(active, role) {
    var allow = role.allow;
    var h = '';
    h += '<div class="brand"><div class="logo">M+</div><div><div class="b-name">MediBill Pro</div><div class="b-sub">Sri Venkateswara Medicals</div></div></div>';
    h += '<div class="role-chip role-'+role.key+'">'+role.tag+'</div>';
    h += '<div class="branch"><span class="dot"></span><span style="flex:1">Main Branch — T. Nagar</span><span class="chev">'+svg('<path d="M6 9l6 6 6-6"/>')+'</span></div>';
    h += '<nav class="nav">';
    NAV.forEach(function (grp) {
      var items = grp[1].filter(function (it) { return !allow || allow.indexOf(it[0]) !== -1; });
      if (!items.length) return;
      h += '<div class="nav-label">'+grp[0]+'</div>';
      items.forEach(function (it) {
        var isActive = it[0] === active ? ' active' : '';
        var badge = it[3] ? '<span class="badge">'+it[3]+'</span>' : '';
        h += '<a class="'+it[0]+isActive+'" href="'+it[2]+'">'+svg(ICON[it[0]])+'<span>'+it[1]+'</span>'+badge+'</a>';
      });
    });
    h += '</nav>';
    h += '<div class="side-user"><div class="av">'+role.av+'</div><div style="flex:1"><div class="u-name">'+role.name+'</div><div class="u-role">'+role.role+'</div></div><span class="logout" title="Sign out" onclick="location.href=\'login.html\'">'+svg(ICON.logout)+'</span></div>';
    return h;
  }

  function showRestricted(page) {
    var nm = PAGE_NAMES[page] || 'this section';
    var content = document.querySelector('.content');
    if (content) content.innerHTML =
      '<div class="restricted"><div class="lk">'+svg('<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>')+'</div>'
      + '<h2>Restricted area</h2>'
      + '<p>Your account (<b>Billing Staff</b>) doesn’t have permission to open <b>'+nm+'</b>. Cost prices, reports and settings stay visible to the owner / admin only.</p>'
      + '<a class="btn btn-dark" href="billing.html">Go to the Billing counter</a></div>';
    var t = document.querySelector('.tb-title h1'); if (t) t.textContent = 'Restricted';
    var sub = document.querySelector('.tb-title p'); if (sub) sub.textContent = 'Owner / admin access only';
    var cr = document.querySelector('.tb-title .crumb'); if (cr) cr.remove();
    var tr = document.querySelector('.tb-right'); if (tr) tr.innerHTML = '';
  }

  // Expose small icon helper for pages
  window.MB = { svg: svg, icon: ICON };

  document.addEventListener('DOMContentLoaded', function () {
    var mount = document.getElementById('sidebar');
    if (mount) {
      mount.className = 'sidebar';
      var role = window.MB_ROLE || currentRole();
      var page = document.body.getAttribute('data-page');
      mount.innerHTML = buildSidebar(page, role);
      // Enforce the role: block pages this account can't open
      if (role.allow && page && role.allow.indexOf(page) === -1) showRestricted(page);

      // Mobile: hamburger toggle + dismiss backdrop for the sidebar drawer
      var topbar = document.querySelector('.topbar');
      if (topbar) {
        var burger = document.createElement('button');
        burger.className = 'nav-toggle';
        burger.setAttribute('aria-label', 'Open navigation menu');
        burger.innerHTML = svg('<path d="M3 6h18M3 12h18M3 18h18"/>');
        topbar.insertBefore(burger, topbar.firstChild);

        var backdrop = document.createElement('div');
        backdrop.className = 'nav-backdrop';
        backdrop.setAttribute('aria-hidden', 'true');
        document.body.appendChild(backdrop);

        var close = function () { document.body.classList.remove('nav-open'); };
        burger.addEventListener('click', function () { document.body.classList.toggle('nav-open'); });
        backdrop.addEventListener('click', close);
        // Close the drawer when a nav link is tapped or Esc is pressed
        mount.addEventListener('click', function (e) { if (e.target.closest('a')) close(); });
        document.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });
      }
    }

    // Fill any [data-icon] placeholders
    document.querySelectorAll('[data-icon]').forEach(function (el) {
      var name = el.getAttribute('data-icon');
      if (ICON[name]) el.innerHTML = svg(ICON[name]);
    });

    // Qty steppers (Billing)
    document.addEventListener('click', function (e) {
      var step = e.target.closest('[data-step]');
      if (step) {
        var wrap = step.closest('.stepper');
        var val = wrap.querySelector('.qv');
        var n = parseInt(val.textContent, 10) + parseInt(step.getAttribute('data-step'), 10);
        if (n < 1) n = 1;
        val.textContent = n;
      }
      // Segmented controls
      var seg = e.target.closest('.seg button');
      if (seg) {
        seg.parentElement.querySelectorAll('button').forEach(function (b) { b.classList.remove('on'); });
        seg.classList.add('on');
      }
      // Password toggle
      var pt = e.target.closest('[data-toggle-pw]');
      if (pt) {
        var inp = document.getElementById(pt.getAttribute('data-toggle-pw'));
        if (inp) inp.type = inp.type === 'password' ? 'text' : 'password';
      }
    });
  });
})();
