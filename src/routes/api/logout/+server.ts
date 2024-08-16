import { delete_cookie } from "$lib/helpers.server";
import type { RequestEvent } from "@sveltejs/kit";

export async function GET(request_event: RequestEvent): Promise<Response> {
    delete_cookie(request_event.cookies);

    return new Response();
}