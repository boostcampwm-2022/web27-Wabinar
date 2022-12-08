#!/bin/bash
source ./config.sh

cd ${FRONTEND_DIR}
npx dotenv-vault pull production .env

cd ${BACKEND_DIR}
npx dotenv-vault pull production .env

echo "production dotenv pulled successfully"
