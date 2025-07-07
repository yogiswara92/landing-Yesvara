<script lang="ts">
  //import '../app.css'; 
  let name = '';
  let brief = '';
  let isSubmitting = false;
  let aiProgress = '';

  async function submitToN8n() {
    if (!name) {
      alert('Harap lengkapi form sektor bisnis.');
      return;
    }
    isSubmitting = true;
    aiProgress = 'AI sedang memproses, mohon ditunggu 1-2 menit...';

    const res = await fetch('https://n8n.yesvara.com/webhook/brand-submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name, brief
      })
    });

    if (res) {
      const data = await res.json();
      console.log(data);
      // console.log(data[0]);
      aiProgress = data.status || 'AI sedang memproses...';
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
  Intelligent Branding Assistant
    <input
      type="text"
      placeholder="Business sector / focus"
      bind:value={name}
      disabled={isSubmitting}
    />
     <textarea
      type="text-area"
      placeholder="Short brief about your brand"
      bind:value={brief}
      disabled={isSubmitting}
    />


    <button on:click={submitToN8n} disabled={isSubmitting}>
      {isSubmitting ? 'Memproses..' : 'Submit'}
    </button>

    <p class="progress-text">{aiProgress}</p>
  </div>
</div>

