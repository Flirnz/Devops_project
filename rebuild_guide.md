# 🧱 ThinkBoard Rebuild Guide — Bangun dari Nol!

> **Aturan main:** Gw kasih pseudo-code + instruksi. Lu yang ketik. Kalau stuck, bilang aja "hint" atau "jawaban" buat file tertentu.

---

## 🗺️ Peta Besar (7 Fase)

| Fase | Apa yang dibangun | Estimasi |
|------|-------------------|----------|
| 1 | Backend — Fondasi (package.json, server, app, config) | 30 menit |
| 2 | Backend — Business Logic (model, controller, route, middleware) | 30 menit |
| 3 | Backend — Testing (Jest + Supertest) | 30 menit |
| 4 | Frontend — Setup (Vite + React + Tailwind + DaisyUI) | 20 menit |
| 5 | Frontend — Pages & Components | 45 menit |
| 6 | Docker & Compose | 20 menit |
| 7 | CI/CD Pipeline + Helm Chart | 30 menit |

**Total: ~3.5 jam** (santai dengan istirahat)

---

## ⚠️ Sebelum Mulai

Hapus folder lama (backup aman di `project_backup.tar.gz` dan `.backup_ref/`):

```bash
# Dari root project
rm -rf backend/src backend/Dockerfile backend/eslint.config.js
rm -rf frontend/src frontend/Dockerfile frontend/nginx.conf frontend/eslint.config.js
rm -rf helm
rm -f docker-compose.yml docker-compose.prod.yml sonar-project.properties
rm -rf .github/workflows
```

---

## FASE 1: Backend — Fondasi

### Step 1.1: Inisialisasi `backend/package.json`

```bash
cd backend
npm init -y
```

Lalu edit `package.json` secara manual. Yang perlu ada:

```
PSEUDO-CODE package.json:
─────────────────────────
- type: "module"                  ← supaya bisa pakai import/export
- main: "src/server.js"
- scripts:
    test   → jalankan jest dengan flag --experimental-vm-modules
    dev    → jalankan nodemon src/server.js
    start  → jalankan node src/server.js
    lint   → jalankan eslint .
    lint-ci→ eslint . --format json --output-file eslint-report.json || true

- dependencies:
    express, mongoose, cors, dotenv,
    @upstash/ratelimit, @upstash/redis

- devDependencies:
    jest, supertest, nodemon, eslint,
    @eslint/js, globals, jest-junit, jest-sonar-reporter

- jest config:
    testResultsProcessor → "jest-sonar-reporter"
```

> **Kenapa `"type": "module"`?** Supaya kita pakai syntax `import/export` (ESM) bukan `require` (CommonJS).

**Setelah edit, install:**
```bash
npm install
```

---

### Step 1.2: Buat `backend/src/config/db.js`

Buat file koneksi MongoDB.

```
PSEUDO-CODE db.js:
──────────────────
1. import mongoose
2. import dns dari 'node:dns'
3. Set DNS servers ke Google (8.8.8.8) dan Cloudflare (1.1.1.1)
   → Kenapa? Supaya resolve DNS Atlas lebih reliable
4. Export fungsi async "connectDB":
   - try: await mongoose.connect(ambil URI dari process.env.MONGO_URI)
   - catch: log error, lalu process.exit(1) ← paksa mati kalau DB gagal
```

> **Hint:** Fungsinya di-export sebagai named export `{ connectDB }`

---

### Step 1.3: Buat `backend/src/config/upstash.js`

Setup rate limiter menggunakan Upstash Redis.

```
PSEUDO-CODE upstash.js:
───────────────────────
1. import { Ratelimit } dari "@upstash/ratelimit"
2. import { Redis } dari "@upstash/redis"
3. import dotenv, lalu panggil dotenv.config()
4. Buat instance ratelimit:
   - redis: Redis.fromEnv()         ← otomatis baca UPSTASH_REDIS_REST_URL & TOKEN
   - limiter: slidingWindow(100 request, per 60 detik)
5. export default ratelimit
```

---

### Step 1.4: Buat `backend/src/app.js`

Ini jantung Express app. Pisah dari server.js supaya bisa di-test.

```
PSEUDO-CODE app.js:
───────────────────
1. Import: cors, express, path (dari 'node:path'), notesRoutes, rateLimiter
2. Buat app = express()
3. Disable header 'x-powered-by'     ← security best practice
4. Resolve __dirname (karena ESM tidak punya __dirname bawaan)

5. MIDDLEWARE:
   - Kalau BUKAN production → aktifkan CORS untuk localhost:5173 dan 5174
   - express.json()                   ← parsing JSON body
   - rateLimiter                      ← global rate limiting

6. ROUTES:
   - GET /api/health → return { status: "UP" }    ← health check endpoint
   - USE /api/notes  → notesRoutes

7. PRODUCTION MODE:
   - Serve static files dari "../frontend/dist"
   - Catch-all route → kirim index.html (SPA routing)
   
8. DEVELOPMENT MODE:
   - GET / → "API Server is running..."

9. export default app
```

> **Poin penting:** `app.get("*splat", ...)` — Express 5 pakai `*splat` bukan `*` biasa untuk wildcard.

---

### Step 1.5: Buat `backend/src/server.js`

Entry point yang menghubungkan semuanya.

```
PSEUDO-CODE server.js:
─────────────────────
1. import dotenv, app, { connectDB }
2. dotenv.config()                    ← HARUS di atas sebelum baca env
3. PORT = process.env.PORT || 5001
4. try:
   - await connectDB()
   - app.listen(PORT, callback log "Server started on http://localhost:PORT")
5. catch:
   - Log error "Server failed to start because database connection failed"
```

> **Kenapa pisah app.js dan server.js?** Supaya testing bisa import `app` tanpa trigger `listen()` dan koneksi DB.

---

## FASE 2: Backend — Business Logic

### Step 2.1: Buat `backend/src/models/Note.js`

```
PSEUDO-CODE Note.js:
────────────────────
1. import mongoose
2. Buat noteSchema dengan field:
   - title:   { type: String, required: true }
   - content: { type: String, required: true }
   - options kedua: { timestamps: true }    ← otomatis createdAt & updatedAt
3. Buat model "Note" dari schema
4. export default Note
```

---

### Step 2.2: Buat `backend/src/controllers/notesControllers.js`

5 fungsi CRUD. Semua async, semua punya try/catch.

```
PSEUDO-CODE notesControllers.js:
────────────────────────────────
Import Note model.

1. getAllNotes(req, res):
   - Note.find().sort({ createdAt: -1 })     ← terbaru di atas
   - Return 200 + array notes
   - Catch → 500 "Internal server Error"

2. getNotebyId(req, res):
   - Note.findById(req.params.id)
   - Kalau null → 404 "Note not found"
   - Kalau ada  → 200 + note object
   - Catch → 500

3. createNote(req, res):
   - Destructure { title, content } dari req.body
   - new Note({ title, content })
   - await note.save()
   - Return 201 + savedNote
   - Catch → 500

4. updateNote(req, res):
   - Destructure { title, content } dari req.body
   - Note.findByIdAndUpdate(id, { title, content }, { new: true })
   - Kalau null → 404
   - Kalau berhasil → 200 "note updated successfully"
   - Catch → 500

5. deleteNote(req, res):
   - Note.findByIdAndDelete(req.params.id)
   - Kalau null → 404
   - Kalau berhasil → 200 "note deleted successfully"
   - Catch → 500
```

> **Perhatikan:** Campuran `export async function` dan `export const = async` — keduanya valid, tapi harus konsisten dengan import di routes.

---

### Step 2.3: Buat `backend/src/middleware/rateLimiter.js`

```
PSEUDO-CODE rateLimiter.js:
───────────────────────────
1. Import ratelimit dari "../config/upstash.js"
2. Buat middleware async (req, res, next):
   - try:
     - const { success } = await ratelimit.limit("my-limit-key")
     - Kalau !success → return 429 "Too many requests, please try again later"
     - Kalau success → next()
   - catch:
     - Log error, lalu next(error) ← teruskan ke error handler
3. export default rateLimiter
```

---

### Step 2.4: Buat `backend/src/routes/notesRoutes.js`

```
PSEUDO-CODE notesRoutes.js:
───────────────────────────
1. Import express
2. Import semua controller sebagai namespace: import * as notesController
3. Buat router = express.Router()
4. Daftarkan 5 route:
   GET    /         → getAllNotes
   GET    /:id      → getNotebyId
   POST   /         → createNote
   PUT    /:id      → updateNote
   DELETE /:id      → deleteNote
5. export default router
```

---

### Step 2.5: Buat `backend/eslint.config.js`

```
PSEUDO-CODE eslint.config.js:
─────────────────────────────
1. Import js dari "@eslint/js", globals, defineConfig dari "eslint/config"
2. Export defineConfig dengan 2 config:
   - Semua file .js/.mjs/.cjs → extends js/recommended, globals: node
   - File *.test.js → tambah globals: jest
```

✅ **Checkpoint Fase 1-2:** Coba jalankan `npm run dev` — harusnya jalan (butuh `.env` dengan MONGO_URI).

---

## FASE 3: Backend — Testing

### Step 3.1: Buat `backend/src/tests/dummy.test.js`

```
PSEUDO-CODE:
────────────
describe("Dummy Test"):
  test("should successfully sum numbers"):
    expect(1+1).toBe(2)
```

> Sanity check — pastikan Jest jalan.

---

### Step 3.2: Buat `backend/src/tests/health.test.js`

```
PSEUDO-CODE:
────────────
1. Import { expect, jest } dari @jest/globals
2. Import request dari supertest
3. MOCK rateLimiter middleware → langsung panggil next()
   → Pakai jest.unstable_mockModule("../middleware/rateLimiter.js", ...)
4. Import app SETELAH mock (dynamic import)
5. Test:
   GET /api/health → expect status 200, body { status: "UP" }
```

> **Kenapa mock rateLimiter?** Karena di test kita ga mau hit Upstash Redis beneran.

---

### Step 3.3: Buat `backend/src/tests/notes.test.js`

Ini file terbesar. Mock 2 module: rateLimiter dan Note model.

```
PSEUDO-CODE:
────────────
1. Mock rateLimiter → next()
2. Mock Note model:
   - Static methods: find, sort, findById, findByIdAndUpdate, findByIdAndDelete
   - Constructor: new Note() harus return object dengan method save
   - Trick: find().sort() → chain, jadi find() harus mockReturnThis()
3. Import app dan Note SETELAH mock

4. Test suites (beforeEach → clearAllMocks):

   GET /api/notes:
   - Success → sort returns mock array → expect 200
   - Fail    → sort rejects → expect 500

   GET /api/notes/:id:
   - Found     → findById returns mock → expect 200
   - Not found → findById returns null → expect 404
   - Error     → findById rejects → expect 500

   POST /api/notes:
   - Success → save resolves → expect 201
   - Fail    → save rejects → expect 500

   PUT /api/notes/:id:
   - Success   → findByIdAndUpdate returns mock → expect 200
   - Not found → returns null → expect 404
   - Error     → rejects → expect 500

   DELETE /api/notes/:id:
   - Success   → findByIdAndDelete returns mock → expect 200
   - Not found → returns null → expect 404
   - Error     → rejects → expect 500
```

> **Total: 12 test cases.** Pattern-nya repetitif — sekali paham 1 group, sisanya copy-paste.

✅ **Checkpoint Fase 3:** Jalankan `npm test` — semua 13 tests harus pass.

---

## FASE 4: Frontend — Setup

### Step 4.1: Inisialisasi Vite + React

```bash
cd frontend
# Kalau belum ada, init ulang:
npm create vite@latest ./ -- --template react
```

### Step 4.2: Install Dependencies

```bash
# Runtime deps
npm install axios react-router react-hot-toast lucide-react prop-types

# Dev deps
npm install -D tailwindcss@3 postcss autoprefixer daisyui@4
npx tailwindcss init -p
```

### Step 4.3: Config Files

**`tailwind.config.js`:**
```
PSEUDO-CODE:
────────────
- content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"]
- plugins: [daisyui]
- daisyui themes: ["forest", "coffee"]
```

**`postcss.config.js`:**
```
PSEUDO-CODE:
────────────
- plugins: { tailwindcss: {}, autoprefixer: {} }
```

**`vite.config.js`:**
```
PSEUDO-CODE:
────────────
- plugins: [react()]
```

**`src/index.css`:**
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

**`frontend/eslint.config.js`:**
```
PSEUDO-CODE:
────────────
- globalIgnores: ['dist']
- files: **/*.{js,jsx}
- extends: js recommended, reactHooks flat, reactRefresh vite
- globals: browser
- rules: no-unused-vars → "warn"
```

### Step 4.4: Buat `src/lib/axios.js`

```
PSEUDO-CODE:
────────────
1. Import axios
2. BASE_URL:
   - Development → "http://localhost:5001/api"
   - Production  → "/api"
   - Deteksi pakai: import.meta.env.MODE === "development"
3. Buat axios instance dengan baseURL
4. Export default
```

### Step 4.5: Buat `src/lib/utils.js`

```
PSEUDO-CODE:
────────────
Export fungsi formateDate(date):
  return date.toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric"
  })
```

### Step 4.6: Buat `src/main.jsx`

```
PSEUDO-CODE:
────────────
1. Import StrictMode, createRoot, index.css, App
2. Import BrowserRouter dari "react-router"
3. Import Toaster dari "react-hot-toast"
4. Render:
   <StrictMode>
     <BrowserRouter>
       <App />
       <Toaster />
     </BrowserRouter>
   </StrictMode>
```

### Step 4.7: Buat `src/App.jsx`

```
PSEUDO-CODE:
────────────
1. Import Route, Routes dari "react-router"
2. Import 3 pages: HomePage, CreatePage, NoteDetailPage
3. Return:
   <div className="relative min-h-screen w-full">
     <div background gradient overlay (radial gradient hitam + hijau) />
     <Routes>
       /         → <HomePage />
       /create   → <CreatePage />
       /note/:id → <NoteDetailPage />
     </Routes>
   </div>
```

> **Background trick:** Div absolute dengan z-index negatif, gradient `radial-gradient(125% 125% at 50% 10%, #000 60%, #00FF9D40 100%)`

---

## FASE 5: Frontend — Pages & Components

### Step 5.1: `src/components/NavBar.jsx`

```
PSEUDO-CODE:
────────────
- Header dengan bg-base-300
- Container max-w-6xl, flex justify-between
- Kiri: <h1> "Thinkboard" (text-3xl, font-bold, text-primary, font-mono)
- Kanan: Link to="/create" btn btn-primary, icon PlusIcon + "New Note"
```

### Step 5.2: `src/components/NoteCard.jsx`

```
PSEUDO-CODE:
────────────
Props: { note, setNotes }

1. handleDelete(e, id):
   - e.preventDefault() ← cegah Link navigate
   - confirm dialog
   - Optimistic update: setNotes filter out deleted id
   - await api.delete
   - toast success/error

2. Render: Link to="/note/{id}" wrapped card
   - border-t-4 hijau (#00FF9D)
   - Title, content (line-clamp-3), date, edit icon, delete button

3. PropTypes validation untuk note shape dan setNotes func
```

### Step 5.3: `src/components/NotesNotFound.jsx`

```
PSEUDO-CODE:
────────────
- Centered flex column
- Icon NotebookIcon dalam circle bg-primary/10
- "No notes yet" heading
- Motivational text
- Link btn to="/create"
```

### Step 5.4: `src/components/RateLimitedUI.jsx`

```
PSEUDO-CODE:
────────────
- Banner dengan bg-primary/10 border-primary/30
- ZapIcon dalam circle
- "Rate Limit Reached" heading
- Explanatory text
```

### Step 5.5: `src/pages/HomePage.jsx`

```
PSEUDO-CODE:
────────────
State: isRateLimited, notes[], loading

useEffect:
  fetchNotes → api.get("/notes")
  - Success → setNotes, setIsRateLimited(false)
  - 429 error → setIsRateLimited(true)
  - Other error → toast.error
  - finally → setLoading(false)

Render:
  <NavBar />
  {isRateLimited && <RateLimitedUI />}
  {loading && "Loading Notes..."}
  {notes empty && !rateLimited → <NotesNotFound />}
  {notes exist → grid 1-col md:3-col, map NoteCard}
```

### Step 5.6: `src/pages/CreatePage.jsx`

```
PSEUDO-CODE:
────────────
State: title, content, loading
Hook: useNavigate

handleSubmit(e):
  - preventDefault
  - Validate: trim both fields
  - api.post("/notes", { title, content })
  - Success → toast + navigate("/")
  - 429 → special toast
  - Other → generic error toast

Render:
  - Back button (ArrowLeftIcon + Link to="/")
  - Card with form: title input + content textarea
  - Submit button "Create Note" / "Creating..."
```

### Step 5.7: `src/pages/NoteDetailPage.jsx`

```
PSEUDO-CODE:
────────────
State: note, loading, saving
Hooks: useNavigate, useParams

useEffect([id]):
  fetchNote → api.get("/notes/{id}") → setNote

handleDelete:
  - confirm dialog
  - api.delete → navigate("/")

handleSave:
  - Validate title & content
  - api.put("/notes/{id}", note)
  - Success → navigate("/")

Render:
  - Loading state → spinner (LoaderIcon)
  - Back button + Delete button (merah)
  - Card: editable title input + content textarea
  - Save button "Save Changes" / "Saving..."
```

> **Detail penting:** onChange untuk input → `setNote({...note, title: e.target.value})` (spread existing note)

✅ **Checkpoint Fase 4-5:** Jalankan backend + frontend, buat note, edit, delete. Semua harus work.

---

## FASE 6: Docker & Compose

### Step 6.1: `backend/Dockerfile`

```
PSEUDO-CODE:
────────────
STAGE 1 (builder): node:20-alpine
  - COPY package*.json, RUN npm ci

STAGE 2 (runner): node:20-alpine
  - COPY package*.json, RUN npm ci --only=production
  - COPY semua source code
  - USER node          ← jangan run sebagai root!
  - EXPOSE 5001
  - ENV NODE_ENV=production
  - HEALTHCHECK: wget ke /api/health setiap 30s
  - CMD ["node", "src/server.js"]
```

### Step 6.2: `frontend/Dockerfile`

```
PSEUDO-CODE:
────────────
STAGE 1 (builder): node:20-alpine
  - COPY package*.json, npm ci, COPY semua, npm run build

STAGE 2 (serve): nginx:1.25-alpine
  - COPY --from=builder /app/dist → /usr/share/nginx/html
  - COPY nginx.conf → /etc/nginx/conf.d/default.conf
  - EXPOSE 80
  - CMD nginx daemon off
```

### Step 6.3: `frontend/nginx.conf`

```
PSEUDO-CODE:
────────────
server listen 80:
  location / → serve static, try_files untuk SPA fallback
  location /api → proxy_pass ke http://backend:5001/api
    (set headers: Upgrade, Connection, Host, cache bypass)
```

### Step 6.4: `docker-compose.yml` (development/local build)

```
PSEUDO-CODE:
────────────
3 services:

mongodb:
  image: mongo:6.0, port 27017, volume mongo_data
  healthcheck: mongosh ping

backend:
  build: ./backend
  port 5001, depends_on mongodb (healthy)
  env: MONGO_URI=mongodb://mongodb:27017/thinkboard, PORT, NODE_ENV, UPSTASH vars
  healthcheck: wget /api/health

frontend:
  build: ./frontend
  port 80, depends_on backend (healthy)

volumes: mongo_data
networks: thinkboard-network (bridge)
```

### Step 6.5: `docker-compose.prod.yml`

```
PSEUDO-CODE:
────────────
Sama seperti docker-compose.yml TAPI:
  - backend & frontend TIDAK pakai "build:", melainkan "image:" dari Docker Hub
  - image: ${DOCKER_USERNAME}/${DOCKER_USERNAME}-thinkboard-backend:${IMAGE_TAG}
  - Variabel diambil dari .env file di server
```

### Step 6.6: `.dockerignore` (di backend dan frontend)

```
Backend: node_modules, coverage, .env
Frontend: node_modules, dist
```

### Step 6.7: `sonar-project.properties`

```
PSEUDO-CODE:
────────────
- projectKey: Flirnz_Devops_project
- sources: backend/src, frontend/src
- tests: backend/src/tests
- exclusions: node_modules, dist, coverage, tests
- lcov path: backend/coverage/lcov.info
- test report: backend/test-report.xml
- coverage exclusions: frontend/src (no frontend tests)
```

✅ **Checkpoint Fase 6:** `docker compose up --build` harus bisa jalan.

---

## FASE 7: CI/CD + Helm

### Step 7.1: `.github/workflows/ci.yml`

```
PSEUDO-CODE ci.yml:
───────────────────
Trigger: push ke main/develop + manual

Job "build" (ubuntu-latest):
  permissions: actions, checks, pull-requests, contents, packages (write)

  Steps:
  1. Checkout (fetch-depth: 0 untuk SonarQube)
  2. Mark workspace safe (git config)
  3. Setup Node 20 (cache npm dari kedua package-lock)
  4. Install backend deps (npm ci)
  5. Lint backend (continue-on-error)
  6. Test backend (jest --coverage, reporters: default + jest-junit)
  7. Report test results (dorny/test-reporter)
  8. Report coverage (irongut/CodeCoverageSummary)
  9. Install frontend deps
  10. Lint frontend (continue-on-error)
  11. Transform lint reports backend + frontend (MeilCli transformer)
  12. Upload lint report (MeilCli reporter)
  13. Build frontend (npm run build)
  14. SonarQube scan
  15. Docker login
  16. Build + push backend image (tag: sha + latest)
  17. Build + push frontend image (tag: sha + latest)
  18. Docker logout
```

### Step 7.2: `.github/workflows/cd.yml`

```
PSEUDO-CODE cd.yml:
───────────────────
Trigger: workflow_dispatch dengan input image_tag (default "latest")

Job "deploy":
  Steps:
  1. Checkout
  2. SCP docker-compose.prod.yml ke server (appleboy/scp-action)
  3. SSH ke server (appleboy/ssh-action):
     - mkdir ~/thinkboard-app && cd
     - Rename prod compose → docker-compose.yml
     - Generate .env (DOCKER_USERNAME, IMAGE_TAG, UPSTASH vars)
     - docker login
     - docker compose pull
     - docker compose up -d --force-recreate --remove-orphans
     - docker image prune -f
```

### Step 7.3: Helm Chart

**Struktur folder:**
```
helm/thinkboard/
├── Chart.yaml
├── values.yaml
└── templates/
    ├── secrets.yaml
    ├── mongodb-deploy.yaml
    ├── backend-deploy.yaml
    └── frontend-deploy.yaml
```

**`Chart.yaml`:** apiVersion v2, name thinkboard, type application, version 1.0.0

**`values.yaml`:** Definisikan semua variabel (dockerUsername, imageTag, mongodb image/port, backend image/port/replicas, frontend image/port/replicas, upstash url/token)

**Templates — Pattern yang sama untuk tiap service:**
```
PSEUDO-CODE template:
─────────────────────
Deployment:
  - metadata name, replicas dari values
  - container image dari "{{ .Values.dockerUsername }}/{{ .Values.xxx.image }}:{{ .Values.imageTag }}"
  - ports dari values
  - Probes (liveness + readiness) untuk backend (/api/health) dan frontend (/)
  - Backend: env vars termasuk secretKeyRef ke thinkboard-secrets

Service:
  - selector match app label
  - port mapping
  - Frontend service: type LoadBalancer

Secrets (secrets.yaml):
  - kind: Secret, type: Opaque
  - stringData: upstash url & token dari values (pipe quote)
```

✅ **Checkpoint Fase 7:** `helm template helm/thinkboard` harus render YAML tanpa error.

---

## 🏁 Urutan Kerja yang Disarankan

```
1. Mulai dari backend/src/config/db.js        ← paling kecil, gampang
2. backend/src/config/upstash.js               ← kecil juga
3. backend/src/models/Note.js                  ← 17 baris
4. backend/src/middleware/rateLimiter.js        ← 22 baris
5. backend/src/controllers/notesControllers.js  ← inti logic
6. backend/src/routes/notesRoutes.js            ← 11 baris, paling simple
7. backend/src/app.js                           ← gabungkan semuanya
8. backend/src/server.js                        ← entry point
9. Test dulu: npm run dev                       ← CHECKPOINT!
10. Lanjut frontend...
11. Lanjut Docker...
12. Lanjut CI/CD...
```

---

## 💬 Cara Pakai Guide Ini

Bilang ke gw:
- **"Mulai step 1.2"** → gw kasih instruksi detail + hints
- **"Hint untuk step X"** → gw kasih clue tambahan
- **"Jawaban step X"** → gw kasih kode lengkap untuk dicek
- **"Review"** → paste kode lu, gw bandingin sama backup

**Let's go! Mau mulai dari step mana?** 🚀
