<script lang="ts">
    import { page } from "$app/stores";
    import { logged_in_store } from "$lib/stores";
    import { onMount } from "svelte";

    onMount((): void => {
        if ($page.status === 403) {
            $logged_in_store = false;
        }
    });
</script>
