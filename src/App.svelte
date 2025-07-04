<script>
  import Router from 'svelte-spa-router';
  import Home from './routes/Home.svelte';
  import Branding from './routes/Branding.svelte';
  import Interview from './routes/Interview.svelte';
const routes = {
    '/': Home,
    '/branding': Branding,
    '/interview' : Interview
  };
</script>

 <Router {routes} />