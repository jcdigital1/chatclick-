/**
 * ============================================================================
 * CLICKBAGE 360° - BIOSITE CONVERSACIONAL PREMIUM
 * Atendimento digital interativo com fila assíncrona, digitação humana,
 * scroll estável, proteção de viewport e encaminhamento oficial para WhatsApp.
 * Vanilla JavaScript puro - Sem frameworks ou dependências externas
 * ============================================================================
 */

(function () {
  'use strict';

  // Configurações Oficiais
  const CONFIG = {
    empresa: 'CLICKBAGE 360°',
    avatarUrl: 'https://i.postimg.cc/PfKNPLML/F2F0E96E-03E1-480B-9B55-9B4B1DCB00E9.png',
    whatsappNumero: '5553999132255',
    whatsappLinkOriginal: 'https://wa.link/h7lv8m'
  };

  // Estado do Lead
  const lead = {
    nome: '',
    servico: '',
    evento: '',
    data: '',
    cidade: '',
    convidados: '',
    observacao: ''
  };

  // Controle de Fluxo e Concorrência
  let currentStep = 0;
  let isProcessing = false;
  let flowVersion = 0;
  let soundEnabled = false;
  let audioCtx = null;

  // Elementos do DOM
  let chatMessages;
  let chatActions;
  let progressFill;
  let btnBack;
  let btnSound;
  let btnRestart;

  // Ícones SVG Inline profissionais
  const ICONS = {
    camera: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/></svg>`,
    totem: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="2" width="14" height="20" rx="3"/><circle cx="12" cy="7" r="2"/><rect x="8" y="12" width="8" height="6" rx="1"/></svg>`,
    party: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m2 22 1-1.5a8.7 8.7 0 0 0 2.5-5.5L7 3l4.5 4.5L13 6l2 2-1.5 1.5L18 14l-4 4-2-2-4 4Z"/><path d="m14 10 3-3"/><path d="m18 14 3-3"/><path d="m11 17 3-3"/></svg>`,
    sparkles: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3Z"/></svg>`,
    ring: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="14" r="7"/><path d="M12 7V3"/><path d="M9 4.5 12 3l3 1.5"/></svg>`,
    cake: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-8a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8"/><path d="M4 16s.5-1 2-1 2.5 2 4 2 2.5-2 4-2 2.5 2 4 2 2-1 2-1"/><path d="M2 21h20"/><path d="M7 8v2"/><path d="M12 8v2"/><path d="M17 8v2"/><path d="M7 4h.01"/><path d="M12 4h.01"/><path d="M17 4h.01"/></svg>`,
    gradCap: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>`,
    building: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="2" width="16" height="20" rx="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01"/><path d="M16 6h.01"/><path d="M12 6h.01"/><path d="M12 10h.01"/><path d="M12 14h.01"/><path d="M16 10h.01"/><path d="M16 14h.01"/><path d="M8 10h.01"/><path d="M8 14h.01"/></svg>`,
    calendar: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>`,
    calendarCheck: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/><path d="m9 16 2 2 4-4"/></svg>`,
    question: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`,
    mapPin: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>`,
    users: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
    message: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>`,
    arrowRight: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>`,
    check: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`,
    whatsapp: `<svg viewBox="0 0 24 24" width="26" height="26" fill="currentColor"><path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2zm0 18.15c-1.52 0-3-.4-4.31-1.18l-.31-.18-3.19.84.85-3.11-.2-.32a8.17 8.17 0 0 1-1.26-4.3c0-4.52 3.68-8.2 8.2-8.2 2.19 0 4.25.85 5.8 2.4 1.55 1.55 2.4 3.61 2.4 5.8 0 4.52-3.68 8.19-8.19 8.19zm4.49-6.13c-.25-.12-1.46-.72-1.69-.8-.22-.08-.39-.12-.55.12-.17.25-.64.8-.78.97-.15.17-.29.19-.54.06-.25-.12-1.04-.38-1.98-1.22-.73-.65-1.23-1.46-1.37-1.71-.15-.25-.02-.38.11-.5.11-.11.25-.29.37-.43.12-.15.17-.25.25-.42.08-.17.04-.31-.02-.43s-.55-1.33-.76-1.82c-.2-.48-.41-.41-.56-.42h-.48c-.17 0-.44.06-.67.31-.23.25-.87.85-.87 2.08 0 1.22.89 2.41 1.02 2.57.12.17 1.76 2.68 4.26 3.76.6.26 1.06.41 1.42.53.6.19 1.15.16 1.58.1.48-.07 1.46-.6 1.67-1.18.21-.57.21-1.07.15-1.18-.06-.11-.23-.17-.48-.3z"/></svg>`
  };

  // Inicialização segura compatível com iframes e carregamento diferido
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    // DOM já está pronto
    init();
  }

  function init() {
    chatMessages = document.getElementById('chatMessages') || document.getElementById('chat-body');
    chatActions = document.getElementById('chatActions');
    progressFill = document.getElementById('progress-fill');
    btnBack = document.getElementById('btn-back');
    btnSound = document.getElementById('btn-sound');
    btnRestart = document.getElementById('btn-restart');

    if (btnBack) btnBack.addEventListener('click', handleGoBack);
    if (btnRestart) btnRestart.addEventListener('click', handleRestart);
    if (btnSound) btnSound.addEventListener('click', toggleSound);

    // Monitoramento do Visual Viewport (Virtual Keyboard / Resize no Mobile)
    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', handleViewportChange);
      window.visualViewport.addEventListener('scroll', handleViewportChange);
    }
    window.addEventListener('orientationchange', () => {
      setTimeout(() => {
        scrollChatToBottom('auto');
      }, 200);
    });

    // Iniciar a conversa progressiva
    startConversation();
  }

  function handleViewportChange() {
    scrollChatToBottom('auto');
  }

  // ============================================================================
  // HELPERS DE RENDERIZAÇÃO, DELAYS E SCROLL AUTOMÁTICO ESTÁVEL
  // ============================================================================

  function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  function afterRender(callback) {
    requestAnimationFrame(() => {
      requestAnimationFrame(callback);
    });
  }

  // Tempo de digitação realista calibrado ao tamanho do texto
  function calcularTempoDigitacao(text) {
    const clean = (text || '').replace(/<[^>]*>/g, '');
    return Math.min(1100, Math.max(380, clean.length * 16));
  }

  // Scroll interno dentro do container de mensagens #chatMessages
  function scrollChatToBottom(behavior = 'smooth') {
    if (!chatMessages) return;
    afterRender(() => {
      chatMessages.scrollTo({
        top: chatMessages.scrollHeight,
        behavior: behavior
      });
    });
  }

  // Efeito sonoro suave luxury (Web Audio API nativo)
  function playLuxuryChime() {
    if (!soundEnabled) return;
    try {
      if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      }
      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, audioCtx.currentTime); // A5
      osc.frequency.exponentialRampToValueAtTime(1320, audioCtx.currentTime + 0.12);
      gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.32);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.33);
    } catch (e) {
      // Ignora silenciosamente se o navegador restringir áudio
    }
  }

  function toggleSound() {
    soundEnabled = !soundEnabled;
    if (btnSound) {
      btnSound.classList.toggle('active', soundEnabled);
      btnSound.setAttribute('aria-pressed', soundEnabled);
    }
    if (soundEnabled) playLuxuryChime();
  }

  // Atualiza barra de progresso dourada
  function updateProgress(step) {
    const stepsTotal = 7;
    const percentages = [8, 22, 38, 54, 70, 84, 94, 100];
    const pct = percentages[Math.min(step, stepsTotal)] || 10;
    if (progressFill) {
      progressFill.style.width = pct + '%';
    }

    if (btnBack) {
      if (step > 0 && step < 7) {
        btnBack.classList.remove('hidden');
      } else {
        btnBack.classList.add('hidden');
      }
    }
  }

  // Limpa a área interativa inferior
  function clearChatActions() {
    if (chatActions) {
      chatActions.innerHTML = '';
    }
  }

  // Mostra indicador de digitação •••
  function showTypingIndicator() {
    if (document.getElementById('typing-indicator')) return;
    const row = document.createElement('div');
    row.id = 'typing-indicator';
    row.className = 'typing-row';
    row.innerHTML = `
      <div class="bot-mini-avatar">
        <img src="${CONFIG.avatarUrl}" alt="${CONFIG.empresa}" />
      </div>
      <div class="typing-bubble" aria-label="Atendimento digitando...">
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
      </div>
    `;
    chatMessages.appendChild(row);
    scrollChatToBottom('smooth');
  }

  // Remove indicador de digitação
  function hideTypingIndicator() {
    const indicator = document.getElementById('typing-indicator');
    if (indicator) indicator.remove();
  }

  // Adiciona balão do Bot ao histórico
  function appendBotMessage(text, stepTag = null) {
    const row = document.createElement('div');
    row.className = 'msg-row-bot';
    if (stepTag !== null) row.setAttribute('data-step', stepTag);
    row.innerHTML = `
      <div class="bot-mini-avatar">
        <img src="${CONFIG.avatarUrl}" alt="${CONFIG.empresa}" />
      </div>
      <div class="bubble-bot">${text}</div>
    `;
    chatMessages.appendChild(row);
    playLuxuryChime();
    scrollChatToBottom('smooth');
  }

  // Adiciona balão do Usuário ao histórico
  function appendUserMessage(text, stepTag = null) {
    const row = document.createElement('div');
    row.className = 'msg-row-user';
    if (stepTag !== null) row.setAttribute('data-step', stepTag);
    row.innerHTML = `<div class="bubble-user">${escapeHtml(text)}</div>`;
    chatMessages.appendChild(row);
    scrollChatToBottom('smooth');
  }

  // Executa uma mensagem do bot com ciclo completo de digitação e scroll
  async function botMessage(text, stepTag, version) {
    if (version !== flowVersion) return false;

    showTypingIndicator();
    const duration = calcularTempoDigitacao(text);
    await wait(duration);

    if (version !== flowVersion) return false;

    hideTypingIndicator();
    appendBotMessage(text, stepTag);
    await wait(60);
    scrollChatToBottom('smooth');

    return true;
  }

  // Fila assíncrona de mensagens em sequência garantindo ordem e pausa natural
  async function runSequence(messages, stepTag, version) {
    for (let i = 0; i < messages.length; i++) {
      if (version !== flowVersion) return false;
      const ok = await botMessage(messages[i], stepTag, version);
      if (!ok) return false;
      if (i < messages.length - 1) {
        await wait(220);
      }
    }
    return true;
  }

  // Garante que o input mobile permaneça perfeitamente centralizado ao abrir o teclado
  function setupInputFocus(input) {
    if (!input) return;
    input.addEventListener('focus', () => {
      setTimeout(() => {
        input.scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        });
      }, 300);
    });
  }

  // ============================================================================
  // ETAPAS DA CONVERSA
  // ============================================================================

  // ETAPA 0: Boas-vindas e Pergunta do Nome
  async function startConversation() {
    const version = ++flowVersion;
    isProcessing = true;
    currentStep = 0;
    updateProgress(0);
    if (!chatMessages) {
      chatMessages = document.getElementById('chatMessages') || document.getElementById('chat-body');
    }
    if (!chatActions) {
      chatActions = document.getElementById('chatActions');
    }
    if (chatMessages) chatMessages.innerHTML = '';
    clearChatActions();

    const welcomeSequence = [
      'Olá! 👋',
      'Que bom ter você por aqui.',
      'Vamos encontrar a experiência ideal para o seu evento?',
      'Primeiro, como podemos te chamar?'
    ];

    const completed = await runSequence(welcomeSequence, 0, version);
    if (!completed || version !== flowVersion) return;

    renderNameInput();
    isProcessing = false;
  }

  function renderNameInput() {
    clearChatActions();
    const container = document.createElement('div');
    container.className = 'interaction-area';
    container.innerHTML = `
      <div class="input-row-box">
        <div class="input-field-wrap">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          <input
            id="input-name"
            class="chat-input"
            type="text"
            placeholder="Digite seu nome..."
            autocomplete="given-name"
            aria-label="Seu nome"
            value="${escapeHtml(lead.nome)}"
          />
        </div>
        <button id="btn-submit-name" class="btn-gold-action" type="button">
          CONTINUAR ${ICONS.arrowRight}
        </button>
      </div>
    `;
    chatActions.appendChild(container);
    scrollChatToBottom('smooth');

    const input = document.getElementById('input-name');
    const btn = document.getElementById('btn-submit-name');

    if (input) {
      setupInputFocus(input);
      input.focus();
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          submitName();
        }
      });
    }

    if (btn) {
      btn.addEventListener('click', submitName);
    }

    function submitName() {
      if (isProcessing) return;
      const val = input.value.trim();
      if (!val) {
        input.focus();
        input.parentElement.style.borderColor = '#FFD76A';
        return;
      }
      isProcessing = true;
      lead.nome = val;
      clearChatActions();
      appendUserMessage(lead.nome, 0);

      // Transição natural para a próxima etapa
      setTimeout(() => {
        step1Services();
      }, 200);
    }
  }

  // ETAPA 1: Serviços
  async function step1Services() {
    const version = ++flowVersion;
    isProcessing = true;
    currentStep = 1;
    updateProgress(1);

    const messages = [
      `Prazer, <strong>${escapeHtml(lead.nome)}</strong>! ✨`,
      'Me conta: o que você está procurando para o seu evento?'
    ];

    const completed = await runSequence(messages, 1, version);
    if (!completed || version !== flowVersion) return;

    renderServiceButtons();
    isProcessing = false;
  }

  function renderServiceButtons() {
    clearChatActions();
    const container = document.createElement('div');
    container.className = 'interaction-area';

    const services = [
      { id: 'Plataforma 360°', label: 'Plataforma 360°', icon: ICONS.camera },
      { id: 'Totem fotográfico', label: 'Totem fotográfico', icon: ICONS.totem },
      { id: 'Locação para evento', label: 'Locação para evento', icon: ICONS.party },
      { id: 'Quero conhecer as opções', label: 'Quero conhecer as opções', icon: ICONS.sparkles }
    ];

    let html = `<div class="quick-options-grid two-cols">`;
    services.forEach(item => {
      const isSelected = lead.servico === item.id ? 'selected' : '';
      html += `
        <button class="btn-quick ${isSelected}" type="button" data-service="${item.id}">
          <div class="btn-quick-icon">${item.icon}</div>
          <div class="btn-quick-text">${item.label}</div>
          <div class="btn-quick-arrow">${ICONS.arrowRight}</div>
        </button>
      `;
    });
    html += `</div>`;

    container.innerHTML = html;
    chatActions.appendChild(container);
    scrollChatToBottom('smooth');

    const buttons = container.querySelectorAll('.btn-quick');
    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        if (isProcessing) return;
        isProcessing = true;

        // Bloqueia cliques concorrentes
        buttons.forEach(b => (b.style.pointerEvents = 'none'));
        btn.classList.add('selected');

        const val = btn.getAttribute('data-service');
        lead.servico = val;

        setTimeout(() => {
          clearChatActions();
          appendUserMessage(lead.servico, 1);
          setTimeout(() => {
            step2EventType();
          }, 200);
        }, 160);
      });
    });
  }

  // ETAPA 2: Tipo de Evento
  async function step2EventType() {
    const version = ++flowVersion;
    isProcessing = true;
    currentStep = 2;
    updateProgress(2);

    const messages = [
      'Perfeito! 😍',
      'E qual será o tipo de evento?'
    ];

    const completed = await runSequence(messages, 2, version);
    if (!completed || version !== flowVersion) return;

    renderEventTypeButtons();
    isProcessing = false;
  }

  function renderEventTypeButtons() {
    clearChatActions();
    const container = document.createElement('div');
    container.className = 'interaction-area';

    const events = [
      { id: 'Casamento', label: 'Casamento', icon: ICONS.ring },
      { id: 'Aniversário', label: 'Aniversário', icon: ICONS.cake },
      { id: 'Formatura', label: 'Formatura', icon: ICONS.gradCap },
      { id: 'Evento empresarial', label: 'Evento empresarial', icon: ICONS.building },
      { id: 'Festa', label: 'Festa', icon: ICONS.party },
      { id: 'Outro evento', label: 'Outro evento', icon: ICONS.sparkles }
    ];

    let html = `<div class="quick-options-grid two-cols">`;
    events.forEach(item => {
      const isSelected = lead.evento === item.id ? 'selected' : '';
      html += `
        <button class="btn-quick ${isSelected}" type="button" data-event="${item.id}">
          <div class="btn-quick-icon">${item.icon}</div>
          <div class="btn-quick-text">${item.label}</div>
          <div class="btn-quick-arrow">${ICONS.arrowRight}</div>
        </button>
      `;
    });
    html += `</div>`;

    container.innerHTML = html;
    chatActions.appendChild(container);
    scrollChatToBottom('smooth');

    const buttons = container.querySelectorAll('.btn-quick');
    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        if (isProcessing) return;
        isProcessing = true;

        buttons.forEach(b => (b.style.pointerEvents = 'none'));
        btn.classList.add('selected');

        const val = btn.getAttribute('data-event');
        lead.evento = val;

        setTimeout(() => {
          clearChatActions();
          appendUserMessage(lead.evento, 2);
          setTimeout(() => {
            step3Date();
          }, 200);
        }, 160);
      });
    });
  }

  // ETAPA 3: Data do Evento
  async function step3Date() {
    const version = ++flowVersion;
    isProcessing = true;
    currentStep = 3;
    updateProgress(3);

    const messages = ['Já sabe a data do evento?'];

    const completed = await runSequence(messages, 3, version);
    if (!completed || version !== flowVersion) return;

    renderDateOptions();
    isProcessing = false;
  }

  function renderDateOptions() {
    clearChatActions();
    const container = document.createElement('div');
    container.className = 'interaction-area';

    container.innerHTML = `
      <div class="quick-options-grid">
        <button id="btn-date-yes" class="btn-quick" type="button">
          <div class="btn-quick-icon">${ICONS.calendarCheck}</div>
          <div class="btn-quick-text">Sim, já tenho a data</div>
          <div class="btn-quick-arrow">${ICONS.arrowRight}</div>
        </button>
        <button id="btn-date-no" class="btn-quick" type="button">
          <div class="btn-quick-icon">${ICONS.question}</div>
          <div class="btn-quick-text">Ainda estou definindo</div>
          <div class="btn-quick-arrow">${ICONS.arrowRight}</div>
        </button>
      </div>
    `;

    chatActions.appendChild(container);
    scrollChatToBottom('smooth');

    const btnYes = document.getElementById('btn-date-yes');
    const btnNo = document.getElementById('btn-date-no');

    btnYes.addEventListener('click', () => {
      if (isProcessing) return;
      renderDatePicker();
    });

    btnNo.addEventListener('click', () => {
      if (isProcessing) return;
      isProcessing = true;
      btnNo.classList.add('selected');
      lead.data = 'A definir';

      setTimeout(() => {
        clearChatActions();
        appendUserMessage('Ainda estou definindo', 3);
        setTimeout(() => {
          step4City();
        }, 200);
      }, 160);
    });
  }

  function renderDatePicker() {
    clearChatActions();
    const container = document.createElement('div');
    container.className = 'interaction-area';

    const today = new Date().toISOString().split('T')[0];

    container.innerHTML = `
      <div class="date-selector-box">
        <div style="font-size: 13.5px; font-weight: 600; color: var(--gold-light); display: flex; align-items: center; gap: 6px;">
          ${ICONS.calendar} Escolha a data prevista:
        </div>
        <input
          id="date-picker-input"
          class="date-input-custom"
          type="date"
          min="${today}"
          value="${lead.data && lead.data !== 'A definir' ? formatDateForInput(lead.data) : today}"
        />
        <button id="btn-confirm-date" class="btn-gold-action" type="button">
          CONFIRMAR DATA ${ICONS.arrowRight}
        </button>
        <button id="btn-date-skip" class="btn-secondary-link" type="button">
          🤔 Prefiro definir mais tarde
        </button>
      </div>
    `;

    chatActions.appendChild(container);
    scrollChatToBottom('smooth');

    const input = document.getElementById('date-picker-input');
    const btnConfirm = document.getElementById('btn-confirm-date');
    const btnSkip = document.getElementById('btn-date-skip');

    setupInputFocus(input);

    btnConfirm.addEventListener('click', () => {
      if (isProcessing) return;
      const val = input.value;
      if (!val) {
        input.focus();
        return;
      }
      isProcessing = true;
      const parts = val.split('-');
      const formattedDate = `${parts[2]}/${parts[1]}/${parts[0]}`;
      lead.data = formattedDate;

      clearChatActions();
      appendUserMessage(`📅 ${lead.data}`, 3);
      setTimeout(() => {
        step4City();
      }, 200);
    });

    btnSkip.addEventListener('click', () => {
      if (isProcessing) return;
      isProcessing = true;
      lead.data = 'A definir';
      clearChatActions();
      appendUserMessage('Ainda estou definindo', 3);
      setTimeout(() => {
        step4City();
      }, 200);
    });
  }

  function formatDateForInput(brDate) {
    if (!brDate || !brDate.includes('/')) return '';
    const parts = brDate.split('/');
    if (parts.length === 3) {
      return `${parts[2]}-${parts[1]}-${parts[0]}`;
    }
    return '';
  }

  // ETAPA 4: Cidade
  async function step4City() {
    const version = ++flowVersion;
    isProcessing = true;
    currentStep = 4;
    updateProgress(4);

    const messages = ['Em qual cidade será o evento?'];

    const completed = await runSequence(messages, 4, version);
    if (!completed || version !== flowVersion) return;

    renderCityInput();
    isProcessing = false;
  }

  function renderCityInput() {
    clearChatActions();
    const container = document.createElement('div');
    container.className = 'interaction-area';

    const defaultCity = lead.cidade || '';

    container.innerHTML = `
      <div class="input-row-box">
        <div class="input-field-wrap">
          ${ICONS.mapPin}
          <input
            id="input-city"
            class="chat-input"
            type="text"
            placeholder="Digite a cidade..."
            aria-label="Cidade do evento"
            value="${escapeHtml(defaultCity)}"
          />
        </div>
        <div class="chips-row">
          <span style="font-size: 11px; color: var(--text-muted); font-weight: 600; padding-right: 4px;">Sugestões:</span>
          <button class="chip-btn" type="button" data-city="Bagé">Bagé</button>
          <button class="chip-btn" type="button" data-city="Pelotas">Pelotas</button>
          <button class="chip-btn" type="button" data-city="Dom Pedrito">Dom Pedrito</button>
          <button class="chip-btn" type="button" data-city="Aceguá">Aceguá</button>
          <button class="chip-btn" type="button" data-city="Porto Alegre">Porto Alegre</button>
        </div>
        <button id="btn-submit-city" class="btn-gold-action" type="button">
          CONTINUAR ${ICONS.arrowRight}
        </button>
      </div>
    `;

    chatActions.appendChild(container);
    scrollChatToBottom('smooth');

    const input = document.getElementById('input-city');
    const btn = document.getElementById('btn-submit-city');
    const chips = container.querySelectorAll('.chip-btn');

    setupInputFocus(input);

    chips.forEach(chip => {
      chip.addEventListener('click', () => {
        input.value = chip.getAttribute('data-city');
        input.focus();
      });
    });

    if (input) {
      input.focus();
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          submitCity();
        }
      });
    }

    if (btn) btn.addEventListener('click', submitCity);

    function submitCity() {
      if (isProcessing) return;
      const val = input.value.trim();
      if (!val) {
        input.focus();
        input.parentElement.style.borderColor = '#FFD76A';
        return;
      }
      isProcessing = true;
      lead.cidade = val;
      clearChatActions();
      appendUserMessage(`📍 ${lead.cidade}`, 4);

      setTimeout(() => {
        step5Guests();
      }, 200);
    }
  }

  // ETAPA 5: Quantidade de Pessoas
  async function step5Guests() {
    const version = ++flowVersion;
    isProcessing = true;
    currentStep = 5;
    updateProgress(5);

    const messages = ['Quantas pessoas você espera aproximadamente?'];

    const completed = await runSequence(messages, 5, version);
    if (!completed || version !== flowVersion) return;

    renderGuestButtons();
    isProcessing = false;
  }

  function renderGuestButtons() {
    clearChatActions();
    const container = document.createElement('div');
    container.className = 'interaction-area';

    const guestRanges = [
      { id: 'Até 50 pessoas', label: 'Até 50 pessoas' },
      { id: '50 a 100', label: '50 a 100 pessoas' },
      { id: '100 a 200', label: '100 a 200 pessoas' },
      { id: 'Mais de 200', label: 'Mais de 200 pessoas' },
      { id: 'Ainda não sei', label: 'Ainda não sei' }
    ];

    let html = `<div class="quick-options-grid">`;
    guestRanges.forEach(item => {
      const isSelected = lead.convidados === item.id ? 'selected' : '';
      html += `
        <button class="btn-quick ${isSelected}" type="button" data-guests="${item.id}">
          <div class="btn-quick-icon">${ICONS.users}</div>
          <div class="btn-quick-text">${item.label}</div>
          <div class="btn-quick-arrow">${ICONS.arrowRight}</div>
        </button>
      `;
    });
    html += `</div>`;

    container.innerHTML = html;
    chatActions.appendChild(container);
    scrollChatToBottom('smooth');

    const buttons = container.querySelectorAll('.btn-quick');
    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        if (isProcessing) return;
        isProcessing = true;

        buttons.forEach(b => (b.style.pointerEvents = 'none'));
        btn.classList.add('selected');

        const val = btn.getAttribute('data-guests');
        lead.convidados = val;

        setTimeout(() => {
          clearChatActions();
          appendUserMessage(lead.convidados, 5);
          setTimeout(() => {
            step6Notes();
          }, 200);
        }, 160);
      });
    });
  }

  // ETAPA 6: Detalhe Especial (Opcional)
  async function step6Notes() {
    const version = ++flowVersion;
    isProcessing = true;
    currentStep = 6;
    updateProgress(6);

    const messages = ['Quer contar algum detalhe especial pra gente?'];

    const completed = await runSequence(messages, 6, version);
    if (!completed || version !== flowVersion) return;

    renderNotesInput();
    isProcessing = false;
  }

  function renderNotesInput() {
    clearChatActions();
    const container = document.createElement('div');
    container.className = 'interaction-area';

    container.innerHTML = `
      <div class="input-row-box">
        <div class="input-field-wrap">
          <textarea
            id="input-notes"
            class="chat-input chat-textarea"
            placeholder="Ex.: casamento à noite, aniversário, evento empresarial..."
            rows="3"
            aria-label="Detalhes especiais do evento"
          >${escapeHtml(lead.observacao)}</textarea>
        </div>
        <button id="btn-submit-notes" class="btn-gold-action" type="button">
          CONTINUAR ${ICONS.arrowRight}
        </button>
        <button id="btn-skip-notes" class="btn-secondary-link" type="button">
          💬 Prefiro explicar pelo WhatsApp
        </button>
      </div>
    `;

    chatActions.appendChild(container);
    scrollChatToBottom('smooth');

    const input = document.getElementById('input-notes');
    const btn = document.getElementById('btn-submit-notes');
    const btnSkip = document.getElementById('btn-skip-notes');

    if (input) {
      setupInputFocus(input);
      input.focus();
    }

    if (btn) {
      btn.addEventListener('click', () => {
        if (isProcessing) return;
        isProcessing = true;
        const val = input.value.trim();
        lead.observacao = val || 'Nenhuma observação informada';
        clearChatActions();
        appendUserMessage(lead.observacao, 6);

        setTimeout(() => {
          finishConversation();
        }, 200);
      });
    }

    if (btnSkip) {
      btnSkip.addEventListener('click', () => {
        if (isProcessing) return;
        isProcessing = true;
        lead.observacao = 'Prefiro explicar pelo WhatsApp';
        clearChatActions();
        appendUserMessage('Prefiro explicar pelo WhatsApp', 6);

        setTimeout(() => {
          finishConversation();
        }, 200);
      });
    }
  }

  // ============================================================================
  // ETAPA 7: FINAL DA CONVERSA & ENCAMINHAMENTO WHATSAPP
  // ============================================================================

  async function finishConversation() {
    const version = ++flowVersion;
    isProcessing = true;
    currentStep = 7;
    updateProgress(7);

    const finishSequence = [
      `Perfeito, <strong>${escapeHtml(lead.nome)}</strong>! ✨`,
      'Já organizei as principais informações do seu evento.',
      'Agora é só falar com nossa equipe pelo WhatsApp para continuarmos seu atendimento.'
    ];

    const completed = await runSequence(finishSequence, 7, version);
    if (!completed || version !== flowVersion) return;

    renderSummaryAndWhatsAppCTA();
    isProcessing = false;
  }

  function buildWhatsAppMessage() {
    const nomeVal = lead.nome || 'Não informado';
    const servicoVal = lead.servico || 'Não informado';
    const eventoVal = lead.evento || 'Não informado';
    const dataVal = lead.data || 'A definir';
    const cidadeVal = lead.cidade || 'Não informada';
    const convidadosVal = lead.convidados || 'A definir';
    const observacaoVal = lead.observacao || 'Nenhuma';

    return (
      `Olá! Vim pelo atendimento da CLICKBAGE 360° e gostaria de solicitar mais informações.\n\n` +
      `👤 Nome: ${nomeVal}\n` +
      `🎥 Interesse: ${servicoVal}\n` +
      `🎉 Tipo de evento: ${eventoVal}\n` +
      `📅 Data: ${dataVal}\n` +
      `📍 Cidade: ${cidadeVal}\n` +
      `👥 Quantidade aproximada: ${convidadosVal}\n` +
      `📝 Observação: ${observacaoVal}\n\n` +
      `Gostaria de receber mais informações e um orçamento.`
    );
  }

  function renderSummaryAndWhatsAppCTA() {
    clearChatActions();
    const container = document.createElement('div');
    container.className = 'interaction-area';

    const fullMessage = buildWhatsAppMessage();
    const encodedText = encodeURIComponent(fullMessage);

    // URL oficial compatível com mensagem pré-preenchida
    const waUrl = `https://wa.me/${CONFIG.whatsappNumero}?text=${encodedText}`;

    container.innerHTML = `
      <div class="summary-card">
        <div class="summary-header">
          <div class="summary-title-wrap">
            <span style="color: var(--gold-light);">${ICONS.sparkles}</span>
            <h3 class="summary-title">Resumo do Atendimento</h3>
          </div>
          <span class="summary-tag">Pronto para envio</span>
        </div>

        <div class="summary-grid">
          <div class="summary-item">
            <span class="summary-label">Nome</span>
            <span class="summary-value">${escapeHtml(lead.nome)}</span>
          </div>
          <div class="summary-item">
            <span class="summary-label">Serviço</span>
            <span class="summary-value">${escapeHtml(lead.servico)}</span>
          </div>
          <div class="summary-item">
            <span class="summary-label">Evento</span>
            <span class="summary-value">${escapeHtml(lead.evento)}</span>
          </div>
          <div class="summary-item">
            <span class="summary-label">Data</span>
            <span class="summary-value">${escapeHtml(lead.data || 'A definir')}</span>
          </div>
          <div class="summary-item">
            <span class="summary-label">Cidade</span>
            <span class="summary-value">${escapeHtml(lead.cidade)}</span>
          </div>
          <div class="summary-item">
            <span class="summary-label">Convidados</span>
            <span class="summary-value">${escapeHtml(lead.convidados)}</span>
          </div>
          <div class="summary-item summary-full-row">
            <span class="summary-label">Observação</span>
            <span class="summary-value">${escapeHtml(lead.observacao)}</span>
          </div>
        </div>

        <div class="whatsapp-cta-wrap">
          <a
            id="btn-whatsapp-cta"
            class="btn-whatsapp-3d"
            href="${waUrl}"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Continuar atendimento no WhatsApp oficial da CLICKBAGE 360°"
          >
            ${ICONS.whatsapp}
            <div class="cta-text">
              <span class="cta-title">CONTINUAR NO WHATSAPP</span>
              <span class="cta-sub">Enviar mensagem pronta e receber proposta</span>
            </div>
          </a>

          <button id="btn-copy-msg" class="btn-copy-preview" type="button">
            ${ICONS.message} Copiar mensagem formatada
          </button>

          <button id="btn-edit-answers" class="btn-secondary-link" type="button" style="margin-top: 4px;">
            ✏️ Deseja alterar alguma informação?
          </button>
        </div>
      </div>
    `;

    chatActions.appendChild(container);
    scrollChatToBottom('smooth');

    const btnWa = document.getElementById('btn-whatsapp-cta');
    if (btnWa) {
      btnWa.addEventListener('click', () => {
        playLuxuryChime();
      });
    }

    const btnCopy = document.getElementById('btn-copy-msg');
    if (btnCopy) {
      btnCopy.addEventListener('click', async () => {
        try {
          await navigator.clipboard.writeText(fullMessage);
          btnCopy.innerHTML = `${ICONS.check} Mensagem copiada com sucesso!`;
          btnCopy.style.borderColor = 'var(--gold-light)';
          btnCopy.style.color = '#FFFFFF';
          setTimeout(() => {
            btnCopy.innerHTML = `${ICONS.message} Copiar mensagem formatada`;
            btnCopy.style.borderColor = '';
            btnCopy.style.color = '';
          }, 2500);
        } catch (err) {
          const textarea = document.createElement('textarea');
          textarea.value = fullMessage;
          document.body.appendChild(textarea);
          textarea.select();
          document.execCommand('copy');
          document.body.removeChild(textarea);
          btnCopy.innerHTML = `${ICONS.check} Copiado!`;
        }
      });
    }

    const btnEdit = document.getElementById('btn-edit-answers');
    if (btnEdit) {
      btnEdit.addEventListener('click', () => {
        handleGoBackToStep(1);
      });
    }
  }

  // ============================================================================
  // VOLTAR À ETAPA ANTERIOR SEM DUPLICAÇÃO OU QUEBRA
  // ============================================================================

  function handleGoBack() {
    if (currentStep <= 0 || isProcessing) return;
    handleGoBackToStep(currentStep - 1);
  }

  function handleGoBackToStep(targetStep) {
    flowVersion++; // Cancela qualquer fila do bot em execução imediatamente
    isProcessing = false;
    clearChatActions();
    hideTypingIndicator();

    // Remove do chat todas as mensagens das etapas >= targetStep
    const messages = chatMessages.querySelectorAll('[data-step]');
    messages.forEach(msg => {
      const s = parseInt(msg.getAttribute('data-step'), 10);
      if (s >= targetStep) {
        msg.remove();
      }
    });

    currentStep = targetStep;
    updateProgress(currentStep);

    // Reexecuta o passo solicitado
    switch (targetStep) {
      case 0:
        renderNameInput();
        break;
      case 1:
        step1Services();
        break;
      case 2:
        step2EventType();
        break;
      case 3:
        step3Date();
        break;
      case 4:
        step4City();
        break;
      case 5:
        step5Guests();
        break;
      case 6:
        step6Notes();
        break;
      default:
        startConversation();
    }
  }

  // Reiniciar atendimento do zero
  function handleRestart() {
    if (confirm('Deseja reiniciar seu atendimento?')) {
      lead.nome = '';
      lead.servico = '';
      lead.evento = '';
      lead.data = '';
      lead.cidade = '';
      lead.convidados = '';
      lead.observacao = '';
      startConversation();
    }
  }

  // Sanitização de string contra XSS
  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

})();
