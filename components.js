// components.js
import { PREREQS } from './state.js';

const SUBJECTS = [
  { abbr: 'PGE', color: '#BF5700', bg: '#FBE2C7', fg: '#8C3F00', test: /^PGE\b/i },
  { abbr: 'M', color: '#3366CC', bg: '#E6EEFF', fg: '#1A4080', test: /^M\b/i },
  { abbr: 'PHY', color: '#663399', bg: '#F2E6FF', fg: '#401A66', test: /^PHY\b/i },
  { abbr: 'CH', color: '#008080', bg: '#E6FFFF', fg: '#004D4D', test: /^CH\b/i },
  { abbr: 'E M', color: '#CC3333', bg: '#FFE6E6', fg: '#801A1A', test: /^(E\s*M|EM)\b/i },
  { abbr: 'CORE', color: '#738A9C', bg: '#F0F4F8', fg: '#334E68', test: /.*/ }
];

function getSubjectStyle(code) {
  return SUBJECTS.find(s => s.test.test(code)) || SUBJECTS[SUBJECTS.length - 1];
}

function highlightPaths(courseCode, store, clear = false) {
  const cards = document.querySelectorAll('.card');
  cards.forEach(card => card.classList.remove('path-prereq', 'path-dependent'));
  if (clear || !courseCode) return;

  const directPrereqs = PREREQS[courseCode] || [];
  const dependents = [];
  
  Object.keys(PREREQS).forEach(key => {
    if (PREREQS[key].includes(courseCode)) dependents.push(key);
  });

  cards.forEach(card => {
    const currentCode = store.getCourseCode(card.dataset.code);
    if (!currentCode) return;
    if (directPrereqs.includes(currentCode)) {
      card.classList.add('path-prereq');
    } else if (dependents.includes(currentCode)) {
      card.classList.add('path-dependent');
    }
  });
}

function renderContextMenu(e, courseId, store) {
  e.stopPropagation();
  const existing = document.querySelector('.context-menu');
  if (existing) existing.remove();

  const menu = document.createElement('div');
  menu.className = 'context-menu';
  menu.style.left = `${e.clientX}px`;
  menu.style.top = `${e.clientY}px`;

  store.state.forEach(col => {
    const btn = document.createElement('button');
    btn.className = 'menu-item';
    btn.textContent = `Move to ${col.title}`;
    btn.addEventListener('click', () => {
      store.moveCourse(courseId, col.id);
      menu.remove();
    });
    menu.appendChild(btn);
  });

  document.body.appendChild(menu);
  const dismiss = () => { menu.remove(); document.removeEventListener('click', dismiss); };
  setTimeout(() => document.addEventListener('click', dismiss), 50);
}

export function createCourseCard(course, store) {
  const card = document.createElement('div');
  card.className = 'card';
  card.dataset.id = course.id;
  
  const parsedCode = store.getCourseCode(course.text);
  card.dataset.code = parsedCode;
  
  const style = getSubjectStyle(parsedCode);
  card.style.setProperty('--subj-color', style.color);

  card.innerHTML = `
    <div class="card-top">
      <div class="card-text">${course.text}</div>
      <button class="menu-trigger" title="Move options">⋮</button>
    </div>
    <div class="card-foot">
      <span class="badge" style="--badge-bg: ${style.bg}; --badge-fg: ${style.fg};">${style.abbr}</span>
      <span>${course.credits} Credits</span>
    </div>
  `;

  card.querySelector('.menu-trigger').addEventListener('click', (e) => {
    renderContextMenu(e, course.id, store);
  });

  card.addEventListener('mouseenter', () => {
    highlightPaths(parsedCode, store, false);
  });
  card.addEventListener('mouseleave', () => {
    highlightPaths('', store, true);
  });

  return card;
}

export function createColumn(colData, store) {
  const col = document.createElement('div');
  col.className = 'column';
  col.id = colData.id;
  
  const hours = colData.courses.reduce((sum, c) => sum + c.credits, 0);
  
  col.innerHTML = `
    <div class="col-header">
      <div class="col-title">${colData.title}</div>
      <div class="col-hours">${hours} Hrs</div>
    </div>
    <div class="col-body"></div>
  `;
  
  const body = col.querySelector('.col-body');
  colData.courses.forEach(c => {
    body.appendChild(createCourseCard(c, store));
  });
  
  return col;
}

export function renderBoard(container, store) {
  if (!container) return;
  container.innerHTML = '';
  store.state.forEach(colData => {
    container.appendChild(createColumn(colData, store));
  });
}
