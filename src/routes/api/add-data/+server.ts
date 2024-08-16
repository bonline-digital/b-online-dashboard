import type { RowData } from "$lib/helpers";
import { get_auth_user } from "$lib/helpers.server";
import { pg_pool_store } from "$lib/stores.server";
import { error, type RequestEvent } from "@sveltejs/kit";
import { get } from "svelte/store";

export async function POST(request_event: RequestEvent): Promise<Response> {
    const auth_user = get_auth_user(request_event.cookies.get("ad-dashboard-jwt"));

    if (auth_user === null) {
        return error(403);
    }

    const request = request_event.request;
    const request_obj: Array<RowData> = await request.json();
    const campaigns = new Array<string>(request_obj.length);
    const platforms = new Array<number>(request_obj.length);
    const impressions = new Array<number | null>(request_obj.length);
    const reach = new Array<number | null>(request_obj.length);
    const clicks = new Array<number | null>(request_obj.length);
    const views = new Array<number | null>(request_obj.length);
    const ctr = new Array<number | null>(request_obj.length);
    const cpm = new Array<number | null>(request_obj.length);
    const cpc = new Array<number | null>(request_obj.length);
    const cpv = new Array<number | null>(request_obj.length);
    const spent = new Array<number | null>(request_obj.length);
    const date = new Array<number>(request_obj.length);

    request_obj.forEach((value: RowData, index: number): void => {
        campaigns[index] = value.campaign;
        platforms[index] = value.platform;
        impressions[index] = value.impressions;
        reach[index] = value.reach;
        clicks[index] = value.clicks;
        views[index] = value.views;
        ctr[index] = value.ctr;
        cpm[index] = value.cpm;
        cpc[index] = value.cpc;
        cpv[index] = value.cpv;
        spent[index] = value.spent;
        date[index] = value.date;
    });

    const pg_pool = get(pg_pool_store);

    await pg_pool.query("select _add_data($1::text[], $2::int8[], $3::int8[], $4::float4[], $5::int8[], $6::int8[], $7::float8[], $8::float8[], $9::float8[], $10::float8[], $11::int8[], $12::int8[])", [campaigns, platforms, impressions, reach, clicks, views, ctr, cpm, cpc, cpv, spent, date]);

    return new Response();
}