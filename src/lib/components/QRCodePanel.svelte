<script lang="ts">
  import { activeRemotes } from "$lib/stores/ActiveRemotes";
  import QRCode from "qrcode";
  import { onMount } from "svelte";

  export let text = "";

  const generateQR = async (text: String) => {
    try {
      return await QRCode.toDataURL(text);
    } catch (err) {
      console.error(err);
    }
  };
</script>

{#await generateQR(text) then data}
  <div class="flex flex-col w-64 h-64 items-center gap-0 bg-white p-4 aspect-square justify-center" class:hidden={$activeRemotes.length > 0}>
    <p class="p-0 m-0 text-black font-bold">Connect To Pi-TV</p>
    <img src={data} alt="" class="m-0" />
    <p class="p-0 m-0 text-black font-bold text-sm">{text}</p>
  </div>
{/await}
