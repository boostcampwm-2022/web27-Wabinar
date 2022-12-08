#!/bin/bash
source ./config.sh # 프로젝트 디렉토리 환경변수 설정

cd ${PROJECT_BASE_DIR}
git pull origin main

npm ci
npm run env # 배포 환경 .env 설정
npm run deploy # main 브랜치 빌드