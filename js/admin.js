(function () {
    'use strict';

    var KEYS = { patients: 'lk_patients', orders: 'lk_orders' };
    var DAY = 86400000;

    function store(key, val) { try { localStorage.setItem(key, JSON.stringify(val)); return true; } catch (e) { return false; } }
    function load(key, fallback) { try { var v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; } catch (e) { return fallback; } }

    function iso(ts) { return new Date(ts).toISOString().slice(0, 10); }

    var STAFF = { name: 'Anika Rao', initials: 'AR', role: 'Lab Administrator', id: 'STF-0091' };

    var DEMO_PATIENTS = [
        { id: 'PT-10241', first: 'Asha', last: 'Kumar', gender: 'Female', age: 34, phone: '+91 98410 44219', email: 'asha.kumar@example.com', address: '12 Lake View Road, Adyar, Chennai 600020', joinedAt: Date.now() - 220 * DAY },
        { id: 'PT-10242', first: 'Rahul', last: 'Menon', gender: 'Male', age: 41, phone: '+91 98847 71305', email: 'rahul.menon@example.com', address: '48 Green Park Street, Anna Nagar, Chennai 600040', joinedAt: Date.now() - 160 * DAY },
        { id: 'PT-10243', first: 'Priya', last: 'Nair', gender: 'Female', age: 29, phone: '+91 90031 58472', email: 'priya.nair@example.com', address: '7B Seaside Enclave, Besant Nagar, Chennai 600090', joinedAt: Date.now() - 95 * DAY },
        { id: 'PT-10244', first: 'Vikram', last: 'Shah', gender: 'Male', age: 52, phone: '+91 99403 20866', email: 'vikram.shah@example.com', address: '221 Lake Shore Residency, Velachery, Chennai 600042', joinedAt: Date.now() - 400 * DAY },
        { id: 'PT-10245', first: 'Sneha', last: 'Iyer', gender: 'Female', age: 38, phone: '+91 98202 91734', email: 'sneha.iyer@example.com', address: '14 Palm Grove Avenue, Thoraipakkam, Chennai 600097', joinedAt: Date.now() - 55 * DAY },
        { id: 'PT-10246', first: 'Arjun', last: 'Patel', gender: 'Male', age: 45, phone: '+91 90940 33281', email: 'arjun.patel@example.com', address: 'C-9 Golden Sands Apartments, ECR, Chennai 600115', joinedAt: Date.now() - 30 * DAY }
    ];

    function seedOrders() {
        var base = Date.now();
        function order(o) {
            o.markers = null;
            return o;
        }
        return [
            order({ id: 'LL-90311', patientId: 'PT-10241', patient: 'Asha Kumar', phone: '+91 98410 44219', test: 'Full Body Master Panel', price: 2999, collection: 'Home Collection', date: iso(base), slot: '08:00 AM - 10:00 AM', status: 'sample-collected', createdAt: base - 5 * 3600000 }),
            order({ id: 'LL-90308', patientId: 'PT-10243', patient: 'Priya Nair', phone: '+91 90031 58472', test: 'Thyroid Function Test', price: 699, collection: 'Walk-in', date: iso(base), slot: '10:00 AM - 12:00 PM', status: 'confirmed', createdAt: base - 9 * 3600000 }),
            order({ id: 'LL-90296', patientId: 'PT-10244', patient: 'Vikram Shah', phone: '+91 99403 20866', test: 'Diabetes Panel (HbA1c)', price: 1299, collection: 'Walk-in', date: iso(base - DAY), slot: '12:00 PM - 02:00 PM', status: 'processing', createdAt: base - DAY - 3 * 3600000 }),
            order({ id: 'LL-90284', patientId: 'PT-10245', patient: 'Sneha Iyer', phone: '+91 98202 91734', test: 'Vitamin D & B12 Panel', price: 1899, collection: 'Home Collection', date: iso(base - DAY), slot: '08:00 AM - 10:00 AM', status: 'processing', createdAt: base - DAY - 20 * 3600000 }),
            order({ id: 'LL-90271', patientId: 'PT-10246', patient: 'Arjun Patel', phone: '+91 90940 33281', test: 'Complete Blood Count (CBC)', price: 449, collection: 'Walk-in', date: iso(base - 2 * DAY), slot: '10:00 AM - 12:00 PM', status: 'ready', markers: [
                { name: 'Haemoglobin (Hb)', value: '13.6 g/dL', range: '13.0 - 17.0', flag: 'normal' },
                { name: 'White Blood Cells', value: '7.4 x10^3/uL', range: '4.0 - 11.0', flag: 'normal' },
                { name: 'Platelets', value: '242 x10^3/uL', range: '150 - 400', flag: 'normal' },
                { name: 'Neutrophils', value: '61%', range: '40 - 75', flag: 'normal' }
            ], createdAt: base - 2 * DAY }),
            order({ id: 'LL-90265', patientId: 'PT-10243', patient: 'Priya Nair', phone: '+91 90031 58472', test: 'Iron Deficiency Panel', price: 649, collection: 'Home Collection', date: iso(base - 2 * DAY), slot: '08:00 AM - 10:00 AM', status: 'ready', markers: window.LK ? window.LK.generateMarkers('Iron Deficiency Panel') : [], createdAt: base - 2 * DAY - 6 * 3600000 }),
            order({ id: 'LL-90252', patientId: 'PT-10242', patient: 'Rahul Menon', phone: '+91 98847 71305', test: 'Liver Function Test (LFT)', price: 799, collection: 'Walk-in', date: iso(base - 3 * DAY), slot: '12:00 PM - 02:00 PM', status: 'ready', markers: window.LK ? window.LK.generateMarkers('Liver Function Test') : [], createdAt: base - 3 * DAY }),
            order({ id: 'LL-90240', patientId: 'PT-10241', patient: 'Asha Kumar', phone: '+91 98410 44219', test: 'Lipid Profile', price: 899, collection: 'Home Collection', date: iso(base - 5 * DAY), slot: '08:00 AM - 10:00 AM', status: 'ready', markers: window.LK ? window.LK.generateMarkers('Lipid Profile') : [], createdAt: base - 5 * DAY }),
            order({ id: 'LL-90233', patientId: 'PT-10244', patient: 'Vikram Shah', phone: '+91 99403 20866', test: 'Kidney Function Test (KFT)', price: 749, collection: 'Walk-in', date: iso(base - 6 * DAY), slot: '10:00 AM - 12:00 PM', status: 'ready', markers: window.LK ? window.LK.generateMarkers('Kidney Function') : [], createdAt: base - 6 * DAY }),
            order({ id: 'LL-90221', patientId: 'PT-10245', patient: 'Sneha Iyer', phone: '+91 98202 91734', test: 'Full Body Master Panel', price: 2999, collection: 'Home Collection', date: iso(base + DAY), slot: '08:00 AM - 10:00 AM', status: 'confirmed', createdAt: base - 2 * 3600000 }),
            order({ id: 'LL-90218', patientId: 'PT-10246', patient: 'Arjun Patel', phone: '+91 90940 33281', test: 'Thyroid Function Test', price: 699, collection: 'Home Collection', date: iso(base + DAY), slot: '10:00 AM - 12:00 PM', status: 'confirmed', createdAt: base - 36 * 3600000 })
        ];
    }

    function seed() {
        if (!localStorage.getItem(KEYS.patients)) store(KEYS.patients, DEMO_PATIENTS);
        if (!localStorage.getItem(KEYS.orders)) store(KEYS.orders, seedOrders());
    }

    function estimatePrice(testName) {
        var t = (testName || '').toLowerCase();
        if (t.indexOf('full body') >= 0 || t.indexOf('master') >= 0 || t.indexOf('comprehensive') >= 0) return 2999;
        if (t.indexOf('corporate') >= 0 || t.indexOf('package') >= 0) return 1499;
        if (t.indexOf('vitamin') >= 0) return 1899;
        if (t.indexOf('diabetes') >= 0 || t.indexOf('hba1c') >= 0) return 1299;
        if (t.indexOf('lipid') >= 0 || t.indexOf('cholesterol') >= 0) return 899;
        if (t.indexOf('liver') >= 0) return 799;
        if (t.indexOf('kidney') >= 0) return 749;
        if (t.indexOf('thyroid') >= 0) return 699;
        if (t.indexOf('iron') >= 0) return 649;
        if (t.indexOf('count') >= 0 || t.indexOf('cbc') >= 0) return 449;
        return 999;
    }

    function getPatients() {
        seed();
        var demo = load(KEYS.patients, []);
        var user = window.LK.getUser();
        var live = {
            id: user.patientId || 'PT-24816',
            first: user.first || 'John', last: user.last || 'Doe',
            gender: user.gender || 'Male',
            age: user.dob ? Math.max(0, new Date().getFullYear() - new Date(user.dob).getFullYear()) : 41,
            phone: user.phone || '', email: user.email || '',
            address: user.address || '', joinedAt: null, live: true
        };
        return [live].concat(demo);
    }

    function findPatient(id) {
        var list = getPatients();
        for (var i = 0; i < list.length; i++) { if (list[i].id === id) return list[i]; }
        return null;
    }

    function liveOrders() {
        var user = window.LK.getUser();
        var name = ((user.first || '') + ' ' + (user.last || '')).trim() || 'John Doe';
        return window.LK.getBookings().map(function (b) {
            var copy = {};
            for (var k in b) copy[k] = b[k];
            copy.patientId = user.patientId || 'PT-24816';
            copy.patient = name;
            copy.phone = user.phone || '';
            copy.price = estimatePrice(b.test);
            copy.source = 'live';
            return copy;
        });
    }

    function getDemoOrders() { seed(); return load(KEYS.orders, []); }
    function saveDemoOrders(list) { return store(KEYS.orders, list); }

    function getOrders() {
        var all = getDemoOrders().concat(liveOrders());
        all.sort(function (a, b) { return (b.createdAt || 0) - (a.createdAt || 0); });
        return all;
    }

    function findOrder(id) {
        var list = getOrders();
        for (var i = 0; i < list.length; i++) { if (list[i].id === id) return list[i]; }
        return null;
    }

    function advanceOrder(id) {
        var updated = null;
        try { updated = window.LK.advanceBooking(id); } catch (e) { updated = null; }
        if (updated) {
            var merged = {}; for (var k in updated) merged[k] = updated[k];
            merged.source = 'live';
            return merged;
        }
        var list = getDemoOrders();
        var b = null, i;
        for (i = 0; i < list.length; i++) { if (list[i].id === id) { b = list[i]; break; } }
        if (!b) return null;
        var next = window.LK.nextStatus(b.status);
        if (!next) return null;
        b.status = next;
        if (next === 'ready' && !b.markers) b.markers = window.LK.generateMarkers(b.test);
        saveDemoOrders(list);
        return b;
    }

    function stats() {
        var orders = getOrders();
        var todayStr = iso(Date.now());
        var monthPrefix = todayStr.slice(0, 7);
        var s = { total: orders.length, todaysRuns: 0, queue: 0, processing: 0, ready: 0, revenue: 0, home: 0, walkin: 0, patients: 0 };
        for (var i = 0; i < orders.length; i++) {
            var o = orders[i];
            if ((o.status === 'confirmed' || o.status === 'sample-collected')) {
                s.queue++;
                if (o.date === todayStr) s.todaysRuns++;
            }
            if (o.status === 'processing') s.processing++;
            if (o.status === 'ready') s.ready++;
            if (o.collection === 'Home Collection') s.home++; else s.walkin++;
            var createdIso = o.createdAt ? iso(o.createdAt) : (o.date || '');
            if (createdIso.slice(0, 7) === monthPrefix && o.status !== 'confirmed') s.revenue += (o.price || 0);
        }
        s.patients = getPatients().length;
        return s;
    }

    function pendingRxCount() {
        var items = window.LK.getPrescriptions();
        var n = 0;
        for (var i = 0; i < items.length; i++) { if (!items[i].reviewed) n++; }
        return n;
    }

    function markRxReviewed(id) {
        var items = window.LK.getPrescriptions();
        var found = false;
        for (var i = 0; i < items.length; i++) {
            if (items[i].id === id) { items[i].reviewed = true; items[i].reviewedAt = Date.now(); found = true; }
        }
        if (found) window.LK.savePrescriptions(items);
        return found;
    }

    function money(n) { return '\u20B9' + Number(n || 0).toLocaleString('en-IN'); }

    function personFromOrder(order) {
        var parts = (order.patient || '').split(' ');
        return { first: parts[0] || '', last: parts.slice(1).join(' ') || '' };
    }

    function refreshBadges() {
        var s = stats();
        document.querySelectorAll('[data-admbadge]').forEach(function (el) {
            var kind = el.getAttribute('data-admbadge');
            var val = kind === 'rx' ? pendingRxCount() : s.queue;
            el.textContent = val;
            el.style.display = val ? '' : 'none';
        });
    }

    window.LKA = {
        STAFF: STAFF,
        getPatients: getPatients,
        findPatient: findPatient,
        getOrders: getOrders,
        getDemoOrders: getDemoOrders,
        saveDemoOrders: saveDemoOrders,
        findOrder: findOrder,
        advanceOrder: advanceOrder,
        stats: stats,
        pendingRxCount: pendingRxCount,
        markRxReviewed: markRxReviewed,
        money: money,
        personFromOrder: personFromOrder,
        estimatePrice: estimatePrice,
        refreshBadges: refreshBadges
    };

    document.addEventListener('DOMContentLoaded', function () {
        seed();
        var initialsEl = document.querySelectorAll('.staff-avatar');
        initialsEl.forEach(function (el) { el.textContent = STAFF.initials; });
        var names = document.querySelectorAll('.side-staff b');
        names.forEach(function (el) { el.textContent = STAFF.name; });
        var roles = document.querySelectorAll('.side-staff .role');
        roles.forEach(function (el) { el.textContent = STAFF.role; });
        var avatars = document.querySelectorAll('.adm-avatar');
        avatars.forEach(function (el) { el.textContent = STAFF.initials; });
        var dateChip = document.getElementById('top-date');
        if (dateChip) dateChip.textContent = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
        refreshBadges();
    });
})();
