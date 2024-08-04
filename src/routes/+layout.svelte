<script lang="ts">
  import { activeRemotes, lastQrViewTime } from "$lib/stores/ActiveRemotes";
  import "../app.css";
  import { emit, listen } from "@tauri-apps/api/event";
  import { invoke } from "@tauri-apps/api/tauri";
  import { onDestroy, onMount } from "svelte";
  import { appWindow } from "@tauri-apps/api/window";
  import { dev } from "$app/environment";
  import { page } from "$app/stores";
  import QRCodePanel from "$lib/components/QRCodePanel.svelte";
  import {
    ActionType,
    homeTilesArray,
    homeTileSelection,
  } from "$lib/stores/HomeTile";
  import { effectsVolume, debug } from "$lib/stores/Settings";
  import HomeTile from "$lib/components/HomeTile.svelte";
  import { goto } from "$app/navigation";
  import { type RemoteEvent, type RemoteAction } from "$lib/types/Remote";

  let unlisten: Function;

  onMount(async () => {
    if (!dev) appWindow.setFullscreen(true);
    fullscreen = await appWindow.isFullscreen();

    unlisten = await listen("action", (event: RemoteEvent) => {
      handleAction(event.payload);
    });

    setInterval(() => {
      $activeRemotes = $activeRemotes.filter(
        (device) => Date.now() - device.lastHeartbeat < 10000
      );
    }, 1000);

    setInterval(() => {
      currentTime = Date.now();
    }, 5);
  });

  async function handleAction(event: RemoteAction) {
    const action: RemoteAction = event;
    if (action.event !== "HEARTBEAT") {
      console.log(action);
      let audio = new Audio(
        "/audio/ESM_Ambient_Game_Menu_Percussive_Select_3_Notification_Wood_Pause_Settings.wav"
      );
      audio.volume = $effectsVolume;
      audio.play();
    }

    if (action.event === "NAVIGATE") {
      if (action.action === "FULLSCREEN") {
        console.log("Toggled fullscreen");
        await appWindow.setFullscreen(!fullscreen);
        fullscreen = !fullscreen;
      }
      if (action.action === "HOME") {
        goto("/");
      }
    }

    if (action.event === "SETTINGS") {
      if (action.action === "DEBUG") {
        $debug = !$debug;
      }
    }

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
  }

  let fullscreen = true;

  let currentTime = Date.now();

  onDestroy(() => {
    unlisten();
  });
</script>

<slot />

<div
  class="flex flex-col w-full h-full items-center justify-center absolute top-0 bottom-0 left-0 right-0 bg-black bg-opacity-75"
  class:hidden={($activeRemotes.length > 0 &&
    !($lastQrViewTime > currentTime - 10000)) ||
    location.pathname !== "/"}>
  {#await invoke("get_network_ip") then ip}
    <QRCodePanel text={`http://${ip}`} />
  {/await}
</div>

{#if true}
  <div class="absolute bottom-0 right-0 z-[500000] bg-black text-white p-1">
    <p>Debug: {$debug}</p>
    <p>Effects Volume: {$effectsVolume}</p>
    <p>Selection: {JSON.stringify($homeTileSelection)}</p>
    <table class="table">
      <thead>
        <tr>
          <th class="font-bold">Device</th>
          <th class="font-bold">lastHeartbeat</th>
        </tr>
      </thead>
      <tbody>
        {#each $activeRemotes as device}
          <tr>
            <td>{device.device}</td>
            <td>{device.lastHeartbeat}</td>
          </tr>
        {/each}
      </tbody>
      <tfoot>
        <tr>
          <td class="font-bold">Active Remotes</td>
          <td class="font-bold">{$activeRemotes.length}</td>
        </tr>
      </tfoot>
    </table>
  </div>
{/if}
