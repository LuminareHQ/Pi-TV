<script lang="ts">
  import { homeTileSelection, homeTileRefs } from "$lib/stores/HomeTile";
  export let y;
  export let x;
  export let tile;

  let element: HTMLElement;

  $: if ($homeTileSelection.row === x && $homeTileSelection.col === y) {
    focusMe();
  }

  function focusMe() {
    element.scrollIntoView({
      behavior: "smooth",
      block: "center",
      inline: "center",
    });
  }
</script>

<div
  bind:this={element}
  class="w-96 h-48 bg-gradient-to-tr to-primary from-secondary rounded-xl m-2"
  class:shadow-2xl={$homeTileSelection.row === x &&
    $homeTileSelection.col === y}
>
  <div
    class="w-96 h-48 bg-black bg-opacity-25 rounded-xl overflow-hidden p-2 relative border-success"
    class:border-2={$homeTileSelection.row === x &&
      $homeTileSelection.col === y}
  >
    <div class="absolute bg-black bottom-0 left-0 right-0 p-1">
      <p class="text-white p-1 font-bold">{tile.title}</p>
    </div>
  </div>
</div>
