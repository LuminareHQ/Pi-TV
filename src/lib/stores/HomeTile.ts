import { writable } from "svelte/store";

type HomeTile = {
  title: String;
  action: ActionType;
  uri: String;
  image: String;
};

export type Position = {
  row: number;
  col: number;
};

export enum ActionType {
  OPEN_APP,
  OPEN_EXE,
  OPEN_URL,
  GOTO,
}

type Tile = {
  element: HTMLElement;
  position: Position;
};

export const homeTilesArray = writable<Array<Array<HomeTile>>>([
  [
    { title: "Something" },
    {
      title: "Youtube",
      image:
        "https://store-images.s-microsoft.com/image/apps.25822.13614820593571814.1b8b8d01-8690-4f11-988d-2d9835390894.a17f8399-effa-4749-aeb4-045be0489146?mode=scale&q=90&h=200&w=200&background=%230078D7",
      action: ActionType.GOTO,
      uri: "youtube",
    },
    { title: "Something Else 2" },
  ],
  [{ title: "Even More Something Else" }],
  [
    { title: "Something" },
    { title: "Something Else" },
    { title: "Something Else 2" },
  ],
]);

export const homeTileSelection = writable<Position>({ row: 0, col: 0 });

export const homeTileRefs = writable<Array<Tile>>([]);
