import path from 'path';
import { Express, Request } from 'express';
import proxy from 'express-http-proxy';
import bodyParser from 'body-parser';
import { schemaController, languageController } from './controllers';
import { authUtils } from './utils';

exports = module.exports = (app: Express) => {
    app.use('/proxy', proxy(
        (req) => {
            const url = getProxyUrl(req);
            return `${url.protocol}//${url.host}`;
        },
        {
            filter: authUtils.isAuthorized,
            proxyReqPathResolver: (req) => {
                const url = getProxyUrl(req);
                return `${url.pathname}${url.search}`;
            },
        }
    ));

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));

    // schema
    app.get('/schemas', schemaController.getList);
    app.post('/schemas', schemaController.add);
    app.get('/schema/current', schemaController.getCurrent);
    app.get('/schema/:id', schemaController.get);
    app.put('/schema/:id', schemaController.setCurrent);
    app.post('/schema/:id', schemaController.update);
    app.delete('/schema/:id', schemaController.remove);

    //language
    app.get('/languages', languageController.getLanguages);
    app.post('/languages', languageController.storeLanguages);

    app.use('/static', (req, res) => {
        res.sendFile(path.resolve(__dirname, `../../build/static/${req.url}`));
    });
    app.use('/favicon.ico', (req, res) => {
        res.sendFile(path.resolve(__dirname, `../../build/favicon.ico`));
    });
    app.use('/robots.txt', (req, res) => {
        res.sendFile(path.resolve(__dirname, `../../build/robots.txt`));
    });
    app.all('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, '../../build/index.html'));
    });
};

function getProxyUrl(req: Request) {
    let urlParam = req.query.url?.toString();
    if (urlParam) {
        urlParam = decodeURIComponent(urlParam);
    } else {
        urlParam = req.originalUrl;
    }

    return new URL(urlParam);
}