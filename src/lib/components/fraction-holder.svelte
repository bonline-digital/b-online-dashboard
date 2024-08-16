<script lang="ts">
    import { cubicInOut } from "svelte/easing";
    import { tweened } from "svelte/motion";

    export let value: number;
    export let total: number;
    let pct = total !== 0 ? (value * 100) / total : 0.0;
    const pct_tweened = tweened(0, {
        duration: 500,
        easing: cubicInOut,
    });
    let mouse_in = false;
    let mouse_x: number;
    let mouse_y: number;
    let slot_holder_elem: HTMLDivElement;

    function on_mouse_enter(event: MouseEvent): void {
        mouse_in = true;
        mouse_x = event.clientX;
        mouse_y = event.clientY;
        $pct_tweened = pct;
    }

    function on_mouse_leave(): void {
        mouse_in = false;
        pct_tweened.set(0, {
            duration: 0,
        });
    }

    function on_mouse_move(event: MouseEvent): void {
        mouse_x = event.clientX;
        mouse_y = event.clientY;
    }
</script>

<div
    bind:this={slot_holder_elem}
    on:mouseenter={on_mouse_enter}
    on:mouseleave={on_mouse_leave}
    on:mousemove={on_mouse_move}
    role="button"
    tabindex="-1"
>
    <slot></slot>
</div>
{#if mouse_in}
    <div
        class="card card-body position-fixed d-flex flex-row align-items-center border-0 shadow z-1 m-4"
        style="left: {`${mouse_x}px`}; top: {`${mouse_y}px`}; translate: -50% 1rem;"
    >
        <div class="progress me-2" style="width: 15rem;">
            <div class="progress-bar" style="width: {$pct_tweened}%;"></div>
        </div>
        <p class="fs-6 m-0">{$pct_tweened.toFixed(2)}%</p>
    </div>
{/if}
