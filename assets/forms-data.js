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
  ],
  render(emp, m){
    return `
      ${docHeader(emp, 'شهادة خبرة', 'Certificate of Experience')}
      <div class="row">${kv('الرقم الوظيفي', emp.jobNo)}${kv('التاريخ', m.date?fmtDate(m.date):todayStr())}</div>
      <div class="bi-row">
        <div class="ar">تشهد ${companyOf(emp).nameAr} أن السيد: <b>${esc(emp.nameAr)}</b> كان يعمل لدينا خلال الفترة من ${fmtDate(emp.joinDate)} حتى ${m.toDate?fmtDate(m.toDate):'تاريخ كتابة هذا الخطاب'}، وكان يعمل لدينا بوظيفة: <b>${esc(emp.jobTitleAr)}</b> بقسم ${esc(emp.deptAr)}.</div>
        <div class="en">${companyOf(emp).nameEn} certifies that Mr. <b>${esc(emp.nameEn||emp.nameAr)}</b> worked for us during the period from ${fmtDate(emp.joinDate)} until ${m.toDate?fmtDate(m.toDate):'the date of writing this letter'} as <b>${esc(emp.jobTitleEn||emp.jobTitleAr)}</b>.</div>
      </div>
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

/* أدوات قالب شهادات الراتب المعتمد */
function sctHeader(co){
  return `<div class="sct-header"><img src="assets/logo.png" alt=""><div class="name">${co.nameAr}</div></div>`;
}
function sctTitle(ar, en){
  return `<div class="sct-title-band"><div class="ar">${ar}</div><div class="en">${en}</div></div>`;
}
function sctDateRow(dateStr){
  return `<div class="sct-date-row"><span>date: ${dateStr}</span><span>التاريخ : ${dateStr}</span></div>`;
}
function sctRow2(enHtml, arHtml, shaded){
  return `<tr class="${shaded?'shaded':''}"><td class="ltr b" colspan="2" style="width:50%">${enHtml}</td><td class="rtl b" colspan="2" style="width:50%">${arHtml}</td></tr>`;
}
function sctRow4(enLabel, enVal, arVal, arLabel, shaded){
  return `<tr class="${shaded?'shaded':''}">
    <td class="ltr b" style="width:18%">${enLabel}</td>
    <td class="ltr ctr" style="width:32%">${enVal}</td>
    <td class="rtl ctr" style="width:32%">${arVal}</td>
    <td class="rtl b" style="width:18%">${arLabel}</td>
  </tr>`;
}
function sctTable(rowsHtml){
  return `<div class="avoid-break"><table class="sct-table" dir="ltr"><tbody>${rowsHtml}</tbody></table></div>`;
}
function sctFooterName(html){
  return `<div class="sct-footer-name">${html}</div>`;
}

const FORM_TAAREEF_SAFARA = {
  id:'taareef-safara', cat:'certificates', titleAr:'وثيقة تعريف بموظف (لسفارة)',
  manualFields:[
    {key:'date', label:'التاريخ', type:'date', default:()=>new Date().toISOString().slice(0,10)},
    {key:'destinationAr', label:'اسم السفارة (عربي)', type:'text', default:'السفارة'},
    {key:'destinationEn', label:'Embassy Name (EN)', type:'text', default:'the Embassy'},
    {key:'salaryText', label:'نص الراتب الشهري (مثال: 25,000 ريال)', type:'text', default: e=> e ? (money(e.total)+' ريال') : ''},
  ],
  render(emp, m){
    const co = companyOf(emp);
    const dateStr = m.date?fmtDate(m.date):todayStr();
    return `
      ${sctHeader(co)}
      ${sctTitle('وثيقة تعريف بموظف','Staff Identification Document')}
      ${sctDateRow(dateStr)}
      ${sctTable(
        sctRow2(`${co.nameEn} certifies<br>Commercial Registration No.: ${co.cr}`, `تشهد ${co.nameAr}<br>سجل تجاري رقم: ${co.cr}`) +
        sctRow2(`That Mr: ${esc(emp.nameEn||emp.nameAr)}`, `بأن السيد: ${esc(emp.nameAr)}`, true) +
        sctRow4('Nationality:', esc(emp.nationalityEn), esc(emp.nationalityAr), 'الجنسية') +
        sctRow4('passport number:', esc(emp.passportNumber), esc(emp.passportNumber), 'رقم الجواز') +
        sctRow4('Identification Number:', esc(emp.idNumber), esc(emp.idNumber), 'رقم الهوية:') +
        sctRow4('Job title:', esc(emp.jobTitleEn||emp.jobTitleAr), esc(emp.jobTitleAr), 'المسمى الوظيفي:') +
        sctRow4('Joining Date:', fmtDate(emp.joinDate), fmtDate(emp.joinDate), 'تاريخ الالتحاق:') +
        sctRow2('He works for us under a renewable contract and receives a monthly salary: <b>' + esc(m.salaryText) + '</b>', 'يعمل لدينا بموجب عقد قابل للتجديد ويتقاضى راتباً شهرياً: <b>' + esc(m.salaryText) + '</b>', true) +
        sctRow2(
          `This certificate was issued at the employee's request to be submitted to <b>${esc(m.destinationEn)}</b>, without the company being under any responsibility whatsoever.`,
          `حُررت هذه الشهادة بناءً على طلب الموظف لتقديمها إلى <b>${esc(m.destinationAr)}</b>، وذلك دون أن تكون على الشركة أدنى مسؤولية.`
        )
      )}
      ${sctFooterName(co.nameAr)}
      ${docFooter(emp)}`;
  }
};

const FORM_TAAREEF_RATIB_SAFARAT = {
  id:'taareef-ratib-safarat', cat:'certificates', titleAr:'تعريف بالراتب (للسفارات)',
  manualFields:[
    {key:'date', label:'التاريخ', type:'date', default:()=>new Date().toISOString().slice(0,10)},
    {key:'destinationAr', label:'اسم السفارة (عربي)', type:'text', default:'السفارة'},
    {key:'destinationEn', label:'Embassy Name (EN)', type:'text', default:'the Embassy'},
  ],
  render(emp, m){
    const co = companyOf(emp);
    const dateStr = m.date?fmtDate(m.date):todayStr();
    return `
      ${sctHeader(co)}
      ${sctTitle('تعريف بالراتب','Definition of salary')}
      ${sctDateRow(dateStr)}
      ${sctTable(
        sctRow2(`${co.nameEn} certifies<br>Commercial Registration No.: ${co.cr}`, `تشهد ${co.nameAr}<br>سجل تجاري رقم: ${co.cr}`) +
        sctRow2(`That Mr: ${esc(emp.nameEn||emp.nameAr)}`, `بأن السيد: ${esc(emp.nameAr)}`, true) +
        sctRow4('Nationality:', esc(emp.nationalityEn), esc(emp.nationalityAr), 'الجنسية') +
        sctRow4('passport number:', esc(emp.passportNumber), esc(emp.passportNumber), 'رقم الجواز') +
        sctRow4('Identification Number:', esc(emp.idNumber), esc(emp.idNumber), 'رقم الهوية:') +
        sctRow4('Job title:', esc(emp.jobTitleEn||emp.jobTitleAr), esc(emp.jobTitleAr), 'المسمى الوظيفي:') +
        sctRow4('Joining Date:', fmtDate(emp.joinDate), fmtDate(emp.joinDate), 'تاريخ الالتحاق:') +
        sctRow2('He works for us and receives a monthly salary', 'يعمل لدينا و يتقاضى راتب شهري', true) +
        sctRow2(`${money(emp.total)} Riyals`, `${money(emp.total)} ريال`) +
        sctRow2(
          `This certificate has been issued to the employee at his request for submission to the <b>${esc(m.destinationEn)}</b>.`,
          `حُررت هذه الشهادة للموظف بناءً على طلبه لتقديمها إلى <b>${esc(m.destinationAr)}</b>.`,
          true
        )
      )}
      ${sctFooterName(co.nameAr)}
      ${docFooter(emp)}`;
  }
};

const FORM_ADAM_MUMANAA = {
  id:'adam-mumanaa', cat:'certificates', titleAr:'عدم ممانعة من السفر',
  manualFields:[
    {key:'date', label:'التاريخ', type:'date', default:()=>new Date().toISOString().slice(0,10)},
    {key:'destinationCountryAr', label:'الدولة المقصودة (عربي)', type:'text'},
    {key:'destinationCountryEn', label:'Destination Country (EN)', type:'text'},
  ],
  render(emp, m){
    const co = companyOf(emp);
    const dateStr = m.date?fmtDate(m.date):todayStr();
    return `
      ${sctHeader(co)}
      ${sctTitle('تعريف بالراتب وتعهد','Definition of salary and pledge')}
      ${sctDateRow(dateStr)}
      ${sctTable(
        sctRow2(`${co.nameEn} certifies<br>Commercial Registration No.: ${co.cr}`, `نحن ${co.nameAr}<br>سجل تجاري رقم: ${co.cr}`) +
        sctRow2('We have no objection to the travel of Mr:', 'لا مانع لدينا من سفر السيد:', true) +
        sctRow2(`<b>${esc(emp.nameEn||emp.nameAr)}</b>`, `<b>${esc(emp.nameAr)}</b>`) +
        sctRow4('Nationality:', esc(emp.nationalityEn), esc(emp.nationalityAr), 'الجنسية') +
        sctRow4('passport number:', esc(emp.passportNumber), esc(emp.passportNumber), 'رقم الجواز') +
        sctRow4('Identification Number:', esc(emp.idNumber), esc(emp.idNumber), 'رقم الهوية:') +
        sctRow4('Job title:', esc(emp.jobTitleEn||emp.jobTitleAr), esc(emp.jobTitleAr), 'المسمى الوظيفي:') +
        sctRow4('Joining Date:', fmtDate(emp.joinDate), fmtDate(emp.joinDate), 'تاريخ الالتحاق:') +
        sctRow4('Monthly salary:', money(emp.total)+' SAR', money(emp.total)+' ر.س.', 'الراتب الشهري:') +
        sctRow2(
          `To ${esc(m.destinationCountryEn)}.<br>The company assumes responsibility for his return to the Kingdom of Saudi Arabia.`,
          `إلى ${esc(m.destinationCountryAr)}<br>وتتحمل الشركة مسؤولية عودته للمملكة العربية السعودية`,
          true
        )
      )}
      ${sctFooterName(`${co.nameAr}<br>${co.nameEn}`)}
      ${docFooter(emp)}`;
  }
};

const FORM_TAAREEF_RATIB = {
  id:'taareef-ratib', cat:'certificates', titleAr:'تعريف بالراتب',
  manualFields:[
    {key:'date', label:'التاريخ', type:'date', default:()=>new Date().toISOString().slice(0,10)},
    {key:'destinationAr', label:'الجهة المقدَّم إليها (عربي)', type:'text', default:'من يهمه الأمر'},
    {key:'destinationEn', label:'Recipient (EN)', type:'text', default:'whomever it may concern'},
  ],
  render(emp, m){
    const co = companyOf(emp);
    const dateStr = m.date?fmtDate(m.date):todayStr();
    return `
      ${sctHeader(co)}
      ${sctTitle('تعريف بالراتب','Definition of salary')}
      ${sctDateRow(dateStr)}
      ${sctTable(
        sctRow2(`${co.nameEn} certifies<br>Commercial Registration No.: ${co.cr}`, `تشهد ${co.nameAr}<br>سجل تجاري رقم: ${co.cr}`) +
        sctRow2(`That Mr: ${esc(emp.nameEn||emp.nameAr)}`, `بأن السيد: ${esc(emp.nameAr)}`, true) +
        sctRow4('Nationality:', esc(emp.nationalityEn), esc(emp.nationalityAr), 'الجنسية') +
        sctRow4('Identification Number:', esc(emp.idNumber), esc(emp.idNumber), 'رقم الهوية:') +
        sctRow4('Job title:', esc(emp.jobTitleEn||emp.jobTitleAr), esc(emp.jobTitleAr), 'المسمى الوظيفي:') +
        sctRow4('Joining Date:', fmtDate(emp.joinDate), fmtDate(emp.joinDate), 'تاريخ الالتحاق:') +
        sctRow2('He works for us and receives a monthly salary', 'يعمل لدينا و يتقاضى راتب شهري', true) +
        sctRow4('basic salary', money(emp.basic), money(emp.basic), 'الراتب الأساسي') +
        sctRow4('Housing allowance', money(emp.housing), money(emp.housing), 'بدل السكن') +
        sctRow4('Transportation allowance', money(emp.transport), money(emp.transport), 'بدل النقل') +
        sctRow4('Other allowances', money(emp.living), money(emp.living), 'بدلات أخرى') +
        sctRow4('total salary', `<b>${money(emp.total)}</b>`, `<b>${money(emp.total)}</b>`, 'الراتب الإجمالي', true) +
        sctRow2(
          `This certificate was issued to the employee at his request to present it to <b>${esc(m.destinationEn)}</b>, without the company bearing any responsibility whatsoever.`,
          `حُررت هذه الشهادة للموظف بناءً على طلبه لتقديمها إلى <b>${esc(m.destinationAr)}</b>، وذلك دون أن تكون على الشركة أدنى مسؤولية.`,
          true
        )
      )}
      ${sctFooterName(`${co.nameAr}<br>إدارة الموارد البشرية`)}
      ${docFooter(emp)}`;
  }
};

function makeTathbeetRatibForm(id, titleAr, presetBankAr, presetBankEn){
  return {
    id, cat:'certificates', titleAr,
    manualFields:[
      {key:'date', label:'التاريخ', type:'date', default:()=>new Date().toISOString().slice(0,10)},
      {key:'destinationBankAr', label:'اسم البنك/الجهة (عربي)', type:'text', default: e=> presetBankAr || e?.bankAr},
      {key:'destinationBankEn', label:'Bank/Recipient Name (EN)', type:'text', default: e=> presetBankEn || e?.bankEn},
    ],
    render(emp, m){
      const co = companyOf(emp);
      const dateStr = m.date?fmtDate(m.date):todayStr();
      return `
        ${sctHeader(co)}
        ${sctTitle('تعريف وتثبيت الراتب','Definition and fixation of salary')}
        ${sctDateRow(dateStr)}
        ${sctTable(
          sctRow2(`${co.nameEn} certifies<br>Commercial Registration No.: ${co.cr}`, `تشهد ${co.nameAr}<br>سجل تجاري رقم: ${co.cr}`) +
          sctRow2(`That Mr: ${esc(emp.nameEn||emp.nameAr)}`, `بأن السيد: ${esc(emp.nameAr)}`, true) +
          sctRow4('Nationality:', esc(emp.nationalityEn), esc(emp.nationalityAr), 'الجنسية:') +
          sctRow4('Identification Number:', esc(emp.idNumber), esc(emp.idNumber), 'رقم الهوية:') +
          sctRow4('Job title:', esc(emp.jobTitleEn||emp.jobTitleAr), esc(emp.jobTitleAr), 'المسمى الوظيفي:') +
          sctRow4('Joining Date:', fmtDate(emp.joinDate), fmtDate(emp.joinDate), 'تاريخ الالتحاق:') +
          sctRow4('Bank Name:', esc(emp.bankEn||emp.bankAr), esc(emp.bankAr), 'اسم البنك:') +
          sctRow4('IBAN Number:', esc(emp.iban), esc(emp.iban), 'رقم الايبان:') +
          sctRow2('He works for us and receives a monthly salary', 'يعمل لدينا و يتقاضى راتب شهري', true) +
          sctRow4('basic salary', money(emp.basic), money(emp.basic), 'الراتب الأساسي') +
          sctRow4('Housing allowance', money(emp.housing), money(emp.housing), 'بدل السكن') +
          sctRow4('Transportation allowance', money(emp.transport), money(emp.transport), 'بدل النقل') +
          sctRow4('Other allowances', money(emp.living), money(emp.living), 'بدلات أخرى') +
          sctRow4('total salary', `<b>${money(emp.total)}</b>`, `<b>${money(emp.total)}</b>`, 'الراتب الإجمالي', true) +
          sctRow2(
            `The Company undertakes to transfer the employee's salary and entitlements on their scheduled monthly dates until the termination of their employment relationship with us or until receipt of written notification from you regarding the settlement of their obligations. This certificate has been issued at the employee's request for submission to <u>${esc(m.destinationBankEn)}</u>.`,
            `وتلتزم الشركة بتحويل رواتب ومستحقات الموظف في مواعيدها الشهرية وحتى نهاية علاقته الوظيفية معنا أو استلام إشعار خطي بانتهاء الالتزامات عليه من قبلكم، وحُررت هذه الشهادة بناءً على طلب الموظف لتقديمها إلى <u>${esc(m.destinationBankAr)}</u>.`,
            true
          )
        )}
        ${sctFooterName(co.nameAr)}
        ${docFooter(emp)}`;
    }
  };
}
const FORM_TAAREEF_TATHBEET_RATIB = makeTathbeetRatibForm('taareef-tathbeet-ratib', 'تعريف وتثبيت الراتب (بنك آخر)', null, null);
const FORM_TAAREEF_TATHBEET_RIYAD = makeTathbeetRatibForm('taareef-tathbeet-riyad', 'تعريف وتثبيت الراتب - بنك الرياض', 'بنك الرياض', 'Riyad Bank');
const FORM_TAAREEF_TATHBEET_ALINMA = makeTathbeetRatibForm('taareef-tathbeet-alinma', 'تعريف وتثبيت الراتب - مصرف الإنماء', 'مصرف الإنماء', 'Alinma Bank');

const FORM_TAAREEF_MUWAZAF_EOS = {
  id:'taareef-muwazaf-eos', cat:'certificates', titleAr:'خطاب تعريف بموظف (مع مكافأة نهاية الخدمة)',
  manualFields:[
    {key:'date', label:'التاريخ', type:'date', default:()=>new Date().toISOString().slice(0,10)},
    {key:'to', label:'الجهة الموجَّه إليها الخطاب', type:'text', default:'من يهمه الأمر'},
    {key:'eosAmount', label:'مكافأة نهاية الخدمة (ر.س)', type:'number'},
  ],
  render(emp, m){
    const co = companyOf(emp);
    return `
      ${docHeader(emp, 'خطاب تعريف بموظف', 'Definition of an Employee')}
      <div class="row">${kv('الرقم الوظيفي', emp.jobNo)}${kv('التاريخ', m.date?fmtDate(m.date):todayStr())}</div>
      <div class="row">${kv('إلى', m.to)}</div>
      <div class="bi-row">
        <div class="ar">تشهد ${co.nameAr} بأن السيد: <b>${esc(emp.nameAr)}</b> (${esc(emp.nameEn||'')}) — إقامة رقم: ${esc(emp.idNumber)} — تاريخ التعيين: ${fmtDate(emp.joinDate)} — الوظيفة: ${esc(emp.jobTitleAr)}.</div>
        <div class="en">${co.nameEn} certifies that Mr. <b>${esc(emp.nameEn||emp.nameAr)}</b> — ID No.: ${esc(emp.idNumber)} — Date of Hiring: ${fmtDate(emp.joinDate)} — Job: ${esc(emp.jobTitleEn||emp.jobTitleAr)}.</div>
      </div>
      <div class="row">${kv('مكافأة نهاية الخدمة المستحقة', money(m.eosAmount))}</div>
      <div class="bi-row">
        <div class="ar">ولا يزال يعمل لدينا حتى تاريخ كتابة هذا الخطاب، ويُجدَّد عقده تلقائياً. وقد تم منحه هذه الشهادة بناءً على طلبه، دون أن تتحمل ${co.nameAr} أدنى مسؤولية تجاه حقوق الغير.</div>
        <div class="en">He remains employed by us as of the date of this letter, and his contract is renewed automatically. This certificate was granted to him at his request; ${co.nameEn} assumes no liability whatsoever towards the rights of third parties.</div>
      </div>
      <div class="sign-grid two" style="margin-top:60px">${signBox('إدارة الموارد البشرية')}${signBox('ختم الشركة')}</div>
      ${docFooter(emp)}`;
  }
};

/* ============================================================
   2) عقود العمل
   ============================================================ */
const CONTRACT_OBLIGATIONS = [
  ["8.1","Providing the second party with health care in accordance with the rules and regulations of Cooperative Health Insurance Law","تقديم الرعاية الطبية للطرف الثاني بالتأمين الصحي وفقا لأحكام نظام الضمان الصحي التعاوني"],
  ["8.2","Registering the second party in General Organization for Social Insurance (GOSI) and fulfill the payments of contributions according to their systems","تسجيل الطرف الثاني لدى المؤسسة العامة للتأمينات الاجتماعية، وسداد الاشتراكات حسب أنظمتها"],
  ["8.3","Granting the second party annual leave, official holidays and sick leave as required by the labor regulations approved by the Ministry of Human Resources and Social Development","منح الطرف الثاني الاجازات السنوية والعطل الرسمية والاجازات المرضية وفق ماتقتضية لائحة تنظيم العمل المعتمدة من وزارة الموارد البشرية والتنمية الاجتماعية، بما لايتعارض مع نظام العمل ولائحته التنفيذية"],
  ["8.4","Returning to the second party all certificates or documents that has been submitted","أن يعيد إلى الطرف الثاني جميع ما أودعه لديه من شهادات أو وثائق"],
  ["8.5","Paying the first party's wages and settle his entitlements within a maximum period of one week from the date of the end of the contractual relation. If the worker ends the contract, the employer shall settle all his entitlements within a period not exceeding two weeks","دفع أجر العامل وتصفية حقوقه خلال أسبوع -على الأكثر- من تاريخ انتهاء العلاقة العقدية. أما إذا كان العامل هو الذي أنهى العقد، وجب على صاحب العمل تصفية حقوقه كاملة خلال مدة لا تزيد على أسبوعين"],
];
const CONTRACT_DUTIES = [
  ["9.1","Finish assigned work in accordance with the principles of the profession and in accordance with the instructions of the employer, if these instructions do not violate the contract, order, public morals, or has a potential danger","إنجاز العمل الموكل إليه؛ وفقا لأصول المهنة، ووفق تعليمات الطرف الأول، إذا لم يكن في هذه التعليمات ما يخالف العقد، أو النظام، او الآداب العامة، ولم يكن في تنفيذها ما يعرضها للخطر"],
  ["9.2","To take adequate care of the tools and tasks assigned and the first party's materials at the second party's disposal or in his custody, and restore the first party's unconsumed materials","أن يعتني عناية كافية بالأدوات، والمهمات المسندة إليه والخامات المملوكة للطرف الأول؛ الموضوعة تحت تصرفه، أو التي تكون في عهدته، وأن يعيد الى الطرف الأول المواد غير المستهلكة"],
  ["9.3","Approval of the first party deducting the prescribed percentage from him/her from the monthly wage to participate in the General Organization for Social Insurance","الموافقة على استقطاع الطرف الأول للنسبة المقررة عليه من الأجر الشهري للاشتراك في المؤسسة العامة للتأمينات الاجتماعية"],
  ["9.4","Committing to good behavior at work and at all times committing to law, rules, and etiquette in the Kingdom of Saudi Arabia, as well as rules and regulations enforced by the first party, and bearing all fines resulting from breaching those regulations","أن يلتزم حسن السلوك والأخلاق أثناء العمل، وفي جميع الأوقات يلتزم بالأنظمة، والأعراف، والعادات، والآداب المرعية في المملكة العربية السعودية وكذلك بالقواعد واللوائح والتعليمات المعمول بها لدى الطرف الأول، ويتحمل الطرف الثاني كامل الغرامات المالية الناتجة عن مخالفته لتلك الانظمة"],
  ["9.5","To provide all assistance and support without requiring additional wages in the event of disasters and threats to the safety of the place of work or the people working in it","أن يقدم كل عون ومساعدة دون أن يشترط لذلك أجرا إضافيا في حالات الكوارث والأخطار التي تهدد سلامة مكان العمل أو الأشخاص العاملين فيه"],
  ["9.6","To undergo medical examination according to the first party's request prior to or during the course of work in order to ascertain whether he or she is free of chronic or occupational diseases","أن يخضع -وفق لطلب صاحب العمل- للفحوص الطبية التي يرغب في إجرائها عليه قبل الإلحاق بالعمل او أثناءه للتحقق من خلوه من الأمراض المهنية أو السارية"],
];
const CONTRACT_GENERAL = [
  ["10.1","The Labor Law and its executive regulations and the ministerial regulations and resolutions and the organization's work regulation approved by the Ministry of Human Resources and Social Development, shall be the reference in all matters not explicitly stated herein, and it shall be deemed as an integral part of this Contract. In addition, this Contract replaces all previous agreements and contracts including oral or written if any","كون نظام العمل ولائحته التنفيذية واللوائح والقرارات الوزارية ولائحة تنظيم العمل بالمنشأة المعتمدة من قبل وزارة الموارد البشرية والتنمية الاجتماعية، المرجع في أي بند أو أمر لم يرد به نص بهذا العقد وتعد جزءا لا يتجزأ من العقد، ويحل هذا العقد محل كافة الاتفاقيات والعقود السابقة الشفهية منها أو الكتابية إن وجدت"],
  ["10.2","Both parties agreed that the addresses stated at the head of this Contract are the official addresses for exchanging notifications, announcements and warnings and the correspondence is considered a legal argument","اتفق الطرفان على أن العناوين الموضحة في صدر العقد هي العناوين النظامية لتبادل الإشعارات والإخطارات والإنذارات وتعتبر المخاطبات ذات حجة نظامية"],
  ["10.3","Both parties acknowledge that they have known and understood all the provisions and contents of this contract","يقر الطرفان بانهما قد علما وفهما كل أحكام هذا العقد ومضمونه"],
  ["10.4","The singular form includes the plural and the plural form includes the singular, and the reference to one gender means both genders, and the reference to persons includes natural and legal persons unless the context of the text requires otherwise","صيغة المفرد تشمل الجمع وصيغة الجمع تشمل المفرد، والإشارة إلى جنس واحد تعني الجنسين والإشارة إلى الأشخاص تشمل الأشخاص الطبيعيين والاعتباريين ما لم يقتض سياق النص غير ذلك"],
  ["10.5","References to any law, regulation, decision, or instructions shall be interpreted as including amendments that may occur to them from time to time","تفسر الإشارة إلى أي نظام أو لائحة أو قرار أو تعليمات على أنها تشمل التعديلات التي تطرأ عليها من حين لآخر"],
];
const CONTRACT_ADDITIONAL = [
  ["11.1","The contract shall be automatically renewed for an equivalent period, unless at least 60 days prior to the contract end date a notice is given by either party of its intent not to renew the contract","يتجدد هذا العقد تلقائيا لمدة مماثلة، مالم يشعر أحد الأطراف بعدم رغبته بالتجديد بمدة لا تقل عن 60 يوم من نهاية العقد"],
  ["11.2","Either party to the contract may terminate it based on a reason that must be indicated by a written notice to the other party 60 days before the termination, or payment of two months' salary","يجوز لأي من طرفي العقد إنهاء العقد بناء على سبب يجب بيانه بموجب إشعار يوجه إلى الطرف الآخر كتابة قبل 60 يوماً من الإنهاء، أو دفع راتب شهرين"],
];

/* أدوات بناء جدول العقد المرآتي (إنجليزي/عربي) بنفس شكل قالب الشركة الأصلي */
function ctLogo(){
  return `<div style="margin-bottom:10px"><img src="assets/logo.png" style="height:44px"></div>`;
}
function ctHeadRow(en, ar){
  return `<tr class="ct-head"><th colspan="2" style="width:50%">${en}</th><th colspan="2" style="width:50%">${ar}</th></tr>`;
}
function ctRow2(enHtml, arHtml){
  return `<tr><td class="ltr" colspan="2">${enHtml}</td><td class="rtl" colspan="2">${arHtml}</td></tr>`;
}
function ctRow4(enLabel, enVal, arVal, arLabel){
  return `<tr>
    <td class="ct-label ltr" style="width:16%">${enLabel}</td>
    <td class="ltr ctr" style="width:34%">${enVal}</td>
    <td class="rtl ctr" style="width:34%">${arVal}</td>
    <td class="ct-label rtl" style="width:16%">${arLabel}</td>
  </tr>`;
}
function ctClause(num, enText, arText){
  return `<tr>
    <td class="ct-num">${num}</td>
    <td class="ltr" style="width:41%">${enText}</td>
    <td class="rtl" style="width:41%">${arText}</td>
    <td class="ct-num">${num}</td>
  </tr>`;
}
function ctTable(rowsHtml){
  return `<div class="avoid-break"><table class="ct-table" dir="ltr"><tbody>${rowsHtml}</tbody></table></div>`;
}
function ctPageBreakTable(rowsHtml){
  return `<div class="avoid-break" style="page-break-before:always">${ctLogo()}<table class="ct-table" dir="ltr"><tbody>${rowsHtml}</tbody></table></div>`;
}
function ctTableLoose(rowsHtml){
  return `<div class="avoid-break"><table class="ct-table" dir="ltr"><tbody>${rowsHtml}</tbody></table></div>`;
}
function ctPlainTitle(en, ar){
  return `<div class="ct-plain-title"><span>${en}</span><span>${ar}</span></div>`;
}

function ctPageWrap(innerHtml, isLast){
  const breakStyle = isLast ? '' : 'page-break-after:always;break-after:page;';
  return `<div class="ct-page" style="${breakStyle}overflow:hidden;">${innerHtml}</div>`;
}

function renderEmploymentContract(emp, m, opts){
  opts = opts || {};
  const co = companyOf(emp);
  const start = m.startDate || emp.contractStart;
  const end = m.endDate || emp.contractEnd;
  const signatory = esc(m.signatory || 'سليمان ناصر الحمد');
  const signatoryEn = esc(m.signatory || 'SLYMAN NASSER ALHAMAD');
  const signatoryTitle = esc(m.signatoryTitle || 'وكيل');
  const signatoryTitleEn = esc(m.signatoryTitle || 'Representative');
  const dateStr = m.contractDate ? fmtDate(m.contractDate) : todayStr();

  let page1 = ctLogo();
  page1 += ctTable(
    ctRow2(
      `This Agreement was made in <b>${dateStr}</b> between:`,
      `أبرم هذا العقد في: <b>${dateStr}</b> بين:`
    ) +
    ctRow2(
      `<b>${co.nameEn}</b><br>Establishment Number in General Organization for Social Insurance: ${co.gosi}<br>Establishment Number in Ministry of Labor: ${co.cr}<br>Authorized Signatory: ${signatoryEn}<br>Capacity of: ${signatoryTitleEn}<br>Referred to hereinafter as (First Party).`,
      `<b>${co.nameAr}</b><br>رقم المنشأة في المؤسسة العامة للتأمينات الاجتماعية: ${co.gosi}<br>سجل تجاري رقم: ${co.cr}<br>يمثلها في توقيع هذا العقد: ${signatory}<br>بصفته: ${signatoryTitle}<br>يشار إليه فيما بعد (بالطرف الأول).`
    ) +
    ctRow4('And:', esc(emp.nameEn||emp.nameAr), esc(emp.nameAr), 'وبين :') +
    ctRow4('Nationality', esc(emp.nationalityEn), esc(emp.nationalityAr), 'الجنسية:') +
    ctRow4('National ID', esc(emp.idNumber), esc(emp.idNumber), 'رقم الهوية') +
    ctRow4('Job Number', esc(emp.jobNo), esc(emp.jobNo), 'الرقم الوظيفي') +
    ctRow2('Referred to hereinafter as (Second Party).', 'ويشار إليه فيما بعد (بالطرف الثاني).') +
    ctRow2('And together they are referred to as (the two parties or both parties).', 'ويشار لهما معاً بـ (الطرفين أو الطرفان).') +
    ctRow2(
      'The above Parties details shall be deemed as an integral part of this Contract, and together with its Annexes, they form an integrated unit and are considered part of the contract to be interpreted and complemented by each other.',
      'تعتبر بيانات الطرفين أعلاه جزءاً لا يتجزأ من هذا العقد، وتشكل مع ملاحقه وحدة متكاملة وتعتبر جزءاً من العقد بحيث تفسر ويتمم بعضها بعضاً.'
    )
  );
  page1 += ctTable(
    ctHeadRow("First Party's Information", 'بيانات الطرف الأول') +
    ctRow4('National Address:', co.addressEn.replace(/\n/g,'<br>'), co.addressAr.replace(/\n/g,'<br>'), ':العنوان الوطني') +
    ctRow4('Email:', 'info2@hail-house.sa', 'info2@hail-house.sa', ':البريد الالكتروني')
  );
  page1 += ctTable(
    ctHeadRow("Second Party's Information", 'بيانات الطرف الثاني') +
    ctRow4('Gender:', esc(emp.genderEn), esc(emp.genderAr), ':الجنس') +
    ctRow4('Birth Date:', fmtDate(emp.birthDate), fmtDate(emp.birthDate), ':تاريخ الميلاد') +
    ctRow4('Religion:', esc(emp.religionEn), esc(emp.religionAr), ':الديانة') +
    ctRow4('Contact Number:', esc(emp.phone), esc(emp.phone), ':رقم التواصل') +
    ctRow4('E-mail:', esc(emp.email), esc(emp.email), ':البريد الالكتروني')
  );

  let page2 = ctLogo();
  page2 += ctPlainTitle('Contract Terms', 'بنود العقد');
  page2 += ctTable(
    ctHeadRow("1. Job's Title & Work's Location", 'المهنة ومكان العمل .1') +
    ctRow4('Job Title:', esc(emp.jobTitleEn||emp.jobTitleAr), esc(emp.jobTitleAr), ':المسمى الوظيفي') +
    ctRow4('Work Location:', esc(emp.workLocationEn||emp.workLocationAr), esc(emp.workLocationAr), ': مقر العمل') +
    ctRow4('Work Domain:', 'Inside Saudi Arabia', 'داخل المملكة', ':نطاق العمل') +
    ctRow4('Work Type:', 'Full Time', 'دوام كامل', ':نوع العمل')
  );
  page2 += ctTable(
    ctHeadRow("2. Contract's Period", 'مدة العقد .2') +
    ctRow2(
      `The contract shall be effective for a period of <b>${esc(m.durationEn||'One year')}</b> which starts from the joining date on`,
      `يسري نفاذ هذا العقد لمدة <b>${esc(m.durationAr||'سنة')}</b> تبدأ من تاريخ مباشرة الطرف الثاني للعمل`
    ) +
    ctRow2(`FROM <b>${fmtDate(start)}</b> TO <b>${fmtDate(end)}</b>`, `من تاريخ <b>${fmtDate(start)}</b> الى تاريخ <b>${fmtDate(end)}</b>`)
  );
  page2 += ctTable(
    ctHeadRow('3. Probationary Period', 'فترة التجربة .3') +
    ctRow2(
      `The second party shall be under probationary period of <b>${esc(m.probationDays||90)} days</b> beginning from the official date of reporting to work and it does not include Eid AL-FITR holiday nor Eid AL-ADHA holiday nor sick leaves.`,
      `يخضع الطرف الثاني لفترة تجربة مدتها <b>${esc(m.probationDays||90)} يوم</b> تبدأ من تاريخ مباشرته للعمل ولا يدخل في حسابها إجازة عيدي الفطر والأضحى والإجازة المرضية.`
    )
  );
  page2 += ctTable(
    ctHeadRow('4. Work Hours & Weekly Rest', 'ساعات العمل والراحة الأسبوعية .4') +
    ctRow2(
      'Normal working days shall be 6 days per week and working hours shall be 8 hours (DAILY). In addition, the second party shall be entitled to 1 day rest per week. Working days and working times are determined by the employer.',
      'تحدد أيام العمل العادية بـ 6 أيام في الأسبوع وتحدد ساعات العمل اليومية بـ 8 ساعات في اليوم. ويحق للطرف الثاني يوم راحة واحد في الأسبوع، وتحدد أيام العمل وأوقات العمل من قبل صاحب العمل.'
    )
  );

  let page2b = ctLogo();
  page2b += ctTable(
    ctHeadRow('5. Annual Leave', 'الاجازات السنوية .5') +
    ctRow2(
      `The second party shall be entitled to a paid vacation of <b>${esc(emp.annualLeave||21)}</b> calendar days, each year.`,
      `يحق للطرف الثاني عن كل عام إجازة سنوية مدفوعة الاجر مدتها <b>${esc(emp.annualLeave||21)}</b> يوم تقويمي.`
    )
  );
  page2b += ctTable(
    ctHeadRow('6. Wages & Financial Benefits', 'الاجر والمزايا المالية .6') +
    ctRow2('The second party shall be given the following wage and benefits:', 'يستحق الطرف الثاني الأجر والبدلات والمزايا التالية:') +
    ctRow4('Basic Wage:', money(emp.basic), money(emp.basic), ':الاجر الأساسي') +
    ctRow4('Housing:', money(emp.housing), money(emp.housing), ':بدل السكن') +
    ctRow4('Transportation allowance:', money(emp.transport), money(emp.transport), ':بدل النقل') +
    ctRow4('Cost of living allowance:', money(emp.living), money(emp.living), ':بدل غلاء معيشة') +
    (opts.commission ? ctRow2(
      esc(m.commissionTextEn || "The second party is entitled to additional commission per the employer's approved commission scheme, calculated and paid monthly upon meeting the conditions."),
      esc(m.commissionText || 'يستحق الطرف الثاني عمولة إضافية وفق نظام العمولات المعتمد لدى الطرف الأول، وتحتسب وتصرف شهرياً حسب تحقق الشروط.')
    ) : '') +
    ctRow2(
      `The first party pays the second party each month a total amount of <b>${money(emp.total)}</b> Saudi riyals.`,
      `يدفع الطرف الأول للطرف الثاني اجراً قدره <b>${money(emp.total)}</b> ريال سعودي فقط نهاية كل شهر.`
    )
  );
  page2b += ctTable(
    ctHeadRow("7. Second Party's Bank Account Information", 'معلومات الحساب البنكي للطرف الثاني .7') +
    ctRow4('Bank Name:', esc(emp.bankEn||emp.bankAr), esc(emp.bankAr), ': اسم البنك') +
    ctRow4('IBAN:', esc(emp.iban), esc(emp.iban), ':رقم الايبان')
  );

  let page3 = ctLogo();
  page3 += ctTable(
    ctHeadRow("8. First Party's Obligations", 'التزامات الطرف الأول .8') +
    CONTRACT_OBLIGATIONS.map(([n,en,ar])=>ctClause(n,en,ar)).join('')
  );
  page3 += ctTable(
    ctHeadRow("9. Second Party's Obligations", 'التزامات الطرف الثاني .9') +
    CONTRACT_DUTIES.map(([n,en,ar])=>ctClause(n,en,ar)).join('')
  );

  let page4 = ctLogo();
  page4 += ctTable(
    ctHeadRow('10. General Provisions', 'أحكام عامة .10') +
    CONTRACT_GENERAL.map(([n,en,ar])=>ctClause(n,en,ar)).join('')
  );
  page4 += ctTable(
    ctHeadRow('11. Additional Terms', 'بنود إضافية .11') +
    CONTRACT_ADDITIONAL.map(([n,en,ar])=>ctClause(n,en,ar)).join('')
  );

  page4 += `<div style="height:24px"></div>`;
  page4 += ctTableLoose(
    `<tr class="ct-head"><th style="width:50%">${co.nameAr}</th><th style="width:50%">اسم الموظف</th></tr>` +
    `<tr><td class="rtl ctr">${signatory}</td><td class="rtl ctr">${esc(emp.nameAr)}</td></tr>` +
    `<tr><td class="ltr ctr">${signatoryEn}</td><td class="ltr ctr">${esc(emp.nameEn||'')}</td></tr>` +
    `<tr><td style="height:50px"></td><td></td></tr>`
  );
  page4 += docFooter(emp);

  return ctPageWrap(page1, false) + ctPageWrap(page2, false) + ctPageWrap(page2b, false) + ctPageWrap(page3, false) + ctPageWrap(page4, true);
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
  id:'aqd-tasheera', cat:'contracts', titleAr:'عقد عمل تأشيرة (يدوي)',
  standalone:true,
  manualFields:[
    {key:'company', label:'الشركة', type:'select', options:Object.keys(COMPANIES), default:'بيت هائل للنقليات'},
    {key:'date', label:'التاريخ', type:'date', default:()=>new Date().toISOString().slice(0,10)},
    {key:'visaNumber', label:'رقم التأشيرة', type:'text'},
    {key:'employeeName', label:'اسم الموظف (عربي)', type:'text'},
    {key:'employeeNameEn', label:'اسم الموظف (إنجليزي)', type:'text'},
    {key:'nationalityAr', label:'الجنسية (عربي)', type:'text'},
    {key:'nationalityEn', label:'Nationality (EN)', type:'text'},
    {key:'passportNumber', label:'رقم الجواز', type:'text'},
    {key:'jobTitleAr', label:'المهنة (عربي)', type:'text'},
    {key:'jobTitleEn', label:'Job Title (EN)', type:'text'},
    {key:'monthlySalary', label:'الراتب الشهري (ر.س)', type:'number'},
    {key:'contractYears', label:'مدة العقد (سنوات)', type:'number', default:'2'},
    {key:'probationMonths', label:'فترة التجربة (أشهر)', type:'number', default:'6'},
  ],
  render(emp,m){
    const co = COMPANIES[m.company] || DEFAULT_COMPANY;
    const dateStr = m.date ? fmtDate(m.date) : todayStr();
    let html = ctLogo();
    html += ctTable(
      ctRow2(
        `This Agreement was made in <b>${dateStr}</b> between:`,
        `أبرم هذا العقد في: <b>${dateStr}</b> بين:`
      ) +
      ctRow2(
        `<b>${co.nameEn}</b><br>CR No.: ${co.cr}<br>Referred to hereinafter as (First Party).`,
        `<b>${co.nameAr}</b><br>سجل تجاري رقم: ${co.cr}<br>يشار إليه فيما بعد (بالطرف الأول).`
      ) +
      ctRow4('And:', esc(m.employeeNameEn||m.employeeName), esc(m.employeeName), 'وبين :') +
      ctRow4('Nationality:', esc(m.nationalityEn||m.nationalityAr), esc(m.nationalityAr), 'الجنسية:') +
      ctRow4('Passport No.:', esc(m.passportNumber), esc(m.passportNumber), 'رقم الجواز:') +
      ctRow4('Visa No.:', esc(m.visaNumber), esc(m.visaNumber), 'رقم التأشيرة:')
    );
    html += ctTable(
      ctHeadRow('Contract Terms', 'بنود العقد') +
      ctClause('1', `The second party shall work for the first party as: <b>${esc(m.jobTitleEn||m.jobTitleAr)}</b>, and may be assigned to any location as required by the employer.`, `أن يعمل الطرف الثاني لدى الطرف الأول بمهنة: <b>${esc(m.jobTitleAr)}</b>، وأن يعمل في أي مكان حسب متطلبات العمل لدى الطرف الأول.`) +
      ctClause('2', 'The first party shall provide the second party with shared housing, health care, and transportation as agreed.', 'يؤمّن الطرف الأول للطرف الثاني سكناً جماعياً ورعاية صحية ومواصلات يتم الاتفاق عليها.') +
      ctClause('3', `The first party shall pay the second party a monthly salary of <b>${money(m.monthlySalary)} SAR</b>.`, `يدفع الطرف الأول للطرف الثاني راتباً شهرياً قدره <b>${money(m.monthlySalary)} ريال</b>.`) +
      ctClause('4', `The contract is for <b>${esc(m.contractYears||2)} year(s)</b>, renewable, starting from the second party's arrival and commencement of work.`, `العقد لمدة <b>${esc(m.contractYears||2)} سنة</b> قابل للتجديد، يبدأ من تاريخ وصول الطرف الثاني لمقر عمله واستلامه العمل.`) +
      ctClause('5', `The first <b>${esc(m.probationMonths||6)} months</b> shall be a probationary period, after which the contract becomes effective.`, `تعتبر أول <b>${esc(m.probationMonths||6)} أشهر</b> فترة تجربة، ويعتبر العقد ساري المفعول بعد انتهائها.`) +
      ctClause('6', 'The second party shall take full responsibility for any equipment entrusted to him and return it upon termination of work.', 'يتعهد الطرف الثاني بالحفاظ على الآلات التي في عهدته، ويكون مسؤولاً مسؤولية كاملة عنها وإعادتها بعد انتهاء العمل.') +
      ctClause('7', 'Saudi Labor Law shall govern any matter not covered herein, and any dispute between the parties shall be resolved accordingly.', 'يعتبر نظام العمل المعمول به في المملكة العربية السعودية مكمّلاً لبنود هذا العقد، وأي خلاف ينشأ بين الطرفين يُفصل فيه وفق هذا النظام.') +
      ctRow2('This agreement is made accordingly.', 'وعلى هذا جرى الاتفاق.')
    );
    html += `<div style="height:24px"></div>`;
    html += ctTableLoose(
      `<tr class="ct-head"><th style="width:50%">${co.nameAr}</th><th style="width:50%">اسم الموظف</th></tr>` +
      `<tr><td class="rtl ctr">First Party</td><td class="rtl ctr">${esc(m.employeeName)}</td></tr>` +
      `<tr><td style="height:50px"></td><td></td></tr>`
    );
    html += docFooter({company:m.company});
    return html;
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
          ${docHeader(emp,'إشعار بعدم الرغبة في تجديد العقد (من الموظف)','Notice of Non-Renewal (by Employee)')}
          <div class="row">${kv('التاريخ', m.date?fmtDate(m.date):todayStr())}${kv('الرقم الوظيفي', emp.jobNo)}</div>
          <div class="row">${kv('الاسم', emp.nameAr)}${kv('هوية رقم', emp.idNumber)}</div>
          <div class="bi-row">
            <div class="ar">أنا الموظف المذكورة بياناته أعلاه، لا أرغب بتجديد عقدي وذلك لظروفي الشخصية، وآمل منكم الموافقة على ذلك، علماً أن آخر يوم عمل لي مع نهاية عقدي هو تاريخ: <b>${fmtDate(m.endDate)}</b>.</div>
            <div class="en">I, the employee whose details are stated above, do not wish to renew my contract due to personal circumstances, and I hope you will approve this. My last working day, coinciding with the end of my contract, will be: <b>${fmtDate(m.endDate)}</b>.</div>
          </div>
          <div class="sign-grid two" style="margin-top:70px">${signBox('اسم وتوقيع الموظف / Employee Signature')}${signBox('توقيع استلام الموارد البشرية / HR Receipt')}</div>
          ${docFooter(emp)}`;
      }
      const isResident = variant==='resident';
      return `
        ${docHeader(emp, isResident ? 'إشعار عدم رغبة الشركة بتجديد العقد (للمقيمين)' : 'إشعار عدم رغبة الشركة بتجديد العقد (للسعوديين)', 'Notice of Non-Renewal of Contract')}
        <div class="row">${kv('التاريخ', m.date?fmtDate(m.date):todayStr())}${kv('الرقم الوظيفي', emp.jobNo)}</div>
        <div class="row">${kv('السيد/ة', emp.nameAr)}${kv('رقم الهوية', emp.idNumber)}</div>
        <div class="row">${kv('المسمى الوظيفي', emp.jobTitleAr)}</div>
        <div class="bi-row">
          <div class="ar">بداية، نتقدم لكم بخالص التقدير والامتنان على ما قدمتم وبذلتم من جهود وتعاون وتفانٍ في العمل طوال فترة عملكم لدينا في ${co.nameAr}.</div>
          <div class="en">First of all, we extend our sincere appreciation and gratitude for your efforts, cooperation and dedication throughout your period of work with us at ${co.nameEn}.</div>
        </div>
        <div class="bi-row">
          <div class="ar">ويؤسفنا إبلاغكم بعدم رغبة الشركة في تجديد عقد العمل المقرر انتهاؤه بتاريخ: <b>${fmtDate(m.endDate)}</b>${m.reason?(' وذلك بسبب: '+esc(m.reason)):''}.</div>
          <div class="en">We regret to inform you of the company's unwillingness to renew the employment contract, due to expire on: <b>${fmtDate(m.endDate)}</b>${m.reason?(', due to: '+esc(m.reason)):''}.</div>
        </div>
        ${isResident ? `<div class="bi-row">
          <div class="ar">سيتم عمل خروج نهائي للموظف في حال عدم رفع طلب نقل كفالة عبر منصة قوى بعد انتهاء العقد.</div>
          <div class="en">A final exit will be processed for the employee if a sponsorship transfer request is not submitted via the Qiwa platform after the contract ends.</div>
        </div>` : ''}
        <div class="bi-row">
          <div class="ar">كما نشكر لكم حسن السيرة والسلوك طوال فترة عملكم لدينا، مع تمنياتنا لكم بدوام التوفيق والنجاح.</div>
          <div class="en">We also thank you for your good conduct throughout your period of work with us, wishing you continued success.</div>
        </div>
        <div class="sign-grid two" style="margin-top:50px">${signBox('إدارة الموارد البشرية / HR Department')}${signBox('توقيع استلام الإشعار من الموظف / Employee Receipt')}</div>
        ${docFooter(emp)}`;
    }
  };
}
const FORM_NON_RENEWAL_RESIDENT = nonRenewalNotice('non-renewal-resident','إشعار عدم رغبة الشركة بتجديد العقد (للمقيمين)','resident');
const FORM_NON_RENEWAL_SAUDI = nonRenewalNotice('non-renewal-saudi','إشعار عدم رغبة الشركة بتجديد العقد (للسعوديين)','saudi');
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
    {key:'startWork', label:'تاريخ بداية العمل', type:'date', default: e=>e?.joinDate},
    {key:'lastDay', label:'تاريخ آخر يوم عمل', type:'date'},
    {key:'currentBalance', label:'رصيد الإجازات الحالي', type:'number', default: e=>e?.annualLeave},
    {key:'usedDays', label:'الإجازات المستنفذة', type:'number', default:'0'},
    {key:'ticketFrom', label:'الرحلة من', type:'text'},
    {key:'ticketTo', label:'الرحلة إلى', type:'text'},
    {key:'ticketAmount', label:'سعر التذكرة (ر.س)', type:'number'},
    {key:'vacationAllowance', label:'مبلغ بدل الإجازة (ر.س)', type:'number'},
    {key:'unpaidDays', label:'أيام إجازة بدون راتب', type:'number', default:'0'},
  ],
  render(emp,m){
    const {y,m:mo,d} = dateDiffYMD(m.startWork||emp.joinDate, m.lastDay);
    return `
      ${docHeader(emp,'طلب صرف مستحقات إجازة','Vacation Benefits Request')}
      <div class="row">${kv('التاريخ', m.date?fmtDate(m.date):todayStr())}</div>
      <div class="row">${kv('الاسم', emp.nameAr)}${kv('الوظيفة', emp.jobTitleAr)}${kv('الرقم الوظيفي', emp.jobNo)}${kv('الجنسية', emp.nationalityAr)}</div>
      <table class="doc-table"><thead><tr><th>الأساسي</th><th>السكن</th><th>النقل</th><th>أخرى</th><th>الإجمالي</th></tr></thead>
        <tbody><tr><td>${money(emp.basic)}</td><td>${money(emp.housing)}</td><td>${money(emp.transport)}</td><td>${money(emp.living)}</td><td><b>${money(emp.total)}</b></td></tr></tbody></table>
      <div class="row">${kv('رصيد الإجازات الحالي', m.currentBalance)}${kv('الإجازات المستنفذة', m.usedDays)}${kv('مبلغ بدل الإجازة', money(m.vacationAllowance))}${kv('أيام بدون راتب', m.unpaidDays)}</div>
      <div class="row">${kv('اسم البنك', emp.bankAr)}${kv('رقم الآيبان', emp.iban)}</div>
      <div class="section-title">مدة الخدمة</div>
      <div class="row">${kv('تاريخ بداية العمل', m.startWork?fmtDate(m.startWork):'—')}${kv('تاريخ آخر يوم عمل', m.lastDay?fmtDate(m.lastDay):'—')}</div>
      <table class="doc-table"><thead><tr><th>سنة</th><th>شهر</th><th>يوم</th></tr></thead>
        <tbody><tr><td>${y}</td><td>${mo}</td><td>${d}</td></tr></tbody></table>
      <div class="section-title">تفاصيل السفر</div>
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
const FORM_RECEIPT_BONUS = salaryReceiptForm('receipt-bonus','سند استلام مكافأة', {defaultPeriodText:'وذلك مكافأة عن العام الحالي.'});
const FORM_RECEIPT_ADVANCE = salaryReceiptForm('receipt-advance','سند استلام سلفة', {defaultPeriodText:'وذلك كسلفة تُسترد مني نهاية الشهر.'});

const FORM_RECEIPT_SALARY_EXT = {
  id:'receipt-salary-ext', cat:'financial', titleAr:'سند استلام راتب - عمالة خارجية (يدوي)',
  standalone:true,
  manualFields:[
    {key:'company', label:'الشركة', type:'select', options:Object.keys(COMPANIES), default:'بيت هائل للنقليات'},
    {key:'date', label:'التاريخ', type:'date', default:()=>new Date().toISOString().slice(0,10)},
    {key:'name', label:'الاسم', type:'text'},
    {key:'nameEn', label:'Name (EN)', type:'text'},
    {key:'amount', label:'المبلغ (ر.س)', type:'number'},
    {key:'period', label:'وصف الفترة (مثال: راتب شهر سبتمبر من 01/09 إلى 02/09)', type:'text'},
  ],
  render(emp,m){
    const co = COMPANIES[m.company] || DEFAULT_COMPANY;
    return `
      <div class="doc-header"><img src="assets/logo.png"><div class="co-name">${co.nameAr}<br>${co.nameEn}</div></div>
      <div class="doc-title"><h1>سند استلام راتب - عمالة خارجية</h1></div>
      <div class="row">${kv('التاريخ', m.date?fmtDate(m.date):todayStr())}</div>
      <p class="para">أنا السيد: <b>${esc(m.name)}</b> (${esc(m.nameEn||'')})،</p>
      <p class="para">استلمت من ${co.nameAr} مبلغاً وقدره: <b>${money(m.amount)} ريال سعودي</b>،</p>
      <p class="para">${esc(m.period)||'<span class="tag-empty">—</span>'}</p>
      <div class="sign-grid two" style="margin-top:70px">${signBox('توقيع المستلم')}${signBox('توقيع الموارد البشرية')}</div>
      ${docFooter({company:m.company})}`;
  }
};

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
  FORM_TAAREEF_SAFARA, FORM_TAAREEF_RATIB_SAFARAT, FORM_ADAM_MUMANAA, FORM_TAAREEF_RATIB, FORM_TAAREEF_TATHBEET_RIYAD, FORM_TAAREEF_TATHBEET_ALINMA, FORM_TAAREEF_TATHBEET_RATIB, FORM_TAAREEF_MUWAZAF_EOS,
  // عقود العمل
  FORM_AQD_MAWAD, FORM_AQD_NAQLIYAT, FORM_AQD_SIYANA, FORM_AQD_MAWAD_AMOLA, FORM_AQD_NAQLIYAT_AMOLA, FORM_AQD_TASHEERA,
  // إنهاء الخدمة وإخلاء الطرف
  FORM_IKHLA_TARAF, FORM_IKHLA_TARAF_CHECKLIST, FORM_NON_RENEWAL_RESIDENT, FORM_NON_RENEWAL_SAUDI, FORM_NON_RENEWAL_EMPLOYEE,
  FORM_TERM_PROBATION, FORM_TERM_MUTUAL, FORM_TERM_RELATIONSHIP, FORM_RESIGN, FORM_RESIGN_PROBATION,
  FORM_EXTEND_PROBATION, FORM_SETTLEMENT_DATA, FORM_MUKHALASA_MALIYA,
  // المالية والمستحقات
  FORM_KAFALA_MALIYA, FORM_ISTILAM_MUSTAHAQAT, FORM_VACATION_DUES, FORM_ADVANCE_REQUEST,
  FORM_RECEIPT_ADVANCE, FORM_RECEIPT_SALARY_EXT, FORM_RECEIPT_SALARY, FORM_RECEIPT_BONUS,
  FORM_SALARY_ADJUST_1, FORM_SALARY_ADJUST_2,
  // العمليات اليومية
  FORM_ABSENCE_WARNING, FORM_BUSINESS_TRIP, FORM_TRAVEL_DUES,
  FORM_ASSIGNMENT_REPORT, FORM_MUBASHARAT_AMAL, FORM_INVESTIGATION_RECORD,
];
