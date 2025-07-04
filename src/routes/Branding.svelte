<script lang="ts">
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

<div class="container">
   <a href="#/" ><img src="/logo.png" alt="Logo" class="logo" /></a>
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

<style>
  :global(body) {
    margin: 0;
    font-family: 'Segoe UI', sans-serif;
    background-color: #01212e;
    color: white;
  }

  .container {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 1rem;
    text-align: center;
    justify-content: center;
  }

  .logo {
    max-width: 120px;
    margin-bottom: 1.5rem;
  }

  .form-section {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
  }

  input, select {
    padding: 1rem;
    border-radius: 8px;
    width: 250px;
    text-align: left;
    border: none;
  }

  textarea {
    padding: 1rem;
    border-radius: 8px;
    width: 250px;
    height: 100px;
    text-align: left;
    border: none;
  }

  button {
    background-color: #01a3a4;
    border: none;
    padding: 1rem 2rem;
    color: white;
    font-size: 1rem;
    width: 150px;
    border-radius: 8px;
    cursor: pointer;
    transition: background 0.3s ease;
    /* display: flex; */
    align-items: center;   
    gap: 0.5rem;
  }

  button:hover {
    background-color: #00cec9;
  }

  button:disabled {
    background-color: #555;
    cursor: not-allowed;
    
  }

  .progress-text {
    margin-top: 1rem;
    font-style: italic;
  }
</style>