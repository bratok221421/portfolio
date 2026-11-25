const looks = [
  {name:'Розовый шёлк', file:'939836.jpg', color:'#da93a6', alt:'Розовое покрытие с мерцающим акцентом'},
  {name:'Алый бархат', file:'3997386.jpg', color:'#b12436', alt:'Красный глянцевый маникюр'},
  {name:'Лесной шалфей', file:'704815.jpg', color:'#35483d', alt:'Зелёный маникюр с растительным узором'}
];
const $ = selector => document.querySelector(selector);
let current = 0;
function showLook(index) {
  current = (index + looks.length) % looks.length;
  const look = looks[current];
  const photo = $('#heroImage');
  photo.src = look.file;
  photo.alt = look.alt;
  $('#shadeName').textContent = look.name;
  if (!matchMedia('(prefers-reduced-motion: reduce)').matches)
    photo.animate([{opacity:.5,transform:'scale(1.04)'},{opacity:1,transform:'scale(1)'}],{duration:450,easing:'ease-out'});
}
$('#next').onclick = () => showLook(current+1);
$('#prev').onclick = () => showLook(current-1);
looks.forEach((look,index) => {
  const button = document.createElement('button');
  const dot = document.createElement('i');
  dot.style.background = look.color;
  button.append(dot,look.name);
  button.onclick = () => {showLook(index); $('.visual').scrollIntoView({block:'center'});};
  $('.swatches').append(button);
});
const ribbon = $('.ribbon div');
for(let i=0;i<4;i++) {
  for(const word of ['Маникюр','Дизайн ногтей','Уход за руками','Rosé Atelier']) {
    const item=document.createElement('span');
    const star=document.createElement('b');
    star.textContent='✧';
    item.append(word,star);
    ribbon.append(item);
  }
}
const modal=$('dialog');
function openPlan(service) {
  $('#status').textContent='';
  const now=new Date();
  const today=[now.getFullYear(),String(now.getMonth()+1).padStart(2,'0'),String(now.getDate()).padStart(2,'0')].join('-');
  $('#date').min=today;
  let saved={};
  try { saved=JSON.parse(localStorage.getItem('rose-visit')||'{}') || {}; } catch {}
  $('#service').value=service || saved.service || $('#service').options[0].value;
  $('#date').value=saved.date>=today?saved.date:today;
  modal.showModal();
}
document.querySelectorAll('[data-service]').forEach(card=>{
  $('#service').add(new Option(card.dataset.service));
  card.onclick=()=>openPlan(card.dataset.service);
});
$('.book').onclick=()=>openPlan();
$('#plan').onsubmit=event=>{
  event.preventDefault();
  try {
    localStorage.setItem('rose-visit',JSON.stringify({service:$('#service').value,date:$('#date').value}));
    $('#status').textContent='План визита сохранён на этом устройстве.';
  } catch {$('#status').textContent='Браузер не разрешил сохранить план.';}
};
if ('IntersectionObserver' in window) {
  const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{
    if(entry.isIntersecting){entry.target.classList.add('arrive');observer.unobserve(entry.target);}
  }),{threshold:.13});
  document.querySelectorAll('.content').forEach(section=>observer.observe(section));
}
