
<script>
  import { onMount } from 'svelte';
  import Chatinput from '../component/Chat-input.svelte';
  import LoginButton from './LoginButton.svelte';

  let MainMenu = true;
  let UseCasesMenu=false;

  function ChangeMenu(mode){
    if(mode=="usecases"){
      MainMenu = false;
      UseCasesMenu=true;
    } else if(mode=="main"){
      MainMenu = true;
      UseCasesMenu=false;
    }
  }

  onMount(() => {
    const hash = new URLSearchParams(window.location.hash.slice(1));
    const accessToken = hash.get("access_token");

    if (accessToken) {
      localStorage.setItem("access_token", accessToken);

      // Bersihkan URL dari #access_token
      history.replaceState(null, '', window.location.pathname);
      getGoogleUserProfile(accessToken);
    }
  });

  async function getGoogleUserProfile(access_token) {
    const res = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: {
        Authorization: `Bearer ${access_token}`
      }
    });

    if (!res.ok) {
      throw new Error('Gagal mengambil profil Google');
    }

    const profile = await res.json();
    console.log(profile.email);
    localStorage.setItem("email", profile.email);
    localStorage.setItem("foto", profile.picture);
    localStorage.setItem("nama", profile.name);
  }

</script>

<style>
  :global(body) {
    margin-top: 0;
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
    
    /* margin-top 10vw = 10% dari width window*/
  }

  

  h1 {
    font-size: 2rem;
    margin-bottom: 1rem;
  }

  p {
    font-size: 1.1rem;
    max-width: 500px;
    margin-bottom: 2rem;
    line-height: 1.6;
  }

  .links {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
    justify-content: center;
    place-items: bottom;
  }

  .links a {
    background-color: #ffffff10;
    padding: 0.75rem 1.5rem;
    border-radius: 10px;
    text-decoration: none;
    color: #ffffff;
    border: 1px solid #ffffff30;
    transition: all 0.3s ease;
    min-width: 200px;
  }

  .links a:hover {
    background-color: #ffffff20;
    transform: scale(1.05);
  }

  button {
    background-color: #BE8F0290;
    padding: 0.75rem 1.5rem;
    border-radius: 10px;
    text-decoration: none;
    color: #ffffff;
    border: 1px solid #ffffff30;
    transition: all 0.3s ease;
    min-width: 250px;
  }

  button:hover {
    background-color: #BE8F0220;
    transform: scale(1.05);
  }
</style>


<div class="container" style="margin-top:10vh; ">
  
  <h1><font style="color:#BE8F02">Attention</font> is here!</h1>
  <p>Empowering smart automation and intelligent agents to enhance your productivity.</p>

{#if MainMenu}
  <div class="links">
    <button on:click={ChangeMenu("usecases")}>
      <i class="fas fa-bolt"></i> Use Cases
    </button>
    <a href="https://t.me/Yeshub_bot" target="_blank">
      <i class="fab fa-telegram"></i> Bot
    </a>
    <a href="https://instagram.com/yesvara.ai" target="_blank">
      <i class="fab fa-instagram"></i> Instagram
    </a>
    <a href="https://n8n.yesvara.com" target="_blank">
      <i class="fas fa-robot"></i> Automation
    </a>
    {#if !localStorage.getItem('access_token')}
      <LoginButton/>
    {/if}

  </div>
{/if}

{#if UseCasesMenu}
  <div class="links" style="margin-bottom: 50px">
    <button on:click={ChangeMenu("main")}>
      <i class="fas fa-arrow-left"></i> Back
    </button>
    <a href="#/interview">
      <i class="fas fa-microphone"></i> AI Interview
    </a>
    <a href="#/branding">
      <i class="fas fa-palette"></i> AI Branding
    </a>
    <a href="#/news">
      <i class="fas fa-newspaper"></i> AI News
    </a>
    <a href="#/research">
      <i class="fas fa-flask"></i> AI Research
    </a>
    <a href="https://t.me/Yeshub_bot" target="_blank">
      <i class="fas fa-comments"></i> AI Chatbot
    </a>
  </div>
  
{/if}
  
</div>

<a href="#/chat">
  <Chatinput />
</a>



