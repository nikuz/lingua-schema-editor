import axios from 'axios';
import { Request, Response } from 'express';

export function get(req: Request, res: Response) {
    return axios(String(req.query.url), {
        headers: {
            'user-agent': String(req.query.userAgent),
        },
    })
        .then(result => res.status(200).send(result.data))
        .catch(error => {
            res.status(404).send(error.toString());
        });
}
