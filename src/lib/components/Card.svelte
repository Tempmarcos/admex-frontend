<script>
  let { width, height, children } = $props();
</script>

<div class="card" style="width: {width}; height: {height}">
  {@render children?.()}
</div>

<style>
  .card {
    background-color: #fff;
    border-radius: 10px;
    padding: 5px;
  }
</style>
