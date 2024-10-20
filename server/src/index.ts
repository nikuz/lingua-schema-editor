import path from 'path';
import https from 'https';
import fs from 'fs';
import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import compression from 'compression';

dotenv.config({ path: path.join(__dirname, '../../.env') });
dotenv.config({
    path: path.join(__dirname, '../../.env.secret'),
    override: true,
});

const routes = require('./routes');

const app = express();
const port = process.env.VITE_SERVER_PORT;
const env = process.env.NODE_ENV;

app.use(cors());
app.use(compression());

routes(app);

if (env === 'production') {
    const keysPath = process.env.KEYS_PATH;
    const certificateProps = {
        key: fs.readFileSync(`${keysPath}/privkey.pem`, 'utf8'),
        cert: fs.readFileSync(`${keysPath}/cert.pem`, 'utf8'),
        ca: fs.readFileSync(`${keysPath}/chain.pem`, 'utf8'),
    };
    https.createServer(certificateProps, app).listen(port, () => {
        console.log('Node client started on port:', port);
    });
} else {
    app.listen(port, () => {
        console.log('Node client started on port:', port);
    });
}

process.on('SIGINT', () => {
    process.exit(0);
});

process.on('unhandledRejection', (err: Error) => {
    console.log(err.message);
    process.exitCode = 1;
});