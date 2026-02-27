# D Train (AI Demos) Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add the D Train (AI Demos) line to the subway navigation system with 4 stations and updated arrival times for all lines.

**Architecture:** Data-driven — add entries to `lines.js` and `stations.js`, update `ArrivalBoard.jsx` for arrival times and gold bullet text color. The rendering is automatic from data.

**Tech Stack:** React, JavaScript (data files + JSX component)

**Design Doc:** `docs/plans/2026-02-27-d-train-design.md`

---

### Task 1: Add D Train stations to stations.js

**Files:**
- Modify: `src/data/stations.js`

**Step 1: Add 4 new station entries**

Add these entries to the `stations` object, before the S Train stations (imu-le, golf-modeling, etc.):

```js
'wonyp': {
  id: 'wonyp',
  name: 'WONYP',
  fullName: "What's on your Plate?",
  position: 10,
  description: 'LLM-driven Indian Food Analysis',
  url: '/wonyp',
},
'gpt-bhojan': {
  id: 'gpt-bhojan',
  name: 'GPT-Bhojan',
  position: 20,
  description: 'LLM-augmented Indian Food Classification',
},
'vm-claude': {
  id: 'vm-claude',
  name: 'VM Claude',
  position: 30,
  description: 'Claude plays games in the cloud',
},
'ai-professor': {
  id: 'ai-professor',
  name: 'AI Professor',
  position: 40,
  description: 'A Robot Teacher just for you',
},
```

**Step 2: Verify no syntax errors**

Run: `cd "/home/vivekkarmarkar/Python Files/personal-website" && npx vite build --mode development 2>&1 | head -5`
Expected: No errors

**Step 3: Commit**

```bash
git add src/data/stations.js
git commit -m "Add D Train stations: WONYP, GPT-Bhojan, VM Claude, AI Professor"
```

---

### Task 2: Add D Train line to lines.js

**Files:**
- Modify: `src/data/lines.js`

**Step 1: Add D Train entry to the lines object**

Add after the E Train entry:

```js
D: {
  id: 'D',
  name: 'D Train',
  fullName: 'AI Demos',
  description: 'Applied AI project demos from mainstream to sci-fi',
  direction: 'AI Island Local',
  color: 'mta-gold',
  colorHex: '#FCCC0A',
  stations: ['wonyp', 'gpt-bhojan', 'vm-claude', 'ai-professor'],
},
```

**Step 2: Update lineOrder**

Change:
```js
export const lineOrder = ['P', 'A', 'E', 'G', 'S', 'F'];
```

To:
```js
export const lineOrder = ['P', 'A', 'E', 'D', 'G', 'S', 'F'];
```

**Step 3: Verify no syntax errors**

Run: `cd "/home/vivekkarmarkar/Python Files/personal-website" && npx vite build --mode development 2>&1 | head -5`
Expected: No errors

**Step 4: Commit**

```bash
git add src/data/lines.js
git commit -m "Add D Train (AI Demos) line definition and update lineOrder"
```

---

### Task 3: Update ArrivalBoard — arrival times and gold bullet

**Files:**
- Modify: `src/components/ArrivalBoard.jsx`

**Step 1: Update arrival times in LineRow**

Find this line (~119):
```js
const arrivalTime = line.id === 'P' ? 2 : line.id === 'A' ? 5 : 3;
```

Replace with:
```js
const arrivalTimes = { D: 1, E: 2, G: 2, S: 2, F: 3, P: 5, A: 7 };
const arrivalTime = arrivalTimes[line.id] || 3;
```

**Step 2: Update LineBullet text color for gold background**

Find this line (~18):
```jsx
<span className="text-white">{line.id}</span>
```

Replace with:
```jsx
<span className={line.id === 'D' ? 'text-black' : 'text-white'}>{line.id}</span>
```

**Step 3: Verify dev server renders correctly**

Run: `cd "/home/vivekkarmarkar/Python Files/personal-website" && npm run dev`
Check: Open browser, expand arrival board, verify D Train appears with gold bullet and black text, all arrival times updated.

**Step 4: Commit**

```bash
git add src/components/ArrivalBoard.jsx
git commit -m "Update arrival times for all lines and add gold bullet styling for D Train"
```

---

### Task 4: Visual verification

**Step 1: Run dev server and verify**

Check each of these:
- [ ] D Train appears in arrival board between E and G
- [ ] Gold bullet with black "D" text
- [ ] Arrival time shows "1 min"
- [ ] Expanding D Train shows 4 stations on the track
- [ ] WONYP station is clickable (has URL), other 3 are not
- [ ] All other lines show updated arrival times (P=5, A=7, E=2, G=2, S=2, F=3)
- [ ] No console errors

**Step 2: Final commit if any fixes needed**
