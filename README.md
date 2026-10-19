# KDC-14 — portfolio

Personal site of Kurt Denver Chavez. One narrow column: intro, a scrolling strip of technologies, the DIP-8 pin figure, cards for the four repos pinned on GitHub (each opens a dialog with the full project), every other repo, and contact. Every fact links back to a public repo on [github.com/kdenver14](https://github.com/kdenver14).

Next.js 16 (App Router, static export), TypeScript (strict), Tailwind CSS 4, Instrument Serif + Instrument Sans + JetBrains Mono via `next/font`.

## Run

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # static site in out/
npm test           # vitest
npm run typecheck
npm run lint
```

Preview the static build with any file server, e.g. `python3 -m http.server --directory out`.

## Edit content

All content lives in `src/content/`, typed by `src/domain/datasheet.ts`.

| To change | Edit |
| --- | --- |
| Name, contact, bio | `src/content/profile.ts` |
| Pins on the chip figure | `src/content/pins.ts` |
| A row in More projects (and every project's year) | `src/content/projects.ts` |
| A featured project: card line, full overview, details, tags, video, code listing, how-it-works steps | `src/content/featured.ts` |
| Technologies in the scrolling strip | `src/content/tech.ts` |

Bump `LAST_REVISED` in `profile.ts` when you publish a change; the footer shows it.

## Add a demo video

1. Convert the recording (macOS screen recordings are `.mov`, often HEVC) to a 720p H.264 MP4, roughly 10 MB or less. Drop `-an` if the clip has sound you want to keep:
   ```bash
   ffmpeg -i recording.mov -c:v libx264 -crf 23 -preset slow -vf scale=1280:-2 -pix_fmt yuv420p -an -movflags +faststart public/videos/hand-gesture.mp4
   ```
2. Grab a poster frame, and read the exact width and height for step 3:
   ```bash
   ffmpeg -i public/videos/hand-gesture.mp4 -frames:v 1 -q:v 3 public/videos/hand-gesture.jpg
   ffprobe -v error -show_entries stream=width,height -of csv=p=0 public/videos/hand-gesture.mp4
   ```
3. Add a `video` entry to the project in `src/content/featured.ts`:
   ```ts
   video: {
     src: "/videos/hand-gesture.mp4",
     poster: "/videos/hand-gesture.jpg",
     width: 1280,
     height: 720,
     description: "Drawing mode: a pinch draws, an open hand clears the canvas.",
   },
   ```

The `description` shows under the video and is its text alternative, so say what happens on screen. If the recording has speech, add a WebVTT file and set `captions: "/videos/hand-gesture.vtt"`. Videos never autoplay.

The repos cloned in `all-projects-repo-for-vid-rec/` are for recording only. That folder is excluded from git, TypeScript, ESLint, Vitest and Tailwind.

## Gesture figure data

The hand panels draw real training samples from the Hand Gesture Control repo. To regenerate after re-recording:

```bash
npm run gesture-data -- all-projects-repo-for-vid-rec/Hand-Gesture-Control-Keras-Project/data
```

This writes `src/data/gesture-samples.json` (every 5th sample, 2D, wrist-relative).

## Deploy

Live at [kdenver.dev](https://kdenver.dev). Hosted on Vercel from the GitHub repo; every push to `main` redeploys.

1. On [vercel.com](https://vercel.com), choose Add New, then Project, and import the GitHub repo. Keep the Next.js preset. No environment variables are needed.
2. In the project's Settings, open Domains and add `kdenver.dev`. Then do one of these:
   - Buy the domain through Vercel.
   - Copy the DNS records Vercel shows into your registrar.

   HTTPS is automatic; `.dev` domains require it.
3. If the domain ever changes, update `SITE_URL` in `src/content/profile.ts`. Link previews use it.
