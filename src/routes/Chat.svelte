<script>
  // @ts-nocheck
  import Chatinput from '../component/Chat-input.svelte';
  import { getChatWeb } from '../lib/api.js';
  import { tick, onMount,afterUpdate } from 'svelte';
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
  let clickedMessageIndex = null;
  let isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
  let LLM = "yes-lite";

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

  onMount(() => {
    if (performance.navigation.type === 1) {
      // 1 = reload
      localStorage.removeItem("chatMessages");
      ambilChat();
    }
  });

  afterUpdate(() => {
    //bottomRef?.scrollIntoView({ behavior: 'smooth' });
  });

  async function handleSend(message) {
    if (!message) return;
    //console.log(messages.slice(-20));
    proses = "typing..";
    messages = [...messages, { role: 'user', text: message }];
    await tick();
    bottomRef?.scrollIntoView({ behavior: 'smooth' });
    submitToN8n(message);
    
  }

  function handleConfigChange(config) {
    
    if(config=="Yes Lite"){
      LLM="yes-lite";
    }else if(config=="Yes Basic"){
      LLM="yes-basic";
    }else if(config=="Yes Advanced"){
      LLM="yes-advanced";
    }else if(config=="Deep Research"){
      LLM="deep-research";
    }
    
  }

  async function ambilChat() {
    messages = [
      { role: 'bot', text: `Hai, Saya Yesvara, AI Agent yang diciptakan oleh Yogiswara. Ada yang bisa saya bantu?` }
    ];
    if (localStorage.getItem("chatMessages")) {
      messages = JSON.parse(localStorage.getItem("chatMessages"));
    } else {
      const res = await getChatWeb(credential);
      if (res) {
        res.forEach(item => {
          if (item.message) messages = [...messages, { role: 'user', text: item.message }];
          if (item.answer) messages = [...messages, { role: 'bot', text: item.answer }];
        });
        localStorage.setItem("chatMessages", JSON.stringify(messages));
      }
    }
  }

  async function submitToN8n(message) {
    const res = await fetch('https://n8n.yesvara.com/webhook/b1fb10c2-a566-4266-93f8-b62710af7fbb', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'auth': `${import.meta.env.VITE_YESVARA_AUTH}`
      },
      body: JSON.stringify({ message, credential, nama, LLM, prev_message: messages.slice(-20) })
    });

    if (res) {
      const data = await res.json();
      messages = [...messages, { role: 'bot', text: `${data[0].output}` }];

      await tick();
      bottomRef?.scrollIntoView({ behavior: 'smooth' });
    } else {
      messages = [...messages, { role: 'bot', text: `maaf, boleh dijelaskan lagi?` }];
    }
    proses = "";
    localStorage.setItem("chatMessages", JSON.stringify(messages));
  }

  function renderFormattedMessage(text) {
    if (text.includes('<table')) return text;

    if (/```(\w+)?\n([\s\S]*?)```/gm.test(text)) {
      text = text.replace(/```(\w+)?\n([\s\S]*?)```/gm, (match, lang, code) => {
        const highlighted = hljs.highlightAuto(code, [lang]).value;
        return `<div class="scrollable-code"><pre><code class="hljs language-${lang}">${highlighted}</code></pre></div>`;
      });
      return text;
    }

    return marked(text);
  }

  function toggleMenu(index) {
    if (!isMobile) return;
    clickedMessageIndex = clickedMessageIndex === index ? null : index;
  }

  function deleteMessage(index) {
    messages.splice(index, 2);
    messages = [...messages];
    localStorage.setItem("chatMessages", JSON.stringify(messages));
  }

  function copyMessage(text) {
    navigator.clipboard.writeText(text);
    alert("Teks disalin!");
  }
</script>

<style>
  .chat-page {
    width: 100%;
    color: white;
    margin: 0 auto;
    padding-top: 60px;
  }

  .chat-messages {
    flex: 1;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    width: 100%;
  }

  .message {
    position: relative;
    padding: 0.75rem 1rem;
    border-radius: 12px;
  }

  .message.user {
    align-self: flex-end;
    background-color: #BE8F0260;
    color: white;
    text-align: left;
    margin-left: 15px;
  }

  .message.bot {
    align-self: flex-start;
    color: #ddd;
    text-align: left;
    box-sizing: border-box;
    word-break: break-word;
    overflow-wrap: anywhere;
    border-bottom: 1px solid #ffffff20;
    border-radius: 0px;
  }

  .user-menu {
    display: none;
    position: absolute;
    bottom: -20px;
    right: 0px;
    /*background: #33333390;
    border: 1px solid #555;*/
    border-radius: 6px;
    z-index: 99;
    gap: 1px;
  }

  .message.user:hover .user-menu,
  .user-menu.show {
    display: flex;
    
  }

  .user-menu button {
    background: transparent;
    color: white;
    border: none;
    cursor: pointer;
    font-size: 12px;
    align-items: center;
    width:70px;
    padding:3px;
    text-align:right;
  }

  :global(.scrollable-code) {
    width: calc(99vw - 300px);
    overflow-x: auto;
  }

  @media(max-width: 768px) {
    :global(.scrollable-code) {
      width: 90vw;
    }
    .chat-page {
      width: 100%;
    }
    .chat-messages {
      width: 100%;
    }
  }

  :global(pre) {
    background: #1e1e1e;
    padding: 10px;
    border-radius: 8px;
    overflow-x: auto;
    white-space: pre;
    font-size: 12px;
    line-height: 1;
  }

  :global(code) {
    font-family: monospace;
    white-space: pre;
  }

  :global(table, th, td) {
    border: 1px solid #99999950;
    font-size: 12px;
    line-height: 1;
    padding: 8px;
  }

  :global(th) {
    background-color: #01212e98;
    color: #fff;
  }
</style>

<div class="chat-wrapper">
  <div class="chat-page">
    <div class="chat-messages">
      {#each messages as msg, index}
        <div
          class="message {msg.role}"
          on:click={() => msg.role === 'user' && toggleMenu(index)}
        >
          {@html renderFormattedMessage(msg.text)}

          {#if msg.role === 'user'}
            <div class="user-menu {isMobile && clickedMessageIndex === index ? 'show' : ''}">
              <button on:click|stopPropagation={() => copyMessage(msg.text)}>📋 Copy</button>
              <button on:click|stopPropagation={() => deleteMessage(index)}>🗑️ Delete</button>
            </div>
          {/if}
        </div>
      {/each}

      {#if proses}
        <i style="text-align:left;margin-bottom: 30px; margin-left:20px">{proses}</i>
      {/if}

      <div bind:this={bottomRef}></div>
    </div>

    <div class="chat-input-wrapper">
      <Chatinput 
        on:send={(e) => handleSend(e.detail)} 
        on:configChange={(e) => handleConfigChange(e.detail)} 
      />
    </div>
  </div>
</div>