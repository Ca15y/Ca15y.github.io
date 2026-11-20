---
title: Test-gated deployment pipeline
summary: A containerised Flask REST API deployed to AWS EC2 behind Nginx, where every push to main runs the tests, builds the image, and deploys only if the tests pass.
headlineFacts:
  - Deploys blocked on failing tests
  - 'One workflow: test, build, deploy'
stack: [Python, Flask, pytest, Docker, Nginx, AWS EC2, GitHub Actions]
status: not-live
category: devops
order: 2
links:
  code: https://github.com/Ca15y/flask-cicd-pipeline
problem: Deploying by hand means logging in to the server, pulling the code and restarting the app, and nothing stops an untested change from going live. I wanted every push to main to be tested first and deployed only if the tests pass.
architecture:
  caption: One GitHub Actions workflow. The deploy job only starts when the test job passes.
  tiers:
    - - label: push to main
        detail: GitHub Actions starts the workflow
    - - label: test job
        detail: Python 3.11, pip install, pytest
        accent: true
    - - label: pipeline stops
        detail: nothing is deployed
        via: tests fail
        dashed: true
      - label: deploy job
        detail: SSH into EC2 (key in secrets)
        via: tests pass
    - - label: EC2 t2.micro
        detail: git pull, docker build, docker run
        from: [1]
    - - label: Nginx :80 → Flask :5000
        detail: container restarts on crash or reboot
decisions:
  - decision: 'The deploy job declares `needs: test`.'
    why: A failing test stops the pipeline before the deploy job starts, so broken code never reaches the server.
  - decision: Before redeploying, remove only the container published on port 5000.
    why: Other containers on the same server keep running.
  - decision: Run the container with `--restart always`.
    why: The app comes back after a crash or a server reboot without anyone logging in.
  - decision: Reach the server with an SSH key stored in GitHub secrets.
    why: No password is involved, and the host, user and key never appear in the repository.
next:
  - Serve the app with Gunicorn instead of the Flask development server.
  - Build the image in the pipeline and push it to a registry (Amazon ECR or Docker Hub) instead of building on the server.
  - Add HTTPS with a TLS certificate on Nginx.
  - Keep the Nginx configuration in the repository so the server setup is reproducible.
---

- **The app:** a small Flask API with two endpoints, `/` and `/health`, and two pytest tests that call them through Flask's test client.
- **The container:** a Dockerfile based on `python:3.11-slim` that installs the requirements and runs the app on port 5000.
- **The workflow:** one GitHub Actions file with two jobs. `test` sets up Python 3.11, installs the dependencies and runs pytest. `deploy` declares `needs: test`, so it only runs when the tests pass.
- **The deploy:** the deploy job connects to the EC2 instance over SSH using the host, user and key stored as repository secrets. It pulls the latest code, removes the container serving port 5000, builds a new image and starts it with `--restart always`.
- **The server:** an EC2 t2.micro running Ubuntu 24.04, with Nginx listening on port 80 and forwarding to the container on port 5000.
