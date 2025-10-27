# CLAUDE.md - Development Guide for Piano Chord Platform

**Version:** 3.0.0
**Last Updated:** October 27, 2025
**Purpose:** Systematic development guidelines for working with Claude Code on this project

---

## Table of Contents

1. [Project Vision & Philosophy](#project-vision--philosophy)
2. [Architecture Overview](#architecture-overview)
3. [File Structure & Organization](#file-structure--organization)
4. [Code Organization Principles](#code-organization-principles)
5. [Development Workflow with Claude Code](#development-workflow-with-claude-code)
6. [Feature Addition Process](#feature-addition-process)
7. [Testing & Validation Approach](#testing--validation-approach)
8. [Git Workflow & Version Control](#git-workflow--version-control)
9. [Naming Conventions](#naming-conventions)
10. [Performance Guidelines](#performance-guidelines)
11. [Debugging Guide](#debugging-guide)
12. [Common Patterns & Anti-Patterns](#common-patterns--anti-patterns)

---

## Project Vision & Philosophy

### What This Platform Is
- A **minimal, focused** piano chord practice tool
- **Clean, professional** interface with zero visual clutter
- **Offline-first** Progressive Web App
- **Simple and intentional** - every feature must justify its existence

### What This Platform Is Not
- Not a gamified app with points/badges
- Not a comprehensive music theory teacher
- Not a virtual instrument or synthesizer
- Not a social platform or community tool

### Design Principles
1. **Minimalism First**: Start with less, add intentionally
2. **Professional Aesthetic**: Black, white, grey - no bright colors or playful elements
3. **User Control**: Users choose how they practice, we provide tools
4. **Performance Matters**: Keep it fast, lightweight, responsive
5. **Offline Capable**: Full functionality without internet connection

---

## Architecture Overview

### Technology Stack
- **Frontend**: Vanilla JavaScript (ES6+), no frameworks
- **Styling**: Pure CSS, no preprocessors
- **Build**: None - direct file serving
- **Hosting**: Static files (GitHub Pages, Netlify, Vercel, etc.)
- **PWA**: Service Worker for offline capability

### Why Vanilla JavaScript?
- **Zero dependencies** = Zero maintenance overhead
- **Full control** over every line of code
- **Performance** - no framework bloat
- **Learning** - understand fundamentals deeply
- **Longevity** - won't break when frameworks change

### Application Flow
```
[Splash Screen]
    ↓ (User clicks "Enter")
[Practice Page]
    ├─ Chord Display (name, optional details)
    ├─ Control Buttons (Start/Pause, Skip)
    └─ Minimal Settings (chord type selection)
```

---

## File Structure & Organization

```
chord-master-app-v3/
│
├── index.html              # Main HTML structure, all UI markup
├── manifest.webmanifest    # PWA configuration
├── sw.js                   # Service Worker (offline caching)
├── README.md               # User-facing documentation
├── CLAUDE.md               # This file - developer guide
│
├── assets/
│   ├── css/
│   │   └── main.css        # All styles, organized by component
│   │
│   ├── js/
│   │   └── app.js          # All JavaScript, organized by function
│   │
│   ├── fonts/
│   │   ├── fonts.css       # Font-face declarations
│   │   └── *.woff2         # EB Garamond font files
│   │
│   └── audio/
│       └── piano/          # Piano samples (for future features)
│           └── trimmed_mp3_files/
│
└── *.png                   # PWA icons (192, 512, apple-touch)
```

### File Responsibilities

**index.html**
- Document structure and semantic markup
- All UI components and layout
- NO inline styles (use classes)
- NO inline JavaScript (use onclick handlers calling global functions)

**app.js**
- Global state management
- Chord generation logic
- Event handlers and UI updates
- Settings persistence (localStorage)
- Service Worker registration

**main.css**
- Component-based organization (splash, header, chord-display, etc.)
- Mobile-first responsive design
- CSS custom properties for theming
- Print styles if needed

**sw.js**
- Cache management (app shell, runtime, fonts, audio)
- Offline-first fetch strategies
- Version management for updates

---

## Code Organization Principles

### JavaScript Organization (app.js)

**Recommended Structure:**
```javascript
// ============================================
// GLOBAL STATE
// ============================================
let currentChord = null;
let isPracticing = false;
// ... other state variables

// ============================================
// CONSTANTS & CONFIGURATION
// ============================================
const CHORD_DEFINITIONS = { ... };
const NOTES = ['C', 'C#', 'D', ... ];

// ============================================
// CORE LOGIC - CHORD GENERATION
// ============================================
function generateChord() { ... }
function getChordDescription() { ... }

// ============================================
// UI UPDATES
// ============================================
function displayChord() { ... }
function updateChordDisplay() { ... }

// ============================================
// EVENT HANDLERS
// ============================================
function togglePractice() { ... }
function skipChord() { ... }

// ============================================
// SETTINGS & PERSISTENCE
// ============================================
function saveSettings() { ... }
function loadSettings() { ... }

// ============================================
// UTILITY FUNCTIONS
// ============================================
function showToast() { ... }

// ============================================
// INITIALIZATION
// ============================================
window.addEventListener('load', () => { ... });

// ============================================
// GLOBAL EXPORTS (for HTML onclick)
// ============================================
window.togglePractice = togglePractice;
window.skipChord = skipChord;
```

### CSS Organization (main.css)

**Recommended Structure:**
```css
/* ============================================
   CSS CUSTOM PROPERTIES (Variables)
   ============================================ */
:root { ... }

/* ============================================
   RESET & BASE STYLES
   ============================================ */
*, *::before, *::after { ... }
body { ... }

/* ============================================
   TYPOGRAPHY
   ============================================ */
h1, h2, h3 { ... }

/* ============================================
   LAYOUT COMPONENTS
   ============================================ */
.container { ... }
.header { ... }

/* ============================================
   SPLASH PAGE
   ============================================ */
.splash-container { ... }

/* ============================================
   PRACTICE PAGE
   ============================================ */
.chord-display { ... }

/* ============================================
   MODALS & OVERLAYS
   ============================================ */
.modal { ... }

/* ============================================
   BUTTONS & CONTROLS
   ============================================ */
.button { ... }

/* ============================================
   UTILITIES
   ============================================ */
.hidden { ... }

/* ============================================
   RESPONSIVE DESIGN
   ============================================ */
@media (max-width: 768px) { ... }
```

---

## Development Workflow with Claude Code

### Step 1: Define the Goal Clearly
Before starting any development session:
- Write down EXACTLY what you want to achieve
- Define success criteria (what does "done" look like?)
- Identify any constraints or requirements

**Example:**
> "Add a simple setting to let users choose chord display duration. Success = users can set 3s, 5s, or 10s intervals. Constraint = must persist across sessions."

### Step 2: Research Existing Code
Before asking Claude to make changes:
- Read the relevant sections of code
- Understand what's already there
- Identify what needs to change vs. what can stay

### Step 3: Plan Mode First (for complex changes)
- Use plan mode to get a full picture before execution
- Ask clarifying questions if needed
- Review the plan before approving

### Step 4: Implement Incrementally
- Make one logical change at a time
- Test after each change
- Don't stack multiple features in one session

### Step 5: Test Thoroughly
- Open in browser, test all affected functionality
- Check mobile responsiveness (DevTools device mode)
- Test edge cases (empty states, errors, etc.)

### Step 6: Commit Meaningfully
- Write clear commit messages
- Commit working code, not broken intermediate states
- Reference what changed and why

---

## Feature Addition Process

### Template for Adding Features

**1. Feature Definition**
```markdown
Feature: [Name]
Purpose: [Why does this exist?]
User Value: [What does the user gain?]
Complexity: [Low/Medium/High]
```

**2. Design Decisions**
- Where does it fit in the UI?
- What state does it need?
- What settings/configuration?
- How does it persist (if needed)?

**3. Implementation Checklist**
- [ ] HTML markup added
- [ ] CSS styles added
- [ ] JavaScript logic added
- [ ] Event handlers wired up
- [ ] Settings persistence (if applicable)
- [ ] Responsive design verified
- [ ] Edge cases handled
- [ ] Tested on real device

**4. Documentation**
- [ ] README.md updated (if user-facing)
- [ ] CLAUDE.md updated (if architecture changed)
- [ ] Code comments added (for complex logic)
- [ ] Version history updated

---

## Testing & Validation Approach

### Manual Testing Checklist

**Every Time You Make Changes:**
1. **Visual Check**: Does it look right?
2. **Functionality Check**: Does it work as expected?
3. **Responsive Check**: Does it work on mobile (375px width)?
4. **Edge Cases**: Empty states, long text, rapid clicking?
5. **Persistence Check**: Do settings survive page reload?

### Browser Testing
- **Primary**: Chrome/Edge (Chromium)
- **Secondary**: Firefox
- **Mobile**: Safari iOS, Chrome Android

### Testing in Browser Console
```javascript
// Quick validation script
console.log('Current Chord:', currentChord);
console.log('Is Practicing:', isPracticing);
console.log('Settings:', localStorage.getItem('chordMasterSettings'));
```

### Offline Testing
1. Open DevTools → Network tab
2. Check "Offline" checkbox
3. Reload page - should work fully offline
4. If broken: check sw.js cache list

---

## Git Workflow & Version Control

### Branch Strategy
```
main (production)
  ↓
feature/[feature-name] (for new features)
  ↓
  merged back to main when complete
```

### Commit Message Format
```
Type: Brief description (50 chars max)

Detailed explanation if needed (wrap at 72 chars):
- What changed
- Why it changed
- Any breaking changes or migration notes
```

**Types:**
- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation only
- `style:` CSS/formatting changes
- `refactor:` Code restructuring, no behavior change
- `perf:` Performance improvement
- `test:` Adding tests
- `chore:` Maintenance (deps, build, etc.)

**Examples:**
```
feat: Add display mode toggle (Full/Minimal)

Users can now switch between full chord display (C Major - Root
Position) and minimal display (C) via a toggle button in settings.
Setting persists via localStorage.

---

fix: Prevent chord skip when practice is paused

Skip button now checks isPracticing state before advancing to
next chord. Prevents confusion when user pauses session.

---

docs: Update README with new display mode feature

Added section explaining Full vs Minimal display modes and how
to toggle between them.
```

### Version Numbering
- **Major** (v3.0.0 → v4.0.0): Complete redesign, breaking changes
- **Minor** (v3.0.0 → v3.1.0): New features, backwards compatible
- **Patch** (v3.0.0 → v3.0.1): Bug fixes, tiny improvements

---

## Naming Conventions

### JavaScript

**Variables:**
- `camelCase` for regular variables: `currentChord`, `isPracticing`
- `UPPER_SNAKE_CASE` for constants: `CHORD_DEFINITIONS`, `DEFAULT_SPEED`

**Functions:**
- `camelCase` verbs: `generateChord()`, `displayChord()`, `saveSettings()`
- Event handlers: `onClick`, `onSubmit`, `handleClick`

**Boolean Variables:**
- Prefix with `is`, `has`, `should`: `isPracticing`, `hasSettings`, `shouldShow`

### CSS

**Classes:**
- `kebab-case`: `.chord-display`, `.settings-modal`, `.button-primary`
- BEM methodology for complex components:
  - Block: `.chord-display`
  - Element: `.chord-display__name`
  - Modifier: `.chord-display--minimal`

**IDs:**
- `kebab-case`: `#chord-name`, `#settings-modal`
- Use sparingly (prefer classes)

### Files
- `kebab-case`: `main.css`, `service-worker.js`
- Descriptive names: `chord-definitions.js` not `data.js`

---

## Performance Guidelines

### Keep It Fast

**JavaScript:**
- Cache DOM queries: `const display = document.getElementById('chord-display');`
- Debounce/throttle event handlers if firing frequently
- Use event delegation for lists
- Minimize reflows/repaints (batch DOM updates)

**CSS:**
- Avoid deep nesting (max 3 levels)
- Use efficient selectors (classes over complex combinators)
- Minimize use of expensive properties (box-shadow, filters)
- Use `transform` and `opacity` for animations (GPU accelerated)

**Assets:**
- Compress images (use WebP if possible)
- Minimize audio file sizes
- Use woff2 fonts only (best compression)
- Lazy load non-critical assets

### Performance Budget
- Initial load: < 500KB total
- Time to Interactive: < 2s on 3G
- Lighthouse Performance score: > 90

---

## Debugging Guide

### Common Issues & Solutions

**Issue: "Service Worker not updating"**
- Solution: Increment `SW_VERSION` in sw.js
- Verify: DevTools → Application → Service Workers → "Update on reload"

**Issue: "Styles not applying"**
- Check: Specificity (is another rule overriding?)
- Check: Typos in class names (HTML vs CSS)
- Check: Browser cache (hard refresh: Ctrl+Shift+R)

**Issue: "Settings not persisting"**
- Check: localStorage quota (shouldn't be an issue for small app)
- Check: Private browsing mode (localStorage disabled)
- Check: `saveSettings()` actually being called

**Issue: "Function not defined" error**
- Check: Function exported to window object?
- Check: Script loaded before function called?
- Check: Typo in function name

### Debugging Tools

**Console Logging:**
```javascript
console.log('Chord generated:', currentChord);
console.table(CHORD_DEFINITIONS.major);  // Pretty print objects
console.time('chordGeneration');  // Performance timing
// ... code ...
console.timeEnd('chordGeneration');
```

**Breakpoints:**
- DevTools → Sources → Click line number
- Inspect variables at that moment
- Step through code execution

**Network Inspection:**
- DevTools → Network → See what's loading
- Check for 404s (missing files)
- Check file sizes

---

## Common Patterns & Anti-Patterns

### ✅ Good Patterns

**State Management:**
```javascript
// Single source of truth
let currentChord = null;

// Update state, then UI
function nextChord() {
  currentChord = generateChord();
  updateUI();
}
```

**Event Handling:**
```javascript
// Named functions, easy to debug
function handleStartClick() {
  isPracticing = true;
  displayChord();
}

// Export for HTML onclick
window.handleStartClick = handleStartClick;
```

**Error Handling:**
```javascript
function saveSettings() {
  try {
    localStorage.setItem('settings', JSON.stringify(settings));
  } catch (error) {
    console.error('Failed to save settings:', error);
    showToast('Could not save settings', 'error');
  }
}
```

### ❌ Anti-Patterns to Avoid

**Global Pollution:**
```javascript
// BAD: Too many globals
var x = 5;
var y = 10;
var temp = null;

// GOOD: Organized state
const appState = {
  currentChord: null,
  isPracticing: false,
  settings: {}
};
```

**Inline Styles:**
```html
<!-- BAD -->
<div style="color: red; font-size: 20px;">Text</div>

<!-- GOOD -->
<div class="error-text">Text</div>
```

**Magic Numbers:**
```javascript
// BAD
setTimeout(() => displayChord(), 3000);

// GOOD
const CHORD_DISPLAY_DELAY = 3000;
setTimeout(() => displayChord(), CHORD_DISPLAY_DELAY);
```

**Deep Nesting:**
```javascript
// BAD: Hard to read
if (isPracticing) {
  if (currentChord) {
    if (settings.showNotes) {
      // ... more code
    }
  }
}

// GOOD: Early returns
if (!isPracticing) return;
if (!currentChord) return;
if (!settings.showNotes) return;
// ... code
```

---

## Future Development Considerations

### Potential Features (Prioritized)
1. **Display Mode Toggle** - Full vs Minimal chord display
2. **Audio Playback** - Play chord tones when displayed
3. **Chord Timer** - Configurable auto-advance timing
4. **Chord Type Filters** - Select which types to practice
5. **Sheet Music Display** - Optional staff notation
6. **Practice Statistics** - Simple session tracking
7. **Microphone Detection** - Real-time chord recognition
8. **Custom Chord Lists** - User-defined practice sets

### Scalability Considerations
- If app grows beyond ~1000 lines of JS, consider splitting into modules
- If styles exceed ~500 lines, consider component-based CSS files
- If adding many features, implement feature flags for gradual rollout
- If building backend, keep this frontend as-is (API integration via fetch)

---

## Working with Claude Code - Best Practices

### What to Provide Claude
1. **Context**: What you're trying to achieve
2. **Current State**: What's already implemented
3. **Constraints**: What must stay the same
4. **Success Criteria**: How to know it's done right

### Example Prompt (Good)
> "I want to add a simple toggle button in settings that lets users switch between 'Full Display' (shows 'C Major - Root Position') and 'Minimal Display' (shows just 'C'). The setting should persist via localStorage. The button should be styled consistently with other settings buttons. Update the displayChord() function to respect this setting."

### Example Prompt (Less Good)
> "Add a display toggle"
>
> *(Too vague - what kind of toggle? Where? How should it work?)*

### When to Use Plan Mode
- **Complex features** (touching multiple files)
- **Refactoring** (restructuring existing code)
- **Uncertain about approach** (want to review before implementing)

### When to Execute Directly
- **Simple changes** (add a single button, fix a typo)
- **Bug fixes** (clear problem, clear solution)
- **Documentation updates**

---

## Changelog for CLAUDE.md

**v3.0.0 (Oct 27, 2025)**
- Initial creation for clean slate v3
- Comprehensive development guidelines established
- Architecture and workflow documentation
- Naming conventions and best practices defined

---

**Remember:** This is a living document. Update it as the project evolves, new patterns emerge, or lessons are learned. Good documentation is an investment in future productivity.
