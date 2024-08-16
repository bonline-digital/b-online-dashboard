<script lang="ts">
    import { page } from "$app/stores";
    import { onMount } from "svelte";
    import { cubicInOut } from "svelte/easing";
    import { fade, fly } from "svelte/transition";

    export let state: number;
    export let onmounted: () => void;
    let username: string;
    let password: string;

    function sigin_next(): void {
        if (state === 1) {
            fetch("/api/login", {
                method: "post",
                body: JSON.stringify({
                    username: username,
                    password: password,
                }),
            }).then((response: Response): void => {
                if (response.status === 200) {
                    response.json().then((value: any): void => {
                        const success = parseInt(value.success);

                        if (success === 0) {
                            location.href = $page.url.pathname;
                        } else if (success === 1) {
                        } else if (success === 2) {
                        }
                    });
                }
            });
        }

        ++state;
    }

    function signin_back(): void {
        --state;
    }

    onMount((): void => {
        onmounted();
    });
</script>

<p class="fs-1 gray-800">Sign In</p>
<form on:submit={sigin_next} action="javascript:">
    <div class="form-input-holder d-flex overflow-x-hidden p-1 mb-2">
        {#if state === 0}
            <div
                class="form-floating w-100"
                in:fly={{
                    duration: 250,
                    x: "-100%",
                    easing: cubicInOut,
                }}
            >
                <input
                    bind:value={username}
                    type="text"
                    class="form-control gray-800"
                    id="username-input"
                    placeholder="Username"
                    required
                />
                <label for="username-input">Username</label>
            </div>
        {:else}
            <div
                class="form-floating w-100"
                in:fly={{
                    duration: 250,
                    x: "100%",
                    easing: cubicInOut,
                }}
            >
                <input
                    bind:value={password}
                    type="password"
                    class="form-control gray-800"
                    id="password-input"
                    placeholder="Password"
                    required
                />
                <label for="password-input">Password</label>
            </div>
        {/if}
    </div>
    <div class="d-flex justify-content-end mt-2">
        {#if state === 1}
            <button
                on:click={signin_back}
                type="button"
                class="btn btn-link link-underline link-underline-opacity-0 me-2"
                transition:fade={{
                    duration: 250,
                    easing: cubicInOut,
                }}>Back</button
            >
        {/if}
        <button type="submit" class="btn btn-primary">Next</button>
    </div>
</form>
