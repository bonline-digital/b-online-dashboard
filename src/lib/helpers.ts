import { get } from "svelte/store";
import { admin_store, logged_in_store, rendered_rows_store, rows_store, total_values_store, total_values_tweened } from "./stores";

export class RowData {
    public id = -1;
    public campaign = "";
    public platform = -1;
    public impressions: number | null = null;
    public reach: number | null = null;
    public clicks: number | null = null;
    public views: number | null = null;
    public ctr: number | null = null;
    public cpm: number | null = null;
    public cpc: number | null = null;
    public cpv: number | null = null;
    public spent: number | null = null;
    public date: number = -1;
}

export function get_int_or_null(str: string): number | null {
    const temp = parseInt(str);

    if (isNaN(temp)) {
        return null;
    }

    return temp;
}

export function get_float_or_null(str: string): number | null {
    const temp = parseFloat(str);

    if (isNaN(temp)) {
        return null;
    }

    return temp;
}

function prepare_rows(data: any): Array<RowData> {
    if (data === undefined) {
        return [];
    }

    const rows = new Array<RowData>(data.length);

    for (let i = 0; i < rows.length; ++i) {
        rows[i] = {
            id: i,
            campaign: data[i]._campaign,
            platform: parseInt(data[i]._platform),
            impressions: get_int_or_null(data[i]._impressions),
            reach: get_float_or_null(data[i]._reach),
            clicks: get_int_or_null(data[i]._clicks),
            views: get_int_or_null(data[i]._views),
            ctr: get_float_or_null(data[i]._ctr),
            cpm: get_float_or_null(data[i]._cpm),
            cpc: get_float_or_null(data[i]._cpc),
            cpv: get_float_or_null(data[i]._cpv),
            spent: get_int_or_null(data[i]._spent),
            date: parseInt(data[i]._date)
        };
    }

    return rows;
}

export function load_page_ui(data: any): void {
    logged_in_store.set(true);

    let total_impressions = 0;
    let total_clicks = 0;
    let total_reach = 0.0;
    let total_views = 0;
    let total_spent = 0;
    let avg_cpm = 0.0;
    let avg_cpc = 0.0;
    let avg_ctr = 0.0;
    let avg_cpv = 0.0;

    admin_store.set(data.admin === true);
    rows_store.set(prepare_rows(data.campaigns));
    rendered_rows_store.set(get(rows_store).slice(0, 100));

    get(rows_store).forEach((value: RowData): void => {
        total_impressions += value.impressions ?? 0;
        total_clicks += value.clicks ?? 0;
        total_reach += value.reach ?? 0.0;
        total_views += value.views ?? 0;
        total_spent += value.spent ?? 0;
        avg_cpm += value.cpm ?? 0.0;
        avg_cpc += value.cpc ?? 0.0;
        avg_ctr += value.ctr ?? 0.0;
        avg_cpv += value.cpv ?? 0.0;
    });

    const rows_length = get(rows_store).length;

    if (rows_length > 0) {
        avg_cpm /= rows_length;
        avg_cpc /= rows_length;
        avg_ctr /= rows_length;
        avg_cpv /= rows_length;
    }

    total_values_store.set({
        impressions: total_impressions,
        reach: total_reach,
        clicks: total_clicks,
        views: total_views,
        avg_cpm: avg_cpm,
        avg_cpc: avg_cpc,
        avg_ctr: avg_ctr,
        avg_cpv: avg_cpv,
        total_spent: total_spent
    });
    total_values_tweened.set({
        impressions: total_impressions,
        clicks: total_clicks,
        avg_cpm: avg_cpm,
        avg_cpc: avg_cpc,
        avg_ctr: avg_ctr,
        avg_cpv: avg_cpv
    });
}

const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

export function make_date_str(date: Date): string {
    return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
}