# CI/CD Pipeline Refactoring Plan #01 — Test Reports & Coverage Upload

## Status: ✅ COMPLETED

---

## Perubahan yang Sudah Diterapkan

| # | Task | File | Status |
|---|------|------|--------|
| 1 | Tambah `workflow_dispatch` trigger | `ci.yml` L6 | ✅ Done |
| 2 | Tambah `permissions` block | `ci.yml` L11-15 | ✅ Done |
| 3 | Install `jest-junit` di backend | `backend/package.json` | ✅ Done |
| 4 | Konfigurasi test command (JUnit + Cobertura) | `ci.yml` L45-50 | ✅ Done |
| 5 | Tambah `dorny/test-reporter` step | `ci.yml` L52-58 | ✅ Done |
| 6 | Tambah `irongut/CodeCoverageSummary` step | `ci.yml` L60-67 | ✅ Done |
