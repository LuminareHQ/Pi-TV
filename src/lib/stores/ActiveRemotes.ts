import { writable } from "svelte/store";

export type ActiveDevices = {
  device: String;
  lastHeartbeat: number;
};

export const activeRemotes = writable<Array<ActiveDevices>>([]);

export const lastQrViewTime = writable<number>(Date.now() - 10000);
