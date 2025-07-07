<script>
    import Chatinput from '../component/Chat-input.svelte';
    import { afterUpdate } from 'svelte';

    let messages = [{ role: 'bot', text: `Hai, Saya Yesvara, AI Agent yang diciptakan oleh Yogiswara. Ada yang bisa saya bantu?` }];
    let proses = "";
    let credential="";
    let bottomRef;
    

    fetch('https://ipinfo.io/json') // bisa juga tanpa token
    .then(response => response.json())
    .then(data => {
        credential=data.ip;
        getchat();
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

  async function getchat() {

    const res = await fetch('https://n8n.yesvara.com/webhook/get-chat-web', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        credential
      })
    });

    if (res) {
      const data = await res.json();
      console.log(data);
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
      headers: { 'Content-Type': 'application/json' },
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
    display: flex;
    flex-direction: column;
   width:90vw;
   max-width: 600px;
    color: white;
  }

  .chat-messages {
    flex: 1;
    padding: 1rem;
    overflow-y: auto;
    max-width: 1700px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .message {
    padding: 0.75rem 1rem;
    border-radius: 12px;
    white-space: pre-wrap;
  }

  .message.user {
    align-self: flex-end;
    background-color: #0084ff;
    color: white;
    text-align:left;
  }

  .message.bot {
    align-self: flex-start;
    background-color: #2d2d2d;
    color: #ddd;
    text-align:left;
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

<div class="container" style="margin-bottom:55px">
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