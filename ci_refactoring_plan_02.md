# CI/CD Pipeline Refactoring Plan #02 — Linting Report Upload

## Status: ✅ COMPLETED

---

## Perubahan yang Sudah Diterapkan

| # | Task | File | Status |
|---|------|------|--------|
| 1 | Tambah `packages: write` permission | `ci.yml` L16 | ✅ Done |
| 2 | Tambah `lint-ci` script (JSON output) | `backend/package.json` | ✅ Done |
| 3 | Tambah `lint-ci` script (JSON output) | `frontend/package.json` | ✅ Done |
| 4 | Modifikasi lint steps + `continue-on-error: true` | `ci.yml` L42-45, L75-78 | ✅ Done |
| 5 | Transform & upload lint report (`MeiCli/common-lint-reporter`) | `ci.yml` L80-97 | ✅ Done |
