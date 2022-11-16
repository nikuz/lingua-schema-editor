import path from 'path';
import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import compression from 'compression';
import router from './router';

let envPathPrefix = '..';
if (process.env.NODE_ENV === 'development') {
    envPathPrefix = '../..';
}

dotenv.config({ path: path.join(__dirname, envPathPrefix, '.env') });

const port = process.env.REACT_APP_SERVER_PORT;

const app = express();
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));
app.use(cors());
app.use(compression());

// router
app.use(router);

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});

process.on('SIGINT', () => {
    process.exit(0);
});
