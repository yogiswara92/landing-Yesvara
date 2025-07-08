<script>
    import Chatinput from '../component/Chat-input.svelte';
    import { getChatWeb } from '../lib/api.js';
    import { afterUpdate } from 'svelte';

    let messages = [{ role: 'bot', text: `Hai, Saya Yesvara, AI Agent yang diciptakan oleh Yogiswara. Ada yang bisa saya bantu?` }];
    let proses = "";
    let credential="";
    let bottomRef;
    let isMobile = false;
    isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

    fetch('https://ipinfo.io/json') // bisa juga tanpa token
    .then(response => response.json())
    .then(data => {
        credential=data.ip;
        ambilChat();
    });
    
  // Scroll ke anchor div setiap ada update (pesan baru)
  afterUpdate(() => {
    bottomRef?.scrollIntoView({ behavior: 'smooth' });
  });
  

  function handleSend(message) {
    if (!message) return;
    proses="typing..";

    submitToN8n(message);

    // Tambah pesan user
    messages = [...messages, { role: 'user', text: message }];
    

  }

  async function ambilChat() {

    const res = await getChatWeb(credential);

    if (res) {
      const data = res;
      //console.log(data);
      //messages = [...messages, { role: 'bot', text: `${data[0].answer}` }];
      data.forEach(item => {
            if (item.message) {
                //messages.push({ role: 'user', text: item.message });
                messages = [...messages, { role: 'user', text: item.message }];
            }
            if (item.answer) {
                //messages.push({ role: 'bot', text: item.answer });
                messages = [...messages, { role: 'bot', text: item.answer }];
            }
            });
        } 
    //console.log(messages);
  }

  async function submitToN8n(message) {

    const res = await fetch('https://n8n.yesvara.com/webhook/b1fb10c2-a566-4266-93f8-b62710af7fbb', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json',
      'auth':`${import.meta.env.VITE_YESVARA_AUTH}` },
      body: JSON.stringify({
        message,
        credential
      })
    });

    if (res) {
      const data = await res.json();
      //console.log(data);
      messages = [...messages, { role: 'bot', text: `${data[0].output}` }];
      proses="";
    } else {
      messages = [...messages, { role: 'bot', text: `maaf, boleh dijelaskan lagi?` }];
    }
    
  }
</script>

<style>
  .chat-page {
    flex: 1;
    display: flex;
    flex-direction: column;
   width:100%;
   max-width: 600px;
    color: white;
    margin-left:0vw;
     margin: 0 auto;
     padding-bottom: 65px;
  }

  .chat-messages {
    flex: 1;
    flex-grow: 1;
    padding: 1rem;
    overflow-y: auto;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 1rem;
   width:100%;
   margin-left:-15px;
  }

  .message {
    padding: 0.75rem 1rem;
    border-radius: 12px;
    white-space: pre-wrap;
    word-break: break-word;
    
  }

  .message.user {
    align-self: flex-end;
    background-color: #0084ff;
    color: white;
    text-align:left;
    margin-right:-10px;
  }

  .message.bot {
    align-self: flex-start;
    background-color: #2d2d2d;
    color: #ddd;
    text-align:left;
    margin-left:-10px;
  }

  .message.bot p {
  margin: 0;

}

.message.bot div {
  margin: 0;
  padding: 0;
}

.message.bot strong,
.message.bot em {
  color: #BE8F02;
}
</style>

<div class="container" style="">
    <div class="chat-page">
    <div class="chat-messages">
        {#each messages as msg}
        <div class="message {msg.role}">
            {@html msg.text}
        </div>
        {/each}
    </div>
    {#if proses}
        <i style="text-align:left;margin-bottom: 30px">{proses}</i>
    {/if}
    <div bind:this={bottomRef}></div>
</div>
  <!-- Komponen input chat -->
  <Chatinput on:send={(e) => handleSend(e.detail)} />
</div>