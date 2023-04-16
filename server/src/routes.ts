import path from 'path';
import { Express, Request } from 'express';
import proxy from 'express-http-proxy';
import bodyParser from 'body-parser';
import {
    schemaController,
    languageController,
    dictionaryController,
    authenticationController,
    googlePlayController,
} from './controllers';

exports = module.exports = (app: Express) => {
    app.use('/api/proxy', proxy(
        (req) => {
            const url = getProxyUrl(req);
            return `${url.protocol}//${url.host}`;
        },
        {
            filter: authenticationController.isAuthorized,
            proxyReqPathResolver: (req) => {
                const url = getProxyUrl(req);
                return `${url.pathname}${url.search}`;
            },
            proxyReqOptDecorator: function(proxyReqOpts) {
                const headers = proxyReqOpts.headers;
                if (headers) {
                    delete headers['authorization'];
                    if (headers['authorization-cookie']) {
                        headers['cookie'] = headers['authorization-cookie'];
                        delete headers['authorization-cookie'];
                    }
                    if (headers['authorization-origin']) {
                        headers['origin'] = headers['authorization-origin'];
                        headers['referer'] = headers['authorization-origin'];
                        delete headers['authorization-origin'];
                    }
                }
                return proxyReqOpts;
            },
            userResDecorator: function(proxyRes, proxyResData, userReq, userRes) {
                // always answer with 200 success, original status is set in 'statusCode' body parameter
                userRes.statusCode = 200;
                // fix proxy CORS
                userRes.setHeader('Access-Control-Allow-Origin', '*');

                return JSON.stringify({
                    statusCode: proxyRes.statusCode,
                    headers: proxyRes.headers,
                    text: proxyResData.toString(),
                });
            },
        }
    ));

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));

    // schema
    app.get('/api/auth/schemas', schemaController.getList);
    app.post('/api/auth/schemas', schemaController.add);
    app.get('/api/auth/schema/:id', schemaController.get);
    app.get('/api/schema/:id', schemaController.getEncrypted);
    app.put('/api/auth/schema/:id', schemaController.setCurrent);
    app.post('/api/auth/schema/:id', schemaController.update);
    app.delete('/api/auth/schema/:id', schemaController.remove);

    // language
    app.get('/api/languages', languageController.getLanguages);
    app.post('/api/auth/languages', languageController.storeLanguages);

    // translation
    app.post('/api/dictionary', dictionaryController.save);
    app.put('/api/dictionary', dictionaryController.update);

    // google play
    app.get('/api/google-play/verify-purchase', googlePlayController.verifyPurchase);

    // privacy policy
    app.get('/privacy-policy', (req, res) => {
        res.sendFile(path.resolve(__dirname, '../../build/privacy-policy.html'));
    });

    app.use('/static', (req, res) => {
        res.sendFile(path.resolve(__dirname, `../../build/static/${req.url}`));
    });
    app.use('/favicon.ico', (req, res) => {
        res.sendFile(path.resolve(__dirname, '../../build/favicon.ico'));
    });
    app.use('/robots.txt', (req, res) => {
        res.sendFile(path.resolve(__dirname, '../../build/robots.txt'));
    });
    app.all('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, '../../build/index.html'));
    });
};

function getProxyUrl(req: Request) {
    let urlParam = req.query.url?.toString();
    if (!urlParam) {
        urlParam = req.originalUrl;
    }

    return new URL(urlParam);
}