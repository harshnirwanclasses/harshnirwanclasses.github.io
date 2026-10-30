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
  materials:[], premium:{}, notices:[], payCfg:{}, qrImg:null, myPayment:null, courses:[], access:null, myPayments:{}, selCourse:null,
  requests:[], students:[], questions:[], dbReady:false
};
let unsubs=[];   // listeners that depend on the signed-in user
const filt={videos:"All",pdfs:"All"};
const LEGACY="full";
const itemCourses=m=>Array.isArray(m.courses)&&m.courses.length?m.courses:[LEGACY];
const accessAll=a=>!!a&&(a.all===true||!("courses" in a));
function hasCourse(cs){if(S.isOwner)return true;const a=S.access;if(!a)return false;if(accessAll(a))return true;return cs.some(c=>a.courses&&a.courses[c])}
const isOpen=m=>m.free||hasCourse(itemCourses(m));
const hasAccess=()=>S.isOwner||!!S.access;
function courseList(){
  if(S.courses.length)return S.courses.slice().sort((x,y)=>(x.all?1:0)-(y.all?1:0)||(+x.price||0)-(+y.price||0));
  return [{id:LEGACY,name:"Full Course",price:S.payCfg.price||"",desc:S.payCfg.note||"",all:true}];
}
function courseById(id){return courseList().find(c=>c.id===id)||(id===LEGACY?{id:LEGACY,name:"Full Course",price:S.payCfg.price||"",all:true}:null)}
function ownsCourse(c){if(S.isOwner)return true;const a=S.access;if(!a)return false;if(accessAll(a))return true;if(c.all)return false;return !!(a.courses&&a.courses[c.id])}
const courseNames=ids=>ids.map(id=>courseById(id)?.name).filter(Boolean);
document.addEventListener("click",e=>{const b=e.target.closest("[data-course]");if(b)S.selCourse=b.dataset.course},true);

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
  else if(S.access) rb.innerHTML=`⭐ <b>Premium</b> · ${esc(S.user?.displayName||"Student")}`;
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
  const banner=locked?`<div class="premium" style="padding:12px"><div class="spread"><span>🔒 <b>${locked} locked</b> — buy a course to unlock</span><button class="btn sm alt" data-go="unlock">View courses</button></div></div>`:"";
  if(!all.length){el.innerHTML=`<div class="empty"><div class="big">${type==="video"?"🎬":"📄"}</div><b>No ${type==="video"?"videos":"PDF notes"} yet</b><br><span class="hi">${S.isOwner?"Open the Owner tab to add your first one.":"New classes will appear here soon."}</span></div>`;return}
  el.innerHTML=banner+(list.length?list.map(m=>itemHTML(m)).join(""):`<div class="empty">Nothing matches.</div>`);
}
function itemHTML(m,own){
  const v=m.type==="video",open=isOpen(m);
  return `<div class="item"><div class="thumb ${open?(v?"v":"p"):"l"}">${open?(v?"▶️":"📄"):"🔒"}</div><div class="meta"><b>${esc(m.title)}</b>
  ${m.desc?`<small>${esc(m.desc)}</small><br>`:""}${m.source==="html"?`<span class="tag">HTML</span>`:m.source==="pdf"?`<span class="tag">PDF</span>`:""}${m.free?`<span class="tag f">FREE</span>`:courseNames(itemCourses(m)).map(n=>`<span class="tag c">${esc(n)}</span>`).join("")}<span class="tag">${esc(m.topic)}</span>
  <small> ${fmtSize(m.sizeBytes)}${m.sizeBytes?" · ":""}${fmtDate(m.createdAt)}</small></div>
  <div style="display:flex;flex-direction:column;gap:6px">${open?`<button class="btn sm" data-open="${esc(m.id)}">${v?"Watch":"Open"}</button>`:`<button class="btn sm alt" data-go="unlock" data-course="${esc(itemCourses(m)[0])}">🔒 Unlock</button>`}
  ${own&&!m.free&&S.courses.length?`<button class="btn sm ghost" data-editc="${esc(m.id)}">Courses</button>`:""}${own?`<button class="btn sm danger" data-del="${esc(m.id)}">Delete</button>`:""}</div></div>`;
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
  let loc=m.free?m:S.premium[id];
  if(!loc){try{const s=await S.fb.getDoc(S.fb.doc(S.fb.db,"premium",id));if(s.exists()){loc=s.data();S.premium[id]=loc}}catch(e){}}
  if(!loc){toast("This lesson is locked for your account");go("unlock");return}
  $("#mTitle").textContent=m.title;
  $("#mBody").innerHTML=`<div class="empty">⏳ Opening…</div>`; $("#modal").classList.add("on");
  try{
    if(loc.pdfDoc){
      const {getDoc,doc,db}=S.fb; const meta=await getDoc(doc(db,"pdfchunks",id));
      if(!meta.exists()){$("#mBody").innerHTML=`<div class="empty">This PDF isn't available.</div>`;return}
      const n=meta.data().parts||0; $("#mBody").innerHTML=`<div class="empty">⏳ Loading PDF… 0/${n}</div>`; let got=0;
      const parts=await Promise.all(Array.from({length:n},(_,i)=>getDoc(doc(db,"pdfchunks",id,"parts",String(i))).then(s=>{got++;const e=$("#mBody .empty");if(e)e.textContent=`⏳ Loading PDF… ${got}/${n}`;return b64ToBytes(s.data().d)})));
      const total=parts.reduce((t,p)=>t+p.length,0),bytes=new Uint8Array(total);let o=0;parts.forEach(p=>{bytes.set(p,o);o+=p.length});
      $("#mBody").innerHTML=`<div class="pdfv" id="pdfBox"><div class="empty">⏳ Opening…</div></div>${m.free?`<div style="margin-top:10px"><a class="btn sm ghost" id="pdfDl">⬇ Download</a></div>`:""}${m.desc?`<p class="hi" style="margin-top:8px">${esc(m.desc)}</p>`:""}`;
      if(m.free){const u=URL.createObjectURL(new Blob([bytes],{type:"application/pdf"}));const dl=$("#pdfDl");dl.href=u;dl.download=(m.title||"notes").replace(/[^\w\- ]+/g,"")+".pdf"}
      await renderPdf(bytes.slice(),$("#pdfBox"));
      return;
    }
    if(loc.htmlDoc){
      const hs=await S.fb.getDoc(S.fb.doc(S.fb.db,"htmlnotes",id));
      if(!hs.exists()){$("#mBody").innerHTML=`<div class="empty">This document isn't available.</div>`;return}
      const htmlText=hs.data().html||"";
      $("#mBody").innerHTML=`<iframe sandbox="allow-scripts allow-popups allow-forms" style="height:78vh;background:#fff" title="${esc(m.title)}"></iframe><div style="margin-top:10px"><button class="btn sm ghost" id="fsBtn">⛶ Full screen</button></div>`;
      const fr=$("#mBody iframe"); fr.srcdoc=htmlText;
      $("#fsBtn").onclick=()=>{(fr.requestFullscreen?fr.requestFullscreen():Promise.reject()).catch(()=>toast("Full screen not supported here"))};
      if(m.desc)$("#mBody").insertAdjacentHTML("beforeend",`<p class="hi" style="margin-top:8px">${esc(m.desc)}</p>`);
      return;
    }
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
      if(m.source==="html"){try{await deleteDoc(doc(db,"htmlnotes",id))}catch(e){}}
      if(m.source==="pdf"){try{const md=await S.fb.getDoc(doc(db,"pdfchunks",id));const n=md.exists()?md.data().parts||0:0;for(let i=0;i<n;i++)await deleteDoc(doc(db,"pdfchunks",id,"parts",String(i)));await deleteDoc(doc(db,"pdfchunks",id))}catch(e){}}
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
  const pc=$("#premiumCard"),cl=courseList(),prices=cl.map(c=>+c.price).filter(x=>x>0),minP=prices.length?Math.min(...prices):0;
  if(S.isOwner){pc.innerHTML=`<div class="premium ok"><div class="spread"><div><b>Paid students: ${S.students.length}</b><div class="hi">${S.courses.length?`${S.courses.length} course(s)`:`Course price ₹${esc(S.payCfg.price||"—")}`}${S.requests.length?` · <b style="color:var(--orange)">${S.requests.length} payment(s) to check</b>`:""}</div></div><button class="btn sm" data-go="owner">Manage</button></div></div>`;return}
  const a=S.access;
  if(a&&accessAll(a)){pc.innerHTML=`<div class="premium ok"><b>⭐ All courses unlocked</b><div class="hi">सभी वीडियो और नोट्स उपलब्ध हैं — everything is open for you.</div></div>`;return}
  if(a){const mine=courseList().filter(c=>ownsCourse(c)).map(c=>c.name);const more=courseList().some(c=>!ownsCourse(c));
    pc.innerHTML=`<div class="premium ok"><div class="spread"><div><b>⭐ Your courses</b><div class="hi">${esc(mine.join(" · ")||"Unlocked")}</div></div>${more?`<button class="btn sm ghost" data-go="unlock">More courses</button>`:""}</div></div>`;return}
  pc.innerHTML=`<div class="premium"><div class="spread"><div><b>🔒 Unlock ${cl.length>1?"a course":"full course"}</b><div class="hi">Video lectures + PDF notes${minP?` · <b style="color:var(--orange)">${cl.length>1?"from ":""}₹${minP}</b>`:""}</div></div><button class="btn sm alt" data-go="unlock">${cl.length>1?"View courses":"Unlock"}</button></div></div>`;
}
function courseCards(selId,interactive){
  return courseList().map(c=>{const owned=!S.isOwner&&ownsCourse(c),p=S.myPayments[c.id],on=c.id===selId;
    const badge=owned?`<span class="pill">✓ Unlocked</span>`:p&&p.status==="pending"?`<span class="pill o">⏳ Verifying</span>`:p&&p.status==="rejected"?`<span class="pill r">Not verified</span>`:c.all&&courseList().length>1?`<span class="pill o">Best value</span>`:"";
    return `<label class="ccard ${on?"on":""} ${owned?"owned":""}">${interactive?`<input type="radio" name="course" value="${esc(c.id)}" ${on?"checked":""}>`:""}
      <div class="spread" style="align-items:flex-start"><div><b>${esc(c.name)}</b> ${badge}${c.desc?`<div class="hi" style="margin-top:2px">${esc(c.desc)}</div>`:""}${c.all&&!c.desc&&courseList().length>1?`<div class="hi" style="margin-top:2px">Includes every course & lesson</div>`:""}</div><div class="cp">${c.price?`₹${esc(c.price)}`:"—"}</div></div></label>`}).join("");
}
function renderUnlock(){
  const el=$("#unlockArea"), c=S.payCfg;
  if(!S.fb){el.innerHTML=`<div class="card">Payments will open soon.</div>`;return}
  const cl=courseList();
  if(S.isOwner){el.innerHTML=`<div class="card">You're the owner — you have full access. This is how students see your courses:</div>`+courseCards(null,false);return}
  if(S.access&&accessAll(S.access)){el.innerHTML=`<div class="premium ok"><b>⭐ All courses unlocked</b><p class="hi">Everything is open. Happy studying!</p><div style="margin-top:8px"><button class="btn sm" data-go="videos">Go to videos</button></div></div>`;return}
  if(!cl.some(x=>+x.price>0)&&!c.upi){el.innerHTML=`<div class="card">Course fee details will be posted soon. Check the notice board.</div>`;return}
  let sel=courseById(S.selCourse);
  if(!sel||(!S.isOwner&&ownsCourse(sel)))sel=cl.find(x=>!ownsCourse(x))||cl[0];
  S.selCourse=sel.id;
  const head=`<div class="hi" style="margin-bottom:8px">${cl.length>1?"Choose a course · कोर्स चुनें":"Course fee"}</div>`+courseCards(sel.id,cl.length>1);
  if(!S.user){el.innerHTML=head+`<div class="card"><b>Step 1 · Sign in</b><div class="hi">Google account से साइन इन करें ताकि भुगतान के बाद आपका कोर्स खुल सके।</div><div style="margin-top:10px"><button class="btn" id="unlockSignIn">🔐 Sign in with Google</button></div></div>`;$("#unlockSignIn").onclick=signIn;bindCourseRadios();return}
  if(ownsCourse(sel)){el.innerHTML=head+`<div class="premium ok"><b>✓ You already have ${esc(sel.name)}</b><div style="margin-top:8px"><button class="btn sm" data-go="videos">Go to videos</button></div></div>`;bindCourseRadios();return}
  const price=sel.price||"";
  const p=S.myPayments[sel.id];
  const upiUrl=c.upi?`upi://pay?pa=${encodeURIComponent(c.upi)}&pn=${encodeURIComponent(c.name||"Harsh Nirwan Classes")}${price?`&am=${encodeURIComponent(price)}`:""}&cu=INR&tn=${encodeURIComponent(("HNC "+sel.name).slice(0,40))}`:"";
  const wa=String(c.whatsapp||"").replace(/\D/g,"");
  const waUrl=wa?`https://wa.me/${wa}?text=${encodeURIComponent(`Hello Harsh Nirwan Classes, I paid ₹${price} for ${sel.name}.\nName: ${S.user.displayName||""}\nEmail: ${S.user.email||""}\nUPI ref: ${p?.utr||""}`)}`:"";
  let status="";
  if(p&&p.status==="pending") status=`<div class="notice">⏳ <b>Payment submitted for ${esc(sel.name)}</b> (ref ${esc(p.utr)}). It will unlock automatically once verified — usually within a few hours.<small>भुगतान जाँच के बाद कोर्स अपने आप खुल जाएगा</small></div>`;
  if(p&&p.status==="rejected") status=`<div class="notice" style="border-color:var(--red);background:rgba(255,90,90,.1)">❌ We couldn't find this payment (ref ${esc(p.utr)}). Check the reference number and submit again, or contact us on WhatsApp.</div>`;
  el.innerHTML=head+status+`
  <div class="card"><b>Step 1 · Pay ${price?`₹${esc(price)}`:""} for ${esc(sel.name)}</b><div class="hi">PhonePe / Google Pay / Paytm से भुगतान करें</div>
   ${(S.qrImg||DEFAULT_QR||c.upi)?`<div class="qrwrap" style="text-align:center"><div class="qrbox" id="payQr"><div class="empty" style="padding:30px 0;color:#555">⏳</div></div>
     <div style="font-weight:700">Scan & pay ${price?`<span style="color:var(--gold)">₹${esc(price)}</span>`:""}</div>
     <div class="hi">Any UPI app · किसी भी UPI ऐप से स्कैन करें</div>
     <div class="hi" style="margin-top:6px">Paying from this same phone? Save the QR, then in your UPI app tap <b>Scan → Gallery</b>.</div>
     <div style="margin-top:8px"><a class="btn sm ghost" id="qrDl">⬇ Save QR to phone</a></div>
     ${c.upi?`<div class="hi" style="margin:12px 0 2px">— or pay to UPI ID —</div>`:""}</div>`:""}
   ${c.upi?`<div class="copyrow"><code>${esc(c.upi)}</code><button class="btn sm ghost" data-copy="${esc(c.upi)}">Copy</button></div>${c.name?`<div class="hi" style="margin-top:4px">Name: ${esc(c.name)}</div>`:""}
   <div class="row" style="margin-top:10px"><a class="btn sm" href="${esc(upiUrl)}">Open UPI app</a>${safeUrl(c.link)?`<a class="btn sm alt" href="${esc(c.link)}" target="_blank" rel="noopener">Pay online ↗</a>`:""}</div>`
   :safeUrl(c.link)?`<div style="margin-top:10px"><a class="btn sm alt" href="${esc(c.link)}" target="_blank" rel="noopener">Pay online ↗</a></div>`:""}</div>
  <div class="card"><b>Step 2 · Submit payment details</b><div class="hi">UPI app में दिख रहा 12-अंकों का UTR / Reference नंबर डालें</div>
   <form id="payReq"><label class="f" for="prUtr">UPI ref / UTR / transaction ID</label><input class="in" id="prUtr" required minlength="6" maxlength="40" value="${esc(p&&p.status!=="approved"?p.utr:"")}">
   <label class="f" for="prAmt">Amount paid (₹)</label><input class="in" id="prAmt" type="number" min="1" value="${esc(price)}">
   <label class="f" for="prPhone">Mobile number</label><input class="in" id="prPhone" type="tel" maxlength="15" value="${esc(p?.phone||"")}">
   <div class="row" style="margin-top:12px"><button class="btn alt">Submit for verification</button><span class="hi" id="prStatus"></span></div></form>
   ${waUrl?`<div class="hi" style="margin-top:10px">Faster? <a href="${esc(waUrl)}" target="_blank" rel="noopener" style="color:var(--green);font-weight:600">Send the screenshot on WhatsApp ↗</a> (+${esc(wa)})</div>`:""}</div>
  <div class="card"><b>Step 3 · Start learning</b><div class="hi">Once verified, ${esc(sel.name)} unlocks automatically on this account.</div></div>`;
  $("#payReq").onsubmit=submitPayment;
  bindCourseRadios();
  fillQr(upiUrl);
}
function bindCourseRadios(){document.querySelectorAll('#unlockArea input[name="course"]').forEach(r=>r.onchange=()=>{S.selCourse=r.value;renderUnlock()})}
async function submitPayment(e){
  e.preventDefault(); const st=$("#prStatus"); const {db,doc,setDoc,serverTimestamp}=S.fb;
  const utr=$("#prUtr").value.trim(); if(utr.length<6){st.textContent="Enter the full reference number.";return}
  st.textContent="Submitting…";
  try{
    const sel=courseById(S.selCourse)||courseList()[0];
    await setDoc(doc(db,"payments",S.user.uid+"_"+sel.id),{uid:S.user.uid,courseId:sel.id,courseName:String(sel.name||"").slice(0,80),name:(S.user.displayName||"").slice(0,80),email:(S.user.email||"").slice(0,120),
      phone:$("#prPhone").value.trim().slice(0,15),utr:utr.slice(0,40),amount:String($("#prAmt").value||"").slice(0,10),status:"pending",createdAt:serverTimestamp()});
    toast("Submitted — we'll verify and unlock soon");
  }catch(err){st.textContent="Could not submit: "+errMsg(err)}
}

/* =================== owner: upload =================== */
const upFile=$("#upFile");
if(!USE_STORAGE){const r=document.querySelector('input[name="src"][value="upload"]');r.closest("label").style.display="none";document.querySelector('input[name="src"][value="youtube"]').checked=true;$("#srcUpload").style.display="none";$("#srcLink").style.display="block";
  $("#srcLink").insertAdjacentHTML("beforeend",`<p class="hi" style="margin-top:6px">Videos: upload to YouTube as <b>Unlisted</b> and paste the link. PDFs: choose "Other link", paste a Google Drive link (Share → Anyone with the link).</p>`)}
function showSrc(){const v=document.querySelector('input[name="src"]:checked').value;$("#srcUpload").style.display=v==="upload"?"block":"none";$("#srcHtml").style.display=v==="html"?"block":"none";$("#srcPdf").style.display=v==="pdf"?"block":"none";$("#srcLink").style.display=(v==="youtube"||v==="link")?"block":"none";if(v==="youtube")$("#upKind").value="video"}
document.querySelectorAll('input[name="src"]').forEach(r=>r.onchange=showSrc);
const MAX_HTML=900*1024, MAX_PDF=15*1048576, CHUNK=600*1024;
$("#upPdf").onchange=()=>{const f=$("#upPdf").files[0],d=$("#dropP");if(!f){d.classList.remove("has");return}d.classList.add("has");
  $("#dropPTxt").innerHTML=`<b>${esc(f.name)}</b><br><span class="hi">${fmtSize(f.size)}${f.size>MAX_PDF?" — too large (max 15 MB)":""}</span>`;
  if(!$("#upTitle").value)$("#upTitle").value=f.name.replace(/\.[^.]+$/,"").replace(/[_-]+/g," ")};
function bytesToB64(u8){let s="";for(let i=0;i<u8.length;i+=32768)s+=String.fromCharCode.apply(null,u8.subarray(i,i+32768));return btoa(s)}
function b64ToBytes(b){const s=atob(b),u=new Uint8Array(s.length);for(let i=0;i<s.length;i++)u[i]=s.charCodeAt(i);return u}
let pdfjsP=null;
function loadPdfJs(){if(pdfjsP)return pdfjsP;pdfjsP=new Promise((res,rej)=>{const sc=document.createElement("script");sc.src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
  sc.onload=()=>{window.pdfjsLib.GlobalWorkerOptions.workerSrc="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";res(window.pdfjsLib)};sc.onerror=()=>{pdfjsP=null;rej(new Error("viewer failed to load"))};document.head.appendChild(sc)});return pdfjsP}
async function renderPdf(bytes,box){
  const lib=await loadPdfJs(); const pdf=await lib.getDocument({data:bytes}).promise; box.innerHTML="";
  const w=Math.min(box.clientWidth||700,900)-16, dpr=Math.min(window.devicePixelRatio||1,2);
  for(let n=1;n<=pdf.numPages;n++){ if(!box.isConnected)return; const pg=await pdf.getPage(n); const v1=pg.getViewport({scale:1}); const vp=pg.getViewport({scale:(w/v1.width)*dpr});
    const c=document.createElement("canvas"); c.width=vp.width; c.height=vp.height; box.appendChild(c); await pg.render({canvasContext:c.getContext("2d"),viewport:vp}).promise; }
}
$("#upHtml").onchange=()=>{const f=$("#upHtml").files[0],d=$("#dropH");if(!f){d.classList.remove("has");return}d.classList.add("has");
  $("#dropHTxt").innerHTML=`<b>${esc(f.name)}</b><br><span class="hi">${fmtSize(f.size)}${f.size>MAX_HTML?" — too large (max 900 KB)":""}</span>`;
  if(!$("#upTitle").value)$("#upTitle").value=f.name.replace(/\.[^.]+$/,"").replace(/[_-]+/g," ")};
upFile.onchange=()=>{const f=upFile.files[0],d=$("#drop");if(!f){d.classList.remove("has");return}d.classList.add("has");
  $("#dropTxt").innerHTML=`<b>${esc(f.name)}</b><br><span class="hi">${fmtSize(f.size)}${f.size>MAX_UPLOAD_MB*1048576?` — too large (max ${MAX_UPLOAD_MB} MB)`:""}</span>`;
  if(!$("#upTitle").value)$("#upTitle").value=f.name.replace(/\.[^.]+$/,"").replace(/[_-]+/g," ")};
$("#upForm").onsubmit=async e=>{
  e.preventDefault(); if(!S.isOwner) return;
  const {db,doc,collection,setDoc,serverTimestamp,storage,ref,uploadBytesResumable}=S.fb;
  const st=$("#upStatus"),btn=$("#upBtn"),bar=$("#upBar");
  const src=document.querySelector('input[name="src"]:checked').value, free=$("#upFree").checked;
  if(!free&&S.courses.some(c=>!c.all)&&!document.querySelector("#upCourses input:checked")){st.textContent="Choose at least one course, or tick Free preview.";return}
  let type,loc={},sizeBytes=0,source=src,pendingHtml=null,pendingPdf=null;
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
  }else if(src==="pdf"){
    const f=$("#upPdf").files[0]; if(!f){st.textContent="Choose a PDF first.";return}
    if(f.size>MAX_PDF){st.textContent="PDF is over 15 MB. Compress it (e.g. ilovepdf.com) and try again.";return}
    type="pdf"; sizeBytes=f.size; pendingPdf=new Uint8Array(await f.arrayBuffer()); btn.disabled=true;
  }else if(src==="html"){
    const f=$("#upHtml").files[0]; if(!f){st.textContent="Choose an HTML file first.";return}
    if(f.size>MAX_HTML){st.textContent="HTML file is over 900 KB. Remove large embedded images or split it.";return}
    const html=await f.text();
    if(new Blob([html]).size>MAX_HTML){st.textContent="HTML file is over 900 KB.";return}
    type="pdf"; sizeBytes=f.size; loc={htmlDoc:true}; pendingHtml=html; btn.disabled=true;
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
    if(!free){const cs=[...document.querySelectorAll("#upCourses input:checked")].map(i=>i.value);if(cs.length)body.courses=cs;}
    if(pendingHtml!==null) await setDoc(doc(db,"htmlnotes",mref.id),{html:pendingHtml});
    if(pendingPdf){ const parts=Math.ceil(pendingPdf.length/CHUNK); bar.style.display="block";
      for(let i=0;i<parts;i++){ st.textContent=`Uploading PDF… ${Math.round(i/parts*100)}%`; bar.firstElementChild.style.width=(i/parts*100)+"%";
        await setDoc(doc(db,"pdfchunks",mref.id,"parts",String(i)),{d:bytesToB64(pendingPdf.subarray(i*CHUNK,(i+1)*CHUNK))}); }
      await setDoc(doc(db,"pdfchunks",mref.id),{parts,size:pendingPdf.length}); loc={pdfDoc:true}; }
    if(free) Object.assign(body,loc); else await setDoc(doc(db,"premium",mref.id),loc);
    await setDoc(mref,body);
    toast(free?"Published as free preview":"Published — unlocked for paid students");
    document.querySelectorAll("#upCourses input").forEach(i=>{i.checked=false});
    $("#upForm").reset();$("#drop").classList.remove("has");$("#dropTxt").innerHTML=`<b>Tap to choose a file</b><br><span class="hi">MP4 video or PDF notes</span>`;
    if(!USE_STORAGE)document.querySelector('input[name="src"][value="youtube"]').checked=true;showSrc();$("#dropP").classList.remove("has");$("#dropPTxt").innerHTML=`<b>Tap to choose a PDF</b><br><span class="hi">Up to 15 MB</span>`;$("#dropH").classList.remove("has");$("#dropHTxt").innerHTML=`<b>Tap to choose an HTML file</b><br><span class="hi">Notes, tables, quizzes — up to 900 KB.</span>`;st.textContent="";
  }catch(err){st.textContent="Could not publish: "+errMsg(err)}
  btn.disabled=false; bar.style.display="none"; bar.firstElementChild.style.width="0";
};

/* =================== owner: payments & students =================== */
function renderRequests(){
  $("#reqCount").textContent=S.requests.length?`(${S.requests.length})`:"";
  $("#reqList").innerHTML=S.requests.length?S.requests.map(r=>`<div class="card"><div class="spread"><b>${esc(r.name||"Student")}</b><span class="pill">₹${esc(r.amount||"—")}</span></div><div style="margin-top:4px"><span class="tag c">${esc(r.courseName||courseById(r.courseId||LEGACY)?.name||"Full Course")}</span>${(()=>{const c=courseById(r.courseId||LEGACY);return c&&c.price&&r.amount&&+r.amount<+c.price?`<span class="tag" style="background:rgba(255,90,90,.14);color:#ff9a9a">Less than ₹${esc(c.price)}</span>`:""})()}</div>
    <div class="hi" style="margin:4px 0 8px">${esc(r.email)}${r.phone?" · "+esc(r.phone):""}<br>UPI ref: <b style="color:var(--ink)">${esc(r.utr)}</b> · ${fmtDate(r.createdAt)}</div>
    <div class="row"><button class="btn sm alt" data-approve="${esc(r.id)}">✅ Approve</button><button class="btn sm danger" data-reject="${esc(r.id)}">Reject</button></div></div>`).join("")
    :`<div class="empty"><div class="big">💸</div>No payments waiting.</div>`;
  renderPremium();
}
function renderStudents(){
  $("#stuList").innerHTML=S.students.length?S.students.map(s=>{const cs=accessAll(s)?[`<span class="tag c">All courses</span>`]:Object.keys(s.courses||{}).map(id=>`<span class="tag c">${esc(courseById(id)?.name||"Removed course")} <button data-rmc="${esc(s.id)}|${esc(id)}" title="Remove this course" style="color:#ff9a9a;margin-left:2px">×</button></span>`);
   return `<div class="item"><div class="thumb p">⭐</div><div class="meta"><b>${esc(s.name||"Student")}</b>
   <small>${esc(s.email||"")}${s.phone?" · "+esc(s.phone):""}<br>Last: ₹${esc(s.amount||"—")}${s.utr?" · Ref "+esc(s.utr):""} · ${fmtDate(s.approvedAt)}</small><div>${cs.join("")}</div></div>
   <button class="btn sm danger" data-revoke="${esc(s.id)}">Remove all</button></div>`}).join(""):`<div class="empty">No paid students yet.</div>`;
  renderPremium();
}
document.addEventListener("click",e=>{
  const a=e.target.closest("[data-approve]"),r=e.target.closest("[data-reject]"),v=e.target.closest("[data-revoke]");
  if(!S.fb||!S.isOwner)return; const {db,doc,setDoc,updateDoc,deleteDoc,serverTimestamp}=S.fb;
  if(a){const q=S.requests.find(x=>x.id===a.dataset.approve);if(!q)return;
    askConfirm(`Approve ${q.name||"this student"} (₹${q.amount||"?"}, ref ${q.utr})? Only approve after the money shows in your account.`,"Approve",async()=>{
      try{const uid=q.uid||q.id,cid=q.courseId||LEGACY,c=courseById(cid),ex=S.students.find(s=>s.id===uid);
        const body={name:q.name||"",email:q.email||"",phone:q.phone||"",amount:q.amount||"",utr:q.utr||"",approvedAt:serverTimestamp()};
        if(cid===LEGACY||(c&&c.all)||(ex&&accessAll(ex)))body.all=true; else {body.courses={...((ex&&ex.courses)||{}),[cid]:true};}
        await setDoc(doc(db,"access",uid),body,{merge:true});
        await updateDoc(doc(db,"payments",q.id),{status:"approved"});toast("Approved — "+(c?c.name:"course")+" unlocked")}catch(err){toast("Failed: "+errMsg(err))}})}
  if(r){const q=S.requests.find(x=>x.id===r.dataset.reject);if(!q)return;
    askConfirm(`Reject payment ref ${q.utr} from ${q.name||"this student"}?`,"Reject",async()=>{try{await updateDoc(doc(db,"payments",q.id),{status:"rejected"});toast("Rejected")}catch(err){toast("Failed: "+errMsg(err))}})}
  if(v){const s=S.students.find(x=>x.id===v.dataset.revoke);if(!s)return;
    askConfirm(`Remove ALL course access for ${s.name||"this student"}? Their premium content locks again.`,"Remove",async()=>{try{await deleteDoc(doc(db,"access",s.id));toast("Access removed")}catch(err){toast("Failed: "+errMsg(err))}})}
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
/* =================== courses (owner) =================== */
const SUGGESTED=[{name:"KVS / NVS PET Batch",price:"499",desc:"KVS & NVS PET/TGT Physical Education — videos, notes & tests"},{name:"DSSSB PET Batch",price:"399",desc:"DSSSB PET/TGT Physical Education — videos, notes & tests"},{name:"UGC NET PE Batch",price:"999",desc:"UGC NET Physical Education (Paper 2) — videos, notes & tests"},{name:"All-in-One Combo",price:"1299",desc:"Every course and every lesson — best value",all:true}];
function renderCourseAdmin(){
  if(!$("#cList"))return;
  const cl=S.courses.slice().sort((x,y)=>(x.all?1:0)-(y.all?1:0)||(+x.price||0)-(+y.price||0));
  $("#cList").innerHTML=cl.length?cl.map(c=>{const n=S.materials.filter(m=>!m.free&&itemCourses(m).includes(c.id)).length;
    return `<div class="card"><div class="spread"><div><b>${esc(c.name)}</b> ${c.all?`<span class="pill o">All-in-One</span>`:""}<div class="hi">${c.all?"Unlocks every lesson":`${n} lesson(s)`}${c.desc?" · "+esc(c.desc):""}</div></div><div class="cp" style="font-weight:800;color:var(--gold)">₹${esc(c.price)}</div></div>
    <div class="row" style="margin-top:8px"><button class="btn sm ghost" data-cedit="${esc(c.id)}">Edit</button><button class="btn sm danger" data-cdel="${esc(c.id)}">Delete</button></div></div>`}).join("")
    :`<div class="empty">No courses yet. Until you add one, students see a single "Full Course" at your Settings price.</div>`;
  $("#cSuggest").innerHTML=cl.length?"":`<div class="card"><b>Quick start</b><div class="hi">Create these 4 courses in one tap — you can edit names & prices after.</div><div class="hi" style="margin:6px 0">${SUGGESTED.map(s=>`${esc(s.name)} ₹${s.price}`).join(" · ")}</div><button class="btn sm alt" id="cAddSug">Add suggested courses</button></div>`;
  const leg=S.materials.filter(m=>!m.free&&!(Array.isArray(m.courses)&&m.courses.length));
  const opts=cl.filter(c=>!c.all);
  $("#cLegacy").innerHTML=leg.length&&opts.length?`<div class="card"><b>${leg.length} older premium lesson(s) aren't in any course yet</b><div class="hi">Only "All-in-One" and earlier Full-Course students can open them. Move them into a course:</div>
    <div class="row" style="margin-top:8px"><select class="in" id="cLegSel" style="flex:1">${opts.map(c=>`<option value="${esc(c.id)}">${esc(c.name)}</option>`).join("")}</select><button class="btn sm alt" id="cLegBtn">Move all</button></div></div>`:"";
  const sb=$("#cAddSug");if(sb)sb.onclick=async()=>{sb.disabled=true;try{for(const s of SUGGESTED)await S.fb.addDoc(S.fb.collection(S.fb.db,"courses"),{...s,all:!!s.all,createdAt:S.fb.serverTimestamp()});toast("4 courses added")}catch(err){toast("Failed: "+errMsg(err));sb.disabled=false}};
  const lb=$("#cLegBtn");if(lb)lb.onclick=async()=>{const cid=$("#cLegSel").value;lb.disabled=true;try{for(const m of leg)await S.fb.updateDoc(S.fb.doc(S.fb.db,"materials",m.id),{courses:[cid]});toast("Lessons moved")}catch(err){toast("Failed: "+errMsg(err))}lb.disabled=false};
  renderUpCourses();
}
function renderUpCourses(){
  const el=$("#upCourses");if(!el)return;const opts=S.courses.filter(c=>!c.all);
  const prev=new Set([...el.querySelectorAll("input:checked")].map(i=>i.value));
  el.innerHTML=opts.length?`<div class="cchk">${opts.map(c=>`<label><input type="checkbox" value="${esc(c.id)}">${esc(c.name)}</label>`).join("")}</div><div class="hi" style="margin-top:4px">All-in-One combo students get every lesson automatically.</div>`
    :`<div class="hi">No courses yet — this lesson goes into the single "Full Course". Add courses in the Courses tab.</div>`;
  el.querySelectorAll("input").forEach(i=>{i.checked=prev.has(i.value)});
  $("#upCoursesWrap").style.display=$("#upFree").checked?"none":"block";
}
$("#upFree").addEventListener("change",renderUpCourses);
function resetCForm(){$("#cForm").reset();$("#cId").value="";$("#cFormTitle").textContent="Add a course / batch";$("#cCancel").style.display="none";$("#cStatus").textContent=""}
$("#cCancel").onclick=resetCForm;
$("#cForm").onsubmit=async e=>{e.preventDefault();if(!S.isOwner)return;const {db,doc,collection,setDoc,updateDoc,serverTimestamp}=S.fb;
  const body={name:$("#cName").value.trim().slice(0,80),price:String($("#cPrice").value||"").slice(0,8),desc:$("#cDesc").value.trim().slice(0,300),all:$("#cAll").checked};
  if(!body.name||!body.price){$("#cStatus").textContent="Name and price are required.";return}
  try{const id=$("#cId").value;if(id)await updateDoc(doc(db,"courses",id),body);else await setDoc(doc(collection(db,"courses")),{...body,createdAt:serverTimestamp()});toast(id?"Course updated":"Course added");resetCForm()}
  catch(err){$("#cStatus").textContent="Could not save: "+errMsg(err)}};
document.addEventListener("click",e=>{
  const ed=e.target.closest("[data-cedit]");if(ed){const c=S.courses.find(x=>x.id===ed.dataset.cedit);if(!c)return;$("#cId").value=c.id;$("#cName").value=c.name||"";$("#cPrice").value=c.price||"";$("#cDesc").value=c.desc||"";$("#cAll").checked=!!c.all;$("#cFormTitle").textContent="Edit course";$("#cCancel").style.display="inline-flex";$("#cForm").scrollIntoView({behavior:"smooth",block:"center"})}
  const dl=e.target.closest("[data-cdel]");if(dl){const c=S.courses.find(x=>x.id===dl.dataset.cdel);if(!c)return;
    askConfirm(`Delete course "${c.name}"? Lessons stay, but students can't buy this course any more. Students who already bought it keep access only to lessons still in another course they own.`,"Delete",async()=>{try{await S.fb.deleteDoc(S.fb.doc(S.fb.db,"courses",c.id));toast("Course deleted")}catch(err){toast("Failed: "+errMsg(err))}})}
  const ec=e.target.closest("[data-editc]");if(ec&&S.isOwner){const m=S.materials.find(x=>x.id===ec.dataset.editc);if(!m)return;const cur=new Set(itemCourses(m));
    $("#mTitle").textContent="Courses for: "+m.title;
    $("#mBody").innerHTML=`<div class="cchk">${S.courses.filter(c=>!c.all).map(c=>`<label><input type="checkbox" value="${esc(c.id)}" ${cur.has(c.id)?"checked":""}>${esc(c.name)}</label>`).join("")}</div><div class="row" style="margin-top:12px"><button class="btn alt" id="ecSave">Save</button></div>`;
    $("#modal").classList.add("on");
    $("#ecSave").onclick=async()=>{const sel=[...document.querySelectorAll("#mBody input:checked")].map(i=>i.value);if(!sel.length){toast("Pick at least one course");return}
      try{await S.fb.updateDoc(S.fb.doc(S.fb.db,"materials",m.id),{courses:sel});closeModal();toast("Saved")}catch(err){toast("Failed: "+errMsg(err))}}}
  const rc=e.target.closest("[data-rmc]");if(rc&&S.isOwner){const [uid,cid]=rc.dataset.rmc.split("|");const s=S.students.find(x=>x.id===uid);if(!s)return;
    askConfirm(`Remove ${courseById(cid)?.name||"this course"} from ${s.name||"this student"}?`,"Remove",async()=>{const {db,doc,setDoc,deleteDoc}=S.fb;const cs={...(s.courses||{})};delete cs[cid];
      try{if(!Object.keys(cs).length&&!s.all)await deleteDoc(doc(db,"access",uid));else{const {id,...rest}=s;await setDoc(doc(db,"access",uid),{...rest,courses:cs})}toast("Removed")}catch(err){toast("Failed: "+errMsg(err))}})}
});

/* =================== payment QR =================== */
const DEFAULT_QR="payment-qr.png";
let qrLibP=null;
function loadQrLib(){if(qrLibP)return qrLibP;qrLibP=new Promise((res,rej)=>{const sc=document.createElement("script");sc.src="https://cdnjs.cloudflare.com/ajax/libs/qrcode-generator/1.4.4/qrcode.min.js";sc.onload=()=>res(window.qrcode);sc.onerror=()=>{qrLibP=null;rej(new Error("QR failed to load"))};document.head.appendChild(sc)});return qrLibP}
async function upiQrDataUrl(upiUrl){const qrcode=await loadQrLib();const q=qrcode(0,"M");q.addData(upiUrl);q.make();return q.createDataURL(8,2)}
function shrinkImage(file,max=700){return new Promise((res,rej)=>{const img=new Image();img.onload=()=>{const sc=Math.min(1,max/Math.max(img.width,img.height));const c=document.createElement("canvas");c.width=Math.round(img.width*sc);c.height=Math.round(img.height*sc);
  const x=c.getContext("2d");x.fillStyle="#fff";x.fillRect(0,0,c.width,c.height);x.drawImage(img,0,0,c.width,c.height);let d=c.toDataURL("image/png");if(d.length>700000)d=c.toDataURL("image/jpeg",.9);URL.revokeObjectURL(img.src);res(d)};img.onerror=()=>rej(new Error("Not an image"));img.src=URL.createObjectURL(file)})}
let qrPending=null;
function renderQrPreview(){const el=$("#qrPreview");if(!el)return;const src=qrPending||S.qrImg;
  el.innerHTML=src?`<div class="qrbox photo-qr" style="margin:0 0 10px"><img src="${esc(src)}" alt="Payment QR"></div>${qrPending?`<div class="hi">Not saved yet — tap <b>Save QR</b>.</div>`:`<div class="hi">✅ This QR is live on the Unlock page.</div>`}`:`<div class="qrbox photo-qr" style="margin:0 0 10px;width:min(200px,60%)"><img src="${DEFAULT_QR}" alt="Payment QR"></div><div class="hi">✅ Your PhonePe QR is live on the Unlock page. Upload a different one here to replace it.</div>`}
$("#qrFile").onchange=async()=>{const f=$("#qrFile").files[0];if(!f)return;try{qrPending=await shrinkImage(f);$("#dropQ").classList.add("has");$("#dropQTxt").innerHTML=`<b>${esc(f.name)}</b>`;renderQrPreview()}catch(e){$("#qrStatus").textContent="That file isn't an image."}};
$("#qrSave").onclick=async()=>{if(!S.isOwner||!qrPending){$("#qrStatus").textContent=qrPending?"":"Choose a QR image first.";return}
  try{await S.fb.setDoc(S.fb.doc(S.fb.db,"config","qr"),{img:qrPending,updatedAt:S.fb.serverTimestamp()});qrPending=null;$("#dropQ").classList.remove("has");$("#dropQTxt").innerHTML=`<b>Tap to choose QR image</b><br><span class="hi">PNG / JPG screenshot</span>`;$("#qrStatus").textContent="";toast("QR saved — students can scan it now")}
  catch(err){$("#qrStatus").textContent="Could not save: "+errMsg(err)}};
$("#qrRemove").onclick=()=>{if(!S.isOwner)return;askConfirm("Remove your uploaded QR? The site will show an automatic QR from your UPI ID instead.","Remove",async()=>{try{await S.fb.deleteDoc(S.fb.doc(S.fb.db,"config","qr"));qrPending=null;toast("QR removed")}catch(err){toast("Failed: "+errMsg(err))}})};
async function fillQr(upiUrl){const box=$("#payQr");if(!box)return;
  if(S.qrImg||DEFAULT_QR){box.innerHTML=`<img src="${esc(S.qrImg||DEFAULT_QR)}" alt="Scan to pay with PhonePe / any UPI app">`;box.classList.add("photo-qr")}
  else if(upiUrl){try{box.innerHTML=`<img src="${await upiQrDataUrl(upiUrl)}" alt="Scan to pay">`}catch(e){box.closest(".qrwrap").style.display="none"}}
  else box.closest(".qrwrap").style.display="none";
  const img=box.querySelector("img"),dl=$("#qrDl");if(img&&dl){dl.href=img.getAttribute("src");dl.download="HarshNirwanClasses-payment-QR."+(img.src.startsWith("data:image/jpeg")?"jpg":"png")}}

/* =================== vacancies =================== */
S.vacancies=[];
const dayMs=864e5;
const todayMs=()=>new Date().setHours(0,0,0,0);
const fmtD=d=>d?new Date(d+"T00:00:00").toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"}):"";
function vacSorted(){const t=todayMs();const open=S.vacancies.filter(v=>!v.lastDate||new Date(v.lastDate+"T00:00:00")>=t).sort((a,b)=>(a.lastDate||"9999").localeCompare(b.lastDate||"9999"));
  const closed=S.vacancies.filter(v=>v.lastDate&&new Date(v.lastDate+"T00:00:00")<t).sort((a,b)=>b.lastDate.localeCompare(a.lastDate));return{open,closed}}
function vacCard(v){
  const t=todayMs(),last=v.lastDate?new Date(v.lastDate+"T00:00:00").getTime():null,days=last!==null?Math.round((last-t)/dayMs):null;
  const start=v.startDate?new Date(v.startDate+"T00:00:00").getTime():null;
  let pill="";
  if(days!==null&&days<0)pill=`<span class="pill x">Closed</span>`;
  else if(start&&start>t)pill=`<span class="pill">Starts ${fmtD(v.startDate)}</span>`;
  else if(days===0)pill=`<span class="pill r">Last day today!</span>`;
  else if(days!==null&&days<=7)pill=`<span class="pill r">${days} day${days>1?"s":""} left</span>`;
  else if(days!==null)pill=`<span class="pill o">${days} days left</span>`;
  else pill=`<span class="pill">Open</span>`;
  return `<div class="card vac ${days!==null&&days<0?"closed":""}"><div class="spread" style="align-items:flex-start"><h4>${esc(v.title)}</h4>${pill}</div>
   ${v.org?`<div class="hi">${esc(v.org)}</div>`:""}
   <div class="vdates">${v.startDate?`<span>📅 Starts: <b>${fmtD(v.startDate)}</b></span>`:""}${v.lastDate?`<span>⏰ Last date: <b>${fmtD(v.lastDate)}</b></span>`:""}</div>
   ${v.posts?`<div style="font-size:.85rem;margin-bottom:8px">${esc(v.posts)}</div>`:""}
   <div class="row">${v.parts?`<button class="btn sm alt" data-vpdf="${esc(v.id)}">📄 Official PDF</button>`:""}${safeUrl(v.link)?`<a class="btn sm ghost" href="${esc(v.link)}" target="_blank" rel="noopener">Official site ↗</a>`:""}${S.isOwner?`<button class="btn sm danger" data-vdel="${esc(v.id)}">Delete</button>`:""}</div></div>`;
}
function renderVacancies(){
  const {open,closed}=vacSorted();
  $("#vacHome").innerHTML=open.length?open.slice(0,3).map(vacCard).join(""):`<div class="card hi" style="text-align:center">No open vacancies right now — check back soon.</div>`;
  $("#vacList").innerHTML=(open.length||closed.length)?open.map(vacCard).join("")+(closed.length?`<h2 style="margin-top:16px">Closed</h2>`+closed.slice(0,20).map(vacCard).join(""):"")
    :`<div class="empty"><div class="big">🔔</div>No vacancies posted yet.</div>`;
}
async function uploadPdfParts(col,id,bytes,onProg){const {db,doc,setDoc}=S.fb;const parts=Math.ceil(bytes.length/CHUNK);
  for(let i=0;i<parts;i++){onProg&&onProg(i/parts);await setDoc(doc(db,col,id,"parts",String(i)),{d:bytesToB64(bytes.subarray(i*CHUNK,(i+1)*CHUNK))})}
  return parts}
async function loadPdfParts(col,id,n,onProg){const {db,doc,getDoc}=S.fb;let got=0;
  const parts=await Promise.all(Array.from({length:n},(_,i)=>getDoc(doc(db,col,id,"parts",String(i))).then(s=>{got++;onProg&&onProg(got,n);return b64ToBytes(s.data().d)})));
  const out=new Uint8Array(parts.reduce((t,p)=>t+p.length,0));let o=0;parts.forEach(p=>{out.set(p,o);o+=p.length});return out}
$("#vPdf").onchange=()=>{const f=$("#vPdf").files[0],d=$("#dropV");if(!f){d.classList.remove("has");return}d.classList.add("has");
  $("#dropVTxt").innerHTML=`<b>${esc(f.name)}</b><br><span class="hi">${fmtSize(f.size)}${f.size>MAX_PDF?" — too large (max 15 MB)":""}</span>`};
$("#vacForm").onsubmit=async e=>{
  e.preventDefault(); if(!S.isOwner||!S.fb) return; const {db,doc,collection,setDoc,serverTimestamp}=S.fb;
  const st=$("#vStatus"),btn=$("#vBtn"),bar=$("#vBar"),f=$("#vPdf").files[0],link=$("#vLink").value.trim();
  if(link&&!safeUrl(link)){st.textContent="Link must start with https://";return}
  if(f&&f.size>MAX_PDF){st.textContent="PDF is over 15 MB. Compress it first (ilovepdf.com).";return}
  btn.disabled=true; st.textContent="Posting…";
  try{
    const ref=doc(collection(db,"vacancies")); let parts=0;
    if(f){bar.style.display="block";parts=await uploadPdfParts("vacpdf",ref.id,new Uint8Array(await f.arrayBuffer()),x=>{bar.firstElementChild.style.width=(x*100)+"%";st.textContent=`Uploading PDF… ${Math.round(x*100)}%`})}
    await setDoc(ref,{title:$("#vTitle").value.trim().slice(0,160),org:$("#vOrg").value.trim().slice(0,80),startDate:$("#vStart").value||"",lastDate:$("#vLast").value||"",
      posts:$("#vPosts").value.trim().slice(0,160),link:link.slice(0,300),parts,createdAt:serverTimestamp()});
    $("#vacForm").reset();$("#dropV").classList.remove("has");$("#dropVTxt").innerHTML=`<b>Tap to choose the official PDF</b><br><span class="hi">Up to 15 MB</span>`;st.textContent="";toast("Vacancy posted");
  }catch(err){st.textContent="Could not post: "+errMsg(err)}
  btn.disabled=false;bar.style.display="none";bar.firstElementChild.style.width="0";
};
document.addEventListener("click",async e=>{
  const b=e.target.closest("[data-vpdf]");
  if(b){const v=S.vacancies.find(x=>x.id===b.dataset.vpdf);if(!v||!S.fb)return;
    $("#mTitle").textContent=v.title;$("#mBody").innerHTML=`<div class="empty">⏳ Loading PDF…</div>`;$("#modal").classList.add("on");
    try{const bytes=await loadPdfParts("vacpdf",v.id,v.parts,(g,n)=>{const el=$("#mBody .empty");if(el)el.textContent=`⏳ Loading PDF… ${g}/${n}`});
      const u=URL.createObjectURL(new Blob([bytes],{type:"application/pdf"}));
      $("#mBody").innerHTML=`<div class="pdfv" id="pdfBox"><div class="empty">⏳ Opening…</div></div><div class="row" style="margin-top:10px"><a class="btn sm ghost" href="${u}" download="${esc((v.title||"vacancy").replace(/[^\w\- ]+/g,""))}.pdf">⬇ Download PDF</a>${safeUrl(v.link)?`<a class="btn sm ghost" href="${esc(v.link)}" target="_blank" rel="noopener">Official site ↗</a>`:""}</div>`;
      await renderPdf(bytes.slice(),$("#pdfBox"));
    }catch(err){$("#mBody").innerHTML=`<div class="empty">Couldn't open the PDF (${esc(errMsg(err))}).</div>`}}
  const d=e.target.closest("[data-vdel]");
  if(d&&S.isOwner){const v=S.vacancies.find(x=>x.id===d.dataset.vdel);if(!v)return;
    askConfirm(`Delete "${v.title}"?`,"Delete",async()=>{const {db,doc,deleteDoc}=S.fb;try{for(let i=0;i<(v.parts||0);i++)await deleteDoc(doc(db,"vacpdf",v.id,"parts",String(i)));await deleteDoc(doc(db,"vacancies",v.id));toast("Deleted")}catch(err){toast("Failed: "+errMsg(err))}})}
});

function renderAll(){renderVacancies();if(S.isOwner)renderCourseAdmin();renderLibrary("videos");renderLibrary("pdfs");renderMine();renderStats();renderNotices();renderPremium();setRole();renderAcct();if($("#v-unlock").classList.contains("on"))renderUnlock()}

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
  S.user=user; S.isOwner=false; S.access=null; S.premium={}; S.myPayments={}; S.requests=[]; S.students=[];
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
      let first=true;
      unsubs.push(F.onSnapshot(F.doc(F.db,"access",user.uid),s=>{
        const before=JSON.stringify(S.access&&{a:S.access.all,c:S.access.courses});
        S.access=s.exists()?s.data():null; S.premium={};
        if(!first&&S.access&&before!==JSON.stringify({a:S.access.all,c:S.access.courses}))toast("🎉 Payment verified — your course is unlocked!");
        first=false; renderAll();
      },()=>{}));
      unsubs.push(F.onSnapshot(F.query(F.collection(F.db,"payments"),F.where("uid","==",user.uid)),s=>{S.myPayments={};s.docs.forEach(d=>{const x=d.data();const k=x.courseId||LEGACY;const prev=S.myPayments[k];if(!prev||tsMs(x.createdAt)>=tsMs(prev.createdAt))S.myPayments[k]=x});if($("#v-unlock").classList.contains("on"))renderUnlock()},()=>{}));
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
  F.onSnapshot(F.query(F.collection(F.db,"materials"),F.orderBy("createdAt","desc")),s=>{S.materials=s.docs.map(d=>({id:d.id,...d.data()})).filter(m=>!m.hidden);S.dbReady=true;renderAll()},err=>{console.error(err);S.dbReady=true;renderAll()});
  F.onSnapshot(F.collection(F.db,"courses"),s=>{S.courses=s.docs.map(d=>({id:d.id,...d.data()}));renderAll();renderCourseAdmin();renderRequests();renderStudents()},()=>{});
  F.onSnapshot(F.collection(F.db,"vacancies"),s=>{S.vacancies=s.docs.map(d=>({id:d.id,...d.data()}));renderVacancies()},()=>{});
  F.onSnapshot(F.query(F.collection(F.db,"notices"),F.orderBy("createdAt","desc"),F.limit(10)),s=>{S.notices=s.docs.map(d=>({id:d.id,...d.data()}));renderNotices()},()=>{});
  F.onSnapshot(F.doc(F.db,"config","qr"),s=>{S.qrImg=s.exists()&&typeof s.data().img==="string"&&s.data().img.startsWith("data:image/")?s.data().img:null;renderQrPreview();if($("#v-unlock").classList.contains("on"))renderUnlock()},()=>{});
  F.onSnapshot(F.doc(F.db,"config","pay"),s=>{S.payCfg=s.exists()?s.data():{};fillPayForm();renderPremium();if($("#v-unlock").classList.contains("on"))renderUnlock()},()=>{});
  F.onSnapshot(F.query(F.collection(F.db,"questions"),F.orderBy("createdAt","desc")),s=>{S.questions=s.docs.map(d=>({id:d.id,...d.data()}));renderPracticeChips();renderPractice();renderQList()},()=>{});
  F.onAuthStateChanged(F.auth,u=>onUser(u));
}

renderAll(); renderQList();
initFirebase();
if("serviceWorker" in navigator && location.protocol==="https:") navigator.serviceWorker.register("sw.js").catch(()=>{});
