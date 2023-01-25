import path from 'path';
import { Express, Request } from 'express';
import proxy from 'express-http-proxy';
import { schemaController } from 'src/controllers';
import { authUtils } from 'src/utils';

exports = module.exports = (app: Express) => {
    app.get('/', (req, res) => {
        res.sendFile(path.resolve(__dirname, '../../build/index.html'));
    });
    app.use('*/static', (req, res) => {
        console.log(req.url);
        res.sendFile(path.resolve(__dirname, `../../build/static/${req.url}`));
    });

    app.get('/schemas', schemaController.getList);

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