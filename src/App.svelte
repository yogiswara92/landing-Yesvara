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
  let isLoggedIn = false;
  let sidebarOpen = true;

  onMount(() => {
    const hash = new URLSearchParams(window.location.hash.slice(1));
    const accessToken = hash.get("access_token");

    // Khusus testing:
      // nama = "Yogiswara Gheartha";
      // email="tesyogiswaragheartha@gmail.com";
      // localStorage.setItem("nama", nama);
      // localStorage.setItem("email", email);
    // -------------

    email="yogiswaragheartha@gmail.com";
    if (accessToken) {
      localStorage.setItem("access_token", accessToken);
      history.replaceState(null, '', window.location.pathname);
      getGoogleUserProfile(accessToken);
    } else if (localStorage.getItem('access_token')) {
      updateProfile();
    }

    cekLebarWindow();
    window.addEventListener('resize', cekLebarWindow);

    return () => window.removeEventListener('resize', cekLebarWindow);
  });

  function updateProfile() {
    foto = localStorage.getItem('foto') || '/guest.png';
    nama = localStorage.getItem('nama') || 'Guest';
    email = localStorage.getItem('email') || '';
    isLoggedIn = localStorage.getItem('access_token') ? true : false;
  }

  async function getGoogleUserProfile(access_token) {
    const res = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: {
        Authorization: `Bearer ${access_token}`
      }
    });

    if (!res.ok) {
      console.error('Gagal mengambil profil Google');
      return;
    }

    const profile = await res.json();
    localStorage.setItem("email", profile.email);
    localStorage.setItem("foto", profile.picture);
    localStorage.setItem("nama", profile.name);
    updateProfile();
  }

  function toggleSidebar() {
    sidebarOpen = !sidebarOpen;
  }

  function cekLebarWindow() {
    sidebarOpen = window.innerWidth >= 768;
  }

  function logout() {
    localStorage.clear();
    foto = '/guest.png';
    nama = 'Guest';
    email = '';
    isLoggedIn = false;
    window.location.href = "#/";
  }
</script>

<style>
  .layout {
    display: flex;
    /* background-color: bisque; */
    /* height:2000px; */
    /* width: calc(99vw - 320px); */
    
  }

  .sidebar {
    position: fixed;
    top: 0px;
    left: 0;
    width: 240px;
    height: 100dvh;
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
    top: 15px;
    left: 10px;
    z-index: 1100;
    color: white;
    background-color:#01212e;
    border: 1px solid #ccc;
    padding: 6px 10px;
    border-radius: 6px;
    cursor: pointer;
    width:50px;
  }

  .hamburger:hover {
    background-color: #00cec9;
  }

  .content {
    margin-left: 260px;
    justify-content: center;
    /* padding: 0px 0.5rem 0.5rem; */
    display:flex;
    flex: 1;
    /* width: calc(99vw - 290px); */
    width:100%;
    /* background-color: aqua; */

  }

  .header-fixed {
    position: fixed;
    top: 0;
    left: 0;
    width:calc(99vw - 280px);
    text-align:left;
    margin-left:270px;
    height:50px;
    background-color: #01212e;
    /* background-color: orange; */
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
      margin-left: 0px;
      
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
        <a href="#/" on:click={() => window.innerWidth < 768 && (sidebarOpen = false)}><i class="fas fa-house"></i> Home</a>
        <a href="#/branding" on:click={() => window.innerWidth < 768 && (sidebarOpen = false)}><i class="fas fa-palette"></i> Branding</a>
        <a href="#/interview" on:click={() => window.innerWidth < 768 && (sidebarOpen = false)}><i class="fas fa-microphone"></i> Interview</a>
        <a href="#/news" on:click={() => window.innerWidth < 768 && (sidebarOpen = false)}><i class="fas fa-newspaper"></i> News</a>
        <a href="#/research" on:click={() => window.innerWidth < 768 && (sidebarOpen = false)}><i class="fas fa-flask"></i> Research</a>
        <a href="#/chat" on:click={() => window.innerWidth < 768 && (sidebarOpen = false)}><i class="fas fa-comments"></i> Chat</a>
        {#if isLoggedIn}
          <a href="#/" on:click={logout}><i class="fas fa-right-from-bracket"></i> Log Out</a>
        {/if}
      </nav>
    </div>  
    
    <div class="profile">
      {#if !isLoggedIn}
        <LoginButton />
      {:else}
        <img src={foto} alt="foto" />
        <div>
          <div style="font-weight: 600; text-align:left">{nama}</div>
          <div style="font-size: 0.8rem; color: #ccc;">{email}</div>
        </div>
      {/if}
    </div>
  </div>

  <!-- Konten utama -->
  <div class="content" on:click={() => window.innerWidth < 768 && (sidebarOpen = false)}>
    <Router {routes} />
  </div>
</div>