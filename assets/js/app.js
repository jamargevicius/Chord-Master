// ============================================
// GLOBAL STATE
// ============================================
let currentChord = null;
let isPracticing = false;
let chordDuration = 4; // seconds (default)
let advanceTimer = null;
let selectedInversions = ['root', 'first', 'second']; // Array of selected inversions (default: all)

// ============================================
// CONSTANTS & CONFIGURATION
// ============================================
const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

// Chord definitions with all types
const chordDefinitions = {
    major: {
        'C': { notes: ['C', 'E', 'G'], intervals: [0, 4, 7] },
        'C#': { notes: ['C#', 'F', 'G#'], intervals: [0, 4, 7] },
        'Db': { notes: ['Db', 'F', 'Ab'], intervals: [0, 4, 7] },
        'D': { notes: ['D', 'F#', 'A'], intervals: [0, 4, 7] },
        'D#': { notes: ['D#', 'G', 'A#'], intervals: [0, 4, 7] },
        'Eb': { notes: ['Eb', 'G', 'Bb'], intervals: [0, 4, 7] },
        'E': { notes: ['E', 'G#', 'B'], intervals: [0, 4, 7] },
        'E#': { notes: ['E#', 'G##', 'B#'], intervals: [0, 4, 7] },
        'F': { notes: ['F', 'A', 'C'], intervals: [0, 4, 7] },
        'F#': { notes: ['F#', 'A#', 'C#'], intervals: [0, 4, 7] },
        'Gb': { notes: ['Gb', 'Bb', 'Db'], intervals: [0, 4, 7] },
        'G': { notes: ['G', 'B', 'D'], intervals: [0, 4, 7] },
        'G#': { notes: ['G#', 'C', 'D#'], intervals: [0, 4, 7] },
        'Ab': { notes: ['Ab', 'C', 'Eb'], intervals: [0, 4, 7] },
        'A': { notes: ['A', 'C#', 'E'], intervals: [0, 4, 7] },
        'A#': { notes: ['A#', 'D', 'F'], intervals: [0, 4, 7] },
        'Bb': { notes: ['Bb', 'D', 'F'], intervals: [0, 4, 7] },
        'B': { notes: ['B', 'D#', 'F#'], intervals: [0, 4, 7] },
        'B#': { notes: ['B#', 'D##', 'F##'], intervals: [0, 4, 7] }
    },
    minor: {
        'C': { notes: ['C', 'Eb', 'G'], intervals: [0, 3, 7] },
        'C#': { notes: ['C#', 'E', 'G#'], intervals: [0, 3, 7] },
        'Db': { notes: ['Db', 'Fb', 'Ab'], intervals: [0, 3, 7] },
        'D': { notes: ['D', 'F', 'A'], intervals: [0, 3, 7] },
        'D#': { notes: ['D#', 'F#', 'A#'], intervals: [0, 3, 7] },
        'Eb': { notes: ['Eb', 'Gb', 'Bb'], intervals: [0, 3, 7] },
        'E': { notes: ['E', 'G', 'B'], intervals: [0, 3, 7] },
        'E#': { notes: ['E#', 'G#', 'B#'], intervals: [0, 3, 7] },
        'F': { notes: ['F', 'Ab', 'C'], intervals: [0, 3, 7] },
        'F#': { notes: ['F#', 'A', 'C#'], intervals: [0, 3, 7] },
        'Gb': { notes: ['Gb', 'Bbb', 'Db'], intervals: [0, 3, 7] },
        'G': { notes: ['G', 'Bb', 'D'], intervals: [0, 3, 7] },
        'G#': { notes: ['G#', 'B', 'D#'], intervals: [0, 3, 7] },
        'Ab': { notes: ['Ab', 'Cb', 'Eb'], intervals: [0, 3, 7] },
        'A': { notes: ['A', 'C', 'E'], intervals: [0, 3, 7] },
        'A#': { notes: ['A#', 'C#', 'E#'], intervals: [0, 3, 7] },
        'Bb': { notes: ['Bb', 'Db', 'F'], intervals: [0, 3, 7] },
        'B': { notes: ['B', 'D', 'F#'], intervals: [0, 3, 7] },
        'B#': { notes: ['B#', 'D#', 'F##'], intervals: [0, 3, 7] }
    },
    diminished: {
        'C': { notes: ['C', 'Eb', 'Gb'], intervals: [0, 3, 6] },
        'C#': { notes: ['C#', 'E', 'G'], intervals: [0, 3, 6] },
        'Db': { notes: ['Db', 'Fb', 'Abb'], intervals: [0, 3, 6] },
        'D': { notes: ['D', 'F', 'Ab'], intervals: [0, 3, 6] },
        'D#': { notes: ['D#', 'F#', 'A'], intervals: [0, 3, 6] },
        'Eb': { notes: ['Eb', 'Gb', 'Bbb'], intervals: [0, 3, 6] },
        'E': { notes: ['E', 'G', 'Bb'], intervals: [0, 3, 6] },
        'E#': { notes: ['E#', 'G#', 'B'], intervals: [0, 3, 6] },
        'F': { notes: ['F', 'Ab', 'Cb'], intervals: [0, 3, 6] },
        'F#': { notes: ['F#', 'A', 'C'], intervals: [0, 3, 6] },
        'Gb': { notes: ['Gb', 'Bbb', 'Dbb'], intervals: [0, 3, 6] },
        'G': { notes: ['G', 'Bb', 'Db'], intervals: [0, 3, 6] },
        'G#': { notes: ['G#', 'B', 'D'], intervals: [0, 3, 6] },
        'Ab': { notes: ['Ab', 'Cb', 'Ebb'], intervals: [0, 3, 6] },
        'A': { notes: ['A', 'C', 'Eb'], intervals: [0, 3, 6] },
        'A#': { notes: ['A#', 'C#', 'E'], intervals: [0, 3, 6] },
        'Bb': { notes: ['Bb', 'Db', 'Fb'], intervals: [0, 3, 6] },
        'B': { notes: ['B', 'D', 'F'], intervals: [0, 3, 6] },
        'B#': { notes: ['B#', 'D#', 'F#'], intervals: [0, 3, 6] }
    },
    augmented: {
        'C': { notes: ['C', 'E', 'G#'], intervals: [0, 4, 8] },
        'C#': { notes: ['C#', 'E#', 'G##'], intervals: [0, 4, 8] },
        'Db': { notes: ['Db', 'F', 'A'], intervals: [0, 4, 8] },
        'D': { notes: ['D', 'F#', 'A#'], intervals: [0, 4, 8] },
        'D#': { notes: ['D#', 'F##', 'A##'], intervals: [0, 4, 8] },
        'Eb': { notes: ['Eb', 'G', 'B'], intervals: [0, 4, 8] },
        'E': { notes: ['E', 'G#', 'B#'], intervals: [0, 4, 8] },
        'E#': { notes: ['E#', 'G##', 'B##'], intervals: [0, 4, 8] },
        'F': { notes: ['F', 'A', 'C#'], intervals: [0, 4, 8] },
        'F#': { notes: ['F#', 'A#', 'C##'], intervals: [0, 4, 8] },
        'Gb': { notes: ['Gb', 'Bb', 'D'], intervals: [0, 4, 8] },
        'G': { notes: ['G', 'B', 'D#'], intervals: [0, 4, 8] },
        'G#': { notes: ['G#', 'B#', 'D##'], intervals: [0, 4, 8] },
        'Ab': { notes: ['Ab', 'C', 'E'], intervals: [0, 4, 8] },
        'A': { notes: ['A', 'C#', 'E#'], intervals: [0, 4, 8] },
        'A#': { notes: ['A#', 'C##', 'E##'], intervals: [0, 4, 8] },
        'Bb': { notes: ['Bb', 'D', 'F#'], intervals: [0, 4, 8] },
        'B': { notes: ['B', 'D#', 'F##'], intervals: [0, 4, 8] },
        'B#': { notes: ['B#', 'D##', 'F###'], intervals: [0, 4, 8] }
    },
    seventh: {
        'Cmaj7': { notes: ['C', 'E', 'G', 'B'], intervals: [0, 4, 7, 11] },
        'Dm7': { notes: ['D', 'F', 'A', 'C'], intervals: [0, 3, 7, 10] },
        'Em7': { notes: ['E', 'G', 'B', 'D'], intervals: [0, 3, 7, 10] },
        'Fmaj7': { notes: ['F', 'A', 'C', 'E'], intervals: [0, 4, 7, 11] },
        'G7': { notes: ['G', 'B', 'D', 'F'], intervals: [0, 4, 7, 10] },
        'Am7': { notes: ['A', 'C', 'E', 'G'], intervals: [0, 3, 7, 10] },
        'Bm7b5': { notes: ['B', 'D', 'F', 'A'], intervals: [0, 3, 6, 10] }
    }
};

// Inversion functions
const inversions = {
    'Root': (notes) => notes,
    '1st Inv': (notes) => [notes[1], notes[2], notes[0]],
    '2nd Inv': (notes) => [notes[2], notes[0], notes[1]]
};

// ============================================
// CORE LOGIC - CHORD GENERATION
// ============================================

// Generate random chord based on selected chord types
function generateChord() {
    let availableChords = [];

    // Check which chord types are selected in settings
    const selectedMajor = document.querySelector('[data-chord="major"].selected');
    const selectedMinor = document.querySelector('[data-chord="minor"].selected');
    const selectedDiminished = document.querySelector('[data-chord="diminished"].selected');
    const selectedAugmented = document.querySelector('[data-chord="augmented"].selected');
    const selectedSeventh = document.querySelector('[data-chord="seventh"].selected');

    // Add chords based on selections
    if (selectedMajor) {
        Object.keys(chordDefinitions.major).forEach(key => {
            availableChords.push({
                key: key,
                type: 'Major',
                category: 'major',
                ...chordDefinitions.major[key]
            });
        });
    }

    if (selectedMinor) {
        Object.keys(chordDefinitions.minor).forEach(key => {
            availableChords.push({
                key: key + 'm',
                type: 'Minor',
                category: 'minor',
                ...chordDefinitions.minor[key]
            });
        });
    }

    if (selectedDiminished) {
        Object.keys(chordDefinitions.diminished).forEach(key => {
            availableChords.push({
                key: key + 'dim',
                type: 'Diminished',
                category: 'diminished',
                ...chordDefinitions.diminished[key]
            });
        });
    }

    if (selectedAugmented) {
        Object.keys(chordDefinitions.augmented).forEach(key => {
            availableChords.push({
                key: key + 'aug',
                type: 'Augmented',
                category: 'augmented',
                ...chordDefinitions.augmented[key]
            });
        });
    }

    if (selectedSeventh) {
        Object.keys(chordDefinitions.seventh).forEach(key => {
            availableChords.push({
                key: key,
                type: '7th',
                category: 'seventh',
                ...chordDefinitions.seventh[key]
            });
        });
    }

    // Default to major chords if nothing selected
    if (availableChords.length === 0) {
        Object.keys(chordDefinitions.major).forEach(key => {
            availableChords.push({
                key: key,
                type: 'Major',
                category: 'major',
                ...chordDefinitions.major[key]
            });
        });
    }

    // Select a random chord
    const selectedChord = availableChords[Math.floor(Math.random() * availableChords.length)];

    // Apply inversions based on selected positions
    let inversionType = 'Root Position';
    let finalNotes = selectedChord.notes;

    // Only apply inversions to triads (not 7th chords)
    if (selectedChord.category !== 'seventh' && selectedInversions.length > 0) {
        // Build array of available inversions based on user selection
        const availableInversions = [];
        if (selectedInversions.includes('root')) {
            availableInversions.push('Root Position');
        }
        if (selectedInversions.includes('first')) {
            availableInversions.push('1st Inversion');
        }
        if (selectedInversions.includes('second')) {
            availableInversions.push('2nd Inversion');
        }

        // Randomly pick from available inversions (equal probability)
        if (availableInversions.length > 0) {
            inversionType = availableInversions[Math.floor(Math.random() * availableInversions.length)];
        }

        // Apply the inversion transformation
        if (inversionType === '1st Inversion') {
            finalNotes = inversions['1st Inv'](selectedChord.notes);
        } else if (inversionType === '2nd Inversion') {
            finalNotes = inversions['2nd Inv'](selectedChord.notes);
        }
        // Root Position uses the original notes (no transformation needed)
    }

    return {
        key: selectedChord.key,
        type: selectedChord.type,
        inversion: inversionType,
        notes: finalNotes,
        notation: finalNotes.join(' - ')
    };
}

// ============================================
// UI UPDATES
// ============================================

// Display chord - shows chord letter and inversion
function displayChord() {
    currentChord = generateChord();

    const nameEl = document.getElementById('chord-name');
    const typeEl = document.getElementById('chord-type');

    // Display chord letter and inversion
    nameEl.textContent = currentChord.key;
    typeEl.textContent = currentChord.inversion;
}

// ============================================
// EVENT HANDLERS
// ============================================

// Toggle practice (Start/Pause)
function togglePractice() {
    const button = document.getElementById('start-button');
    isPracticing = !isPracticing;

    if (isPracticing) {
        button.innerHTML = `
            <svg viewBox="0 0 24 24" fill="currentColor">
                <rect x="6" y="4" width="4" height="16"/>
                <rect x="14" y="4" width="4" height="16"/>
            </svg>
            <span>Pause</span>
        `;
        displayChord();
        startAutoAdvance();
    } else {
        button.innerHTML = `
            <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z"/>
            </svg>
            <span>Start</span>
        `;
        stopAutoAdvance();
        document.getElementById('chord-name').textContent = 'Paused';
        document.getElementById('chord-type').textContent = 'Press Start to Continue';
    }
}

// Start auto-advance timer
function startAutoAdvance() {
    // Clear any existing timer
    if (advanceTimer) {
        clearInterval(advanceTimer);
    }

    // Set up new timer to advance chords
    advanceTimer = setInterval(() => {
        if (isPracticing) {
            displayChord();
        }
    }, chordDuration * 1000);
}

// Stop auto-advance timer
function stopAutoAdvance() {
    if (advanceTimer) {
        clearInterval(advanceTimer);
        advanceTimer = null;
    }
}


// ============================================
// SETTINGS & MODALS
// ============================================

// Open settings modal
function openSettings() {
    document.getElementById('settings-modal').classList.add('active');
}

// Close settings modal
function closeSettings() {
    document.getElementById('settings-modal').classList.remove('active');
    saveSettings();
}


// Set chord duration from button selection
function setChordDuration(seconds) {
    chordDuration = seconds;

    // Update button states
    document.querySelectorAll('.duration-option').forEach(btn => {
        btn.classList.remove('active');
    });
    const selectedBtn = document.querySelector(`.duration-option[data-duration="${seconds}"]`);
    if (selectedBtn) {
        selectedBtn.classList.add('active');
    }

    // If currently practicing, restart the timer with new duration
    if (isPracticing) {
        startAutoAdvance();
    }

    saveSettings();
}

// Toggle inversion button selection (multi-select)
function toggleInversion(element) {
    const inversion = element.dataset.inversion;

    // Toggle the selected state
    element.classList.toggle('selected');

    // Update the selectedInversions array
    const index = selectedInversions.indexOf(inversion);
    if (index > -1) {
        // Remove if already selected
        selectedInversions.splice(index, 1);
    } else {
        // Add if not selected
        selectedInversions.push(inversion);
    }

    // Ensure at least one inversion is always selected
    if (selectedInversions.length === 0) {
        // Re-select this button if user tries to deselect all
        element.classList.add('selected');
        selectedInversions.push(inversion);
    }

    saveSettings();
}

// Toggle chord type selection
function toggleChordType(element) {
    element.classList.toggle('selected');
    saveSettings();
}

// ============================================
// SETTINGS PERSISTENCE
// ============================================

// Save settings to localStorage
function saveSettings() {
    try {
        const settings = {
            chordDuration: chordDuration,
            selectedInversions: selectedInversions,
            chordTypes: Array.from(document.querySelectorAll('[data-chord].selected')).map(el => el.dataset.chord)
        };
        localStorage.setItem('chordMasterSettings', JSON.stringify(settings));
    } catch (error) {
        console.error('Failed to save settings:', error);
    }
}

// Load settings from localStorage
function loadSettings() {
    try {
        const saved = localStorage.getItem('chordMasterSettings');
        if (saved) {
            const settings = JSON.parse(saved);

            // Restore chord duration
            if (settings.chordDuration) {
                chordDuration = settings.chordDuration;
                // Update button states
                document.querySelectorAll('.duration-option').forEach(btn => {
                    btn.classList.remove('active');
                });
                const selectedBtn = document.querySelector(`.duration-option[data-duration="${chordDuration}"]`);
                if (selectedBtn) {
                    selectedBtn.classList.add('active');
                }
            }

            // Restore selected inversions
            if (settings.selectedInversions && settings.selectedInversions.length > 0) {
                selectedInversions = settings.selectedInversions;
                // Update button states
                document.querySelectorAll('.inversion-option').forEach(btn => {
                    const inversion = btn.dataset.inversion;
                    if (selectedInversions.includes(inversion)) {
                        btn.classList.add('selected');
                    } else {
                        btn.classList.remove('selected');
                    }
                });
            }

            // Restore chord type selections
            if (settings.chordTypes && settings.chordTypes.length > 0) {
                document.querySelectorAll('[data-chord]').forEach(el => {
                    el.classList.remove('selected');
                });
                settings.chordTypes.forEach(type => {
                    const el = document.querySelector(`[data-chord="${type}"]`);
                    if (el) el.classList.add('selected');
                });
            }
        }
    } catch (error) {
        console.error('Failed to load settings:', error);
    }
}

// ============================================
// SPLASH PAGE
// ============================================

// Enter platform from splash screen
function enterPlatform() {
    const splash = document.getElementById('splash-page');
    const platform = document.getElementById('main-platform');

    splash.classList.remove('active');
    platform.classList.add('active');

    // Store in session so we don't show splash again this session
    sessionStorage.setItem('entered', 'true');
}

// Return to splash screen
function returnToSplash() {
    if (isPracticing) {
        if (confirm('Return to home page? Your current session will end.')) {
            isPracticing = false;
            document.getElementById('main-platform').classList.remove('active');
            document.getElementById('splash-page').classList.add('active');
            sessionStorage.removeItem('entered');
        }
    } else {
        document.getElementById('main-platform').classList.remove('active');
        document.getElementById('splash-page').classList.add('active');
        sessionStorage.removeItem('entered');
    }
}

// Check if user has already entered this session
if (sessionStorage.getItem('entered') === 'true') {
    document.addEventListener('DOMContentLoaded', () => {
        enterPlatform();
    });
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

// Show toast notification
function showToast(message, type = 'default', duration = 2000) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = 'toast';

    if (type !== 'default') {
        toast.classList.add(type);
    }

    toast.classList.add('show');

    setTimeout(() => {
        toast.classList.remove('show');
    }, duration);
}

// ============================================
// GLOBAL EXPORTS (for HTML onclick)
// ============================================
window.enterPlatform = enterPlatform;
window.returnToSplash = returnToSplash;
window.togglePractice = togglePractice;
window.openSettings = openSettings;
window.closeSettings = closeSettings;
window.setChordDuration = setChordDuration;
window.toggleInversion = toggleInversion;
window.toggleChordType = toggleChordType;

// ============================================
// INITIALIZATION
// ============================================
window.addEventListener('load', () => {
    loadSettings();

    // Register Service Worker for PWA
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js').catch(console.error);
    }

    // Request persistent storage
    if (navigator.storage && navigator.storage.persist) {
        navigator.storage.persist();
    }
});

// Prevent zoom on double tap (iOS)
let lastTouchEnd = 0;
document.addEventListener('touchend', (event) => {
    const now = Date.now();
    if (now - lastTouchEnd <= 300) {
        event.preventDefault();
    }
    lastTouchEnd = now;
}, false);

// Handle orientation change
window.addEventListener('orientationchange', () => {
    setTimeout(() => {
        window.scrollTo(0, 0);
    }, 100);
});

// iOS specific fixes
if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
    const setVH = () => {
        document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);
    };
    setVH();
    window.addEventListener('resize', setVH);
}
