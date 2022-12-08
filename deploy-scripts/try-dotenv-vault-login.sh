#!/bin/bash
source ./config.sh
source ${VAULT_KEY_FILE}

cd ${FRONTEND_DIR}
if [ ! -f ./.env.me ]; then
        npx dotenv-vault login ${VAULT_FRONTEND_KEY} > /dev/null
fi

cd ${BACKEND_DIR}
if [ ! -f ./.env.me ]; then
        npx dotenv-vault login ${VAULT_BACKEND_KEY} > /dev/null
fi

echo "dotenv-vault login done"
