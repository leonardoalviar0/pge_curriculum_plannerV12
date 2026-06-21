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

const initialData = [
  { id: "sem_0", title: "Fall · Year 1", courses: [
    { id: "c1", text: "M 408C — Calculus I", credits: 4 },
    { id: "c2", text: "CH 301 — Chemistry I", credits: 3 },
    { id: "c3", text: "UGS 302 — Signature Course", credits: 3 }
  ]},
  { id: "sem_1", title: "Spring · Year 1", courses: [
    { id: "c4", text: "M 408D — Calculus II", credits: 4 },
    { id: "c5", text: "PHY 303K — Physics I", credits: 3 },
    { id: "c6", text: "CH 302 — Chemistry II", credits: 3 }
  ]},
  { id: "sem_2", title: "Fall · Year 2", courses: [
    { id: "c7", text: "M 427J — Diff Equations", credits: 4 },
    { id: "c8", text: "PHY 303L — Physics II", credits: 3 },
    { id: "c9", text: "E M 306 — Statics", credits: 3 }
  ]},
  { id: "sem_3", title: "Spring · Year 2", courses: [
    { id: "c10", text: "E M 319 — Mech of Solids", credits: 3 },
    { id: "c11", text: "PGE 323K — Reservoir I", credits: 3 }
  ]},
  { id: "sem_4", title: "Fall · Year 3", courses: [
    { id: "c12", text: "PGE 323L — Reservoir II", credits: 3 }
  ]}
];

export class PlanStore {
  constructor() {
    const saved = localStorage.getItem('modular-pge-planner');
    this.state = saved ? JSON.parse(saved) : initialData;
    this.listeners = [];
  }

  subscribe(listener) { this.listeners.push(listener); }
  
  notify() {
    localStorage.setItem('modular-pge-planner', JSON.stringify(this.state));
    this.listeners.forEach(cb => cb());
  }

  getCourseCode(text) {
    return text.split('—')[0].trim();
  }

  moveCourse(courseId, targetColumnId) {
    let movingCourse = null;
    this.state.forEach(col => {
      const idx = col.courses.findIndex(c => c.id === courseId);
      if (idx !== -1) movingCourse = col.courses.splice(idx, 1)[0];
    });
    
    if (movingCourse) {
      const targetCol = this.state.find(col => col.id === targetColumnId);
      if (targetCol) targetCol.courses.push(movingCourse);
    }
    this.notify();
  }

  // --- REQ 4 Implementation: Comprehensive Prerequisite Sequencing Optimization ---
  optimizeAndFixSequencing() {
    let maxIterations = 10; 
    let shiftsMade = true;

    while (shiftsMade && maxIterations > 0) {
      shiftsMade = false;
      maxIterations--;

      // Build global lookup map
      const coursePositions = new Map(); // code -> semesterIndex
      this.state.forEach((col, sIdx) => {
        col.courses.forEach(c => {
          coursePositions.set(this.getCourseCode(c.text), sIdx);
        });
      });

      // Loop through checking sequence constraints
      for (let i = 0; i < this.state.length; i++) {
        const col = this.state[i];
        for (let j = col.courses.length - 1; j >= 0; j--) {
          const course = col.courses[j];
          const code = this.getCourseCode(course.text);
          const reqs = PREREQS[code] || [];

          // Find if any prereq is scheduled concurrently or later
          let violationIndex = -1;
          reqs.forEach(reqCode => {
            if (coursePositions.has(reqCode)) {
              const reqSemIdx = coursePositions.get(reqCode);
              if (reqSemIdx >= i) {
                violationIndex = Math.max(violationIndex, reqSemIdx);
              }
            }
          });

          // If a sequence issue is found, shift this course directly after its prerequisite
          if (violationIndex !== -1) {
            const targetSemIdx = Math.min(violationIndex + 1, this.state.length - 1);
            if (targetSemIdx !== i) {
              const moved = col.courses.splice(j, 1)[0];
              this.state[targetSemIdx].courses.push(moved);
              shiftsMade = true;
              break; 
            }
          }
        }
        if (shiftsMade) break;
      }
    }

    // Secondary load balancing phase (Credits caps: 12 - 18)
    this.balanceLoads();
    this.notify();
  }

  balanceLoads() {
    const CAP = 18;
    for (let i = 0; i < this.state.length - 1; i++) {
      let currentLoad = this.state[i].courses.reduce((s, c) => s + c.credits, 0);
      while (currentLoad > CAP && this.state[i].courses.length > 0) {
        const popped = this.state[i].courses.pop();
        this.state[i+1].courses.unshift(popped);
        currentLoad = this.state[i].courses.reduce((s, c) => s + c.credits, 0);
      }
    }
  }
}