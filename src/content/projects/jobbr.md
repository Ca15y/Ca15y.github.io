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
problem: Deploying from GitHub to AWS usually means keeping long-lived AWS access keys in repository secrets, where a leak gives standing access to the account. I wanted to release a real application to AWS with no stored keys, a clear way to roll back, and costs that stay small.
architecture:
  caption: The AWS release path. Vercel serves production and deploys main on its own through its Git integration; CI runs separately on every push.
  tiers:
    - - label: manual dispatch
        detail: deploy-aws.yml in GitHub Actions
    - - label: OIDC → IAM role
        detail: short-lived session, no stored keys
        accent: true
    - - label: Docker Buildx
        detail: linux/amd64, multi-stage, non-root
    - - label: Amazon ECR
        detail: commit-SHA + latest tags, keeps 5
    - - label: AWS Lambda
        detail: Web Adapter, updated to commit tag
    - - label: health check
        detail: GET /login after the update
# TODO(israel): confirm the "why" lines below; they come from the Jobbr README.
decisions:
  - decision: Make the AWS release a manual workflow.
    why: Otherwise documentation-only commits would trigger builds that use AWS credits. It also makes release control something I practise on purpose.
  - decision: Keep Vercel as production and AWS Lambda as the lab.
    why: Vercel Hobby and Supabase Free cover the public deployment at no cost, while the AWS environment uses credits.
  - decision: Keep user data in Supabase, not in the container.
    why: Lambda is stateless and can replace an instance at any time.
  - decision: Tag every image with its Git commit SHA.
    why: Rolling back is picking a known-good tag in ECR and pointing Lambda at it.
  - decision: Keep five images in ECR and seven days of logs in CloudWatch.
    why: It caps storage and logging costs.
next:
  - Make CI a formal gate for production deploys. Today Vercel and CI react to the same push independently.
  - Add browser-level authentication and end-to-end tests.
  - Move Terraform state to a remote encrypted backend.
  - Add GitHub OAuth credentials in Supabase for the hosted deployment.
---

- **CI:** a GitHub Actions workflow on every push and pull request to main runs `npm ci`, the TypeScript check, ESLint and a production build.
- **Container:** a multi-stage Dockerfile builds Next.js in standalone mode and runs it as an unprivileged user on port 8080. The AWS Lambda Web Adapter turns Function URL requests into ordinary HTTP requests for that server.
- **Terraform (`infra/aws`):** a private, encrypted ECR repository with scan-on-push and a lifecycle policy that keeps the five newest images; a GitHub OIDC provider and a deploy role; a Lambda execution role limited to its own log stream; a CloudWatch log group with seven-day retention; and a 1,024 MB, 30-second container Lambda with a Function URL.
- **Least privilege:** the deploy role's trust policy matches Jobbr's GitHub owner and repository IDs and the `aws-production` environment. The role can only push to Jobbr's ECR repository and update Jobbr's Lambda function.
- **Two-stage bootstrap:** Terraform creates ECR and IAM first, a bootstrap image is pushed, then Terraform creates the Lambda function, because Lambda cannot reference an image that does not exist yet.
- **Release:** the manual workflow exchanges a GitHub OIDC token for a short-lived AWS session, builds a `linux/amd64` image, pushes it with its commit tag and `latest`, updates Lambda to the commit tag, waits for the update and checks `/login`.
- **Rollback:** point Lambda at a known-good commit tag in ECR. This rolls back code, not Supabase data.
