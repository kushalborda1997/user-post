import mongoose from 'mongoose';
import config from '../configuration';

const dbOptions = { useCreateIndex: true, useFindAndModify: false, useNewUrlParser: true, useUnifiedTopology: true };

export default function connect() {
    mongoose.connect(config.dbUri, dbOptions)
        .then(() => console.log("Database connected.."))
        .catch(err => {
            console.log(err.message);
            process.exit(1);
        })
}
