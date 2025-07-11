
<script>
// @ts-nocheck

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

  

</script>

<style>
  :global(body) {
    margin-top: 0;
    font-family: 'Segoe UI', sans-serif;
    /* background-color: #01212e; */
    color: #ffffff;
  }

  .container {
    /* min-height: 100vh; */
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    margin-top: 10vh;
    /* margin-left: calc(30vw - 240px); */
    /* margin-top 10vw = 10% dari width window*/
    /* background-color: red; */
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


<div class="container" >
  
  <h1><font style="color:#BE8F02">Attention</font> is here!</h1>
  <p>Empowering smart automation and intelligent agents to enhance your productivity.</p>

{#if MainMenu}
  <div class="links" style="margin-bottom: 60px">
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
    

  </div>
{/if}

{#if UseCasesMenu}
  <div class="links" style="margin-bottom: 60px">
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


<div class="chat-input-wrapper" >
  <a href="#/chat" style="width:98%; margin-left:-15px" >
    <Chatinput />
  </a>
</div>



