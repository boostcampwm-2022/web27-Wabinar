#!/bin/bash
source ./config.sh # 프로젝트 디렉토리 환경변수 설정

cd ${PROJECT_BASE_DIR}
git pull origin main

npm ci
npm run deploy # main 브랜치 빌드

cd ${BACKEND_DIR}
cp .env ./dist
