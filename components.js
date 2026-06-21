// components.js

let activeDrag = null;
let ghostPlaceholder = null;

export function renderLegend(container, store) {
  container.innerHTML = "";
  
  const activeSubjects = new Set();
  store.state.forEach(col => {
    col.courses.forEach(c => {
      const config = store.getSubjectConfig(c.text);
      activeSubjects.add(`${config.label}::${config.color}`);
    });
  });

  if (activeSubjects.size === 0) {
    activeSubjects.add("Petroleum (PGE)::#BF5700");
    activeSubjects.add("Math (M)::#2E5C8A");
    activeSubjects.add("Physics (PHY)::#6B4E96");
    activeSubjects.add("Chemistry (CH)::#1F7A6B");
  }

  activeSubjects.forEach(entry => {
    const [label, color] = entry.split("::");
    const item = document.createElement("div");
    item.className = "legend-item";
    item.innerHTML = `<span class="legend-dot" style="background:${color}"></span><span>${label}</span>`;
    container.appendChild(item);
  });
}

export function createCourseCard(course, store, isViolated) {
  const card = document.createElement("div");
  card.className = "card";
  card.dataset.id = course.id;
  
  // Set up critical cross-browser touch overrides directly on the style layers
  card.style.touchAction = "none";
  
  const style = store.getSubjectConfig(course.text);
  card.style.setProperty("--subj-color", style.color);
  card.style.setProperty("background", style.bg);

  card.innerHTML = `
    <div class="handle" style="touch-action: none; user-select: none;">⠿</div>
    <div class="card-mid">
      <input class="card-input-name" value="${course.text.replace(/"/g, '&quot;')}" title="Edit course description" />
      <div class="card-meta-row">
        <div class="credit-input-wrapper">
          <input type="number" class="credit-input" value="${course.credits}" min="0" max="12" /> cr
        </div>
        <span class="badge" style="background:${style.color}; color:#FFF;">${style.abbrev}</span>
      </div>
    </div>
    <div class="card-right">
      <button class="btn-delete-card" title="Delete course">×</button>
      ${isViolated ? `<div class="warning-badge" title="Prerequisite mismatch — scheduled before or concurrently with requirements.">!</div>` : ""}
    </div>
  `;

  const nameInput = card.querySelector(".card-input-name");
  nameInput.addEventListener("change", (e) => store.updateCourseText(course.id, e.target.value));
  nameInput.addEventListener("keydown", (e) => { if (e.key === "Enter") nameInput.blur(); });
  
  const creditInput = card.querySelector(".credit-input");
  creditInput.addEventListener("change", (e) => store.updateCourseCredits(course.id, e.target.value));

  card.querySelector(".btn-delete-card").addEventListener("click", () => store.deleteCourse(course.id));

  // Explicitly trigger actions via primary click paths
  const handle = card.querySelector(".handle");
  handle.addEventListener("pointerdown", (e) => {
    // Stop event bubbling to prevent selection artifacts on underlying text blocks
    e.stopPropagation();
    startDrag(e, card, store);
  });

  return card;
}

function startDrag(e, cardNode, store) {
  if (e.button !== 0) return; // Ignore right clicks or auxiliary buttons
  e.preventDefault();
  
  const rect = cardNode.getBoundingClientRect();
  activeDrag = {
    id: cardNode.dataset.id,
    node: cardNode,
    offsetX: e.clientX - rect.left,
    offsetY: e.clientY - rect.top,
    store: store,
    pointerId: e.pointerId
  };

  ghostPlaceholder = document.createElement("div");
  ghostPlaceholder.className = "placeholder";
  ghostPlaceholder.style.height = `${rect.height}px`;
  cardNode.parentNode.insertBefore(ghostPlaceholder, cardNode);

  // Lock target layouts dimensions prior to popping standard positioning out-of-bounds
  cardNode.style.width = `${rect.width}px`;
  cardNode.style.height = `${rect.height}px`;
  cardNode.style.left = `${rect.left}px`;
  cardNode.style.top = `${rect.top}px`;
  cardNode.classList.add("dragging");
  
  // Direct Pointer Tracking Binding Pass
  cardNode.setPointerCapture(e.pointerId);
  cardNode.addEventListener("pointermove", onDrag);
  cardNode.addEventListener("pointerup", stopDrag);
  cardNode.addEventListener("pointercancel", stopDrag); // Safe-failsafe wrapper path for OS gestures
}

function onDrag(e) {
  if (!activeDrag) return;
  const node = activeDrag.node;
  
  // Reposition elements along exact viewport relative locations
  node.style.left = `${e.clientX - activeDrag.offsetX}px`;
  node.style.top = `${e.clientY - activeDrag.offsetY}px`;

  const target = findDropTarget(e.clientX, e.clientY);
  if (target && ghostPlaceholder) {
    if (target.beforeNode) {
      target.columnBody.insertBefore(ghostPlaceholder, target.beforeNode);
    } else {
      target.columnBody.appendChild(ghostPlaceholder);
    }
    ghostPlaceholder.style.display = "block";
  } else if (ghostPlaceholder) {
    ghostPlaceholder.style.display = "none";
  }
}

function stopDrag(e) {
  if (!activeDrag) return;
  const { node, id, store, pointerId } = activeDrag;
  
  node.removeEventListener("pointermove", onDrag);
  node.removeEventListener("pointerup", stopDrag);
  node.removeEventListener("pointercancel", stopDrag);
  
  try { node.releasePointerCapture(pointerId); } catch (err) {}

  const target = findDropTarget(e.clientX, e.clientY);
  if (target) {
    const beforeId = target.beforeNode ? target.beforeNode.dataset.id : null;
    store.reorderCard(id, target.columnId, beforeId);
  } else {
    store.notify(); // Triggers atomic structural layout reset to original positions
  }

  if (ghostPlaceholder && ghostPlaceholder.parentNode) {
    ghostPlaceholder.parentNode.removeChild(ghostPlaceholder);
  }

  node.classList.remove("dragging");
  node.style.width = "";
  node.style.height = "";
  node.style.left = "";
  node.style.top = "";
  
  activeDrag = null;
  ghostPlaceholder = null;
}

function findDropTarget(x, y) {
  const boardNode = document.getElementById("board");
  if (!boardNode) return null;

  const boardRect = boardNode.getBoundingClientRect();
  const paddingBuffer = 100; // Expanded vertical catchment threshold zone

  if (y < boardRect.top - paddingBuffer || y > boardRect.bottom + paddingBuffer) {
    return null; 
  }

  const columns = document.querySelectorAll(".column");
  let closestColumn = null;
  let minDistance = Infinity;

  for (let col of columns) {
    if (col.classList.contains("collapsed")) continue;
    const rect = col.getBoundingClientRect();
    if (x >= rect.left && x <= rect.right) {
      closestColumn = col;
      break;
    }
    const distance = Math.abs((rect.left + rect.width / 2) - x);
    if (distance < minDistance) {
      minDistance = distance;
      closestColumn = col;
    }
  }

  if (!closestColumn) return null;

  const body = closestColumn.querySelector(".col-body");
  const cards = body.querySelectorAll(".card:not(.dragging)");
  let beforeNode = null;

  for (let card of cards) {
    const rect = card.getBoundingClientRect();
    if (y < rect.top + rect.height / 2) {
      beforeNode = card;
      break;
    }
  }

  return {
    columnId: closestColumn.id,
    columnBody: body,
    beforeNode: beforeNode
  };
}

export function createColumn(colData, store, violations) {
  const col = document.createElement("div");
  col.className = `column ${colData.type === "summer" ? "summer" : "semester"}`;
  if (colData.collapsed) col.classList.add("collapsed");
  col.id = colData.id;

  const totalCredits = colData.courses.reduce((s, c) => s + parseFloat(c.credits || 0), 0);
  
  let gaugeHtml = "";
  if (colData.type === "semester") {
    let modeClass = "track";
    let textLabel = "on track";
    if (totalCredits < 12) { modeClass = "light"; textLabel = "light load"; }
    else if (totalCredits > 18) { modeClass = "heavy"; textLabel = "heavy load"; }
    
    const percentageFill = Math.min(100, (totalCredits / 22) * 100);
    gaugeHtml = `
      <div class="gauge-container">
        <div class="gauge-label">
          <span>${totalCredits} hrs · ${textLabel}</span>
        </div>
        <div class="gauge-bar">
          <div class="gauge-fill ${modeClass}" style="width: ${percentageFill}%"></div>
        </div>
      </div>
    `;
  } else {
    gaugeHtml = `<div class="summer-hours">${totalCredits} hrs</div>`;
  }

  col.innerHTML = `
    <div class="collapsed-title">${colData.title}</div>
    <div class="col-header">
      <div class="col-title-row">
        <div class="col-title">${colData.title}</div>
        <button class="col-delete" title="Delete Term">Remove</button>
      </div>
      <div style="display:flex; justify-content:space-between; align-items:flex-end; gap:0.5rem; min-height:24px;">
        ${gaugeHtml}
        ${colData.type === "summer" ? `<button class="summer-toggle">Collapse ⌃</button>` : ""}
      </div>
    </div>
    <div class="col-body"></div>
    <div class="col-footer">
      <button class="btn-add-course">+ Add course</button>
    </div>
  `;

  if (colData.type === "summer") {
    col.querySelector(".summer-toggle").addEventListener("click", (e) => {
      e.stopPropagation();
      store.toggleSummer(colData.id);
    });
    col.addEventListener("click", () => {
      if (col.classList.contains("collapsed")) store.toggleSummer(colData.id);
    });
  }

  let removeClicks = 0;
  let confirmTimer = null;
  const deleteBtn = col.querySelector(".col-delete");
  deleteBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    removeClicks++;
    if (removeClicks === 1) {
      deleteBtn.textContent = "Confirm?";
      confirmTimer = setTimeout(() => { removeClicks = 0; deleteBtn.textContent = "Remove"; }, 2500);
    } else if (removeClicks === 2) {
      clearTimeout(confirmTimer);
      store.deleteColumn(colData.id);
    }
  });

  col.querySelector(".btn-add-course").addEventListener("click", (e) => {
    e.stopPropagation();
    store.addCourse(colData.id);
  });

  const body = col.querySelector(".col-body");
  colData.courses.forEach(c => {
    body.appendChild(createCourseCard(c, store, violations.has(c.id)));
  });

  return col;
}

export function renderBoard(container, store) {
  container.innerHTML = "";
  const violations = store.getPrereqViolations();
  
  store.state.forEach(colData => {
    container.appendChild(createColumn(colData, store, violations));
  });

  const buttonWrapper = document.createElement("div");
  buttonWrapper.className = "add-column-buttons";
  buttonWrapper.innerHTML = `
    <button class="btn" id="addSemBtn">+ Add Semester</button>
    <button class="btn" id="addSumBtn">+ Add Summer</button>
  `;
  
  buttonWrapper.querySelector("#addSemBtn").addEventListener("click", () => store.addColumn("semester"));
  buttonWrapper.querySelector("#addSumBtn").addEventListener("click", () => store.addColumn("summer"));
  
  container.appendChild(buttonWrapper);
}
