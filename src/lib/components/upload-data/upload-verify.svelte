<script lang="ts">
    import { goto } from "$app/navigation";
    import { page } from "$app/stores";
    import { make_date_str, type RowData } from "$lib/helpers";
    import { platforms, upload_success_toast_store } from "$lib/stores";
    import { cubicInOut } from "svelte/easing";
    import { fade } from "svelte/transition";

    export let uploading: boolean;
    export let upload_state: number;
    export let data: Array<RowData>;
    let data_uploading = false;

    function cancel_upload(): void {
        data = [];
        upload_state = 0;
    }

    function verify_upload(): void {
        data_uploading = true;

        fetch("/api/add-data", {
            method: "post",
            body: JSON.stringify(data),
        }).then((): void => {
            data_uploading = false;

            $upload_success_toast_store.show();

            uploading = false;

            goto($page.url.pathname, { invalidateAll: true });
        });
    }
</script>

<div
    class="h-100 w-100 d-flex flex-column"
    in:fade={{ duration: 250, easing: cubicInOut }}
>
    <p class="fs-1 gray-800 mb-1">Review</p>
    <div class="flex-grow-1 overflow-auto">
        <table class="table table-hover">
            <thead class="position-sticky top-0">
                <tr>
                    <th scope="col">
                        <span class="gray-800">#</span>
                    </th>
                    <th scope="col">
                        <span class="gray-800">Campaign</span>
                    </th>
                    <th scope="col">
                        <span class="gray-800">Platform</span>
                    </th>
                    <th scope="col">
                        <span class="gray-800">Impressions</span>
                    </th>
                    <th scope="col">
                        <span class="gray-800">Reach</span>
                    </th>
                    <th scope="col">
                        <span class="gray-800">Clicks</span>
                    </th>
                    <th scope="col">
                        <span class="gray-800">Views</span>
                    </th>
                    <th scope="col">
                        <span class="gray-800">CTR</span>
                    </th>
                    <th scope="col">
                        <span class="gray-800">CPM</span>
                    </th>
                    <th scope="col">
                        <span class="gray-800">CPC</span>
                    </th>
                    <th scope="col">
                        <span class="gray-800">CPV</span>
                    </th>
                    <th scope="col">
                        <span class="gray-800">Spent</span>
                    </th>
                    <th scope="col">
                        <span class="gray-800">Date</span>
                    </th>
                </tr>
            </thead>
            <tbody>
                {#each data as item, index}
                    <tr>
                        <th scope="row">
                            <span class="gray-800">{index + 1}</span>
                        </th>
                        <td class="campaign-name">
                            <span class="gray-800">
                                {item.campaign.trim().length === 0
                                    ? "<untitled>"
                                    : item.campaign}
                            </span>
                        </td>
                        <td>
                            <span class="gray-800">
                                {$platforms[item.platform]}
                            </span>
                        </td>
                        <td>
                            <span class="gray-800">
                                {item.impressions ?? "<invalid>"}
                            </span>
                        </td>
                        <td>
                            <span class="gray-800">
                                {item.reach ?? "<invalid>"}
                            </span>
                        </td>
                        <td>
                            <span class="gray-800">
                                {item.clicks ?? "<invalid>"}
                            </span>
                        </td>
                        <td>
                            <span class="gray-800">
                                {item.views ?? "<invalid>"}
                            </span>
                        </td>
                        <td>
                            <span class="gray-800">
                                {item.ctr ?? "<invalid>"}
                            </span>
                        </td>
                        <td>
                            <span class="gray-800">
                                {item.cpm ?? "<invalid>"}
                            </span>
                        </td>
                        <td>
                            <span class="gray-800">
                                {item.cpc ?? "<invalid>"}
                            </span>
                        </td>
                        <td>
                            <span class="gray-800">
                                {item.cpv ?? "<invalid>"}
                            </span>
                        </td>
                        <td>
                            <span class="gray-800">
                                {item.spent ?? "<invalid>"}
                            </span>
                        </td>
                        <td>
                            <span class="gray-800">
                                {make_date_str(new Date(item.date))}
                            </span>
                        </td>
                    </tr>
                {/each}
            </tbody>
        </table>
    </div>
    <div class="d-flex justify-content-end mt-2">
        <button
            on:click={cancel_upload}
            class="btn btn-link link-underline link-underline-opacity-0 me-2"
            disabled={data_uploading}
        >
            <span>Cancel</span>
        </button>
        <button
            on:click={verify_upload}
            class="btn btn-primary d-flex align-items-center"
            disabled={data_uploading}
        >
            <svg
                class="me-1"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                fill="none"
                viewBox="0 0 24 24"
            >
                <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 21a9 9 0 1 1 0-18c1.052 0 2.062.18 3 .512M7 9.577l3.923 3.923 8.5-8.5M17 14v6m-3-3h6"
                />
            </svg>
            <span>Confirm</span>
        </button>
    </div>
</div>
