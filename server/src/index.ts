import path from 'path';
import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import compression from 'compression';

dotenv.config({ path: path.join(__dirname, '../../.env') });
dotenv.config({ path: path.join(__dirname, '../../.env.secret') });

const routes = require('./routes');

const app = express();
const port = process.env.REACT_APP_SERVER_PORT;

app.use(cors());
app.use(compression());

routes(app);

app.listen(port, () => {
    console.log('Node client started on port:', port);
});

process.on('SIGINT', () => {
    process.exit(0);
});

process.on('unhandledRejection', (err: Error) => {
    console.log(err.message);
    process.exitCode = 1;
});