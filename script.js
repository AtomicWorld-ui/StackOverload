/* ============================================================
   EMBER — SCRIPT.JS
   Secure Digital Document Management System
   Frontend Prototype v1.0

   NOTE: This is a frontend prototype.
   - Authentication is simulated (NOT secure)
   - Authorization is UI-only (NOT enforced server-side)
   - SHA-256 hashes, blockchain ledger, Aadhaar OTP are all simulated
   - Digital signatures are NOT legally valid
   - Production must move ALL security operations to a verified backend

   Backend integration points are marked with:  // TODO: API
============================================================ */

'use strict';

/* ══════════════════════════════════════════════════════════
   SECTION: LOCAL STORAGE HELPERS
══════════════════════════════════════════════════════════ */
const LS = {
  get: (k, def) => { try { return JSON.parse(localStorage.getItem('ember_' + k)) ?? def; } catch { return def; } },
  set: (k, v)   => { localStorage.setItem('ember_' + k, JSON.stringify(v)); },
  del: (k)       => { localStorage.removeItem('ember_' + k); },
};

/* ══════════════════════════════════════════════════════════
   SECTION: DEMO DATA
══════════════════════════════════════════════════════════ */
const DEMO_USERS = {
  'legal@ember.demo':   { password: 'ember123', role: 'legal_officer', name: 'Officer Sharma',         dept: 'Criminal Investigation' },
  'citizen@ember.demo': { password: 'ember123', role: 'citizen',       name: 'Rajesh Kumar',             dept: 'Public' },
  'lawyer@ember.demo':  { password: 'ember123', role: 'lawyer',        name: 'Advocate Verma',           dept: 'Legal' },
  'police@ember.demo':  { password: 'ember123', role: 'police',        name: 'Officer Mehta',            dept: 'Field Operations' },
  'forensic@ember.demo':{ password: 'ember123', role: 'forensic',      name: 'Dr. Rao',                  dept: 'Forensic Science' },
  'judge@ember.demo':   { password: 'ember123', role: 'judge',         name: 'Hon. Justice Krishnan',    dept: 'District Court' },
};

const ROLE_LABELS = {
  legal_officer: 'Legal Officer',
  citizen:       'Citizen / Complainant',
  lawyer:        'Lawyer',
  police:        'Police Officer',
  investigating: 'Investigating Officer',
  sho:           'Station House Officer',
  forensic:      'Forensic Expert',
  prosecutor:    'Public Prosecutor',
  judge:         'Judge / Court Official',
};

const SIDEBAR_MENUS = {
  legal_officer: [
    { icon: 'fa-home',            label: 'Dashboard',         view: 'dashboard' },
    { icon: 'fa-book',            label: 'Case Book',         view: 'case_book' },
    { icon: 'fa-file-alt',        label: 'Document Register', view: 'doc_register' },
    { icon: 'fa-check-circle',    label: 'Approvals',         view: 'approvals' },
    { icon: 'fa-upload',          label: 'Upload Document',   view: 'upload' },
    { icon: 'fa-history',         label: 'Revision History',  view: 'revision' },
    { icon: 'fa-star',            label: 'Case Reviews',      view: 'reviews' },
    { icon: 'fa-exchange-alt',    label: 'Transfer Case',     view: 'transfer' },
    { icon: 'fa-pen',             label: 'Sign to Approve',   view: 'sign' },
    { icon: 'fa-chart-bar',       label: 'Generate Report',   view: 'report' },
    { icon: 'fa-list-alt',        label: 'Activity Logs',     view: 'logs' },
    { icon: 'fa-bell',            label: 'Notifications',     view: 'notifications', badge: true },
    { icon: 'fa-shield-alt',      label: 'Security Alerts',   view: 'security' },
    { icon: 'fa-link',            label: 'Integrity Ledger',  view: 'ledger' },
    { icon: 'fa-cog',             label: 'Settings',          view: 'settings' },
  ],
  citizen: [
    { icon: 'fa-home',            label: 'Dashboard',         view: 'dashboard' },
    { icon: 'fa-file-alt',        label: 'Document Register', view: 'doc_register' },
    { icon: 'fa-upload',          label: 'Upload Document',   view: 'upload' },
    { icon: 'fa-history',         label: 'Revision History',  view: 'revision' },
    { icon: 'fa-check-circle',    label: 'Approvals',         view: 'approvals' },
    { icon: 'fa-bell',            label: 'Notifications',     view: 'notifications', badge: true },
    { icon: 'fa-list-alt',        label: 'Activity Logs',     view: 'logs' },
    { icon: 'fa-cog',             label: 'Settings',          view: 'settings' },
  ],
  lawyer: [
    { icon: 'fa-home',            label: 'Dashboard',         view: 'dashboard' },
    { icon: 'fa-file-alt',        label: 'Document Register', view: 'doc_register' },
    { icon: 'fa-eye',             label: 'View / Content',    view: 'view_content' },
    { icon: 'fa-brain',           label: 'Analyze / Insights',view: 'analyze' },
    { icon: 'fa-check-circle',    label: 'Approvals',         view: 'approvals' },
    { icon: 'fa-history',         label: 'Revision History',  view: 'revision' },
    { icon: 'fa-list-alt',        label: 'Activity Logs',     view: 'logs' },
    { icon: 'fa-bell',            label: 'Notifications',     view: 'notifications', badge: true },
    { icon: 'fa-cog',             label: 'Settings',          view: 'settings' },
  ],
  police: [
    { icon: 'fa-home',            label: 'Dashboard',         view: 'dashboard' },
    { icon: 'fa-book',            label: 'Case Book',         view: 'case_book' },
    { icon: 'fa-file-alt',        label: 'Document Register', view: 'doc_register' },
    { icon: 'fa-upload',          label: 'Upload Document',   view: 'upload' },
    { icon: 'fa-list-alt',        label: 'Activity Logs',     view: 'logs' },
    { icon: 'fa-bell',            label: 'Notifications',     view: 'notifications', badge: true },
    { icon: 'fa-cog',             label: 'Settings',          view: 'settings' },
  ],
  forensic: [
    { icon: 'fa-home',            label: 'Dashboard',         view: 'dashboard' },
    { icon: 'fa-file-alt',        label: 'Document Register', view: 'doc_register' },
    { icon: 'fa-upload',          label: 'Upload Document',   view: 'upload' },
    { icon: 'fa-list-alt',        label: 'Activity Logs',     view: 'logs' },
    { icon: 'fa-bell',            label: 'Notifications',     view: 'notifications', badge: true },
    { icon: 'fa-cog',             label: 'Settings',          view: 'settings' },
  ],
  judge: [
    { icon: 'fa-home',            label: 'Dashboard',         view: 'dashboard' },
    { icon: 'fa-file-alt',        label: 'Document Register', view: 'doc_register' },
    { icon: 'fa-check-circle',    label: 'Approvals',         view: 'approvals' },
    { icon: 'fa-pen',             label: 'Sign to Approve',   view: 'sign' },
    { icon: 'fa-chart-bar',       label: 'Generate Report',   view: 'report' },
    { icon: 'fa-list-alt',        label: 'Activity Logs',     view: 'logs' },
    { icon: 'fa-bell',            label: 'Notifications',     view: 'notifications', badge: true },
    { icon: 'fa-cog',             label: 'Settings',          view: 'settings' },
  ],
};
// Fallback for roles without specific menu
['investigating','sho','prosecutor'].forEach(r => { SIDEBAR_MENUS[r] = SIDEBAR_MENUS.police; });

/* ── SEED DATA ─────────────────────────────────────────── */
const SEED_CASES = [
  { id:'CASE-2026-000125', name:'Investigation Beta',              caseType:'Investigation', lead:'Officer Sharma', dept:'Criminal Investigation', status:'Active',              priority:'High',     created:'2026-08-28', updated:'2026-09-06', confidentiality:'Restricted',  desc:'Active investigation into coordinated criminal activity. Multiple witnesses identified. Forensic evidence collected from scene. Case is progressing through standard investigation protocol.', officers:['Officer Sharma','Officer Mehta','Dr. Rao'], docs:6, evidence:3 },
  { id:'CASE-2026-000124', name:'Property Dispute',                caseType:'Civil',         lead:'Officer Verma',  dept:'Civil Division',         status:'Under Review',        priority:'Medium',   created:'2026-07-12', updated:'2026-09-05', confidentiality:'Restricted',  desc:'Dispute regarding ownership of commercial property at Sector 14. Documentation of title deeds and transfer records under legal review.',                                                    officers:['Officer Verma','Advocate Verma'],            docs:4, evidence:2 },
  { id:'CASE-2026-000123', name:'Financial Fraud Investigation',   caseType:'Criminal',      lead:'Officer Singh',  dept:'Financial Crimes',       status:'Under Investigation', priority:'Critical', created:'2026-06-03', updated:'2026-09-04', confidentiality:'Confidential', desc:'Large-scale financial fraud involving misappropriation of cooperative bank funds. Digital evidence secured. Multiple suspects identified.',                                                    officers:['Officer Singh','Officer Mehta','Dr. Rao'],   docs:7, evidence:4 },
  { id:'CASE-2026-000122', name:'Legal Compliance Matter',         caseType:'Legal',         lead:'Officer Gupta',  dept:'Legal Affairs',          status:'Pending Court',       priority:'High',     created:'2026-05-18', updated:'2026-09-02', confidentiality:'Restricted',  desc:'Regulatory compliance violation by registered entity. Filed for court hearing. Documentation prepared for prosecution.',                                                                     officers:['Officer Gupta','Advocate Verma'],            docs:5, evidence:1 },
  { id:'CASE-2026-000121', name:'Cybercrime — Data Breach',        caseType:'Criminal',      lead:'Dr. Rao',        dept:'Cyber Cell',             status:'Active',              priority:'High',     created:'2026-03-22', updated:'2026-09-03', confidentiality:'Confidential', desc:'Unauthorized access to government database. IP traces obtained. Investigation ongoing.',                                                                                                          officers:['Dr. Rao','Officer Sharma'],                  docs:3, evidence:5 },
  { id:'CASE-2026-000120', name:'Theft — Commercial District',     caseType:'Criminal',      lead:'Officer Mehta',  dept:'Criminal Investigation', status:'Closed',              priority:'Medium',   created:'2026-01-10', updated:'2026-08-14', confidentiality:'Public',      desc:'Series of thefts in the commercial district. Suspects apprehended. Case concluded with conviction.',                                                                                            officers:['Officer Mehta'],                            docs:4, evidence:6 },
];
const SEED_DOCS = [
  { id:'DOC-2026-001', name:'FIR_000124.pdf',              type:'First Information Report', caseId:'CASE-2026-000124', by:'Officer Sharma', dept:'Criminal Investigation', date:'2026-01-15', ver:'1.0', status:'Approved',      integrity:'Verified',   approval:'Approved', hash:'a3f9c2e1b4d7f8a0c2e1b4d7f8a0c2e1' },
  { id:'DOC-2026-002', name:'Investigation_Report_124.pdf',type:'Investigation Report',     caseId:'CASE-2026-000124', by:'Officer Mehta',  dept:'Criminal Investigation', date:'2026-02-10', ver:'2.1', status:'Under Review',   integrity:'Verified',   approval:'Pending',  hash:'b8e3d1a7c5f2e9b4d1a7c5f2e9b4d1a7' },
  { id:'DOC-2026-003', name:'Witness_Statement_01.pdf',    type:'Witness Statement',        caseId:'CASE-2026-000124', by:'Officer Sharma', dept:'Criminal Investigation', date:'2026-01-20', ver:'1.0', status:'Approved',      integrity:'Verified',   approval:'Approved', hash:'c7d4e2b9a6f3e0c4e2b9a6f3e0c4e2b9' },
  { id:'DOC-2026-004', name:'Forensic_Report_124.pdf',     type:'Forensic Report',          caseId:'CASE-2026-000124', by:'Dr. Rao',        dept:'Forensic Science',       date:'2026-03-05', ver:'1.2', status:'Approved',      integrity:'Verified',   approval:'Approved', hash:'d6e5f3c0b7a4d1e5f3c0b7a4d1e5f3c0' },
  { id:'DOC-2026-005', name:'Charge_Sheet_124.pdf',        type:'Charge Sheet',             caseId:'CASE-2026-000124', by:'Advocate Verma', dept:'Legal',                  date:'2026-04-18', ver:'1.0', status:'Pending',       integrity:'Unverified', approval:'Pending',  hash:'e5f4d2b8c6a3e2f4d2b8c6a3e2f4d2b8' },
  { id:'DOC-2026-006', name:'Judgement_Record_124.pdf',    type:'Judgement Record',         caseId:'CASE-2026-000124', by:'Advocate Verma', dept:'Court',                  date:'2026-05-30', ver:'1.0', status:'Pending',       integrity:'Unverified', approval:'Pending',  hash:'f4e3c1a9d7b5f3e3c1a9d7b5f3e3c1a9' },
  { id:'DOC-2026-007', name:'Bank_Audit_Report.pdf',       type:'Financial Report',         caseId:'CASE-2026-000125', by:'Officer Mehta',  dept:'Financial Crimes',       date:'2026-02-14', ver:'1.0', status:'Under Review',   integrity:'Verified',   approval:'Pending',  hash:'a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4' },
  { id:'DOC-2026-008', name:'Cyber_Trace_Report.pdf',      type:'Technical Report',         caseId:'CASE-2026-000126', by:'Dr. Rao',        dept:'Cyber Cell',             date:'2026-04-02', ver:'1.0', status:'Pending',       integrity:'Unverified', approval:'Pending',  hash:'b2c3d4e5f6a7b2c3d4e5f6a7b2c3d4e5' },
];
const SEED_EVIDENCE = [
  { id:'EVD-2026-000823', type:'Physical', desc:'CCTV footage from Central Market — 16 Jan 2026',             by:'Officer Sharma', date:'2026-01-16', custodian:'Officer Mehta', status:'Active', integrity:'Verified',   location:'Evidence Room A — Locker 12',  caseId:'CASE-2026-000124' },
  { id:'EVD-2026-000824', type:'Forensic', desc:'Fingerprint samples collected from crime scene',             by:'Dr. Rao',        date:'2026-01-17', custodian:'Dr. Rao',        status:'Active', integrity:'Verified',   location:'Forensic Lab — Cabinet 4',     caseId:'CASE-2026-000124' },
  { id:'EVD-2026-000825', type:'Digital',  desc:'Hard drive containing financial records — XYZ Cooperative Bank', by:'Officer Mehta',  date:'2026-02-05', custodian:'Officer Mehta', status:'Active', integrity:'Verified',   location:'Digital Evidence Vault — Slot 3', caseId:'CASE-2026-000125' },
];
const SEED_LOGS = [
  { id:'LOG-001', ts:'2026-09-06 09:12:33', user:'Officer Sharma', role:'Legal Officer',       action:'Document Uploaded',  resource:'FIR_000124.pdf',              caseId:'CASE-2026-000124', result:'Success' },
  { id:'LOG-002', ts:'2026-09-06 09:45:22', user:'Officer Mehta',  role:'Investigating Officer',action:'Evidence Viewed',    resource:'EVD-2026-000823',             caseId:'CASE-2026-000124', result:'Success' },
  { id:'LOG-003', ts:'2026-09-05 14:30:11', user:'Advocate Verma', role:'Lawyer',              action:'Document Viewed',    resource:'Charge_Sheet_124.pdf',        caseId:'CASE-2026-000124', result:'Success' },
  { id:'LOG-004', ts:'2026-09-05 11:22:05', user:'Dr. Rao',        role:'Forensic Expert',     action:'Integrity Verified', resource:'Forensic_Report_124.pdf',     caseId:'CASE-2026-000124', result:'Success' },
  { id:'LOG-005', ts:'2026-09-04 18:45:00', user:'Unknown',        role:'—',                   action:'Failed Login',       resource:'login',                       caseId:'—',               result:'Failure' },
  { id:'LOG-006', ts:'2026-09-04 10:08:55', user:'Officer Sharma', role:'Legal Officer',       action:'Case Approved',      resource:'CASE-2026-000126',            caseId:'CASE-2026-000126', result:'Success' },
  { id:'LOG-007', ts:'2026-09-03 15:33:41', user:'Officer Mehta',  role:'Investigating Officer',action:'Document Modified',  resource:'Investigation_Report_124.pdf',caseId:'CASE-2026-000124', result:'Success' },
];
const SEED_NOTIFICATIONS = [
  { id:'N-001', type:'Approval Requested', msg:'Charge_Sheet_124.pdf requires your approval.',        ts:'2026-09-06 09:00', read:false, severity:'info' },
  { id:'N-002', type:'Document Uploaded',  msg:'New document uploaded to CASE-2026-000126.',          ts:'2026-09-05 15:30', read:false, severity:'info' },
  { id:'N-003', type:'Security Alert',     msg:'Unusual login activity detected on your account.',    ts:'2026-09-04 18:45', read:false, severity:'warning' },
  { id:'N-004', type:'Case Transfer',      msg:'CASE-2026-000125 transferred to Officer Mehta.',     ts:'2026-09-03 11:20', read:true,  severity:'info' },
  { id:'N-005', type:'Review Due',         msg:'Witness_Statement_01.pdf review due 10 Sep 2026.',   ts:'2026-09-02 09:00', read:true,  severity:'warning' },
  { id:'N-006', type:'Signature Required', msg:'Investigation_Report_124.pdf requires your signature.', ts:'2026-09-01 14:00', read:true, severity:'info' },
];
const SEED_ALERTS = [
  { id:'SA-001', type:'Failed Login Attempts',     desc:'5 consecutive failed login attempts from IP 192.168.1.42.',                      severity:'CRITICAL', status:'Under Review', ts:'2026-09-04 18:45:00' },
  { id:'SA-002', type:'Unusual Download Activity', desc:'Unusual document download activity — 23 downloads within 10 minutes.',          severity:'WARNING',  status:'Under Review', ts:'2026-09-03 14:22:00' },
  { id:'SA-003', type:'Permission Change',         desc:'Role permissions updated for user advocate@ember.demo.',                        severity:'NORMAL',   status:'Resolved',     ts:'2026-09-02 10:15:00' },
  { id:'SA-004', type:'Integrity Failure',         desc:'Hash mismatch detected on DOC-2026-007. Manual review required.',               severity:'CRITICAL', status:'Open',         ts:'2026-09-01 08:30:00' },
];
const SEED_REVIEWS = [
  { id:'REV-001', reviewer:'Advocate Verma', role:'Lawyer',        caseId:'CASE-2026-000124', date:'2026-09-01', content:'Documentation is comprehensive. Witness statements are consistent with forensic findings. Recommend proceeding to trial.', status:'Posted' },
  { id:'REV-002', reviewer:'Officer Sharma', role:'Legal Officer',  caseId:'CASE-2026-000124', date:'2026-08-28', content:'Investigation complete. Chain of custody for all evidence is intact. All required documents have been filed.',             status:'Posted' },
  { id:'REV-003', reviewer:'Dr. Rao',        role:'Forensic Expert',caseId:'CASE-2026-000124', date:'2026-08-20', content:'Forensic analysis confirms presence of defendant at crime scene. Fingerprint match: 98.7% confidence.',                   status:'Posted' },
];
const SEED_APPROVALS = [
  { id:'APR-001', docId:'DOC-2026-005', docName:'Charge_Sheet_124.pdf',        caseId:'CASE-2026-000124', requester:'Advocate Verma', date:'2026-09-01', status:'Pending' },
  { id:'APR-002', docId:'DOC-2026-006', docName:'Judgement_Record_124.pdf',    caseId:'CASE-2026-000124', requester:'Advocate Verma', date:'2026-08-30', status:'Pending' },
  { id:'APR-003', docId:'DOC-2026-002', docName:'Investigation_Report_124.pdf',caseId:'CASE-2026-000124', requester:'Officer Mehta',  date:'2026-08-15', status:'Approved' },
  { id:'APR-004', docId:'DOC-2026-007', docName:'Bank_Audit_Report.pdf',       caseId:'CASE-2026-000125', requester:'Officer Mehta',  date:'2026-08-10', status:'Reinvestigation' },
];
const SEED_REVISIONS = [
  { id:'RH-001', doc:'Investigation_Report_124.pdf', ver:'2.1', user:'Officer Mehta', ts:'2026-09-05 11:22', reason:'Updated suspect information and witness account',         hash:'b8e3d1a7c5f2e9b4',  status:'Approved' },
  { id:'RH-002', doc:'Investigation_Report_124.pdf', ver:'2.0', user:'Officer Mehta', ts:'2026-08-20 14:10', reason:'Added new witness statement cross-references',            hash:'c9f4e2b8d6a3c9f4',  status:'Approved' },
  { id:'RH-003', doc:'Investigation_Report_124.pdf', ver:'1.0', user:'Officer Sharma', ts:'2026-02-10 09:00', reason:'Initial report filed',                                  hash:'d0a5f3c9e7b4d0a5',  status:'Approved' },
  { id:'RH-004', doc:'Forensic_Report_124.pdf',      ver:'1.2', user:'Dr. Rao',        ts:'2026-04-15 16:30', reason:'Correction of typographical errors in sample IDs',      hash:'e1b6d4a0f8c5e1b6',  status:'Approved' },
];
const LEDGER_RECORDS = [
  { id:'REC-001', docId:'DOC-2026-001', caseId:'CASE-2026-000124', action:'Document Uploaded',  user:'Officer Sharma', ts:'2026-01-15 09:00', cur:'a3f9c2e1b4d7', prev:'GENESIS',      status:'Verified' },
  { id:'REC-002', docId:'DOC-2026-001', caseId:'CASE-2026-000124', action:'Document Viewed',    user:'Officer Mehta',  ts:'2026-02-01 14:30', cur:'b8e3d1a7c5f2', prev:'a3f9c2e1b4d7', status:'Verified' },
  { id:'REC-003', docId:'DOC-2026-002', caseId:'CASE-2026-000124', action:'Document Modified',  user:'Officer Mehta',  ts:'2026-08-20 14:10', cur:'c9f4e2b8d6a3', prev:'b8e3d1a7c5f2', status:'Verified' },
  { id:'REC-004', docId:'DOC-2026-004', caseId:'CASE-2026-000124', action:'Integrity Verified', user:'Dr. Rao',        ts:'2026-09-04 10:08', cur:'d0a5f3c9e7b4', prev:'c9f4e2b8d6a3', status:'Verified' },
];

/* ══════════════════════════════════════════════════════════
   SECTION: APP STATE
══════════════════════════════════════════════════════════ */
let STATE = {
  user: null,
  currentView: 'dashboard',
  selectedCase: null,
  sidebarCollapsed: false,
  cases:         LS.get('cases',         SEED_CASES),
  docs:          LS.get('docs',          SEED_DOCS),
  evidence:      LS.get('evidence',      SEED_EVIDENCE),
  logs:          LS.get('logs',          SEED_LOGS),
  notifications: LS.get('notifications', SEED_NOTIFICATIONS),
  alerts:        LS.get('alerts',        SEED_ALERTS),
  reviews:       LS.get('reviews',       SEED_REVIEWS),
  approvals:     LS.get('approvals',     SEED_APPROVALS),
  revisions:     LS.get('revisions',     SEED_REVISIONS),
  regData: {},
  selectedRole: '',
};

function saveState() {
  ['cases','docs','evidence','logs','notifications','alerts','reviews','approvals','revisions'].forEach(k => LS.set(k, STATE[k]));
}

/* ══════════════════════════════════════════════════════════
   SECTION: AUTHENTICATION
══════════════════════════════════════════════════════════ */
function handleLogin() {
  // TODO: API — POST /api/auth/login { email, password }
  const email    = document.getElementById('login-email')?.value?.trim().toLowerCase();
  const password = document.getElementById('login-password')?.value;
  const captcha  = document.getElementById('captcha-check')?.checked;
  const btn      = document.getElementById('login-btn-text');

  if (!captcha) { showToast('Please confirm you are not a robot.', 'warning'); return; }
  if (!email || !password) { showToast('Email and password are required.', 'warning'); return; }

  btn.textContent = 'Authenticating…';
  setTimeout(() => {
    btn.textContent = 'Sign In';
    const data = DEMO_USERS[email];
    if (data && data.password === password) {
      STATE.user = { name: data.name, email, role: data.role, dept: data.dept };
      LS.set('user', STATE.user);
      addLog('Login', 'auth', '—', 'Success');
      bootApp();
      showToast('Welcome, ' + data.name + '.', 'success');
    } else {
      addLog('Failed Login Attempt', 'auth', '—', 'Failure');
      showToast('Invalid credentials. Use demo credentials below.', 'error');
    }
  }, 1000);
}

function handleLogout() {
  addLog('Logout', 'auth', '—', 'Success');
  STATE.user = null;
  LS.del('user');
  document.getElementById('app-shell').style.display = 'none';
  document.getElementById('auth-screen').style.display = 'flex';
  document.getElementById('login-panel').style.display = '';
  document.getElementById('register-panel').style.display = 'none';
}

function fillDemo(email, role) {
  document.getElementById('login-email').value = email;
  document.getElementById('login-password').value = 'ember123';
  // switch to email tab
  document.querySelectorAll('.method-tab').forEach(t => t.classList.toggle('active', t.dataset.method === 'email'));
  document.querySelectorAll('.method-panel').forEach(p => p.classList.toggle('active', p.id === 'method-email'));
  showToast('Demo credentials filled. Click Sign In.', 'success');
}

function sendOTP() {
  showToast('OTP sent (prototype — no real SMS).', 'success');
  document.getElementById('otp-field').style.display = '';
}

/* ══════════════════════════════════════════════════════════
   SECTION: REGISTRATION
══════════════════════════════════════════════════════════ */
let regStep = 1;

function showRegister() {
  document.getElementById('login-panel').style.display = 'none';
  document.getElementById('register-panel').style.display = '';
  regStep = 1;
  updateRegUI();
}
function showLogin() {
  document.getElementById('register-panel').style.display = 'none';
  document.getElementById('login-panel').style.display = '';
}

function updateRegUI() {
  for (let i = 1; i <= 4; i++) {
    document.getElementById('reg-step-' + i)?.classList.toggle('active', i === regStep);
    const step = document.getElementById('rp' + i);
    if (step) {
      step.classList.toggle('active', i === regStep);
      step.classList.toggle('done', i < regStep);
    }
    const line = document.getElementById('rl' + i);
    if (line) line.classList.toggle('done', i < regStep);
  }
}

function regNext(step) {
  if (step === 1) {
    const phone = document.getElementById('reg-phone')?.value;
    const email = document.getElementById('reg-email')?.value;
    if (!phone || !email) { showToast('Phone and email are required.', 'warning'); return; }
    STATE.regData.phone = phone;
    STATE.regData.email = email;
  } else if (step === 2) {
    const name = document.getElementById('reg-name')?.value;
    if (!name) { showToast('Name is required.', 'warning'); return; }
    STATE.regData.name = name;
  } else if (step === 3) {
    if (!STATE.selectedRole) { showToast('Please select a role.', 'warning'); return; }
    STATE.regData.role = STATE.selectedRole;
    // populate summary
    document.getElementById('reg-summary').innerHTML = `
      <div class="reg-summary-row"><span>Name</span><span>${STATE.regData.name || '—'}</span></div>
      <div class="reg-summary-row"><span>Email</span><span>${STATE.regData.email || '—'}</span></div>
      <div class="reg-summary-row"><span>Role</span><span style="color:var(--accent)">${ROLE_LABELS[STATE.selectedRole] || '—'}</span></div>
    `;
  }
  regStep = step + 1;
  updateRegUI();
}
function regBack(step) { regStep = step - 1; updateRegUI(); }

function finishReg() {
  // TODO: API — POST /api/auth/register
  showToast('Registration submitted. Pending admin verification.', 'success');
  showLogin();
}

/* ══════════════════════════════════════════════════════════
   SECTION: ROLE MANAGEMENT
══════════════════════════════════════════════════════════ */
document.addEventListener('click', function(e) {
  const ro = e.target.closest('.role-opt');
  if (ro) {
    document.querySelectorAll('.role-opt').forEach(r => r.classList.remove('selected'));
    ro.classList.add('selected');
    STATE.selectedRole = ro.dataset.role;
  }
  const mt = e.target.closest('.method-tab');
  if (mt) {
    document.querySelectorAll('.method-tab').forEach(t => t.classList.remove('active'));
    mt.classList.add('active');
    const m = mt.dataset.method;
    document.querySelectorAll('.method-panel').forEach(p => p.classList.toggle('active', p.id === 'method-' + m));
  }
});

/* ══════════════════════════════════════════════════════════
   SECTION: APP BOOT
══════════════════════════════════════════════════════════ */
function bootApp() {
  document.getElementById('auth-screen').style.display = 'none';
  document.getElementById('app-shell').style.display = 'flex';
  buildSidebar();
  updateTopBar();
  navigate('dashboard');
}

function buildSidebar() {
  const role = STATE.user.role;
  const menu = SIDEBAR_MENUS[role] || SIDEBAR_MENUS.police;
  const nav  = document.getElementById('sidebar-nav');
  nav.innerHTML = '';
  menu.forEach(item => {
    const unread = item.badge ? STATE.notifications.filter(n => !n.read).length : 0;
    const btn = document.createElement('button');
    btn.className = 'nav-item';
    btn.dataset.view = item.view;
    btn.dataset.label = item.label;
    btn.setAttribute('aria-label', item.label);
    btn.onclick = () => navigate(item.view);
    btn.innerHTML = `
      <i class="fas ${item.icon}"></i>
      <span class="nav-label">${item.label}</span>
      ${unread > 0 ? `<span class="nav-badge">${unread}</span>` : ''}
    `;
    nav.appendChild(btn);
  });
  document.getElementById('sidebar-role-text').textContent = ROLE_LABELS[role];
}

function updateTopBar() {
  const u = STATE.user;
  document.getElementById('user-avatar-top').textContent = u.name.charAt(0);
  document.getElementById('user-info-top').innerHTML = `<span class="user-name">${u.name}</span><span class="user-role">${ROLE_LABELS[u.role]}</span>`;
  const unread = STATE.notifications.filter(n => !n.read).length;
  document.getElementById('notif-dot').style.display = unread > 0 ? 'block' : 'none';
}

/* ══════════════════════════════════════════════════════════
   SECTION: NAVIGATION
══════════════════════════════════════════════════════════ */
function navigate(view, data) {
  STATE.currentView = view;
  if (data) STATE.selectedCase = data;
  // Reset sub-view states on navigation
  if (view !== 'case_book') CB_STATE.detailCase = null;
  if (view !== 'transfer') TC_STATE = { caseId:'', lead:'' };
  if (view !== 'sign') SIGN_STATE = { docId:'' };
  if (view !== 'report') REP_STATE = { type:'', caseId:'', dept:'' };
  document.querySelectorAll('.nav-item').forEach(b => b.classList.toggle('active', b.dataset.view === view));
  render();
  // Close mobile sidebar
  document.getElementById('sidebar').classList.remove('mobile-open');
  document.getElementById('sidebar-overlay').classList.remove('open');
  window.scrollTo(0, 0);
}

function toggleSidebar() {
  STATE.sidebarCollapsed = !STATE.sidebarCollapsed;
  document.getElementById('sidebar').classList.toggle('collapsed', STATE.sidebarCollapsed);
}
function toggleMobileSidebar() {
  document.getElementById('sidebar').classList.toggle('mobile-open');
  document.getElementById('sidebar-overlay').classList.toggle('open');
}

/* ══════════════════════════════════════════════════════════
   SECTION: RENDER ROUTER
══════════════════════════════════════════════════════════ */
function render() {
  const el = document.getElementById('page-content');
  const v  = STATE.currentView;
  const r  = STATE.user?.role;
  switch (v) {
    case 'dashboard':    el.innerHTML = renderDashboard(); break;
    case 'case_book':    el.innerHTML = renderCaseBook();  break;
    case 'case_profile': el.innerHTML = renderCaseProfile(); break;
    case 'doc_register': el.innerHTML = renderDocRegister(); break;
    case 'upload':       el.innerHTML = renderUpload(); break;
    case 'revision':     el.innerHTML = renderRevision(); break;
    case 'approvals':    el.innerHTML = renderApprovals(); break;
    case 'reviews':      el.innerHTML = renderReviews(); break;
    case 'transfer':     el.innerHTML = renderTransfer(); break;
    case 'sign':         el.innerHTML = renderSign(); break;
    case 'report':       el.innerHTML = renderReport(); break;
    case 'logs':         el.innerHTML = renderLogs(); break;
    case 'notifications':el.innerHTML = renderNotifications(); break;
    case 'security':     el.innerHTML = renderSecurity(); break;
    case 'ledger':       el.innerHTML = renderLedger(); break;
    case 'view_content': el.innerHTML = renderViewContent(); break;
    case 'analyze':      el.innerHTML = renderAnalyze(); break;
    case 'settings':     el.innerHTML = renderSettings(); break;
    default: el.innerHTML = renderDashboard();
  }
  afterRender(v);
}

function afterRender(v) {
  if (v === 'dashboard' && document.getElementById('dash-chart')) renderDashChart();
}

/* ══════════════════════════════════════════════════════════
   SECTION: DASHBOARD
══════════════════════════════════════════════════════════ */
function renderDashboard() {
  const u = STATE.user;
  const r = u.role;
  const activeCases = STATE.cases.filter(c => c.status === 'Active').length;
  const pendingApprv = STATE.approvals.filter(a => a.status === 'Pending').length;
  const approvedDocs = STATE.docs.filter(d => d.approval === 'Approved').length;
  const unresAlerts  = STATE.alerts.filter(a => a.status !== 'Resolved').length;
  const totalEvidence= STATE.evidence.length;

  if (r === 'citizen') return renderCitizenDash(pendingApprv, approvedDocs);
  if (r === 'lawyer')  return renderLawyerDash(pendingApprv, approvedDocs);

  // Legal Officer / others
  return `
  <div class="page-header">
    <div>
      <h1 class="page-title">Legal Officer Dashboard</h1>
      <p class="page-sub">Welcome back, ${u.name} · ${new Date().toLocaleDateString('en-IN',{weekday:'long',year:'numeric',month:'long',day:'numeric'})}</p>
    </div>
    <div class="page-actions">
      <button class="btn btn-primary" onclick="showAddCaseModal()"><i class="fas fa-plus"></i> Add Case</button>
    </div>
  </div>

  <div class="stat-grid">
    <div class="stat-item"><div class="stat-card"><div class="stat-label">Active Cases</div><div class="stat-value stat-accent">${activeCases}</div></div><div class="stat-sub">Ongoing investigations</div></div>
    <div class="stat-item"><div class="stat-card"><div class="stat-label">Total Documents</div><div class="stat-value">${STATE.docs.length}</div></div><div class="stat-sub">All documents</div></div>
    <div class="stat-item"><div class="stat-card"><div class="stat-label">Evidence Records</div><div class="stat-value stat-blue">${totalEvidence}</div></div><div class="stat-sub">Items secured</div></div>
    <div class="stat-item"><div class="stat-card"><div class="stat-label">Pending Approvals</div><div class="stat-value stat-warn">${pendingApprv}</div></div><div class="stat-sub">Awaiting action</div></div>
    <div class="stat-item"><div class="stat-card"><div class="stat-label">Security Alerts</div><div class="stat-value stat-danger">${unresAlerts}</div></div><div class="stat-sub">Requires attention</div></div>
  </div>

  <div class="grid-2" style="margin-bottom:16px">
    <div class="card">
      <div class="card-header">
        <h3 class="card-title">Recent Activity</h3>
        <a class="card-link" onclick="navigate('logs')">View all</a>
      </div>
      <div class="activity-list">
        ${STATE.logs.slice(0,5).map(l => `
          <div class="activity-item">
            <div class="activity-dot ${l.result==='Success'?'dot-success':'dot-danger'}"></div>
            <div>
              <div class="activity-text">${l.action} — <b>${l.resource}</b></div>
              <div class="activity-meta">${l.user} · ${l.ts}</div>
            </div>
          </div>`).join('')}
      </div>
    </div>
    <div class="card">
      <div class="card-header">
        <h3 class="card-title">Recent Cases</h3>
        <a class="card-link" onclick="navigate('case_book')">View all</a>
      </div>
      ${STATE.cases.slice(0,3).map(c => `
        <div class="flex items-center gap-10" style="padding:8px 0;border-bottom:1px solid var(--border);cursor:pointer" onclick="navigate('case_profile',${JSON.stringify(c).replace(/"/g,'&quot;')})">
          <div style="width:34px;height:34px;background:var(--dark);border-radius:8px;display:flex;align-items:center;justify-content:center;flex-shrink:0">
            <i class="fas fa-folder" style="color:#9CA3AF;font-size:14px"></i>
          </div>
          <div style="flex:1;min-width:0">
            <div class="text-xs mono text-accent">${c.id}</div>
            <div class="text-sm fw-600 truncate">${c.name}</div>
          </div>
          ${badge(c.status)}
        </div>`).join('')}
    </div>
  </div>

  <div class="card">
    <div class="card-header">
      <h3 class="card-title">Recent Documents</h3>
      <a class="card-link" onclick="navigate('doc_register')">View all</a>
    </div>
    <div class="table-wrap">
      <table class="data-table">
        <thead><tr><th>Document</th><th>Case</th><th>Type</th><th>Status</th><th>Integrity</th><th>Date</th></tr></thead>
        <tbody>
          ${STATE.docs.slice(0,4).map(d => `<tr>
            <td class="fw-600">${d.name}</td>
            <td><span class="mono text-xs text-accent">${d.caseId}</span></td>
            <td>${d.type}</td>
            <td>${badge(d.status)}</td>
            <td>${badge(d.integrity)}</td>
            <td class="text-xs text-muted">${d.date}</td>
          </tr>`).join('')}
        </tbody>
      </table>
    </div>
  </div>

  <div class="card" style="margin-top:16px">
    <div class="card-header"><h3 class="card-title">Document Overview</h3></div>
    <canvas id="dash-chart" height="80"></canvas>
  </div>
  `;
}

function renderCitizenDash(pendingApprv, approvedDocs) {
  return `
  <div class="page-header"><div><h1 class="page-title">Citizen Dashboard</h1><p class="page-sub">Welcome, ${STATE.user.name}</p></div>
    <div class="page-actions">
      <button class="btn btn-outline" onclick="navigate('doc_register')">Open Register</button>
      <button class="btn btn-primary" onclick="navigate('upload')"><i class="fas fa-upload"></i> Upload Document</button>
    </div>
  </div>
  <div class="stat-grid">
    <div class="stat-card"><div class="stat-label">Total Documents</div><div class="stat-value">${STATE.docs.length}</div></div>
    <div class="stat-card"><div class="stat-label">Pending Approval</div><div class="stat-value stat-warn">${pendingApprv}</div></div>
    <div class="stat-card"><div class="stat-label">Approved</div><div class="stat-value stat-success">${approvedDocs}</div></div>
    <div class="stat-card"><div class="stat-label">Review Due</div><div class="stat-value stat-danger">2</div></div>
  </div>
  <div class="grid-2">
    <div class="card">
      <div class="card-header"><h3 class="card-title">Recent Documents</h3><a class="card-link" onclick="navigate('doc_register')">View all</a></div>
      ${STATE.docs.slice(0,4).map(d=>`<div class="flex items-center gap-10" style="padding:8px 0;border-bottom:1px solid var(--border)">
        <i class="fas fa-file-pdf" style="color:#C2410C;font-size:18px;flex-shrink:0"></i>
        <div style="flex:1;min-width:0"><div class="text-sm fw-600 truncate">${d.name}</div><div class="text-xs text-muted">${d.date} · v${d.ver}</div></div>
        ${badge(d.approval)}
      </div>`).join('')}
    </div>
    <div class="card">
      <h3 class="card-title">Department Summary</h3>
      ${[['Criminal Investigation',75,6],['Forensic Science',60,3],['Legal',45,2],['Court',30,1]].map(([d,p,c])=>`
        <div class="dept-row"><span class="dept-name">${d}</span><div class="dept-bar-wrap"><div class="dept-bar" style="width:${p}%"></div></div><span class="dept-count">${c}</span></div>`).join('')}
    </div>
  </div>`;
}

function renderLawyerDash(pendingApprv, approvedDocs) {
  return `
  <div class="page-header"><div><h1 class="page-title">Lawyer Dashboard</h1><p class="page-sub">Welcome, ${STATE.user.name}</p></div></div>
  <div class="stat-grid">
    <div class="stat-card"><div class="stat-label">Total Documents</div><div class="stat-value">${STATE.docs.filter(d=>d.approval==='Approved').length}</div></div>
    <div class="stat-card"><div class="stat-label">Pending Approval</div><div class="stat-value stat-warn">${pendingApprv}</div></div>
    <div class="stat-card"><div class="stat-label">Approved</div><div class="stat-value stat-success">${approvedDocs}</div></div>
    <div class="stat-card"><div class="stat-label">Review Due</div><div class="stat-value stat-danger">2</div></div>
  </div>
  <div class="grid-2">
    <div class="card">
      <div class="card-header"><h3 class="card-title">Recent Documents</h3><a class="card-link" onclick="navigate('doc_register')">View all</a></div>
      ${STATE.docs.filter(d=>d.approval==='Approved').slice(0,4).map(d=>`<div class="flex items-center gap-10" style="padding:8px 0;border-bottom:1px solid var(--border)">
        <i class="fas fa-file-contract" style="color:#2563EB;font-size:18px;flex-shrink:0"></i>
        <div style="flex:1;min-width:0"><div class="text-sm fw-600 truncate">${d.name}</div><div class="text-xs text-muted">${d.date} · v${d.ver}</div></div>
        ${badge(d.integrity)}
      </div>`).join('')}
    </div>
    <div class="card">
      <h3 class="card-title">Department Summary</h3>
      ${[['Criminal Investigation',75,6],['Forensic Science',60,3],['Legal',45,2],['Court',30,1]].map(([d,p,c])=>`
        <div class="dept-row"><span class="dept-name">${d}</span><div class="dept-bar-wrap"><div class="dept-bar" style="width:${p}%"></div></div><span class="dept-count">${c}</span></div>`).join('')}
      <div style="margin-top:14px;display:flex;gap:8px">
        <button class="btn btn-outline btn-sm" onclick="navigate('view_content')">View Content</button>
        <button class="btn btn-primary btn-sm" onclick="navigate('analyze')">Analyze</button>
      </div>
    </div>
  </div>`;
}

function renderDashChart() {
  const ctx = document.getElementById('dash-chart').getContext('2d');
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep'],
      datasets: [
        { label: 'Documents', data:[2,5,3,6,4,7,5,8,6], backgroundColor:'rgba(194,65,12,.7)', borderRadius:4 },
        { label: 'Evidence',  data:[1,2,1,3,2,4,3,5,3], backgroundColor:'rgba(37,99,235,.5)',  borderRadius:4 },
      ]
    },
    options: { responsive:true, plugins:{legend:{labels:{font:{size:12}}}}, scales:{y:{beginAtZero:true,grid:{color:'#F3F4F6'}},x:{grid:{display:false}}} }
  });
}

/* ══════════════════════════════════════════════════════════
   SECTION: CASE MANAGEMENT
══════════════════════════════════════════════════════════ */
let CB_STATE = { search:'', status:'All', type:'All', priority:'All', sort:'Newest', openMenu:null, detailCase:null, detailTab:'overview' };

function renderCaseBook() {
  if (CB_STATE.detailCase) return renderCaseDetail(CB_STATE.detailCase);

  const cases = getCBFiltered();
  const allCases = STATE.cases;

  return `
  <div class="page-header" style="align-items:flex-start">
    <div>
      <h1 class="page-title">Case Book</h1>
      <p class="page-sub">Manage, review and track all investigation and legal cases</p>
    </div>
    <div class="page-actions">
      <button class="btn btn-primary" onclick="showAddCaseModal()"><i class="fas fa-plus"></i> Create New Case</button>
    </div>
  </div>

  <!-- Stats -->
  <div class="stat-grid" style="margin-bottom:18px">
    <div class="stat-card"><div class="stat-icon-wrap"><i class="fas fa-folder"></i></div><div><div class="stat-label">Total Cases</div><div class="stat-value">124</div></div></div>
    <div class="stat-card"><div class="stat-icon-wrap" style="color:#2563EB"><i class="fas fa-bolt"></i></div><div><div class="stat-label">Active Cases</div><div class="stat-value stat-blue">42</div></div></div>
    <div class="stat-card"><div class="stat-icon-wrap" style="color:#D97706"><i class="fas fa-search"></i></div><div><div class="stat-label">Under Review</div><div class="stat-value stat-warn">18</div></div></div>
    <div class="stat-card"><div class="stat-icon-wrap" style="color:#15803D"><i class="fas fa-check-circle"></i></div><div><div class="stat-label">Closed Cases</div><div class="stat-value stat-success">64</div></div></div>
  </div>

  <!-- Search + Filters -->
  <div class="card" style="margin-bottom:14px;padding:14px 16px">
    <div class="search-bar" style="margin-bottom:10px">
      <i class="fas fa-search"></i>
      <input type="text" id="cb-search" value="${CB_STATE.search}" placeholder="Search by Case ID, case title, officer..." oninput="cbSearch(this.value)" />
      ${CB_STATE.search ? `<button onclick="cbSearch('')" style="background:none;border:none;color:#9CA3AF;cursor:pointer;font-size:13px">✕</button>` : ''}
    </div>
    <div style="display:flex;flex-wrap:wrap;gap:8px;align-items:center">
      <select class="cb-select" onchange="cbSetFilter('status',this.value)">
        <option value="All" ${CB_STATE.status==='All'?'selected':''}>Status: All</option>
        ${['Active','Under Investigation','Under Review','Pending Court','Closed'].map(s=>`<option value="${s}" ${CB_STATE.status===s?'selected':''}>${s}</option>`).join('')}
      </select>
      <select class="cb-select" onchange="cbSetFilter('type',this.value)">
        <option value="All" ${CB_STATE.type==='All'?'selected':''}>Case Type: All</option>
        ${['Criminal','Civil','Investigation','Legal','Other'].map(t=>`<option value="${t}" ${CB_STATE.type===t?'selected':''}>${t}</option>`).join('')}
      </select>
      <select class="cb-select" onchange="cbSetFilter('priority',this.value)">
        <option value="All" ${CB_STATE.priority==='All'?'selected':''}>Priority: All</option>
        ${['Critical','High','Medium','Low'].map(p=>`<option value="${p}" ${CB_STATE.priority===p?'selected':''}>${p}</option>`).join('')}
      </select>
      <select class="cb-select" onchange="cbSetFilter('sort',this.value)">
        ${['Newest','Oldest','Recently Updated','Priority'].map(s=>`<option value="${s}" ${CB_STATE.sort===s?'selected':''}>${s}</option>`).join('')}
      </select>
      ${(CB_STATE.status!=='All'||CB_STATE.type!=='All'||CB_STATE.priority!=='All'||CB_STATE.search) ? `<button onclick="cbClearFilters()" style="background:none;border:none;color:#C2410C;font-size:12px;cursor:pointer;text-decoration:underline">Clear Filters</button>` : ''}
      <span style="margin-left:auto;font-size:12px;color:var(--text-muted)">${cases.length} case${cases.length!==1?'s':''}</span>
    </div>
  </div>

  <!-- Table -->
  <div class="card" style="padding:0;overflow:hidden">
    <table class="data-table" style="margin:0">
      <thead style="background:#F9FAFB">
        <tr>
          <th>Case ID</th><th>Case Title</th><th>Case Type</th><th>Status</th><th>Priority</th><th>Assigned Officer</th><th>Last Updated</th><th>Actions</th>
        </tr>
      </thead>
      <tbody>
        ${cases.length === 0 ? `
          <tr><td colspan="8" style="padding:60px;text-align:center;color:var(--text-muted)">
            <div style="font-size:36px;margin-bottom:10px">🔍</div>
            <div style="font-weight:600;color:var(--text);margin-bottom:4px">No cases found</div>
            <div style="font-size:13px">Try adjusting your search or filters</div>
            <button onclick="cbClearFilters()" style="margin-top:12px;background:none;border:none;color:#C2410C;font-size:13px;cursor:pointer;text-decoration:underline">Clear all filters</button>
          </td></tr>` :
          cases.map(c => `
          <tr class="data-row" style="position:relative">
            <td class="mono text-xs text-accent fw-600" style="white-space:nowrap">${c.id}</td>
            <td><button onclick="cbOpenDetail('${c.id}')" style="background:none;border:none;color:var(--text);font-size:13px;font-weight:600;cursor:pointer;padding:0;text-align:left;font-family:inherit">${c.name}</button></td>
            <td class="text-xs text-muted">${c.caseType||'—'}</td>
            <td>${badge(c.status)}</td>
            <td>${badge(c.priority)}</td>
            <td class="text-xs">${c.lead}</td>
            <td class="text-xs text-muted">${fmtDate(c.updated)}</td>
            <td>
              <div style="display:flex;gap:8px;align-items:center">
                <button onclick="cbOpenDetail('${c.id}')" class="btn btn-outline btn-sm" style="white-space:nowrap">Open Case</button>
                <div style="position:relative">
                  <button onclick="cbToggleMenu('${c.id}')" style="background:none;border:none;cursor:pointer;color:#9CA3AF;font-size:18px;line-height:1;padding:0 4px">⋮</button>
                  <div id="cb-menu-${c.id}" style="display:none;position:absolute;right:0;top:24px;background:white;border:1px solid var(--border);border-radius:10px;box-shadow:0 4px 16px rgba(0,0,0,.10);z-index:100;min-width:160px;padding:4px 0">
                    ${[['View Case',`cbOpenDetail('${c.id}')`],['View Documents',`cbOpenDetailTab('${c.id}','documents')`],['View Evidence',`cbOpenDetailTab('${c.id}','evidence')`],['View Timeline',`cbOpenDetailTab('${c.id}','timeline')`],['Transfer Case',`navigate('transfer')`],['View Activity',`cbOpenDetailTab('${c.id}','activity')`]].map(([lbl,fn])=>`
                    <button onclick="${fn}" style="width:100%;background:none;border:none;text-align:left;padding:8px 16px;font-size:12px;color:var(--text);cursor:pointer;font-family:inherit;white-space:nowrap" onmouseover="this.style.background='#F9FAFB'" onmouseout="this.style.background='none'">${lbl}</button>`).join('')}
                  </div>
                </div>
              </div>
            </td>
          </tr>`).join('')}
      </tbody>
    </table>
  </div>`;
}

function getCBFiltered() {
  const q = CB_STATE.search.toLowerCase();
  return STATE.cases.filter(c => {
    const matchQ = !q || c.id.toLowerCase().includes(q) || c.name.toLowerCase().includes(q) || c.lead.toLowerCase().includes(q);
    const matchS = CB_STATE.status === 'All' || c.status === CB_STATE.status;
    const matchT = CB_STATE.type === 'All' || c.caseType === CB_STATE.type;
    const matchP = CB_STATE.priority === 'All' || c.priority === CB_STATE.priority;
    return matchQ && matchS && matchT && matchP;
  }).sort((a,b) => {
    if (CB_STATE.sort === 'Newest') return b.created.localeCompare(a.created);
    if (CB_STATE.sort === 'Oldest') return a.created.localeCompare(b.created);
    if (CB_STATE.sort === 'Recently Updated') return b.updated.localeCompare(a.updated);
    if (CB_STATE.sort === 'Priority') { const o={Critical:0,High:1,Medium:2,Low:3}; return (o[a.priority]??9)-(o[b.priority]??9); }
    return 0;
  });
}
function fmtDate(d) {
  try { return new Date(d).toLocaleDateString('en-GB',{day:'2-digit',month:'short',year:'numeric'}); } catch { return d; }
}
function cbSearch(v) { CB_STATE.search = v; document.getElementById('page-content').innerHTML = renderCaseBook(); afterRender(STATE.currentView); }
function cbSetFilter(key, v) { CB_STATE[key] = v; document.getElementById('page-content').innerHTML = renderCaseBook(); afterRender(STATE.currentView); }
function cbClearFilters() { CB_STATE = {...CB_STATE, search:'', status:'All', type:'All', priority:'All', sort:'Newest'}; document.getElementById('page-content').innerHTML = renderCaseBook(); }
function cbToggleMenu(id) {
  // Close all other menus first
  document.querySelectorAll('[id^="cb-menu-"]').forEach(m => { if (m.id !== 'cb-menu-'+id) m.style.display = 'none'; });
  const m = document.getElementById('cb-menu-'+id);
  if (m) m.style.display = m.style.display === 'none' ? '' : 'none';
}
document.addEventListener('click', function(e) {
  if (!e.target.closest('[id^="cb-menu-"]') && !e.target.closest('[onclick*="cbToggleMenu"]')) {
    document.querySelectorAll('[id^="cb-menu-"]').forEach(m => m.style.display = 'none');
  }
});
function cbOpenDetail(caseId) {
  CB_STATE.detailCase = STATE.cases.find(c => c.id === caseId) || null;
  CB_STATE.detailTab = 'overview';
  document.getElementById('page-content').innerHTML = renderCaseBook();
}
function cbOpenDetailTab(caseId, tab) {
  CB_STATE.detailCase = STATE.cases.find(c => c.id === caseId) || null;
  CB_STATE.detailTab = tab;
  document.getElementById('page-content').innerHTML = renderCaseBook();
}
function cbBackToList() { CB_STATE.detailCase = null; document.getElementById('page-content').innerHTML = renderCaseBook(); }
function cbSwitchTab(tab) { CB_STATE.detailTab = tab; document.getElementById('page-content').innerHTML = renderCaseBook(); }

function renderCaseDetail(c) {
  const tabs = [['overview','Overview'],['documents','Documents'],['evidence','Evidence'],['people','People'],['timeline','Timeline'],['activity','Activity Log']];
  const caseDocs = STATE.docs.filter(d => d.caseId === c.id);
  const caseEvid = STATE.evidence.filter(e => e.caseId === c.id);
  const t = CB_STATE.detailTab;

  const metaItems = [
    ['Case ID', c.id, 'mono text-accent'], ['Case Type', c.caseType||'—',''], ['Lead Officer', c.lead,''],
    ['Department', c.dept,''], ['Date Created', fmtDate(c.created),''], ['Last Updated', fmtDate(c.updated),''],
    ['Confidentiality', c.confidentiality||'—',''],
  ];

  return `
  <!-- Header -->
  <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:16px;margin-bottom:18px;flex-wrap:wrap">
    <div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap">
      <button onclick="cbBackToList()" class="btn btn-outline btn-sm"><i class="fas fa-chevron-left"></i> Case Book</button>
      <div style="width:1px;height:20px;background:var(--border)"></div>
      <div>
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:4px">
          <span class="mono text-sm text-accent fw-600">${c.id}</span>
          ${badge(c.status)} ${badge(c.priority)}
        </div>
        <h1 style="font-size:18px;font-weight:700;color:var(--text);margin:0">${c.name}</h1>
      </div>
    </div>
    <div style="display:flex;gap:8px;flex-wrap:wrap">
      <button class="btn btn-outline btn-sm" onclick="navigate('upload')">Add Document</button>
      <button class="btn btn-outline btn-sm" onclick="navigate('transfer')">Transfer Case</button>
      <button class="btn btn-secondary btn-sm" onclick="navigate('report')"><i class="fas fa-chart-bar"></i> Generate Report</button>
    </div>
  </div>

  <!-- Meta strip -->
  <div class="card" style="margin-bottom:14px;padding:14px 20px">
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(110px,1fr));gap:12px 20px">
      ${metaItems.map(([k,v,cls])=>`<div><div class="text-xs text-muted" style="margin-bottom:3px">${k}</div><div class="text-xs fw-600 ${cls}" style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${v}</div></div>`).join('')}
    </div>
  </div>

  <!-- Tabs -->
  <div class="tab-bar" style="margin-bottom:16px;border-bottom:1px solid var(--border)">
    ${tabs.map(([id,lbl])=>`<button class="tab-btn${t===id?' active':''}" style="${t===id?'border-bottom:2px solid #C2410C;color:#C2410C;':'border-bottom:2px solid transparent;'}" onclick="cbSwitchTab('${id}')">${lbl}</button>`).join('')}
  </div>

  <!-- Overview -->
  ${t==='overview'?`
  <div class="grid-2">
    <div class="card" style="grid-column:span 2 / auto">
      <h3 class="card-title">Case Summary</h3>
      <p class="text-sm" style="line-height:1.7;color:var(--text)">${c.desc}</p>
      <div class="stat-grid" style="margin-top:16px">
        <div class="stat-card" style="padding:10px 14px"><div class="stat-label">Documents</div><div class="stat-value" style="font-size:20px">${c.docs}</div></div>
        <div class="stat-card" style="padding:10px 14px"><div class="stat-label">Evidence Items</div><div class="stat-value" style="font-size:20px">${c.evidence}</div></div>
        <div class="stat-card" style="padding:10px 14px"><div class="stat-label">Officers</div><div class="stat-value" style="font-size:20px">${c.officers.length}</div></div>
        <div class="stat-card" style="padding:10px 14px"><div class="stat-label">Status</div><div style="margin-top:4px">${badge(c.status)}</div></div>
      </div>
    </div>
    <div class="card">
      <h3 class="card-title">Recent Activity</h3>
      ${[['06 Sep 2026','Investigation report uploaded','Officer Sharma'],['04 Sep 2026','Evidence record added','Officer Mehta'],['01 Sep 2026','Witness statement uploaded','Dr. Rao'],['28 Aug 2026','Case created','Officer Sharma']].map(([date,action,actor])=>`
      <div style="display:flex;gap:12px;margin-bottom:14px">
        <div style="width:8px;height:8px;border-radius:50%;background:#C2410C;flex-shrink:0;margin-top:4px"></div>
        <div><div class="text-sm fw-600">${action}</div><div class="text-xs text-muted" style="margin-top:2px">${date} · ${actor}</div></div>
      </div>`).join('')}
    </div>
  </div>`:``}

  <!-- Documents -->
  ${t==='documents'?`
  <div class="card" style="padding:0;overflow:hidden">
    <div style="display:flex;align-items:center;justify-content:space-between;padding:14px 18px;border-bottom:1px solid var(--border)">
      <h3 class="card-title" style="margin-bottom:0">Documents (${caseDocs.length||3})</h3>
      <button class="btn btn-primary btn-sm" onclick="navigate('upload')"><i class="fas fa-plus"></i> Add Document</button>
    </div>
    <div class="table-wrap">
      <table class="data-table" style="margin:0">
        <thead><tr><th>Document Name</th><th>Type</th><th>Version</th><th>Uploaded By</th><th>Date</th><th>Status</th><th>Action</th></tr></thead>
        <tbody>
          ${(caseDocs.length ? caseDocs : [
            {name:'FIR / Police Report',type:'Police Report',ver:'1',by:'Officer Sharma',date:'28 Aug 2026',status:'Approved'},
            {name:'Investigation Report',type:'Investigation',ver:'2',by:'Officer Mehta',date:'06 Sep 2026',status:'Pending'},
            {name:'Witness Statement',type:'Statement',ver:'1',by:'Dr. Rao',date:'01 Sep 2026',status:'Approved'},
          ]).map(d=>`<tr>
            <td class="fw-600">${d.name}</td>
            <td class="text-xs">${d.type}</td>
            <td class="mono text-xs text-muted">v${d.ver}</td>
            <td class="text-xs">${d.by}</td>
            <td class="text-xs text-muted">${d.date||fmtDate(d.date)}</td>
            <td>${badge(d.status)}</td>
            <td><button class="btn btn-outline btn-sm" onclick="showToast('Document opened in viewer.','success')">View</button></td>
          </tr>`).join('')}
        </tbody>
      </table>
    </div>
  </div>`:``}

  <!-- Evidence -->
  ${t==='evidence'?`
  <div class="card" style="padding:0;overflow:hidden">
    <div style="display:flex;align-items:center;justify-content:space-between;padding:14px 18px;border-bottom:1px solid var(--border)">
      <h3 class="card-title" style="margin-bottom:0">Evidence (${caseEvid.length||2})</h3>
      <button class="btn btn-primary btn-sm" onclick="showAddEvidenceModal()"><i class="fas fa-plus"></i> Add Evidence</button>
    </div>
    <div class="table-wrap">
      <table class="data-table" style="margin:0">
        <thead><tr><th>Evidence ID</th><th>Type</th><th>Description</th><th>Collection Date</th><th>Collected By</th><th>Integrity</th><th>Chain of Custody</th></tr></thead>
        <tbody>
          ${(caseEvid.length ? caseEvid : [
            {id:'EV-001',type:'Physical',desc:'Confiscated device — Mobile phone',date:'04 Sep 2026',by:'Officer Mehta',integrity:'Verified'},
            {id:'EV-002',type:'Digital',desc:'CCTV footage from location',date:'29 Aug 2026',by:'Dr. Rao',integrity:'Verified'},
          ]).map(ev=>`<tr>
            <td class="mono text-xs text-accent">${ev.id}</td>
            <td class="text-xs">${ev.type}</td>
            <td class="text-sm">${ev.desc}</td>
            <td class="text-xs text-muted">${ev.date}</td>
            <td class="text-xs">${ev.by}</td>
            <td>${badge(ev.integrity||'Verified')}</td>
            <td><span class="badge badge-success">Intact</span></td>
          </tr>`).join('')}
        </tbody>
      </table>
    </div>
  </div>`:``}

  <!-- People -->
  ${t==='people'?`
  <div class="grid-2">
    ${[['Investigating Officer',[c.lead],'#EFF6FF','#1D4ED8'],['Assigned Officers',c.officers,'#EEF2FF','#4338CA'],['Legal Counsel',['Advocate Verma'],'#FFFBEB','#92400E'],['Witnesses',['[Confidential — Restricted Access]'],'#F9FAFB','#6B7280']].map(([role,people,bg,col])=>`
    <div class="card">
      <h3 class="card-title">${role}</h3>
      ${people.map(p=>`<div style="background:${bg};color:${col};border-radius:8px;padding:8px 14px;font-size:12px;margin-bottom:6px;font-weight:500">${p}</div>`).join('')}
    </div>`).join('')}
  </div>`:``}

  <!-- Timeline -->
  ${t==='timeline'?`
  <div class="card">
    <h3 class="card-title">Case Timeline</h3>
    <div style="position:relative;padding-left:28px">
      <div style="position:absolute;left:10px;top:0;bottom:0;width:2px;background:var(--border)"></div>
      ${[['06 Sep 2026','Investigation report uploaded','Officer Sharma'],['04 Sep 2026','Evidence record added','Officer Mehta'],['01 Sep 2026','Witness statement uploaded','Dr. Rao'],['28 Aug 2026','Case created and assigned','Officer Sharma']].map(([date,ev,actor])=>`
      <div style="position:relative;margin-bottom:24px">
        <div style="position:absolute;left:-22px;top:2px;width:16px;height:16px;border-radius:50%;background:var(--dark);border:2px solid white;display:flex;align-items:center;justify-content:center">
          <div style="width:6px;height:6px;background:#C2410C;border-radius:50%"></div>
        </div>
        <div class="text-sm fw-600" style="color:var(--text)">${ev}</div>
        <div class="text-xs text-muted" style="margin-top:3px">${date} · ${actor}</div>
      </div>`).join('')}
    </div>
  </div>`:``}

  <!-- Activity Log -->
  ${t==='activity'?`
  <div class="card" style="padding:0;overflow:hidden">
    <div style="padding:14px 18px;border-bottom:1px solid var(--border)">
      <h3 class="card-title" style="margin-bottom:2px">Activity Log</h3>
      <p class="text-xs text-muted">Auditable record of all actions taken on this case</p>
    </div>
    ${[['06 Sep 2026, 14:23','Document uploaded','Investigation Report v2','Officer Sharma','Legal Officer'],['04 Sep 2026, 11:05','Evidence added','EV-001 — Confiscated device','Officer Mehta','Investigating Officer'],['01 Sep 2026, 09:40','Document viewed','Witness Statement','Dr. Rao','Forensic Expert'],['28 Aug 2026, 08:15','Case created','Initial record created','Officer Sharma','Legal Officer']].map(([time,action,detail,user,role])=>`
    <div style="display:flex;align-items:center;gap:14px;padding:14px 18px;border-bottom:1px solid var(--border)">
      <div style="width:8px;height:8px;border-radius:50%;background:#C2410C;flex-shrink:0"></div>
      <div style="flex:1;min-width:0">
        <div style="display:flex;align-items:center;gap:8px"><span class="text-sm fw-600">${action}</span><span class="text-xs text-muted">— ${detail}</span></div>
        <div class="text-xs text-muted" style="margin-top:2px">${user} · ${role}</div>
      </div>
      <div class="text-xs text-muted" style="flex-shrink:0;white-space:nowrap">${time}</div>
    </div>`).join('')}
  </div>`:``}`;
}

/* ── CASE CARD (legacy, used only in dashboard) ─────── */
function renderCaseCard(c) {
  return `
  <div class="case-card" style="margin-bottom:12px" onclick="navigate('case_profile',${JSON.stringify(c).replace(/"/g,"'").replace(/'/g,'&apos;')})">
    <div class="case-id-row">
      <span class="case-id">${c.id}</span>
      ${badge(c.status)} ${badge(c.priority)}
    </div>
    <div class="case-name">${c.name}</div>
    <div class="case-desc">${c.desc}</div>
    <div class="case-meta">
      <span>Lead: <b>${c.lead}</b></span>
      <span>Dept: <b>${c.dept}</b></span>
      <span>Docs: <b>${c.docs}</b></span>
      <span>Evidence: <b>${c.evidence}</b></span>
      <span>Updated: <b>${c.updated}</b></span>
    </div>
    <div class="case-card-footer">
      <span class="text-xs text-muted">${c.officers.join(', ')}</span>
      <span class="text-xs text-accent fw-600">Open →</span>
    </div>
  </div>`;
}

/* ── CASE PROFILE ─────────────────────────────────────── */
function renderCaseProfile() {
  const c = STATE.selectedCase;
  if (!c) return renderCaseBook();
  const caseDocs = STATE.docs.filter(d => d.caseId === c.id);
  const caseEvid = STATE.evidence.filter(e => e.caseId === c.id);
  return `
  <div style="display:flex;align-items:center;gap:10px;margin-bottom:18px;flex-wrap:wrap">
    <button class="btn btn-outline btn-sm" onclick="navigate('case_book')"><i class="fas fa-chevron-left"></i> Back</button>
    <div>
      <div class="text-sm mono text-accent fw-600">${c.id}</div>
      <div style="font-size:16px;font-weight:700;color:var(--text)">${c.name}</div>
    </div>
    <div style="margin-left:auto;display:flex;gap:6px">${badge(c.status)} ${badge(c.priority)}</div>
  </div>

  <div class="tab-bar">
    ${[['profile','Case Profile'],['record','Record'],['evidence','Evidence'],['victim','Victim'],['judgement','Judgement'],['status','Opening/Closing'],['lead','Case Lead']].map(([id,lbl])=>
      `<button class="tab-btn${id==='profile'?' active':''}" onclick="switchTab('${id}',this)">${lbl}</button>`).join('')}
  </div>

  <!-- PROFILE TAB -->
  <div class="tab-panel active" id="tab-profile">
    <div class="grid-2">
      <div class="card">
        <h3 class="card-title">Case Information</h3>
        <dl class="dl-grid">
          <dt>Case ID</dt><dd class="mono text-accent">${c.id}</dd>
          <dt>Case Name</dt><dd>${c.name}</dd>
          <dt>Case Lead</dt><dd>${c.lead}</dd>
          <dt>Department</dt><dd>${c.dept}</dd>
          <dt>Priority</dt><dd>${badge(c.priority)}</dd>
          <dt>Status</dt><dd>${badge(c.status)}</dd>
          <dt>Created</dt><dd>${c.created}</dd>
          <dt>Last Updated</dt><dd>${c.updated}</dd>
        </dl>
        <div style="margin-top:14px;display:flex;gap:8px">
          <button class="btn btn-secondary btn-sm" onclick="showToast('Case info updated.','success')">Update Info</button>
        </div>
      </div>
      <div class="card">
        <h3 class="card-title">Description</h3>
        <p class="text-sm text-muted" style="line-height:1.6">${c.desc}</p>
        <h3 class="card-title" style="margin-top:16px">Assigned Officers</h3>
        <div style="display:flex;flex-wrap:wrap;gap:6px">
          ${c.officers.map(o=>`<span style="background:#F3F4F6;border:1px solid var(--border);border-radius:20px;padding:3px 12px;font-size:12px">${o}</span>`).join('')}
        </div>
      </div>
      <div class="card col-span-2">
        <h3 class="card-title">Case Documents (${caseDocs.length})</h3>
        <div class="table-wrap">
          <table class="data-table">
            <thead><tr><th>Document</th><th>Type</th><th>Version</th><th>Status</th><th>Integrity</th><th>Approval</th><th>Actions</th></tr></thead>
            <tbody>
              ${caseDocs.map(d=>`<tr>
                <td class="fw-600">${d.name}</td>
                <td class="text-xs">${d.type}</td>
                <td class="mono text-xs text-muted">v${d.ver}</td>
                <td>${badge(d.status)}</td>
                <td>${badge(d.integrity)}</td>
                <td>${badge(d.approval)}</td>
                <td><button class="btn btn-outline btn-sm" onclick="openDocInspectModal('${d.id}')">Inspect</button></td>
              </tr>`).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>

  <!-- RECORD TAB -->
  <div class="tab-panel" id="tab-record">
    <div class="card">
      <div class="card-header">
        <h3 class="card-title">Investigation Records & Notes</h3>
        <button class="btn btn-primary btn-sm" onclick="showAddNoteForm()"><i class="fas fa-plus"></i> Add Note</button>
      </div>
      <div id="add-note-form" style="display:none;background:#F9FAFB;border-radius:10px;padding:16px;margin-bottom:16px;border:1px solid var(--border)">
        <textarea id="new-note-text" rows="3" placeholder="Enter investigation note…" style="width:100%;border:1px solid var(--border);border-radius:8px;padding:10px;font-size:13px;font-family:inherit;resize:vertical;outline:none"></textarea>
        <div style="display:flex;gap:8px;margin-top:8px">
          <button class="btn btn-primary btn-sm" onclick="postNote()">Post Note</button>
          <button class="btn btn-ghost btn-sm" onclick="document.getElementById('add-note-form').style.display='none'">Cancel</button>
        </div>
      </div>
      <div class="note-list" id="note-list">
        <div class="note-card">
          <div class="note-header"><span class="note-author">Officer Sharma</span><span class="note-role">Legal Officer</span><span class="note-time">2026-09-01 09:30</span></div>
          <p class="note-text">Initial case assessment completed. Evidence collection ongoing. All physical evidence secured in designated storage.</p>
        </div>
      </div>
    </div>
  </div>

  <!-- EVIDENCE TAB -->
  <div class="tab-panel" id="tab-evidence">
    <div class="card">
      <div class="card-header">
        <h3 class="card-title">Evidence Records</h3>
        <button class="btn btn-primary btn-sm" onclick="showAddEvidenceModal()"><i class="fas fa-plus"></i> Add Evidence</button>
      </div>
      ${caseEvid.length === 0 ? '<div class="empty-state"><i class="fas fa-search"></i><p>No evidence records for this case.</p></div>' :
        caseEvid.map(ev=>`
        <div class="evidence-card" style="margin-bottom:12px">
          <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:12px">
            <div style="flex:1">
              <div style="display:flex;gap:8px;align-items:center;margin-bottom:6px">
                <span class="evidence-id">${ev.id}</span>
                ${badge(ev.status)} ${badge(ev.integrity)}
              </div>
              <div class="text-sm fw-600">${ev.desc}</div>
              <div style="display:grid;grid-template-columns:1fr 1fr;gap:4px 16px;margin-top:10px;font-size:12px;color:var(--text-muted)">
                <span>Type: <b style="color:var(--text)">${ev.type}</b></span>
                <span>Collected by: <b style="color:var(--text)">${ev.by}</b></span>
                <span>Date: <b style="color:var(--text)">${ev.date}</b></span>
                <span>Custodian: <b style="color:var(--text)">${ev.custodian}</b></span>
                <span style="grid-column:span 2">Location: <b style="color:var(--text)">${ev.location}</b></span>
              </div>
            </div>
            <div class="evidence-actions">
              <button class="btn btn-outline btn-sm" onclick="verifyIntegrity('${ev.id}')">Verify</button>
              <button class="btn btn-outline btn-sm" onclick="showToast('Evidence transfer initiated.','success')">Transfer</button>
            </div>
          </div>
        </div>`).join('')}
    </div>
  </div>

  <!-- VICTIM TAB -->
  <div class="tab-panel" id="tab-victim">
    <div class="card">
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:12px">
        <i class="fas fa-lock text-warn"></i>
        <h3 class="card-title" style="margin-bottom:0">Victim Information</h3>
        <span style="background:#FEF3C7;color:#92400E;font-size:10px;padding:2px 8px;border-radius:4px;border:1px solid #FDE68A;font-weight:600">Restricted</span>
      </div>
      <p class="text-xs text-muted" style="margin-bottom:16px">Personal information is masked for privacy. Full details are accessible to authorized personnel only.</p>
      <div class="evidence-card">
        <div class="text-xs mono text-accent fw-600" style="margin-bottom:10px">VIC-2026-0041</div>
        <dl class="dl-grid">
          <dt>Masked Name</dt><dd>R***** K*****</dd>
          <dt>Case ID</dt><dd class="mono text-accent">${c.id}</dd>
          <dt>Statement</dt><dd>${badge('Approved')}</dd>
          <dt>Documents</dt><dd>3</dd>
          <dt>Notes</dt><dd>2</dd>
        </dl>
      </div>
    </div>
  </div>

  <!-- JUDGEMENT TAB -->
  <div class="tab-panel" id="tab-judgement">
    <div class="card">
      <h3 class="card-title">Judgement Record</h3>
      <div class="evidence-card">
        <dl class="dl-grid">
          <dt>Judgement ID</dt><dd class="mono">JDG-2026-000124</dd>
          <dt>Case ID</dt><dd class="mono text-accent">${c.id}</dd>
          <dt>Court</dt><dd>District & Sessions Court, Central</dd>
          <dt>Judgement Date</dt><dd>Pending</dd>
          <dt>Status</dt><dd>${badge('Pending')}</dd>
          <dt>Decision</dt><dd>Pending Hearing</dd>
        </dl>
      </div>
    </div>
  </div>

  <!-- OPENING/CLOSING TAB -->
  <div class="tab-panel" id="tab-status">
    <div class="grid-2">
      <div class="card">
        <h3 class="card-title">Case Status</h3>
        <dl class="dl-grid">
          <dt>Current Status</dt><dd>${badge(c.status)}</dd>
          <dt>Opening Date</dt><dd>${c.created}</dd>
          <dt>Closing Date</dt><dd>—</dd>
          <dt>Authorized By</dt><dd>${c.lead}</dd>
        </dl>
      </div>
      <div class="card">
        <h3 class="card-title">Actions</h3>
        <p class="text-xs text-muted" style="margin-bottom:14px">Every status change creates an audit entry and requires confirmation.</p>
        <div style="display:flex;flex-direction:column;gap:8px">
          <button class="btn btn-danger btn-sm" onclick="confirmAction('Close this case?',()=>{showToast('Case closed. Audit entry created.','success')})">Close Case</button>
          <button class="btn btn-warn btn-sm" onclick="confirmAction('Reopen this case?',()=>{showToast('Case reopened. Audit entry created.','success')})">Reopen Case</button>
        </div>
      </div>
    </div>
  </div>

  <!-- CASE LEAD TAB -->
  <div class="tab-panel" id="tab-lead">
    <div class="card" style="max-width:500px">
      <h3 class="card-title">Case Lead Management</h3>
      <div class="evidence-card" style="margin-bottom:14px">
        <dl class="dl-grid">
          <dt>Current Lead</dt><dd>${c.lead}</dd>
          <dt>Department</dt><dd>${c.dept}</dd>
          <dt>Assigned</dt><dd>${c.created}</dd>
        </dl>
      </div>
      <div class="form-group">
        <label>New Case Lead</label>
        <select id="new-lead-select" style="width:100%;border:1px solid var(--border);border-radius:8px;padding:10px;outline:none;font-size:13px">
          <option value="">Select new lead…</option>
          ${['Officer Sharma','Officer Mehta','Dr. Rao','Advocate Verma'].map(o=>`<option>${o}</option>`).join('')}
        </select>
      </div>
      <div style="display:flex;gap:8px;margin-top:8px">
        <button class="btn btn-secondary btn-sm" onclick="showToast('Case lead updated. Assignment logged.','success')">Assign New Lead</button>
        <button class="btn btn-outline btn-sm" onclick="showLeadHistoryModal()">View History</button>
      </div>
    </div>
  </div>`;
}

function switchTab(id, el) {
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
  el.classList.add('active');
  document.getElementById('tab-' + id)?.classList.add('active');
}
function showAddNoteForm() { document.getElementById('add-note-form').style.display=''; }
function postNote() {
  const text = document.getElementById('new-note-text')?.value?.trim();
  if (!text) return;
  const now = new Date();
  const note = document.createElement('div');
  note.className = 'note-card';
  note.innerHTML = `
    <div class="note-header"><span class="note-author">${STATE.user.name}</span><span class="note-role">${ROLE_LABELS[STATE.user.role]}</span>
    <span class="note-time">${now.toISOString().slice(0,10)} ${now.toTimeString().slice(0,5)}</span></div>
    <p class="note-text">${text}</p>`;
  document.getElementById('note-list').appendChild(note);
  document.getElementById('new-note-text').value = '';
  document.getElementById('add-note-form').style.display = 'none';
  addLog('Note Added', 'case_note', STATE.selectedCase?.id || '—', 'Success');
  showToast('Note added successfully.', 'success');
}

/* ══════════════════════════════════════════════════════════
   SECTION: DOCUMENT MANAGEMENT
══════════════════════════════════════════════════════════ */
function renderDocRegister() {
  const r = STATE.user.role;
  const docs = r === 'citizen'
    ? STATE.docs.filter(d => d.type === 'Witness Statement' || d.by === 'Officer Sharma')
    : STATE.docs;
  return `
  <div class="page-header"><h1 class="page-title">Document Register</h1></div>
  <div class="search-bar">
    <i class="fas fa-search"></i>
    <input type="text" id="doc-search" placeholder="Search documents…" oninput="filterDocs(this.value)" />
  </div>
  <div class="filter-tabs">
    ${['All','Approved','Pending','Under Review','Rejected'].map(s=>`<button class="filter-tab${s==='All'?' active':''}" onclick="setDocFilter('${s}',this)">${s}</button>`).join('')}
  </div>
  <div class="card" style="padding:0">
    <div class="table-wrap">
      <table class="data-table" id="doc-table">
        <thead><tr><th>Document</th><th>Type</th><th>Case</th><th>Dept</th><th>Owner</th><th>Ver</th><th>Status</th><th>Integrity</th><th>Approval</th><th>Updated</th><th>Actions</th></tr></thead>
        <tbody id="doc-tbody">
          ${docs.map(d => docRow(d, r)).join('')}
        </tbody>
      </table>
    </div>
    <div class="table-footer">
      <span>${docs.length} documents</span>
      <div class="pagination">
        <button class="page-btn">← Prev</button>
        <button class="page-btn active">1</button>
        <button class="page-btn">Next →</button>
      </div>
    </div>
  </div>`;
}

function docRow(d, role) {
  const canEdit = ['legal_officer','police','forensic','investigating','sho'].includes(role);
  return `<tr data-status="${d.status}" data-name="${d.name.toLowerCase()}" data-case="${d.caseId.toLowerCase()}">
    <td class="fw-600">${d.name}</td>
    <td class="text-xs">${d.type}</td>
    <td><span class="mono text-xs text-accent">${d.caseId}</span></td>
    <td class="text-xs">${d.dept}</td>
    <td class="text-xs">${d.by}</td>
    <td class="mono text-xs text-muted">v${d.ver}</td>
    <td>${badge(d.status)}</td>
    <td>${badge(d.integrity)}</td>
    <td>${badge(d.approval)}</td>
    <td class="text-xs text-muted">${d.date}</td>
    <td>
      <div style="display:flex;gap:4px">
        <button class="btn btn-outline btn-sm" onclick="openDocInspectModal('${d.id}')">Inspect</button>
        ${canEdit ? `<button class="btn btn-outline btn-sm" onclick="showToast('Document metadata updated.','success')">Update</button>` : ''}
      </div>
    </td>
  </tr>`;
}

function filterDocs(q) {
  document.querySelectorAll('#doc-tbody tr').forEach(row => {
    const name = row.dataset.name || '';
    const caseId = row.dataset.case || '';
    row.style.display = (name.includes(q.toLowerCase()) || caseId.includes(q.toLowerCase())) ? '' : 'none';
  });
}
function setDocFilter(status, el) {
  document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
  el.classList.add('active');
  document.querySelectorAll('#doc-tbody tr').forEach(row => {
    row.style.display = (status === 'All' || row.dataset.status === status) ? '' : 'none';
  });
}

/* ══════════════════════════════════════════════════════════
   SECTION: UPLOAD DOCUMENT
══════════════════════════════════════════════════════════ */
function renderUpload() {
  return `
  <div class="page-header"><h1 class="page-title">Upload Document</h1></div>
  <div class="info-banner">⚠ Prototype: File upload is simulated. No files are actually stored on a server.</div>
  <div style="display:grid;grid-template-columns:1fr 320px;gap:16px;align-items:start" class="upload-layout">
    <div>
      <div class="card" style="margin-bottom:14px">
        <h3 class="card-title">Document Details</h3>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
          ${[['Document Name','upload-name','text','e.g. FIR_000127.pdf'],['Document Type','upload-type','text','e.g. First Information Report'],['Case ID','upload-case','text','CASE-2026-XXXXXX'],['Department','upload-dept','text','e.g. Criminal Investigation'],['Tags','upload-tags','text','comma-separated tags']].map(([l,id,t,ph])=>`
          <div class="form-group"><label>${l}</label><input type="${t}" id="${id}" placeholder="${ph}" style="background:#fff" /></div>`).join('')}
          <div class="form-group"><label>Confidentiality</label>
            <select id="upload-conf" style="background:#fff;width:100%;border:1px solid var(--border);border-radius:8px;padding:10px;outline:none;font-size:13px">
              <option>Public</option><option>Restricted</option><option>Confidential</option><option>Top Secret</option>
            </select>
          </div>
        </div>
        <div class="form-group" style="grid-column:span 2"><label>Description</label><textarea id="upload-desc" rows="3" placeholder="Document description…" style="background:#fff;width:100%;border:1px solid var(--border);border-radius:8px;padding:10px;font-size:13px;font-family:inherit;resize:vertical;outline:none"></textarea></div>
        <div class="form-group"><label>Add Note</label><textarea id="upload-note" rows="2" placeholder="Optional note for reviewers…" style="background:#fff;width:100%;border:1px solid var(--border);border-radius:8px;padding:10px;font-size:13px;font-family:inherit;resize:vertical;outline:none"></textarea></div>
      </div>
    </div>

    <div>
      <div class="dropzone" id="dropzone" ondragover="handleDragOver(event)" ondragleave="handleDragLeave(event)" ondrop="handleDrop(event)" onclick="document.getElementById('file-input').click()">
        <div class="dropzone-icon"><i class="fas fa-cloud-upload-alt"></i></div>
        <div class="dropzone-text" id="dropzone-text">Drag & drop file here</div>
        <div class="dropzone-sub">PDF, DOCX, JPG, PNG, TXT</div>
        <span class="dropzone-link">Browse files</span>
        <input type="file" id="file-input" style="display:none" accept=".pdf,.docx,.jpg,.png,.txt" onchange="handleFileSelect(this)" />
      </div>
      <div id="upload-progress" style="display:none" class="upload-progress">
        <div class="upload-stage"><div class="upload-spinner"></div><span id="upload-stage-text">Uploading…</span></div>
        <div class="progress-bar-wrap"><div class="progress-bar" id="upload-bar" style="width:0%"></div></div>
      </div>
      <div id="upload-done" style="display:none" class="upload-done"><i class="fas fa-check-circle"></i> Document uploaded successfully</div>
      <div style="margin-top:12px;display:flex;flex-direction:column;gap:8px">
        <button class="btn btn-primary" onclick="startUpload()"><i class="fas fa-upload"></i> Upload Document</button>
        <button class="btn btn-outline" onclick="showToast('Metadata modified.','success')">Modify Metadata</button>
      </div>
    </div>
  </div>`;
}

function handleDragOver(e) { e.preventDefault(); document.getElementById('dropzone').classList.add('dragover'); }
function handleDragLeave()  { document.getElementById('dropzone').classList.remove('dragover'); }
function handleDrop(e) {
  e.preventDefault();
  document.getElementById('dropzone').classList.remove('dragover');
  const f = e.dataTransfer.files[0];
  if (f) { document.getElementById('dropzone-text').textContent = f.name; }
}
function handleFileSelect(input) {
  if (input.files[0]) document.getElementById('dropzone-text').textContent = input.files[0].name;
}

function startUpload() {
  const name = document.getElementById('upload-name')?.value?.trim();
  const caseId = document.getElementById('upload-case')?.value?.trim();
  if (!name || !caseId) { showToast('Document name and case ID are required.', 'warning'); return; }

  const stages = ['Uploading…','Validating…','Generating SHA-256…','Extracting metadata…','Creating audit record…'];
  const prog = document.getElementById('upload-progress');
  const bar  = document.getElementById('upload-bar');
  const stageText = document.getElementById('upload-stage-text');
  const done = document.getElementById('upload-done');
  prog.style.display = ''; done.style.display = 'none';

  // TODO: API — POST /api/documents/upload
  let i = 0;
  const iv = setInterval(() => {
    stageText.textContent = stages[i];
    bar.style.width = ((i + 1) / stages.length * 100) + '%';
    i++;
    if (i >= stages.length) {
      clearInterval(iv);
      setTimeout(() => {
        prog.style.display = 'none';
        done.style.display = '';
        addLog('Document Uploaded', name, caseId, 'Success');
        showToast('Document uploaded successfully.', 'success');
      }, 500);
    }
  }, 700);
}

/* ══════════════════════════════════════════════════════════
   SECTION: REVISION HISTORY
══════════════════════════════════════════════════════════ */
function renderRevision() {
  return `
  <div class="page-header">
    <h1 class="page-title">Revision History</h1>
    <div class="page-actions">
      <button class="btn btn-outline btn-sm" onclick="sortRevisions()"><i class="fas fa-sort"></i> Sort</button>
      <button class="btn btn-outline btn-sm" onclick="render()"><i class="fas fa-sync-alt"></i> Refresh</button>
    </div>
  </div>
  <div class="search-bar">
    <i class="fas fa-search"></i>
    <input type="text" id="rev-search" placeholder="Search documents or users…" oninput="filterRevisions(this.value)" />
  </div>
  <div class="card" style="padding:0">
    <div class="table-wrap">
      <table class="data-table" id="rev-table">
        <thead><tr><th>Document</th><th>Version</th><th>User</th><th>Timestamp</th><th>Reason</th><th>Hash</th><th>Status</th><th>Actions</th></tr></thead>
        <tbody>
          ${STATE.revisions.map(r=>`<tr data-doc="${r.doc.toLowerCase()}" data-user="${r.user.toLowerCase()}">
            <td class="fw-600">${r.doc}</td>
            <td class="mono text-accent">${r.ver}</td>
            <td>${r.user}</td>
            <td class="mono text-xs text-muted">${r.ts}</td>
            <td class="text-xs" style="max-width:160px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${r.reason}</td>
            <td class="mono text-xs text-muted">${r.hash.slice(0,12)}…</td>
            <td>${badge(r.status)}</td>
            <td>
              <div style="display:flex;gap:4px">
                <button class="btn btn-outline btn-sm" onclick="openRevisionModal(${JSON.stringify(r).replace(/"/g,'&quot;')})">View</button>
                <button class="btn btn-outline btn-sm" onclick="showToast('Version restored.','success')">Restore</button>
              </div>
            </td>
          </tr>`).join('')}
        </tbody>
      </table>
    </div>
  </div>`;
}
function filterRevisions(q) {
  document.querySelectorAll('#rev-table tbody tr').forEach(row => {
    const match = (row.dataset.doc||'').includes(q.toLowerCase()) || (row.dataset.user||'').includes(q.toLowerCase());
    row.style.display = match ? '' : 'none';
  });
}
let revSortDesc = true;
function sortRevisions() {
  revSortDesc = !revSortDesc;
  STATE.revisions.sort((a,b) => revSortDesc ? b.ts.localeCompare(a.ts) : a.ts.localeCompare(b.ts));
  render();
}

/* ══════════════════════════════════════════════════════════
   SECTION: APPROVALS
══════════════════════════════════════════════════════════ */
function renderApprovals() {
  return `
  <div class="page-header"><h1 class="page-title">Approvals</h1></div>
  <div class="filter-tabs">
    ${['All','Pending','Approved','Rejected','Reinvestigation'].map(s=>`<button class="filter-tab${s==='All'?' active':''}" onclick="filterApprovals('${s}',this)">${s} (${s==='All'?STATE.approvals.length:STATE.approvals.filter(a=>a.status===s).length})</button>`).join('')}
  </div>
  <div id="approval-list">
    ${STATE.approvals.map(renderApprovalCard).join('') || '<div class="empty-state"><i class="fas fa-inbox"></i><p>No approvals found.</p></div>'}
  </div>`;
}
function renderApprovalCard(ap) {
  return `
  <div class="approval-card" style="margin-bottom:12px" data-status="${ap.status}">
    <div class="approval-card-header">
      <div>
        <div style="display:flex;gap:8px;align-items:center;margin-bottom:4px">
          <span class="mono text-xs text-muted">${ap.id}</span>${badge(ap.status)}
        </div>
        <div class="fw-600" style="font-size:15px">${ap.docName}</div>
        <div style="display:flex;gap:14px;margin-top:6px;font-size:12px;color:var(--text-muted)">
          <span>Case: <span class="mono text-accent">${ap.caseId}</span></span>
          <span>Requester: <b>${ap.requester}</b></span>
          <span>Date: ${ap.date}</span>
        </div>
      </div>
    </div>
    ${ap.status === 'Pending' ? `
    <div class="approval-card-actions">
      <button class="btn btn-success btn-sm" onclick="updateApproval('${ap.id}','Approved')">Approve</button>
      <button class="btn btn-danger btn-sm" onclick="updateApproval('${ap.id}','Rejected')">Reject</button>
      <button class="btn btn-warn btn-sm" onclick="updateApproval('${ap.id}','Reinvestigation')">Reinvestigation</button>
      <button class="btn btn-outline btn-sm" onclick="openDocInspectModal('${ap.docId}')">View</button>
    </div>` : ''}
  </div>`;
}
function filterApprovals(status, el) {
  document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
  el.classList.add('active');
  document.querySelectorAll('.approval-card').forEach(card => {
    card.style.display = (status === 'All' || card.dataset.status === status) ? '' : 'none';
  });
}
function updateApproval(id, status) {
  // TODO: API — PATCH /api/approvals/:id { status }
  const ap = STATE.approvals.find(a => a.id === id);
  if (ap) { ap.status = status; saveState(); }
  const msgs = { Approved:'Document approved.', Rejected:'Document rejected.', Reinvestigation:'Reinvestigation requested.' };
  const types = { Approved:'success', Rejected:'error', Reinvestigation:'warning' };
  addLog(`Approval: ${status}`, ap?.docName || '—', ap?.caseId || '—', 'Success');
  showToast(msgs[status], types[status]);
  render();
}

/* ══════════════════════════════════════════════════════════
   SECTION: REVIEWS
══════════════════════════════════════════════════════════ */
function renderReviews() {
  return `
  <div class="page-header">
    <h1 class="page-title">Case Reviews</h1>
    <button class="btn btn-primary" onclick="toggleAddReview()"><i class="fas fa-plus"></i> Add Review</button>
  </div>
  <div id="add-review-form" style="display:none" class="card" style="margin-bottom:14px">
    <h3 class="card-title">New Review</h3>
    <div class="form-group"><label>Case ID</label><input type="text" id="rev-case" placeholder="CASE-2026-XXXXXX" style="background:#fff" /></div>
    <div class="form-group"><label>Review</label><textarea id="rev-content" rows="4" placeholder="Write your review…" style="background:#fff;width:100%;border:1px solid var(--border);border-radius:8px;padding:10px;font-size:13px;font-family:inherit;resize:vertical;outline:none"></textarea></div>
    <div style="display:flex;gap:8px">
      <button class="btn btn-primary btn-sm" onclick="postReview()">Post Review</button>
      <button class="btn btn-ghost btn-sm" onclick="toggleAddReview()">Cancel</button>
    </div>
  </div>
  <div class="search-bar">
    <i class="fas fa-search"></i>
    <input type="text" id="review-search" placeholder="Search reviews…" oninput="filterReviews(this.value)" />
  </div>
  <div id="review-list" style="display:flex;flex-direction:column;gap:12px">
    ${STATE.reviews.map(renderReviewCard).join('')}
  </div>`;
}
function renderReviewCard(r) {
  return `
  <div class="review-card" data-content="${r.content.toLowerCase()}" data-reviewer="${r.reviewer.toLowerCase()}">
    <div class="reviewer-row">
      <div class="reviewer-avatar">${r.reviewer.charAt(0)}</div>
      <div>
        <div class="reviewer-name">${r.reviewer}</div>
        <div class="reviewer-meta">${r.role} · <span class="mono text-accent">${r.caseId}</span> · ${r.date}</div>
      </div>
      ${badge(r.status)}
    </div>
    <p class="review-text">${r.content}</p>
  </div>`;
}
function filterReviews(q) {
  document.querySelectorAll('.review-card').forEach(c => {
    const match = (c.dataset.content||'').includes(q.toLowerCase()) || (c.dataset.reviewer||'').includes(q.toLowerCase());
    c.style.display = match ? '' : 'none';
  });
}
function toggleAddReview() {
  const f = document.getElementById('add-review-form');
  f.style.display = f.style.display === 'none' ? '' : 'none';
}
function postReview() {
  const caseId = document.getElementById('rev-case')?.value?.trim();
  const content = document.getElementById('rev-content')?.value?.trim();
  if (!caseId || !content) { showToast('Case ID and review are required.', 'warning'); return; }
  const rev = { id:`REV-${String(STATE.reviews.length+1).padStart(3,'0')}`, reviewer:STATE.user.name, role:ROLE_LABELS[STATE.user.role], caseId, date:new Date().toISOString().slice(0,10), content, status:'Posted' };
  STATE.reviews.unshift(rev);
  saveState();
  addLog('Review Posted', caseId, caseId, 'Success');
  showToast('Review posted successfully.', 'success');
  render();
}

/* ══════════════════════════════════════════════════════════
   SECTION: TRANSFER CASE
══════════════════════════════════════════════════════════ */
let TC_STATE = { caseId:'', lead:'' };

function renderTransfer() {
  const caseOptions = STATE.cases.map(c => ({ value:c.id, label:`${c.id} — ${c.name.slice(0,40)}` }));
  const leadOptions = ['Officer Sharma','Officer Mehta','Dr. Rao','Advocate Verma'].map(o => ({ value:o, label:o }));
  const selCase = STATE.cases.find(c => c.id === TC_STATE.caseId);
  return `
  <div class="page-header"><h1 class="page-title">Transfer Case</h1></div>
  <div class="form-card">
    <div class="form-group">
      <label>Select Case</label>
      ${renderCustomDropdown('tc-case-dd', TC_STATE.caseId, 'Choose a case…', caseOptions, "tcSelectCase(this.dataset.v)")}
    </div>
    ${selCase ? `<div style="background:#F9FAFB;border:1px solid var(--border);border-radius:8px;padding:10px 14px;font-size:12px;color:var(--text-muted);margin-bottom:14px">
      Current Lead: <b style="color:var(--text)">${selCase.lead}</b>
      <span style="margin:0 8px;color:var(--border)">·</span>Status: <b style="color:var(--text)">${selCase.status}</b>
    </div>` : ''}
    <div class="form-group">
      <label>New Case Lead</label>
      ${renderCustomDropdown('tc-lead-dd', TC_STATE.lead, 'Select new lead…', leadOptions, "tcSelectLead(this.dataset.v)")}
    </div>
    <div class="form-group"><label>Reason for Transfer</label><textarea id="transfer-reason" rows="3" placeholder="Reason for transferring the case…" style="background:#fff;width:100%;border:1px solid var(--border);border-radius:8px;padding:10px;font-size:13px;font-family:inherit;resize:vertical;outline:none"></textarea></div>
    <div class="form-group"><label>Transfer Date</label><input type="date" id="transfer-date" style="background:#fff;width:100%;border:1px solid var(--border);border-radius:8px;padding:10px;outline:none;font-size:13px" /></div>
    <button class="btn btn-primary btn-full" onclick="confirmTransfer()"><i class="fas fa-exchange-alt"></i> Confirm Transfer</button>
  </div>`;
}

function renderCustomDropdown(id, currentVal, placeholder, options, onSelectFn) {
  const selected = options.find(o => o.value === currentVal);
  const maxH = options.length > 8 ? 'max-height:260px;overflow-y:auto;' : '';
  return `
  <div style="position:relative" id="${id}-wrap" class="ember-dd-wrap">
    <button type="button" onclick="toggleDropdown('${id}')"
      style="width:100%;display:flex;align-items:center;justify-content:space-between;background:#fff;border:1px solid var(--border);border-radius:8px;padding:10px 12px;font-size:13px;cursor:pointer;font-family:inherit;color:${selected?'var(--text)':'var(--text-light)'};outline:none;text-align:left">
      <span>${selected ? selected.label : placeholder}</span>
      <svg width="12" height="8" viewBox="0 0 12 8" fill="none"><path d="M1 1l5 5 5-5" stroke="#9CA3AF" stroke-width="1.5" stroke-linecap="round"/></svg>
    </button>
    <div id="${id}-list" style="display:none;position:absolute;left:0;right:0;top:calc(100% + 4px);background:#fff;border:1px solid var(--border);border-radius:10px;box-shadow:0 4px 16px rgba(0,0,0,.1);z-index:200;overflow:hidden;${maxH}">
      ${options.map(opt=>`
      <button type="button" data-v="${opt.value}" onclick="${onSelectFn};closeAllDropdowns()"
        style="width:100%;background:${currentVal===opt.value?'var(--dark)':'#fff'};color:${currentVal===opt.value?'#fff':'var(--text)'};border:none;padding:10px 14px;font-size:13px;cursor:pointer;font-family:inherit;text-align:left;display:block"
        onmouseover="if(this.dataset.v!=='${currentVal}')this.style.background='#F9FAFB'" onmouseout="if(this.dataset.v!=='${currentVal}')this.style.background='#fff'">
        ${opt.label}
      </button>`).join('')}
    </div>
  </div>`;
}

function toggleDropdown(id) {
  const list = document.getElementById(id + '-list');
  if (!list) return;
  const isOpen = list.classList.contains('dd-open');
  closeAllDropdowns();
  if (!isOpen) {
    list.style.display = '';
    list.classList.add('dd-open');
  }
}

function closeAllDropdowns() {
  document.querySelectorAll('.dd-open').forEach(el => {
    el.style.display = 'none';
    el.classList.remove('dd-open');
  });
}

/* legacy alias kept for any remaining direct callers */
function tcToggleDropdown(id) { toggleDropdown(id); }
function tcSelectCase(caseId) {
  TC_STATE.caseId = caseId;
  document.getElementById('page-content').innerHTML = renderTransfer();
}
function tcSelectLead(lead) {
  TC_STATE.lead = lead;
  document.getElementById('page-content').innerHTML = renderTransfer();
}
document.addEventListener('click', function(e) {
  if (!e.target.closest('.ember-dd-wrap')) {
    closeAllDropdowns();
  }
});
function confirmTransfer() {
  const caseId = TC_STATE.caseId;
  const lead   = TC_STATE.lead;
  const reason = document.getElementById('transfer-reason')?.value?.trim();
  if (!caseId || !lead || !reason) { showToast('All fields are required.', 'warning'); return; }
  // TODO: API — POST /api/cases/:id/transfer
  confirmAction(`Transfer ${caseId} to ${lead}?`, () => {
    const c = STATE.cases.find(x => x.id === caseId);
    if (c) { c.lead = lead; saveState(); }
    addLog('Case Transferred', caseId, caseId, 'Success');
    TC_STATE = { caseId:'', lead:'' };
    showToast('Case transferred successfully. Audit entry created.', 'success');
    render();
  });
}

/* ══════════════════════════════════════════════════════════
   SECTION: SIGN TO APPROVE
══════════════════════════════════════════════════════════ */
let SIGN_STATE = { docId: '' };

function renderSign() {
  const pending = STATE.docs.filter(d => d.approval === 'Pending');
  const docOptions = pending.map(d => ({ value: d.id, label: d.name }));
  return `
  <div class="page-header"><h1 class="page-title">Sign to Approve</h1></div>
  <div class="info-banner">⚠ Prototype signature — production deployment requires a legally compliant digital-signature / PKI service.</div>
  <div class="form-card">
    <div class="form-group">
      <label>Select Document to Sign</label>
      ${renderCustomDropdown('sign-doc-dd', SIGN_STATE.docId, 'Choose a document…', docOptions, 'signSelectDoc(this.dataset.v)')}
    </div>
    <div id="sign-info" style="${SIGN_STATE.docId ? '' : 'display:none'}">
      <div class="sign-info">
        <dl class="dl-grid" id="sign-dl"></dl>
        <div style="margin-top:12px"><div class="text-xs text-muted" style="margin-bottom:4px">SHA-256 Hash</div><div class="hash-box" id="sign-hash"></div></div>
      </div>
      <div id="sign-done" style="display:none" class="sign-success" style="margin-bottom:12px">
        <div class="sign-success-icon"><i class="fas fa-check-circle"></i></div>
        <div><div class="sign-success-text">Signature Applied</div><div class="sign-success-sub" id="sign-ts"></div></div>
      </div>
      <button id="sign-btn" class="btn btn-primary btn-full" onclick="performSign()"><i class="fas fa-pen"></i> Sign & Approve</button>
    </div>
  </div>`;
}
function signSelectDoc(docId) {
  SIGN_STATE.docId = docId;
  document.getElementById('page-content').innerHTML = renderSign();
  if (docId) showDocSignInfo(docId);
}
function showDocSignInfo(docId) {
  const d = STATE.docs.find(x => x.id === docId);
  if (!d) return;
  const info = document.getElementById('sign-info');
  if (info) info.style.display = '';
  const done = document.getElementById('sign-done');
  if (done) done.style.display = 'none';
  const btn = document.getElementById('sign-btn');
  if (btn) btn.style.display = '';
  const dl = document.getElementById('sign-dl');
  if (dl) dl.innerHTML = `
    <dt>Document</dt><dd>${d.name}</dd>
    <dt>Case</dt><dd class="mono text-accent">${d.caseId}</dd>
    <dt>Version</dt><dd class="mono">v${d.ver}</dd>
    <dt>Approval Status</dt><dd>${badge(d.approval)}</dd>
    <dt>Integrity</dt><dd>${badge(d.integrity)}</dd>
    <dt>Signer</dt><dd>${STATE.user.name}</dd>
    <dt>Timestamp</dt><dd class="mono">${new Date().toISOString().slice(0,19).replace('T',' ')}</dd>`;
  const hashEl = document.getElementById('sign-hash');
  if (hashEl) hashEl.textContent = d.hash;
}
function performSign() {
  const docId = SIGN_STATE.docId;
  const btn = document.getElementById('sign-btn');
  btn.innerHTML = '<div class="upload-spinner"></div> Signing…'; btn.disabled = true;
  // TODO: API — POST /api/documents/:id/sign
  setTimeout(() => {
    const d = STATE.docs.find(x => x.id === docId);
    if (d) { d.approval = 'Approved'; saveState(); }
    const ts = new Date().toISOString().slice(0,19).replace('T',' ');
    document.getElementById('sign-done').style.display = '';
    document.getElementById('sign-ts').textContent = 'Document signed at ' + ts;
    btn.style.display = 'none';
    SIGN_STATE.docId = '';
    addLog('Document Signed', d?.name || '—', d?.caseId || '—', 'Success');
    showToast('Document signed and approved.', 'success');
  }, 2000);
}

/* ══════════════════════════════════════════════════════════
   SECTION: GENERATE REPORT
══════════════════════════════════════════════════════════ */
let REP_STATE = { type: '', caseId: '', dept: '' };

function renderReport() {
  const reportTypes = ['Case Report','Document Report','Approval Report','Evidence Report','Revision Report','Activity Report','Integrity Report','Compliance Report'];
  const depts = ['Criminal Investigation','Forensic Science','Legal','Court','Cyber Cell'];
  return `
  <div class="page-header"><h1 class="page-title">Generate Report</h1></div>
  <div class="form-card">
    <div class="form-group">
      <label>Report Type</label>
      ${renderCustomDropdown('rep-type-dd', REP_STATE.type, 'Select report type…', reportTypes.map(t=>({value:t,label:t})), 'repSet("type",this.dataset.v)')}
    </div>
    <div class="form-group">
      <label>Case (Optional)</label>
      ${renderCustomDropdown('rep-case-dd', REP_STATE.caseId, 'All Cases', [{value:'',label:'All Cases'},...STATE.cases.map(c=>({value:c.id,label:c.id}))], 'repSet("caseId",this.dataset.v)')}
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
      <div class="form-group"><label>From Date</label><input type="date" id="rep-from" style="background:#fff;width:100%;border:1px solid var(--border);border-radius:8px;padding:10px;outline:none;font-size:13px" /></div>
      <div class="form-group"><label>To Date</label><input type="date" id="rep-to" style="background:#fff;width:100%;border:1px solid var(--border);border-radius:8px;padding:10px;outline:none;font-size:13px" /></div>
    </div>
    <div class="form-group">
      <label>Department</label>
      ${renderCustomDropdown('rep-dept-dd', REP_STATE.dept, 'All Departments', [{value:'',label:'All Departments'},...depts.map(d=>({value:d,label:d}))], 'repSet("dept",this.dataset.v)')}
    </div>
    <button class="btn btn-primary btn-full" onclick="generateReport()"><i class="fas fa-chart-bar"></i> Generate Report</button>
  </div>`;
}
function repSet(key, val) {
  REP_STATE[key] = val;
  document.getElementById('page-content').innerHTML = renderReport();
}
function generateReport() {
  const type = REP_STATE.type;
  if (!type) { showToast('Please select a report type.', 'warning'); return; }
  const caseId = REP_STATE.caseId || 'All';
  const from   = document.getElementById('rep-from')?.value  || 'All';
  const to     = document.getElementById('rep-to')?.value    || 'All';
  const dept   = REP_STATE.dept || 'All';
  const count  = Math.floor(Math.random() * 50) + 10;
  const repId  = 'RPT-' + Math.random().toString(36).slice(2,8).toUpperCase();
  openModal('Report Preview: ' + type, `
    <div class="report-header">
      <div><div class="report-brand">EMBER</div><div class="report-brand-sub">Secure Digital Document Management System</div></div>
      <div class="report-meta"><div>Generated: ${new Date().toLocaleDateString()}</div><div>Report ID: ${repId}</div></div>
    </div>
    <h3 class="fw-600" style="margin-bottom:14px">${type}</h3>
    <dl class="dl-grid" style="margin-bottom:16px">
      <dt>Period</dt><dd>${from} — ${to}</dd>
      <dt>Department</dt><dd>${dept}</dd>
      <dt>Case</dt><dd>${caseId}</dd>
      <dt>Generated By</dt><dd>${STATE.user.name}</dd>
    </dl>
    <div class="report-section">
      <p class="text-sm" style="margin-bottom:8px"><b>Summary:</b> This report covers all ${type.toLowerCase()} within the selected parameters.</p>
      <p class="text-sm" style="margin-bottom:4px">Total records found: <b>${count}</b></p>
      <p class="text-sm">Compliance status: <b class="text-success">Compliant</b></p>
    </div>
    <div class="modal-footer" style="margin-top:18px;padding:0">
      <button class="btn btn-secondary btn-sm" onclick="showToast('Report exported as PDF.','success');closeModalDirect()"><i class="fas fa-download"></i> Export PDF</button>
      <button class="btn btn-outline btn-sm" onclick="closeModalDirect()">Close</button>
    </div>`);
}

/* ══════════════════════════════════════════════════════════
   SECTION: ACTIVITY LOGS
══════════════════════════════════════════════════════════ */
function renderLogs() {
  return `
  <div class="page-header"><h1 class="page-title">Activity Logs</h1></div>
  <div class="filter-tabs">
    ${['All','Success','Failure','Warning'].map(s=>`<button class="filter-tab${s==='All'?' active':''}" onclick="filterLogs('${s}',this)">${s}</button>`).join('')}
  </div>
  <div class="card" style="padding:0">
    <div class="table-wrap">
      <table class="data-table" id="log-table">
        <thead><tr><th>Timestamp</th><th>User</th><th>Role</th><th>Action</th><th>Resource</th><th>Case</th><th>Result</th></tr></thead>
        <tbody>
          ${STATE.logs.map(l=>`<tr data-result="${l.result}">
            <td class="mono text-xs text-muted">${l.ts}</td>
            <td>${l.user}</td>
            <td class="text-xs text-muted">${l.role}</td>
            <td>${l.action}</td>
            <td class="text-xs" style="max-width:150px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${l.resource}</td>
            <td class="mono text-xs text-accent">${l.caseId}</td>
            <td>${badge(l.result)}</td>
          </tr>`).join('')}
        </tbody>
      </table>
    </div>
  </div>`;
}
function filterLogs(status, el) {
  document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
  el.classList.add('active');
  document.querySelectorAll('#log-table tbody tr').forEach(row => {
    row.style.display = (status === 'All' || row.dataset.result === status) ? '' : 'none';
  });
}

/* ══════════════════════════════════════════════════════════
   SECTION: NOTIFICATIONS
══════════════════════════════════════════════════════════ */
function renderNotifications() {
  return `
  <div class="page-header">
    <h1 class="page-title">Notifications</h1>
    <button class="btn btn-outline btn-sm" onclick="markAllRead()">Mark all as read</button>
  </div>
  <div style="display:flex;flex-direction:column;gap:10px" id="notif-list">
    ${STATE.notifications.map(n => notifCard(n)).join('')}
  </div>`;
}
function notifCard(n) {
  const dotCol = n.read ? '#D1D5DB' : (n.severity==='critical' ? '#EF4444' : n.severity==='warning' ? '#F59E0B' : '#C2410C');
  return `
  <div class="notif-card${n.read?'':' unread'}" data-id="${n.id}">
    <div class="notif-dot-ind" style="background:${dotCol}"></div>
    <div class="notif-content">
      <div class="notif-type">${n.type}</div>
      <div class="notif-msg">${n.msg}</div>
      <div class="notif-time">${n.ts}</div>
    </div>
    ${!n.read ? `<button class="mark-read-btn" onclick="markRead('${n.id}')">Mark read</button>` : ''}
  </div>`;
}
function markRead(id) {
  const n = STATE.notifications.find(x => x.id === id);
  if (n) { n.read = true; saveState(); }
  buildSidebar(); updateTopBar(); render();
}
function markAllRead() {
  STATE.notifications.forEach(n => n.read = true);
  saveState(); buildSidebar(); updateTopBar(); render();
}

/* ══════════════════════════════════════════════════════════
   SECTION: SECURITY ALERTS
══════════════════════════════════════════════════════════ */
function renderSecurity() {
  const counts = {
    CRITICAL: STATE.alerts.filter(a=>a.severity==='CRITICAL').length,
    WARNING:  STATE.alerts.filter(a=>a.severity==='WARNING').length,
    NORMAL:   STATE.alerts.filter(a=>a.severity==='NORMAL').length,
  };
  return `
  <div class="page-header"><h1 class="page-title">Security Alerts</h1></div>
  <div class="stat-grid" style="margin-bottom:20px">
    <div class="stat-card"><div class="stat-label">Critical</div><div class="stat-value stat-danger">${counts.CRITICAL}</div></div>
    <div class="stat-card"><div class="stat-label">Warning</div><div class="stat-value stat-warn">${counts.WARNING}</div></div>
    <div class="stat-card"><div class="stat-label">Normal</div><div class="stat-value stat-success">${counts.NORMAL}</div></div>
  </div>
  <div style="display:flex;flex-direction:column;gap:12px">
    ${STATE.alerts.map(a => `
    <div class="alert-card ${a.severity.toLowerCase()}">
      <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:12px">
        <div>
          <div style="display:flex;gap:8px;margin-bottom:8px">${badge(a.severity)} ${badge(a.status)}</div>
          <div class="fw-600">${a.type}</div>
          <p class="text-sm text-muted" style="margin-top:4px">${a.desc}</p>
          <div class="mono text-xs text-muted" style="margin-top:8px">${a.ts}</div>
        </div>
        ${a.status !== 'Resolved' ? `<button class="btn btn-outline btn-sm" onclick="resolveAlert('${a.id}')">Resolve</button>` : ''}
      </div>
    </div>`).join('')}
  </div>`;
}
function resolveAlert(id) {
  const a = STATE.alerts.find(x => x.id === id);
  if (a) { a.status = 'Resolved'; saveState(); }
  showToast('Alert resolved.', 'success'); render();
}

/* ══════════════════════════════════════════════════════════
   SECTION: INTEGRITY LEDGER
══════════════════════════════════════════════════════════ */
function renderLedger() {
  return `
  <div class="page-header">
    <h1 class="page-title">Integrity Ledger</h1>
    <button class="btn btn-primary" onclick="verifyLedger()"><i class="fas fa-link"></i> Verify Ledger Integrity</button>
  </div>
  <div class="info-banner">⚠ Frontend prototype — ledger is simulated. Production requires an immutable audit backend.</div>
  <div id="ledger-verified" style="display:none" class="success-banner" style="margin-bottom:14px">
    <i class="fas fa-check-circle"></i> ✓ Ledger integrity verified. All ${LEDGER_RECORDS.length} records confirmed. Hash chain intact.
  </div>
  <div class="ledger-list">
    ${LEDGER_RECORDS.map((r,i) => `
    <div class="ledger-record">
      <div class="ledger-grid">
        <div class="ledger-field"><span>Record</span><span class="mono text-accent">${r.id}</span></div>
        <div class="ledger-field"><span>Document</span><span class="mono">${r.docId}</span></div>
        <div class="ledger-field"><span>Case</span><span class="mono text-accent">${r.caseId}</span></div>
        <div class="ledger-field"><span>Action</span><span>${r.action}</span></div>
        <div class="ledger-field"><span>User</span><span>${r.user}</span></div>
        <div class="ledger-field"><span>Current Hash</span><span class="mono">${r.cur}…</span></div>
        <div class="ledger-field"><span>Status</span><span>${badge(r.status)}</span></div>
      </div>
      <div class="ledger-prev">Prev: ${r.prev} · Timestamp: ${r.ts}</div>
    </div>
    ${i < LEDGER_RECORDS.length - 1 ? '<div class="ledger-connector"><div class="ledger-connector-line"></div></div>' : ''}
    `).join('')}
  </div>`;
}
function verifyLedger() {
  // TODO: API — POST /api/ledger/verify
  const btn = document.querySelector('[onclick="verifyLedger()"]');
  btn.innerHTML = '<div class="upload-spinner"></div> Verifying…'; btn.disabled = true;
  setTimeout(() => {
    btn.innerHTML = '<i class="fas fa-link"></i> Verify Ledger Integrity'; btn.disabled = false;
    document.getElementById('ledger-verified').style.display = '';
    showToast('Ledger integrity verified. All records intact.', 'success');
  }, 2000);
}

/* ══════════════════════════════════════════════════════════
   SECTION: VIEW / CONTENT ACCESS (LAWYER)
══════════════════════════════════════════════════════════ */
function renderViewContent() {
  const docs = STATE.docs.filter(d => d.approval === 'Approved');
  return `
  <div class="page-header"><h1 class="page-title">View / Content Access</h1></div>
  <p class="text-sm text-muted" style="margin-bottom:16px">Authorized documents you can access based on your role and case assignments.</p>
  ${docs.length === 0 ? '<div class="empty-state"><i class="fas fa-file-times"></i><p>No authorized documents found.</p></div>' :
    docs.map(d=>`
    <div class="card" style="margin-bottom:12px">
      <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:12px">
        <div>
          <div style="display:flex;gap:8px;margin-bottom:4px"><span class="mono text-xs text-muted">${d.id}</span>${badge(d.approval)} ${badge(d.integrity)}</div>
          <div class="fw-600" style="font-size:15px">${d.name}</div>
          <div style="display:flex;gap:14px;margin-top:6px;font-size:12px;color:var(--text-muted)">
            <span>Case: <span class="mono text-accent">${d.caseId}</span></span>
            <span>Type: ${d.type}</span>
            <span>Version: v${d.ver}</span>
            <span>Signature: <b class="text-success">Present</b></span>
          </div>
        </div>
        <button class="btn btn-secondary btn-sm" onclick="showToast('Document opened in secure viewer.','success')"><i class="fas fa-eye"></i> View</button>
      </div>
    </div>`).join('')}`;
}

/* ══════════════════════════════════════════════════════════
   SECTION: ANALYZE / INSIGHT ACCESS (LAWYER)
══════════════════════════════════════════════════════════ */
const AI_INSIGHTS = [
  'Evidence is consistent across all documents. Key witnesses identified. Forensic analysis confirms presence at scene. Related cases: CASE-2026-000089 (similar M.O.). Recommend gathering additional digital evidence before proceeding.',
  'Financial records show systematic diversion of funds over 14 months. Cross-referencing bank statements with audit reports reveals three distinct transfer patterns. Recommend forensic accounting review.',
  'IP traces logged in system access records correlate with known threat actor signatures. Evidence chain is intact. Recommend coordinating with Cyber Cell for deeper network forensics.',
];

function renderAnalyze() {
  return `
  <div class="page-header"><h1 class="page-title">Analyze / Aggregate / Insight Access</h1></div>
  <div class="info-banner">AI-generated insight. Verify original documents before making legal or investigative decisions.</div>
  <div class="form-card" style="margin-bottom:16px">
    <div class="form-group">
      <label>Select Case to Analyze</label>
      <select id="analyze-case" style="background:#fff;width:100%;border:1px solid var(--border);border-radius:8px;padding:10px;outline:none;font-size:13px">
        <option value="">Choose a case…</option>
        ${STATE.cases.map((c,i)=>`<option value="${i}">${c.id} — ${c.name.slice(0,40)}</option>`).join('')}
      </select>
    </div>
    <button class="btn btn-primary btn-full" onclick="runAnalysis()"><i class="fas fa-brain"></i> Generate Insight</button>
  </div>
  <div id="ai-result" style="display:none" class="ai-result">
    <div class="ai-label">
      <i class="fas fa-brain" style="color:#7C3AED"></i>
      <span class="fw-600">NyayaAI Insight</span>
      <span class="ai-badge">AI Generated</span>
    </div>
    <p class="ai-text" id="ai-text"></p>
    <div class="ai-chips">
      <button class="btn btn-outline btn-sm" onclick="showToast('Related documents identified.','success')">Related Documents</button>
      <button class="btn btn-outline btn-sm" onclick="showToast('Evidence overview generated.','success')">Evidence Overview</button>
      <button class="btn btn-outline btn-sm" onclick="showToast('Summary generated.','success')">Generate Summary</button>
    </div>
    <p class="ai-disclaimer">AI-generated information. Verify original documents before making legal or investigative decisions.</p>
  </div>`;
}
function runAnalysis() {
  const idx = document.getElementById('analyze-case')?.value;
  if (idx === '') { showToast('Select a case to analyze.', 'warning'); return; }
  const btn = document.querySelector('[onclick="runAnalysis()"]');
  btn.innerHTML = '<div class="upload-spinner"></div> Analyzing…'; btn.disabled = true;
  // TODO: API — POST /api/ai/analyze
  setTimeout(() => {
    btn.innerHTML = '<i class="fas fa-brain"></i> Generate Insight'; btn.disabled = false;
    document.getElementById('ai-result').style.display = '';
    document.getElementById('ai-text').textContent = AI_INSIGHTS[+idx % AI_INSIGHTS.length];
  }, 2500);
}

/* ══════════════════════════════════════════════════════════
   SECTION: SETTINGS
══════════════════════════════════════════════════════════ */
function renderSettings() {
  const u = STATE.user;
  return `
  <div class="page-header"><h1 class="page-title">Settings</h1></div>
  <div style="max-width:560px;display:flex;flex-direction:column;gap:14px">
    <div class="card">
      <h3 class="card-title">Profile</h3>
      <dl class="dl-grid">
        <dt>Name</dt><dd>${u.name}</dd>
        <dt>Email</dt><dd>${u.email}</dd>
        <dt>Role</dt><dd class="text-accent fw-600">${ROLE_LABELS[u.role]}</dd>
        <dt>Department</dt><dd>${u.dept}</dd>
      </dl>
    </div>
    <div class="card">
      <h3 class="card-title">Change Password</h3>
      ${['Current Password','New Password','Confirm New Password'].map(l=>`<div class="form-group"><label>${l}</label><input type="password" placeholder="••••••••" style="background:#fff" /></div>`).join('')}
      <button class="btn btn-secondary btn-sm" onclick="showToast('Password updated successfully.','success')">Update Password</button>
    </div>
    <div class="card">
      <h3 class="card-title">Notifications</h3>
      ${['Email Notifications','Security Alerts','Approval Requests','Document Updates','Case Transfers'].map(n=>`
      <div class="toggle-row"><span class="toggle-label">${n}</span><div class="toggle-switch" onclick="showToast('Setting updated.','success')"></div></div>`).join('')}
    </div>
    <div class="card">
      <h3 class="card-title">Appearance</h3>
      <div class="toggle-row">
        <span class="toggle-label">Dark Mode</span>
        <button class="btn btn-outline btn-sm" onclick="toggleDarkMode()">Toggle</button>
      </div>
    </div>
  </div>`;
}
function toggleDarkMode() { document.body.classList.toggle('dark'); showToast('Theme updated.', 'success'); }

/* ══════════════════════════════════════════════════════════
   SECTION: GLOBAL SEARCH
══════════════════════════════════════════════════════════ */
function handleGlobalSearch(q) {
  if (!q || q.length < 2) return;
  // Role-based filtering per user role
  const role = STATE.user?.role;
  const results = [];
  STATE.cases.forEach(c => {
    if (c.id.includes(q) || c.name.toLowerCase().includes(q.toLowerCase())) results.push({ type:'Case', label:c.id, sub:c.name, view:'case_book' });
  });
  STATE.docs.forEach(d => {
    const accessible = role === 'citizen' ? ['Witness Statement'].includes(d.type) : true;
    if (accessible && (d.name.toLowerCase().includes(q.toLowerCase()) || d.id.includes(q))) results.push({ type:'Document', label:d.name, sub:d.caseId, view:'doc_register' });
  });
  if (results.length > 0) showToast(`Found ${results.length} results for "${q}"`, 'success');
}

/* ══════════════════════════════════════════════════════════
   SECTION: MODALS
══════════════════════════════════════════════════════════ */
function openModal(title, body) {
  document.getElementById('modal-title').textContent = title;
  document.getElementById('modal-body').innerHTML = body;
  document.getElementById('modal-overlay').classList.add('open');
}
function closeModal(e) { if (e.target === document.getElementById('modal-overlay')) closeModalDirect(); }
function closeModalDirect() { document.getElementById('modal-overlay').classList.remove('open'); }

function openDocInspectModal(docId) {
  const d = STATE.docs.find(x => x.id === docId);
  if (!d) return;
  const canApprove = ['legal_officer','judge','prosecutor'].includes(STATE.user.role) && d.approval === 'Pending';
  openModal('Inspect: ' + d.name, `
    <dl class="dl-grid" style="margin-bottom:14px">
      <dt>Document ID</dt><dd class="mono">${d.id}</dd>
      <dt>Case</dt><dd class="mono text-accent">${d.caseId}</dd>
      <dt>Type</dt><dd>${d.type}</dd>
      <dt>Uploaded By</dt><dd>${d.by}</dd>
      <dt>Department</dt><dd>${d.dept}</dd>
      <dt>Date</dt><dd>${d.date}</dd>
      <dt>Version</dt><dd class="mono">v${d.ver}</dd>
      <dt>Status</dt><dd>${badge(d.status)}</dd>
      <dt>Integrity</dt><dd>${badge(d.integrity)}</dd>
      <dt>Approval</dt><dd>${badge(d.approval)}</dd>
    </dl>
    <div style="margin-bottom:16px"><div class="text-xs text-muted mb-4" style="margin-bottom:6px">SHA-256 Hash</div><div class="hash-box">${d.hash}</div></div>
    <div style="display:flex;gap:8px;flex-wrap:wrap">
      ${canApprove ? `
        <button class="btn btn-success btn-sm" onclick="updateApproval('${d.id}','Approved');closeModalDirect()">Approve</button>
        <button class="btn btn-danger btn-sm" onclick="updateApproval('${d.id}','Rejected');closeModalDirect()">Reject</button>
        <button class="btn btn-warn btn-sm" onclick="updateApproval('${d.id}','Reinvestigation');closeModalDirect()">Reinvestigation</button>
        <button class="btn btn-secondary btn-sm" onclick="showToast('Proceeding to next stage.','success');closeModalDirect()">Proceed</button>` : ''}
      <button class="btn btn-outline btn-sm" onclick="verifyIntegrity('${d.id}')"><i class="fas fa-shield-alt"></i> Verify Integrity</button>
    </div>`);
}

function showAddCaseModal() {
  openModal('Add New Case', `
    <div class="form-group"><label>Case Name</label><input type="text" id="nc-name" placeholder="e.g. State v. Unknown — Robbery" style="background:#fff" /></div>
    <div class="form-group"><label>Case Lead</label><input type="text" id="nc-lead" placeholder="Assigned officer name" style="background:#fff" /></div>
    <div class="form-group"><label>Department</label><input type="text" id="nc-dept" placeholder="e.g. Criminal Investigation" style="background:#fff" /></div>
    <div class="form-group"><label>Priority</label>
      <select id="nc-priority" style="background:#fff;width:100%;border:1px solid var(--border);border-radius:8px;padding:10px;outline:none;font-size:13px">
        <option>High</option><option selected>Medium</option><option>Low</option>
      </select>
    </div>
    <div class="form-group"><label>Description</label><textarea id="nc-desc" rows="3" placeholder="Case description…" style="background:#fff;width:100%;border:1px solid var(--border);border-radius:8px;padding:10px;font-size:13px;font-family:inherit;resize:vertical;outline:none"></textarea></div>
    <div class="modal-footer" style="padding:0;margin-top:16px">
      <button class="btn btn-primary" onclick="createCase()">Create Case</button>
      <button class="btn btn-outline" onclick="closeModalDirect()">Cancel</button>
    </div>`);
}
function createCase() {
  const name = document.getElementById('nc-name')?.value?.trim();
  const lead = document.getElementById('nc-lead')?.value?.trim();
  if (!name || !lead) { showToast('Name and lead are required.', 'warning'); return; }
  const newCase = {
    id: `CASE-2026-${String(Math.floor(Math.random()*900)+100).padStart(6,'0')}`,
    name, lead, dept: document.getElementById('nc-dept')?.value || 'General',
    status:'Active', priority: document.getElementById('nc-priority')?.value || 'Medium',
    created: new Date().toISOString().slice(0,10), updated: new Date().toISOString().slice(0,10),
    desc: document.getElementById('nc-desc')?.value || '', officers:[lead], docs:0, evidence:0,
  };
  STATE.cases.unshift(newCase);
  saveState();
  addLog('Case Created', newCase.id, newCase.id, 'Success');
  showToast('Case created successfully.', 'success');
  closeModalDirect(); render();
}

function openRevisionModal(r) {
  if (typeof r === 'string') r = JSON.parse(r);
  openModal('Revision Details', `
    <dl class="dl-grid" style="margin-bottom:14px">
      <dt>Document</dt><dd>${r.doc}</dd>
      <dt>Version</dt><dd class="mono text-accent">${r.ver}</dd>
      <dt>Modified By</dt><dd>${r.user}</dd>
      <dt>Timestamp</dt><dd class="mono">${r.ts}</dd>
      <dt>Reason</dt><dd>${r.reason}</dd>
      <dt>Status</dt><dd>${badge(r.status)}</dd>
    </dl>
    <div class="mb-12"><div class="text-xs text-muted" style="margin-bottom:6px">Full Hash</div><div class="hash-box">${r.hash}</div></div>
    <div class="modal-footer" style="padding:0">
      <button class="btn btn-outline btn-sm" onclick="showToast('Comparing versions…','success');closeModalDirect()">Compare</button>
      <button class="btn btn-secondary btn-sm" onclick="showToast('Version restored.','success');closeModalDirect()">Restore</button>
    </div>`);
}

function showAddEvidenceModal() {
  openModal('Add Evidence', `
    <div class="form-group"><label>Evidence Type</label>
      <select style="background:#fff;width:100%;border:1px solid var(--border);border-radius:8px;padding:10px;outline:none;font-size:13px">
        <option>Physical</option><option>Digital</option><option>Forensic</option><option>Documentary</option>
      </select>
    </div>
    <div class="form-group"><label>Description</label><textarea rows="3" placeholder="Describe the evidence…" style="background:#fff;width:100%;border:1px solid var(--border);border-radius:8px;padding:10px;font-size:13px;font-family:inherit;resize:vertical;outline:none"></textarea></div>
    <div class="form-group"><label>Collection Date</label><input type="date" style="background:#fff;width:100%;border:1px solid var(--border);border-radius:8px;padding:10px;outline:none;font-size:13px" /></div>
    <div class="form-group"><label>Location / Storage</label><input type="text" placeholder="Evidence Room A — Locker XX" style="background:#fff" /></div>
    <div class="modal-footer" style="padding:0;margin-top:14px">
      <button class="btn btn-primary" onclick="showToast('Evidence added. Chain of custody updated.','success');closeModalDirect()">Add Evidence</button>
      <button class="btn btn-outline" onclick="closeModalDirect()">Cancel</button>
    </div>`);
}

function showLeadHistoryModal() {
  openModal('Case Lead Assignment History', `
    <table class="data-table">
      <thead><tr><th>Lead</th><th>Department</th><th>Assigned</th><th>Changed By</th></tr></thead>
      <tbody>
        <tr><td>${STATE.selectedCase?.lead || '—'}</td><td>${STATE.selectedCase?.dept || '—'}</td><td>${STATE.selectedCase?.created || '—'}</td><td>System</td></tr>
      </tbody>
    </table>`);
}

/* ══════════════════════════════════════════════════════════
   SECTION: INTEGRITY VERIFICATION
══════════════════════════════════════════════════════════ */
function verifyIntegrity(docId) {
  // TODO: API — POST /api/documents/:id/verify
  const d = STATE.docs.find(x => x.id === docId);
  openModal('Verify Document Integrity', `
    <div style="text-align:center;padding:8px 0">
      <div id="verify-spinner" style="display:flex;flex-direction:column;align-items:center;gap:12px;margin-bottom:16px">
        <div class="upload-spinner" style="width:32px;height:32px;border-width:3px"></div>
        <p class="text-sm text-muted" id="verify-stage">Calculating SHA-256…</p>
      </div>
      <div id="verify-result" style="display:none">
        <div class="success-banner" style="justify-content:center;margin-bottom:16px"><i class="fas fa-check-circle"></i> ✓ Integrity Verified</div>
        <dl class="dl-grid" style="text-align:left">
          <dt>Document</dt><dd>${d?.name || '—'}</dd>
          <dt>Current Hash</dt><dd class="mono text-xs">${d?.hash || '—'}</dd>
          <dt>Stored Hash</dt><dd class="mono text-xs">${d?.hash || '—'}</dd>
          <dt>Result</dt><dd class="text-success fw-600">MATCH</dd>
        </dl>
        <p class="text-xs text-muted" style="margin-top:12px;font-style:italic">Prototype: hash comparison is simulated. Production requires backend verification.</p>
      </div>
    </div>`);
  setTimeout(() => {
    document.getElementById('verify-stage').textContent = 'Comparing against stored hash…';
    setTimeout(() => {
      document.getElementById('verify-spinner').style.display = 'none';
      document.getElementById('verify-result').style.display = '';
      if (d) { d.integrity = 'Verified'; saveState(); }
      addLog('Integrity Verified', d?.name || '—', d?.caseId || '—', 'Success');
    }, 1200);
  }, 800);
}

/* ══════════════════════════════════════════════════════════
   SECTION: AUDIT LOGS (internal)
══════════════════════════════════════════════════════════ */
function addLog(action, resource, caseId, result) {
  const log = {
    id: 'LOG-' + String(STATE.logs.length + 1).padStart(3,'0'),
    ts: new Date().toISOString().slice(0,19).replace('T',' '),
    user: STATE.user?.name || 'System',
    role: STATE.user ? ROLE_LABELS[STATE.user.role] : 'System',
    action, resource, caseId, result,
  };
  STATE.logs.unshift(log);
  if (STATE.logs.length > 100) STATE.logs.pop(); // cap
  saveState();
}

/* ══════════════════════════════════════════════════════════
   SECTION: UI HELPERS
══════════════════════════════════════════════════════════ */
function badge(status) {
  const map = {
    'Active':          'badge-success',
    'Approved':        'badge-success',
    'Verified':        'badge-info',
    'Closed':          'badge-gray',
    'Rejected':        'badge-danger',
    'Unverified':      'badge-pending',
    'Failed':          'badge-danger',
    'Pending':         'badge-pending',
    'Under Review':    'badge-info',
    'Reinvestigation': 'badge-purple',
    'Success':         'badge-success',
    'Failure':         'badge-danger',
    'Warning':         'badge-warn',
    'Transferred':     'badge-info',
    'Archived':        'badge-gray',
    'Posted':          'badge-success',
    'Draft':           'badge-gray',
    'High':                'badge-critical',
    'Medium':              'badge-pending',
    'Low':                 'badge-normal',
    'Critical':            'badge-danger',
    'Under Investigation': 'badge-purple',
    'Pending Court':       'badge-warn',
    'Resolved':            'badge-success',
    'Open':                'badge-danger',
    'NORMAL':              'badge-normal',
    'WARNING':             'badge-warning',
    'CRITICAL':            'badge-critical',
    'Intact':              'badge-success',
    'Restricted':          'badge-warn',
    'Confidential':        'badge-danger',
    'Public':              'badge-normal',
  };
  return `<span class="badge ${map[status]||'badge-gray'}">${status}</span>`;
}

function showToast(message, type = 'success') {
  const icons = { success:'fa-check-circle', error:'fa-times-circle', warning:'fa-exclamation-triangle' };
  const id = 'toast-' + Date.now();
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.id = id;
  toast.innerHTML = `<i class="fas ${icons[type]} toast-icon"></i><span class="toast-msg">${message}</span><button class="toast-close" onclick="removeToast('${id}')"><i class="fas fa-times"></i></button>`;
  document.getElementById('toast-container').appendChild(toast);
  setTimeout(() => removeToast(id), 4000);
}
function removeToast(id) {
  const el = document.getElementById(id);
  if (el) { el.style.animation = 'fadeOut .3s forwards'; setTimeout(() => el.remove(), 300); }
}

function confirmAction(message, onConfirm) {
  openModal('Confirm Action', `
    <p class="text-sm" style="margin-bottom:20px">${message}</p>
    <div class="modal-footer" style="padding:0">
      <button class="btn btn-danger" onclick="(${onConfirm.toString()})();closeModalDirect()">Confirm</button>
      <button class="btn btn-outline" onclick="closeModalDirect()">Cancel</button>
    </div>`);
}

/* ══════════════════════════════════════════════════════════
   SECTION: INIT
══════════════════════════════════════════════════════════ */
(function init() {
  // Restore session
  const saved = LS.get('user', null);
  if (saved) {
    STATE.user = saved;
    bootApp();
    return;
  }
  // Keyboard login shortcut
  document.addEventListener('keydown', e => {
    if (e.key === 'Enter' && document.getElementById('login-password') === document.activeElement) handleLogin();
  });
})();
