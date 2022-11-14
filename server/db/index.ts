import mongoose from "mongoose";
import autoIncrement from "mongoose-auto-increment";
import env from "../config";

const options = {
  maxPoolSize: 10,
};
mongoose.connect(
  `mongodb://${env.DATABASE_USER}:${env.DATABASE_PASSWORD}@${env.DATABASE_HOST}:${env.DATABASE_PORT}/${env.DATABASE_NAME}`,
  options
);
autoIncrement.initialize(mongoose.connection);

export default mongoose;
