<script lang="ts">
    import { page } from "$app/stores";
    import { load_page_ui } from "$lib/helpers";
    import { platforms } from "$lib/stores";
    import { onMount } from "svelte";
    import { cubicInOut } from "svelte/easing";
    import { fade } from "svelte/transition";

    let reloader = {};

    $: {
        load_page_ui($page.data);

        reloader = {};
    }

    onMount((): void => {
        reloader = {};
    });
</script>

{#key reloader}
    <span in:fade={{ duration: 250, easing: cubicInOut }}>
        {`${$platforms[parseInt($page.params.id)]} Campaigns`}
    </span>
{/key}
