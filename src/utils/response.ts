export interface IResponseBody<T = any> {
  status: number
  message: string
  data: T | null
  meta: Record<string, any>
  error: string | null
}

export class ResponseBody<T = any> implements IResponseBody<T> {
  constructor(
    public status: number,
    public message: string,
    public data: T | null = null,
    public meta: Record<string, any> = {},
    public error: string | null = null
  ) {}
}

const success = (
  status: number,
  message: string,
  data: any = null,
  meta: any = {}
) => {
  return new ResponseBody(status, message, data, meta, null)
}

const failure = (
  status: number,
  message: string,
  error?: string
) => {
  return new ResponseBody(status, message, null, {}, error ?? message)
}

export default {
  success,
  failure
}
