# DevSecOps Pipeline — Implementation Plan & Milestone Tracker
**Project:** mern-thinkboard (MERN Notes App)  
**University:** FH Erfurt — SMT4 DevOps  
**Started:** 2026-06-19  

---

## Overview

Build a complete 11-stage DevSecOps CI/CD pipeline for a MERN stack application. Each stage must be implemented, tested, and understood through Socratic learning methodology before progressing.

> [!IMPORTANT]
> **Stage 3 Deviation:** The reference architecture specifies Maven (Java). This project is Node.js — Stage 3 uses `npm install`, `npm run lint`, and `npm test` (Jest/Supertest) instead.

---

## Stage 1: Source Control Management (GitHub)

- [x] Initialize local git repository (`git init`)
- [x] Create proper `.gitignore` (node_modules, .env, dist, coverage)
- [ ] Structure initial commit with clean history
- [ ] Push to GitHub remote (`github.com/Flirnz/mern-thinkboard`)
- [ ] Design branching strategy (main / develop / feature branches)
- [ ] Configure branch protection rules on GitHub (require PR, no direct push to main)
- [ ] Set up GitHub webhook for Jenkins trigger
- [ ] **🧠 Active Recall Checkpoint — PASSED?** [ ]
- [ ] **🎓 Feynman Debrief — PASSED?** [ ]

---

## Stage 2: Orchestration Core (Jenkins on AWS EC2)

- [ ] Provision AWS EC2 instance (Ubuntu, t2.medium or larger)
- [ ] Install Java JDK on EC2 (Jenkins dependency)
- [ ] Install and configure Jenkins on EC2
- [ ] Configure Jenkins security (admin user, CSRF protection)
- [ ] Install required Jenkins plugins (Git, Pipeline, NodeJS, Docker, SonarQube Scanner)
- [ ] Configure NodeJS tool in Jenkins Global Tool Configuration
- [ ] Create Jenkins Pipeline job connected to GitHub repo
- [ ] Verify webhook triggers pipeline on push
- [ ] **🧠 Active Recall Checkpoint — PASSED?** [ ]
- [ ] **🎓 Feynman Debrief — PASSED?** [ ]

## Stage 3: Build & Test (npm + ESLint + Jest)

- [ ] Create Jenkinsfile with pipeline structure (agent, stages, post)
- [ ] Stage: Checkout — pull source from GitHub
- [ ] Stage: Install Dependencies — `npm install` for backend and frontend
- [ ] Stage: Lint — run ESLint (`npm run lint`)
- [ ] Stage: Unit/Integration Tests — run Jest/Supertest with coverage enabled (`npm test -- --coverage`)
- [ ] Stage: E2E Tests — implement and run minimum 3 meaningful E2E test cases (e.g., using Playwright or Jest integration tests)
- [ ] Configure test result reporting (JUnit XML format) and coverage reporting (LCOV)
- [ ] Ensure pipeline fails on lint errors, test failures, or unmet coverage thresholds
- [ ] **🧠 Active Recall Checkpoint — PASSED?** [ ]
- [ ] **🎓 Feynman Debrief — PASSED?** [ ]

---

## Stage 4: SAST — SonarQube Quality Gates

- [ ] Deploy SonarQube server (Docker container on EC2 or separate instance)
- [ ] Configure SonarQube project and quality gate thresholds
- [ ] Configure SonarQube Scanner parameters to import coverage reports (lcov.info) and unit test reports (junit.xml)
- [ ] Install SonarQube Scanner plugin in Jenkins
- [ ] Configure SonarQube server credentials in Jenkins
- [ ] Add SonarQube analysis stage to Jenkinsfile (injecting testing/coverage inputs)
- [ ] Configure quality gate webhook (SonarQube → Jenkins)
- [ ] Verify pipeline breaks on quality gate failure
- [ ] **🧠 Active Recall Checkpoint — PASSED?** [ ]
- [ ] **🎓 Feynman Debrief — PASSED?** [ ]

---

## Stage 5: SCA — Trivy Filesystem Scan

- [ ] Install Trivy on Jenkins agent
- [ ] Add Trivy FS scan stage to Jenkinsfile (scan project dependencies)
- [ ] Configure severity thresholds (CRITICAL, HIGH)
- [ ] Ensure pipeline breaks on critical CVEs found
- [ ] Review and understand vulnerability output format
- [ ] **🧠 Active Recall Checkpoint — PASSED?** [ ]
- [ ] **🎓 Feynman Debrief — PASSED?** [ ]

---

## Stage 6: Containerization (Docker)

- [ ] Write Dockerfile for backend (multi-stage build, non-root user)
- [ ] Write Dockerfile for frontend (build + nginx serve)
- [ ] Optimize layer caching (COPY package*.json before source)
- [ ] Minimize attack surface (alpine base, no unnecessary packages)
- [ ] Add Docker build stage to Jenkinsfile
- [ ] Test local Docker builds before pipeline integration
- [ ] **🧠 Active Recall Checkpoint — PASSED?** [ ]
- [ ] **🎓 Feynman Debrief — PASSED?** [ ]

---

## Stage 7: Container Vulnerability Assessment (Trivy Image Scan)

- [ ] Add Trivy image scan stage to Jenkinsfile (scan built Docker images)
- [ ] Configure severity thresholds for container scan
- [ ] Ensure pipeline breaks on critical image vulnerabilities
- [ ] Compare FS scan results vs. image scan results — understand the difference
- [ ] **🧠 Active Recall Checkpoint — PASSED?** [ ]
- [ ] **🎓 Feynman Debrief — PASSED?** [ ]

---

## Stage 8: Artifact Management (Container Registry)

- [ ] Set up AWS ECR repository (or Docker Hub as alternative)
- [ ] Configure registry credentials in Jenkins (IAM role or access key)
- [ ] Add Docker tag + push stage to Jenkinsfile
- [ ] Implement image tagging strategy (commit SHA, build number, latest)
- [ ] Verify images appear in registry after successful pipeline run
- [ ] **🧠 Active Recall Checkpoint — PASSED?** [ ]
- [ ] **🎓 Feynman Debrief — PASSED?** [ ]

---

## Stage 9: Continuous Delivery (ArgoCD & Helm — GitOps)

- [ ] Install ArgoCD on the EKS cluster
- [ ] Create a Helm Chart for the application (packaging backend and frontend)
- [ ] Write `Chart.yaml`, `values.yaml`, and templates (`deployment.yaml`, `service.yaml`, `ingress.yaml`)
- [ ] Configure ArgoCD Application to target the Helm Chart in your Git repository
- [ ] Configure ArgoCD sync policy (manual reconciliation or auto-sync)
- [ ] Update Jenkinsfile to dynamically modify the image tag in `values.yaml` (or via Helm parameter overrides) upon successful registry push
- [ ] Verify ArgoCD detects changes and reconciles the cluster to the target state
- [ ] **🧠 Active Recall Checkpoint — PASSED?** [ ]
- [ ] **🎓 Feynman Debrief — PASSED?** [ ]

---

## Stage 10: Container Orchestration (AWS EKS)

- [ ] Provision EKS cluster (eksctl or Terraform)
- [ ] Configure kubectl access and kubeconfig
- [ ] Create Kubernetes namespace for the application
- [ ] Deploy application via ArgoCD and verify pods are running
- [ ] Configure Ingress or LoadBalancer for external access
- [ ] Test live application endpoint
- [ ] **🧠 Active Recall Checkpoint — PASSED?** [ ]
- [ ] **🎓 Feynman Debrief — PASSED?** [ ]

---

## Stage 11: Observability (Prometheus + Grafana)

- [ ] Deploy Prometheus on EKS (Helm chart or manual manifests)
- [ ] Configure Prometheus scrape targets (application metrics endpoint)
- [ ] Deploy Grafana on EKS
- [ ] Connect Grafana to Prometheus data source
- [ ] Create dashboard: application health, request latency, error rates
- [ ] Configure alerting rules (optional but recommended)
- [ ] **🧠 Active Recall Checkpoint — PASSED?** [ ]
- [ ] **🎓 Feynman Debrief — PASSED?** [ ]

---

## Summary Progress Tracker

| Stage | Name | Status |
|-------|------|--------|
| 1 | Source Control (GitHub) | 🔴 Not Started |
| 2 | Orchestration (Jenkins) | 🔴 Not Started |
| 3 | Build & Test (npm/Jest) | 🟡 Partial (tools exist, no pipeline) |
| 4 | SAST (SonarQube) | 🔴 Not Started |
| 5 | SCA (Trivy FS) | 🔴 Not Started |
| 6 | Containerization (Docker) | 🔴 Not Started |
| 7 | Container Scan (Trivy Image) | 🔴 Not Started |
| 8 | Artifact Registry (ECR/Hub) | 🔴 Not Started |
| 9 | CD Engine (ArgoCD) | 🔴 Not Started |
| 10 | Orchestration Target (EKS) | 🔴 Not Started |
| 11 | Observability (Prometheus/Grafana) | 🔴 Not Started |
