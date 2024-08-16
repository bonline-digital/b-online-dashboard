<script lang="ts">
    import { onMount } from "svelte";
    import SigninFeedback from "./signin-feedback.svelte";
    import SigninInput from "./signin-input.svelte";
    import { tweened } from "svelte/motion";
    import { cubicInOut } from "svelte/easing";
    import { fade } from "svelte/transition";

    let mounted = false;
    let state = 0;
    let card_child_elem: HTMLDivElement;
    const height = tweened(0, {
        duration: 250,
        easing: cubicInOut,
    });

    function onmounted(): void {
        height.set(card_child_elem.clientHeight);
    }

    onMount((): void => {
        mounted = true;
    });
</script>

<div class="h-100 w-100 d-flex align-items-center justify-content-center p-2">
    <div class="signin-card card card-body shadow border-0">
        <div style="height: {$height}px">
            <div bind:this={card_child_elem}>
                {#if state < 2}
                    {#if mounted}
                        <div in:fade={{ delay: 150, duration: 250 }}>
                            <SigninInput bind:state {onmounted} />
                        </div>
                    {/if}
                {:else}
                    <div in:fade={{ duration: 250 }}>
                        <SigninFeedback {onmounted} />
                    </div>
                {/if}
            </div>
        </div>
    </div>
</div>

<style lang="scss">
    .signin-card {
        max-width: 30rem;
        transition: height 250ms ease-in-out;
    }
</style>
