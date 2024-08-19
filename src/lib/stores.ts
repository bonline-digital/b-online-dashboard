import { Toast } from "bootstrap";
import { readable, writable, type Writable } from "svelte/store";
import type { RowData } from "./helpers";
import { tweened } from "svelte/motion";
import { cubicInOut } from "svelte/easing";

export const platforms = readable(["Google", "Meta"]);
export const fields = readable(new Set(["campaign", "impressions", "reach", "clicks", "views", "ctr", "cpm", "cpc", "cpv", "spent"]));
export const logged_in_store = writable(true);
export const admin_store = writable(false);
export const rows_store = writable(new Array<RowData>());
export const rendered_rows_store = writable(new Array<RowData>());
export const total_values_store = writable({
    impressions: 0,
    reach: 0,
    clicks: 0,
    views: 0,
    avg_cpm: 0.0,
    avg_cpc: 0.0,
    avg_ctr: 0.0,
    avg_cpv: 0.0,
    total_spent: 0
});
export const total_values_tweened = tweened({
    impressions: 0,
    clicks: 0,
    avg_cpm: 0.0,
    avg_cpc: 0.0,
    avg_ctr: 0.0,
    avg_cpv: 0.0
}, {
    duration: 500,
    easing: cubicInOut
});
export const upload_success_toast_store = writable();
export const usernotfound_toast_store = writable(new Toast(""));
export const passwordnotmatch_toast_store = writable(new Toast(""));