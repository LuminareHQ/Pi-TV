<script lang="ts">
  import { goto } from "$app/navigation";
  import { listen } from "@tauri-apps/api/event";
  import {
    homeTilesArray,
    homeTileSelection,
    type Position,
  } from "$lib/stores/HomeTile";
  import { invoke } from "@tauri-apps/api/tauri";
  import type { RemoteAction, RemoteEvent } from "$lib/types/Remote";
  import { ActionType } from "$lib/stores/HomeTile";
  import { lastQrViewTime } from "$lib/stores/ActiveRemotes";
  import HomeTile from "$lib/components/HomeTile.svelte";
  import { onDestroy, onMount } from "svelte";

  let prevSelection: Position;

  let unlisten: Function;

  onMount(async () => {
    unlisten = await listen("action", (event: RemoteEvent) => {
      handleAction(event.payload);
    });
  });

  onDestroy(() => {
    unlisten();
  });

  async function handleAction(event: RemoteAction) {
    const action: RemoteAction = event;
    if (action.event === "NAVIGATE") {
      if (action.action === "OK") {
        selectTile();
      }

      if (action.action === "QR") {
        if ($lastQrViewTime > Date.now() - 10000) {
          $lastQrViewTime = Date.now() - 10000;
        } else {
          $lastQrViewTime = Date.now();
        }
      }
      if (action.action === "UP") {
        $homeTileSelection.row = $homeTileSelection.row - 1;
      }
      if (action.action === "DOWN") {
        $homeTileSelection.row = $homeTileSelection.row + 1;
      }
      if (action.action === "LEFT") {
        $homeTileSelection.col = $homeTileSelection.col - 1;
      }
      if (action.action === "RIGHT") {
        $homeTileSelection.col = $homeTileSelection.col + 1;
      }
      // Constrains the selection to the bounds of both array and subarray
      if ($homeTileSelection.row < 0) {
        $homeTileSelection.row = 0;
      }
      if ($homeTileSelection.row > $homeTilesArray.length - 1) {
        $homeTileSelection.row = $homeTilesArray.length - 1;
      }
      if (
        $homeTileSelection.col >
        $homeTilesArray[$homeTileSelection.row].length - 1
      ) {
        $homeTileSelection.col =
          $homeTilesArray[$homeTileSelection.row].length - 1;
      }
      if ($homeTileSelection.col < 0) {
        $homeTileSelection.col = 0;
      }
    }
  }

  function selectTile() {
    let selectedTile =
      $homeTilesArray[$homeTileSelection.row][$homeTileSelection.col];

    switch (selectedTile.action) {
      case ActionType.OPEN_APP:
        break;
      case ActionType.OPEN_EXE:
        break;
      case ActionType.OPEN_URL:
        break;
      case ActionType.GOTO:
        goto("/youtube");
        break;
    }
  }
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
