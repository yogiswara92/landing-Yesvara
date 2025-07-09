
<script>
  const client_id = '516678484337-j8mhv39t4h8ehfcseees5dupgcsro2qc.apps.googleusercontent.com';
  const redirect_uri = 'https://yesvara.com';
  //const redirect_uri = 'https://stackblitz.com/~/github.com/yogiswara92/landing-yesvara';

  const loginWithGoogle = () => {
    const scope = 'profile email';
    const url = `https://accounts.google.com/o/oauth2/v2/auth?response_type=token&client_id=${client_id}&redirect_uri=${redirect_uri}&scope=${scope}`;
    window.location.href = url;
  };
</script>

<style>
  .google-btn {
    display: flex;
    align-items: center;
    background-color: white;
    border: 1px solid #ddd;
    padding: 10px 16px;
    padding-left:25px;
    border-radius: 6px;
    cursor: pointer;
    font-size: 14px;
    gap: 10px;
    transition: box-shadow 0.2s ease;
    width: 200px;
  }

  .google-btn:hover {
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  }

  .google-icon {
    width: 20px;
    height: 20px;
  }
</style>

<button class="google-btn" on:click={loginWithGoogle}>
  <svg class="google-icon" viewBox="0 0 48 48">
    <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9 3.2l6.6-6.6C35.6 2.2 30.2 0 24 0 14.6 0 6.5 5.6 2.8 13.7l7.9 6.1C12.2 13.2 17.7 9.5 24 9.5z"/>
    <path fill="#4285F4" d="M46.5 24.5c0-1.6-.2-3.2-.5-4.7H24v9h12.7c-.6 3.2-2.5 6-5.2 7.8l8 6.1c4.7-4.3 7.5-10.6 7.5-17.2z"/>
    <path fill="#FBBC05" d="M10.7 28.5c-.5-1.5-.7-3.1-.7-4.5s.2-3 .7-4.5l-7.9-6.1C1.2 16.4 0 20.1 0 24s1.2 7.6 2.8 10.6l7.9-6.1z"/>
    <path fill="#34A853" d="M24 48c6.2 0 11.5-2 15.3-5.4l-8-6.1c-2.3 1.6-5.2 2.5-8.3 2.5-6.3 0-11.8-3.7-14.2-9l-7.9 6.1C6.5 42.4 14.6 48 24 48z"/>
    <path fill="none" d="M0 0h48v48H0z"/>
  </svg>
  <span style="color:black">Login with Google</span>
</button>