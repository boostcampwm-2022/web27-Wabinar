#!/bin/bash
cd deploy-scripts
(source try-dotenv-vault-login.sh)
(source build-backend.sh)
(source build-frontend.sh)
