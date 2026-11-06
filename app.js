const menuButton = document.querySelector('.menu-toggle');
const mobileNav = document.querySelector('#mobile-nav');
function closeMenu() {
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', '메뉴 열기');
  mobileNav.hidden = true;
}
menuButton.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') !== 'true';
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', open ? '메뉴 닫기' : '메뉴 열기');
  mobileNav.hidden = !open;
});
mobileNav.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', event => { if (event.key === 'Escape') closeMenu(); });
matchMedia('(min-width: 651px)').addEventListener('change', event => { if (event.matches) closeMenu(); });
const projects = {
  twin: { label: '01 / RESEARCH & SIMULATION', title: 'REALITY, REIMAGINED.', description: '복잡한 현실을 이해하고 새로운 가능성을 실험합니다.\n\n항공·모빌리티 분야의 디지털 트윈과 시뮬레이션을 구축하고, 데이터를 바탕으로 다양한 시나리오를 검증합니다. 이천의 지역 유산을 담은 인터랙티브 맵부터 미래 항공 AAM/UTM 개념 시각화까지, 추상적인 아이디어를 직접 살펴보고 실험할 수 있는 형태로 구현합니다.', tags: ['Digital Twin', 'Scenario Lab', 'AAM / UTM', 'Data Pipeline'] },
  media: { label: '02 / INTERACTIVE MEDIA & GAME', title: 'DON’T JUST WATCH. FEEL.', description: '화면 속 이야기에 직접 참여하는 경험을 만듭니다.\n\nUnity와 Unreal을 활용해 도시·관광 디지털 트윈, 위치 기반 지역 콘텐츠, 전시용 인터랙티브 미디어를 만듭니다. 지역의 이야기에 기술을 더해, 사용자의 움직임과 선택에 반응하는 경험을 설계합니다.', tags: ['Unity', 'Unreal Engine', 'WebGL', 'Interactive Experience'] },
  learning: { label: '03 / RESEARCH & LEARNING', title: 'STAY CURIOUS.', description: '실험으로 얻은 발견을 나누며 더 큰 가능성을 찾습니다.\n\n조종사와 연구자의 관점에서 AI·HCI를 탐구하고, 직접 만들며 배우는 워크숍을 진행합니다. 실험에 사용한 코드와 작업 노하우를 나누며 아이디어를 다음 단계로 발전시킵니다.', tags: ['AI / HCI', 'Hands-on Workshop', 'Research', 'Open Collaboration'] }
};
const dialog = document.querySelector('.project-dialog');
document.querySelectorAll('[data-project]').forEach(button => {
  button.addEventListener('click', () => {
    const project = projects[button.dataset.project];
    dialog.querySelector('.dialog-eyebrow').textContent = project.label;
    dialog.querySelector('h2').textContent = project.title;
    dialog.querySelector('.dialog-description').textContent = project.description;
    dialog.querySelector('.dialog-tags').replaceChildren(...project.tags.map(tag => {
      const chip = document.createElement('span'); chip.textContent = tag; return chip;
    }));
    dialog.showModal();
  });
});
dialog.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => {
  const box = dialog.getBoundingClientRect();
  if (event.target === dialog && (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom)) dialog.close();
});
document.querySelector('.copy-email').addEventListener('click', async () => {
  const status = document.querySelector('.copy-status');
  try { await navigator.clipboard.writeText('contact@gamacraft.com'); status.textContent = '이메일 주소를 복사했습니다.'; }
  catch { status.textContent = 'contact@gamacraft.com 주소를 직접 복사해 주세요.'; }
});
document.querySelector('#year').textContent = new Date().getFullYear();

// The fire is anchored to the photograph's source coordinates, including cover cropping.
const hero = document.querySelector('.hero');
const kilnImage = document.querySelector('.hero-kiln');
const atmosphere = document.querySelector('.kiln-atmosphere');
const fireContext = atmosphere.getContext('2d');
const motionButton = document.querySelector('.motion-toggle');
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
let fireFrame = 0, fireVisible = true, firePaused = false, fireSize = { width: 0, height: 0 };
const embers = Array.from({ length: 19 }, (_, index) => ({
  phase: index / 19, duration: 4.5 + (index % 7) * .7,
  x: 830 + (index * 37 % 170), drift: (index % 2 ? 1 : -1) * (25 + index * 3),
  size: .8 + (index % 4) * .35
}));
function resizeFire() {
  const { width, height } = hero.getBoundingClientRect();
  const density = Math.min(devicePixelRatio || 1, 2);
  fireSize = { width, height };
  atmosphere.width = Math.round(width * density);
  atmosphere.height = Math.round(height * density);
  fireContext.setTransform(density, 0, 0, density, 0, 0);
}
function drawFire(milliseconds) {
  const { width, height } = fireSize;
  const t = milliseconds / 1000;
  fireContext.clearRect(0, 0, width, height);
  const sourceWidth = kilnImage.naturalWidth || 1536;
  const sourceHeight = kilnImage.naturalHeight || 1024;
  const scale = Math.max(width / sourceWidth, height / sourceHeight);
  const mobile = width <= 650;
  const left = (width - sourceWidth * scale) * (mobile ? .65 : .5);
  const top = (height - sourceHeight * scale) * (mobile ? .5 : .58);
  fireContext.save();
  fireContext.translate(left, top);
  fireContext.scale(scale, scale);
  fireContext.globalCompositeOperation = 'screen';
  // Soft heat bloom follows the mouth; layered ribbons gently shift over the existing fire.
  const pulse = .65 + Math.sin(t * 2.7) * .12 + Math.sin(t * 4.3) * .07;
  const glow = fireContext.createRadialGradient(905, 780, 5, 905, 780, 180);
  glow.addColorStop(0, `rgba(255,105,24,${.13 * pulse})`);
  glow.addColorStop(.45, `rgba(226,45,9,${.1 * pulse})`);
  glow.addColorStop(1, 'rgba(180,20,0,0)');
  fireContext.fillStyle = glow;
  fireContext.fillRect(710, 580, 400, 370);
  for (let i = 0; i < 5; i++) {
    const x = 846 + i * 25;
    const sway = Math.sin(t * (1.9 + i * .13) + i * 2) * 10;
    const tip = 725 - Math.sin(t * 2.8 + i) * 14 - i * 10;
    const flame = fireContext.createLinearGradient(x, 840, x, tip);
    flame.addColorStop(0, 'rgba(255,126,29,.03)');
    flame.addColorStop(.45, `rgba(255,112,24,${.08 * pulse})`);
    flame.addColorStop(1, 'rgba(255,174,68,0)');
    fireContext.fillStyle = flame;
    fireContext.beginPath();
    fireContext.moveTo(x - 12, 840);
    fireContext.bezierCurveTo(x - 22, 800, x + 18 + sway, 766, x + sway, tip);
    fireContext.bezierCurveTo(x + 36 + sway, 775, x + 25, 810, x + 12, 840);
    fireContext.fill();
  }
  for (const ember of embers) {
    const life = (t / ember.duration + ember.phase) % 1;
    const x = ember.x + Math.sin(life * 5 + ember.phase * 9) * 16 + life * ember.drift;
    const y = 790 - life * (370 + ember.phase * 140);
    const opacity = Math.sin(life * Math.PI) * .65;
    fireContext.fillStyle = `rgba(255,${125 + Math.round(ember.phase * 65)},65,${opacity})`;
    fireContext.shadowBlur = 6;
    fireContext.shadowColor = '#f75b21';
    fireContext.beginPath();
    fireContext.ellipse(x, y, ember.size, ember.size * 1.6, life * 2, 0, Math.PI * 2);
    fireContext.fill();
  }
  fireContext.restore();
  fireFrame = requestAnimationFrame(drawFire);
}
function syncFire() {
  cancelAnimationFrame(fireFrame);
  const stopped = firePaused || reducedMotion.matches;
  motionButton.setAttribute('aria-pressed', String(stopped));
  motionButton.setAttribute('aria-label', stopped ? '불빛 애니메이션 재생' : '불빛 애니메이션 일시 정지');
  motionButton.innerHTML = stopped ? '<span aria-hidden="true">▷</span> 불빛 다시 켜기' : '<span aria-hidden="true">Ⅱ</span> 불빛 잠시 멈추기';
  if (stopped) fireContext.clearRect(0, 0, fireSize.width, fireSize.height);
  if (!stopped && fireVisible && !document.hidden) fireFrame = requestAnimationFrame(drawFire);
}
resizeFire();
new ResizeObserver(resizeFire).observe(hero);
new IntersectionObserver(entries => { fireVisible = entries[0].isIntersecting; syncFire(); }).observe(hero);
reducedMotion.addEventListener('change', syncFire);
document.addEventListener('visibilitychange', syncFire);
motionButton.addEventListener('click', () => { firePaused = !firePaused; syncFire(); });
syncFire();
