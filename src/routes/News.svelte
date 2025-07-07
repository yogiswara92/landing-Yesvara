<script lang="ts">
  let name = '';
  let brief = '';
  let isSubmitting = false;
  let aiProgress = '';

  async function submitToN8n() {
  
    isSubmitting = true;
    aiProgress = 'AI sedang memproses, mengakses dan merangkum berbagai situs berita online, mohon ditunggu beberapa detik...';

    const res = await fetch('https://n8n.yesvara.com/webhook/ca1f26ee-4b1c-457a-99ce-9918cc715076', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      
    });

    if (res) {
      const data = await res.json();
      console.log(data);
      // console.log(data[0]);
      aiProgress = data[0].webOutput || 'AI sedang memproses...';
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
  Trending News Summarization

    <button on:click={submitToN8n} disabled={isSubmitting}>
      {isSubmitting ? 'Memproses..' : 'Process'}
    </button>

    <p class="progress-text">{@html aiProgress}</p>
  </div>
</div>

