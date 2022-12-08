#!/bin/bash
PROJECT_BASE_DIR=$(dirname $(realpath "$0"))
cd deploy-scripts
(source try-dotenv-vault-login.sh)
(source build-backend.sh)
(source build-frontend.sh)
