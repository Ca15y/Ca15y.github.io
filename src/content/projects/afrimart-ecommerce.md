---
title: AfriMart e-commerce platform on AWS
summary: Bloomy Technologies supplied a five-service e-commerce app running on Docker Compose. My part was moving it to AWS with Terraform, Ansible, Kubernetes on EKS and a Jenkins pipeline to Amazon ECR.
headlineFacts:
  - '6 Terraform modules: VPC, EC2, RDS, ElastiCache, S3, EKS'
  - Jenkins to ECR with no stored AWS keys (EC2 IAM role)
  - Autoscales 2–5 backend pods at 70% CPU
# My work only. The supplied app's stack is named in the problem statement.
stack:
  - Terraform
  - AWS VPC
  - EC2
  - RDS
  - ElastiCache
  - S3
  - EKS
  - ECR
  - Kubernetes
  - Ansible
  - Jenkins
  - Trivy
  - Docker
status: not-live
category: devops
order: 3
links:
  code: https://github.com/Ca15y/afrimart-ecommerce
problem: This was Bloomy Technologies' four-week DevOps assignment. They supplied an e-commerce app (React, Node.js/Express, PostgreSQL, Redis and Nginx) that ran locally with Docker Compose. The task was to deploy it to AWS using infrastructure as code, configuration management, Kubernetes and a CI/CD pipeline. The application code was theirs; the infrastructure and the pipeline were mine.
architecture:
  caption: Everything is provisioned with Terraform, and the Jenkins server is configured with Ansible. The infrastructure was torn down in February 2026.
  tiers:
    - - label: Jenkins on EC2
        detail: parallel install, lint, test; Trivy
    - - label: Amazon ECR
        detail: build-number and latest tags
        via: EC2 IAM role
        accent: true
    - - label: EKS cluster
        detail: 'HPA: backend 2–5, frontend 2–4 pods'
    - - label: RDS PostgreSQL
        detail: private subnets
      - label: ElastiCache Redis
        detail: port 6379, VPC only
      - label: S3
        detail: uploads bucket
decisions:
  - decision: Push images to ECR with the Jenkins server's IAM role.
    why: The first version used stored credentials. With the instance role, no AWS keys live in Jenkins.
next:
  - Make lint, test and the Trivy scans fail the build. They currently end in `|| true`, so they never stop it.
  - Replace the placeholder staging and production deploy stages, which only `echo`, with real deploys to EKS.
  - Deploy images by build number instead of `latest`.
  - Keep Terraform state in S3 with DynamoDB locking, as the assignment asked. The backend configuration is not in the repository.
---

- **Terraform:** modules for the VPC (two public and two private subnets), an EC2 instance with an Elastic IP, RDS PostgreSQL in the private subnets, ElastiCache Redis (`cache.t3.micro`, port 6379 open only inside the VPC), an S3 uploads bucket with a random suffix, and an EKS cluster with a `t3.micro` node group of one to three nodes.
- **Ansible:** `site.yml` applies the common, nodejs, nginx, app and jenkins roles. The app role clones the repository, installs dependencies and runs the backend as a systemd service. `ci/deploy.sh` runs the playbook.
- **Kubernetes:** a production namespace with backend and frontend Deployments, each with resource requests and limits and `/health` liveness and readiness probes. The frontend is exposed through an AWS Network Load Balancer. Horizontal Pod Autoscalers scale the backend from 2 to 5 pods and the frontend from 2 to 4 at 70% CPU.
- **Jenkins:** a Jenkinsfile with timeouts and timestamps, parallel install, lint and test stages, Trivy config and image scans, and a manual approval before production on main. Images are tagged with the build number and `latest` and pushed to ECR using the EC2 instance's IAM role.
- **Not finished:** the staging and production deploy stages are still placeholders, so nothing deploys to EKS automatically. The lint, test and scan steps report problems but never fail the build.
