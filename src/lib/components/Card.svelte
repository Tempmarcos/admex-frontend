<script>
  let { width, height, children } = $props();
</script>

<div class="card">
  {@render children?.()}
</div>

<style>
  .card {
    background-color: #fff;
    border-radius: 10px;
    padding: 5px;
    display: flex;
    flex-flow: wrap;
  }
</style>
