// Harsh Nirwan Classes — website logic
import * as CFG from "./config.js";
const { firebaseConfig } = CFG;
const MAX_UPLOAD_MB = CFG.MAX_UPLOAD_MB || 500;
const USE_STORAGE = CFG.USE_STORAGE !== false;

const FB = "https://www.gstatic.com/firebasejs/10.12.2/";

/* =================== static data =================== */
const EXAMS = ["KVS / NVS TGT PE","DSSSB PET / TGT PE","UP TGT PE","UP PGT PE","UP Assistant Professor PE","UGC NET PE","Other / All exams"];
const TOPICS = ["History & Foundations of PE","Olympics, Asian & CWG","Awards & Sports Bodies","Anatomy & Physiology","Exercise Physiology","Kinesiology & Biomechanics","Sports Training","Sports Psychology","Test, Measurement & Evaluation","Health Education & Nutrition","Sports Injuries & First Aid","Yoga","Games & Sports Rules","Organisation & Administration","Teaching Methods & Pedagogy","Research & Statistics","General / Others"];
// [topic, question, options, answerIndex, explanation]
const BASE_QB = [
 ["Exercise Physiology","Normal resting heart rate of an adult is about:",["50 bpm","72 bpm","100 bpm","120 bpm"],1,"Average adult resting heart rate is about 72 beats per minute (normal range 60–100)."],
 ["Games & Sports Rules","How many players of one team are on court in handball?",["6","7","9","11"],1,"Handball is played 7 v 7 (6 court players + 1 goalkeeper)."],
 ["Games & Sports Rules","Size of a handball court is:",["40 m × 20 m","28 m × 15 m","18 m × 9 m","44 m × 22 m"],0,"A handball court measures 40 m × 20 m."],
 ["Games & Sports Rules","The penalty throw in handball is taken from:",["6 m","7 m","9 m","11 m"],1,"The 7-metre throw is handball's penalty."],
 ["Games & Sports Rules","Dimensions of a basketball court (FIBA):",["28 m × 15 m","30 m × 18 m","26 m × 14 m","18 m × 9 m"],0,"FIBA court is 28 m long and 15 m wide."],
 ["Games & Sports Rules","Size of a volleyball court is:",["18 m × 9 m","20 m × 10 m","16 m × 8 m","24 m × 12 m"],0,"Volleyball court: 18 m × 9 m."],
 ["Games & Sports Rules","Height of the volleyball net for men is:",["2.24 m","2.43 m","2.50 m","2.35 m"],1,"Men's net: 2.43 m; women's: 2.24 m."],
 ["Games & Sports Rules","Number of players of a team on the field in Kho-Kho:",["7","9","11","12"],1,"9 players take the field (8 chasers sitting + 1 active chaser)."],
 ["Games & Sports Rules","Number of players on court per team in Kabaddi:",["5","6","7","9"],2,"Kabaddi is played with 7 players per side on court."],
 ["Games & Sports Rules","A hockey match (FIH) is played in:",["2 halves of 35 min","4 quarters of 15 min","3 periods of 20 min","2 halves of 30 min"],1,"Field hockey uses four 15-minute quarters."],
 ["Awards & Sports Bodies","National Sports Day in India is celebrated on:",["29 August","15 October","5 September","14 November"],0,"29 August — birth anniversary of Major Dhyan Chand."],
 ["Awards & Sports Bodies","India's highest sporting honour is now named after:",["Rajiv Gandhi","Major Dhyan Chand","Milkha Singh","P.T. Usha"],1,"Renamed Major Dhyan Chand Khel Ratna in 2021."],
 ["Awards & Sports Bodies","Dronacharya Award is given to:",["Players","Coaches","Lifetime achievers","Sports journalists"],1,"Dronacharya Award honours outstanding coaches."],
 ["Olympics, Asian & CWG","The first Asian Games were held in 1951 at:",["Tokyo","Manila","New Delhi","Jakarta"],2,"The 1st Asian Games were held in New Delhi in 1951."],
 ["Olympics, Asian & CWG","Father of the modern Olympic Games is:",["Pierre de Coubertin","Avery Brundage","Juan Antonio Samaranch","Thomas Bach"],0,"Baron Pierre de Coubertin revived the Olympics (Athens 1896)."],
 ["Olympics, Asian & CWG","The 2028 Summer Olympics will be held in:",["Paris","Brisbane","Los Angeles","Tokyo"],2,"LA 2028; Brisbane hosts 2032."],
 ["History & Foundations of PE","YMCA College of Physical Education, Chennai (Madras) was founded in 1920 by:",["H.C. Buck","G.D. Sondhi","P.M. Joseph","J.P. Thomas"],0,"Harry Crowe Buck founded it in 1920."],
 ["History & Foundations of PE","LNIPE (Lakshmibai National Institute of Physical Education) is located at:",["Patiala","Gwalior","Bengaluru","Kolkata"],1,"LNIPE is a deemed university in Gwalior, M.P."],
 ["Anatomy & Physiology","Number of bones in an adult human body:",["206","212","300","196"],0,"Adults have 206 bones (newborns have about 270–300)."],
 ["Anatomy & Physiology","The largest muscle of the human body is:",["Quadriceps","Latissimus dorsi","Gluteus maximus","Deltoid"],2,"Gluteus maximus is the largest muscle."],
 ["Anatomy & Physiology","The Achilles tendon attaches the calf muscles to the:",["Talus","Calcaneus","Tibia","Patella"],1,"It inserts on the calcaneus (heel bone)."],
 ["Exercise Physiology","Lactic acid accumulates mainly during:",["Aerobic exercise","Anaerobic glycolysis","Rest","Sleep"],1,"High-intensity work relies on anaerobic glycolysis, producing lactate."],
 ["Kinesiology & Biomechanics","In isometric contraction, muscle length:",["Shortens","Lengthens","Does not change","First shortens then lengthens"],2,"Isometric = tension without change in muscle length."],
 ["Sports Psychology","Body-type (somatotype) classification — endomorph, mesomorph, ectomorph — was given by:",["Kretschmer","W.H. Sheldon","Hippocrates","Jung"],1,"William H. Sheldon proposed somatotypes."],
 ["Sports Training","Fartlek training originated in:",["Germany","Sweden","Finland","USA"],1,"Fartlek ('speed play') was developed in Sweden by Gösta Holmer."],
 ["Test, Measurement & Evaluation","Cooper's test is a:",["12-minute run/walk","600 m run","Shuttle run","Step test of 5 minutes"],0,"Cooper's 12-minute run estimates aerobic fitness."],
 ["Test, Measurement & Evaluation","Harvard Step Test measures:",["Flexibility","Cardiovascular fitness","Strength","Agility"],1,"It measures cardiovascular endurance via heart-rate recovery."],
 ["Test, Measurement & Evaluation","Kraus–Weber test measures:",["Minimum muscular fitness","Speed","Balance","Reaction time"],0,"Kraus–Weber tests minimum muscular fitness (6 items)."],
 ["Health Education & Nutrition","BMI is calculated as:",["Weight(kg) ÷ Height(m)²","Height ÷ Weight","Weight × Height","Weight(kg) ÷ Height(cm)"],0,"BMI = weight in kg divided by height in metres squared."],
 ["Health Education & Nutrition","Rickets is caused by deficiency of:",["Vitamin A","Vitamin C","Vitamin D","Vitamin K"],2,"Vitamin D deficiency causes rickets in children."],
 ["Health Education & Nutrition","Scurvy is caused by deficiency of:",["Vitamin B1","Vitamin C","Iron","Iodine"],1,"Lack of vitamin C causes scurvy."],
 ["Sports Injuries & First Aid","A sprain is an injury to a:",["Muscle","Tendon","Ligament","Bone"],2,"Sprain = ligament; strain = muscle/tendon."],
 ["Sports Injuries & First Aid","In RICE, 'C' stands for:",["Cooling","Compression","Care","Circulation"],1,"Rest, Ice, Compression, Elevation."],
 ["Yoga","Ashtanga Yoga of Patanjali has how many limbs?",["5","6","8","10"],2,"Yama, Niyama, Asana, Pranayama, Pratyahara, Dharana, Dhyana, Samadhi."],
 ["Anatomy & Physiology","Oxygen in blood is carried mainly by:",["Plasma","Haemoglobin","Platelets","WBCs"],1,"Haemoglobin in RBCs carries most of the oxygen."],
];
const SYL = {
 "History & Foundations of PE":["Meaning, aims & objectives of PE","Philosophies: idealism, naturalism, pragmatism","PE in ancient India & Greece","PE after independence; key institutions"],
 "Olympics, Asian & CWG":["Ancient & modern Olympics","Olympic symbols, motto, oath","Asian Games & Commonwealth Games","India's Olympic medal history"],
 "Awards & Sports Bodies":["Khel Ratna, Arjuna, Dronacharya, Dhyan Chand awards","SAI, IOA, NSFs, WADA/NADA","Major trophies & cups"],
 "Anatomy & Physiology":["Skeletal system & joints","Muscular system","Circulatory & respiratory systems","Nervous & endocrine systems"],
 "Exercise Physiology":["Energy systems (ATP-PC, glycolysis, aerobic)","Effects of exercise on body systems","VO₂ max, fatigue & recovery"],
 "Kinesiology & Biomechanics":["Planes & axes of movement","Laws of motion, levers","Types of muscle contraction","Projectile & equilibrium"],
 "Sports Training":["Principles of training & load","Strength, speed, endurance, flexibility, coordination","Training methods: interval, fartlek, circuit, plyometrics","Periodization & planning"],
 "Sports Psychology":["Motivation & personality","Anxiety, stress & arousal","Learning curves & transfer","Group dynamics, aggression"],
 "Test, Measurement & Evaluation":["Criteria of a good test","Fitness tests (AAHPER, Kraus–Weber, Harvard step, Cooper)","Skill tests for games","Anthropometry & body composition"],
 "Health Education & Nutrition":["Balanced diet, nutrients & deficiencies","Communicable diseases & hygiene","School health programme","Obesity, BMI & lifestyle diseases"],
 "Sports Injuries & First Aid":["Soft & hard tissue injuries","RICE/PRICE, first aid principles","Rehabilitation & massage"],
 "Yoga":["Ashtanga yoga & its limbs","Asanas, pranayama, kriyas","Yoga for lifestyle diseases"],
 "Games & Sports Rules":["Athletics: track & field events","Major games: court/field dimensions & rules","Indian games: kabaddi, kho-kho","Officiating & fixtures (knock-out, league)"],
 "Organisation & Administration":["Planning, budget, facilities & equipment","Intramural & extramural competitions","Time-table & records"],
 "Teaching Methods & Pedagogy":["Methods of teaching PE","Lesson plan & demonstration","Class management & commands","Inclusive PE / adapted PE"],
 "Research & Statistics":["Types of research & hypothesis","Measures of central tendency & variability","Normal curve, correlation"]
};

/* =================== helpers =================== */
const $ = s => document.querySelector(s);
const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const LS = {get(k,d){try{const v=localStorage.getItem("hnc_"+k);return v?JSON.parse(v):d}catch(e){return d}},set(k,v){try{localStorage.setItem("hnc_"+k,JSON.stringify(v))}catch(e){}}};
function toast(t){const el=$("#toast");el.textContent=t;el.classList.add("on");clearTimeout(toast._t);toast._t=setTimeout(()=>el.classList.remove("on"),2800)}
const fmtSize = b => !b ? "" : b>1048576 ? (b/1048576).toFixed(1)+" MB" : Math.round(b/1024)+" KB";
const tsMs = t => t && t.toMillis ? t.toMillis() : (typeof t === "number" ? t : 0);
const fmtDate = t => { const ms = tsMs(t); return ms ? new Date(ms).toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"}) : ""; };
const errMsg = e => (e && (e.code || e.message)) || "unknown error";
const cap = s => s[0].toUpperCase()+s.slice(1);
function ytId(u){const m=String(u).match(/(?:youtu\.be\/|v=|embed\/|shorts\/|live\/)([A-Za-z0-9_-]{11})/);return m?m[1]:null}
const safeUrl = u => /^https:\/\//i.test(String(u||"")) ? u : "";

/* =================== navigation =================== */
function go(v){
  document.querySelectorAll(".view").forEach(s=>s.classList.toggle("on", s.id==="v-"+v));
  document.querySelectorAll("nav button").forEach(b=>b.classList.toggle("on", b.dataset.go===v));
  window.scrollTo(0,0);
  if(v==="mock" && !mock.running && !mock.done) renderMockStart();
  if(v==="unlock") renderUnlock();
}
document.addEventListener("click", e => { const b=e.target.closest("[data-go]"); if(b){ e.preventDefault(); go(b.dataset.go); } });
document.addEventListener("click", e => {
  const p=e.target.closest("[data-pane]"); if(p){document.querySelectorAll("[data-pane]").forEach(b=>b.classList.toggle("on",b===p));document.querySelectorAll(".pane").forEach(x=>x.classList.toggle("on",x.id===p.dataset.pane))}
  const c=e.target.closest("[data-copy]"); if(c){ navigator.clipboard?.writeText(c.dataset.copy).then(()=>toast("Copied"),()=>toast("Copy failed — select and copy manually")); }
});

/* =================== confirm dialog & modal =================== */
let confirmFn=null;
function askConfirm(text,btn,fn){$("#cTxt").textContent=text;$("#cYes").textContent=btn;confirmFn=fn;$("#confirmM").classList.add("on")}
$("#cNo").onclick=()=>{$("#confirmM").classList.remove("on");confirmFn=null};
$("#cYes").onclick=async()=>{$("#confirmM").classList.remove("on");const f=confirmFn;confirmFn=null;if(f)await f()};
function closeModal(){$("#modal").classList.remove("on");$("#mBody").innerHTML=""}
$("#mClose").onclick=closeModal; $("#modal").onclick=e=>{if(e.target.id==="modal")closeModal()};

/* =================== selects / countdown =================== */
const fillSelect=(el,arr,val)=>{el.innerHTML=arr.map(a=>`<option ${a===val?"selected":""}>${esc(a)}</option>`).join("")};
fillSelect($("#upTopic"),TOPICS); fillSelect($("#upExam"),EXAMS,"Other / All exams"); fillSelect($("#qTopic"),TOPICS);
fillSelect($("#myExam"),EXAMS,LS.get("myExam","KVS / NVS TGT PE"));
$("#myExam").onchange=e=>LS.set("myExam",e.target.value);
$("#examDate").value=LS.get("examDate","");
$("#examDate").onchange=e=>{LS.set("examDate",e.target.value);renderCountdown()};
function renderCountdown(){const d=$("#examDate").value,p=$("#cdPill");if(!d){p.textContent="Set date";return}
  const days=Math.ceil((new Date(d+"T00:00:00")-new Date().setHours(0,0,0,0))/864e5);
  p.textContent=days>0?days+" days left":days===0?"Exam today!":"Exam over"}
renderCountdown();

/* =================== app state =================== */
const S = {
  fb:null, user:null, isOwner:false, paid:false,
  materials:[], premium:{}, notices:[], payCfg:{}, myPayment:null,
  requests:[], students:[], questions:[], dbReady:false
};
let unsubs=[];   // listeners that depend on the signed-in user
const filt={videos:"All",pdfs:"All"};
const hasAccess=()=>S.isOwner||S.paid;
const isOpen=m=>m.free||hasAccess();

/* =================== rendering: header / role =================== */
function renderAcct(){
  const a=$("#acct");
  if(!S.fb){a.innerHTML="";return}
  if(S.user){a.innerHTML=`<button id="signOutBtn" title="Sign out">${S.user.photoURL?`<img src="${esc(S.user.photoURL)}" alt="" referrerpolicy="no-referrer">`:"👤"} Sign out</button>`;$("#signOutBtn").onclick=()=>askConfirm("Sign out of Harsh Nirwan Classes?","Sign out",()=>S.fb.signOut(S.fb.auth))}
  else{a.innerHTML=`<button id="signInBtn">🔐 Sign in</button>`;$("#signInBtn").onclick=signIn}
}
function setRole(){
  const rb=$("#roleBadge");
  document.body.classList.toggle("owner",S.isOwner);
  $("#navOwner").style.display=S.isOwner?"flex":"none";
  if(S.isOwner) rb.innerHTML="👑 <b>Owner</b> · upload, set price & approve students";
  else if(S.paid) rb.innerHTML=`⭐ <b>Premium</b> · ${esc(S.user?.displayName||"Student")}`;
  else if(S.user) rb.innerHTML=`🎓 ${esc(S.user.displayName||"Student")} · free preview`;
  else rb.innerHTML="🎓 Sign in with Google to join";
}

/* =================== library =================== */
function renderLibrary(kind){
  const type=kind==="videos"?"video":"pdf";
  const q=($("#q"+cap(kind)).value||"").toLowerCase();
  const all=S.materials.filter(m=>m.type===type);
  const topics=["All",...TOPICS.filter(t=>all.some(m=>m.topic===t))];
  $("#c"+cap(kind)).innerHTML=topics.map(t=>`<button class="chip ${filt[kind]===t?"on":""}" data-f="${kind}" data-t="${esc(t)}">${esc(t)}</button>`).join("");
  const list=all.filter(m=>(filt[kind]==="All"||m.topic===filt[kind])&&(!q||(m.title+" "+(m.desc||"")+" "+m.topic).toLowerCase().includes(q)));
  const el=$("#l"+cap(kind));
  if(!S.dbReady){el.innerHTML=`<div class="empty"><div class="big">⏳</div>Loading classes…</div>`;return}
  const locked=all.filter(m=>!isOpen(m)).length;
  const banner=locked?`<div class="premium" style="padding:12px"><div class="spread"><span>🔒 <b>${locked} locked</b> — unlock the full course</span><button class="btn sm alt" data-go="unlock">Unlock</button></div></div>`:"";
  if(!all.length){el.innerHTML=`<div class="empty"><div class="big">${type==="video"?"🎬":"📄"}</div><b>No ${type==="video"?"videos":"PDF notes"} yet</b><br><span class="hi">${S.isOwner?"Open the Owner tab to add your first one.":"New classes will appear here soon."}</span></div>`;return}
  el.innerHTML=banner+(list.length?list.map(m=>itemHTML(m)).join(""):`<div class="empty">Nothing matches.</div>`);
}
function itemHTML(m,own){
  const v=m.type==="video",open=isOpen(m);
  return `<div class="item"><div class="thumb ${open?(v?"v":"p"):"l"}">${open?(v?"▶️":"📄"):"🔒"}</div><div class="meta"><b>${esc(m.title)}</b>
  ${m.desc?`<small>${esc(m.desc)}</small><br>`:""}${m.free?`<span class="tag f">FREE</span>`:`<span class="tag o">PREMIUM</span>`}<span class="tag">${esc(m.topic)}</span>
  <small> ${fmtSize(m.sizeBytes)}${m.sizeBytes?" · ":""}${fmtDate(m.createdAt)}</small></div>
  <div style="display:flex;flex-direction:column;gap:6px">${open?`<button class="btn sm" data-open="${esc(m.id)}">${v?"Watch":"Open"}</button>`:`<button class="btn sm alt" data-go="unlock">🔒 Unlock</button>`}
  ${own?`<button class="btn sm danger" data-del="${esc(m.id)}">Delete</button>`:""}</div></div>`;
}
document.addEventListener("click",e=>{
  const f=e.target.closest("[data-f]");if(f){filt[f.dataset.f]=f.dataset.t;renderLibrary(f.dataset.f)}
  const o=e.target.closest("[data-open]");if(o)openItem(o.dataset.open);
  const d=e.target.closest("[data-del]");if(d)askDelete(d.dataset.del);
});
$("#qVideos").oninput=()=>renderLibrary("videos"); $("#qPdfs").oninput=()=>renderLibrary("pdfs");

async function openItem(id){
  const m=S.materials.find(x=>x.id===id); if(!m) return;
  if(!isOpen(m)){go("unlock");return}
  const loc=m.free?m:S.premium[id];
  if(!loc){toast("Loading… try again in a moment");return}
  $("#mTitle").textContent=m.title;
  $("#mBody").innerHTML=`<div class="empty">⏳ Opening…</div>`; $("#modal").classList.add("on");
  try{
    let url=loc.url||"";
    if(loc.storagePath){ url=await S.fb.getDownloadURL(S.fb.ref(S.fb.storage,loc.storagePath)); }
    const yt=ytId(url);
    let html;
    if(yt) html=`<iframe class="yt" src="https://www.youtube-nocookie.com/embed/${yt}?rel=0&modestbranding=1" allow="accelerometer; autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen title="${esc(m.title)}"></iframe>`;
    else if(m.type==="video"&&loc.storagePath) html=`<video controls playsinline controlsList="nodownload" oncontextmenu="return false" src="${esc(url)}"></video>`;
    else if(m.type==="pdf"&&loc.storagePath) html=`<iframe src="${esc(url)}" title="PDF"></iframe><div style="margin-top:10px"><a class="btn sm" href="${esc(url)}" target="_blank" rel="noopener">Open PDF full screen ↗</a></div>`;
    else html=`<p style="margin-bottom:10px">This lesson opens on another site.</p><a class="btn" href="${esc(safeUrl(url))}" target="_blank" rel="noopener">Open lesson ↗</a>`;
    $("#mBody").innerHTML=html+(m.desc?`<p class="hi" style="margin-top:8px">${esc(m.desc)}</p>`:"");
  }catch(err){$("#mBody").innerHTML=`<div class="empty">Couldn't open this file (${esc(errMsg(err))}).</div>`}
}

function askDelete(id){
  const m=S.materials.find(x=>x.id===id); if(!m) return;
  askConfirm(`Delete "${m.title}"? Students will lose access to it.`,"Delete",async()=>{
    const {db,doc,deleteDoc,deleteObject,ref,storage}=S.fb;
    try{
      const loc=m.free?m:S.premium[id];
      if(loc&&loc.storagePath){try{await deleteObject(ref(storage,loc.storagePath))}catch(e){}}
      if(!m.free){try{await deleteDoc(doc(db,"premium",id))}catch(e){}}
      await deleteDoc(doc(db,"materials",id)); toast("Deleted");
    }catch(err){toast("Could not delete: "+errMsg(err))}
  });
}

function renderStats(){$("#sVideos").textContent=S.materials.filter(m=>m.type==="video").length;$("#sPdfs").textContent=S.materials.filter(m=>m.type==="pdf").length}
function renderMine(){$("#lMine").innerHTML=S.materials.length?S.materials.map(m=>itemHTML(m,true)).join(""):`<div class="empty">Nothing uploaded yet.</div>`}

/* =================== notices =================== */
function renderNotices(){
  const el=$("#noticeList");
  if(!S.notices.length){el.innerHTML=`<div class="notice">Welcome to Harsh Nirwan Classes! Video lectures, PDF notes and tests for PE teacher exams.<small>हर्ष निरवान क्लासेस में आपका स्वागत है</small></div>`;return}
  el.innerHTML=S.notices.slice(0,5).map(n=>`<div class="notice">${esc(n.text)}<small>${fmtDate(n.createdAt)}${S.isOwner?` · <button data-dn="${esc(n.id)}" style="color:var(--red);font-size:.72rem">remove</button>`:""}</small></div>`).join("");
}
document.addEventListener("click",async e=>{const b=e.target.closest("[data-dn]");if(b&&S.fb){try{await S.fb.deleteDoc(S.fb.doc(S.fb.db,"notices",b.dataset.dn))}catch(err){toast("Could not remove")}}});
$("#postNotice").onclick=async()=>{
  const t=$("#noticeIn").value.trim(); if(!t||!S.fb) return; $("#postNotice").disabled=true;
  try{await S.fb.addDoc(S.fb.collection(S.fb.db,"notices"),{text:t.slice(0,500),createdAt:S.fb.serverTimestamp()});$("#noticeIn").value="";toast("Notice posted")}catch(e){toast("Could not post: "+errMsg(e))}
  $("#postNotice").disabled=false;
};

/* =================== premium card / unlock =================== */
function renderPremium(){
  const pc=$("#premiumCard"),c=S.payCfg;
  if(S.isOwner) pc.innerHTML=`<div class="premium ok"><div class="spread"><div><b>Paid students: ${S.students.length}</b><div class="hi">Course price ₹${esc(c.price||"—")}${S.requests.length?` · <b style="color:var(--orange)">${S.requests.length} payment(s) to check</b>`:""}</div></div><button class="btn sm" data-go="owner">Manage</button></div></div>`;
  else if(S.paid) pc.innerHTML=`<div class="premium ok"><b>⭐ Full course unlocked</b><div class="hi">सभी वीडियो और नोट्स उपलब्ध हैं — all videos & notes are open for you.</div></div>`;
  else pc.innerHTML=`<div class="premium"><div class="spread"><div><b>🔒 Unlock full course</b><div class="hi">All video lectures + PDF notes${c.price?` · <b style="color:var(--orange)">₹${esc(c.price)}</b>`:""}</div></div><button class="btn sm alt" data-go="unlock">Unlock</button></div></div>`;
}
function renderUnlock(){
  const el=$("#unlockArea"), c=S.payCfg;
  if(!S.fb){el.innerHTML=`<div class="card">Payments will open soon.</div>`;return}
  if(S.isOwner){el.innerHTML=`<div class="card">You're the owner — you already have full access. Students see the price and payment steps here once you fill in <b>Owner → Settings</b>.</div>`;return}
  if(S.paid){el.innerHTML=`<div class="premium ok"><b>⭐ You're a premium student</b><p class="hi">Everything is unlocked. Happy studying!</p><div style="margin-top:8px"><button class="btn sm" data-go="videos">Go to videos</button></div></div>`;return}
  if(!c.price&&!c.upi&&!c.link){el.innerHTML=`<div class="card">Course fee details will be posted soon. Check the notice board.</div>`;return}
  const head=`<div class="card" style="text-align:center"><div class="hi">Full course fee</div><div class="price">₹${esc(c.price||"—")}</div>${c.note?`<p class="hi">${esc(c.note)}</p>`:""}</div>`;
  if(!S.user){el.innerHTML=head+`<div class="card"><b>Step 1 · Sign in</b><div class="hi">Google account से साइन इन करें ताकि भुगतान के बाद आपका कोर्स खुल सके।</div><div style="margin-top:10px"><button class="btn" id="unlockSignIn">🔐 Sign in with Google</button></div></div>`;$("#unlockSignIn").onclick=signIn;return}
  const p=S.myPayment;
  const upiUrl=c.upi?`upi://pay?pa=${encodeURIComponent(c.upi)}&pn=${encodeURIComponent(c.name||"Harsh Nirwan Classes")}${c.price?`&am=${encodeURIComponent(c.price)}`:""}&cu=INR&tn=${encodeURIComponent("HNC course")}`:"";
  const wa=String(c.whatsapp||"").replace(/\D/g,"");
  const waUrl=wa?`https://wa.me/${wa}?text=${encodeURIComponent(`Hello Harsh Nirwan Classes, I paid ₹${c.price||""} for the full course.\nName: ${S.user.displayName||""}\nEmail: ${S.user.email||""}\nUPI ref: ${p?.utr||""}`)}`:"";
  let status="";
  if(p&&p.status==="pending") status=`<div class="notice">⏳ <b>Payment submitted</b> (ref ${esc(p.utr)}). It will unlock automatically once verified — usually within a few hours.<small>भुगतान जाँच के बाद कोर्स अपने आप खुल जाएगा</small></div>`;
  if(p&&p.status==="rejected") status=`<div class="notice" style="border-color:var(--red);background:#fdecec">❌ We couldn't find this payment (ref ${esc(p.utr)}). Check the reference number and submit again, or contact us on WhatsApp.</div>`;
  el.innerHTML=head+status+`
  <div class="card"><b>Step 1 · Pay</b><div class="hi">PhonePe / Google Pay / Paytm से भुगतान करें</div>
   ${c.upi?`<div class="copyrow"><code>${esc(c.upi)}</code><button class="btn sm ghost" data-copy="${esc(c.upi)}">Copy</button></div>${c.name?`<div class="hi" style="margin-top:4px">Name: ${esc(c.name)}</div>`:""}
   <div class="row" style="margin-top:10px"><a class="btn sm" href="${esc(upiUrl)}">Open UPI app</a>${safeUrl(c.link)?`<a class="btn sm alt" href="${esc(c.link)}" target="_blank" rel="noopener">Pay online ↗</a>`:""}</div>`
   :safeUrl(c.link)?`<div style="margin-top:10px"><a class="btn sm alt" href="${esc(c.link)}" target="_blank" rel="noopener">Pay online ↗</a></div>`:""}</div>
  <div class="card"><b>Step 2 · Submit payment details</b><div class="hi">UPI app में दिख रहा 12-अंकों का UTR / Reference नंबर डालें</div>
   <form id="payReq"><label class="f" for="prUtr">UPI ref / UTR / transaction ID</label><input class="in" id="prUtr" required minlength="6" maxlength="40" value="${esc(p&&p.status!=="approved"?p.utr:"")}">
   <label class="f" for="prAmt">Amount paid (₹)</label><input class="in" id="prAmt" type="number" min="1" value="${esc(c.price||"")}">
   <label class="f" for="prPhone">Mobile number</label><input class="in" id="prPhone" type="tel" maxlength="15" value="${esc(p?.phone||"")}">
   <div class="row" style="margin-top:12px"><button class="btn alt">Submit for verification</button><span class="hi" id="prStatus"></span></div></form>
   ${waUrl?`<div class="hi" style="margin-top:10px">Faster? <a href="${esc(waUrl)}" target="_blank" rel="noopener" style="color:var(--green);font-weight:600">Send the screenshot on WhatsApp ↗</a> (+${esc(wa)})</div>`:""}</div>
  <div class="card"><b>Step 3 · Start learning</b><div class="hi">Once verified, the full course unlocks automatically on this account.</div></div>`;
  $("#payReq").onsubmit=submitPayment;
}
async function submitPayment(e){
  e.preventDefault(); const st=$("#prStatus"); const {db,doc,setDoc,serverTimestamp}=S.fb;
  const utr=$("#prUtr").value.trim(); if(utr.length<6){st.textContent="Enter the full reference number.";return}
  st.textContent="Submitting…";
  try{
    await setDoc(doc(db,"payments",S.user.uid),{uid:S.user.uid,name:(S.user.displayName||"").slice(0,80),email:(S.user.email||"").slice(0,120),
      phone:$("#prPhone").value.trim().slice(0,15),utr:utr.slice(0,40),amount:String($("#prAmt").value||"").slice(0,10),status:"pending",createdAt:serverTimestamp()});
    toast("Submitted — we'll verify and unlock soon");
  }catch(err){st.textContent="Could not submit: "+errMsg(err)}
}

/* =================== owner: upload =================== */
const upFile=$("#upFile");
if(!USE_STORAGE){const r=document.querySelector('input[name="src"][value="upload"]');r.closest("label").style.display="none";document.querySelector('input[name="src"][value="youtube"]').checked=true;$("#srcUpload").style.display="none";$("#srcLink").style.display="block";
  $("#srcLink").insertAdjacentHTML("beforeend",`<p class="hi" style="margin-top:6px">Videos: upload to YouTube as <b>Unlisted</b> and paste the link. PDFs: choose "Other link", paste a Google Drive link (Share → Anyone with the link).</p>`)}
document.querySelectorAll('input[name="src"]').forEach(r=>r.onchange=()=>{const v=document.querySelector('input[name="src"]:checked').value;$("#srcUpload").style.display=v==="upload"?"block":"none";$("#srcLink").style.display=v==="upload"?"none":"block";if(v==="youtube")$("#upKind").value="video"});
upFile.onchange=()=>{const f=upFile.files[0],d=$("#drop");if(!f){d.classList.remove("has");return}d.classList.add("has");
  $("#dropTxt").innerHTML=`<b>${esc(f.name)}</b><br><span class="hi">${fmtSize(f.size)}${f.size>MAX_UPLOAD_MB*1048576?` — too large (max ${MAX_UPLOAD_MB} MB)`:""}</span>`;
  if(!$("#upTitle").value)$("#upTitle").value=f.name.replace(/\.[^.]+$/,"").replace(/[_-]+/g," ")};
$("#upForm").onsubmit=async e=>{
  e.preventDefault(); if(!S.isOwner) return;
  const {db,doc,collection,setDoc,serverTimestamp,storage,ref,uploadBytesResumable}=S.fb;
  const st=$("#upStatus"),btn=$("#upBtn"),bar=$("#upBar");
  const src=document.querySelector('input[name="src"]:checked').value, free=$("#upFree").checked;
  let type,loc={},sizeBytes=0,source=src;
  if(src==="upload"){
    const f=upFile.files[0]; if(!f){st.textContent="Choose a file first.";return}
    const isV=f.type.startsWith("video/"),isP=f.type==="application/pdf"||/\.pdf$/i.test(f.name);
    if(!isV&&!isP){st.textContent="Only video or PDF files.";return}
    if(f.size>MAX_UPLOAD_MB*1048576){st.textContent=`Max ${MAX_UPLOAD_MB} MB per file.`;return}
    type=isV?"video":"pdf"; sizeBytes=f.size;
    btn.disabled=true; bar.style.display="block"; st.textContent="Uploading… keep this page open.";
    const path=`${free?"free":"premium"}/${Date.now()}_${f.name.replace(/[^\w.\-]+/g,"_").slice(-80)}`;
    try{
      await new Promise((res,rej)=>{const t=uploadBytesResumable(ref(storage,path),f,{contentType:f.type||(isP?"application/pdf":"video/mp4")});
        t.on("state_changed",s=>{const pc=s.bytesTransferred/s.totalBytes*100;bar.firstElementChild.style.width=pc+"%";st.textContent=`Uploading… ${pc.toFixed(0)}%`},rej,res)});
      loc={storagePath:path};
    }catch(err){st.textContent="Upload failed: "+errMsg(err);btn.disabled=false;bar.style.display="none";return}
  }else{
    const u=$("#upUrl").value.trim();
    if(!safeUrl(u)){st.textContent="Paste a full https:// link.";return}
    if(src==="youtube"&&!ytId(u)){st.textContent="That doesn't look like a YouTube video link.";return}
    type=src==="youtube"?"video":$("#upKind").value; loc={url:u}; btn.disabled=true;
  }
  try{
    const mref=doc(collection(db,"materials"));
    const body={title:$("#upTitle").value.trim().slice(0,160)||"Untitled",desc:$("#upDesc").value.trim().slice(0,400),topic:$("#upTopic").value,exam:$("#upExam").value,
      type,free,source,sizeBytes,createdAt:serverTimestamp()};
    if(free) Object.assign(body,loc); else await setDoc(doc(db,"premium",mref.id),loc);
    await setDoc(mref,body);
    toast(free?"Published as free preview":"Published — unlocked for paid students");
    $("#upForm").reset();$("#drop").classList.remove("has");$("#dropTxt").innerHTML=`<b>Tap to choose a file</b><br><span class="hi">MP4 video or PDF notes</span>`;
    if(USE_STORAGE){$("#srcUpload").style.display="block";$("#srcLink").style.display="none"}else{document.querySelector('input[name="src"][value="youtube"]').checked=true}st.textContent="";
  }catch(err){st.textContent="Could not publish: "+errMsg(err)}
  btn.disabled=false; bar.style.display="none"; bar.firstElementChild.style.width="0";
};

/* =================== owner: payments & students =================== */
function renderRequests(){
  $("#reqCount").textContent=S.requests.length?`(${S.requests.length})`:"";
  $("#reqList").innerHTML=S.requests.length?S.requests.map(r=>`<div class="card"><div class="spread"><b>${esc(r.name||"Student")}</b><span class="pill">₹${esc(r.amount||"—")}</span></div>
    <div class="hi" style="margin:4px 0 8px">${esc(r.email)}${r.phone?" · "+esc(r.phone):""}<br>UPI ref: <b style="color:var(--ink)">${esc(r.utr)}</b> · ${fmtDate(r.createdAt)}</div>
    <div class="row"><button class="btn sm alt" data-approve="${esc(r.id)}">✅ Approve</button><button class="btn sm danger" data-reject="${esc(r.id)}">Reject</button></div></div>`).join("")
    :`<div class="empty"><div class="big">💸</div>No payments waiting.</div>`;
  renderPremium();
}
function renderStudents(){
  $("#stuList").innerHTML=S.students.length?S.students.map(s=>`<div class="item"><div class="thumb p">⭐</div><div class="meta"><b>${esc(s.name||"Student")}</b>
   <small>${esc(s.email||"")}${s.phone?" · "+esc(s.phone):""}<br>₹${esc(s.amount||"—")}${s.utr?" · Ref "+esc(s.utr):""} · ${fmtDate(s.approvedAt)}</small></div>
   <button class="btn sm danger" data-revoke="${esc(s.id)}">Remove</button></div>`).join(""):`<div class="empty">No paid students yet.</div>`;
  renderPremium();
}
document.addEventListener("click",e=>{
  const a=e.target.closest("[data-approve]"),r=e.target.closest("[data-reject]"),v=e.target.closest("[data-revoke]");
  if(!S.fb||!S.isOwner)return; const {db,doc,setDoc,updateDoc,deleteDoc,serverTimestamp}=S.fb;
  if(a){const q=S.requests.find(x=>x.id===a.dataset.approve);if(!q)return;
    askConfirm(`Approve ${q.name||"this student"} (₹${q.amount||"?"}, ref ${q.utr})? Only approve after the money shows in your account.`,"Approve",async()=>{
      try{await setDoc(doc(db,"access",q.id),{name:q.name||"",email:q.email||"",phone:q.phone||"",amount:q.amount||"",utr:q.utr||"",approvedAt:serverTimestamp()});
        await updateDoc(doc(db,"payments",q.id),{status:"approved"});toast("Approved — course unlocked")}catch(err){toast("Failed: "+errMsg(err))}})}
  if(r){const q=S.requests.find(x=>x.id===r.dataset.reject);if(!q)return;
    askConfirm(`Reject payment ref ${q.utr} from ${q.name||"this student"}?`,"Reject",async()=>{try{await updateDoc(doc(db,"payments",q.id),{status:"rejected"});toast("Rejected")}catch(err){toast("Failed: "+errMsg(err))}})}
  if(v){const s=S.students.find(x=>x.id===v.dataset.revoke);if(!s)return;
    askConfirm(`Remove access for ${s.name||"this student"}? Their premium content locks again.`,"Remove",async()=>{try{await deleteDoc(doc(db,"access",s.id));toast("Access removed")}catch(err){toast("Failed: "+errMsg(err))}})}
});

/* =================== owner: settings =================== */
$("#payForm").onsubmit=async e=>{
  e.preventDefault(); if(!S.isOwner) return; const st=$("#payStatus");
  const link=$("#pLink").value.trim();
  if(link&&!safeUrl(link)){st.textContent="Payment link must start with https://";return}
  const body={price:String($("#pPrice").value||"").slice(0,10),upi:$("#pUpi").value.trim().slice(0,80),name:$("#pName").value.trim().slice(0,80),link:link.slice(0,300),
    whatsapp:$("#pWa").value.replace(/\D/g,"").slice(0,15),note:$("#pNote").value.trim().slice(0,300)};
  try{await S.fb.setDoc(S.fb.doc(S.fb.db,"config","pay"),body);st.textContent="";toast("Settings saved")}catch(err){st.textContent="Could not save: "+errMsg(err)}
};
function fillPayForm(){if(!S.isOwner)return;if(document.activeElement?.closest?.("#payForm"))return;const c=S.payCfg;
  $("#pPrice").value=c.price||"";$("#pUpi").value=c.upi||"";$("#pName").value=c.name||"";$("#pLink").value=c.link||"";$("#pWa").value=c.whatsapp||"";$("#pNote").value=c.note||""}

/* =================== owner: questions =================== */
$("#qOpts").innerHTML=[0,1,2,3].map(i=>`<div class="row" style="margin-bottom:6px"><input type="radio" name="qAns" value="${i}" ${i===0?"checked":""} aria-label="Correct option ${"ABCD"[i]}" style="width:20px;height:20px;accent-color:var(--green)"><input class="in" id="qO${i}" required placeholder="Option ${"ABCD"[i]}" style="flex:1"></div>`).join("");
$("#qForm").onsubmit=async e=>{
  e.preventDefault(); if(!S.isOwner) return; const st=$("#qStatus");
  const body={topic:$("#qTopic").value,q:$("#qText").value.trim().slice(0,500),options:[0,1,2,3].map(i=>$("#qO"+i).value.trim().slice(0,200)),
    ans:+document.querySelector('input[name="qAns"]:checked').value,exp:$("#qExp").value.trim().slice(0,600),createdAt:S.fb.serverTimestamp()};
  try{await S.fb.addDoc(S.fb.collection(S.fb.db,"questions"),body);$("#qForm").reset();st.textContent="";toast("Question added")}catch(err){st.textContent="Could not add: "+errMsg(err)}
};
function renderQList(){
  $("#qList").innerHTML=S.questions.length?S.questions.map(q=>`<div class="card"><span class="pill">${esc(q.topic)}</span><div class="q">${esc(q.q)}</div><div class="hi">✔ ${esc(q.options?.[q.ans])}</div>
   <div style="margin-top:8px"><button class="btn sm danger" data-dq="${esc(q.id)}">Delete</button></div></div>`).join(""):`<div class="empty">No questions added yet. The ${BASE_QB.length} built-in questions are always included.</div>`;
}
document.addEventListener("click",e=>{const b=e.target.closest("[data-dq]");if(b&&S.isOwner)askConfirm("Delete this question?","Delete",async()=>{try{await S.fb.deleteDoc(S.fb.doc(S.fb.db,"questions",b.dataset.dq))}catch(err){toast("Failed: "+errMsg(err))}})});

/* =================== render all =================== */
function renderAll(){renderLibrary("videos");renderLibrary("pdfs");renderMine();renderStats();renderNotices();renderPremium();setRole();renderAcct();if($("#v-unlock").classList.contains("on"))renderUnlock()}

/* =================== practice =================== */
const QB=()=>BASE_QB.concat(S.questions.filter(q=>Array.isArray(q.options)&&q.options.length===4).map(q=>[q.topic,q.q,q.options,q.ans,q.exp||""]));
let pTopic="All",pIdx=0,pAns=null;
const pList=()=>pTopic==="All"?QB():QB().filter(q=>q[0]===pTopic);
function renderPracticeChips(){const ts=["All",...TOPICS.filter(t=>QB().some(q=>q[0]===t))];
  $("#cPractice").innerHTML=ts.map(t=>`<button class="chip ${t===pTopic?"on":""}" data-pt="${esc(t)}">${esc(t)}</button>`).join("")}
function renderPractice(){
  const L=pList(); if(!L.length){$("#pCard").innerHTML=`<div class="empty">No questions in this topic yet.</div>`;return}
  if(pIdx>=L.length)pIdx=0; const q=L[pIdx];
  $("#pCard").innerHTML=`<div class="spread"><span class="pill">${esc(q[0])}</span><span class="hi">${pIdx+1} / ${L.length}</span></div>
   <div class="q">${esc(q[1])}</div>
   ${q[2].map((o,i)=>`<button class="opt ${pAns===null?"":i===q[3]?"ok":i===pAns?"no":""}" data-pa="${i}" ${pAns!==null?"disabled":""}>${"ABCD"[i]}. ${esc(o)}</button>`).join("")}
   ${pAns!==null?`<div class="exp">${pAns===q[3]?"✅ Correct! ":"❌ Correct answer: "+esc(q[2][q[3]])+". "}${esc(q[4])}</div>`:""}
   <div class="row" style="margin-top:12px;justify-content:space-between"><button class="btn sm ghost" data-pn="-1">← Prev</button><button class="btn sm" data-pn="1">Next →</button></div>`;
}
document.addEventListener("click",e=>{
  const t=e.target.closest("[data-pt]");if(t){pTopic=t.dataset.pt;pIdx=0;pAns=null;renderPracticeChips();renderPractice()}
  const a=e.target.closest("[data-pa]");if(a&&pAns===null){pAns=+a.dataset.pa;renderPractice()}
  const n=e.target.closest("[data-pn]");if(n){const L=pList();if(!L.length)return;pIdx=(pIdx+ +n.dataset.pn+L.length)%L.length;pAns=null;renderPractice()}
});
renderPracticeChips(); renderPractice();

/* =================== mock test =================== */
const mock={running:false,done:false,qs:[],ans:[],i:0,t:0,timer:null,neg:true,n:20};
function shuffle(a){a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}
const clock=s=>String(Math.floor(Math.max(s,0)/60)).padStart(2,"0")+":"+String(Math.max(s,0)%60).padStart(2,"0");
function renderMockStart(){
  const total=QB().length;
  $("#mockArea").innerHTML=`<div class="card"><b>Physical Education — Full mock</b><p class="hi" style="margin:6px 0 12px">Random questions from all units (${total} in the bank). 1 minute per question.</p>
  <label class="f" for="mN">Number of questions</label><select class="in" id="mN">${[10,20,30,50].filter(n=>n<=Math.max(total,10)).map(n=>`<option ${n===mock.n?"selected":""}>${n}</option>`).join("")}</select>
  <label class="chk" style="border:0;margin-top:6px"><input type="checkbox" id="mNeg" ${mock.neg?"checked":""}><span>Negative marking (−¼ per wrong answer)</span></label>
  <button class="btn alt" id="mStart" style="margin-top:8px">Start test</button></div>`;
  $("#mStart").onclick=startMock;
}
function startMock(){
  const bank=QB(); mock.n=Math.min(+$("#mN").value,bank.length); mock.neg=$("#mNeg").checked;
  mock.qs=shuffle(bank).slice(0,mock.n); mock.ans=Array(mock.n).fill(null); mock.i=0; mock.t=mock.n*60; mock.running=true; mock.done=false;
  clearInterval(mock.timer); mock.timer=setInterval(()=>{mock.t--;const el=$("#mT");if(el)el.textContent=clock(mock.t);if(mock.t<=0)finishMock()},1000);
  renderMock();
}
function renderMock(){
  const q=mock.qs[mock.i],a=mock.ans[mock.i],answered=mock.ans.filter(x=>x!==null).length;
  $("#mockArea").innerHTML=`<div class="card"><div class="spread"><span class="hi">Q ${mock.i+1} of ${mock.n} · answered ${answered}</span><span class="timer" id="mT">${clock(mock.t)}</span></div>
  <div class="bar" style="margin:10px 0"><i style="width:${(answered/mock.n)*100}%"></i></div>
  <div class="q">${esc(q[1])}</div>
  ${q[2].map((o,i)=>`<button class="opt ${a===i?"sel":""}" data-ma="${i}">${"ABCD"[i]}. ${esc(o)}</button>`).join("")}
  <div class="row" style="justify-content:space-between;margin-top:10px"><button class="btn sm ghost" data-mn="-1" ${mock.i===0?"disabled":""}>← Prev</button>
  ${mock.i<mock.n-1?`<button class="btn sm" data-mn="1">Next →</button>`:`<button class="btn sm alt" id="mSubmit">Submit test</button>`}</div></div>
  <div class="row">${mock.qs.map((_,i)=>`<button class="chip ${mock.ans[i]!==null?"on":""}" style="${i===mock.i?"outline:2px solid var(--orange)":""}" data-mj="${i}">${i+1}</button>`).join("")}</div>`;
  const s=$("#mSubmit"); if(s) s.onclick=()=>askConfirm("Submit the test now?","Submit",async()=>finishMock());
}
document.addEventListener("click",e=>{
  if(!mock.running)return;
  const a=e.target.closest("[data-ma]");if(a){const v=+a.dataset.ma;mock.ans[mock.i]=mock.ans[mock.i]===v?null:v;renderMock()}
  const n=e.target.closest("[data-mn]");if(n){mock.i=Math.max(0,Math.min(mock.n-1,mock.i+ +n.dataset.mn));renderMock()}
  const j=e.target.closest("[data-mj]");if(j){mock.i=+j.dataset.mj;renderMock()}
});
function finishMock(){
  if(!mock.running)return;
  clearInterval(mock.timer); mock.running=false; mock.done=true;
  let c=0,w=0; mock.qs.forEach((q,i)=>{if(mock.ans[i]===null)return; mock.ans[i]===q[3]?c++:w++});
  const score=c-(mock.neg?w*0.25:0), skip=mock.n-c-w;
  const h=LS.get("hist",[]); h.unshift({d:Date.now(),c,w,n:mock.n,s:score}); LS.set("hist",h.slice(0,20)); renderHist();
  $("#mockArea").innerHTML=`<div class="card res"><div class="hi">Your score</div><div class="score">${+score.toFixed(2)} / ${mock.n}</div>
   <div class="row" style="justify-content:center;margin:8px 0"><span class="pill">✅ ${c} correct</span><span class="pill" style="background:#fdecec;color:var(--red)">❌ ${w} wrong</span><span class="pill" style="background:#eee;color:#555">⏭ ${skip} skipped</span></div>
   <button class="btn alt" id="mAgain">Take another test</button></div><h2>Review answers</h2>
   ${mock.qs.map((q,i)=>`<div class="card"><div class="q">${i+1}. ${esc(q[1])}</div>${q[2].map((o,k)=>`<div class="opt ${k===q[3]?"ok":k===mock.ans[i]?"no":""}">${"ABCD"[k]}. ${esc(o)}</div>`).join("")}${q[4]?`<div class="exp">${esc(q[4])}</div>`:""}</div>`).join("")}`;
  $("#mAgain").onclick=()=>{mock.done=false;renderMockStart()};
  go("mock");
}
function renderHist(){const h=LS.get("hist",[]);$("#hist").innerHTML=h.length?h.slice(0,8).map(x=>`${fmtDate(x.d)} — <b>${+x.s.toFixed(2)}/${x.n}</b> (${x.c}✓ ${x.w}✗)`).join("<br>"):"No mock tests yet."}
renderHist();

/* =================== syllabus =================== */
function renderSyl(openUnit){
  const done=LS.get("syl",{}); let tot=0,dn=0;
  $("#sylList").innerHTML=Object.entries(SYL).map(([u,items])=>{
    const k=items.filter((_,i)=>done[u+"|"+i]).length; tot+=items.length; dn+=k;
    return `<details ${u===openUnit?"open":""} style="border-bottom:1px solid var(--line);padding:6px 0"><summary class="spread" style="cursor:pointer;padding:6px 0;list-style:none"><b style="font-size:.92rem">${esc(u)}</b><span class="pill">${k}/${items.length}</span></summary>
    ${items.map((it,i)=>`<label class="chk ${done[u+"|"+i]?"done":""}"><input type="checkbox" data-syl="${esc(u+"|"+i)}" ${done[u+"|"+i]?"checked":""}><span>${esc(it)}</span></label>`).join("")}</details>`;
  }).join("");
  const p=tot?Math.round(dn/tot*100):0; $("#sylPct").textContent=p+"%"; $("#sylBar").style.width=p+"%"; $("#sSyl").textContent=p+"%";
}
document.addEventListener("change",e=>{const c=e.target.closest("[data-syl]");if(c){const d=LS.get("syl",{});c.checked?d[c.dataset.syl]=1:delete d[c.dataset.syl];LS.set("syl",d);renderSyl(c.dataset.syl.split("|")[0])}});
renderSyl();

/* =================== planner =================== */
function renderTasks(){const t=LS.get("tasks",[]);
  $("#taskList").innerHTML=t.length?t.map((x,i)=>`<label class="chk ${x.d?"done":""}"><input type="checkbox" data-tk="${i}" ${x.d?"checked":""}><span>${esc(x.t)}</span><button class="x" data-tx="${i}" type="button" aria-label="Remove">×</button></label>`).join(""):`<div class="hi" style="padding:8px 0">No targets yet — add what you'll study today.</div>`}
$("#taskForm").onsubmit=e=>{e.preventDefault();const v=$("#taskIn").value.trim();if(!v)return;const t=LS.get("tasks",[]);t.push({t:v.slice(0,200),d:0});LS.set("tasks",t);$("#taskIn").value="";renderTasks()};
document.addEventListener("change",e=>{const c=e.target.closest("[data-tk]");if(c){const t=LS.get("tasks",[]);t[+c.dataset.tk].d=c.checked?1:0;LS.set("tasks",t);renderTasks()}});
document.addEventListener("click",e=>{const x=e.target.closest("[data-tx]");if(x){e.preventDefault();const t=LS.get("tasks",[]);t.splice(+x.dataset.tx,1);LS.set("tasks",t);renderTasks()}});
renderTasks();

/* =================== Firebase =================== */
async function signIn(){
  if(!S.fb){toast("Sign-in isn't set up yet");return}
  const {auth,GoogleAuthProvider,signInWithPopup,signInWithRedirect}=S.fb;
  const p=new GoogleAuthProvider(); p.setCustomParameters({prompt:"select_account"});
  try{await signInWithPopup(auth,p)}
  catch(err){ if(["auth/popup-blocked","auth/operation-not-supported-in-this-environment","auth/cancelled-popup-request"].includes(err.code)) await signInWithRedirect(auth,p);
    else if(err.code!=="auth/popup-closed-by-user") toast("Sign-in failed: "+errMsg(err)); }
}

function clearUserListeners(){unsubs.forEach(u=>{try{u()}catch(e){}});unsubs=[]}

async function onUser(user){
  const F=S.fb; clearUserListeners();
  S.user=user; S.isOwner=false; S.paid=false; S.premium={}; S.myPayment=null; S.requests=[]; S.students=[];
  if(user){
    // Owner check: only the owner can read admin/ping (enforced by firestore.rules, so no email is stored in this public code)
    try{ await F.getDoc(F.doc(F.db,"admin","ping")); S.isOwner=true; }catch(e){ S.isOwner=false; }
    // remember the student (profile)
    if(!S.isOwner){ try{ await F.setDoc(F.doc(F.db,"users",user.uid),{name:(user.displayName||"").slice(0,80),email:(user.email||"").slice(0,120),lastSeen:F.serverTimestamp()},{merge:true}); }catch(e){} }
    const subPremium=()=>unsubs.push(F.onSnapshot(F.collection(F.db,"premium"),s=>{S.premium={};s.docs.forEach(d=>S.premium[d.id]=d.data());renderAll()},()=>{}));
    if(S.isOwner){
      subPremium(); fillPayForm();
      unsubs.push(F.onSnapshot(F.query(F.collection(F.db,"payments"),F.where("status","==","pending")),s=>{S.requests=s.docs.map(d=>({id:d.id,...d.data()})).sort((a,b)=>tsMs(b.createdAt)-tsMs(a.createdAt));renderRequests()},()=>{}));
      unsubs.push(F.onSnapshot(F.collection(F.db,"access"),s=>{S.students=s.docs.map(d=>({id:d.id,...d.data()})).sort((a,b)=>tsMs(b.approvedAt)-tsMs(a.approvedAt));renderStudents()},()=>{}));
    }else{
      let premUnsub=null;
      unsubs.push(F.onSnapshot(F.doc(F.db,"access",user.uid),s=>{
        const was=S.paid; S.paid=s.exists();
        if(S.paid&&!premUnsub){subPremium();premUnsub=unsubs[unsubs.length-1]; if(!was&&S.dbReady)toast("🎉 Payment verified — full course unlocked!")}
        if(!S.paid&&premUnsub){premUnsub();premUnsub=null;S.premium={}}
        renderAll();
      },()=>{}));
      unsubs.push(F.onSnapshot(F.doc(F.db,"payments",user.uid),s=>{S.myPayment=s.exists()?s.data():null;if($("#v-unlock").classList.contains("on"))renderUnlock()},()=>{}));
    }
  }
  renderAll(); renderRequests(); renderStudents(); renderQList();
  if(!S.isOwner && $("#v-owner").classList.contains("on")) go("home");
}

async function initFirebase(){
  if(!firebaseConfig.apiKey||firebaseConfig.apiKey.startsWith("PASTE")){ $("#setupMsg").style.display="block"; S.dbReady=true; renderAll(); return; }
  try{
    const [app,auth,fs,st]=await Promise.all([import(FB+"firebase-app.js"),import(FB+"firebase-auth.js"),import(FB+"firebase-firestore.js"),import(FB+"firebase-storage.js")]);
    const fbApp=app.initializeApp(firebaseConfig);
    S.fb={...auth,...fs,...st,auth:auth.getAuth(fbApp),db:fs.getFirestore(fbApp),storage:st.getStorage(fbApp)};
  }catch(err){ console.error(err); $("#setupMsg").style.display="block"; $("#setupMsg").innerHTML="<b>Couldn't connect.</b> Check your internet connection and the values in config.js."; S.dbReady=true; renderAll(); return; }
  const F=S.fb;
  F.getRedirectResult(F.auth).catch(()=>{});
  // public data
  F.onSnapshot(F.query(F.collection(F.db,"materials"),F.orderBy("createdAt","desc")),s=>{S.materials=s.docs.map(d=>({id:d.id,...d.data()}));S.dbReady=true;renderAll()},err=>{console.error(err);S.dbReady=true;renderAll()});
  F.onSnapshot(F.query(F.collection(F.db,"notices"),F.orderBy("createdAt","desc"),F.limit(10)),s=>{S.notices=s.docs.map(d=>({id:d.id,...d.data()}));renderNotices()},()=>{});
  F.onSnapshot(F.doc(F.db,"config","pay"),s=>{S.payCfg=s.exists()?s.data():{};fillPayForm();renderPremium();if($("#v-unlock").classList.contains("on"))renderUnlock()},()=>{});
  F.onSnapshot(F.query(F.collection(F.db,"questions"),F.orderBy("createdAt","desc")),s=>{S.questions=s.docs.map(d=>({id:d.id,...d.data()}));renderPracticeChips();renderPractice();renderQList()},()=>{});
  F.onAuthStateChanged(F.auth,u=>onUser(u));
}

renderAll(); renderQList();
initFirebase();
if("serviceWorker" in navigator && location.protocol==="https:") navigator.serviceWorker.register("sw.js").catch(()=>{});
