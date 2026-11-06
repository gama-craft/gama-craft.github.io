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
