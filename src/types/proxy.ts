import { ObjectDataString } from './common';

export interface ProxyResponse {
    headers: ObjectDataString,
    statusCode: number
    text: string,
}