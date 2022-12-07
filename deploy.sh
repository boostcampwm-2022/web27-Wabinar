#!/bin/bash
cd deploy-scripts
(source try-dotenv-vault-login.sh)
(source pre-build.sh)
(source build-frontend.sh)
(source build-backend.sh)
