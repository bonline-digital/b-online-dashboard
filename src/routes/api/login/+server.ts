import { pg_pool_store } from "$lib/stores.server";
import { json, type RequestEvent } from "@sveltejs/kit";
import { get } from "svelte/store";
import argon2 from "argon2";
import { make_cookie } from "$lib/helpers.server";

export async function POST(request_event: RequestEvent): Promise<Response> {
    const request = request_event.request;
    const request_obj = await request.json();
    const username = request_obj.username as string;
    const password = request_obj.password as string;
    const pg_pool = get(pg_pool_store);
    const result = await pg_pool.query("select * from _get_password($1)", [username]);

    if (result.rows.length === 0) {
        return json({
            success: -1 // no such user
        });
    }

    const password_hash = result.rows[0]._password as string;
    const id = parseInt(result.rows[0]._id);
    const admin = result.rows[0]._admin as boolean;
    const success = await argon2.verify(password_hash, password);

    if (!success) {
        return json({
            success: -2 // password didn't match
        })
    }

    make_cookie(id, admin, request_event.cookies);

    return json({
        success: 0
    });
}