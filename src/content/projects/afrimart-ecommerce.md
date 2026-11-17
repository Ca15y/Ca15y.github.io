---
title: AfriMart e-commerce platform on AWS
summary: Bloomy Technologies supplied a five-service e-commerce app; my part was taking it from Docker Compose to AWS. I wrote the Terraform modules for the network, database, cache, storage and an EKS cluster, the Ansible roles that configure the servers, the Kubernetes manifests with health probes and autoscaling, and the Jenkins pipeline that builds the images and pushes them to Amazon ECR.
headlineFacts:
  - '6 Terraform modules: VPC, EC2, RDS, ElastiCache, S3, EKS'
  - Jenkins to ECR with no stored AWS keys (EC2 IAM role)
  - Autoscales 2–5 backend pods at 70% CPU
stack:
  - Terraform
  - AWS VPC
  - EC2
  - RDS (PostgreSQL)
  - ElastiCache (Redis)
  - S3
  - EKS
  - ECR
  - Kubernetes
  - Ansible
  - Jenkins
  - Trivy
  - Docker
  - Docker Compose
  - Nginx
  - Prometheus
  - Winston
  - React
  - Node.js
  - Express
  - PostgreSQL
  - Redis
  - Bull
status: not-live
category: devops
order: 3
links:
  code: https://github.com/Ca15y/afrimart-ecommerce
---

## Facts from the repository (draft notes for the phase 2 case study)

Context: end-to-end DevOps assignment at Bloomy Technologies (STUDENT_ASSIGNMENT.md, 4 weeks).
Confirmed by owner (2026-11-17): Bloomy supplied the application code; Israel's work was the
infrastructure and pipeline (Terraform, Ansible, Kubernetes, Jenkins, ECR).

- **Application (supplied, not Israel's code):** React 18 + Vite frontend, Node.js/Express API, PostgreSQL (Sequelize), Redis for
  caching and sessions, Bull queue for email jobs, JWT auth, Multer uploads to S3, Winston logging,
  Prometheus metrics via prom-client (request duration histogram, request counter, active connections).
- **Local:** docker-compose with postgres, redis, backend, frontend and nginx, each with a health check.
- **Terraform:** modules for VPC (2 public + 2 private subnets), EC2 with Elastic IP, RDS PostgreSQL in
  private subnets, ElastiCache Redis (cache.t3.micro), S3 uploads bucket with a random suffix, EKS
  cluster with a t3.micro node group (1–3 nodes). Redis security group only allows 6379 from inside the VPC.
- **Ansible:** `site.yml` applies common, nodejs, nginx, app and jenkins roles; the app role clones the
  repo, installs dependencies and runs the backend as a systemd service. `ci/deploy.sh` runs the playbook.
- **Kubernetes (production namespace):** backend and frontend Deployments with resource requests/limits
  and `/health` liveness and readiness probes; frontend exposed through an AWS NLB; HPAs scale backend
  2–5 and frontend 2–4 pods at 70% CPU.
- **Jenkins:** timeouts and timestamps; parallel install, lint and test stages; Trivy config and image
  scans; images tagged with the build number and `latest`, pushed to ECR using the EC2 instance's IAM role
  (refactored away from stored credentials); manual approval before production on main.
- **Honest gaps for "what I would do next":** lint, test and Trivy steps use `|| true`, so they never
  fail the build; staging and production deploy stages are placeholders (`echo`); Kubernetes images use
  `latest`; Terraform state backend not in the repo. Infrastructure was torn down in Feb 2026.
