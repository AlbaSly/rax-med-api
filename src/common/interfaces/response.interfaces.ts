interface Response {
    isError: boolean;
    statusCode: number;
    msg: string;
}

export interface IResolveResponse<T> extends Response {
    data: T;
}

export interface IRejectResponse extends Response {
    error?: any;
}