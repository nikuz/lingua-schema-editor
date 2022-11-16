import axios from 'axios';
import { Request, Response } from 'express';

export function translate(req: Request, res: Response) {
    const body = new URLSearchParams();
    for (const item in req.body) {
        console.log(item);
        body.append(item, req.body[item]);
    }

    return axios(String(req.query.url), {
        method: 'POST',
        headers: {
            'content-type': 'application/x-www-form-urlencoded;charset=UTF-8'
        },
        data: body,
    })
        .then(result => res.status(200).send(result.data))
        .catch(error => {
            res.status(error.response.status).send(error.toString());
        });
}
