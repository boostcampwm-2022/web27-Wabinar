import express from 'express';
import userModel from './db/connection';

(async () => {
  console.log(await userModel.findOne({ id: 1 }).exec());
})();

const app = express();

app.get('/', (req: any, res) => res.send('Express'));

app.listen(8080);
