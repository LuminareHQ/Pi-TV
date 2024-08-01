import { writable } from "svelte/store";

export type ActiveDevices = {
  device: String;
  lastHeartbeat: number;
};

export const activeRemotes = writable<Array<ActiveDevices>>([]);
