import mongoose from "mongoose";
import autoIncrement from "mongoose-auto-increment";
import env from "../config";

const options = {
  maxPoolSize: 10,
};

const DATABASE_URL = `mongodb://${env.DATABASE_USER}:${env.DATABASE_PASSWORD}@${env.DATABASE_HOST}:${env.DATABASE_PORT}/${env.DATABASE_NAME}`;
mongoose.connect(DATABASE_URL, options);

autoIncrement.initialize(mongoose.connection);

export default mongoose;
