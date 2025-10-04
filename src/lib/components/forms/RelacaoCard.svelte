<script>
  let { nome, onClickGet } = $props();
</script>

<div class="card">
    <h1>{nome}</h1>
    <button onclick={onClickGet}>+</button>
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
