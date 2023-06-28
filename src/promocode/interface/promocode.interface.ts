import { Avantage } from "../schema/promocode.schema";

export enum ResponseStatus {
    Accepted = "accepted",
    Created = "created",
    Denied = "denied"
}
export type PromocodeResponse = { promocode_name: string, status: ResponseStatus, avantage?: Avantage; reasons?: string[] };
