import { PG_DATABASE, PG_HOST, PG_PASSWORD, PG_PORT, PG_USER } from "$env/static/private";
import pg from "pg";
import { readable } from "svelte/store";

const Pool = pg.Pool;
export const pg_pool_store = readable(new Pool({
    host: PG_HOST,
    port: parseInt(PG_PORT),
    user: PG_USER,
    password: PG_PASSWORD,
    database: PG_DATABASE,
    ssl: {
        rejectUnauthorized: false
    }
}));