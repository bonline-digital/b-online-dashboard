<script lang="ts">
    import {
        get_float_or_null,
        get_int_or_null,
        type RowData,
    } from "$lib/helpers";
    import { fields, platforms } from "$lib/stores";
    import papaparse from "papaparse";
    import { cubicInOut } from "svelte/easing";
    import { fade } from "svelte/transition";

    export let uploading: boolean;
    export let upload_state: number;
    export let data: Array<RowData>;
    let data_source: string;
    let data_file: FileList;
    let date_value: string;
    let date: Date;

    $: {
        date = new Date(date_value);
    }

    function cancel_upload(): void {
        uploading = false;
    }

    function submit_upload(): void {
        const file = data_file.item(0) as File;

        file.arrayBuffer().then((value: ArrayBuffer): void => {
            const text_decoder = new TextDecoder("utf-16");
            const csv_text = text_decoder.decode(value);
            const parser = papaparse.parse(csv_text, {
                header: true,
            });
            const parsed_fields = parser.meta.fields;

            if (parsed_fields) {
                const rows = new Map<string, string>();

                parsed_fields.forEach((value: string): void => {
                    const proper_value = value.trim().toLowerCase();

                    if ($fields.has(proper_value)) {
                        rows.set(proper_value, value);
                    }
                });

                data = new Array<RowData>(parser.data.length);

                if (rows.size === $fields.size) {
                    parser.data.forEach((value: any, index: number): void => {
                        const campaign = value[rows.get("campaign") as string];
                        data[index] = {
                            id: index,
                            platform: parseInt(data_source),
                            campaign: campaign ? campaign : "",
                            impressions: get_int_or_null(
                                value[rows.get("impressions") as string],
                            ),
                            reach: get_float_or_null(
                                value[rows.get("reach") as string],
                            ),
                            clicks: get_int_or_null(
                                value[rows.get("clicks") as string],
                            ),
                            views: get_int_or_null(
                                value[rows.get("views") as string],
                            ),
                            ctr: get_float_or_null(
                                value[rows.get("ctr") as string],
                            ),
                            cpm: get_float_or_null(
                                value[rows.get("cpm") as string],
                            ),
                            cpc: get_float_or_null(
                                value[rows.get("cpc") as string],
                            ),
                            cpv: get_float_or_null(
                                value[rows.get("cpv") as string],
                            ),
                            spent: get_int_or_null(
                                value[rows.get("spent") as string],
                            ),
                            date: date.getTime(),
                        };
                    });

                    upload_state = 1;
                } else {
                    console.error($fields, rows);
                }
            } else {
                console.error("err");
            }
        });
    }
</script>

<form
    on:submit={submit_upload}
    class="upload-input m-auto"
    in:fade={{ duration: 250, easing: cubicInOut }}
>
    <p class="fs-1 gray-800 mb-1">Upload</p>
    <select
        bind:value={data_source}
        class="form-select form-select-lg gray-800 mb-3"
        required
    >
        <option value="" selected>Select source</option>
        {#each $platforms as platform, index}
            <option value={index.toString()}>{platform}</option>
        {/each}
    </select>
    <input
        type="date"
        bind:value={date_value}
        class="form-control form-control-lg gray-800 mb-3"
        required
    />
    <input
        bind:files={data_file}
        class="form-control form-control-lg gray-800 mb-2"
        type="file"
        accept=".csv"
        required
    />
    <div class="d-flex justify-content-end">
        <button
            on:click={cancel_upload}
            type="reset"
            class="btn btn-link link-underline link-underline-opacity-0 me-2"
        >
            <span>Cancel</span>
        </button>
        <button type="submit" class="btn btn-primary">
            <span>Proceed</span>
        </button>
    </div>
</form>

<style lang="scss">
    .upload-input {
        width: 30rem;
    }
</style>
