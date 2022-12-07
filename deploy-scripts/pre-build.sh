source ./config.sh

cd ${PROJECT_BASE_DIR}

rm -rf @wabinar # temp

git pull origin main
npm ci