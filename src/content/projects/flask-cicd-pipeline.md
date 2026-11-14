---
title: Test-gated deployment pipeline
summary: A containerised Flask REST API deployed to AWS EC2 behind Nginx, where every push to main runs the tests, builds the image, and deploys only if the tests pass.
headlineFacts:
  - Deploys blocked on failing tests
  - 'One workflow: test, build, deploy'
stack: [Python, Flask, pytest, Docker, Nginx, AWS EC2, GitHub Actions]
status: not-live
order: 1
# TODO(israel): add the repository URL as links.code
---

<!-- Case study body (Summary, Problem, Architecture, ...) arrives in phase 2. -->
