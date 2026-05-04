// Main application logic
let selectedLang = '';
let recognition = null;
let recognitionActive = false;

function speakText(text) {
  if (!window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'en-US';
  utterance.rate = 1;
  utterance.pitch = 1;
  window.speechSynthesis.speak(utterance);
}

function selectLang(lang, el) {
  document.querySelectorAll('.lang-card').forEach(c => c.classList.remove('sel'));
  el.classList.add('sel');
  selectedLang = lang;
  document.getElementById('lang-next').disabled = false;
}

function goTo(screen) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById('screen-' + screen).classList.add('active');
  const map = { lang: 1, resume: 2, setup: 3, interview: 4, feedback: 5 };
  const idx = map[screen];
  document.querySelectorAll('.ts-step').forEach((s, i) => {
    s.classList.remove('active', 'done');
    if (i + 1 < idx) s.classList.add('done');
    if (i + 1 === idx) s.classList.add('active');
  });
}

function setupUploadHandlers() {
  const zone = document.getElementById('upload-zone');
  if (!zone) return;
  
  zone.addEventListener('dragover', event => {
    event.preventDefault();
    zone.classList.add('dragover');
  });
  zone.addEventListener('dragleave', () => {
    zone.classList.remove('dragover');
  });
  zone.addEventListener('drop', event => {
    event.preventDefault();
    zone.classList.remove('dragover');
    if (event.dataTransfer.files.length) {
      handleResumeFile(event.dataTransfer.files[0]);
    }
  });
}

function handleResumeSelect(event) {
  const file = event.target.files[0];
  if (file) handleResumeFile(file);
}

function handleResumeFile(file) {
  const allowedTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ];
  const maxSize = 5 * 1024 * 1024;

  if (!allowedTypes.includes(file.type) && !/\.(pdf|docx?|PDF|DOCX?)$/.test(file.name)) {
    alert('Please upload a valid PDF, DOC, or DOCX file.');
    return;
  }

  if (file.size > maxSize) {
    alert('File is too large. Please upload a file smaller than 5MB.');
    return;
  }

  const formData = new FormData();
  formData.append('resume', file);

  fetch('/api/upload', {
    method: 'POST',
    body: formData
  })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        document.getElementById('upload-zone').style.display = 'none';
        document.getElementById('upload-ok').style.display = 'flex';
        document.getElementById('upload-name').textContent = file.name + ' uploaded';
      }
    })
    .catch(err => console.error('Upload error:', err));
}

function setupSpeechRecognition() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) return;

  recognition = new SpeechRecognition();
  recognition.continuous = false;
  recognition.interimResults = false;
  recognition.lang = 'en-US';

  recognition.onstart = () => {
    recognitionActive = true;
    const status = document.getElementById('mic-status-text');
    if (status) status.textContent = 'Listening...';
  };

  recognition.onend = () => {
    recognitionActive = false;
    const status = document.getElementById('mic-status-text');
    if (status) status.textContent = 'Click to speak';
  };

  recognition.onresult = event => {
    const transcript = event.results[0][0].transcript;
    handleUserSpeech(transcript);
  };
}

function toggleMic() {
  if (!recognition) setupSpeechRecognition();
  if (!recognition) return;

  if (recognitionActive) {
    recognition.stop();
  } else {
    try {
      recognition.start();
    } catch (err) {
      console.warn('Speech recognition error:', err);
    }
  }
}

function handleUserSpeech(text) {
  const bubble = document.getElementById('ai-bubble');
  const status = document.getElementById('ai-status-txt');
  if (bubble && status) {
    bubble.textContent = `You said: "${text}"`;
    status.textContent = 'Processing...';
  }

  setTimeout(() => {
    const reply = `Thanks! I heard: ${text}. Great answer. Let's continue.`;
    showAITyping(reply);
  }, 1200);
}

function showAITyping(text) {
  const bubble = document.getElementById('ai-bubble');
  const status = document.getElementById('ai-status-txt');
  if (!bubble || !status) return;

  bubble.innerHTML = '<div class="typing"><span></span><span></span><span></span></div>';
  status.textContent = 'Typing...';

  setTimeout(() => {
    bubble.textContent = text;
    status.textContent = 'Listening to you';
    speakText(text);
  }, 1800);
}

document.addEventListener('DOMContentLoaded', () => {
  setupUploadHandlers();
  setupSpeechRecognition();
});
