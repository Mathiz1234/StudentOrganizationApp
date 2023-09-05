export interface ServerExceptionPayload {
  message: string | string[];
  errorName: string;
  errorStack: string;
  hostname: string;
  url: string;
  method: string;
  ip: string;
  headers: object;
  query: object;
  body: string;
  exception: any;
}
