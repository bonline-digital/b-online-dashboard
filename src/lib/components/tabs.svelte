<script lang="ts">
    import { goto } from "$app/navigation";
    import { page } from "$app/stores";
    import { platforms } from "$lib/stores";
    import { cubicInOut } from "svelte/easing";
    import { fade, slide } from "svelte/transition";

    export let uploading: boolean;
    let page_id = 0;
    let platform_id = -1;
    let campaigns_on = false;

    $: {
        page_id = parseInt($page.data.page_id);

        if (page_id === 0) {
            campaigns_on = false;
            platform_id = -1;
        } else if (page_id === 1) {
            campaigns_on = true;
            platform_id = parseInt($page.data.platform_id);
        }
    }

    function toggle_campaigns(): void {
        if (page_id === 0) {
            campaigns_on = !campaigns_on;
        }
    }

    function goto_overview(): void {
        campaigns_on = false;

        goto("/overview");
    }
</script>

{#if !uploading}
    <div transition:slide={{ duration: 250, axis: "x", easing: cubicInOut }}>
        <ul class="link-tabs nav nav-pills flex-column ps-3 pe-3 pt-3 pb-1">
            <li class="nav-item">
                <button
                    on:click={goto_overview}
                    class="btn btn-tab border-0 {page_id === 0
                        ? 'active'
                        : ''} text-start w-100 fs-4"
                    aria-current="page"
                    data-bs-toggle="pill"
                >
                    <svg
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        fill="none"
                        viewBox="0 0 24 24"
                    >
                        <path
                            stroke="currentColor"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M4 4v15a1 1 0 0 0 1 1h15M8 16l2.5-5.5 3 3L17.273 7 20 9.667"
                        />
                    </svg>
                    Overview
                </button>
            </li>
            <li class="nav-item mt-1">
                <button
                    on:click={toggle_campaigns}
                    class="btn btn-tab border-0 {page_id === 1
                        ? 'active'
                        : ''} w-100 text-start fs-4 d-flex justify-content-between align-items-center"
                >
                    <span>
                        <svg
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            fill="none"
                            viewBox="0 0 24 24"
                        >
                            <path
                                stroke="currentColor"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M4 5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5Zm16 14a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1v-2a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2ZM4 13a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-6Zm16-2a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v6Z"
                            />
                        </svg>
                        Campaigns
                    </span>
                    {#if campaigns_on}
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            height="16"
                            fill="currentColor"
                            class="bi bi-caret-up-fill"
                            viewBox="0 0 16 16"
                            in:fade={{ duration: 250, easing: cubicInOut }}
                        >
                            <path
                                d="m7.247 4.86-4.796 5.481c-.566.647-.106 1.659.753 1.659h9.592a1 1 0 0 0 .753-1.659l-4.796-5.48a1 1 0 0 0-1.506 0z"
                            />
                        </svg>
                    {:else}
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            fill="currentColor"
                            class="bi bi-caret-down-fill"
                            viewBox="0 0 16 16"
                            in:fade={{ duration: 250, easing: cubicInOut }}
                        >
                            <path
                                d="M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z"
                            />
                        </svg>
                    {/if}
                </button>
            </li>
        </ul>
        {#if campaigns_on}
            <div
                transition:slide={{
                    duration: 250,
                    axis: "y",
                    easing: cubicInOut,
                }}
            >
                <ul class="link-tabs nav nav-pills flex-column ps-5 pe-3 pb-3">
                    {#each $platforms as platform, index}
                        <li class="nav-item mt-1">
                            <button
                                on:click={() => {
                                    goto(`/platforms/${index}`);
                                }}
                                class="btn btn-tab border-0 {platform_id ===
                                index
                                    ? 'active'
                                    : ''} fs-6 text-start w-100"
                                aria-current="page"
                                data-bs-toggle="pill"
                            >
                                {platform}
                            </button>
                        </li>
                    {/each}
                </ul>
            </div>
        {/if}
    </div>
{/if}

<style lang="scss">
    @import "../colors.scss";

    .link-tabs {
        width: 20rem;
    }
    .btn-tab {
        color: $primary;
    }
    .btn-tab:hover {
        background-color: $primary-transparent;
        color: $primary;
    }
    .btn-tab:active {
        background-color: $primary-transparent;
        color: $primary;
    }
    .btn-tab.active {
        background-color: $primary;
        color: $root-background-color;
    }
</style>
