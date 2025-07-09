<script>
  import Router from 'svelte-spa-router';
  import LoginButton from './routes/LoginButton.svelte';
  import Home from './routes/Home.svelte';
  import Branding from './routes/Branding.svelte';
  import Interview from './routes/Interview.svelte';
  import News from './routes/News.svelte';
  import Research from './routes/Research.svelte';
  import Chat from './routes/Chat.svelte';
  import { onMount } from 'svelte';

  const routes = {
    '/': Home,
    '/branding': Branding,
    '/interview': Interview,
    '/news': News,
    '/research': Research,
    '/chat': Chat
  };

  let foto = '/guest.png';
  let nama = 'Guest';
  let email = '';
  let sidebarOpen = true;

  onMount(() => {
    if (localStorage.getItem('access_token')) {
      foto = localStorage.getItem('foto') || foto;
      nama = localStorage.getItem('nama') || nama;
      email = localStorage.getItem('email') || '';
    }

    // Set status sidebar berdasarkan lebar awal
    cekLebarWindow();

    // Pasang event listener saat resize
    window.addEventListener('resize', cekLebarWindow);

    return () => {
      window.removeEventListener('resize', cekLebarWindow);
    };
  });

  function toggleSidebar() {
    sidebarOpen = !sidebarOpen;
  }

  function cekLebarWindow() {
    if (window.innerWidth < 768) {
      sidebarOpen = false;
    } else {
      sidebarOpen = true;
    }
  }
</script>

<style>
  .layout {
    display: flex;
    min-height: 100vh;
  }

  .sidebar {
    position: fixed;
    top: 0px;
    left: 0;
    width: 240px;
    height: calc(100vh );
    background-color: #011b25;
    padding: 1rem;
    border-right: 1px solid #ddd;
    z-index: 999;
    overflow-y: auto;
    transition: transform 0.3s ease;

    display: flex;
    flex-direction: column;
  }

  .sidebar.hidden {
    transform: translateX(-100%);
  }

  .sidebar nav a {
    display: block;
    margin: 0.75rem 0;
    text-decoration: none;
    color: white;
    font-weight: 500;
  }

  .sidebar nav a:hover {
    color: #00cec9;
  }

  .menu-wrapper {
    display: flex;
    flex-direction: column;
    justify-content: top;
    text-align:left;
    flex-grow: 1;
    width: 100%;
    padding-top:30px;
  }

  .profile {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 1rem;
    border-top: 1px solid #ccc;
    width: 100%;
    padding-bottom:30px;
  }

  .profile img {
    width: 36px;
    height: 36px;
    border-radius: 50%;
  }


  .hamburger {
    display: none;
    position: fixed;
    top: 10px;
    left: 10px;
    z-index: 1100;
    background: white;
    color: black;
    border: 1px solid #ccc;
    padding: 6px 10px;
    border-radius: 6px;
    cursor: pointer;
    width:50px;
  }

  .content {
    margin-left: 240px;
    padding: 70px 1rem 1rem;
    flex: 1;
    width: 100%;
  }

  .header-fixed {
    position: fixed;
    top: 0;
    left: 0;
    width:100%;
    text-align:left;
    margin-left:270px;
    height:50px;
    background-color: #01212e;
    z-index: 999;
    padding-top:15px;
    padding-left:20px;
  }

  @media (max-width: 768px) {
    .sidebar {
      transform: translateX(-100%);
    }

    .sidebar.open {
      transform: translateX(0);
    }

    .content {
      margin-left: 0;
    }

    .hamburger {
      display: block;
    }

    .header-fixed {
      width:100%;
      text-align:center;
      margin-left:0px;
      padding-left:0px;
    }

  }
</style>

<!-- Tombol Sidebar -->
<button class="hamburger" on:click={toggleSidebar}>☰</button>

<div class="header-fixed">
  <a href="#/"><img src="/yesvara-row.png" alt="Logo" class="logo" /></a>
</div>

<div class="layout">
  <!-- Sidebar -->
  <div class="sidebar {sidebarOpen ? 'open' : 'hidden'}">
    <div class="menu-wrapper">
      <nav>
        <a href="#/"><i class="fas fa-house"></i> Home</a>
        <a href="#/branding"><i class="fas fa-palette"></i> Branding</a>
        <a href="#/interview"><i class="fas fa-microphone"></i> Interview</a>
        <a href="#/news"><i class="fas fa-newspaper"></i> News</a>
        <a href="#/research"><i class="fas fa-flask"></i> Research</a>
        <a href="#/chat"><i class="fas fa-comments"></i> Chat</a>
      </nav>
    </div>  
    
    <div class="profile" >
    {#if !localStorage.getItem('access_token')}
      <LoginButton/>
    {/if}
    {#if localStorage.getItem('access_token')}
      <img src={foto} alt="foto" />
      <div>
        <div style="font-weight: 600; text-align:left">{nama}</div>
        <div style="font-size: 0.8rem; color: #ccc;">{email}</div>
      </div>
    {/if}
    </div>
  </div>

  <!-- Konten utama -->
  <div class="content" on:click={() => {if (window.innerWidth < 768){(sidebarOpen = false)}}} >
    <Router {routes} />
  </div>
</div>