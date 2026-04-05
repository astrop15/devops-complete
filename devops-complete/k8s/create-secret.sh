#!/usr/bin/env bash
kubectl create secret generic app-secrets \
  --namespace=devops-training \
  --from-literal=DB_USER=appuser \
  --from-literal=DB_PASSWORD=supersecret123
