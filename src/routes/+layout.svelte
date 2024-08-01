<script lang="ts">
  import { activeRemotes } from "$lib/stores/ActiveRemotes";
  import "../app.css";
  import { emit, listen } from "@tauri-apps/api/event";
  import { invoke } from "@tauri-apps/api/tauri";
  import { onDestroy, onMount } from "svelte";
  import { appWindow } from "@tauri-apps/api/window";
  import { dev } from "$app/environment";

  let unlisten: Function;

  type RemoteEvent = {
    payload: RemoteAction;
  };

  type RemoteAction = {
    event: String;
    action: String;
    modifier: String | null;
  };

  onMount(async () => {
    if (!dev) appWindow.setFullscreen(true);

    unlisten = await listen("action", (event: RemoteEvent) => {
      handleAction(event.payload);
    });

    setInterval(() => {
      $activeRemotes = $activeRemotes.filter(
        (device) => Date.now() - device.lastHeartbeat < 10000
      );
    }, 1000);
  });

  async function handleAction(event: RemoteAction) {
    const action: RemoteAction = event;

    if (action.event === "HEARTBEAT") {
      if (action.action === "PING") {
        if (action.modifier) {
          if (
            $activeRemotes.some((device) => device.device === action.modifier)
          ) {
            $activeRemotes = $activeRemotes.map((device) =>
              device.device === action.modifier
                ? { device: device.device, lastHeartbeat: Date.now() }
                : device
            );
          } else {
            $activeRemotes = [
              ...$activeRemotes,
              { device: action.modifier, lastHeartbeat: Date.now() },
            ];
          }
        }
      }
    }

    if (action.event === "NAVIGATE") {
      if (action.action === "FULLSCREEN") {
        console.log("Toggled fullscreen");
        await appWindow.setFullscreen(await !appWindow.isFullscreen());
      }
    }
  }

  onDestroy(() => {
    unlisten();
  });
</script>

<slot></slot>

<div class="absolute top-0 right-0 flex-col">
  {#each $activeRemotes as device}
    <div class="p-2 bg-gray-800 text-white">
      {JSON.stringify(device)}
    </div>
  {/each}
  <p>Active Connections: {$activeRemotes.length}</p>
</div>
