<style>
  .chat-page {
    flex: 1;
    display: flex;
    flex-direction: column;
    width: calc(90vw - 300px); /*  sidebar 300px */
    max-width: 100%;
    color: white;
    margin: 0 auto;
  }

  .chat-messages {
    flex: 1;
    padding: 1rem;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    width: 100%;
  }

  .message {
    padding: 0.75rem 1rem;
    border-radius: 12px;
    max-width: 100%;
  }

  .message.user {
    align-self: flex-end;
    background-color: #0084ff;
    color: white;
    text-align: left;
    margin-right:-15px;
  }

  .message.bot {
    align-self: flex-start;
    background-color: #2d2d2d;
    color: #ddd;
    text-align: left;
    width:99%;
    box-sizing: border-box;
    word-break: break-word;
    overflow-wrap: anywhere;
    margin-left:-15px;
  }

  .message.bot p,
  .message.bot div {
    margin: 0;
    padding: 0;
  }

  .message.bot strong,
  .message.bot em {
    color: #BE8F02;
  }

  :global(.scrollable-code) {
    width: calc(90vw-300px);
    overflow-x: auto;
  }

  @media(max-width: 768px) {
    :global(.scrollable-code) {
      width: 70vw;
    }
    .chat-page {
      width: 80vw;
      margin-left:-20px;
    }
    .chat-messages {
      width:80vw;  
    }
  }

  :global(pre) {
    background: #1e1e1e;
    padding: 10px;
    border-radius: 8px;
    overflow-x: auto;
    white-space: pre;
  }

  :global(code) {
    font-family: monospace;
    white-space: pre;
  }

  table {
    border-collapse: collapse;
    width: 100%;
    margin-top: 0.5rem;
  }

  table, th, td {
    border: 1px solid #999;
  }

  th, td {
    padding: 8px;
    text-align: left;
  }

  th {
    background-color: #333;
    color: #fff;
  }

  
</style>

<script>
  import Chatinput from '../component/Chat-input.svelte';
  import { getChatWeb } from '../lib/api.js';
  import { afterUpdate } from 'svelte';

  import { marked } from 'marked';
  import hljs from 'highlight.js';
  import 'highlight.js/styles/github-dark.css';

  let messages = [
    { role: 'bot', text: `Hai, Saya Yesvara, AI Agent yang diciptakan oleh Yogiswara. Ada yang bisa saya bantu?` }
  ];
  let proses = "";
  let credential = "";
  let nama = "";
  let bottomRef;
  let isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

  marked.setOptions({
    highlight: function (code, lang) {
      return hljs.highlightAuto(code, [lang]).value;
    }
  });

  if (localStorage.getItem('email')) {
    credential = localStorage.getItem('email');
    nama = localStorage.getItem('nama');
    ambilChat();
  } else {
    fetch('https://ipinfo.io/json')
      .then(response => response.json())
      .then(data => {
        credential = data.ip;
        nama = "web-guest";
        ambilChat();
      });
  }

  afterUpdate(() => {
    bottomRef?.scrollIntoView({ behavior: 'smooth' });
  });

  function handleSend(message) {
    if (!message) return;
    proses = "typing..";
    submitToN8n(message);
    messages = [...messages, { role: 'user', text: message }];
  }

  async function ambilChat() {
    const res = await getChatWeb(credential);
    if (res) {
      res.forEach(item => {
        if (item.message) messages = [...messages, { role: 'user', text: item.message }];
        if (item.answer) messages = [...messages, { role: 'bot', text: item.answer }];
      });
    }
  }

  async function submitToN8n(message) {
    const res = await fetch('https://n8n.yesvara.com/webhook/b1fb10c2-a566-4266-93f8-b62710af7fbb', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'auth': `${import.meta.env.VITE_YESVARA_AUTH}`
      },
      body: JSON.stringify({ message, credential, nama })
    });

    if (res) {
      const data = await res.json();
      messages = [...messages, { role: 'bot', text: `${data[0].output}` }];
    } else {
      messages = [...messages, { role: 'bot', text: `maaf, boleh dijelaskan lagi?` }];
    }
    proses = "";
  }

  function renderFormattedMessage(text) {
    if (text.includes('<table')) return text;

    if (/```(\w+)?\n([\s\S]*?)```/gm.test(text)) {
      text = text.replace(/```(\w+)?\n([\s\S]*?)```/gm, (match, lang, code) => {
        const highlighted = hljs.highlightAuto(code, [lang]).value;
        return `<div class="scrollable-code" ><pre ><code class="hljs language-${lang}" >${highlighted}</code></pre></div>`;
      });
      return text;
    }

    return marked(text);
  }
</script>



<div class="chat-wrapper">
  <div class="chat-page">
    <div class="chat-messages">
      {#each messages as msg}
        <div class="message {msg.role}">
          {@html renderFormattedMessage(msg.text)}
        </div>
      {/each}
      {#if proses}
        <i style="text-align:left;margin-bottom: 30px">{proses}</i>
      {/if}
      <div bind:this={bottomRef}></div>
    </div>

    <div class="chat-input-wrapper">
      <Chatinput on:send={(e) => handleSend(e.detail)} />
    </div>
  </div>
</div>