/* ===== بيت هايل - تعريف جميع النماذج ===== */

const CATEGORIES = [
  {id:'certificates', title:'الشهادات والتعريفات'},
  {id:'contracts',    title:'عقود العمل'},
  {id:'termination',  title:'إنهاء الخدمة وإخلاء الطرف'},
  {id:'financial',    title:'المالية والمستحقات'},
  {id:'operations',   title:'العمليات اليومية'},
];

/* أدوات صغيرة خاصة بالنماذج */
function kv(labelAr, val){
  return `<div class="kv"><b>${labelAr}:</b><span class="val">${orDash(val)}</span></div>`;
}
function checklistTable(items, checkedDefault){
  const rows = items.map((it,i)=>`<tr><td>${i+1}</td><td style="text-align:right">${it}</td><td>☐ متوفر &nbsp;&nbsp; ☐ غير متوفر</td></tr>`).join('');
  return `<table class="doc-table"><thead><tr><th>#</th><th>الوثيقة</th><th>الحالة</th></tr></thead><tbody>${rows}</tbody></table>`;
}

/* ============================================================
   1) الشهادات والتعريفات
   ============================================================ */
const FORM_TAAREEF_AR = {
  id:'taareef-ar', cat:'certificates', titleAr:'خطاب تعريف بموظف (عربي)',
  manualFields:[
    {key:'date', label:'التاريخ', type:'date', default:()=>new Date().toISOString().slice(0,10)},
  ],
  render(emp, m){
    return `
      ${docHeader(emp, 'خطاب تعريف بموظف')}
      <div class="row"><div class="kv"><b>الرقم الوظيفي:</b> ${esc(emp.jobNo)}</div><div class="kv"><b>التاريخ:</b> ${m.date?fmtDate(m.date):todayStr()}</div></div>
      <p class="para">الى: من يهمه الأمر</p>
      <p class="para">تشهد ${companyOf(emp).nameAr} أن السيد/ة: <b>${esc(emp.nameAr)}</b>، ${emp.idNumber?('صاحب هوية/إقامة رقم <b>'+esc(emp.idNumber)+'</b>،'):''} ملتحق بالعمل لدينا منذ تاريخ ${fmtDate(emp.joinDate)} بوظيفة <b>${esc(emp.jobTitleAr)}</b> بقسم ${esc(emp.deptAr||emp.workLocationAr)}.</p>
      <p class="para">ولا يزال يعمل لدينا حتى تاريخ كتابة هذا الخطاب.</p>
      <p class="para">وقد تم منحه هذه الشهادة بناء على طلبه دون تحمل ${companyOf(emp).nameAr} أدنى مسؤولية تجاه حقوق الغير.</p>
      <div class="sign-grid two" style="margin-top:70px">${signBox('إدارة الموارد البشرية')}${signBox('ختم الشركة')}</div>
      ${docFooter(emp)}`;
  }
};

const FORM_TAAREEF_EN = {
  id:'taareef-en', cat:'certificates', titleAr:'خطاب تعريف بموظف (إنجليزي)',
  manualFields:[{key:'date', label:'Date', type:'date', default:()=>new Date().toISOString().slice(0,10)}],
  render(emp, m){
    const co = companyOf(emp);
    return `
      <div class="doc-header"><img src="assets/logo.png"><div class="co-name">${co.nameEn}</div></div>
      <div class="doc-title"><h1>Employee Definition Letter</h1></div>
      <div class="row"><div class="kv" style="direction:ltr;text-align:left"><b>Employee No:</b> ${esc(emp.jobNo)}</div><div class="kv" style="direction:ltr;text-align:left"><b>Date:</b> ${m.date?fmtDate(m.date):todayStr()}</div></div>
      <p class="para en">TO WHOM IT MAY CONCERN,</p>
      <p class="para en">${co.nameEn} certifies that Mr./Ms. <b>${esc(emp.nameEn||emp.nameAr)}</b>${emp.idNumber?(', holder of ID/Iqama No. '+esc(emp.idNumber)+','):''} has been employed with us since ${fmtDate(emp.joinDate)} as <b>${esc(emp.jobTitleEn||emp.jobTitleAr)}</b> in the ${esc(emp.deptEn||emp.deptAr)} department.</p>
      <p class="para en">He/She is still working for us at the date of writing this letter.</p>
      <p class="para en">This certificate was granted to him/her at his/her request. ${co.nameEn} bears no responsibility towards the rights of third parties.</p>
      <div class="sign-grid two" style="margin-top:70px">${signBox('Human Resources Department')}${signBox('Company Seal')}</div>
      ${docFooter(emp)}`;
  }
};

const FORM_SHAHADAT_KHIBRA = {
  id:'shahadat-khibra', cat:'certificates', titleAr:'شهادة خبرة',
  manualFields:[
    {key:'date', label:'التاريخ', type:'date', default:()=>new Date().toISOString().slice(0,10)},
    {key:'toDate', label:'تاريخ نهاية العمل', type:'date', default: e=>e?.releaseDate},
    {key:'eos', label:'مكافأة نهاية الخدمة (ر.س)', type:'number'},
    {key:'vacation', label:'بدل الإجازة (ر.س)', type:'number'},
    {key:'salary', label:'راتب مستحق (ر.س)', type:'number'},
    {key:'driverBonus', label:'مكافأة السائق (ر.س) - إن وجدت', type:'number'},
  ],
  render(emp, m){
    return `
      ${docHeader(emp, 'شهادة خبرة', 'Certificate of Experience')}
      <div class="row">${kv('الرقم الوظيفي', emp.jobNo)}${kv('التاريخ', m.date?fmtDate(m.date):todayStr())}</div>
      <div class="bi-row">
        <div class="ar">تشهد ${companyOf(emp).nameAr} أن السيد: <b>${esc(emp.nameAr)}</b> كان يعمل لدينا خلال الفترة من ${fmtDate(emp.joinDate)} حتى ${m.toDate?fmtDate(m.toDate):'تاريخ كتابة هذا الخطاب'}، وكان يعمل لدينا بوظيفة: <b>${esc(emp.jobTitleAr)}</b> بقسم ${esc(emp.deptAr)}.</div>
        <div class="en">${companyOf(emp).nameEn} certifies that Mr. <b>${esc(emp.nameEn||emp.nameAr)}</b> worked for us during the period from ${fmtDate(emp.joinDate)} until ${m.toDate?fmtDate(m.toDate):'the date of writing this letter'} as <b>${esc(emp.jobTitleEn||emp.jobTitleAr)}</b>.</div>
      </div>
      <div class="section-title">وتم منحه الآتي / He was granted the following</div>
      <table class="doc-table">
        <thead><tr><th>البند</th><th>المبلغ (ر.س)</th></tr></thead>
        <tbody>
          <tr><td>مكافأة نهاية خدمة</td><td>${m.eos?money(m.eos):'—'}</td></tr>
          <tr><td>بدل إجازة</td><td>${m.vacation?money(m.vacation):'—'}</td></tr>
          <tr><td>راتب مستحق</td><td>${m.salary?money(m.salary):'—'}</td></tr>
          ${m.driverBonus?`<tr><td>مكافأة سائق</td><td>${money(m.driverBonus)}</td></tr>`:''}
        </tbody>
      </table>
      <p class="para">وقد تم منحه هذه الشهادة بناء على طلبه دون تحمل ${companyOf(emp).nameAr} أدنى مسؤولية تجاه حقوق الغير.</p>
      <div class="sign-grid two" style="margin-top:60px">${signBox('إدارة الموارد البشرية')}${signBox('ختم الشركة')}</div>
      ${docFooter(emp)}`;
  }
};

const FORM_MAALOOMAT_MUWAZAF = {
  id:'maaloomat-muwazaf', cat:'certificates', titleAr:'بطاقة معلومات موظف',
  manualFields:[],
  render(emp){
    return `
      ${docHeader(emp, 'بطاقة معلومات موظف', 'Employee Information Sheet')}
      <div class="section-title">البيانات الشخصية</div>
      <div class="row">${kv('الرقم الوظيفي', emp.jobNo)}${kv('الاسم', emp.nameAr)}${kv('الاسم (EN)', emp.nameEn)}</div>
      <div class="row">${kv('الجنسية', emp.nationalityAr)}${kv('الجنس', emp.genderAr)}${kv('الديانة', emp.religionAr)}</div>
      <div class="row">${kv('تاريخ الميلاد', fmtDate(emp.birthDate))}${kv('رقم الهوية/الإقامة', emp.idNumber)}${kv('تاريخ الانتهاء', fmtDate(emp.idExpiry))}</div>
      <div class="row">${kv('رقم الجواز', emp.passportNumber)}${kv('انتهاء الجواز', fmtDate(emp.passportExpiry))}${kv('انتهاء رخصة القيادة', fmtDate(emp.licenseExpiry))}</div>
      <div class="row">${kv('رقم التواصل', emp.phone)}${kv('البريد الإلكتروني', emp.email)}</div>
      <div class="section-title">البيانات الوظيفية</div>
      <div class="row">${kv('الشركة', emp.company)}${kv('المسمى الوظيفي', emp.jobTitleAr)}${kv('المهنة', emp.professionAr)}</div>
      <div class="row">${kv('مقر العمل', emp.workLocationAr)}${kv('الإدارة', emp.adminAr)}${kv('القسم', emp.deptAr)}</div>
      <div class="row">${kv('تاريخ الانضمام', fmtDate(emp.joinDate))}${kv('بداية العقد الحالي', fmtDate(emp.contractStart))}${kv('نهاية العقد الحالي', fmtDate(emp.contractEnd))}</div>
      <div class="section-title">البيانات المالية</div>
      <div class="row">${kv('الراتب الأساسي', money(emp.basic))}${kv('بدل السكن', money(emp.housing))}${kv('بدل النقل', money(emp.transport))}</div>
      <div class="row">${kv('بدل معيشة', money(emp.living))}${kv('الإجمالي', money(emp.total))}${kv('رصيد الإجازة السنوية', emp.annualLeave)}</div>
      <div class="row">${kv('اسم البنك', emp.bankAr)}${kv('رقم الآيبان', emp.iban)}</div>
      ${docFooter(emp)}`;
  }
};

const FORM_MALAF_MUWAZAF = {
  id:'malaf-muwazaf', cat:'certificates', titleAr:'قائمة مستندات ملف الموظف',
  manualFields:[],
  render(emp){
    return `
      ${docHeader(emp, 'قائمة مستندات ملف الموظف')}
      <div class="row">${kv('الاسم', emp.nameAr)}${kv('الرقم الوظيفي', emp.jobNo)}</div>
      <div class="row">${kv('الوظيفة', emp.jobTitleAr)}${kv('الجنسية', emp.nationalityAr)}</div>
      <div class="row">${kv('القسم', emp.deptAr)}${kv('تاريخ الانضمام', fmtDate(emp.joinDate))}</div>
      <div class="section-title">الأوراق الثبوتية المطلوبة</div>
      ${checklistTable(['صورة الهوية / الإقامة','صورة جواز السفر','رخصة القيادة','بطاقة السائق (إن وجدت)','نسخة من عقد العمل','الشهادة الدراسية / المؤهل'])}
      <div class="sign-grid two" style="margin-top:50px">${signBox('توقيع الموظف المسؤول')}${signBox('توقيع مدير الموارد البشرية')}</div>
      ${docFooter(emp)}`;
  }
};

/* ============================================================
   2) عقود العمل
   ============================================================ */
const CONTRACT_OBLIGATIONS = [
  ["8.1","تقديم الرعاية الطبية للطرف الثاني بالتأمين الصحي وفقاً لأحكام نظام الضمان الصحي التعاوني","Providing the second party with health care in accordance with the Cooperative Health Insurance Law"],
  ["8.2","تسجيل الطرف الثاني لدى المؤسسة العامة للتأمينات الاجتماعية، وسداد الاشتراكات حسب أنظمتها","Registering the second party with GOSI and paying contributions accordingly"],
  ["8.3","منح الطرف الثاني الإجازات السنوية والعطل الرسمية والإجازات المرضية وفق لائحة تنظيم العمل المعتمدة من وزارة الموارد البشرية والتنمية الاجتماعية","Granting the second party annual leave, official holidays and sick leave as required by the approved labor regulations"],
  ["8.4","أن يعيد إلى الطرف الثاني جميع ما أودعه لديه من شهادات أو وثائق","Returning to the second party all certificates or documents submitted"],
  ["8.5","دفع أجر الطرف الثاني وتصفية حقوقه خلال أسبوع على الأكثر من تاريخ انتهاء العلاقة العقدية، وإذا كان العامل هو من أنهى العقد فخلال مدة لا تزيد على أسبوعين","Paying the second party's wages and settling entitlements within one week (or two weeks if the worker ends the contract) from the end of the contractual relation"],
];
const CONTRACT_DUTIES = [
  ["9.1","إنجاز العمل الموكل إليه وفقاً لأصول المهنة وتعليمات الطرف الأول، ما لم تخالف النظام أو الآداب العامة","Performing assigned work per professional standards and the first party's instructions"],
  ["9.2","العناية الكافية بالأدوات والمهمات المسندة إليه، وإعادة المواد غير المستهلكة للطرف الأول","Adequately caring for tools and tasks assigned, and returning unconsumed materials"],
  ["9.3","الموافقة على استقطاع النسبة المقررة من الأجر الشهري للاشتراك في التأمينات الاجتماعية","Approving the deduction of the prescribed GOSI percentage from the monthly wage"],
  ["9.4","الالتزام بحسن السلوك والأخلاق والأنظمة والأعراف المرعية في المملكة وقواعد الطرف الأول، وتحمل أي غرامات ناتجة عن المخالفة","Committing to good conduct and all applicable regulations, and bearing any resulting fines"],
  ["9.5","تقديم كل عون ومساعدة دون أجر إضافي في حالات الكوارث والأخطار التي تهدد سلامة مكان العمل","Providing assistance without extra pay during disasters or safety threats"],
  ["9.6","الخضوع للفحوصات الطبية التي يطلبها صاحب العمل للتحقق من الخلو من الأمراض المهنية أو السارية","Undergoing medical examinations requested by the employer"],
];
const CONTRACT_GENERAL = [
  ["10.1","يكون نظام العمل ولائحته التنفيذية والقرارات الوزارية المرجع فيما لم يرد به نص بهذا العقد، ويحل هذا العقد محل كافة الاتفاقيات السابقة","The Labor Law and its regulations shall govern any matter not covered herein; this contract replaces all prior agreements"],
  ["10.2","العناوين الموضحة في صدر العقد هي العناوين النظامية لتبادل الإشعارات وتعتبر المخاطبات ذات حجة نظامية","The addresses stated herein are the official addresses for notifications"],
  ["10.3","يقر الطرفان بأنهما قد علما وفهما كل أحكام هذا العقد ومضمونه","Both parties acknowledge understanding all provisions of this contract"],
];
const CONTRACT_ADDITIONAL = [
  ["11.1","يتجدد هذا العقد تلقائياً لمدة مماثلة ما لم يُشعر أحد الطرفين بعدم رغبته بالتجديد قبل 60 يوماً من نهاية العقد","This contract renews automatically unless either party gives 60 days' notice of non-renewal"],
  ["11.2","يجوز لأي من الطرفين إنهاء العقد بموجب إشعار كتابي للطرف الآخر قبل 60 يوماً أو دفع راتب شهرين","Either party may terminate the contract with 60 days' written notice or payment of two months' salary"],
];

function renderClauseList(list){
  return list.map(([num,ar,en])=>`
    <div class="bi-row">
      <div class="ar"><span style="color:var(--sand);font-weight:800">${num}</span> ${ar}</div>
      <div class="en">${en}</div>
    </div>`).join('');
}

function renderEmploymentContract(emp, m, opts){
  opts = opts || {};
  const co = companyOf(emp);
  const start = m.startDate || emp.contractStart;
  const end = m.endDate || emp.contractEnd;
  return `
    <div class="doc-header"><img src="assets/logo.png"><div class="co-name">${co.nameAr}<br>${co.nameEn}</div></div>
    <div class="doc-title"><h1>عقد عمل</h1><h2>Employment Contract</h2></div>
    <div class="bi-row">
      <div class="ar">أُبرم هذا العقد في: <b>${m.contractDate?fmtDate(m.contractDate):todayStr()}</b> بين: <br><b>${co.nameAr}</b><br>رقم المنشأة في التأمينات الاجتماعية: ${co.gosi} — سجل تجاري رقم: ${co.cr}<br>يمثلها في توقيع هذا العقد: ${esc(m.signatory||'سليمان ناصر الحمد')} بصفته: ${esc(m.signatoryTitle||'وكيل')}<br>ويشار إليه فيما بعد بـ(الطرف الأول)</div>
      <div class="en">This Agreement was made on: <b>${m.contractDate?fmtDate(m.contractDate):todayStr()}</b> between:<br><b>${co.nameEn}</b><br>GOSI No.: ${co.gosi} — CR No.: ${co.cr}<br>Represented by: ${esc(m.signatory||'SLYMAN NASSER ALHAMAD')}, Capacity: ${esc(m.signatoryTitle||'Representative')}<br>Referred to as (First Party)</div>
    </div>
    <div class="bi-row">
      <div class="ar">وبين: <b>${esc(emp.nameAr)}</b> — الجنسية: ${esc(emp.nationalityAr)} — رقم الهوية: ${esc(emp.idNumber)} — الرقم الوظيفي: ${esc(emp.jobNo)}<br>ويشار إليه فيما بعد بـ(الطرف الثاني)</div>
      <div class="en">And: <b>${esc(emp.nameEn||emp.nameAr)}</b> — Nationality: ${esc(emp.nationalityEn)} — ID: ${esc(emp.idNumber)} — Job No.: ${esc(emp.jobNo)}<br>Referred to as (Second Party)</div>
    </div>
    <div class="section-title">بنود العقد / Contract Terms</div>
    <div class="bi-row"><div class="ar"><b>1. المهنة ومكان العمل</b><br>المسمى الوظيفي: ${esc(emp.jobTitleAr)} — مقر العمل: ${esc(emp.workLocationAr)} — نطاق العمل: داخل المملكة — نوع العمل: دوام كامل</div>
      <div class="en"><b>1. Job Title & Location</b><br>Title: ${esc(emp.jobTitleEn||emp.jobTitleAr)} — Location: ${esc(emp.workLocationEn||emp.workLocationAr)} — Domain: Inside Saudi Arabia — Type: Full Time</div></div>
    <div class="bi-row"><div class="ar"><b>2. مدة العقد</b><br>يسري هذا العقد لمدة ${esc(m.durationAr||'سنة')} تبدأ من ${fmtDate(start)} وتنتهي في ${fmtDate(end)}</div>
      <div class="en"><b>2. Contract Period</b><br>Effective for ${esc(m.durationEn||'one year')} from ${fmtDate(start)} to ${fmtDate(end)}</div></div>
    <div class="bi-row"><div class="ar"><b>3. فترة التجربة</b><br>يخضع الطرف الثاني لفترة تجربة مدتها ${esc(m.probationDays||90)} يوماً تبدأ من تاريخ مباشرته للعمل، ولا يدخل في حسابها إجازة عيدي الفطر والأضحى والإجازة المرضية</div>
      <div class="en"><b>3. Probationary Period</b><br>${esc(m.probationDays||90)} days from the start date, excluding Eid holidays and sick leave</div></div>
    <div class="bi-row"><div class="ar"><b>4. ساعات العمل والراحة الأسبوعية</b><br>6 أيام عمل أسبوعياً، 8 ساعات يومياً، ويوم راحة أسبوعي واحد</div>
      <div class="en"><b>4. Work Hours & Weekly Rest</b><br>6 working days/week, 8 hours/day, one rest day per week</div></div>
    <div class="bi-row"><div class="ar"><b>5. الإجازات السنوية</b><br>يحق للطرف الثاني إجازة سنوية مدفوعة الأجر مدتها ${esc(emp.annualLeave||21)} يوماً تقويمياً عن كل عام</div>
      <div class="en"><b>5. Annual Leave</b><br>${esc(emp.annualLeave||21)} paid calendar days per year</div></div>
    <div class="section-title">6. الأجر والمزايا المالية / Wages & Benefits</div>
    <table class="doc-table"><thead><tr><th>البند</th><th>المبلغ (ر.س)</th></tr></thead>
      <tbody>
        <tr><td>الأجر الأساسي</td><td>${money(emp.basic)}</td></tr>
        <tr><td>بدل السكن</td><td>${money(emp.housing)}</td></tr>
        <tr><td>بدل النقل</td><td>${money(emp.transport)}</td></tr>
        <tr><td>بدل غلاء المعيشة</td><td>${money(emp.living)}</td></tr>
        <tr><td><b>الإجمالي شهرياً</b></td><td><b>${money(emp.total)}</b></td></tr>
      </tbody></table>
    ${opts.commission ? `<div class="bi-row"><div class="ar"><b>6.1 العمولة</b><br>${esc(m.commissionText||'يستحق الطرف الثاني عمولة إضافية وفق نظام العمولات المعتمد لدى الطرف الأول، وتحتسب وتصرف شهرياً حسب تحقق الشروط.')}</div><div class="en"><b>6.1 Commission</b><br>${esc(m.commissionTextEn||"The second party is entitled to additional commission per the employer's approved commission scheme, calculated and paid monthly upon meeting the conditions.")}</div></div>` : ''}
    <div class="bi-row"><div class="ar"><b>7. الحساب البنكي</b><br>اسم البنك: ${esc(emp.bankAr)} — رقم الآيبان: ${esc(emp.iban)}</div>
      <div class="en"><b>7. Bank Account</b><br>Bank: ${esc(emp.bankEn||emp.bankAr)} — IBAN: ${esc(emp.iban)}</div></div>
    <div class="section-title">8. التزامات الطرف الأول / First Party's Obligations</div>
    ${renderClauseList(CONTRACT_OBLIGATIONS)}
    <div class="section-title">9. التزامات الطرف الثاني / Second Party's Obligations</div>
    ${renderClauseList(CONTRACT_DUTIES)}
    <div class="section-title">10. أحكام عامة / General Provisions</div>
    ${renderClauseList(CONTRACT_GENERAL)}
    <div class="section-title">11. بنود إضافية / Additional Terms</div>
    ${renderClauseList(CONTRACT_ADDITIONAL)}
    <div class="sign-grid two" style="margin-top:50px">
      <div class="sign-box"><div class="line">${co.nameAr}<br>${esc(m.signatory||'سليمان ناصر الحمد')}</div></div>
      <div class="sign-box"><div class="line">${esc(emp.nameAr)}<br>${esc(emp.nameEn||'')}</div></div>
    </div>
    ${docFooter(emp)}`;
}

const CONTRACT_MANUAL_FIELDS = [
  {key:'contractDate', label:'تاريخ إبرام العقد', type:'date', default:()=>new Date().toISOString().slice(0,10)},
  {key:'startDate', label:'تاريخ بداية العقد', type:'date', default: e=>e?.contractStart},
  {key:'endDate', label:'تاريخ نهاية العقد', type:'date', default: e=>e?.contractEnd},
  {key:'durationAr', label:'مدة العقد (عربي)', type:'text', default:'سنة'},
  {key:'durationEn', label:'Contract Duration (EN)', type:'text', default:'One year'},
  {key:'probationDays', label:'مدة فترة التجربة (يوم)', type:'number', default:'90'},
  {key:'signatory', label:'اسم المفوض بالتوقيع', type:'text', default:'سليمان ناصر الحمد'},
  {key:'signatoryTitle', label:'صفة المفوض', type:'text', default:'وكيل'},
];

const FORM_AQD_MAWAD = {
  id:'aqd-mawad', cat:'contracts', titleAr:'عقد عمل - بيت هايل لمواد البناء',
  manualFields: CONTRACT_MANUAL_FIELDS,
  render(emp,m){ return renderEmploymentContract(emp,m,{commission:false}); }
};
const FORM_AQD_NAQLIYAT = {
  id:'aqd-naqliyat', cat:'contracts', titleAr:'عقد عمل - بيت هائل للنقليات',
  manualFields: CONTRACT_MANUAL_FIELDS,
  render(emp,m){ return renderEmploymentContract(emp,m,{commission:false}); }
};
const FORM_AQD_SIYANA = {
  id:'aqd-siyana', cat:'contracts', titleAr:'عقد عمل - هائل لصيانة السيارات',
  manualFields: CONTRACT_MANUAL_FIELDS,
  render(emp,m){ return renderEmploymentContract(emp,m,{commission:false}); }
};
const FORM_AQD_MAWAD_AMOLA = {
  id:'aqd-mawad-amola', cat:'contracts', titleAr:'عقد عمل بعمولة - بيت هايل لمواد البناء',
  manualFields: CONTRACT_MANUAL_FIELDS.concat([
    {key:'commissionText', label:'نص بند العمولة (عربي)', type:'textarea'},
    {key:'commissionTextEn', label:'Commission Clause (EN)', type:'textarea'},
  ]),
  render(emp,m){ return renderEmploymentContract(emp,m,{commission:true}); }
};
const FORM_AQD_NAQLIYAT_AMOLA = {
  id:'aqd-naqliyat-amola', cat:'contracts', titleAr:'عقد عمل بعمولة - بيت هائل للنقليات',
  manualFields: CONTRACT_MANUAL_FIELDS.concat([
    {key:'commissionText', label:'نص بند العمولة (عربي)', type:'textarea'},
    {key:'commissionTextEn', label:'Commission Clause (EN)', type:'textarea'},
  ]),
  render(emp,m){ return renderEmploymentContract(emp,m,{commission:true}); }
};

const FORM_AQD_TASHEERA = {
  id:'aqd-tasheera', cat:'contracts', titleAr:'عقد عمل تأشيرة',
  manualFields:[
    {key:'date', label:'التاريخ', type:'date', default:()=>new Date().toISOString().slice(0,10)},
    {key:'visaNumber', label:'رقم التأشيرة', type:'text'},
    {key:'monthlySalary', label:'الراتب الشهري (ر.س)', type:'number', default: e=>e?.total},
    {key:'contractYears', label:'مدة العقد (سنوات)', type:'number', default:'2'},
    {key:'probationMonths', label:'فترة التجربة (أشهر)', type:'number', default:'6'},
  ],
  render(emp,m){
    const co = companyOf(emp);
    return `
      ${docHeader(emp,'عقد عمل')}
      <div class="row">${kv('التاريخ', m.date?fmtDate(m.date):todayStr())}${kv('رقم التأشيرة', m.visaNumber)}</div>
      <p class="para">بموجب هذا العقد تم الاتفاق بين كلا من الطرفين: الطرف الأول: ${co.nameAr} سجل تجاري رقم: ${co.cr}.</p>
      <p class="para">الطرف الثاني السيد: <b>${esc(emp.nameAr||emp.nameEn)}</b> الجنسية: ${esc(emp.nationalityAr)} ويحمل جواز رقم: ${esc(emp.passportNumber)}. وتم الاتفاق بين الطرفين على ما يلي:</p>
      <div class="clause"><span class="num">1.</span> أن يعمل الطرف الثاني لدى الطرف الأول بمهنة: ${esc(emp.jobTitleAr)}، وأن يعمل في أي مكان حسب متطلبات العمل لدى الطرف الأول.</div>
      <div class="clause"><span class="num">2.</span> يؤمّن الطرف الأول للطرف الثاني سكناً جماعياً ورعاية صحية ومواصلات يتم الاتفاق عليها.</div>
      <div class="clause"><span class="num">3.</span> يدفع الطرف الأول للطرف الثاني راتباً شهرياً قدره ${money(m.monthlySalary||emp.total)} ريال.</div>
      <div class="clause"><span class="num">4.</span> العقد لمدة ${esc(m.contractYears||2)} سنة/سنوات قابل للتجديد، يبدأ من تاريخ وصول الطرف الثاني لمقر عمله واستلامه العمل.</div>
      <div class="clause"><span class="num">5.</span> تعتبر أول ${esc(m.probationMonths||6)} أشهر فترة تجربة، ويعتبر العقد ساري المفعول بعد انتهائها.</div>
      <div class="clause"><span class="num">6.</span> يتعهد الطرف الثاني بالحفاظ على الآلات التي في عهدته، ويكون مسؤولاً مسؤولية كاملة عنها وإعادتها بعد انتهاء العمل.</div>
      <div class="clause"><span class="num">7.</span> يعتبر نظام العمل المعمول به في المملكة العربية السعودية مكمّلاً لبنود هذا العقد، وأي خلاف ينشأ بين الطرفين يُفصل فيه وفق هذا النظام.</div>
      <p class="para">وعلى هذا جرى الاتفاق.</p>
      <div class="sign-grid two" style="margin-top:50px">
        <div class="sign-box"><div class="line">الطرف الأول: ${co.nameAr}</div></div>
        <div class="sign-box"><div class="line">الطرف الثاني: ${esc(emp.nameAr)}</div></div>
      </div>
      ${docFooter(emp)}`;
  }
};

/* ============================================================
   3) إنهاء الخدمة وإخلاء الطرف
   ============================================================ */
function serviceDurationText(emp, toDate){
  const yrs = num(emp.serviceYears);
  const {y,m,d} = yearsToYMD(yrs);
  return `${y} سنة و ${m} شهر و ${d} يوم`;
}

const FORM_IKHLA_TARAF = {
  id:'ikhla-taraf', cat:'termination', titleAr:'إخلاء طرف من العمل',
  manualFields:[
    {key:'date', label:'التاريخ', type:'date', default:()=>new Date().toISOString().slice(0,10)},
    {key:'fromDate', label:'من تاريخ', type:'date', default: e=>e?.joinDate},
    {key:'toDate', label:'إلى تاريخ', type:'date', default: e=>e?.releaseDate},
  ],
  render(emp,m){
    return `
      ${docHeader(emp,'إخلاء طرف من العمل')}
      <div class="row">${kv('الرقم الوظيفي', emp.jobNo)}${kv('التاريخ', m.date?fmtDate(m.date):todayStr())}</div>
      <p class="para">تُقر ${companyOf(emp).nameAr} بأن السيد/ة: <b>${esc(emp.nameAr)}</b>، هوية رقم: ${esc(emp.idNumber)}، قد سبق وأن عمل لدينا في قسم: ${esc(emp.deptAr)} بوظيفة: ${esc(emp.jobTitleAr)}، وذلك لمدة ${serviceDurationText(emp)}، من تاريخ ${fmtDate(m.fromDate)} إلى تاريخ ${fmtDate(m.toDate)}.</p>
      <p class="para">هذا وقد قام بتسليمنا جميع العهد التي كانت بحوزته، وقد تم تسليمه إخلاء طرف من العمل بناءً على طلبه.</p>
      <div class="sign-grid two" style="margin-top:70px">${signBox('إدارة الموارد البشرية')}${signBox('ختم الشركة')}</div>
      ${docFooter(emp)}`;
  }
};

const FORM_IKHLA_TARAF_CHECKLIST = {
  id:'ikhla-taraf-checklist', cat:'termination', titleAr:'قائمة إجراءات إخلاء الطرف',
  manualFields:[],
  render(emp){
    return `
      ${docHeader(emp,'قائمة إجراءات إخلاء الطرف')}
      <div class="row">${kv('الاسم', emp.nameAr)}${kv('الرقم الوظيفي', emp.jobNo)}</div>
      <div class="row">${kv('الوظيفة', emp.jobTitleAr)}${kv('الجنسية', emp.nationalityAr)}</div>
      <div class="row">${kv('القسم', emp.deptAr)}${kv('تاريخ الانضمام', fmtDate(emp.joinDate))}</div>
      <div class="section-title">الأوراق المطلوبة لإخلاء الطرف</div>
      ${checklistTable(['ورقة إنهاء العقد','تسليم العهد','إصدار تأشيرة خروج الموظف (إن لزم)','حذف اسم الموظف من المركبات','توقيع الإدارة على إنهاء العقد'])}
      <div class="sign-grid two" style="margin-top:50px">${signBox('توقيع الموظف المسؤول')}${signBox('توقيع مدير الموارد البشرية')}</div>
      ${docFooter(emp)}`;
  }
};

function nonRenewalNotice(id, titleAr, variant){
  return {
    id, cat:'termination', titleAr,
    manualFields:[
      {key:'date', label:'التاريخ', type:'date', default:()=>new Date().toISOString().slice(0,10)},
      {key:'endDate', label:'تاريخ نهاية العقد', type:'date', default: e=>e?.contractEnd},
      {key:'reason', label:'السبب (اختياري - عند إشعار الشركة)', type:'text'},
    ],
    render(emp,m){
      const co = companyOf(emp);
      if(variant==='employee'){
        return `
          ${docHeader(emp,'إشعار بعدم الرغبة في تجديد العقد (من الموظف)')}
          <div class="row">${kv('التاريخ', m.date?fmtDate(m.date):todayStr())}${kv('الرقم الوظيفي', emp.jobNo)}</div>
          <div class="row">${kv('الاسم', emp.nameAr)}${kv('هوية رقم', emp.idNumber)}</div>
          <p class="para">أنا الموظف المذكورة بياناته أعلاه، لا أرغب بتجديد عقدي وذلك لظروفي الشخصية، وآمل منكم الموافقة على ذلك، علماً أن آخر يوم عمل لي مع نهاية عقدي هو تاريخ: ${fmtDate(m.endDate)}.</p>
          <div class="sign-grid two" style="margin-top:70px">${signBox('اسم وتوقيع الموظف')}${signBox('توقيع استلام الموارد البشرية')}</div>
          ${docFooter(emp)}`;
      }
      // company-initiated
      return `
        ${docHeader(emp,'إشعار بعدم الرغبة في تجديد العقد')}
        <div class="row">${kv('التاريخ', m.date?fmtDate(m.date):todayStr())}${kv('الرقم الوظيفي', emp.jobNo)}</div>
        <div class="row">${kv('السيد/ة', emp.nameAr)}${kv('رقم الهوية', emp.idNumber)}</div>
        <div class="row">${kv('المسمى الوظيفي', emp.jobTitleAr)}</div>
        <p class="para">بداية، نتقدم لكم بخالص التقدير والامتنان على ما قدمتم وبذلتم من جهود وتعاون وتفانٍ في العمل طوال فترة عملكم لدينا في ${co.nameAr}.</p>
        <p class="para">ويؤسفنا إبلاغكم بعدم رغبة الشركة في تجديد عقد العمل المقرر انتهاؤه بتاريخ: <b>${fmtDate(m.endDate)}</b>${m.reason?(' وذلك بسبب: '+esc(m.reason)):''}.</p>
        <p class="para">سيتم عمل خروج نهائي للموظف في حال عدم رفع طلب نقل كفالة عبر منصة قوى بعد انتهاء العقد.</p>
        <p class="para">كما نشكر لكم حسن السيرة والسلوك طوال فترة عملكم لدينا، مع تمنياتنا لكم بدوام التوفيق والنجاح.</p>
        <div class="sign-grid two" style="margin-top:60px">${signBox('إدارة الموارد البشرية')}${signBox('توقيع استلام الإشعار من الموظف')}</div>
        ${docFooter(emp)}`;
    }
  };
}
const FORM_NON_RENEWAL_GENERAL = nonRenewalNotice('non-renewal-general','إشعار بعدم الرغبة بتجديد العقد (عام)','company');
const FORM_NON_RENEWAL_COMPANY = nonRenewalNotice('non-renewal-company','إشعار عدم رغبة الشركة بتجديد العقد','company');
const FORM_NON_RENEWAL_EMPLOYEE = nonRenewalNotice('non-renewal-employee','إشعار عدم رغبة الموظف بتجديد العقد','employee');

const FORM_TERM_PROBATION = {
  id:'term-probation', cat:'termination', titleAr:'إنهاء العقد خلال فترة التجربة',
  manualFields:[
    {key:'date', label:'التاريخ', type:'date', default:()=>new Date().toISOString().slice(0,10)},
    {key:'startWorkDate', label:'تاريخ مباشرة العمل', type:'date', default: e=>e?.joinDate},
    {key:'lastDay', label:'آخر يوم عمل', type:'date'},
  ],
  render(emp,m){
    return `
      ${docHeader(emp,'إنهاء العقد خلال فترة التجربة')}
      <div class="row">${kv('التاريخ', m.date?fmtDate(m.date):todayStr())}${kv('الرقم الوظيفي', emp.jobNo)}</div>
      <div class="row">${kv('السيد/ة', emp.nameAr)}${kv('هوية رقم', emp.idNumber)}</div>
      <p class="para">تحية طيبة، الموضوع: إنهاء العقد خلال فترة التجربة.</p>
      <p class="para">إشارة إلى التعاقد معكم ومباشرتكم العمل بتاريخ: ${fmtDate(m.startWorkDate)}، واستناداً على المادة (53) من نظام العمل وبند فترة التجربة في عقد العمل، وحيث أنكم لا تزالون تخضعون لفترة التجربة، يؤسفنا إبلاغكم بعدم رغبة ${companyOf(emp).nameAr} في استمراركم بالعمل.</p>
      <p class="para">وسيكون آخر يوم عمل لكم هو: <b>${m.lastDay?fmtDate(m.lastDay):'—'}</b>.</p>
      <p class="para">شاكرين لكم ما قدمتموه من جهود خلال فترة عملكم معنا، مع تمنياتنا لكم بالتوفيق والنجاح.</p>
      <div class="sign-grid two" style="margin-top:60px">${signBox('إدارة الموارد البشرية')}${signBox('توقيع استلام الإشعار من الموظف')}</div>
      ${docFooter(emp)}`;
  }
};

const FORM_TERM_MUTUAL = {
  id:'term-mutual', cat:'termination', titleAr:'إنهاء العقد بالتراضي',
  manualFields:[
    {key:'date', label:'التاريخ', type:'date', default:()=>new Date().toISOString().slice(0,10)},
    {key:'originalEnd', label:'تاريخ نهاية العقد الأصلي', type:'date', default: e=>e?.contractEnd},
    {key:'lastDay', label:'آخر يوم عمل', type:'date'},
  ],
  render(emp,m){
    const co = companyOf(emp);
    return `
      ${docHeader(emp,'إنهاء العقد بالتراضي')}
      <div class="row">${kv('تاريخ اليوم', m.date?fmtDate(m.date):todayStr())}${kv('الرقم الوظيفي', emp.jobNo)}</div>
      <div class="row">${kv('اسم الموظف', emp.nameAr)}${kv('إقامة/هوية رقم', emp.idNumber)}</div>
      <div class="row">${kv('اسم الشركة', co.nameAr)}${kv('السجل التجاري', co.cr)}</div>
      <p class="para">يقر الطرفان على إنهاء عقد العمل المبرم بينهما، والذي كان من المقرر أن ينتهي بتاريخ: <b>${fmtDate(m.originalEnd)}</b>، على أن يكون آخر يوم عمل للموظف هو تاريخ: <b>${m.lastDay?fmtDate(m.lastDay):'—'}</b>.</p>
      <p class="para">وسيتم تحويل جميع مستحقات الطرف المذكور أعلاه، ويُعتبر إنهاء عقد العمل رغبة من قبل الطرفين، ولا يجوز إجبار أي من الطرفين على الآخر بسبب إنهاء العقد أو أي أسباب أخرى.</p>
      <div class="sign-grid two" style="margin-top:60px">${signBox('عن الشركة')}${signBox('الموظف')}</div>
      ${docFooter(emp)}`;
  }
};

const FORM_TERM_RELATIONSHIP = {
  id:'term-relationship', cat:'termination', titleAr:'إشعار إنهاء تعاقد (من الشركة)',
  manualFields:[
    {key:'date', label:'التاريخ', type:'date', default:()=>new Date().toISOString().slice(0,10)},
    {key:'reason', label:'سبب الإنهاء', type:'text', default:'الرغبة في تقليص عدد الموظفين'},
    {key:'penalty', label:'الشرط الجزائي', type:'text', default:'راتب شهرين'},
    {key:'lastDay', label:'آخر يوم عمل', type:'date'},
  ],
  render(emp,m){
    return `
      ${docHeader(emp,'إشعار إنهاء تعاقد','ACKNOWLEDGEMENT OF CONTRACT TERMINATION')}
      <div class="row">${kv('التاريخ', m.date?fmtDate(m.date):todayStr())}${kv('الرقم الوظيفي', emp.jobNo)}</div>
      <div class="row">${kv('الاسم', emp.nameAr)}${kv('المسمى الوظيفي', emp.jobTitleAr)}${kv('الإدارة', emp.deptAr)}</div>
      <p class="para">السلام عليكم ورحمة الله وبركاته،</p>
      <p class="para">بداية نشكر لكم جهودكم طيلة فترة عملكم لدينا، ويؤسفنا إبلاغكم برغبة الشركة في إنهاء التعاقد معكم، وذلك بناءً على السبب التالي: <b>${esc(m.reason)}</b>.</p>
      <p class="para">وسيتم دفع الشرط الجزائي وهو: <b>${esc(m.penalty)}</b>. آمل مراجعة الإدارة العامة للموارد البشرية لإنهاء إجراءات إخلاء الطرف.</p>
      <p class="para">وآخر يوم عمل بتاريخ: <b>${m.lastDay?fmtDate(m.lastDay):'—'}</b>.</p>
      <div class="sign-grid two" style="margin-top:60px">${signBox('الاسم والتوقيع (الشركة)')}${signBox('الاسم والتوقيع (الموظف)')}</div>
      ${docFooter(emp)}`;
  }
};

function resignationNotice(id, titleAr, duringProbation){
  return {
    id, cat:'termination', titleAr,
    manualFields:[
      {key:'date', label:'التاريخ', type:'date', default:()=>new Date().toISOString().slice(0,10)},
      {key:'reason', label:'سبب الاستقالة', type:'text', default:'ظروفي الشخصية'},
      {key:'lastDay', label:'آخر يوم عمل', type:'date'},
    ],
    render(emp,m){
      return `
        ${docHeader(emp, duringProbation?'إشعار إنهاء العقد خلال فترة التجربة (من الموظف)':'إشعار إنهاء العقد (من الموظف)')}
        <div class="row">${kv('التاريخ', m.date?fmtDate(m.date):todayStr())}${kv('الرقم الوظيفي', emp.jobNo)}</div>
        <div class="row">${kv('الاسم', emp.nameAr)}${kv('المسمى الوظيفي', emp.jobTitleAr)}${kv('الإدارة', emp.deptAr)}</div>
        <p class="para">أنا الموظف المذكورة بياناته أعلاه أرغب بإنهاء عقدي ${duringProbation?'خلال فترة التجربة ':''}وذلك بسبب ${esc(m.reason)}، وآمل منكم الموافقة على ذلك، علماً أن آخر يوم عمل لي هو تاريخ: <b>${m.lastDay?fmtDate(m.lastDay):'—'}</b>.</p>
        <div class="sign-grid two" style="margin-top:70px">${signBox('اسم وتوقيع الموظف')}${signBox('توقيع استلام الموارد البشرية')}</div>
        ${docFooter(emp)}`;
    }
  };
}
const FORM_RESIGN = resignationNotice('resign-general','إشعار إنهاء العقد من قبل الموظف', false);
const FORM_RESIGN_PROBATION = resignationNotice('resign-probation','إشعار إنهاء العقد من الموظف (فترة التجربة)', true);

const FORM_EXTEND_PROBATION = {
  id:'extend-probation', cat:'termination', titleAr:'تمديد فترة التجربة',
  manualFields:[
    {key:'date', label:'التاريخ', type:'date', default:()=>new Date().toISOString().slice(0,10)},
    {key:'startWorkDate', label:'تاريخ مباشرة العمل', type:'date', default: e=>e?.joinDate},
    {key:'extensionDays', label:'مدة التمديد (يوم)', type:'number', default:'90'},
  ],
  render(emp,m){
    return `
      ${docHeader(emp,'تمديد فترة التجربة','Extension of Probation Period')}
      <div class="row">${kv('الرقم الوظيفي', emp.jobNo)}${kv('التاريخ', m.date?fmtDate(m.date):todayStr())}</div>
      <p class="para">السيد/ة: <b>${esc(emp.nameAr)}</b> — الموضوع: تمديد فترة التجربة.</p>
      <p class="para">إشارة إلى التعاقد معكم بوظيفة: ${esc(emp.jobTitleAr)}، ومباشرتكم العمل بتاريخ: ${fmtDate(m.startWorkDate)}، وحيث أنكم لا تزالون في فترة التجربة، واستناداً على المادة (53) من نظام العمل، سوف يتم تمديد فترة التجربة لمدة إضافية مقدارها <b>${esc(m.extensionDays||90)} يوماً</b> وفق نظام العمل.</p>
      <p class="para">مع تمنياتنا لكم بالتوفيق والنجاح.</p>
      <div class="sign-grid two" style="margin-top:70px">${signBox('إدارة الموارد البشرية')}${signBox('توقيع استلام الموظف')}</div>
      ${docFooter(emp)}`;
  }
};

const FORM_SETTLEMENT_DATA = {
  id:'settlement-data', cat:'termination', titleAr:'بيانات تسوية مستحقات الموظف',
  manualFields:[
    {key:'date', label:'تاريخ اليوم', type:'date', default:()=>new Date().toISOString().slice(0,10)},
    {key:'reason', label:'سبب ترك العمل', type:'text'},
    {key:'lastDay', label:'آخر يوم عمل', type:'date'},
    {key:'vacationAmount', label:'مبلغ بدل الإجازة (ر.س)', type:'number'},
    {key:'workdaysAmount', label:'مبلغ أيام العمل (ر.س)', type:'number'},
    {key:'eosAmount', label:'مكافأة نهاية الخدمة (ر.س)', type:'number'},
    {key:'penalty', label:'شرط جزائي (ر.س)', type:'number'},
    {key:'deductions', label:'ذمم وخصومات (ر.س)', type:'number'},
  ],
  render(emp,m){
    const {y,mo,d} = (()=>{ const r=yearsToYMD(num(emp.serviceYears)); return {y:r.y,mo:r.m,d:r.d}; })();
    const total = num(m.vacationAmount)+num(m.workdaysAmount)+num(m.eosAmount)-num(m.penalty)-num(m.deductions);
    return `
      ${docHeader(emp,'بيانات تسوية مستحقات الموظف','Employee Entitlements Settlement Data')}
      <div class="row">${kv('تاريخ اليوم', m.date?fmtDate(m.date):todayStr())}</div>
      <div class="section-title">معلومات الموظف</div>
      <div class="row">${kv('الاسم', emp.nameAr)}${kv('الرقم الوظيفي', emp.jobNo)}</div>
      <div class="row">${kv('الوظيفة', emp.jobTitleAr)}${kv('الجنسية', emp.nationalityAr)}</div>
      <div class="row">${kv('القسم', emp.deptAr)}${kv('سبب ترك العمل', m.reason)}</div>
      <div class="row">${kv('تاريخ الالتحاق', fmtDate(emp.joinDate))}${kv('آخر يوم عمل', m.lastDay?fmtDate(m.lastDay):fmtDate(emp.releaseDate))}</div>
      <div class="row">${kv('مدة الخدمة', `${y} سنة، ${mo} شهر، ${d} يوم`)}${kv('رصيد الإجازة السنوية', emp.annualLeave)}</div>
      <div class="section-title">تفصيل الراتب</div>
      <table class="doc-table"><thead><tr><th>الأساسي</th><th>السكن</th><th>النقل</th><th>أخرى</th><th>الإجمالي</th></tr></thead>
        <tbody><tr><td>${money(emp.basic)}</td><td>${money(emp.housing)}</td><td>${money(emp.transport)}</td><td>${money(emp.living)}</td><td><b>${money(emp.total)}</b></td></tr></tbody></table>
      <div class="section-title">المستحقات</div>
      <table class="doc-table">
        <thead><tr><th>البند</th><th>المبلغ (ر.س)</th></tr></thead>
        <tbody>
          <tr><td>مبلغ بدل الإجازة</td><td>${money(m.vacationAmount)}</td></tr>
          <tr><td>مبلغ أيام العمل</td><td>${money(m.workdaysAmount)}</td></tr>
          <tr><td>مكافأة نهاية الخدمة</td><td>${money(m.eosAmount)}</td></tr>
          <tr><td>شرط جزائي (خصم)</td><td>-${money(m.penalty)}</td></tr>
          <tr><td>ذمم وخصومات (خصم)</td><td>-${money(m.deductions)}</td></tr>
          <tr><td><b>الصافي النهائي</b></td><td><b>${money(total)}</b></td></tr>
        </tbody>
      </table>
      <div class="sign-grid" style="margin-top:40px">${signBox('الموارد البشرية')}${signBox('الإدارة المالية')}${signBox('الموظف')}</div>
      ${docFooter(emp)}`;
  }
};

const FORM_MUKHALASA_MALIYA = {
  id:'mukhalasa-maliya', cat:'termination', titleAr:'مخالصة مالية',
  manualFields:[
    {key:'workdaysAmount', label:'مبلغ أيام العمل (ر.س)', type:'number'},
    {key:'vacationAmount', label:'مبلغ بدل الإجازات (ر.س)', type:'number'},
    {key:'eosAmount', label:'مكافأة نهاية الخدمة (ر.س)', type:'number'},
    {key:'penalty', label:'مبلغ الشرط الجزائي (ر.س)', type:'number'},
    {key:'deductions', label:'ذمم وخصومات (ر.س)', type:'number'},
  ],
  render(emp,m){
    const total = num(m.workdaysAmount)+num(m.vacationAmount)+num(m.eosAmount)-num(m.penalty)-num(m.deductions);
    return `
      ${docHeader(emp,'مخالصة مالية')}
      <div class="row">${kv('أنا الموظف', emp.nameAr)}${kv('هوية رقم', emp.idNumber)}${kv('الرقم الوظيفي', emp.jobNo)}</div>
      <p class="para">أقر بأن هذه جميع المبالغ المستحقة لي على الشركة، وهي كالتالي:</p>
      <table class="doc-table">
        <thead><tr><th>البند</th><th>المبلغ (ر.س)</th></tr></thead>
        <tbody>
          <tr><td>مبلغ أيام العمل</td><td>${money(m.workdaysAmount)}</td></tr>
          <tr><td>مبلغ بدل الإجازات</td><td>${money(m.vacationAmount)}</td></tr>
          <tr><td>مبلغ مكافأة نهاية الخدمة</td><td>${money(m.eosAmount)}</td></tr>
          <tr><td>مبلغ الشرط الجزائي</td><td>-${money(m.penalty)}</td></tr>
          <tr><td>ذمم وخصومات</td><td>-${money(m.deductions)}</td></tr>
          <tr><td><b>الإجمالي</b></td><td><b>${money(total)}</b></td></tr>
        </tbody>
      </table>
      <p class="para">ولا يحق لي مطالبة المنشأة بأي مستحقات أو مبالغ مالية أخرى.</p>
      <div class="sign-grid two" style="margin-top:60px">${signBox('توقيع الموظف')}${signBox('توقيع الموارد البشرية')}</div>
      ${docFooter(emp)}`;
  }
};

/* ============================================================
   4) المالية والمستحقات
   ============================================================ */
const FORM_KAFALA_MALIYA = {
  id:'kafala-maliya', cat:'financial', titleAr:'نقل كفالة مالية (ضمان زميل)',
  manualFields:[
    {key:'date', label:'التاريخ', type:'date', default:()=>new Date().toISOString().slice(0,10)},
    {key:'sponsoredName', label:'اسم الموظف المكفول', type:'text'},
    {key:'sponsoredJob', label:'وظيفة الموظف المكفول', type:'text'},
  ],
  render(emp,m){
    return `
      ${docHeader(emp,'نقل كفالة مالية')}
      <div class="row">${kv('التاريخ', m.date?fmtDate(m.date):todayStr())}</div>
      <p class="para">أتعهد أنا الموظف/ة: <b>${esc(emp.nameAr)}</b> — الجنسية: ${esc(emp.nationalityAr)} — الرقم الوظيفي: ${esc(emp.jobNo)}،</p>
      <p class="para">بكفالة الموظف/ة: <b>${esc(m.sponsoredName)}</b>، الوظيفة: ${esc(m.sponsoredJob)}،</p>
      <p class="para">فيما يترتب عليه من التزامات ومستحقات مالية تجاه ${companyOf(emp).nameAr} في حال تركه للعمل، وأفوّض إدارة الموارد البشرية باتخاذ كافة الإجراءات الخاصة بالكفالة وخصم كافة المستحقات المالية المترتبة على الموظف المكفول من راتبي.</p>
      <p class="para">ويكون هذا التعهد سارياً حتى عودة الموظف من إجازته السنوية.</p>
      <div class="sign-grid two" style="margin-top:70px">${signBox('توقيع الكفيل')}${signBox('توقيع الموارد البشرية')}</div>
      ${docFooter(emp)}`;
  }
};

const FORM_ISTILAM_MUSTAHAQAT = {
  id:'istilam-mustahaqat', cat:'financial', titleAr:'سند استلام مستحقات',
  manualFields:[
    {key:'date', label:'التاريخ', type:'date', default:()=>new Date().toISOString().slice(0,10)},
    {key:'fromDate', label:'من تاريخ', type:'date', default: e=>e?.joinDate},
    {key:'toDate', label:'إلى تاريخ', type:'date'},
  ],
  render(emp,m){
    const co = companyOf(emp);
    return `
      ${docHeader(emp,'استلام مستحقات','Receiving Dues')}
      <div class="row">${kv('تاريخ اليوم', m.date?fmtDate(m.date):todayStr())}</div>
      <div class="row">${kv('اسم الموظف', emp.nameAr)}${kv('اسم الشركة', co.nameAr)}</div>
      <div class="row">${kv('إقامة/هوية رقم', emp.idNumber)}${kv('السجل التجاري', co.cr)}</div>
      <div class="row">${kv('الرقم الوظيفي', emp.jobNo)}</div>
      <p class="para">أنا الموظف المذكورة بياناتي أعلاه، أُقر باستلامي جميع مستحقاتي المترتبة على الشركة من تاريخ بداية عملي: ${fmtDate(m.fromDate)} إلى تاريخ: ${m.toDate?fmtDate(m.toDate):'—'}.</p>
      <p class="para">وأتحمل كامل المسؤولية القانونية عن صحة ما ورد في هذا الإقرار، ويُعد توقيعي عليه بمثابة مخالصة نهائية عن مستحقاتي المالية عن الفترة المشار إليها.</p>
      <div class="sign-grid two" style="margin-top:70px">${signBox('توقيع الموظف')}${signBox('توقيع الموارد البشرية')}</div>
      ${docFooter(emp)}`;
  }
};

const FORM_VACATION_DUES = {
  id:'vacation-dues', cat:'financial', titleAr:'طلب صرف مستحقات إجازة',
  manualFields:[
    {key:'date', label:'التاريخ', type:'date', default:()=>new Date().toISOString().slice(0,10)},
    {key:'startVacation', label:'تاريخ بداية الإجازة', type:'date'},
    {key:'endVacation', label:'تاريخ نهاية الإجازة', type:'date'},
    {key:'ticketFrom', label:'الرحلة من', type:'text'},
    {key:'ticketTo', label:'الرحلة إلى', type:'text'},
    {key:'ticketAmount', label:'سعر التذكرة (ر.س)', type:'number'},
    {key:'vacationAllowance', label:'مبلغ بدل الإجازة (ر.س)', type:'number'},
    {key:'unpaidDays', label:'أيام إجازة بدون راتب', type:'number', default:'0'},
  ],
  render(emp,m){
    return `
      ${docHeader(emp,'طلب صرف مستحقات إجازة','Vacation Benefits Request')}
      <div class="row">${kv('التاريخ', m.date?fmtDate(m.date):todayStr())}</div>
      <div class="row">${kv('الاسم', emp.nameAr)}${kv('الوظيفة', emp.jobTitleAr)}${kv('الرقم الوظيفي', emp.jobNo)}${kv('الجنسية', emp.nationalityAr)}</div>
      <table class="doc-table"><thead><tr><th>الأساسي</th><th>السكن</th><th>النقل</th><th>أخرى</th><th>الإجمالي</th></tr></thead>
        <tbody><tr><td>${money(emp.basic)}</td><td>${money(emp.housing)}</td><td>${money(emp.transport)}</td><td>${money(emp.living)}</td><td><b>${money(emp.total)}</b></td></tr></tbody></table>
      <div class="row">${kv('رصيد الإجازات (يوم)', emp.annualLeave)}${kv('مبلغ بدل الإجازة', money(m.vacationAllowance))}${kv('أيام بدون راتب', m.unpaidDays)}</div>
      <div class="section-title">تفاصيل السفر</div>
      <div class="row">${kv('من تاريخ', m.startVacation?fmtDate(m.startVacation):'—')}${kv('إلى تاريخ', m.endVacation?fmtDate(m.endVacation):'—')}</div>
      <div class="row">${kv('الرحلة من', m.ticketFrom)}${kv('الرحلة إلى', m.ticketTo)}${kv('سعر التذكرة', money(m.ticketAmount))}</div>
      <div class="sign-grid" style="margin-top:40px">${signBox('توقيع الإدارة')}${signBox('توقيع الموارد البشرية')}${signBox('توقيع الإدارة المالية')}</div>
      <div class="sign-grid two" style="margin-top:20px">${signBox('توقيع الموظف')}<div></div></div>
      ${docFooter(emp)}`;
  }
};

function salaryReceiptForm(id, titleAr, opts){
  opts = opts||{};
  return {
    id, cat:'financial', titleAr,
    manualFields:[
      {key:'date', label:'التاريخ', type:'date', default:()=>new Date().toISOString().slice(0,10)},
      {key:'amount', label:'المبلغ (ر.س)', type:'number', default: e=>e?.total},
      {key:'period', label: opts.periodLabel || 'وذلك راتب لشهر', type:'text', default:''},
    ],
    render(emp,m){
      return `
        ${docHeader(emp, titleAr)}
        <div class="row">${kv('التاريخ', m.date?fmtDate(m.date):todayStr())}${kv('الرقم الوظيفي', emp.jobNo)}</div>
        <p class="para">أنا ${opts.employeeLabel||'الموظف'}: <b>${esc(emp.nameAr)}</b> (${esc(emp.nameEn||'')})،</p>
        <p class="para">استلمت من ${companyOf(emp).nameAr} مبلغاً وقدره: <b>${money(m.amount)} ريال سعودي</b>،</p>
        <p class="para">${esc(m.period || (opts.defaultPeriodText||''))}</p>
        <div class="sign-grid two" style="margin-top:70px">${signBox('توقيع المستلم')}${signBox('توقيع الموارد البشرية')}</div>
        ${docFooter(emp)}`;
    }
  };
}
const FORM_RECEIPT_SALARY = salaryReceiptForm('receipt-salary','سند استلام راتب', {defaultPeriodText:'وذلك راتب عن الشهر الحالي.'});
const FORM_RECEIPT_SALARY_EXT = salaryReceiptForm('receipt-salary-ext','سند استلام راتب - عمالة خارجية', {employeeLabel:'السيد', defaultPeriodText:'وذلك راتب عن مدة العمل المحددة.'});
const FORM_RECEIPT_BONUS = salaryReceiptForm('receipt-bonus','سند استلام مكافأة', {defaultPeriodText:'وذلك مكافأة عن العام الحالي.'});
const FORM_RECEIPT_ADVANCE = salaryReceiptForm('receipt-advance','سند استلام سلفة', {defaultPeriodText:'وذلك كسلفة تُسترد مني نهاية الشهر.'});

const FORM_ADVANCE_REQUEST = {
  id:'advance-request', cat:'financial', titleAr:'طلب سلفة',
  manualFields:[
    {key:'date', label:'تاريخ اليوم', type:'date', default:()=>new Date().toISOString().slice(0,10)},
    {key:'requestedAmount', label:'السلفة المطلوبة (ر.س)', type:'number'},
    {key:'currentAdvanceBalance', label:'رصيد السلف الحالي (ر.س)', type:'number', default:'0'},
    {key:'monthlyDeduction', label:'الاستقطاع الشهري (ر.س)', type:'number'},
  ],
  render(emp,m){
    return `
      ${docHeader(emp,'طلب سلفة')}
      <div class="row">${kv('تاريخ اليوم', m.date?fmtDate(m.date):todayStr())}</div>
      <div class="row">${kv('الاسم', emp.nameAr)}${kv('الرقم الوظيفي', emp.jobNo)}</div>
      <div class="row">${kv('الوظيفة', emp.jobTitleAr)}${kv('الجنسية', emp.nationalityAr)}</div>
      <div class="row">${kv('القسم', emp.deptAr)}${kv('رصيد الإجازات', emp.annualLeave)}</div>
      <div class="row">${kv('البنك', emp.bankAr)}${kv('الآيبان', emp.iban)}</div>
      <table class="doc-table"><thead><tr><th>الأساسي</th><th>السكن</th><th>النقل</th><th>أخرى</th><th>الإجمالي</th></tr></thead>
        <tbody><tr><td>${money(emp.basic)}</td><td>${money(emp.housing)}</td><td>${money(emp.transport)}</td><td>${money(emp.living)}</td><td><b>${money(emp.total)}</b></td></tr></tbody></table>
      <div class="row">${kv('تاريخ الالتحاق', fmtDate(emp.joinDate))}${kv('نهاية العقد الحالي', fmtDate(emp.contractEnd))}</div>
      <div class="section-title">تفاصيل السلفة</div>
      <div class="row">${kv('السلفة المطلوبة', money(m.requestedAmount))}${kv('رصيد السلف الحالي', money(m.currentAdvanceBalance))}${kv('الاستقطاع الشهري', money(m.monthlyDeduction))}</div>
      <div class="row" style="margin-top:16px">☐ مقبولة &nbsp;&nbsp;&nbsp; ☐ مرفوضة</div>
      <div class="sign-grid" style="margin-top:40px">${signBox('المدير المباشر')}${signBox('الموارد البشرية')}${signBox('الإدارة المالية')}</div>
      ${docFooter(emp)}`;
  }
};

const FORM_SALARY_ADJUST_1 = {
  id:'salary-adjust-1', cat:'financial', titleAr:'نموذج زيادة / تعديل راتب',
  manualFields:[
    {key:'date', label:'التاريخ', type:'date', default:()=>new Date().toISOString().slice(0,10)},
    {key:'suggestedTitle', label:'المسمى الوظيفي المقترح (إن وجد)', type:'text'},
    {key:'newBasic', label:'الراتب الأساسي المقترح', type:'number'},
    {key:'newHousing', label:'بدل السكن المقترح', type:'number'},
    {key:'newTransport', label:'بدل النقل المقترح', type:'number'},
    {key:'newOther', label:'بدلات أخرى مقترحة', type:'number'},
    {key:'effectiveDate', label:'تاريخ سريان الزيادة', type:'date'},
    {key:'reason', label:'أسباب الزيادة', type:'textarea'},
  ],
  render(emp,m){
    const newTotal = num(m.newBasic)+num(m.newHousing)+num(m.newTransport)+num(m.newOther);
    return `
      ${docHeader(emp,'نموذج زيادة / تعديل راتب','Salary Increment / Adjustment')}
      <div class="row">${kv('التاريخ', m.date?fmtDate(m.date):todayStr())}${kv('رقم الموظف', emp.jobNo)}</div>
      <div class="row">${kv('الاسم', emp.nameAr)}${kv('المسمى الوظيفي', emp.jobTitleAr)}</div>
      <div class="row">${kv('تاريخ المباشرة', fmtDate(emp.joinDate))}${kv('القسم', emp.deptAr)}${kv('المسمى المقترح', m.suggestedTitle)}</div>
      <table class="doc-table">
        <thead><tr><th>البيان</th><th>الأساسي</th><th>السكن</th><th>النقل</th><th>أخرى</th></tr></thead>
        <tbody>
          <tr><td>الراتب الحالي</td><td>${money(emp.basic)}</td><td>${money(emp.housing)}</td><td>${money(emp.transport)}</td><td>${money(emp.living)}</td></tr>
          <tr><td>الراتب المقترح</td><td>${money(m.newBasic)}</td><td>${money(m.newHousing)}</td><td>${money(m.newTransport)}</td><td>${money(m.newOther)}</td></tr>
        </tbody>
      </table>
      <div class="row">${kv('الإجمالي الحالي', money(emp.total))}${kv('الإجمالي المقترح', money(newTotal))}${kv('تاريخ السريان', m.effectiveDate?fmtDate(m.effectiveDate):'—')}</div>
      <div class="section-title">أسباب الزيادة</div>
      <p class="para">${esc(m.reason)||'<span class="tag-empty">لم يُذكر</span>'}</p>
      <div class="sign-grid" style="margin-top:40px">${signBox('المدير المباشر (التزكية)')}${signBox('مدير الموارد البشرية')}${signBox('الإدارة المالية')}</div>
      <div class="sign-grid two" style="margin-top:20px">${signBox('الموافقة النهائية - المدير التنفيذي')}${signBox('الموظف')}</div>
      ${docFooter(emp)}`;
  }
};

const FORM_SALARY_ADJUST_2 = {
  id:'salary-adjust-2', cat:'financial', titleAr:'عقد تعديل راتب موظف',
  manualFields:[
    {key:'date', label:'تاريخ التعديل', type:'date', default:()=>new Date().toISOString().slice(0,10)},
    {key:'newBasic', label:'الراتب الأساسي الجديد', type:'number', default: e=>e?.basic},
    {key:'newHousing', label:'بدل السكن الجديد', type:'number', default: e=>e?.housing},
    {key:'newTransport', label:'بدل النقل الجديد', type:'number', default: e=>e?.transport},
    {key:'newOther', label:'بدلات أخرى', type:'number', default:'0'},
    {key:'effectiveDate', label:'تاريخ سريان التعديل', type:'date'},
    {key:'originalContractDate', label:'تاريخ عقد العمل الأصلي', type:'date', default: e=>e?.contractStart},
  ],
  render(emp,m){
    const co = companyOf(emp);
    const newTotal = num(m.newBasic)+num(m.newHousing)+num(m.newTransport)+num(m.newOther);
    return `
      ${docHeader(emp,'تعديل راتب موظف')}
      <div class="row">${kv('التاريخ', m.date?fmtDate(m.date):todayStr())}</div>
      <div class="bi-row">
        <div class="ar"><b>الطرف الأول:</b> ${co.nameAr} — سجل تجاري: ${co.cr}</div>
        <div class="ar"><b>الطرف الثاني:</b> ${esc(emp.nameAr)} — هوية رقم: ${esc(emp.idNumber)} — الرقم الوظيفي: ${esc(emp.jobNo)}</div>
      </div>
      <p class="para">بالإشارة إلى عقد العمل المبرم بين الطرفين بتاريخ: ${fmtDate(m.originalContractDate)}، وبناءً على مصلحة العمل، فقد تم الاتفاق على تعديل الراتب الشهري للموظف المذكور أعلاه كما يلي:</p>
      <table class="doc-table">
        <thead><tr><th>البند</th><th>المبلغ (ر.س)</th></tr></thead>
        <tbody>
          <tr><td>الراتب الأساسي</td><td>${money(m.newBasic)}</td></tr>
          <tr><td>بدل السكن</td><td>${money(m.newHousing)}</td></tr>
          <tr><td>بدل النقل</td><td>${money(m.newTransport)}</td></tr>
          <tr><td>بدلات أخرى</td><td>${money(m.newOther)}</td></tr>
          <tr><td><b>الإجمالي</b></td><td><b>${money(newTotal)}</b></td></tr>
        </tbody>
      </table>
      <p class="para">يسري هذا التعديل اعتباراً من تاريخ: <b>${m.effectiveDate?fmtDate(m.effectiveDate):'—'}</b>. تبقى جميع شروط وأحكام عقد العمل الأصلي سارية المفعول دون تغيير، باستثناء ما تم تعديله بموجب هذا المستند، ويُعد هذا التعديل جزءاً لا يتجزأ من عقد العمل الأصلي ويخضع لجميع الأنظمة المعمول بها في المملكة العربية السعودية.</p>
      <div class="sign-grid two" style="margin-top:60px">${signBox(co.nameAr)}${signBox(emp.nameAr)}</div>
      ${docFooter(emp)}`;
  }
};

/* ============================================================
   5) العمليات اليومية
   ============================================================ */
const FORM_HIRING_PROCEDURES = {
  id:'hiring-procedures', cat:'operations', titleAr:'إجراءات التوظيف',
  manualFields:[
    {key:'startDate', label:'تاريخ مباشرة العمل', type:'date', default: e=>e?.joinDate},
    {key:'maritalStatus', label:'الحالة الاجتماعية', type:'text'},
    {key:'workCity', label:'مدينة العمل', type:'text', default: e=>e?.workLocationAr},
  ],
  render(emp,m){
    return `
      ${docHeader(emp,'إجراءات التوظيف','Employment Procedures')}
      <div class="row">${kv('سعودي / أجنبي', emp.nationalityAr==='سعودي'?'سعودي':'أجنبي')}</div>
      <div class="row">${kv('اسم الموظف', emp.nameAr)}${kv('رقم الهوية', emp.idNumber)}</div>
      <div class="row">${kv('تاريخ الميلاد', fmtDate(emp.birthDate))}${kv('الحالة الاجتماعية', m.maritalStatus)}</div>
      <div class="row">${kv('الجنسية', emp.nationalityAr)}${kv('البريد الإلكتروني', emp.email)}</div>
      <div class="row">${kv('رقم الجوال', emp.phone)}${kv('مدينة العمل', m.workCity)}</div>
      <div class="row">${kv('اسم البنك', emp.bankAr)}${kv('رقم الحساب/الآيبان', emp.iban)}</div>
      <div class="row">${kv('تاريخ مباشرة العمل', m.startDate?fmtDate(m.startDate):'—')}</div>
      <div class="sign-grid" style="margin-top:50px">${signBox('توقيع الموظف')}${signBox('توقيع المدير المباشر')}${signBox('توقيع الموارد البشرية')}</div>
      ${docFooter(emp)}`;
  }
};

const FORM_MUBASHARAT_AMAL = {
  id:'mubasharat-amal', cat:'operations', titleAr:'إقرار مباشرة عمل',
  manualFields:[
    {key:'date', label:'تاريخ المباشرة', type:'date', default: e=>e?.joinDate},
  ],
  render(emp,m){
    return `
      ${docHeader(emp,'إقرار مباشرة عمل')}
      <div class="row">${kv('الرقم الوظيفي', emp.jobNo)}${kv('الإدارة', emp.deptAr)}</div>
      <p class="para">أنا الموظف: <b>${esc(emp.nameAr)}</b> — هوية رقم: ${esc(emp.idNumber)}،</p>
      <p class="para">أُقر أنا الموقّع أدناه أنني باشرت عملي بتاريخ: <b>${m.date?fmtDate(m.date):'—'}</b> بعد تعييني حسب النظام المعمول به في الشركة.</p>
      <p class="para">وأتحمل كامل المسؤولية النظامية تجاه التزاماتي الوظيفية ابتداءً من هذا التاريخ.</p>
      <div class="sign-grid two" style="margin-top:70px">${signBox('اسم وتوقيع الموظف')}${signBox('توقيع الموارد البشرية')}</div>
      ${docFooter(emp)}`;
  }
};

const FORM_ABSENCE_WARNING = {
  id:'absence-warning', cat:'operations', titleAr:'إنذار غياب عن العمل',
  manualFields:[
    {key:'date', label:'التاريخ', type:'date', default:()=>new Date().toISOString().slice(0,10)},
    {key:'absenceDays', label:'عدد أيام الغياب المتواصلة', type:'number'},
    {key:'fromDate', label:'من تاريخ', type:'date'},
    {key:'toDate', label:'إلى تاريخ', type:'date'},
  ],
  render(emp,m){
    return `
      ${docHeader(emp,'إنذار غياب عن العمل','Notice of Absence from Work')}
      <div class="row">${kv('التاريخ', m.date?fmtDate(m.date):todayStr())}${kv('الرقم الوظيفي', emp.jobNo)}</div>
      <div class="row">${kv('الاسم', emp.nameAr)}${kv('الجنسية', emp.nationalityAr)}</div>
      <div class="row">${kv('الوظيفة', emp.jobTitleAr)}${kv('القسم', emp.deptAr)}</div>
      <div class="row">${kv('هوية رقم', emp.idNumber)}</div>
      <p class="para">عدد الأيام التي تم التغيب فيها عن العمل: <b>${esc(m.absenceDays)}</b> يوم عمل متواصلة، وذلك بداية من تاريخ ${m.fromDate?fmtDate(m.fromDate):'—'} إلى تاريخ ${m.toDate?fmtDate(m.toDate):'—'}.</p>
      <p class="para">وعليه فإننا نشعركم أنه عند وصول عدد أيام الغياب إلى 15 يوم عمل متواصل، سيتم فصلكم من الشركة وذلك استناداً إلى المادة (80) من نظام العمل الصادر عن وزارة الموارد البشرية والتنمية الاجتماعية.</p>
      <div class="sign-grid two" style="margin-top:70px">${signBox('إدارة الموارد البشرية')}${signBox('توقيع استلام الموظف')}</div>
      ${docFooter(emp)}`;
  }
};

const FORM_BUSINESS_TRIP = {
  id:'business-trip', cat:'operations', titleAr:'نموذج رحلة عمل',
  manualFields:[
    {key:'date', label:'تاريخ اليوم', type:'date', default:()=>new Date().toISOString().slice(0,10)},
    {key:'destination', label:'المنطقة / المدينة المقصودة', type:'text'},
    {key:'fromDate', label:'من تاريخ', type:'date'},
    {key:'toDate', label:'إلى تاريخ', type:'date'},
    {key:'purpose', label:'الهدف من الرحلة', type:'textarea'},
    {key:'accommodation', label:'مصاريف السكن (ر.س)', type:'number'},
    {key:'expenses', label:'مصاريف أخرى (ر.س)', type:'number'},
  ],
  render(emp,m){
    const total = num(m.accommodation)+num(m.expenses);
    return `
      ${docHeader(emp,'نموذج رحلة عمل')}
      <div class="row">${kv('تاريخ اليوم', m.date?fmtDate(m.date):todayStr())}</div>
      <div class="row">${kv('الاسم', emp.nameAr)}${kv('الرقم الوظيفي', emp.jobNo)}</div>
      <div class="row">${kv('الوظيفة', emp.jobTitleAr)}${kv('الجنسية', emp.nationalityAr)}</div>
      <div class="row">${kv('القسم', emp.deptAr)}${kv('الوجهة', m.destination)}</div>
      <div class="row">${kv('من تاريخ', m.fromDate?fmtDate(m.fromDate):'—')}${kv('إلى تاريخ', m.toDate?fmtDate(m.toDate):'—')}</div>
      <div class="section-title">الهدف من الرحلة</div>
      <p class="para">${esc(m.purpose)||'<span class="tag-empty">لم يُذكر</span>'}</p>
      <div class="section-title">المصروفات</div>
      <table class="doc-table"><thead><tr><th>البند</th><th>المبلغ (ر.س)</th></tr></thead>
        <tbody><tr><td>السكن</td><td>${money(m.accommodation)}</td></tr><tr><td>مصاريف أخرى</td><td>${money(m.expenses)}</td></tr><tr><td><b>الإجمالي</b></td><td><b>${money(total)}</b></td></tr></tbody></table>
      <div class="sign-grid two" style="margin-top:50px">${signBox('توقيع الموظف')}${signBox('اعتماد المدير المباشر')}</div>
      ${docFooter(emp)}`;
  }
};

const FORM_TRAVEL_DUES = {
  id:'travel-dues', cat:'operations', titleAr:'تسوية مستحقات السفر',
  manualFields:[
    {key:'date', label:'تاريخ اليوم', type:'date', default:()=>new Date().toISOString().slice(0,10)},
    {key:'lastDay', label:'آخر يوم عمل', type:'date', default: e=>e?.releaseDate},
    {key:'ticketTotal', label:'إجمالي التذكرة (ر.س)', type:'number'},
    {key:'visaTotal', label:'إجمالي التأشيرة (ر.س)', type:'number'},
    {key:'employeeShareTicket', label:'المستحق على الموظف - تذكرة (ر.س)', type:'number'},
    {key:'employeeShareVisa', label:'المستحق على الموظف - تأشيرة (ر.س)', type:'number'},
    {key:'companyShareTicket', label:'المستحق على الشركة - تذكرة (ر.س)', type:'number'},
    {key:'companyShareVisa', label:'المستحق على الشركة - تأشيرة (ر.س)', type:'number'},
  ],
  render(emp,m){
    const {y,mo,d} = yearsToYMD(num(emp.serviceYears));
    return `
      ${docHeader(emp,'تسوية مستحقات السفر')}
      <div class="row">${kv('تاريخ اليوم', m.date?fmtDate(m.date):todayStr())}</div>
      <div class="row">${kv('الاسم', emp.nameAr)}${kv('الرقم الوظيفي', emp.jobNo)}</div>
      <div class="row">${kv('الوظيفة', emp.jobTitleAr)}${kv('الجنسية', emp.nationalityAr)}</div>
      <div class="row">${kv('القسم', emp.deptAr)}${kv('مدة الخدمة', `${y} سنة، ${mo} شهر، ${d} يوم`)}</div>
      <div class="row">${kv('بداية العقد', fmtDate(emp.contractStart))}${kv('آخر يوم عمل', m.lastDay?fmtDate(m.lastDay):'—')}</div>
      <div class="row">${kv('إجمالي التذكرة', money(m.ticketTotal))}${kv('إجمالي التأشيرة', money(m.visaTotal))}</div>
      <table class="doc-table">
        <thead><tr><th>البند</th><th>على الموظف (ر.س)</th><th>على الشركة (ر.س)</th></tr></thead>
        <tbody>
          <tr><td>تذكرة الطيران</td><td>${money(m.employeeShareTicket)}</td><td>${money(m.companyShareTicket)}</td></tr>
          <tr><td>التأشيرة</td><td>${money(m.employeeShareVisa)}</td><td>${money(m.companyShareVisa)}</td></tr>
          <tr><td><b>الإجمالي</b></td><td><b>${money(num(m.employeeShareTicket)+num(m.employeeShareVisa))}</b></td><td><b>${money(num(m.companyShareTicket)+num(m.companyShareVisa))}</b></td></tr>
        </tbody>
      </table>
      <div class="sign-grid two" style="margin-top:50px">${signBox('الموارد البشرية')}${signBox('الإدارة المالية')}</div>
      ${docFooter(emp)}`;
  }
};

const FORM_ASSIGNMENT_REPORT = {
  id:'assignment-report', cat:'operations', titleAr:'نموذج الانتداب',
  manualFields:[
    {key:'date', label:'تاريخ اليوم', type:'date', default:()=>new Date().toISOString().slice(0,10)},
    {key:'entity', label:'اسم الجهة المنتدب إليها', type:'text'},
    {key:'fromDate', label:'من تاريخ', type:'date'},
    {key:'toDate', label:'إلى تاريخ', type:'date'},
    {key:'taskSummary', label:'ملخص المهمة', type:'textarea'},
    {key:'detailedReport', label:'التقرير التفصيلي', type:'textarea'},
    {key:'resultsSummary', label:'ملخص النتائج', type:'textarea'},
  ],
  render(emp,m){
    return `
      ${docHeader(emp,'نموذج الانتداب')}
      <div class="row">${kv('تاريخ اليوم', m.date?fmtDate(m.date):todayStr())}</div>
      <div class="row">${kv('الاسم', emp.nameAr)}${kv('الرقم الوظيفي', emp.jobNo)}</div>
      <div class="row">${kv('الوظيفة', emp.jobTitleAr)}${kv('الجنسية', emp.nationalityAr)}</div>
      <div class="row">${kv('القسم', emp.deptAr)}${kv('الجهة المنتدب إليها', m.entity)}</div>
      <div class="row">${kv('من تاريخ', m.fromDate?fmtDate(m.fromDate):'—')}${kv('إلى تاريخ', m.toDate?fmtDate(m.toDate):'—')}</div>
      <div class="section-title">ملخص المهمة</div><p class="para">${esc(m.taskSummary)||'<span class="tag-empty">—</span>'}</p>
      <div class="section-title">التقرير التفصيلي</div><p class="para">${esc(m.detailedReport)||'<span class="tag-empty">—</span>'}</p>
      <div class="section-title">ملخص النتائج</div><p class="para">${esc(m.resultsSummary)||'<span class="tag-empty">—</span>'}</p>
      <div class="sign-grid two" style="margin-top:50px">${signBox('توقيع الموظف')}${signBox('اعتماد المدير المباشر')}</div>
      ${docFooter(emp)}`;
  }
};

const FORM_INVESTIGATION_RECORD = {
  id:'investigation-record', cat:'operations', titleAr:'محضر تحقيق',
  manualFields:[
    {key:'date', label:'التاريخ', type:'date', default:()=>new Date().toISOString().slice(0,10)},
    {key:'incident', label:'وصف الواقعة', type:'textarea'},
    {key:'q1', label:'ما هو قولك فيما هو منسوب إليك؟', type:'textarea'},
    {key:'q2', label:'هل هذا التصرف يُعتبر صحيحاً؟', type:'textarea'},
    {key:'q3', label:'هل هنالك أقوال أخرى؟', type:'textarea'},
  ],
  render(emp,m){
    return `
      ${docHeader(emp,'محضر تحقيق')}
      <div class="row">${kv('الاسم', emp.nameAr)}${kv('الرقم الوظيفي', emp.jobNo)}</div>
      <div class="row">${kv('الوظيفة', emp.jobTitleAr)}${kv('الجنسية', emp.nationalityAr)}</div>
      <div class="row">${kv('القسم', emp.deptAr)}${kv('التاريخ', m.date?fmtDate(m.date):todayStr())}</div>
      <div class="section-title">وصف الواقعة</div><p class="para">${esc(m.incident)||'<span class="tag-empty">—</span>'}</p>
      <div class="section-title">ما هو قولك فيما هو منسوب إليك؟</div><p class="para">${esc(m.q1)||'<span class="tag-empty">—</span>'}</p>
      <div class="section-title">هل هذا التصرف يُعتبر صحيحاً؟</div><p class="para">${esc(m.q2)||'<span class="tag-empty">—</span>'}</p>
      <div class="section-title">هل هنالك أقوال أخرى؟</div><p class="para">${esc(m.q3)||'<span class="tag-empty">—</span>'}</p>
      <div class="sign-grid two" style="margin-top:60px">${signBox('توقيع الموظف على أقواله')}${signBox('توقيع لجنة التحقيق')}</div>
      ${docFooter(emp)}`;
  }
};

/* ============================================================
   تسجيل جميع النماذج
   ============================================================ */
const FORMS = [
  // الشهادات والتعريفات
  FORM_TAAREEF_AR, FORM_TAAREEF_EN, FORM_SHAHADAT_KHIBRA, FORM_MAALOOMAT_MUWAZAF, FORM_MALAF_MUWAZAF,
  // عقود العمل
  FORM_AQD_MAWAD, FORM_AQD_NAQLIYAT, FORM_AQD_SIYANA, FORM_AQD_MAWAD_AMOLA, FORM_AQD_NAQLIYAT_AMOLA, FORM_AQD_TASHEERA,
  // إنهاء الخدمة وإخلاء الطرف
  FORM_IKHLA_TARAF, FORM_IKHLA_TARAF_CHECKLIST, FORM_NON_RENEWAL_GENERAL, FORM_NON_RENEWAL_COMPANY, FORM_NON_RENEWAL_EMPLOYEE,
  FORM_TERM_PROBATION, FORM_TERM_MUTUAL, FORM_TERM_RELATIONSHIP, FORM_RESIGN, FORM_RESIGN_PROBATION,
  FORM_EXTEND_PROBATION, FORM_SETTLEMENT_DATA, FORM_MUKHALASA_MALIYA,
  // المالية والمستحقات
  FORM_KAFALA_MALIYA, FORM_ISTILAM_MUSTAHAQAT, FORM_VACATION_DUES, FORM_ADVANCE_REQUEST,
  FORM_RECEIPT_ADVANCE, FORM_RECEIPT_SALARY_EXT, FORM_RECEIPT_SALARY, FORM_RECEIPT_BONUS,
  FORM_SALARY_ADJUST_1, FORM_SALARY_ADJUST_2,
  // العمليات اليومية
  FORM_HIRING_PROCEDURES, FORM_ABSENCE_WARNING, FORM_BUSINESS_TRIP, FORM_TRAVEL_DUES,
  FORM_ASSIGNMENT_REPORT, FORM_MUBASHARAT_AMAL, FORM_INVESTIGATION_RECORD,
];
