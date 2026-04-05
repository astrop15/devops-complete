# DevOps Exercises — dossier complété à partir de la base fournie

Ce dossier reprend la base Kubernetes fournie et complète les 4 exercices :
- Exo 1 : Helm & Kustomize
- Exo 2 : Ansible
- Exo 3 : Docker avancé
- Exo 4 : Kubernetes

## Structure
- `app/` : application Node.js + Dockerfiles
- `devops-app-chart/` : chart Helm
- `values-dev.yaml`, `values-prod.yaml` : variables Helm par environnement
- `infra/ansible/` : docker-compose de test + inventaire + playbooks
- `roles/` : rôles Ansible `base`, `nginx`, `app`
- `docker-compose.yml` : stack complète app + postgres + redis + nginx
- `nginx/default.conf` : reverse proxy
- `k8s/` : manifests Kubernetes, Kustomize base/overlays, namespace et helper secret

## Exo 1 — Helm & Kustomize
### Helm
```bash
helm lint devops-app-chart/
helm template devops-app devops-app-chart/ -f values-dev.yaml
helm install devops-app devops-app-chart/ \
  -f values-dev.yaml \
  -n devops-training \
  --set postgresql.auth.password=secret123
helm upgrade devops-app devops-app-chart/ \
  -f values-prod.yaml \
  -n devops-training \
  --set postgresql.auth.password=secret123
```

### Kustomize
```bash
kubectl kustomize k8s/overlays/dev/
kubectl apply -k k8s/overlays/dev/
```

### Helm vs Kustomize
- Helm : templating, variables, dépendances, releases, rollback
- Kustomize : surcouches YAML natives, plus simple, sans moteur de template
- Helm est mieux pour les apps packagées et multi-env complexes
- Kustomize est pratique pour patcher des manifests existants

## Exo 2 — Ansible
```bash
cd infra/ansible
docker compose up -d
ansible all -i inventory.yml -m ping
ansible-playbook -i inventory.yml playbook-base.yml
ansible-playbook -i inventory.yml playbook-nginx.yml
ansible-playbook -i inventory.yml site.yml
ansible-playbook -i inventory.yml site.yml
```

La deuxième exécution de `site.yml` doit tendre vers `changed=0` pour démontrer l'idempotence.

## Exo 3 — Docker avancé
```bash
docker build -f app/Dockerfile.bad -t app:bad app/
docker build -t app:optimized app/
docker images --format "table {{.Repository}}:{{.Tag}}\t{{.Size}}" | grep app
docker history app:optimized
docker run --rm app:optimized whoami
```

Stack complète :
```bash
docker compose up -d
docker compose ps
curl http://localhost:80
curl http://localhost:80/health
docker compose down -v
```

## Exo 4 — Kubernetes
```bash
kubectl apply -f k8s/namespace.yaml
kubectl config set-context --current --namespace=devops-training
./k8s/create-secret.sh
kubectl apply -f k8s/configmap.yaml
kubectl apply -f k8s/postgres.yaml
kubectl apply -f k8s/app.yaml
kubectl apply -f k8s/ingress.yaml
kubectl get all -n devops-training
kubectl scale deployment devops-app --replicas=5 -n devops-training
kubectl rollout history deployment/devops-app -n devops-training
```

## Remarque
Je n'ai pas pu exécuter Docker/Kubernetes/Helm/Ansible ici pour produire des preuves runtime, mais le dossier est structuré pour suivre exactement les consignes et réutilise ta base Kubernetes comme fondation.
