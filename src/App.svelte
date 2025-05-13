<script>
  // Jika perlu logic tambahan, tulis di sini
</script>

<style>
  :global(body) {
    margin: 0;
    font-family: 'Segoe UI', sans-serif;
    background-color: #01212e;
    color: #ffffff;
  }

  .container {
    /* min-height: 100vh; */
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 1rem;
    text-align: center;
    /* margin-top:-50px; */
  }

  img.logo {
    max-width: 120px;
    margin-bottom: 1.5rem;
  }

  h1 {
    font-size: 2rem;
    margin-bottom: 1rem;
  }

  p {
    font-size: 1.1rem;
    max-width: 600px;
    margin-bottom: 2rem;
    line-height: 1.6;
  }

  .links {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
    justify-content: center;
    
  }

  .links a {
    background-color: #ffffff10;
    padding: 0.75rem 1.5rem;
    border-radius: 10px;
    text-decoration: none;
    color: #ffffff;
    border: 1px solid #ffffff30;
    transition: all 0.3s ease;
    min-width: 100px;
  }

  .links a:hover {
    background-color: #ffffff20;
    transform: scale(1.05);
  }
</style>

<div class="container">
  <img src="/logo.png" alt="Yesvara Logo" class="logo" />
  <h1><font style="color:#BE8F02">Attention</font> is here!</h1>
  <p>Empowering smart automation and intelligent agents to enhance your productivity.</p>

  <div class="links">
    <a href="https://t.me/Yeshub_bot" target="_blank">Bot</a>
    <a href="https://instagram.com/yesvara.ai" target="_blank">Instagram</a>
    <a href="http://yesvara.com:5678" target="_blank">Automation</a>
  </div>
</div>