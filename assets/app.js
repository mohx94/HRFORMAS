/* ===== بيت هايل - محرك النظام ===== */

/* ---------------- إعدادات عامة ---------------- */
const SITE_PASSWORD = "HailHR2026"; // كلمة مرور القسم - يمكن تغييرها من هنا
const SESSION_KEY = "hh_hr_session_ok";

const COMPANIES = {
  "بيت هايل لمواد البناء": {
    nameAr: "شركة بيت هايل لمواد البناء", nameEn: "HAIL HOUSE CO.",
    gosi: "580640052", cr: "7006982198",
    addressAr: "8246 ابن الجوزي\nالزلفي الصناعية 15943", addressEn: "IBN AL JAWZI 8246, Alzelfi AS SINAIYAH 15943"
  },
  "بيت هائل للنقليات": {
    nameAr: "شركة بيت هائل للنقليات", nameEn: "HAIL HOUSE TRANSPORT CO.",
    gosi: "589308417", cr: "7007688299",
    addressAr: "8037 ابن الجوزي\nالزلفي الصناعية 15943", addressEn: "IBN AL JAWZI 8037, Alzelfi AS SINAIYAH 15943"
  },
  "هائل لصيانة السيارات": {
    nameAr: "شركة هائل لصيانة السيارات", nameEn: "HAIL AUTO MAINTENANCE CO.",
    gosi: "590093386", cr: "7016083813",
    addressAr: "8246 ابن الجوزي\nالزلفي الصناعية 15943", addressEn: "IBN AL JAWZI 8246, Alzelfi AS SINAIYAH 15943"
  }
};
const DEFAULT_COMPANY = COMPANIES["بيت هايل لمواد البناء"];
function companyOf(emp){ return (emp && COMPANIES[emp.company]) || DEFAULT_COMPANY; }

/* ---------------- أدوات مساعدة عامة ---------------- */
function pad2(n){ return String(n).padStart(2,"0"); }

function excelDateToJS(v){
  if(v==null || v==="") return null;
  if(v instanceof Date) return v;
  if(typeof v === "number"){
    // Excel serial date
    const d = new Date(Math.round((v - 25569) * 86400 * 1000));
    return isNaN(d.getTime()) ? null : d;
  }
  const d = new Date(v);
  return isNaN(d.getTime()) ? null : d;
}
function fmtDate(v){
  const d = excelDateToJS(v);
  if(!d) return "—";
  return `${pad2(d.getDate())}/${pad2(d.getMonth()+1)}/${d.getFullYear()}`;
}
function todayStr(){ return fmtDate(new Date()); }

function num(v){
  const n = parseFloat(v);
  return isNaN(n) ? 0 : n;
}
function money(v){
  const n = num(v);
  return n.toLocaleString('en-US', {minimumFractionDigits:0, maximumFractionDigits:2});
}
function dateDiffYMD(startV, endV){
  const start = excelDateToJS(startV);
  const end = excelDateToJS(endV);
  if(!start || !end || end < start) return {y:0,m:0,d:0};
  let y = end.getFullYear() - start.getFullYear();
  let m = end.getMonth() - start.getMonth();
  let d = end.getDate() - start.getDate();
  if(d < 0){
    m--;
    d += new Date(end.getFullYear(), end.getMonth(), 0).getDate();
  }
  if(m < 0){ y--; m += 12; }
  return {y,m,d};
}
function yearsToYMD(decYears){
  const y = Math.floor(decYears);
  const remM = (decYears - y) * 12;
  const m = Math.floor(remM);
  const d = Math.round((remM - m) * 30);
  return {y, m, d};
}
function esc(v){
  if(v===undefined||v===null) return "";
  return String(v);
}
function orDash(v){
  if(v===undefined||v===null||v===""||v==="---"||v==="--") return '<span class="tag-empty">—</span>';
  return esc(v);
}

/* ---------------- تحميل بيانات الموظفين من ملف الإكسل ---------------- */
let EMPLOYEES = [];      // كل الموظفين بعد التطبيع
let EMP_BY_NO = {};       // فهرسة بالرقم الوظيفي

const COLMAP = {
  no:'#', jobNo:'الرقم الوظيفي', nameAr:'الاسم', nameEn:'NAME',
  nationalityAr:'الجنسية', nationalityEn:'Nationality',
  genderAr:'الجنس', genderEn:'gender', religionAr:'الديانة', religionEn:'Religion',
  birthDate:'تاريخ الميلاد', idNumber:'رقم الهوية', idExpiry:'انتهاء الهوية',
  passportNumber:'رقم الجواز', passportExpiry:'انتهاء الجواز',
  licenseExpiry:'انتهاء \nرخصة القيادة', driverCard:'بطاقة سائق',
  phone:'رقم التواصل ', email:'الايميل', company:'الشركة',
  jobTitleAr:'المسمى الوظيفي', jobTitleEn:'Job title',
  professionAr:'المهنة', professionEn:'Profession',
  workLocationAr:'مقر العمل ', workLocationEn:'work location',
  adminAr:'الادارة', deptAr:'القسم', deptEn:'Department ',
  joinDate:'تاريخ الانضمام', contractStart:'بداية العقد', contractEnd:'نهاية العقد',
  releaseDate:'تاريخ الانفكاك', serviceYears:'مدة الخدمة', annualLeave:'الاجازة السنوية',
  basic:'الأساسي', housing:'بدل السكن', transport:'بدل النقل', living:'بدل معيشة',
  total:'الإجمالي', bankAr:'اسم البنك', bankEn:'bank name', iban:'الايبان'
};

function normalizeRow(raw){
  const emp = {};
  for(const key in COLMAP){
    emp[key] = raw[COLMAP[key]];
  }
  // sanitize obvious placeholders
  ['jobTitleAr','nameAr'].forEach(k=>{ if(emp[k]==='#N/A') emp[k]=''; });
  return emp;
}

async function loadEmployeeData(){
  const res = await fetch('Staffdata.xlsx');
  const buf = await res.arrayBuffer();
  const wb = XLSX.read(buf, {type:'array', cellDates:true});
  const ws = wb.Sheets[wb.SheetNames[0]];
  const rows = XLSX.utils.sheet_to_json(ws, {defval:''});
  EMPLOYEES = rows
    .map(normalizeRow)
    .filter(e => e.jobNo && e.nameAr && e.nameAr !== '#N/A');
  EMP_BY_NO = {};
  EMPLOYEES.forEach(e => { EMP_BY_NO[String(e.jobNo)] = e; });
}

/* ---------------- حالة التطبيق ---------------- */
let currentEmployee = null;
let currentForm = null;
let manualValues = {};

/* ---------------- تسجيل الدخول ---------------- */
function checkSession(){ return sessionStorage.getItem(SESSION_KEY) === "1"; }

function renderLogin(){
  document.getElementById('root').innerHTML = `
    <div class="login-screen">
      <div class="login-card">
        <img src="assets/logo.png" alt="بيت هايل">
        <h1>منصة نماذج الموارد البشرية</h1>
        <p>الدخول مخصص لموظفي قسم الموارد البشرية</p>
        <input type="password" id="pw" placeholder="كلمة المرور" autofocus>
        <button id="loginBtn">دخول</button>
        <div class="login-err" id="loginErr"></div>
      </div>
    </div>`;
  const doLogin = () => {
    const val = document.getElementById('pw').value;
    if(val === SITE_PASSWORD){
      sessionStorage.setItem(SESSION_KEY, "1");
      boot();
    }else{
      document.getElementById('loginErr').textContent = "كلمة المرور غير صحيحة";
    }
  };
  document.getElementById('loginBtn').addEventListener('click', doLogin);
  document.getElementById('pw').addEventListener('keydown', e=>{ if(e.key==='Enter') doLogin(); });
}

/* ---------------- الهيكل الرئيسي ---------------- */
function renderShell(){
  document.getElementById('root').innerHTML = `
    <div id="app">
      <div class="topbar">
        <div class="brand"><img src="assets/logo.png" alt=""><span>منصة نماذج الموارد البشرية — بيت هايل</span></div>
        <div class="actions">
          <button id="menuToggle" class="mobile-only" style="display:none">القائمة</button>
          <button id="logoutBtn">خروج</button>
        </div>
      </div>
      <div class="layout">
        <div class="sidebar" id="sidebar"></div>
        <div class="main" id="main"></div>
      </div>
    </div>`;
  document.getElementById('logoutBtn').addEventListener('click', ()=>{
    sessionStorage.removeItem(SESSION_KEY);
    renderLogin();
  });
  renderSidebar();
  renderWelcome();
}

function renderSidebar(){
  const el = document.getElementById('sidebar');
  let html = '';
  CATEGORIES.forEach(cat=>{
    html += `<h3>${cat.title}</h3>`;
    FORMS.filter(f=>f.cat===cat.id).forEach(f=>{
      html += `<button class="nav-item" data-id="${f.id}">${f.titleAr}</button>`;
    });
  });
  el.innerHTML = html;
  el.querySelectorAll('.nav-item').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      el.querySelectorAll('.nav-item').forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');
      const form = FORMS.find(f=>f.id===btn.dataset.id);
      openForm(form);
    });
  });
}

function renderWelcome(){
  document.getElementById('main').innerHTML = `
    <div class="welcome">
      <img src="assets/logo.png" alt="">
      <h1>مرحباً بك</h1>
      <p>اختر نموذجاً من القائمة الجانبية للبدء. حدد رقم الموظف الوظيفي وسيتم تعبئة بياناته تلقائياً، ثم أكمل الحقول الخاصة بالحالة واطبع مباشرة بصيغة A4.</p>
    </div>`;
}

/* ---------------- فتح نموذج ---------------- */
function openForm(form){
  currentForm = form;
  currentEmployee = null;
  manualValues = {};
  const main = document.getElementById('main');
  const standalone = !!form.standalone;

  main.innerHTML = `
    <div class="form-toolbar">
      <h2>${form.titleAr}</h2>
      <button class="btn-print" id="printBtn" ${standalone?'':'disabled'}>طباعة A4</button>
    </div>
    ${standalone ? `<div class="hint" style="margin-bottom:14px">هذا النموذج يُعبّى يدوياً بالكامل (لا يعتمد على بيانات موظف مسجّل في الملف).</div>` : `
    <div class="picker-bar">
      <div class="field">
        <label>الرقم الوظيفي أو اسم الموظف</label>
        <input list="empList" id="empSearch" placeholder="اكتب الرقم الوظيفي أو الاسم...">
        <datalist id="empList"></datalist>
      </div>
      <div id="empSummary"></div>
    </div>`}
    <div class="manual-fields" id="manualFields"></div>
    <div class="sheet-wrap"><div class="sheet" id="sheet">${standalone?'':'<div class="tag-empty" style="padding:60px;text-align:center;display:block;">حدد موظفاً لعرض النموذج</div>'}</div></div>
  `;

  if(!standalone){
    const dl = document.getElementById('empList');
    dl.innerHTML = EMPLOYEES.map(e=>`<option value="${e.jobNo} - ${esc(e.nameAr)}">`).join('');

    document.getElementById('empSearch').addEventListener('input', (e)=>{
      const v = e.target.value.trim();
      const jobNo = v.split(' - ')[0].trim();
      const emp = EMP_BY_NO[jobNo];
      if(emp){
        if(!currentEmployee || currentEmployee.jobNo !== emp.jobNo){ manualValues = {}; renderManualFields(); }
        currentEmployee = emp;
        document.getElementById('empSummary').innerHTML =
          `<div class="emp-summary"><b>${esc(emp.nameAr)}</b> — ${esc(emp.jobTitleAr)} — ${esc(emp.deptAr||emp.workLocationAr)}</div>`;
        renderSheet();
        document.getElementById('printBtn').disabled = false;
      }
    });
  }

  document.getElementById('printBtn').addEventListener('click', ()=> window.print());

  renderManualFields();
  if(standalone){ renderSheet(); }
}

function renderManualFields(){
  const wrap = document.getElementById('manualFields');
  const fields = currentForm.manualFields || [];
  if(fields.length===0){ wrap.style.display='none'; return; }
  wrap.style.display='grid';
  wrap.innerHTML = fields.map(f=>{
    const dflt = typeof f.default === 'function' ? f.default(currentEmployee) : (f.default || '');
    const val = manualValues[f.key] !== undefined ? manualValues[f.key] : dflt;
    if(f.type==='textarea'){
      return `<div class="f" style="grid-column:1/-1"><label>${f.label}</label><textarea data-key="${f.key}">${esc(val)}</textarea></div>`;
    }
    if(f.type==='select'){
      const opts = (f.options||[]).map(o=>`<option value="${esc(o)}" ${o===val?'selected':''}>${esc(o)}</option>`).join('');
      return `<div class="f"><label>${f.label}</label><select data-key="${f.key}">${opts}</select></div>`;
    }
    return `<div class="f"><label>${f.label}</label><input type="${f.type||'text'}" data-key="${f.key}" value="${esc(val)}"></div>`;
  }).join('');
  wrap.querySelectorAll('[data-key]').forEach(inp=>{
    inp.addEventListener('input', ()=>{
      manualValues[inp.dataset.key] = inp.value;
      renderSheet();
    });
  });
}

function renderSheet(){
  const sheetEl = document.getElementById('sheet');
  if(!currentForm.standalone && !currentEmployee){
    sheetEl.innerHTML = `<div class="tag-empty" style="padding:60px;text-align:center;display:block;">حدد موظفاً لعرض النموذج</div>`;
    return;
  }
  sheetEl.innerHTML = currentForm.render(currentEmployee, manualValues);
}

/* ---------------- عناصر مشتركة للنموذج المطبوع ---------------- */
function docHeader(emp, subtitleAr, subtitleEn){
  const co = companyOf(emp);
  return `
    <div class="doc-header">
      <img src="assets/logo.png" alt="">
      <div class="co-name">${co.nameAr}<br>${co.nameEn}</div>
    </div>
    <div class="doc-title">
      <h1>${subtitleAr||''}</h1>
      ${subtitleEn ? `<h2>${subtitleEn}</h2>` : ''}
    </div>`;
}
function docFooter(emp){
  const co = companyOf(emp);
  return `<div class="doc-footer">${co.nameAr} — إدارة الموارد البشرية · تم إنشاء هذا المستند إلكترونياً</div>`;
}
function signBox(labelAr){
  return `<div class="sign-box"><div class="line">${labelAr}</div></div>`;
}

/* ---------------- بدء التشغيل ---------------- */
async function boot(){
  document.getElementById('root').innerHTML = `<div style="display:flex;align-items:center;justify-content:center;height:100vh;font-family:sans-serif;color:#888;">جارِ تحميل بيانات الموظفين...</div>`;
  try{
    await loadEmployeeData();
  }catch(err){
    document.getElementById('root').innerHTML = `<div style="padding:40px;text-align:center;color:#9b3b3b;">تعذر تحميل ملف بيانات الموظفين (Staffdata.xlsx). تأكد من وجود الملف في نفس مجلد الموقع.<br><small>${err}</small></div>`;
    return;
  }
  renderShell();
}

window.addEventListener('DOMContentLoaded', ()=>{
  if(checkSession()){ boot(); } else { renderLogin(); }
});
