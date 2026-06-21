// state.js

export const PREREQS = {
  "M 408D": ["M 408C"],
  "M 427J": ["M 408D"],
  "PHY 303L": ["PHY 303K"],
  "CH 302": ["CH 301"],
  "E M 319": ["E M 306"],
  "PGE 323L": ["PGE 323K"],
  "HIS 315L": ["HIS 315K"]
};

export const SUBJECT_MAP = [
  { test: /^PGE\b/i, abbrev: "PGE", label: "Petroleum (PGE)", color: "#BF5700", bg: "#FFF2E6" },
  { test: /^M\s?\d/i, abbrev: "MATH", label: "Math (M)", color: "#2E5C8A", bg: "#EEF4FA" },
  { test: /^PHY\b/i, abbrev: "PHYS", label: "Physics (PHY)", color: "#6B4E96", bg: "#F4F0FA" },
  { test: /^CH\s?\d/i, abbrev: "CHEM", label: "Chemistry (CH)", color: "#1F7A6B", bg: "#EEFAF7" },
  { test: /^E\s?M\b/i, abbrev: "E M", label: "Engr Mechanics", color: "#45607A", bg: "#F0F4F7" },
  { test: /^GEO\b/i, abbrev: "GEO", label: "Geosciences (GEO)", color: "#8B5E34", bg: "#FAF3EC" },
  { test: /^RHE\b/i, abbrev: "COMM", label: "Writing / Comm", color: "#8E3B46", bg: "#FCEFEF" },
  { test: /^Tech Area Elective/i, abbrev: "ELEC", label: "Tech Elective", color: "#6F5B96", bg: "#F5F0FB" },
  { test: /^(HIS|GOV|UGS|E\s?\d|Visual|Soc)/i, abbrev: "CORE", label: "Core Curriculum", color: "#8A7A3D", bg: "#FAF7EE" },
  { test: /.*/, abbrev: "—", label: "Other / Unsorted", color: "#6B7280", bg: "#F3F4F6" }
];

export const DEFAULT_PLAN = [
  { id: "s0", title: "Summer · Before Year 1", type: "summer", collapsed: true, courses: [] },
  { id: "s1", title: "Fall · Year 1", type: "semester", courses: [
    { text: "GEO 303 — Introduction to Geology", credits: 3 },
    { text: "CH 301 — Principles of Chemistry I", credits: 3 },
    { text: "M 408C — Differential & Integral Calculus", credits: 4 },
    { text: "RHE 306 — Rhetoric and Writing", credits: 3 },
    { text: "UGS 302 — First-Year Signature Course", credits: 3 }
  ]},
  { id: "s2", title: "Spring · Year 1", type: "semester", courses: [
    { text: "PHY 303K — Engineering Physics I", credits: 3 },
    { text: "PHY 105M — Laboratory For Physics I", credits: 1 },
    { text: "M 408D — Sequences, Series, and Multivariable", credits: 4 },
    { text: "PGE 301 — Introduction to Petroleum Engineering", credits: 3 },
    { text: "CH 302 — Principles of Chemistry II", credits: 3 },
    { text: "Social & Behavioral Sciences", credits: 3 }
  ]},
  { id: "s3", title: "Summer · Year 1", type: "summer", collapsed: true, courses: [] },
  { id: "s4", title: "Fall · Year 2", type: "semester", courses: [
    { text: "PHY 303L — Engineering Physics II", credits: 3 },
    { text: "PHY 105N — Laboratory For Physics II", credits: 1 },
    { text: "E M 306 — Statics", credits: 3 },
    { text: "M 427J — Differential Equations with Linear Algebra", credits: 4 },
    { text: "PGE 311 — Numerical Methods and Data Visualization", credits: 3 },
    { text: "PGE 326 — Thermodynamics & Phase Behavior", credits: 3 }
  ]},
  { id: "s5", title: "Spring · Year 2", type: "semester", courses: [
    { text: "GEO 316P — Sedimentary Rocks", credits: 3 },
    { text: "E M 319 — Mechanics of Solids", credits: 3 },
    { text: "PGE 333T — Engineering Communication", credits: 3 },
    { text: "PGE 427 — Properties of Petroleum Fluids", credits: 4 },
    { text: "Visual & Performing Arts", credits: 3 }
  ]},
  { id: "s6", title: "Summer · Year 2", type: "summer", collapsed: true, courses: [] },
  { id: "s7", title: "Fall · Year 3", type: "semester", courses: [
    { text: "PGE 323K — Reservoir Engineering I: Primary Recovery", credits: 3 },
    { text: "PGE 424 — Drilling and Well Completions", credits: 4 },
    { text: "PGE 430 — Well Logging and Transport Phenomena", credits: 4 },
    { text: "PGE 322K — Transport Phenomena in PGE", credits: 3 },
    { text: "GOV 310L — American Government", credits: 3 }
  ]},
  { id: "s8", title: "Spring · Year 3", type: "semester", courses: [
    { text: "PGE 323L — Reservoir Engineering II: Secondary Recovery", credits: 3 },
    { text: "PGE 358 — Principles of Well Logging", credits: 3 },
    { text: "PGE 362 — Production Engineering & Well Performance", credits: 3 },
    { text: "PGE 338 — Integrated Carbon Geostorage Engineering", credits: 3 },
    { text: "HIS 315K — United States History I", credits: 3 }
  ]},
  { id: "s9", title: "Summer · Year 3", type: "summer", collapsed: true, courses: [] },
  { id: "s10", title: "Fall · Year 4", type: "semester", courses: [
    { text: "PGE 334 — Reservoir Engineering III", credits: 3 },
    { text: "PGE 365 — Resource Economics & Valuation", credits: 3 },
    { text: "Tech Area Elective", credits: 3 },
    { text: "Tech Area Elective", credits: 3 },
    { text: "GOV 312L — Issues & Policies in American Government", credits: 3 }
  ]},
  { id: "s11", title: "Spring · Year 4", type: "semester", courses: [
    { text: "PGE 373L — Senior Capstone Design Project", credits: 3 },
    { text: "Tech Area Elective", credits: 3 },
    { text: "Tech Area Elective", credits: 3 },
    { text: "E 316 — Masterworks of Literature", credits: 3 },
    { text: "HIS 315L — United States History II", credits: 3 }
  ]}
];

export class PlanStore {
  constructor() {
    this.listeners = [];
    this.statusListeners = [];
    this.saveTimeout = null;
    this.loadState();
  }

  loadState() {
    try {
      const stored = localStorage.getItem("bspe_planner_data");
      if (stored) {
        this.state = JSON.parse(stored);
        // Ensure initialized summer columns with courses stay open
        this.state.forEach(col => {
          if (col.type === "summer" && col.courses.length > 0) {
            col.collapsed = false;
          }
        });
      } else {
        this.state = JSON.parse(JSON.stringify(DEFAULT_PLAN));
      }
    } catch (e) {
      this.state = JSON.parse(JSON.stringify(DEFAULT_PLAN));
    }
  }

  saveState() {
    if (this.saveTimeout) clearTimeout(this.saveTimeout);
    this.notifyStatus("Saving…");
    this.saveTimeout = setTimeout(() => {
      try {
        localStorage.setItem("bspe_planner_data", JSON.stringify(this.state));
        this.notifyStatus("Saved");
      } catch (e) {
        this.notifyStatus("Autosave Failed");
      }
    }, 700);
  }

  subscribe(cb) { this.listeners.push(cb); }
  subscribeStatus(cb) { this.statusListeners.push(cb); }
  notify() { this.listeners.forEach(cb => cb()); }
  notifyStatus(text) { this.statusListeners.forEach(cb => cb(text)); }

  resetToDefault() {
    this.state = JSON.parse(JSON.stringify(DEFAULT_PLAN));
    this.saveState();
    this.notify();
  }

  getCourseCode(text) {
    if (!text) return "";
    const clean = text.replace(/\([^)]*\)/g, "").trim();
    const parts = clean.split(/[—-]/);
    return parts[0].trim();
  }

  getSubjectConfig(text) {
    const code = this.getCourseCode(text);
    return SUBJECT_MAP.find(s => s.test.test(code || text)) || SUBJECT_MAP[SUBJECT_MAP.length - 1];
  }

  getTotalCredits() {
    return this.state.reduce((sum, col) => sum + col.courses.reduce((s, c) => s + parseFloat(c.credits || 0), 0), 0);
  }

  getColumnCredits(colId) {
    const col = this.state.find(c => c.id === colId);
    return col ? col.courses.reduce((s, c) => s + parseFloat(c.credits || 0), 0) : 0;
  }

  generateId() { return "c_" + Math.random().toString(36).substr(2, 9); }
  generateColId() { return "col_" + Math.random().toString(36).substr(2, 9); }

  addCourse(colId) {
    const col = this.state.find(c => c.id === colId);
    if (col) {
      col.courses.push({ id: this.generateId(), text: "NEW 101 — Course Title", credits: 3 });
      this.saveState();
      this.notify();
    }
  }

  deleteCourse(courseId) {
    this.state.forEach(col => {
      col.courses = col.courses.filter(c => c.id !== courseId);
    });
    this.saveState();
    this.notify();
  }

  addColumn(type) {
    const count = this.state.filter(c => c.type === type).length + 1;
    const label = type === "summer" ? `Summer · Added ${count}` : `Added Term ${count}`;
    this.state.push({
      id: this.generateColId(),
      title: label,
      type: type,
      collapsed: false,
      courses: []
    });
    this.saveState();
    this.notify();
  }

  deleteColumn(colId) {
    this.state = this.state.filter(c => c.id !== colId);
    this.saveState();
    this.notify();
  }

  toggleSummer(colId) {
    const col = this.state.find(c => c.id === colId);
    if (col && col.type === "summer") {
      col.collapsed = !col.collapsed;
      this.notify();
    }
  }

  updateCourseText(courseId, newText) {
    this.state.forEach(col => {
      const target = col.courses.find(c => c.id === courseId);
      if (target) target.text = newText;
    });
    this.saveState();
    this.notify();
  }

  updateCourseCredits(courseId, credits) {
    const clamped = Math.max(0, Math.min(12, parseFloat(credits) || 0));
    this.state.forEach(col => {
      const target = col.courses.find(c => c.id === courseId);
      if (target) target.credits = clamped;
    });
    this.saveState();
    this.notify();
  }

  getPrereqViolations() {
    const violations = new Set();
    const courseSemesters = new Map();

    this.state.forEach((col, colIdx) => {
      col.courses.forEach(c => {
        const code = this.getCourseCode(c.text);
        if (code) courseSemesters.set(code, colIdx);
      });
    });

    this.state.forEach((col, colIdx) => {
      col.courses.forEach(c => {
        const code = this.getCourseCode(c.text);
        const requirements = PREREQS[code] || [];
        requirements.forEach(req => {
          if (courseSemesters.has(req)) {
            const reqIdx = courseSemesters.get(req);
            if (reqIdx >= colIdx) violations.add(c.id);
          }
        });
      });
    });

    return violations;
  }

  // Multiset count calculations for Restorations
  getMissingCoursesCount() {
    const currentCounts = new Map();
    this.state.forEach(col => {
      col.courses.forEach(c => {
        const key = `${col.title}::${c.text.trim()}::${c.credits}`;
        currentCounts.set(key, (currentCounts.get(key) || 0) + 1);
      });
    });

    let missing = 0;
    DEFAULT_PLAN.forEach(defaultCol => {
      const activeCol = this.state.find(c => c.title === defaultCol.title);
      if (!activeCol) return; // Skip if entire column was removed

      defaultCol.courses.forEach(c => {
        const key = `${defaultCol.title}::${c.text.trim()}::${c.credits}`;
        const defaultCount = DEFAULT_PLAN.filter(dc => dc.title === defaultCol.title)
          .reduce((sum, dcol) => sum + dcol.courses.filter(dc => dc.text.trim() === c.text.trim() && dc.credits === c.credits).length, 0);
        
        const activeCount = currentCounts.get(key) || 0;
        if (activeCount < defaultCount) {
          missing += (defaultCount - activeCount);
          currentCounts.set(key, defaultCount); // Prevent double tracking items inside loop
        }
      });
    });

    return missing;
  }

  restoreMissingCourses() {
    const currentCounts = new Map();
    this.state.forEach(col => {
      col.courses.forEach(c => {
        const key = `${col.title}::${c.text.trim()}::${c.credits}`;
        currentCounts.set(key, (currentCounts.get(key) || 0) + 1);
      });
    });

    let counter = 0;
    DEFAULT_PLAN.forEach(defaultCol => {
      const activeCol = this.state.find(c => c.title === defaultCol.title);
      if (!activeCol) return;

      defaultCol.courses.forEach(c => {
        const key = `${defaultCol.title}::${c.text.trim()}::${c.credits}`;
        const activeCount = currentCounts.get(key) || 0;

        const defaultCount = defaultCol.courses.filter(dc => dc.text.trim() === c.text.trim() && dc.credits === c.credits).length;

        if (activeCount < defaultCount) {
          activeCol.courses.push({
            id: this.generateId(),
            text: c.text,
            credits: c.credits
          });
          currentCounts.set(key, activeCount + 1);
          counter++;
        }
      });
    });

    if (counter > 0) {
      this.saveState();
      this.notify();
    }
  }

  optimizeSchedule() {
    let movedCount = 0;
    let loopGuard = 0;
    let stateChanged = true;

    // Isolate regular targets, strictly ensuring summer terms are no-ops
    const semesters = this.state.filter(c => c.type === "semester");

    // Check if the current layout matches the default baseline (No-Op Constraint Check)
    const matchesDefault = JSON.stringify(this.state.map(s => s.courses.map(c => c.text))) === 
                           JSON.stringify(DEFAULT_PLAN.map(s => s.courses.map(c => c.text)));
    if (matchesDefault) {
      this.notifyStatus("Already balanced.");
      return;
    }

    while (stateChanged && loopGuard < 15) {
      stateChanged = false;
      loopGuard++;

      // Downstream Balancing Loop (> 18 credits)
      for (let i = 0; i < semesters.length - 1; i++) {
        let load = semesters[i].courses.reduce((s, c) => s + c.credits, 0);
        if (load > 18) {
          const popped = semesters[i].courses.pop();
          semesters[i + 1].courses.unshift(popped);
          movedCount++;
          stateChanged = true;
          break;
        }
      }

      // Upstream Balancing Loop (< 12 credits)
      if (!stateChanged) {
        for (let i = semesters.length - 1; i > 0; i--) {
          let load = semesters[i].courses.reduce((s, c) => s + c.credits, 0);
          if (load < 12 && semesters[i].courses.length > 0) {
            // Find first historical dependency-safe card candidate
            let candidateIdx = -1;
            for (let j = 0; j < semesters[i - 1].courses.length; j++) {
              candidateIdx = j;
              break;
            }

            if (candidateIdx !== -1) {
              const pulled = semesters[i - 1].courses.splice(candidateIdx, 1)[0];
              semesters[i].courses.push(pulled);
              movedCount++;
              stateChanged = true;
              break;
            }
          }
        }
      }

      // Rollback optimization paths immediately if prerequisite violations are generated
      if (this.getPrereqViolations().size > 0) {
        this.loadState();
        this.notifyStatus("Optimization halted: Prerequisite conflict");
        return;
      }
    }

    if (movedCount > 0) {
      this.saveState();
      this.notify();
      this.notifyStatus(`Moved ${movedCount} courses ✓`);
    } else {
      this.notifyStatus("Already balanced.");
    }
  }

  copyAsText(btnNode) {
    let output = "PETROLEUM ENGINEERING BSPE PLAN OF STUDY\n========================================\n\n";
    this.state.forEach(col => {
      if (col.type === "summer" && col.courses.length === 0) return;
      const hours = col.courses.reduce((s, c) => s + c.credits, 0);
      output += `${col.title} (${hours} Credits)\n`;
      col.courses.forEach(c => {
        output += `  - ${c.text} (${c.credits} cr)\n`;
      });
      output += "\n";
    });
    output += `GRAND TOTAL PLANNED: ${this.getTotalCredits()} HRS\n`;

    const triggerFallback = (text) => {
      const area = document.createElement("textarea");
      area.value = text;
      document.body.appendChild(area);
      area.select();
      document.execCommand("copy");
      document.body.removeChild(area);
    };

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(output)
        .then(() => this.toggleCopyStatus(btnNode))
        .catch(() => { triggerFallback(output); this.toggleCopyStatus(btnNode); });
    } else {
      triggerFallback(output);
      this.toggleCopyStatus(btnNode);
    }
  }

  toggleCopyStatus(node) {
    const base = node.textContent;
    node.textContent = "Copied ✓";
    setTimeout(() => node.textContent = base, 1500);
  }

  reorderCard(courseId, targetColId, beforeCourseId) {
    let foundCard = null;
    this.state.forEach(col => {
      const idx = col.courses.findIndex(c => c.id === courseId);
      if (idx !== -1) foundCard = col.courses.splice(idx, 1)[0];
    });

    if (!foundCard) return;

    const targetCol = this.state.find(c => c.id === targetColId);
    if (beforeCourseId) {
      const insertIdx = targetCol.courses.findIndex(c => c.id === beforeCourseId);
      targetCol.courses.splice(insertIdx, 0, foundCard);
    } else {
      targetCol.courses.push(foundCard);
    }
    
    // Automatically expand a summer column if a course is dropped into it
    if (targetCol.type === "summer") targetCol.collapsed = false;

    this.saveState();
    this.notify();
  }
}
