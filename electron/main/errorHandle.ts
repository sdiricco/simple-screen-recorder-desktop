import { IIPC, IError} from "../types";

export async function errorHandle(fn: Function, error: IError): Promise<IIPC> {
  const result: IIPC = {};
  try {
    result.data = await fn();
  } catch (e) {
    result.error = { ...{details: e.message}, ...error };
  }
  return result;
}
