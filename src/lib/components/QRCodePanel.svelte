<script lang="ts">
  import { activeRemotes, lastQrViewTime } from "$lib/stores/ActiveRemotes";
  import QRCode from "qrcode";
  import { onMount } from "svelte";

  export let text = "";

  let currentTime = Date.now();

  onMount(() => {
    setInterval(() => {
      currentTime = Date.now();
    }, 5);
  });

  const generateQR = async (text: String) => {
    try {
      return await QRCode.toDataURL(text);
    } catch (err) {
      console.error(err);
    }
  };
</script>

{#await generateQR(text) then data}
  <div
    class="flex flex-col w-96 h-96 items-center gap-0 bg-white p-4 aspect-square justify-center relative transition-opacity">
    <p class="p-0 m-0 text-black font-bold text-2xl">Connect To Pi-TV</p>
    <img src={data} alt="" class="m-0 w-64 h-64" />
    <p class="p-0 m-0 text-black font-bold text-2xl">{text}</p>
    {#if $activeRemotes.length > 0}
      <progress
        value={($lastQrViewTime - (currentTime - 10000)) / 10000}
        max={1}
        class="w-64 progress progress-primary absolute bottom-2"></progress>
    {/if}
  </div>
{/await}

{#if $activeRemotes.length < 1}
  <p class="absolute top-4 font-bold text-2xl">No Remotes Connected</p>
  <div class="absolute bottom-4 font-bold">
    <span class="loading loading-dots loading-lg"></span>
  </div>
{/if}
