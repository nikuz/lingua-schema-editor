export interface ProxyResponse {
    headers: Record<string, string>,
    statusCode: number
    text: string,
}