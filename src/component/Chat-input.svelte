<script>
  import { createEventDispatcher, onMount } from 'svelte';
  const dispatch = createEventDispatcher();

  let inputEl;
  let isTranscribing = false;
  let recognition;
  let transcriptText = '';
  let isMobile = false;
  let showConfigMenu = false;
  let selectedConfig = 'Yes Lite';

  isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

  function autoResize() {
    inputEl.style.height = 'auto';
    inputEl.style.height = inputEl.scrollHeight + 'px';
  }

  function submitChat() {
    const message = inputEl.value.trim();
    if (message) {
      dispatch('send', message);
      inputEl.value = '';
      autoResize();
    }
  }

  function handleKeyDown(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
      if (!isMobile) {
        event.preventDefault(); // cegah newline
        submitChat();
      }
    }
  }

  function onFocusScroll() {
    setTimeout(() => {
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    }, 300);
  }

  function startVoiceInput() {
    if (!recognition) return;

    if (!isTranscribing) {
      recognition.start();
      isTranscribing = true;
    } else {
      recognition.stop();
      isTranscribing = false;
    }
  }

  function selectLLMConfig(config) {
    selectedConfig = config;
    showConfigMenu = false;
    dispatch('configChange', config)
    //console.log(config);
  }

  onMount(() => {
    if (SpeechRecognition) {
      recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'id-ID';

      recognition.onresult = (event) => {
        const result = Array.from(event.results)
          .map(res => res[0].transcript)
          .join('');
        transcriptText = result;
        inputEl.value = transcriptText;
        autoResize();
      };

      recognition.onerror = e => {
        console.error('Recognition error:', e);
        isTranscribing = false;
      };

      recognition.onend = () => {
        isTranscribing = false;
      };
    }
  });
</script>

<style>
  .chat-bar {
    width: 100%;
    padding: 0.4rem;
    display: flex;
    justify-content: center;
    background: transparent;
  }

  .chat-inner {
    width: 100%;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    background-color: white;
    border: 1px solid #444;
    border-radius: 1rem;
    padding: 0.5rem 0.75rem;
    gap: 0.4rem;
  }

  textarea {
    flex: 1 1 100%;
    background: transparent;
    color: black;
    border: none;
    outline: none;
    font-size: 16px;
    resize: none;
    overflow-y: auto;
    font-family: inherit;
    min-height: 1.5rem;
    height: 16px;
    width:93%;
  }

  .action-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .config-section {
    display: flex;
    align-items: center;
    position: relative;
  }

  .config-button {
    font-size: 0.75rem;
    font-weight: bold;
    border-radius: 0.5rem;
    border: 1px solid #aaa;
    padding: 0.3rem 0.6rem;
    background: #eee;
    color: #333;
    cursor: pointer;
  }

  .config-menu {
    position: absolute;
    top: -120px;
    left:-50px;
    background: #fff;
    border: 1px solid #aaa;
    border-radius: 0.5rem;
    z-index: 99;
    padding: 0.3rem 0;
    display: flex;
    flex-direction: column;
    box-shadow: 0 2px 5px rgba(0,0,0,0.2);
    width:130px;
    height: 110px;
  }

  .config-menu button {
    padding: 0.4rem 1rem;
    font-size: 0.9rem;
    background: white;
    color: #01212e;
    border: none;
    text-align: left;
    width: 100%;
  }

  .config-menu button:hover {
    background: #f0f0f0;
  }

  .button-group {
    display: flex;
    width:100px;
  }

  button {
    background: none;
    border: none;
    color: #01212e;
    font-size: 1.2rem;
    cursor: pointer;
    padding: 0.4rem;
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 30px;
  }

  button:hover {
    color: #be8f02;
  }

  .config-section {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-top: 0.3rem;
  }

  .config-button {
    font-size: 0.9rem;
    font-weight: bold;
    border-radius: 0.5rem;
    border: 1px solid #aaa;
    padding: 0.2rem 0.6rem;
    background: white;
    color: #01212e;
    cursor: pointer;
    width:120px;
  }

  .config-menu {
    position: absolute;
    bottom: 50px;
    left: 10px;
    background: #fff;
    border: 1px solid #aaa;
    border-radius: 0.5rem;
    z-index: 99;
    padding: 0.3rem 0;
    display: flex;
    flex-direction: column;
    box-shadow: 0 2px 5px rgba(0,0,0,0.2);
  }

  .config-menu button {
    padding: 0.4rem 1rem;
    font-size: 0.9rem;
    background: white;
    color: #01212e;
    border: none;
    text-align: left;
    width: 100%;
  }

  .config-menu button:hover {
    background: #f0f0f0;
  }

  .config-menu button:disabled,
  .config-menu .disabled-option {
    color: #999;
    cursor: not-allowed;
    background: #f9f9f9;
  }
</style>

<div class="chat-bar">
  <div class="chat-inner">
    <!-- Textarea input -->
    <textarea
      bind:this={inputEl}
      rows="1"
      placeholder="Ask anything..."
      on:input={autoResize}
      on:focus={onFocusScroll}
      on:keydown={handleKeyDown}
    ></textarea>

    <!-- Baris kedua: konfigurasi + tombol -->
    <div class="action-row">
      <div class="config-section">
        <button class="config-button" on:click={() => showConfigMenu = !showConfigMenu}>
          {selectedConfig}
        </button>
        {#if showConfigMenu}
          <div class="config-menu">
            <button on:click={() => selectLLMConfig('Yes Lite')}>Yes Lite</button>
            <button on:click={() => selectLLMConfig('Yes Basic')}>Yes Basic</button>
            <button on:click={() => selectLLMConfig('Yes Advanced')}>Yes Advanced</button>
            <button on:click={() => selectLLMConfig('Deep Research')}>Deep Research</button>
            <!--<button disabled class="disabled-option">Deep Research</button>-->
          </div>
        {/if}
      </div>

      <div class="button-group">
        <button title={isTranscribing ? "Stop Voice" : "Start Voice"} on:click={startVoiceInput}>
          <i class={isTranscribing ? "fas fa-stop" : "fas fa-microphone"}></i>
        </button>

        <button title="Send" on:click={submitChat}>
          <i class="fas fa-paper-plane"></i>
        </button>
      </div>
    </div>
  </div>
</div>