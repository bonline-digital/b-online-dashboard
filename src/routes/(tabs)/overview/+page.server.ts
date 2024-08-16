import { get_auth_user } from "$lib/helpers.server";
import { pg_pool_store } from "$lib/stores.server";
import { error, type ServerLoadEvent } from "@sveltejs/kit";
import { get } from "svelte/store";

export async function load(request_event: ServerLoadEvent): Promise<any> {
    const auth_user = get_auth_user(request_event.cookies.get("ad-dashboard-jwt"));

    if (auth_user === null) {
        return error(403);
    }

    const from = request_event.url.searchParams.get("from");
    const to = request_event.url.searchParams.get("to");
    const pg_pool = get(pg_pool_store);
    const result = await pg_pool.query("select * from _get_data(-1::int8, $1::int8, $2::int8)", [from, to]);
    const admin = auth_user.admin === true;

    return {
        page_id: 0,
        admin: admin,
        campaigns: result.rows
    };
}