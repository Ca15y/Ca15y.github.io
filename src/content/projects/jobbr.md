---
title: 'Jobbr: keyless deploys to AWS Lambda'
summary: A job application tracker built with Next.js and Supabase that doubles as my DevOps lab. CI runs on every push, Vercel serves production, and a manual GitHub Actions release ships a container to AWS Lambda using OIDC, so no AWS keys are stored in GitHub.
headlineFacts:
  - GitHub OIDC to a scoped IAM role, no stored AWS keys
  - 'Terraform: ECR, IAM, Lambda, CloudWatch'
  - Commit-tagged images, health check, rollback
stack:
  - Next.js
  - TypeScript
  - Supabase
  - Docker
  - Amazon ECR
  - AWS Lambda
  - Lambda Web Adapter
  - Terraform
  - GitHub Actions
  - OIDC
  - CloudWatch
  - Vercel
status: live
category: devops
order: 1
links:
  code: https://github.com/Ca15y/jobbr
  live: https://jobbr-five.vercel.app
---

## Facts from the repository (draft notes for the phase 2 case study)

- CI (`ci.yml`) on pushes and PRs to main: `npm ci`, TypeScript check, ESLint, production build.
- Vercel deploys main through its GitHub integration; PRs get preview deployments. CI is not yet a formal gate for Vercel (listed on the repo's roadmap).
- AWS release (`deploy-aws.yml`) is started manually: OIDC token → short-lived role session → Docker Buildx `linux/amd64` image → ECR with commit-SHA and `latest` tags → Lambda updated to the commit tag → health check on `/login`.
- OIDC trust policy matches the repository's owner and repo IDs and the `aws-production` environment; the deploy role can only push to Jobbr's ECR repo and update Jobbr's Lambda function.
- Terraform (`infra/aws`): private AES-256 ECR repo with scan-on-push, lifecycle policy keeping 5 images, Lambda execution role limited to its log stream, GitHub OIDC provider, CloudWatch log group with 7-day retention, 1,024 MB / 30 s container Lambda with a Function URL using response streaming. Two-stage bootstrap because Lambda needs an image to exist first.
- Multi-stage Dockerfile, Next.js standalone output, runs as a non-root user on port 8080.
- Supabase Row Level Security ties each row to the signed-in user.
- Rollback: pick a known-good commit tag in ECR and point Lambda at it (code only, not data).
- Cost controls: manual AWS deploys, ECR keeps 5 images, logs kept 7 days.
