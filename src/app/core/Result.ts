export interface Result<T> {
  result: boolean;
  data: T;
  message: string;
}
export interface UpdateOrPushInfo{
  type: string;
  from: string;
  to: string;
  toGroup: string;
}
