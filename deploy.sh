#!/bin/bash
cd deploy-scripts
(source try-dotenv-vault-login.sh) # dotenv-vault 사용을 위한 로그인
(source pull-production-dotenv.sh)
(source build-frontend-and-backend.sh) # 배포 스크립트
