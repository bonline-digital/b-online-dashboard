import { pg_pool_store } from "$lib/stores.server";
import { error, json, type RequestEvent } from "@sveltejs/kit";
import { get } from "svelte/store";
import argon2 from "argon2";
import { get_auth_user } from "$lib/helpers.server";

export async function POST(request_event: RequestEvent): Promise<Response> {
    const auth_user = get_auth_user(request_event.cookies.get("ad-dashboard-jwt"));

    if (auth_user === null) {
        return error(403);
    }

    const request = request_event.request;
    const request_data = await request.json();
    const password = request_data.password;
    const new_password = request_data.new_password;
    let return_val = 0;
    const pg_pool = get(pg_pool_store);
    const pg_client = await pg_pool.connect();

    pg_client.query("begin");

    const result = await pg_client.query("select _get_password($1::int8) as _password", [auth_user.id]);

    if (result.rows.length === 0) {
        return_val = -1;
    }
    else {
        const pwd_hash = result.rows[0]._password as string;
        const success = await argon2.verify(pwd_hash, password);

        if (!success) {
            return_val = -2;
        }
        else {
            const new_pwd_hash = await argon2.hash(new_password);

            await pg_client.query("select _edit_password($1, $2)", [auth_user.id, new_pwd_hash]);
        }
    }

    if (return_val === 0) {
        pg_client.query("commit");
    }
    else {
        pg_client.query("rollback");
    }

    pg_client.release();

    return json({
        status: return_val
    });
}