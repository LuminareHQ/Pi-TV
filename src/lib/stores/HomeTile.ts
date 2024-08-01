import { writable } from "svelte/store";

type HomeTile = {
  title: String;
  image: String;
};

export type Position = {
  row: number;
  col: number;
};

type Tile = {
    element: HTMLElement;
    position: Position;
  };

export const homeTilesArray = writable<Array<Array<HomeTile>>>([
  [
    { title: "Something" },
    { title: "Something Else" },
    { title: "Something Else 2" },
  ],
  [{ title: "Even More Something Else" }],
  [
    { title: "Something" },
    { title: "Something Else" },
    { title: "Something Else 2" },
  ],
]);

export const homeTileSelection = writable<Position>({ row: -1, col: -1 });

export const homeTileRefs = writable<Array<Tile>>([]);