<script lang="ts">
  let topic = '';
  let brief = '';
  let isSubmitting = false;
  let aiProgress = '';

  async function submitToN8n() {
    if (!topic) {
      alert('Harap lengkapi topik anda.');
      return;
    }
    isSubmitting = true;
    aiProgress = 'AI sedang memproses, mencari berbagai referensi dan menulis artikel. Mohon ditunggu beberapa detik...';

    const res = await fetch('https://n8n.yesvara.com/webhook/a8182ef8-5cbb-4d04-aa28-3e3cd590e3c1', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        topic
      })
    });

    if (res) {
      const data = await res.json();
      //console.log(data);
      aiProgress = data[0].output || 'AI sedang memproses...';
      isSubmitting = false;
    } else {
      aiProgress = 'Gagal menghubungi AI';
    }
    
  }
</script>

<svelte:head>
  <link
    rel="stylesheet"
    href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css"
    crossorigin="anonymous"
    referrerpolicy="no-referrer"
  />
</svelte:head>

<div class="container" style="margin-top:20vh">
  <div class="form-section">
  Do research and create articles! 
    <input
      type="text"
      placeholder="Research Topic"
      bind:value={topic}
      disabled={isSubmitting}
    />


    <button on:click={submitToN8n} disabled={isSubmitting}>
      {isSubmitting ? 'Memproses..' : 'Submit'}
    </button>

    <p class="progress-text">{@html aiProgress}</p>
  </div>
</div>

