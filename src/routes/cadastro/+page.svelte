<script lang="ts">
  import { onMount } from "svelte";
  import { fetchEstados } from "$lib/utils/empresa/fetchEstados";
  import '$lib/styles/form.css'
  import MultiStepForm from "$lib/components/forms/MultiStepForm.svelte";

  onMount(async () => { 
    await fetchEstados();
})
</script>
<main>
  <h1 class="sair"><a href="/">Voltar</a></h1>
  <h1 class="title">Começe a criar sua conta</h1>
  <MultiStepForm></MultiStepForm>
</main>