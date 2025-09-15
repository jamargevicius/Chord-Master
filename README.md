# Chord Master Professional – Technical Notes

Last updated: 2025-09-15

This single‑file HTML app (pure HTML/CSS/JS) helps practice piano chords with two modes:
- Practice: Microphone listening and detection
- Virtual Piano: Tap‑to‑play with gesture zones and piano keys

Core tech
- Web Audio API for synthesis, mic input, metronome clicks
- Canvas/SVG for waveform and sheet music
- LocalStorage for settings
- PWA‑friendly for iPhone add‑to‑home‑screen

Changelog
- Timer: Unified circular countdown wired to Practice and Virtual. Reads seconds from Settings; smooth ring animation; advances on timeout; resets cleanly on pause.
- Metronome: Feature removed per product direction (UI, logic, and listeners fully removed).
- Init: Proper SVG strokeDash setup so timer ring renders fully instead of a clipped arc.

Current structure (high level)
- Practice page: stats, controls, chord display, timer, sheet music, frequency visualizer
- Virtual page: compact controls, timer, chord display, sheet music, gesture zones, keys
- Settings: speed, volume, chord types, options
- Physics/Resonance page: curated music/physics cards and note frequency list

Usage notes
- Start/Pause in each page starts the chord cycle and the per‑chord timer.
- Metronome toggles and BPM sliders control the click and beat dots per page.
- iPhone install: Open in Safari > Share > Add to Home Screen. Audio requires a user gesture (tap) due to iOS policies.

Planned improvements
- Sheet music polish: keep noteheads crisp (no scaling on “correct”), refine accidental/clef glyphs.
- Physics/Resonance content: fact‑check all cards, correct typos/symbols, add 4–5 high‑insight items.

Dev guidance
- Edit `chord-master-fixed.html` only. When replacing functionality, remove superseded code instead of duplicating.
- Test in Chrome and Safari (iOS). Verify: Start/Pause behavior, timer progression, metronome click and beat, chord correctness flow, and sheet‑music rendering.

**Install On iPhone**
- **Two paths:** You can install as a PWA (no Mac, fastest) or ship a native iOS app via Capacitor + Xcode (needs a Mac and Apple ID).

**Option A — PWA (Add to Home Screen)**
- **Why:** Fastest way to get an icon and full‑screen app experience. Works with mic on HTTPS.
- **Prereqs:** Any static hosting with HTTPS (e.g., GitHub Pages, Netlify, Cloudflare Pages).
- **Prepare:** Keep `chord-master-fixed.html` as is; it already has a minimal manifest and inline Service Worker.
- **Host (GitHub Pages example):**
  - Create a new repo, add this file, and rename it to `index.html`.
  - In GitHub: Settings → Pages → Deploy from branch → `main` → `/` → Save.
  - Open the `https://<your-user>.github.io/<repo>/` URL on your iPhone in Safari.
- **Install:** Safari → Share → Add to Home Screen → Add.
- **Permissions:** First launch requires a tap before audio starts (iOS policy). When you toggle the mic, iOS prompts for microphone access.
- **Offline:** The inline Service Worker is minimal and network‑first. If you want true offline, upgrade it to cache the HTML, fonts, and KaTeX files (I can wire this up if you want).
- **Icon (optional):** Add a `180x180` PNG and reference it with `<link rel="apple-touch-icon" href="/apple-touch-icon.png">` to improve the home‑screen icon.

**Option B — Native iOS App (Capacitor + Xcode)**
- **Why:** Runs as a true iOS app you can install via Xcode/TestFlight. Best for personal use or distribution; App Review may reject “just a website” wrappers.
- **Prereqs:**
  - macOS with Xcode (latest), Node.js 18+, and an iPhone + USB cable.
  - Apple ID (free for device deploy; Apple Developer Program ($99/yr) for TestFlight/App Store).
- **Project setup (from a new folder):**
  - Put your HTML in the project root and rename to `index.html`.
  - `npm i @capacitor/core @capacitor/cli`
  - `npx cap init "Chord Master" com.yourname.chordmaster --web-dir=.`
  - `npx cap add ios`
- **iOS settings (required for mic):**
  - Open Xcode: `npx cap open ios`.
  - In `ios/App/App/Info.plist`, add `NSMicrophoneUsageDescription` with a short rationale (e.g., "Microphone used to detect played notes").
  - In Signing & Capabilities, select your Team; Xcode creates a provisioning profile.
- **Run on device:**
  - Select your iPhone as the run target and press Run in Xcode.
  - On first run, approve the developer certificate on the device if prompted.
  - Tap once in the app to unlock audio; toggle mic to grant permission.
- **CDN assets note:** The file pulls Google Fonts and KaTeX from CDNs. For guaranteed offline behavior in the native app, download and serve these locally and update `<link>`/`<script>` tags.
- **Distribute (optional):**
  - TestFlight: Requires Apple Developer Program. In Xcode: Product → Archive → Distribute → App Store Connect. Invite testers in App Store Connect.
  - App Store: Apple may decline pure webview apps (Guideline 4.2). Adding native features and offline assets improves chances.

**Which should I use?**
- **Just want it on your phone fast:** Use PWA. Takes minutes and no Mac.
- **Want a real app bundle or TestFlight:** Use Capacitor + Xcode.
