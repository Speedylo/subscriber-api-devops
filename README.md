# Subscriber API: DevOps Pipeline

![Azure](https://img.shields.io/badge/azure-%230072C6.svg?style=for-the-badge&logo=microsoft-azure&logoColor=white)
![GitHub Actions](https://img.shields.io/badge/github%20actions-%232671E5.svg?style=for-the-badge&logo=githubactions&logoColor=white)
![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![Jest](https://img.shields.io/badge/-jest-%23C21325?style=for-the-badge&logo=jest&logoColor=white)
![ESLint](https://img.shields.io/badge/ESLint-4B3263?style=for-the-badge&logo=eslint&logoColor=white)

[![CI Pipeline](https://github.com/Speedylo/subscriber-api-devops/actions/workflows/ci.yml/badge.svg)](https://github.com/Speedylo/subscriber-api-devops/actions)
[![CD Pipeline](https://github.com/Speedylo/subscriber-api-devops/actions/workflows/cd.yml/badge.svg)](https://github.com/Speedylo/subscriber-api-devops/actions)

## Purpose

This is a **learning-by-building** project focused on designing and operating a production-grade CI/CD pipeline and cloud infrastructure. While the core API application is intentionally simple, it serves as the vehicle for mastering complex delivery and operational workflows.

## Overview

The primary goal of this project was to simulate real-world software delivery processes, moving beyond simple coding to focus on automation, reliability, and observability.

* **Automated CI/CD:** Powered by GitHub Actions.
* **Containerization:** Docker-managed environments for dev, test, and prod.
* **Cloud Infrastructure:** Azure Container Apps with serverless Cosmos DB.
* **Quality Control:** 100% test coverage threshold and ESLint enforcement.

## Development Workflow

### Code Quality & Security

* **Static Analysis:** ESLint enforces consistent style (semicolons, quote styles) to maintain maintainability.
* **Security Auditing:** All dependency vulnerabilities are identified and resolved via `npm audit` during the build process.
* **Logging:** Integrated Morgan middleware to capture all incoming HTTP traffic for operational transparency.

### Branching Strategy

* `dev`: The active development branch for feature work.
* `main`: A protected branch representing production-ready code. Merges are only permitted after passing all CI status checks.

### Testing Suite

1. **Manual Validation:** Initial endpoint verification via Postman/cURL.
2. **Automated Testing:** Jest and Supertest handle integration and unit tests.
3. **Quality Gates:** Strict coverage thresholds are enforced in the CI pipeline. If coverage drops, the build fails.


## CI/CD Implementation

### Continuous Integration (CI)

The `ci.yml` workflow triggers on the `dev` branch to validate code before it reaches the main codebase:

* Installs dependencies and runs the ESLint linter.
* Orchestrates a Docker environment to run tests in isolation.
* Uploads coverage reports as artifacts and performs security audits.

### Continuous Deployment (CD)

The `cd.yml` workflow triggers upon a merge to the `main` branch:

* **Build & Push:** Packages the application into a Docker image and pushes it to GitHub Container Registry (GHCR).
* **Automated Deploy:** Signals Azure Container Apps to pull the new image and deprovision the previous revision using Github secrets for Azure logging.
* **Secret Management:** Securely injects database connection string using Azure secrets.

**Rationale:** CI ensures code quality and reliability before merging while CD automates production deployment, reducing human error. Moreover, using Docker guarantees consistent environments from dev to production.


## Production Environment & Monitoring

### Infrastructure

* **Compute:** Azure Container Apps (Serverless) with external HTTP ingress.
* **Database:** Azure Cosmos DB (MongoDB API) configured for serverless scaling.
* **Security:** Environment variables are stored as container secrets, never in plain text.

### Observability

* **Health Checks:** A dedicated `/health` endpoint monitors service availability.
* **Telemetry:** Logs are piped into Azure Application Insights.
* **Custom Dashboards:** Built visual monitors to track:
    * Request volumes by method (GET, POST, etc.).
    * Success vs. Error ratios (2xx/4xx/5xx trends).


## Key Outcomes & Learning

* **Zero-Manual Deployment:** Achieved a fully automated "push-to-deploy" workflow.
* **Infrastructure Skills:** Gained hands-on experience with Azure cloud architecture and secret management.
* **Professional Standards:** Mastered industry-standard DevOps practices, including branch protection and automated quality gates.
* **Operational Awareness:** Learned to use real-time data to ensure application health post-deployment.
