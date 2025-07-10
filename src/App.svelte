<script>
  import Router from 'svelte-spa-router';
  import LoginButton from './routes/LoginButton.svelte';
  import Home from './routes/Home.svelte';
  import Branding from './routes/Branding.svelte';
  import Interview from './routes/Interview.svelte';
  import News from './routes/News.svelte';
  import Research from './routes/Research.svelte';
  import Chat from './routes/Chat.svelte';
  import { afterUpdate, onMount } from 'svelte';

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
    const hash = new URLSearchParams(window.location.hash.slice(1));
    const accessToken = hash.get("access_token");

    if (accessToken) {
      localStorage.setItem("access_token", accessToken);

      // Bersihkan URL dari #access_token
      history.replaceState(null, '', window.location.pathname);
      getGoogleUserProfile(accessToken);
    }

    if (localStorage.getItem('access_token')) {
      updateProfile();
    }

    // Set status sidebar berdasarkan lebar awal
    cekLebarWindow();

    // Pasang event listener saat resize
    window.addEventListener('resize', cekLebarWindow);

    return () => {
      window.removeEventListener('resize', cekLebarWindow);
    };
  });

  function updateProfile() {
    foto = localStorage.getItem('foto') || '/guest.png';
    nama = localStorage.getItem('nama') || 'Guest';
    email = localStorage.getItem('email') || '';
  }

  afterUpdate(() => {
    // Akan jalan setiap ada update DOM — bisa deteksi kalau login baru selesai
    if (localStorage.getItem('access_token') && nama === 'Guest') {
      updateProfile(); // ambil ulang data
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

    updateProfile();
  }

  $: if (localStorage.getItem('access_token') && nama === 'Guest') {
    updateProfile();
  }
 

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

  function logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('nama');
    localStorage.removeItem('email');
    localStorage.removeItem('foto');
    window.location.href = "#/"; // Redirect ke halaman home
    location.reload(); // Refresh halaman agar state kembali ke guest
  }
</script>

<style>
  .layout {
    display: flex;
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
        <a href="#/" on:click={toggleSidebar}><i class="fas fa-house"></i> Home</a>
        <a href="#/branding" on:click={toggleSidebar}><i class="fas fa-palette"></i> Branding</a>
        <a href="#/interview" on:click={toggleSidebar}><i class="fas fa-microphone"></i> Interview</a>
        <a href="#/news" on:click={toggleSidebar}><i class="fas fa-newspaper"></i> News</a>
        <a href="#/research" on:click={toggleSidebar}><i class="fas fa-flask"></i> Research</a>
        <a href="#/chat" on:click={toggleSidebar}><i class="fas fa-comments"></i> Chat</a>
        {#if localStorage.getItem('access_token')}
          <a href="#/" on:click={logout}><i class="fas fa-right-from-bracket"></i> Log Out</a>
        {/if}
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