<script>
  import { invoke } from "@tauri-apps/api/tauri";
  import { page } from "$app/stores";
  import QRCodePanel from "$lib/components/QRCodePanel.svelte";
</script>

<div class="flex w-full h-full items-center justify-center">
  {#await invoke("get_network_ip") then ip}
    <QRCodePanel text={`http://${ip}`} />
  {/await}
</div>
