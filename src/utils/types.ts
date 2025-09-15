export type Json =
  | string
  | number
  | boolean
  | null
  | undefined
  | Json[]
  | JSONObject;

export interface JSONObject {
  [key: string]: Json;
}
