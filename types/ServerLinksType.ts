export interface ServerLinkType {
  id: number;
  name: string;
  link: string;
  enable: boolean
}

export type APIType = ServerLinkType[];

export type ActionResultType<T> =
  | { ok: true; msg: T }
  | { ok: false; msg: unknown };