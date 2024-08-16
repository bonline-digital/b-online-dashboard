<script lang="ts">
    import "$lib/styles.scss";
    import { logged_in_store, upload_success_toast_store } from "$lib/stores";
    import { Toast } from "bootstrap";
    import { onMount } from "svelte";
    import Signin from "$lib/components/signin/signin.svelte";
    import { navigating, page } from "$app/stores";
    import { fade } from "svelte/transition";
    import { cubicInOut } from "svelte/easing";

    let upload_success_elem: HTMLDivElement;

    function logout(): void {
        fetch("/api/logout").then((): void => {
            location.href = $page.url.pathname;
        });
    }

    onMount((): void => {
        $upload_success_toast_store = new Toast(upload_success_elem);
    });
</script>

<svelte:head>
    <title>BOnline Dashboard</title>
</svelte:head>

{#if $navigating}
    <div
        class="progress position-fixed start-0 end-0 top-0 z-1"
        style="height: 0.25rem;"
        transition:fade={{ duration: 250, easing: cubicInOut }}
    >
        <div class="progress-bar" style="width: 100%"></div>
    </div>
{/if}

<nav class="app-navbar navbar navbar-expand-lg bg-body-tertiary">
    <div class="container-fluid">
        <a
            class="navbar-brand d-flex align-items-center gray-800"
            href="/overview"
        >
            <img src="favicon.webp" alt="logo" style="height: 2rem;" />
            <span>BOnline Dashboard</span>
        </a>
        <button
            class="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbar-support-content"
            aria-controls="navbar-support-content"
            aria-expanded="false"
        >
            <span class="navbar-toggler-icon"></span>
        </button>
        <div
            class="collapse navbar-collapse justify-content-end"
            id="navbar-support-content"
        >
            {#if $logged_in_store}
                <button on:click={logout} class="btn btn-primary">
                    <span>Logout</span>
                </button>
            {/if}
        </div>
    </div>
</nav>
<div class="app-content p-4 d-flex">
    {#if $logged_in_store}
        <slot></slot>
    {:else}
        <Signin />
    {/if}
</div>
<div class="toast-container position-fixed bottom-0 end-0 p-3">
    <div
        bind:this={upload_success_elem}
        class="toast align-items-center text-bg-success border-0"
        role="alert"
        aria-live="assertive"
        aria-atomic="true"
    >
        <div class="d-flex">
            <div class="toast-body">Data upload successful</div>
            <button
                type="button"
                class="btn-close btn-close-white me-2 m-auto"
                data-bs-dismiss="toast"
                aria-label="Close"
            ></button>
        </div>
    </div>
</div>

<style lang="scss">
    $navbar-height: 3.5rem;

    .app-navbar {
        position: absolute;
        top: 0;
        height: $navbar-height;
        left: 0;
        right: 0;
    }
    .app-content {
        position: absolute;
        top: $navbar-height;
        bottom: 0;
        left: 0;
        right: 0;
    }
</style>
