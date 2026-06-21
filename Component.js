// components.js
import { PREREQS } from './state.js';

// ---- REQ 2 Implementation: Dynamic Prerequisite Pathing Highlighter ----
function highlightPaths(courseCode, store, clear = false) {
  const cards = document.querySelectorAll('.card');
  cards.forEach(card => card.classList.remove('path-prereq', 'path-dependent'));
  if (clear) return;

  // Find prereqs for this course
  const directPrereqs = PREREQS[courseCode] || [];
  
  // Find courses that depend on this course
  const dependents = [];
  Object.keys(PREREQS).forEach(key => {
    if (PREREQS[key].includes(courseCode)) dependents.push(key);
  });

  cards.forEach(card => {
    const currentCode = store.getCourseCode(card.dataset.code);
    if (directPrereqs.includes(currentCode)) {
      card.classList.add('path-prereq');
    } else if (dependents.includes(currentCode)) {
      card.classList.add('path-dependent');
    }
  });
}

// ---- REQ 3 Implementation: Dynamic Click-to-Move Context Menu Component ----
function renderContextMenu(e, courseId, store) {
  e.stopPropagation();
  // Clear any existing active menus
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
  
  // Dismiss menu on hitting outside canvas bounds
  const dismiss = () => { menu.remove(); document.removeEventListener('click', dismiss); };
  setTimeout(() => document.addEventListener('click', dismiss), 50);
}

export function createCourseCard(course, store) {
  const card = document.createElement('div');
  card.className = 'card';
  card.dataset.id = course.id;
  card.dataset.code = store.getCourseCode(course.text);
  
  card.innerHTML = `
    <div class="card-top">
      <div class="card-text">${course.text}</div>
      <button class="menu-trigger" title="Move options">⋮</button>
    </div>
    <div class="card-foot">
      <span>${course.credits} Credits</span>
    </div>
  `;

  // Attach context menu events
  card.querySelector('.menu-trigger').addEventListener('click', (e) => {
    renderContextMenu(e, course.id, store);
  });

  // Attach dynamic flow highlights
  card.addEventListener('mouseenter', () => {
    const code = store.getCourseCode(course.text);
    highlightPaths(code, store, false);
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
  
  col.innerHTML = `
    <div class="col-header">
      <div class="col-title">${colData.title}</div>
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
  container.innerHTML = '';
  store.state.forEach(colData => {
    container.appendChild(createColumn(colData, store));
  });
}