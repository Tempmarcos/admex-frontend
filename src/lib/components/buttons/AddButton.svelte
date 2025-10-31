<script lang='ts'>

    let { onClick, texto } = $props()
</script>
<button class="add-btn" onclick={() => onClick()}>
    {texto}
</button>

<style>
.add-btn {
    background: #0077ff;
    color: white;
    border: none;
    padding: 0.8rem 1.5rem;
    border-radius: 8px;
    font-size: 1rem;
    cursor: pointer;
    transition: background 0.2s;
  }
  .add-btn:hover {
    background: #005fcc;
  }
</style>