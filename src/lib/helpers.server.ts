import { JWT_KEY } from "$env/static/private";
import type { Cookies } from "@sveltejs/kit";
import jwt from "jsonwebtoken";

export class AuthUser {
    public id = -1;
    public admin = false;
}

export function get_auth_user(token: string | undefined): AuthUser | null {
    if (token === undefined) {
        return null;
    }

    try {
        return jwt.verify(token, JWT_KEY) as AuthUser;
    }
    catch (err) {
        return null;
    }
}

export function make_cookie(id: number, admin: boolean, cookies: Cookies): void {
    const token = jwt.sign(JSON.stringify({
        id: id,
        admin: admin
    }), JWT_KEY);

    cookies.set("ad-dashboard-jwt", token, {
        path: "/",
        expires: new Date(Date.now() + 30 * 86400 * 1000),
        httpOnly: true,
        secure: true
    });
}

export function delete_cookie(cookies: Cookies): void {
    cookies.delete("ad-dashboard-jwt", { path: "/" });
}