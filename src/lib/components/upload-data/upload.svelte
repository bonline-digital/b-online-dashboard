<script lang="ts">
    import UploadInput from "./upload-input.svelte";
    import UploadVerify from "./upload-verify.svelte";
    import type { RowData } from "$lib/helpers";

    export let uploading: boolean;
    export let upload_state = 0;
    let data = new Array<RowData>();
</script>

{#if upload_state === 0}
    <UploadInput bind:uploading bind:upload_state bind:data />
{:else}
    <UploadVerify bind:uploading bind:upload_state bind:data />
{/if}
