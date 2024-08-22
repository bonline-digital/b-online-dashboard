<script lang="ts">
    import "$lib/styles.scss";
    import {
        logged_in_store,
        passwordnotmatch_toast_store,
        upload_success_toast_store,
        usernotfound_toast_store,
    } from "$lib/stores";
    import { Toast } from "bootstrap";
    import { onMount } from "svelte";
    import Signin from "$lib/components/signin/signin.svelte";
    import { navigating, page } from "$app/stores";
    import { fade } from "svelte/transition";
    import { cubicInOut } from "svelte/easing";
    import EditPwd from "$lib/components/edit-pwd.svelte";

    let upload_success_elem: HTMLDivElement;
    let usernotfound_toast_elem: HTMLDivElement;
    let passwordnotmatch_toast_elem: HTMLDivElement;

    function logout(): void {
        fetch("/api/logout").then((): void => {
            location.href = $page.url.pathname;
        });
    }

    onMount((): void => {
        $upload_success_toast_store = new Toast(upload_success_elem);
        $usernotfound_toast_store = new Toast(usernotfound_toast_elem);
        $passwordnotmatch_toast_store = new Toast(passwordnotmatch_toast_elem);
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
                <div class="dropdown">
                    <button
                        class="btn btn-link dropdown-toggle"
                        type="button"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                    >
                        <svg
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                fill-rule="evenodd"
                                d="M12 20a7.966 7.966 0 0 1-5.002-1.756l.002.001v-.683c0-1.794 1.492-3.25 3.333-3.25h3.334c1.84 0 3.333 1.456 3.333 3.25v.683A7.966 7.966 0 0 1 12 20ZM2 12C2 6.477 6.477 2 12 2s10 4.477 10 10c0 5.5-4.44 9.963-9.932 10h-.138C6.438 21.962 2 17.5 2 12Zm10-5c-1.84 0-3.333 1.455-3.333 3.25S10.159 13.5 12 13.5c1.84 0 3.333-1.455 3.333-3.25S13.841 7 12 7Z"
                                clip-rule="evenodd"
                            />
                        </svg>
                    </button>
                    <ul class="dropdown-menu dropdown-menu-end">
                        <li>
                            <p class="fs-4 mx-3 mb-1">Siam</p>
                        </li>
                        <li>
                            <button
                                class="dropdown-item"
                                data-bs-toggle="modal"
                                data-bs-target="#edit-pwd-modal"
                            >
                                Change Password
                            </button>
                        </li>
                        <li>
                            <button on:click={logout} class="dropdown-item">
                                <span>Logout</span>
                            </button>
                        </li>
                    </ul>
                </div>
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

<EditPwd />

<div class="toast-container position-fixed bottom-0 end-0 p-3">
    <div
        bind:this={usernotfound_toast_elem}
        class="toast align-items-center text-bg-danger border-0"
        role="alert"
        aria-live="assertive"
        aria-atomic="true"
    >
        <div class="d-flex">
            <div class="toast-body">User not found</div>
            <button
                type="button"
                class="btn-close btn-close-white me-2 m-auto"
                data-bs-dismiss="toast"
                aria-label="Close"
            ></button>
        </div>
    </div>
    <div
        bind:this={passwordnotmatch_toast_elem}
        class="toast align-items-center text-bg-danger border-0"
        role="alert"
        aria-live="assertive"
        aria-atomic="true"
    >
        <div class="d-flex">
            <div class="toast-body">Password does not match</div>
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
