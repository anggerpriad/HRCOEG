// Minimal stepper + mock handlers (replace alerts with real API calls)
document.addEventListener('click', (e) => {
  const action = e.target.dataset.action;
  const service = e.target.dataset.service;
  if (!action) return;
  if (action === 'book') openPanel(service, 'book');
  if (action === 'start' && service === 'psikotes') openPanel(service, 'psikotes_start');
  if (action === 'start' && service === 'interview') openPanel(service, 'interview_start');
  if (action === 'upload' && service === 'cv') openPanel(service, 'cv_upload');
});

const panel = document.getElementById('panel');
const panelClose = document.getElementById('panelClose');
panelClose.addEventListener('click', closePanel);

function openPanel(service, mode){
  buildStepper(service, mode);
  panel.classList.remove('hidden');
  panel.setAttribute('aria-hidden','false');
}

function closePanel(){
  panel.classList.add('hidden');
  panel.setAttribute('aria-hidden','true');
  document.getElementById('stepsHeader').innerHTML='';
  document.getElementById('stepsContainer').innerHTML='';
}

/* Stepper builder: simple 3-step workflow depending on service */
function buildStepper(service, mode){
  const headers = [];
  const steps = [];

  if (mode === 'book') {
    headers.push('Pilih Layanan','Pilih Waktu','Konfirmasi');
    steps.push(
      bookingStep1(service),
      bookingStep2(service),
      bookingConfirm(service)
    );
  } else if (mode === 'psikotes_start') {
    headers.push('Info Singkat','Mulai Tes','Selesai');
    steps.push(
      htmlStep(`<p class="small-muted">Tes singkat ini memakan waktu ~15 menit. Siapkan waktu tenang.</p>
        <div class="actions-row">
          <button class="btn" id="skipTest">Kembali</button>
          <button class="btn primary" id="beginTest">Mulai Tes</button>
        </div>`),
      htmlStep(`<p>Soal dummy (demo). Klik Finish untuk menyelesaikan.</p>
        <div class="progress"><i id="demoProg" style="width:40%"></i></div>
        <div class="actions-row">
          <button class="btn" id="prev">Kembali</button>
          <button class="btn primary" id="finishTest">Selesai</button>
        </div>`),
      htmlStep(`<h3>Terima kasih!</h3><p>Hasil akan dikirim via email & tersedia di dashboard Anda.</p>
        <div class="actions-row"><button class="btn primary" id="toDashboard">Ke Dashboard</button></div>`)
    );
  } else if (mode === 'cv_upload') {
    headers.push('Upload CV','Analisa ATS','Sesi Review');
    steps.push(
      htmlStep(`<label class="field">Upload CV (PDF/DOCX)
        <input type="file" id="cvFile" accept=".pdf,.doc,.docx">
      </label>
      <p class="small-muted">Ukuran max 10MB.</p>
      <div class="actions-row"><button class="btn" id="cancelUpload">Batal</button><button class="btn primary" id="sendCV">Kirim & Analisa</button></div>`),
      htmlStep(`<p>Analisa berjalan... (demo)</p><div class="progress"><i style="width:70%"></i></div>
        <div class="actions-row"><button class="btn" id="skipToBooking">Lewati ke Jadwal Review</button></div>`),
      bookingConfirm(service)
    );
  } else if (mode === 'interview_start') {
    headers.push('Pilih Role','Latihan','Book Mentor');
    steps.push(
      htmlStep(`<label class="field"><label>Role yang disiapkan</label>
        <select id="roleSelect"><option>Software Engineer</option><option>Business Analyst</option></select></label>
        <div class="actions-row"><button class="btn" id="toPractice">Mulai Latihan</button></div>`),
      htmlStep(`<p>Latihan teknik jawaban (STAR) — demo</p><div class="actions-row"><button class="btn" id="nextToBook">Jadwalkan Mock Interview</button></div>`),
      bookingConfirm(service)
    );
  }

  // render headers and steps
  const hEl = document.getElementById('stepsHeader');
  const cEl = document.getElementById('stepsContainer');
  hEl.innerHTML = '';
  cEl.innerHTML = '';
  headers.forEach((h,i) => {
    const li = document.createElement('li');
    li.textContent = h;
    if (i===0) li.classList.add('active');
    hEl.appendChild(li);
    const stepDiv = document.createElement('div');
    stepDiv.className = 'step' + (i===0 ? ' active' : '');
    stepDiv.innerHTML = steps[i] || '';
    cEl.appendChild(stepDiv);
  });

  // hook up simple navigation listeners for sample buttons inside steps
  setTimeout(() => {
    // generic next / prev navigation
    cEl.querySelectorAll('.btn').forEach(btn => {
      btn.addEventListener('click', (ev) => {
        const id = btn.id;
        if (id === 'beginTest') goToStep(1);
        if (id === 'prev') goToStep(0);
        if (id === 'finishTest') {
          alert('Tes selesai (demo). Hasil akan dikirim.');
          goToStep(2);
        }
        if (id === 'toDashboard') closePanel();
        if (id === 'sendCV') {
          alert('CV dikirim untuk analisa (demo).');
          goToStep(1);
        }
        if (id === 'skipToBooking') goToStep(2);
        if (id === 'cancelUpload') closePanel();
        if (id === 'toPractice') goToStep(1);
        if (id === 'nextToBook') goToStep(2);
        if (id === 'skipTest') closePanel();
      });
    });
  }, 50);
}

function htmlStep(inner){
  return `<div class="step-inner">${inner}</div>`;
}

function bookingStep1(service){
  return htmlStep(`<p class="small-muted">Pilih waktu untuk layanan: <strong>${service}</strong></p>
    <label class="field"><label>Tanggal</label><input type="date" id="bk_date"></label>
    <label class="field"><label>Jam</label><input type="time" id="bk_time"></label>
    <div class="actions-row"><button class="btn" id="bk_prev">Batal</button><button class="btn primary" id="bk_next">Lanjutkan</button></div>`);
}

function bookingStep2(service){
  return htmlStep(`<p>Konfirmasi slot yang dipilih</p><div id="bk_summary" class="small-muted"></div>
    <div class="actions-row"><button class="btn" id="bk_back">Kembali</button><button class="btn primary" id="bk_confirm">Konfirmasi & Booking</button></div>`);
}

function bookingConfirm(service){
  return htmlStep(`<h3>Konfirmasi Booking</h3><p class="small-muted">Setelah konfirmasi, Anda akan menerima e-mail & calendar invite (demo).</p>
    <div class="actions-row"><button class="btn" id="bk_done">Selesai</button></div>`);
}

/* step navigation (very simple) */
function goToStep(n){
  const headers = document.querySelectorAll('#stepsHeader li');
  const steps = document.querySelectorAll('.step');
  headers.forEach((h,i)=>h.classList.toggle('active', i===n));
  steps.forEach((s,i)=>s.classList.toggle('active', i===n));
}

/* Placeholder: connect real listeners (e.g. booking next/confirm) */
document.addEventListener('click', (e) => {
  if (e.target.id === 'bk_next') {
    const date = document.getElementById('bk_date').value;
    const time = document.getElementById('bk_time').value;
    if (!date || !time) return alert('Pilih tanggal & jam.');
    document.getElementById('bk_summary').innerText = `Tanggal: ${date} ${time}`;
    goToStep(1);
  }
  if (e.target.id === 'bk_back') goToStep(0);
  if (e.target.id === 'bk_confirm') {
    alert('Booking dikonfirmasi (demo). Calendar invite terkirim.');
    goToStep(2);
  }
  if (e.target.id === 'bk_done') closePanel();
});
