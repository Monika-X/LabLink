(function () {
    'use strict';

    var KEYS = { bookings: 'lk_bookings', rx: 'lk_prescriptions', user: 'lk_user', settings: 'lk_settings' };
    var DAY = 86400000;

    function store(key, val) { try { localStorage.setItem(key, JSON.stringify(val)); return true; } catch (e) { return false; } }
    function load(key, fallback) { try { var v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; } catch (e) { return fallback; } }

    function uid(prefix) { return prefix + '-' + Math.floor(10000 + Math.random() * 89999); }

    function esc(s) {
        return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
            return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
        });
    }

    function seed() {
        if (localStorage.getItem(KEYS.bookings)) return;
        var base = Date.now();
        var seeded = [
            {
                id: 'LL-89245',
                test: 'Comprehensive Plus Health Check',
                collection: 'Home Collection',
                date: new Date(base - 20 * 3600000).toISOString().slice(0, 10),
                slot: '08:00 AM - 10:00 AM',
                status: 'processing',
                createdAt: base - 20 * 3600000,
                markers: [
                    { name: 'Haemoglobin (Hb)', value: '14.2 g/dL', range: '13.0 - 17.0', flag: 'normal' },
                    { name: 'White Blood Cells', value: '6.8 x10^3/uL', range: '4.0 - 11.0', flag: 'normal' },
                    { name: 'Platelets', value: '245 x10^3/uL', range: '150 - 400', flag: 'normal' },
                    { name: 'Fasting Glucose', value: '88 mg/dL', range: '70 - 99', flag: 'normal' },
                    { name: 'Total Cholesterol', value: '178 mg/dL', range: '< 200', flag: 'normal' },
                    { name: 'HDL Cholesterol', value: '52 mg/dL', range: '> 40', flag: 'normal' },
                    { name: 'LDL Cholesterol', value: '108 mg/dL', range: '< 130', flag: 'normal' },
                    { name: 'Triglycerides', value: '118 mg/dL', range: '< 150', flag: 'normal' },
                    { name: 'TSH', value: '2.1 mIU/L', range: '0.4 - 4.0', flag: 'normal' },
                    { name: 'Vitamin D', value: '28 ng/mL', range: '30 - 100', flag: 'low' }
                ]
            },
            {
                id: 'LL-89201',
                test: 'Vitamin D & B12 Panel',
                collection: 'Home Collection',
                date: new Date(base - 2 * DAY).toISOString().slice(0, 10),
                slot: '10:00 AM - 12:00 PM',
                status: 'ready',
                createdAt: base - 2 * DAY,
                markers: [
                    { name: 'Vitamin D (25-OH)', value: '32 ng/mL', range: '30 - 100', flag: 'normal' },
                    { name: 'Vitamin B12', value: '410 pg/mL', range: '200 - 900', flag: 'normal' },
                    { name: 'Calcium', value: '9.4 mg/dL', range: '8.5 - 10.2', flag: 'normal' }
                ]
            }
        ];
        if (!store(KEYS.bookings, seeded)) return;
        if (!store(KEYS.rx, [])) return;
        if (!store(KEYS.user, {
            first: 'John', last: 'Doe',
            email: 'john.doe@example.com',
            dob: '1985-05-15',
            gender: 'Male',
            phone: '+1 555 013 2481',
            address: '123 Health Ave, Apt 4B, New York, NY 10001'
        })) return;
        store(KEYS.settings, { email: true, sms: true, dark: false, rtl: false });
    }

    var STATUSES = [
        { key: 'confirmed', label: 'Confirmed', cls: 'pending' },
        { key: 'sample-collected', label: 'Sample Collected', cls: 'processing' },
        { key: 'processing', label: 'Processing', cls: 'processing' },
        { key: 'ready', label: 'Report Ready', cls: 'completed' }
    ];

    function statusInfo(key) {
        for (var i = 0; i < STATUSES.length; i++) {
            if (STATUSES[i].key === key) return STATUSES[i];
        }
        return STATUSES[0];
    }

    function nextStatus(key) {
        for (var i = 0; i < STATUSES.length - 1; i++) {
            if (STATUSES[i].key === key) return STATUSES[i + 1].key;
        }
        return null;
    }

    function getBookings() { seed(); return load(KEYS.bookings, []); }
    function saveBookings(list) { return store(KEYS.bookings, list); }
    function getPrescriptions() { seed(); return load(KEYS.rx, []); }
    function savePrescriptions(list) { return store(KEYS.rx, list); }
    function getUser() { seed(); return load(KEYS.user, {}); }
    function saveUser(u) { store(KEYS.user, u); }
    function getSettings() { seed(); return load(KEYS.settings, {}); }
    function saveSettings(s) { store(KEYS.settings, s); }

    function addBooking(data) {
        var list = getBookings();
        var booking = {
            id: uid('LL'),
            test: data.test || 'General Health Panel',
            collection: data.collection || 'Home Collection',
            date: data.date || '',
            slot: data.slot || '08:00 AM - 10:00 AM',
            status: 'confirmed',
            createdAt: Date.now(),
            markers: null
        };
        list.unshift(booking);
        saveBookings(list);
        return booking;
    }

    function advanceBooking(id) {
        var list = getBookings();
        var b = null;
        for (var i = 0; i < list.length; i++) {
            if (list[i].id === id) { b = list[i]; break; }
        }
        if (!b) return null;
        var next = nextStatus(b.status);
        if (!next) return null;
        b.status = next;
        if (next === 'ready' && !b.markers) b.markers = generateMarkers(b.test);
        saveBookings(list);
        return b;
    }

    function generateMarkers(testName) {
        var t = (testName || '').toLowerCase();
        var markers = [
            { name: 'Haemoglobin (Hb)', value: '14.0 g/dL', range: '13.0 - 17.0', flag: 'normal' },
            { name: 'White Blood Cells', value: '7.2 x10^3/uL', range: '4.0 - 11.0', flag: 'normal' },
            { name: 'Fasting Glucose', value: '92 mg/dL', range: '70 - 99', flag: 'normal' }
        ];
        if (t.indexOf('lipid') >= 0 || t.indexOf('cholesterol') >= 0) {
            markers.push({ name: 'Total Cholesterol', value: '182 mg/dL', range: '< 200', flag: 'normal' });
            markers.push({ name: 'LDL Cholesterol', value: '112 mg/dL', range: '< 130', flag: 'normal' });
            markers.push({ name: 'HDL Cholesterol', value: '48 mg/dL', range: '> 40', flag: 'normal' });
        }
        if (t.indexOf('vitamin') >= 0 || t.indexOf('d') >= 0) {
            markers.push({ name: 'Vitamin D (25-OH)', value: '34 ng/mL', range: '30 - 100', flag: 'normal' });
        }
        if (t.indexOf('thyroid') >= 0 || t.indexOf('tsh') >= 0) {
            markers.push({ name: 'TSH', value: '1.9 mIU/L', range: '0.4 - 4.0', flag: 'normal' });
            markers.push({ name: 'T4 (Free)', value: '1.2 ng/dL', range: '0.8 - 1.8', flag: 'normal' });
        }
        if (t.indexOf('blood count') >= 0 || t.indexOf('cbc') >= 0) {
            markers.push({ name: 'Platelets', value: '238 x10^3/uL', range: '150 - 400', flag: 'normal' });
            markers.push({ name: 'Neutrophils', value: '58%', range: '40 - 75', flag: 'normal' });
        }
        return markers;
    }

    function statusPillHtml(key) {
        var info = statusInfo(key);
        return '<span class="status-pill ' + info.cls + '">' + info.label.toUpperCase() + '</span>';
    }

    function fmtDate(iso) {
        if (!iso) return '';
        var d = new Date(iso.length === 10 ? iso + 'T00:00:00' : iso);
        return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }

    function toast(msg, ok) {
        var toast = document.createElement('div');
        toast.className = 'form-toast';
        var icon = ok
            ? '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--medical-emerald)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>'
            : '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--champagne)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>';
        toast.innerHTML = icon + '<span>' + esc(msg) + '</span>';
        document.body.appendChild(toast);
        requestAnimationFrame(function () { toast.classList.add('show'); });
        setTimeout(function () {
            toast.classList.remove('show');
            setTimeout(function () { if (toast.parentNode) toast.parentNode.removeChild(toast); }, 400);
        }, 3500);
    }

    function applyUserToUI() {
        var user = getUser();
        var initials = ((user.first || '')[0] || '') + ((user.last || '')[0] || '');
        var name = ((user.first || '') + ' ' + (user.last || '')).trim() || 'John Doe';
        var apply = function (el) {
            el.textContent = initials || 'JD';
            if (user.avatar) {
                el.style.backgroundImage = 'url(' + user.avatar + ')';
                el.style.backgroundSize = 'cover';
                el.style.backgroundPosition = 'center';
                el.style.color = 'transparent';
                el.textContent = '';
            }
        };
        document.querySelectorAll('.side-user b').forEach(function (el) { el.textContent = name; });
        document.querySelectorAll('.side-avatar').forEach(apply);
        document.querySelectorAll('.topbar .avatar').forEach(apply);
        var ids = document.querySelectorAll('.side-user span');
        ids.forEach(function (el) {
            if (el.textContent.indexOf('ID:') === 0 && user.patientId) el.textContent = 'ID: ' + user.patientId;
        });
    }

    function updateBadges() {
        var bookings = getBookings();
        var pending = 0;
        for (var i = 0; i < bookings.length; i++) {
            if (bookings[i].status !== 'ready') pending++;
        }
        document.querySelectorAll('.nav-badge').forEach(function (el) {
            el.textContent = pending;
            el.style.display = pending ? '' : 'none';
        });
    }

    function downloadReport(booking, person) {
        var user = person || getUser();
        var dateStr = fmtDate(booking.date);
        var markers = (booking.markers || []).map(function (m) {
            var color = m.flag === 'high' ? '#b91c1c' : (m.flag === 'low' ? '#16659b' : '#16866a');
            var flagColor = m.flag === 'normal' ? '#16866a' : '#b91c1c';
            return '<tr>'
                + '<td>' + esc(m.name) + '</td>'
                + '<td>' + esc(m.value) + '</td>'
                + '<td style="color:' + color + '">' + esc(m.range) + '</td>'
                + '<td style="font-weight:700;color:' + flagColor + '">' + esc((m.flag || 'normal').toUpperCase()) + '</td>'
                + '</tr>';
        }).join('');

        var html = '<!DOCTYPE html><html><head><meta charset="utf-8"><title>LabLink Report - ' + esc(booking.test) + '</title>'
            + '<style>'
            + 'body{font-family:Segoe UI,Arial,sans-serif;background:#f4f7f6;margin:0;padding:32px;}'
            + '.sheet{max-width:760px;margin:0 auto;background:#fff;border:1px solid #e2e8f0;border-radius:16px;overflow:hidden;box-shadow:0 12px 40px rgba(7,30,27,.12);}'
            + '.head{background:linear-gradient(135deg,#0f4f46,#16866a);color:#fff;padding:28px 36px;display:flex;justify-content:space-between;align-items:center;}'
            + '.head h1{margin:0;font-size:22px;letter-spacing:.5px;}'
            + '.head span{opacity:.85;font-size:12px;letter-spacing:2px;text-transform:uppercase;}'
            + '.meta{display:flex;justify-content:space-between;gap:16px;flex-wrap:wrap;padding:22px 36px;border-bottom:1px dashed #e2e8f0;font-size:14px;color:#334155;}'
            + '.meta b{color:#0f4f46;display:block;font-size:12px;text-transform:uppercase;letter-spacing:1px;margin-bottom:4px;}'
            + 'table{width:100%;border-collapse:collapse;padding:0 36px;}'
            + 'th{text-align:left;font-size:11px;text-transform:uppercase;letter-spacing:1.5px;color:#64748b;padding:14px 36px;border-bottom:2px solid #e2e8f0;}'
            + 'td{padding:12px 36px;border-bottom:1px solid #eef2f1;font-size:14px;color:#334155;}'
            + 'tr:last-child td{border-bottom:none;}'
            + '.foot{padding:22px 36px 30px;font-size:12px;color:#64748b;line-height:1.7;border-top:1px dashed #e2e8f0;text-align:center;}'
            + '.stamp{display:inline-block;border:2px solid #16866a;color:#16866a;border-radius:8px;padding:4px 14px;font-weight:700;letter-spacing:1px;font-size:11px;text-transform:uppercase;margin-top:8px;}'
            + '</style></head><body>'
            + '<div class="sheet">'
            + '<div class="head"><div><h1>LabLink Premium Diagnostics</h1><span>NABL Accredited Laboratory</span></div><div style="text-align:right;"><b style="font-size:20px;">' + esc(booking.id) + '</b><br><span>Physician Reviewed</span></div></div>'
            + '<div class="meta">'
            + '<div><b>Patient</b>' + esc((user.first || '') + ' ' + (user.last || '')) + '</div>'
            + '<div><b>Test</b>' + esc(booking.test) + '</div>'
            + '<div><b>Collection</b>' + esc(booking.collection) + '</div>'
            + '<div><b>Date</b>' + esc(dateStr) + '</div>'
            + '</div>'
            + '<table><thead><tr><th>Parameter</th><th>Result</th><th>Reference Range</th><th>Flag</th></tr></thead><tbody>'
            + markers
            + '</tbody></table>'
            + '<div class="foot">This report was verified and released electronically by a senior pathologist. Generated by LabLink Patient Portal &mdash; ' + esc(new Date().toLocaleString()) + '<br><span class="stamp">&#10003; Released</span></div>'
            + '</div></body></html>';

        var blob = new Blob([html], { type: 'text/html' });
        var url = URL.createObjectURL(blob);
        var a = document.createElement('a');
        a.href = url;
        a.download = 'LabLink-Report-' + booking.id + '.html';
        document.body.appendChild(a);
        a.click();
        setTimeout(function () { URL.revokeObjectURL(url); if (a.parentNode) a.parentNode.removeChild(a); }, 500);
    }

    function injectStyles() {
        var style = document.createElement('style');
        style.textContent =
            '.status-pill.pending { background: rgba(22,101,155,0.12); color: #16659b; }'
            + '.rx-item { display:flex; align-items:center; gap:14px; padding:14px 16px; border:1px solid var(--border-color); border-radius:14px; background: var(--bg-primary); margin-bottom:12px; }'
            + '.rx-thumb { width:46px; height:46px; min-width:46px; border-radius:10px; overflow:hidden; background: rgba(22,134,106,0.1); display:flex; align-items:center; justify-content:center; color: var(--medical-emerald); }'
            + '.rx-thumb img { width:100%; height:100%; object-fit:cover; display:block; }'
            + '.rx-meta { flex:1; min-width:0; }'
            + '.rx-meta b { display:block; color: var(--text-primary); font-size:0.88rem; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }'
            + '.rx-meta span { font-size:0.72rem; color: var(--text-secondary); }'
            + '.rx-del { border:1px solid var(--border-color); background:none; color:var(--text-secondary); border-radius:8px; padding:6px 10px; cursor:pointer; font-size:0.75rem; font-weight:700; transition:all .2s ease; }'
            + '.rx-del:hover { color:#b91c1c; border-color:rgba(185,28,28,0.4); background:rgba(185,28,28,0.06); }'
            + '.advance-btn { background:var(--soft-aqua); color:var(--medical-emerald); border:1px solid rgba(22,134,106,0.35); border-radius:50px; padding:6px 14px; font-size:0.75rem; font-weight:800; cursor:pointer; letter-spacing:.5px; transition:all .2s ease; }'
            + '.advance-btn:hover { background:var(--medical-emerald); color:var(--pearl); }'
            + '.empty-state { text-align:center; padding:var(--spacing-10); color:var(--text-secondary); font-size:0.9rem; }';
        document.head.appendChild(style);
    }

    window.LK = {
        getBookings: getBookings,
        saveBookings: saveBookings,
        addBooking: addBooking,
        advanceBooking: advanceBooking,
        generateMarkers: generateMarkers,
        getPrescriptions: getPrescriptions,
        savePrescriptions: savePrescriptions,
        getUser: getUser,
        saveUser: saveUser,
        getSettings: getSettings,
        saveSettings: saveSettings,
        statuses: STATUSES,
        nextStatus: nextStatus,
        statusInfo: statusInfo,
        statusPillHtml: statusPillHtml,
        fmtDate: fmtDate,
        toast: toast,
        esc: esc,
        uid: uid,
        downloadReport: downloadReport,
        applyUserToUI: applyUserToUI,
        updateBadges: updateBadges
    };

    document.addEventListener('DOMContentLoaded', function () {
        seed();
        injectStyles();
        applyUserToUI();
        updateBadges();
    });
})();