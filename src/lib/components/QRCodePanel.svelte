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

{#if $activeRemotes.length < 1}
  <p class="absolute top-4 font-bold">No Remotes Connected</p>
{/if}

{#await generateQR(text) then data}
  <div
    class="flex flex-col w-64 h-64 items-center gap-0 bg-white p-4 aspect-square justify-center relative transition-opacity"
  >
    <p class="p-0 m-0 text-black font-bold">Connect To Pi-TV</p>
    <img src={data} alt="" class="m-0" />
    <p class="p-0 m-0 text-black font-bold text-sm">{text}</p>
    {#if $activeRemotes.length > 0}
      <progress
        value={($lastQrViewTime - (currentTime - 10000)) / 10000}
        max={1}
        class="w-48 progress progress-primary absolute bottom-2"
      ></progress>
    {/if}
  </div>
{/await}

{#if $activeRemotes.length < 1}
  <div class="absolute bottom-4 font-bold">
    <span class="loading loading-dots loading-md"></span>
  </div>
{/if}
