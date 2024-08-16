import { redirect } from "@sveltejs/kit";

export async function load(): Promise<void> {
    redirect(308, "platforms/0");
}