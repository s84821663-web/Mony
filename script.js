const KEY="finance-v1";
let state={accounts:["حساب بانکی","نقد"],tx:[],sel:null};
try{const s=localStorage.getItem(KEY);if(s){state=JSON.parse(s)}}catch(e){}
state.info=state.info||{};state.nums=state.nums||{};state.init=state.init||{};
function migrate(){if(!state.v){state.tx.forEach(x=>x.amount*=10);Object.keys(state.init).forEach(k=>state.init[k]*=10);state.v=2;persist()}}
const fa=n=>Math.abs(n).toLocaleString("fa-IR");
const $=id=>document.getElementById(id);
const BANKS=[["بلو جونیور","#ff6a00"],["بلو","#2f7de1"],["ملی","#1d5fa8"],["ملت","#c8202f"],["صادرات","#1f4f9a"],["سپه","#e07b1a"],["تجارت","#17376b"],["رفاه","#2a7fc1"],["پاسارگاد","#8a6d1d"],["سامان","#1b8fd0"],["پارسیان","#8e1f5a"],["کشاورزی","#2e8b3d"],["مسکن","#d9651e"],["شهر","#c4382b"],["آینده","#3a9a6e"],["سینا","#3d5aa8"],["دی","#2b6f77"],["اقتصاد نوین","#6b3fa0"],["پست بانک","#2a9d4a"],["رسالت","#a0522d"],["مهر ایران","#d0a21c"],["توسعه تعاون","#5a7d2a"],["صنعت و معدن","#555f6b"],["توسعه صادرات","#2d5f8b"],["کارآفرین","#b5472e"],["گردشگری","#1f8a8a"],["ایران زمین","#7a4a9b"],["سرمایه","#2c6e91"],["قوامین","#6d7f2e"]];
// LOGOS (لوگوی بانک‌ها) در فایل logos.js تعریف شده است
const norm=s=>s.replace(/ي/g,"ی").replace(/ك/g,"ک").replace(/^بانک\s+/,"").replace(/^مهریران/,"مهر ایران").trim();
function badge(name){const n=norm(name);const b=BANKS.find(k=>n===k[0]||n.startsWith(k[0]+" "));if(!b)return null;if(LOGOS[b[0]]){const i=document.createElement("img");i.src=LOGOS[b[0]];i.alt="";i.className="logoimg";return i}const s=document.createElement("span");s.className="logo";s.style.background=b[1];s.textContent=b[0][0];s.setAttribute("aria-hidden","true");return s}
BANKS.forEach(k=>{const o=document.createElement("option");o.value=k[0]==="پست بانک"||k[0]==="بلو جونیور"?k[0]:k[0]==="بلو"?"بلو بانک":"بانک "+k[0];$("banks").append(o)});
function persist(){try{localStorage.setItem(KEY,JSON.stringify(state))}catch(e){}}
function sum(txs,t){return txs.filter(x=>x.type===t).reduce((a,x)=>a+x.amount,0)}
function render(){migrate();
  const txs=state.sel===null?state.tx:state.tx.filter(x=>x.acc===state.sel);
  const base=state.sel===null?Object.values(state.init).reduce((a,v)=>a+v,0):(state.init[state.sel]||0);
  const inc=sum(txs,"in"),exp=sum(txs,"out"),bal=base+inc-exp;
  $("bal").textContent=(bal<0?"−":"")+fa(bal);$("baltoman").textContent=(bal<0?"−":"")+fa(bal/10)+" تومان";
  $("inc").textContent=fa(inc)+" ریال";$("exp").textContent=fa(exp)+" ریال";
  const nm=((state.info.first||"")+" "+(state.info.last||"")).trim();$("hello").textContent=nm?"سلام، "+nm:"";
  $("scope").textContent=state.sel===null?"موجودی همه حساب‌ها":"موجودی "+state.sel;
  $("editnum").style.display=state.sel===null?"none":"flex";
  if(state.sel!==null&&document.activeElement!==$("curnum")){$("curnum").value=state.nums[state.sel]||"";$("curinit").value=state.init[state.sel]||"";$("curnum").placeholder="شماره حساب "+state.sel}
  const a=$("accs");a.innerHTML="";
  const mk=(name,val,sel)=>{const b=document.createElement("button");b.className="acc";b.type="button";
    b.setAttribute("aria-pressed",String(state.sel===sel));
    const n=document.createElement("b");n.textContent=name;const v=document.createElement("span");v.textContent=(val<0?"−":"")+fa(val)+" ریال";const tv=document.createElement("small");tv.style.display="block";tv.style.color="var(--muted)";tv.textContent=(val<0?"−":"")+fa(val/10)+" تومان";
    const lg=badge(name);if(lg)n.prepend(lg);b.append(n,v,tv);const num=state.nums&&state.nums[name];if(num){const z=document.createElement("small");z.style.display="block";z.style.color="var(--muted)";z.dir="ltr";z.textContent=num;b.append(z)}b.onclick=()=>{state.sel=sel;persist();if(sel!==null)$("txacc").value=sel;render()};a.append(b)};
  mk("همه",Object.values(state.init).reduce((a,v)=>a+v,0)+sum(state.tx,"in")-sum(state.tx,"out"),null);
  state.accounts.forEach(n=>{const t=state.tx.filter(x=>x.acc===n);mk(n,(state.init[n]||0)+sum(t,"in")-sum(t,"out"),n)});
  const ta=$("txacc"),curacc=ta.value;ta.innerHTML="";state.accounts.forEach(n=>{const o=document.createElement("option");o.value=n;o.textContent=n;ta.append(o)});ta.value=state.accounts.includes(curacc)?curacc:(state.sel||state.accounts[0]);
  const exps={};txs.filter(x=>x.type==="out").forEach(x=>{const c=x.cat||"سایر";exps[c]=(exps[c]||0)+x.amount});
  const ch=$("chart");ch.innerHTML="";const mx=Math.max(0,...Object.values(exps));
  if(!mx)ch.innerHTML='<div class="empty">با ثبت هزینه، نمودار اینجا نمایش داده می‌شود.</div>';
  Object.entries(exps).sort((a,b)=>b[1]-a[1]).forEach(([c,v])=>{const r=document.createElement("div");r.className="bar";const n=document.createElement("span");n.textContent=c;const tr=document.createElement("i");const f=document.createElement("em");f.style.width=(v/mx*100)+"%";tr.append(f);const m=document.createElement("span");m.textContent=fa(v);r.append(n,tr,m);ch.append(r)});
  const q=$("q").value.trim();
  const shown=q?txs.filter(x=>((x.desc||"")+" "+(x.cat||"")).includes(q)):txs;
  const l=$("list");l.innerHTML="";
  if(!shown.length){l.innerHTML='<li class="empty">هنوز تراکنشی ثبت نشده. از بخش بالا اولین تراکنش را اضافه کنید.</li>';return}
  shown.slice().reverse().forEach(x=>{
    const li=document.createElement("li");
    const t=document.createElement("div");t.className="t";
    t.textContent=x.desc||(x.type==="in"?"درآمد":"هزینه");t.style.cursor="pointer";t.onclick=()=>startEdit(x);
    const s=document.createElement("small");s.textContent=x.acc+" • "+(x.cat||"سایر")+" • "+new Date(x.date).toLocaleDateString("fa-IR");t.append(s);
    const m=document.createElement("b");m.className=x.type;m.textContent=(x.type==="in"?"+":"−")+fa(x.amount);
    const d=document.createElement("button");d.type="button";d.textContent="×";d.setAttribute("aria-label","حذف");
    d.onclick=()=>{state.tx=state.tx.filter(y=>y.id!==x.id);persist();render()};
    const lg=badge(x.acc);if(lg)li.append(lg);li.append(t,m,d);l.append(li)});
}
let editId=null;
function resetForm(){editId=null;$("amount").value="";$("desc").value="";$("save").textContent="ثبت تراکنش";$("cancel").style.display="none"}
function startEdit(x){editId=x.id;$("type").value=x.type;$("amount").value=x.amount;$("desc").value=x.desc||"";$("cat").value=x.cat||"سایر";$("txacc").value=x.acc;$("save").textContent="ذخیره تغییرات";$("cancel").style.display="block";$("addbox").scrollIntoView({behavior:"smooth"});$("amount").focus()}
$("cancel").onclick=resetForm;
$("q").oninput=render;
$("save").onclick=()=>{
  const amount=parseFloat($("amount").value);
  if(!amount||amount<=0){$("amount").focus();return}
  const acc=$("txacc").value||state.accounts[0];
  const rec={type:$("type").value,amount,desc:$("desc").value.trim(),cat:$("cat").value,acc};
  if(editId){const x=state.tx.find(y=>y.id===editId);if(x)Object.assign(x,rec)}else state.tx.push({id:Date.now(),acc,date:Date.now(),...rec});
  resetForm();persist();render();
};
$("addacc").onclick=()=>{
  const n=$("newname").value.trim();
  if(!n||state.accounts.includes(n))return;
  state.accounts.push(n);state.sel=n;const nu=$("newnum").value.trim();if(nu)state.nums[n]=nu;const iv=parseFloat($("newinit").value);if(iv)state.init[n]=iv;$("newname").value="";$("newnum").value="";$("newinit").value="";persist();render();
};
$("fn").value=state.info.first||"";$("ln").value=state.info.last||"";$("bd").value=state.info.birth||"";
$("saveinfo").onclick=()=>{state.info={first:$("fn").value.trim(),last:$("ln").value.trim(),birth:$("bd").value.trim()};persist();render();$("infomsg").textContent="اطلاعات ذخیره شد."};
$("savenum").onclick=()=>{if(state.sel===null)return;const v=$("curnum").value.trim();if(v)state.nums[state.sel]=v;else delete state.nums[state.sel];const iv=parseFloat($("curinit").value);if(iv)state.init[state.sel]=iv;else delete state.init[state.sel];persist();render()};
let delArm=null;
$("delacc").onclick=()=>{
  const n=state.sel;if(n===null)return;
  const m=$("delmsg");
  if(state.accounts.length<=1){m.textContent="آخرین حساب را نمی‌شود حذف کرد.";return}
  if(delArm!==n){delArm=n;$("delacc").textContent="مطمئنی؟ دوباره بزن";m.textContent="با حذف حساب، همه‌ی تراکنش‌های آن هم پاک می‌شود.";setTimeout(()=>{if(delArm===n){delArm=null;$("delacc").textContent="حذف حساب";m.textContent=""}},5000);return}
  state.accounts=state.accounts.filter(a=>a!==n);
  state.tx=state.tx.filter(x=>x.acc!==n);
  delete state.nums[n];delete state.init[n];
  state.sel=null;delArm=null;$("delacc").textContent="حذف حساب";m.textContent="";
  resetForm();persist();render();
};
$("bkout").onclick=()=>{
  const t=JSON.stringify({accounts:state.accounts,tx:state.tx,info:state.info,nums:state.nums,init:state.init,v:state.v});
  $("bk").value=t;$("bk").select();
  let ok=false;try{navigator.clipboard.writeText(t).then(()=>{$("bkmsg").textContent="پشتیبان کپی شد. آن را در یک یادداشت نگه دارید."},()=>{})}catch(e){}
  $("bkmsg").textContent="متن پشتیبان آماده است. آن را کپی کنید و در یک یادداشت نگه دارید.";
};
$("bkin").onclick=()=>{
  try{
    const d=JSON.parse($("bk").value);
    if(!Array.isArray(d.accounts)||!Array.isArray(d.tx))throw 0;
    state={accounts:d.accounts,tx:d.tx,sel:null,info:d.info||{},nums:d.nums||{},init:d.init||{},v:d.v};$("fn").value=state.info.first||"";$("ln").value=state.info.last||"";$("bd").value=state.info.birth||"";persist();render();
    $("bkmsg").textContent="اطلاعات بازیابی شد.";
  }catch(e){$("bkmsg").textContent="متن پشتیبان معتبر نیست. دوباره آن را کامل جای‌گذاری کنید."}
};
render();
