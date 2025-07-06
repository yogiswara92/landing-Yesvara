<script>
  import Router from 'svelte-spa-router';
  import Home from './routes/Home.svelte';
  import Branding from './routes/Branding.svelte';
  import Interview from './routes/Interview.svelte';
  import News from './routes/News.svelte';
  import Research from './routes/Research.svelte';
  import Chat from './routes/Chat.svelte';
const routes = {
    '/': Home,
    '/branding': Branding,
    '/interview' : Interview,
    '/news' : News,
    '/research' : Research,
    '/chat' : Chat
  };
</script>
<div class="header-fixed">
  <a href="#/" ><img src="/logo.png" alt="Logo" class="logo" /></a>
</div>
 <Router {routes} />