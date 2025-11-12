<script lang="ts">
  // Props
  export let codigo: string;
  export let cliente: string;
  export let status: string;
  export let onClickGet: () => void;

  // Função para definir cor com base no status
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'criada':
        return '#999'; // cinza
      case 'enviada':
        return '#007bff'; // azul
      case 'aprovada':
        return '#28a745'; // verde
      case 'executada':
        return '#6f42c1'; // roxo
      case 'cancelada':
        return '#dc3545'; // vermelho
      default:
        return '#666';
    }
  };
</script>

<button class="card" on:click={onClickGet}>
  <div class="card-header">
    <h1 class="codigo">#{codigo}</h1>
    <span class="status" style="background-color: {getStatusColor(status)}">
      {status}
    </span>
  </div>
  <p class="cliente">{cliente}</p>
</button>

<style>
  .card {
    background-color: #fff;
    border-radius: 10px;
    padding: 1rem;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    cursor: pointer;
    box-shadow: 0 2px 5px rgba(0,0,0,0.1);
    transition: transform 0.15s ease, box-shadow 0.15s ease;
    border: none;
    text-align: left;
    width: 100%;
    max-width: 320px;
    min-width: 260px;
    height: auto;
    min-height: 130px;
  }

  .card:hover {
    transform: translateY(-3px);
    box-shadow: 0 4px 10px rgba(0,0,0,0.15);
  }

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .codigo {
    margin: 0;
    color: #333;
  }

  .status {
    color: #fff;
    text-transform: capitalize;
    padding: 0.25rem 0.6rem;
    border-radius: 5px;
    font-weight: 600;
  }

  .cliente {
    color: #555;
    margin-top: 0.5rem;
  }

  /* Responsivo */
  @media (max-width: 600px) {
    .codigo {
      font-size: 1rem;
    }

    .cliente {
      font-size: 0.9rem;
    }
  }
</style>