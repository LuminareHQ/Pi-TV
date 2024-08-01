<script lang="ts">
  import { homeTilesArray, homeTileSelection } from "$lib/stores/HomeTile";
  import { invoke } from "@tauri-apps/api/tauri";

  import HomeTile from "$lib/components/HomeTile.svelte";
</script>

<div class="flex flex-col w-full h-full overflow-x-visible realtive">
  <div class="absolute top-0 left-0 right-0 h-16 p-4 pb-0">
    <div class="flex flex-row w-full h-full justify-between items-end">
      <div class="prose">
        <h1>Pi-TV</h1>
      </div>
      <p>{JSON.stringify($homeTileSelection)}</p>
      {#await invoke("get_network_ip") then ip}
        <p>Remote Address: http://{ip}</p>
      {/await}
    </div>
  </div>
  <hr class="absolute top-16 left-4 right-4" />
  <div
    class="absolute top-16 left-0 right-0 bottom-0 overflow-x-visible overflow-y-auto p-2"
  >
    {#each $homeTilesArray as row, x}
      <div class="flex flex-row overflow-x-auto">
        {#each row as tile, y}
          <HomeTile {x} {y} {tile} />
        {/each}
      </div>
    {/each}
  </div>
</div>
