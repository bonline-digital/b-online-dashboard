<script lang="ts">
    import { afterNavigate, goto } from "$app/navigation";
    import { navigating, page } from "$app/stores";
    import FractionHolder from "$lib/components/fraction-holder.svelte";
    import PlatformIcon from "$lib/components/platform-icon.svelte";
    import Spline from "$lib/components/decorations/spline.svelte";
    import Tabs from "$lib/components/tabs.svelte";
    import Upload from "$lib/components/upload-data/upload.svelte";
    import Waves from "$lib/components/decorations/waves.svelte";
    import { make_date_str } from "$lib/helpers";
    import {
        admin_store,
        rendered_rows_store,
        rows_store,
        total_values_store,
        total_values_tweened,
    } from "$lib/stores";
    import { cubicInOut } from "svelte/easing";
    import { fade, slide } from "svelte/transition";
    import Bubbles from "$lib/components/decorations/bubbles.svelte";
    import AddUser from "$lib/components/add-user.svelte";

    let title_height: number;
    let filter_visible: boolean = false;
    let filter_from_value: string | null;
    let filter_to_value: string | null;
    let uploading = false;
    let upload_state: number;
    let row_table_elem: HTMLTableElement;
    let table_holder_elem: HTMLDivElement;

    $: setup_filter($page.url.searchParams);

    function setup_filter(searchParams: URLSearchParams): void {
        const from = searchParams.get("from");
        const to = searchParams.get("to");

        if (from) {
            const date = new Date(
                parseInt(from) + new Date().getTimezoneOffset() * 60 * 1000,
            );
            filter_from_value = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;
        }

        if (to) {
            const date = new Date(
                parseInt(to) + new Date().getTimezoneOffset() * 60 * 1000,
            );
            filter_to_value = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;
        }
    }

    function toggle_filter(): void {
        if (filter_visible) {
            filter_visible = false;
        } else {
            filter_visible = true;
        }
    }

    function upload(): void {
        uploading = true;
    }

    function clear_filter(): void {
        filter_from_value = null;
        filter_to_value = null;
    }

    function apply_filter(): void {
        let from_query = "";
        let to_query = "";

        if (filter_from_value) {
            from_query = `from=${new Date(filter_from_value).getTime()}`;
        }

        if (filter_to_value) {
            to_query = `to=${new Date(filter_to_value).getTime()}`;
        }

        let query: string = "";

        if (from_query.length > 0) {
            query = `?${from_query}`;

            if (to_query.length > 0) {
                query += `&${to_query}`;
            }
        } else if (to_query.length > 0) {
            query = `?${to_query}`;
        }

        goto(`${$page.url.pathname}${query}`);

        filter_visible = false;
    }

    function on_scroll(event: Event): void {
        if (row_table_elem) {
            const element = event.target as HTMLDivElement;

            if (
                element.scrollTop + element.clientHeight >=
                row_table_elem.scrollHeight
            ) {
                if ($rendered_rows_store.length < $rows_store.length) {
                    const length = $rendered_rows_store.length;
                    $rendered_rows_store = $rendered_rows_store.concat(
                        $rows_store.slice(length, length + 100),
                    );
                }
            }
        }
    }

    afterNavigate((): void => {
        if (table_holder_elem) {
            table_holder_elem.scrollTo(0, 0);
        }
    });
</script>

<Tabs {uploading} />
<div
    class="h-100 card card-body shadow border-0 overflow-hidden position-relative"
>
    {#if uploading}
        {#if upload_state === 0}
            <Spline />
        {/if}
        <div
            class="h-100 d-flex justify-content-center align-items-center"
            in:fade={{ duration: 250, easing: cubicInOut }}
            style="z-index: 1;"
        >
            <Upload bind:uploading bind:upload_state />
        </div>
    {:else}
        <div
            class="h-100 d-flex flex-column"
            in:fade={{ duration: 250, easing: cubicInOut }}
        >
            <div class="mb-1">
                <div
                    class="d-flex justify-content-between align-items-center"
                    style="height: {`${title_height}px`};"
                >
                    <p
                        bind:clientHeight={title_height}
                        class="fs-1 gray-800 mb-1"
                    >
                        <slot></slot>
                    </p>
                    <div>
                        {#if filter_visible}
                            <div
                                class="card card-body border-0 shadow position-absolute z-1"
                                style="width: 20rem; translate: -100%"
                                transition:slide={{
                                    duration: 250,
                                    axis: "y",
                                    easing: cubicInOut,
                                }}
                            >
                                <form
                                    on:submit={apply_filter}
                                    action="javascript:"
                                >
                                    <div class="mb-3">
                                        <label
                                            for="date-from"
                                            class="form-label gray-800"
                                            >From</label
                                        >
                                        <input
                                            bind:value={filter_from_value}
                                            type="date"
                                            class="form-control gray-800"
                                            id="date-from"
                                        />
                                    </div>
                                    <div class="mb-3">
                                        <label
                                            for="date-to"
                                            class="form-label gray-800"
                                            >To</label
                                        >
                                        <input
                                            bind:value={filter_to_value}
                                            type="date"
                                            class="form-control gray-800"
                                            id="date-to"
                                        />
                                    </div>
                                    <div class="d-flex justify-content-end">
                                        <button
                                            on:click={clear_filter}
                                            class="btn btn-link link-underline link-underline-opacity-0 me-2"
                                            type="button"
                                        >
                                            Clear
                                        </button>
                                        <button
                                            class="btn btn-primary"
                                            type="submit"
                                        >
                                            Apply
                                        </button>
                                    </div>
                                </form>
                            </div>
                        {/if}
                        <button
                            on:click={toggle_filter}
                            class="btn btn-link link-underline link-underline-opacity-0 d-flex align-items-center"
                        >
                            <svg
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                width="32"
                                height="32"
                                fill="none"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    stroke="currentColor"
                                    stroke-linecap="round"
                                    stroke-width="1.5"
                                    d="M18.796 4H5.204a1 1 0 0 0-.753 1.659l5.302 6.058a1 1 0 0 1 .247.659v4.874a.5.5 0 0 0 .2.4l3 2.25a.5.5 0 0 0 .8-.4v-7.124a1 1 0 0 1 .247-.659l5.302-6.059c.566-.646.106-1.658-.753-1.658Z"
                                />
                            </svg>
                        </button>
                    </div>
                </div>
                <div class="d-flex flex-wrap">
                    <div
                        class="info flex-grow-1 overflow-hidden rounded position-relative p-4 me-2 mb-2"
                    >
                        <Bubbles />
                        <div class="d-flex overflow-x-auto" style="z-index: 1;">
                            <div class="me-5">
                                <p class="fs-6 m-0">Impressions</p>
                                <p class="fs-3 m-0">
                                    {$total_values_tweened.impressions.toFixed(
                                        0,
                                    )}
                                </p>
                            </div>
                            <div>
                                <p class="fs-6 m-0">eCPM</p>
                                <p class="fs-3 m-0">
                                    {$total_values_tweened.avg_cpm.toFixed(2)}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div
                        class="info flex-grow-1 overflow-hidden rounded position-relative p-4 me-2 mb-2"
                    >
                        <Waves />
                        <div class="d-flex overflow-x-auto" style="z-index: 1;">
                            <div class="me-5">
                                <p class="fs-6 m-0">Clicks</p>
                                <p class="fs-3 m-0">
                                    {$total_values_tweened.clicks.toFixed(0)}
                                </p>
                            </div>
                            <div class="me-3">
                                <p class="fs-6 m-0">eCPC</p>
                                <p class="fs-3 m-0">
                                    {$total_values_tweened.avg_cpc.toFixed(2)}
                                </p>
                            </div>
                            <div>
                                <p class="fs-6 m-0">eCTR</p>
                                <p class="fs-3 m-0">
                                    {$total_values_tweened.avg_ctr.toFixed(2)}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {#if $navigating === null}
                <div
                    on:scroll={on_scroll}
                    bind:this={table_holder_elem}
                    class="flex-grow-1 overflow-auto"
                    in:fade={{ duration: 250, easing: cubicInOut }}
                >
                    {#if $rendered_rows_store.length > 0}
                        <table
                            bind:this={row_table_elem}
                            class="table table-hover m-0"
                            in:fade={{ duration: 250, easing: cubicInOut }}
                        >
                            <thead class="position-sticky top-0">
                                <tr>
                                    <th scope="col">
                                        <span class="gray-800">#</span>
                                    </th>
                                    <th scope="col">
                                        <span class="gray-800">Campaign</span>
                                    </th>
                                    {#if $page.data.page_id === 0}
                                        <th scope="col">
                                            <span class="gray-800">
                                                Platform
                                            </span>
                                        </th>
                                    {/if}
                                    <th scope="col">
                                        <span class="gray-800">
                                            Impressions
                                        </span>
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
                                {#each $rendered_rows_store as item}
                                    <tr>
                                        <th scope="row">
                                            <span class="gray-800">
                                                {item.id + 1}
                                            </span>
                                        </th>
                                        <td class="campaign-name">
                                            <span class="gray-800">
                                                {item.campaign.trim().length ===
                                                0
                                                    ? "<untitled>"
                                                    : item.campaign}
                                            </span>
                                        </td>
                                        {#if $page.data.page_id === 0}
                                            <td>
                                                <div
                                                    class="d-flex align-items-center"
                                                >
                                                    <PlatformIcon
                                                        id={item.platform}
                                                    />
                                                </div>
                                            </td>
                                        {/if}
                                        <td>
                                            <FractionHolder
                                                value={item.impressions ?? 0}
                                                total={$total_values_store.impressions}
                                            >
                                                <span class="gray-800">
                                                    {item.impressions ?? 0}
                                                </span>
                                            </FractionHolder>
                                        </td>
                                        <td>
                                            <FractionHolder
                                                value={item.reach ?? 0}
                                                total={$total_values_store.reach}
                                            >
                                                <span class="gray-800">
                                                    {(item.reach ?? 0).toFixed(
                                                        2,
                                                    )}
                                                </span>
                                            </FractionHolder>
                                        </td>
                                        <td>
                                            <FractionHolder
                                                value={item.clicks ?? 0}
                                                total={$total_values_store.clicks}
                                            >
                                                <span class="gray-800">
                                                    {item.clicks ?? 0}
                                                </span>
                                            </FractionHolder>
                                        </td>
                                        <td>
                                            <FractionHolder
                                                value={item.views ?? 0}
                                                total={$total_values_store.views}
                                            >
                                                <span class="gray-800">
                                                    {item.views ?? 0}
                                                </span>
                                            </FractionHolder>
                                        </td>
                                        <td>
                                            <span class="gray-800">
                                                {(item.ctr ?? 0).toFixed(2)}
                                            </span>
                                        </td>
                                        <td>
                                            <span class="gray-800">
                                                {(item.cpm ?? 0).toFixed(2)}
                                            </span>
                                        </td>
                                        <td>
                                            <span class="gray-800">
                                                {(item.cpc ?? 0).toFixed(2)}
                                            </span>
                                        </td>
                                        <td>
                                            <span class="gray-800">
                                                {(item.cpv ?? 0).toFixed(2)}
                                            </span>
                                        </td>
                                        <td>
                                            <FractionHolder
                                                value={item.spent ?? 0}
                                                total={$total_values_store.total_spent}
                                            >
                                                <span class="gray-800">
                                                    {item.spent ?? 0}
                                                </span>
                                            </FractionHolder>
                                        </td>
                                        <td>
                                            <span class="gray-800">
                                                {make_date_str(
                                                    new Date(
                                                        item.date +
                                                            new Date().getTimezoneOffset() *
                                                                60 *
                                                                1000,
                                                    ),
                                                )}
                                            </span>
                                        </td>
                                    </tr>
                                {/each}
                                {#if $rendered_rows_store.length === $rows_store.length}
                                    <tr>
                                        <th scope="row"></th>
                                        <th class="campaign-name">
                                            <span class="gray-800"
                                                >Total/Avg</span
                                            >
                                        </th>
                                        {#if $page.data.page_id === 0}
                                            <th></th>
                                        {/if}
                                        <th>
                                            <span class="gray-800">
                                                {$total_values_store.impressions}
                                            </span>
                                        </th>
                                        <th>
                                            <span class="gray-800">
                                                {$total_values_store.reach.toFixed(
                                                    2,
                                                )}
                                            </span>
                                        </th>
                                        <th>
                                            <span class="gray-800">
                                                {$total_values_store.clicks}
                                            </span>
                                        </th>
                                        <th>
                                            <span class="gray-800">
                                                {$total_values_store.views}
                                            </span>
                                        </th>
                                        <th>
                                            <span class="gray-800">
                                                {$total_values_store.avg_ctr.toFixed(
                                                    2,
                                                )}
                                            </span>
                                        </th>
                                        <th>
                                            <span class="gray-800">
                                                {$total_values_store.avg_cpm.toFixed(
                                                    2,
                                                )}
                                            </span>
                                        </th>
                                        <th>
                                            <span class="gray-800">
                                                {$total_values_store.avg_cpc.toFixed(
                                                    2,
                                                )}
                                            </span>
                                        </th>
                                        <th>
                                            <span class="gray-800">
                                                {$total_values_store.avg_cpv.toFixed(
                                                    2,
                                                )}
                                            </span>
                                        </th>
                                        <th>
                                            <span class="gray-800">
                                                {$total_values_store.total_spent}
                                            </span>
                                        </th>
                                        <th></th>
                                    </tr>
                                {/if}
                            </tbody>
                        </table>
                    {:else}
                        <div
                            class="text-secondary text-center p-4"
                            in:fade={{ duration: 250, easing: cubicInOut }}
                        >
                            {"No data to show >_<"}
                        </div>
                    {/if}
                </div>
            {:else}
                <div
                    on:scroll={on_scroll}
                    bind:this={table_holder_elem}
                    class="flex-grow-1 overflow-auto"
                    in:fade={{ duration: 250, easing: cubicInOut }}
                >
                    <div class="text-secondary text-center p-4">Loading...</div>
                </div>
            {/if}
            {#if $admin_store}
                <div class="d-flex justify-content-end mt-2">
                    <button
                        class="btn btn-outline-primary d-flex align-items-center p-2 me-2"
                        data-bs-toggle="modal"
                        data-bs-target="#add-user-modal"
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
                                d="M16 12h4m-2 2v-4M4 18v-1a3 3 0 0 1 3-3h4a3 3 0 0 1 3 3v1a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1Zm8-10a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                            />
                        </svg>
                        <span>Add User</span>
                    </button>
                    <button
                        on:click={upload}
                        class="btn btn-primary d-flex align-items-center p-2"
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
                                d="M12 7.757v8.486M7.757 12h8.486M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                            />
                        </svg>
                        <span>Add Data</span>
                    </button>
                </div>
            {/if}
        </div>
    {/if}
</div>

<AddUser />

<style lang="scss">
    @import "../../lib/colors.scss";

    .info {
        color: $primary;
        background-color: rgba($primary, 0.1);
    }
</style>
