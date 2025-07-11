<script>
  import { createEventDispatcher, onMount } from 'svelte';
  const dispatch = createEventDispatcher();

  let inputEl;
  let isTranscribing = false;
  let recognition;
  let transcriptText = '';
  let isMobile = false;
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
    }, 300); // beri jeda agar keyboard muncul dulu
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
    width:100%;
    margin: 0 auto;
    display: flex;
    align-items: flex-end;
    gap: 0.5rem;
    background-color: white;
    border: 1px solid #444;
    border-radius: 1rem;
    padding: 0.5rem 0.75rem;
  }

  textarea {
    flex: 1;
    background: transparent;
    color:black;
    border: none;
    outline: none;
    font-size: 1rem;
    resize: none;
    overflow-y: auto;
    font-family: inherit;
    min-height: 1.5rem;
    height: 12px;
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
    width: 30px;
  }

  button:hover {
    color: #be8f02;
  }
</style>

<div class="chat-bar">
  <div class="chat-inner">
    <textarea
      bind:this={inputEl}
      rows="1"
      placeholder="Ask anything..."
      on:input={autoResize}
      on:focus={onFocusScroll}
      on:keydown={handleKeyDown}
    ></textarea>

    <button title={isTranscribing ? "Stop Voice" : "Start Voice"} on:click={startVoiceInput}>
      <i class={isTranscribing ? "fas fa-stop" : "fas fa-microphone"}></i>
    </button>

    <button title="Send" on:click={submitChat}>
      <i class="fas fa-paper-plane"></i>
    </button>
  </div>
</div>