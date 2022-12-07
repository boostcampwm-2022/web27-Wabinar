source ./config.sh

cd ${PROJECT_BASE_DIR}

rm -rf @wabinar # temp
git restore @wabinar

git pull origin main
npm ci