import { ObjectDataString } from 'server-types';

export interface ProxyResponse {
    headers: ObjectDataString,
    statusCode: number
    text: string,
}