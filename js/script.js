(function(){
var b=document.getElementById('burger'),m=document.getElementById('menu'),hd=document.getElementById('hd');
function set(o){m.classList.toggle('open',o);b.setAttribute('aria-expanded',o)}
b.addEventListener('click',function(){set(!m.classList.contains('open'))});
m.addEventListener('click',function(e){if(e.target.tagName==='A')set(false)});
window.addEventListener('scroll',function(){hd.classList.toggle('sc',scrollY>10)},{passive:true});
var rm=matchMedia('(prefers-reduced-motion:reduce)').matches;
/* reveal + contadores */
function count(el){var t=+el.dataset.count,s=el.dataset.suf||'',n=0,st=performance.now();
(function f(now){var p=Math.min((now-st)/1400,1);el.textContent=Math.round(t*p)+(p===1?s:'');if(p<1)requestAnimationFrame(f)})(st)}
var els=document.querySelectorAll('.rv');
if(rm||!('IntersectionObserver' in window)){els.forEach(function(e){e.classList.add('in')})}
else{var io=new IntersectionObserver(function(es){es.forEach(function(x){if(x.isIntersecting){x.target.classList.add('in');x.target.querySelectorAll('[data-count]').forEach(count);io.unobserve(x.target)}})},{threshold:.15});
els.forEach(function(e,i){e.style.transitionDelay=(i%4)*90+'ms';io.observe(e)})}
/* flocos de neve */
if(!rm){var sn=document.getElementById('snow');for(var i=0;i<14;i++){var s=document.createElement('i');s.textContent='\u2744';s.style.left=Math.random()*100+'%';s.style.fontSize=(10+Math.random()*14)+'px';s.style.opacity=.5+Math.random()*.5;s.style.animationDuration=(9+Math.random()*10)+'s';s.style.animationDelay=(-Math.random()*15)+'s';sn.appendChild(s)}}
/* formulário -> WhatsApp */
document.getElementById('form').addEventListener('submit',function(e){
e.preventDefault();
var f=e.target,ok=true;
[f.nome,f.tel,f.msg].forEach(function(x){var bad=!x.value.trim();x.style.borderColor=bad?'#e5484d':'';if(bad)ok=false});
if(!ok)return;
var txt='Olá! Meu nome é '+f.nome.value.trim()+'.\nTelefone: '+f.tel.value.trim()+'\n\n'+f.msg.value.trim();
window.open('https://api.whatsapp.com/send?phone=5585991425425&text='+encodeURIComponent(txt),'_blank','noopener');
});
})();
