import type { AddUserData } from "$lib/helpers";
import { get_auth_user } from "$lib/helpers.server";
import { pg_pool_store } from "$lib/stores.server";
import { error, type RequestEvent } from "@sveltejs/kit";
import argon2 from "argon2";
import { get } from "svelte/store";

export async function POST(request_event: RequestEvent): Promise<Response> {
    const auth_user = get_auth_user(request_event.cookies.get("ad-dashboard-jwt"));

    if (auth_user === null) {
        return error(403);
    }

    const request = request_event.request;
    const request_obj: AddUserData = await request.json();
    const pwd_hash = await argon2.hash(request_obj.password);
    const pg_pool = get(pg_pool_store);
    await pg_pool.query("select _add_user($1, $2, $3)", [request_obj.username, pwd_hash, request_obj.admin]);

    return new Response();
}