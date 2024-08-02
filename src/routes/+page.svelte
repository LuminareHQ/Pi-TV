<script lang="ts">
  import {
    homeTilesArray,
    homeTileSelection,
    type Position,
  } from "$lib/stores/HomeTile";
  import { invoke } from "@tauri-apps/api/tauri";

  import HomeTile from "$lib/components/HomeTile.svelte";

  let prevSelection: Position;

</script>

<div class="flex flex-col w-full h-full realtive">
  <div class="absolute top-0 left-0 right-0 h-16 p-4 pb-0 z-50">
    <div class="flex flex-row w-full h-full justify-between items-end">
      <div class="prose">
        <h1>Pi-TV</h1>
      </div>
      {#await invoke("get_network_ip") then ip}
        <p>Remote Address: http://{ip}</p>
      {/await}
    </div>
  </div>
  <hr class="absolute top-16 left-0 right-0 z-10 h-1" />
  <div class="absolute top-16 left-0 right-0 bottom-0 overflow-hidden">
    {#each $homeTilesArray as row, x}
      <div class="flex flex-row overflow-x-hidden">
        {#each row as tile, y}
          <HomeTile {x} {y} {tile} />
        {/each}
      </div>
    {/each}
  </div>
</div>
