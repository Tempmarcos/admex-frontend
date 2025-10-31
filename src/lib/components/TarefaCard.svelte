<script lang="ts">
  export let nome: string;
  export let criador: string | undefined;
  export let responsavel: string | undefined;
  export let status: string;
  export let dataAgendada: string | null | undefined;
  export let onClick: (() => void) | undefined;
  export let compact: boolean = false;

  // Derivada reativa — recalculada sempre que dataAgendada mudar
  $: dataFormatada = dataAgendada ? formatDate(dataAgendada) : '';

  function formatDate(iso: string) {
    const d = new Date(iso);
    // Ajuste de timezone dependendo do formato que você recebe — aqui usamos toLocaleString pt-BR
    return d.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'UTC'
    });
  }

  function getStatusColor(status: string | undefined) {
    const statusColors: Record<string, string> = {
      'pendente': '#ffa726',
      'em_andamento': '#42a5f5',
      'concluida': '#66bb6a',
      'cancelada': '#ef5350',
      'pausada': '#ab47bc'
    };
    return status ? (statusColors[status.toLowerCase()] || '#757575') : '#757575';
  }

  // utilitário para checar atrasada (cuide do caso sem data)
  $: isOverdue = dataAgendada ? (new Date(dataAgendada) < new Date()) : false;
</script>

<a onclick={onClick} role="button" tabindex="0">
<div class="card {compact ? 'compact' : ''}">
    <div class="card-header">
        <div class="status-badge" style="background-color: {getStatusColor(status)}">
            {status?.charAt(0).toUpperCase() + status?.slice(1) || 'Sem status'}
        </div>
    </div>

    <div class="card-content">
        <h3 class="task-title" title={nome}>{nome}</h3>
        
        {#if !compact}
            <div class="task-details">
                <div class="detail-item">
                    <span class="label">Criador:</span>
                    <span class="value">{criador || 'Não informado'}</span>
                </div>
                
                <div class="detail-item">
                    <span class="label">Responsável:</span>
                    <span class="value {!responsavel ? 'empty' : ''}">
                        {responsavel || 'Não atribuído'}
                    </span>
                </div>
                
                {#if dataFormatada}
                    <div class="detail-item">
                        <span class="label">Agendada:</span>
                        <span class="value {isOverdue ? 'overdue' : ''}">{dataFormatada}</span>
                    </div>
                {/if}
            </div>
        {:else}
            <div class="compact-details">
                <span class="responsavel-compact">{responsavel || 'Sem responsável'}</span>
                {#if dataFormatada}
                    <span class="data-compact">{dataFormatada}</span>
                {/if}
            </div>
        {/if}
    </div>

    {#if !compact}
        <div class="card-footer">
            <div class="metadata">
                <span class="criador">Criada por: {criador}</span>
            </div>
        </div>
    {/if}
</div>
</a>

<style>
    a{
        text-decoration: none;
        cursor: pointer;
    }
    .card {
        background: #ffffff;
        border-radius: 12px;
        padding: 16px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        border: 1px solid #e1e5e9;
        transition: all 0.3s ease;
        position: relative;
        overflow: hidden;
    }

    .card:hover {
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
        transform: translateY(-2px);
    }

    .card.compact {
        padding: 12px;
        cursor: pointer;
    }

    .card.compact:hover {
        background: #f8f9fa;
    }

    .card-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 12px;
    }

    .status-badge {
        padding: 4px 12px;
        border-radius: 20px;
        color: white;
        /* font-size: 0.75rem; */
        font-weight: 600;
        text-transform: capitalize;
        letter-spacing: 0.5px;
    }

    .card-content {
        margin-bottom: 12px;
    }

    .task-title {
        /* font-size: 1.1rem; */
        font-weight: 600;
        color: #2c3e50;
        margin: 0 0 12px 0;
        line-height: 1.4;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
    }

    .task-details {
        display: flex;
        flex-direction: column;
        gap: 8px;
    }

    .detail-item {
        display: flex;
        align-items: center;
        gap: 8px;
    }

    .label {
        /* font-size: 0.8rem; */
        color: #6c757d;
        font-weight: 500;
        min-width: 100px;
    }

    .value {
        /* font-size: 0.9rem; */
        color: #2c3e50;
        font-weight: 500;
    }

    .value.empty {
        color: #adb5bd;
        font-style: italic;
    }

    .value.overdue {
        color: #d32f2f;
        font-weight: 600;
    }

    .compact-details {
        display: flex;
        flex-direction: column;
        gap: 4px;
        margin-top: 8px;
    }

    .responsavel-compact {
        font-size: 0.85rem;
        color: #495057;
        font-weight: 500;
    }

    .data-compact {
        font-size: 0.75rem;
        color: #6c757d;
    }

    .card-footer {
        border-top: 1px solid #e9ecef;
        padding-top: 12px;
    }

    .metadata {
        font-size: 0.75rem;
        color: #6c757d;
    }

    /* Variantes de status */
    .card[data-status="pendente"] {
        border-left: 4px solid #ffa726;
    }

    .card[data-status="em_andamento"] {
        border-left: 4px solid #42a5f5;
    }

    .card[data-status="concluida"] {
        border-left: 4px solid #66bb6a;
    }

    .card[data-status="cancelada"] {
        border-left: 4px solid #ef5350;
        opacity: 0.8;
    }

    /* Responsividade */
    @media (max-width: 768px) {
        .card {
            padding: 12px;
        }

        .task-title {
            font-size: 1rem;
        }

        .detail-item {
            flex-direction: column;
            align-items: flex-start;
            gap: 2px;
        }

        .label {
            min-width: auto;
        }
    }
</style>