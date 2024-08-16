<script lang="ts">
    import { onMount } from "svelte";

    export let onmounted: () => void;

    onMount((): void => {
        onmounted();
    });
</script>

<div class="d-flex justify-content-between align-items-center">
    <p class="fs-3 m-0">Signing In...</p>
    <div class="spinner-border text-primary"></div>
</div>
