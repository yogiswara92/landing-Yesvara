<script>
  import Router from 'svelte-spa-router';
  import Home from './routes/Home.svelte';
  import Branding from './routes/Branding.svelte';
  import Interview from './routes/Interview.svelte';
  import News from './routes/News.svelte';
  import Research from './routes/Research.svelte';
const routes = {
    '/': Home,
    '/branding': Branding,
    '/interview' : Interview,
    '/news' : News,
    '/research' : Research
  };
</script>

 <Router {routes} />