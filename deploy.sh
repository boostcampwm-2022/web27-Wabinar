#!/bin/bash
cd deploy-scripts
(source try-dotenv-vault-login.sh) # dotenv-vault 사용을 위한 로그인
(source deploy-main.sh) # 배포 스크립트