# 🎤 Präsentation — DevOps Projekt (ThinkBoard)

> **Dauer:** ca. 10 Minuten + Nachfragen
> **Vorab:** Präsentation per Mail an Dozenten schicken
> **Dozent:** Sebastian Petermann, M.Sc. — FH Erfurt

---

## 1. Kurzvorstellung der Applikation & Technologie

**App:** ThinkBoard — MERN-Stack Notes Application

| Layer | Technologie |
|-------|-------------|
| Frontend | React 19 + Vite + Tailwind CSS + DaisyUI |
| Backend | Express 5 (Node.js 20) + Mongoose |
| Database | MongoDB 6.0 |
| Rate Limiting | Upstash Redis (Sliding Window) |
| Containerisierung | Docker (Multi-Stage Builds) |
| Orchestrierung | Docker Compose + Helm Chart (K8s) |
| CI/CD | GitHub Actions |
| Code-Qualität | ESLint + SonarQube |
| Testing | Jest + Supertest |

**Notizen:**
- _TODO: Hier ergänzen was du in der Präsi erzählen willst_

---

## 2. Herangehensweise (Was? Wann?)

**Zeitstrahl / Reihenfolge:**

| Phase | Was wurde gemacht | Wann |
|-------|-------------------|------|
| 1 | Backend API (Express + MongoDB) aufgebaut | _TODO_ |
| 2 | Frontend (React + Vite) entwickelt | _TODO_ |
| 3 | Unit Tests geschrieben (Jest) | _TODO_ |
| 4 | Docker Container erstellt | _TODO_ |
| 5 | CI Pipeline (GitHub Actions) eingerichtet | _TODO_ |
| 6 | CD Pipeline + Deployment konfiguriert | _TODO_ |
| 7 | Helm Chart für Kubernetes erstellt | _TODO_ |
| 8 | SonarQube Integration | _TODO_ |

**Notizen:**
- _TODO: Hier ergänzen_

---

## 3. Tools → Genutzte Frameworks / Tools kurz vorstellen

| Tool | Zweck | Warum gewählt? |
|------|-------|----------------|
| **Vite** | Frontend Build Tool | Schneller als CRA, HMR |
| **DaisyUI** | UI-Komponentenbibliothek | Schnelle, schöne UI auf Tailwind-Basis |
| **Express 5** | Backend Framework | Leichtgewichtig, weit verbreitet |
| **Mongoose** | MongoDB ODM | Schema-Validierung, einfache API |
| **Upstash Redis** | Rate Limiting | Serverless, kein eigener Redis nötig |
| **Jest + Supertest** | Testing | Standard für Node.js, HTTP-Tests |
| **Docker** | Containerisierung | Reproduzierbare Umgebungen |
| **GitHub Actions** | CI/CD | Direkt in GitHub integriert |
| **SonarQube** | Code-Qualität | Automatische Code-Analyse |
| **Helm** | K8s Paketmanager | Dynamische Kubernetes-Manifeste |

**Notizen:**
- _TODO: Hier ergänzen_

---

## 4. Probleme und deren Lösung

> 🔴 Hier werden während der Entwicklung Schwierigkeiten dokumentiert.

| # | Problem | Lösung | Phase |
|---|---------|--------|-------|
| 1 | Jest default tidak mensupport ES Modules (`import/export`) bawaan secara native | Menggunakan flag Node.js `--experimental-vm-modules` saat eksekusi Jest bin di script `npm test` | Phase 1 (Backend Config) |
| 2 | Integrasi Linter (ESLint) ke CI/CD agar hasilnya bisa dilaporkan secara visual di PR GitHub | Menambahkan script `lint-ci` yang memformat output linter ke file JSON (`eslint-report.json`) agar bisa di-parse oleh GitHub Actions runner | Phase 1 (Backend Config) |

**Detail-Notizen:**

### Problem 1: Jest & ES Modules (ESM) Compatibility
* **Masalah:** Saat menggunakan `"type": "module"` di `package.json` untuk syntax modern `import`, Jest melempar error karena secara default ia mengasumsikan sintaks CommonJS (`require`).
* **Lösung:** Mengonfigurasi command `npm test` untuk memanggil binary Jest secara manual melalui Node.js dengan flag `--experimental-vm-modules`. Ini mengizinkan Node.js mengeksekusi modul ESM dalam container VM test Jest secara eksperimental namun stabil untuk testing.

### Problem 2: Visualisasi Laporan ESLint di GitHub PR
* **Masalah:** Jika linter hanya dijalankan secara mentah (`eslint .`), output teks terminal sulit dibaca secara dinamis dari interface Pull Request GitHub.
* **Lösung:** Membuat script khusus `lint-ci` dengan konfigurasi output JSON: `eslint . --format json --output-file eslint-report.json || true`. File JSON ini kemudian dibaca oleh parser di GitHub Actions runner untuk memberikan anotasi visual langsung di baris kode PR. Penggunaan `|| true` mencegah runner langsung crash akibat warning gaya penulisan biasa, sehingga analisis linter dapat diselesaikan sepenuhnya.

---

## 5. Innovationen (wenn vorhanden)

- _TODO: Was hast du besonderes gemacht, das über die Anforderungen hinausgeht?_
- z.B. Rate Limiting mit Upstash, Multi-Stage Docker Builds, Health Checks, etc.

---

## 6. Demo (Pipelines) soweit möglich

**Demo-Plan:**

- [ ] App lokal zeigen (Notes erstellen, bearbeiten, löschen)
- [ ] CI Pipeline in GitHub Actions zeigen (Test + Lint + Build + Docker Push)
- [ ] CD Pipeline zeigen (Deploy to Server)
- [ ] SonarQube Dashboard zeigen
- [ ] Docker Compose lokal starten
- [ ] (Optional) Helm Chart demonstrieren

**Notizen:**
- _TODO: Reihenfolge der Demo festlegen_

---

## 7. TODO / Offene Punkte

- [ ] Präsentation erstellen (Slides)
- [ ] Präsentation per Mail an Dozenten schicken
- [ ] Demo vorbereiten und testen
- [ ] Zeitmanagement üben (max 10 Min)

---

## 📝 Entwicklungs-Logbuch

> Hier dokumentiere ich laufend meine Erfahrungen beim Rebuild.

### Datum: _TODO_
**Was gemacht:**
- ...

**Schwierigkeiten:**
- ...

**Gelernt:**
- ...

---
