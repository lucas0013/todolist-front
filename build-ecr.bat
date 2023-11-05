aws ecr get-login-password --region us-east-2 --profile Lucas-Admin | docker login --username AWS --password-stdin 396293663259.dkr.ecr.us-east-2.amazonaws.com
docker build -t frontend-registry-repo .
docker tag frontend-registry-repo:latest 396293663259.dkr.ecr.us-east-2.amazonaws.com/frontend-registry-repo
docker push 396293663259.dkr.ecr.us-east-2.amazonaws.com/frontend-registry-repo