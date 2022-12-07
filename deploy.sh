#!/bin/bash
cd deploy-scripts
(source try-dotenv-vault-login.sh) # 배포 환경 .env 설정

source ./config.sh # 프로젝트 디렉토리 환경변수 설정

cd ${PROJECT_BASE_DIR}
git pull origin main

npm ci
npm run deploy