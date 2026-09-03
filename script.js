<script>
/* =========================================================
   CHATWAVE
   Sistema de mensagens + contatos
========================================================= */

/* -------------------------
   ELEMENTOS
------------------------- */

const app = document.getElementById("app");
const contactsContainer = document.getElementById("contacts");
const messagesContainer = document.getElementById("messages");
const messageInput = document.getElementById("messageInput");
const searchInput = document.getElementById("searchInput");

const chatName = document.getElementById("chatName");
const chatAvatar = document.getElementById("chatAvatar");
const chatStatus = document.getElementById("chatStatus");


/* -------------------------
   DADOS
------------------------- */

let contacts = JSON.parse(
  localStorage.getItem("chatwave_contacts")
) || [

  {
    id: 1,
    name: "Mariana Silva",
    initials: "MS",
    color: "purple",
    online: true,
    unread: 0,
    messages: [
      {
        type: "received",
        text: "Oi! Tudo bem? 😊",
        time: "19:20"
      },
      {
        type: "sent",
        text: "Oi, Mariana! Tudo ótimo. E com você?",
        time: "19:22"
      },
      {
        type: "received",
        text: "Também estou bem! Você conseguiu terminar aquele trabalho?",
        time: "19:24"
      },
      {
        type: "sent",
        text: "Consegui sim! Acabei agora há pouco 😄",
        time: "19:26"
      }
    ]
  },

  {
    id: 2,
    name: "Lucas Oliveira",
    initials: "LO",
    color: "blue",
    online: false,
    unread: 2,
    messages: [
      {
        type: "received",
        text: "Você já viu aquele projeto?",
        time: "18:45"
      }
    ]
  },

  {
    id: 3,
    name: "Ana Costa",
    initials: "AC",
    color: "green",
    online: true,
    unread: 0,
    messages: [
      {
        type: "received",
        text: "Obrigada pela ajuda!",
        time: "17:21"
      }
    ]
  },

  {
    id: 4,
    name: "Pedro Santos",
    initials: "PS",
    color: "orange",
    online: false,
    unread: 0,
    messages: [
      {
        type: "received",
        text: "Vamos marcar para sexta?",
        time: "16:08"
      }
    ]
  },

  {
    id: 5,
    name: "Julia Martins",
    initials: "JM",
    color: "pink",
    online: true,
    unread: 0,
    messages: [
      {
        type: "received",
        text: "Hahaha 😂",
        time: "15:40"
      }
    ]
  }

];


/* -------------------------
   CONTATO ATUAL
------------------------- */

let currentContactId = 1;


/* =========================================================
   SALVAR DADOS
========================================================= */

function saveData() {

  localStorage.setItem(
    "chatwave_contacts",
    JSON.stringify(contacts)
  );

}


/* =========================================================
   GERAR HORA
========================================================= */

function getTime() {

  const now = new Date();

  return now.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit"
  });

}


/* =========================================================
   ESCAPAR HTML
========================================================= */

function escapeHTML(text) {

  const div = document.createElement("div");

  div.textContent = text;

  return div.innerHTML;

}


/* =========================================================
   ABRIR CONVERSA
========================================================= */

function openChat(contactId) {

  const contact = contacts.find(
    c => c.id === contactId
  );

  if (!contact) return;

  currentContactId = contactId;

  /*
    Ao abrir a conversa,
    marcamos as mensagens como lidas.
  */

  contact.unread = 0;

  updateChatHeader(contact);

  renderMessages(contact);

  renderContacts();

  saveData();

  app.classList.add("chat-open");

  messageInput.focus();

}


/* =========================================================
   CABEÇALHO DO CHAT
========================================================= */

function updateChatHeader(contact) {

  chatName.textContent = contact.name;

  chatAvatar.className =
    "avatar " + contact.color;

  chatAvatar.innerHTML =
    escapeHTML(contact.initials) +
    (
      contact.online
        ? '<div class="online-dot"></div>'
        : ""
    );

  chatStatus.textContent =
    contact.online
      ? "● Online agora"
      : "Offline";

  chatStatus.style.color =
    contact.online
      ? "#23a559"
      : "#949ba4";

}


/* =========================================================
   RENDERIZAR MENSAGENS
========================================================= */

function renderMessages(contact) {

  messagesContainer.innerHTML = "";

  /*
    Data
  */

  const date = document.createElement("div");

  date.className = "date";

  date.innerHTML = `
    <span>Hoje</span>
  `;

  messagesContainer.appendChild(date);


  /*
    Mensagens
  */

  contact.messages.forEach(message => {

    addMessageToScreen(
      message.type,
      message.text,
      message.time
    );

  });


  /*
    Scroll para o final
  */

  scrollMessages();

}


/* =========================================================
   ADICIONAR MENSAGEM NA TELA
========================================================= */

function addMessageToScreen(
  type,
  text,
  time
) {

  const row = document.createElement("div");

  row.className =
    "message-row " + type;

  const message = document.createElement("div");

  message.className = "message";


  const bubble = document.createElement("div");

  bubble.className = "bubble";

  bubble.innerHTML = escapeHTML(text);


  const messageTime = document.createElement("span");

  messageTime.className = "message-time";

  messageTime.textContent =
    type === "sent"
      ? `${time} ✓✓`
      : time;


  message.appendChild(bubble);

  message.appendChild(messageTime);

  row.appendChild(message);

  messagesContainer.appendChild(row);

}


/* =========================================================
   ENVIAR MENSAGEM
========================================================= */

function sendMessage() {

  const text = messageInput.value.trim();

  if (!text) return;


  const contact = contacts.find(
    c => c.id === currentContactId
  );

  if (!contact) return;


  const time = getTime();


  /*
    Salva mensagem
  */

  const newMessage = {

    type: "sent",

    text: text,

    time: time

  };


  contact.messages.push(newMessage);


  /*
    Mostra mensagem
  */

  addMessageToScreen(
    "sent",
    text,
    time
  );


  /*
    Limpa input
  */

  messageInput.value = "";


  /*
    Salva no navegador
  */

  saveData();


  /*
    Scroll
  */

  scrollMessages();


  /*
    Simula resposta
  */

  simulateReply(contact);

}


/* =========================================================
   ENTER ENVIA
========================================================= */

function handleEnter(event) {

  if (event.key === "Enter") {

    event.preventDefault();

    sendMessage();

  }

}


/* =========================================================
   SIMULAR RESPOSTA
========================================================= */

function simulateReply(contact) {

  /*
    Mostra "digitando..."
  */

  const typing = document.createElement("div");

  typing.className =
    "message-row received";

  typing.id =
    "typingIndicator";


  typing.innerHTML = `
    <div class="message">

      <div class="typing">

        <span></span>
        <span></span>
        <span></span>

      </div>

    </div>
  `;


  messagesContainer.appendChild(typing);

  scrollMessages();


  /*
    Resposta depois de 1,5 segundos
  */

  setTimeout(() => {

    const indicator =
      document.getElementById(
        "typingIndicator"
      );

    if (indicator) {
      indicator.remove();
    }


    /*
      Respostas possíveis
    */

    const replies = [

      "Legal! 😊",

      "Entendi!",

      "Boa! 😄",

      "Hahaha, verdade 😂",

      "Pode deixar!",

      "Com certeza!",

      "Que ótimo!",

      "Vou ver isso.",

      "Fechado! 👍",

      "Também acho!",

      "Ok 😊"

    ];


    const reply =
      replies[
        Math.floor(
          Math.random() *
          replies.length
        )
      ];


    const time = getTime();


    /*
      Salva resposta
    */

    contact.messages.push({

      type: "received",

      text: reply,

      time: time

    });


    /*
      Só mostra se a conversa
      ainda estiver aberta
    */

    if (
      currentContactId === contact.id
    ) {

      addMessageToScreen(
        "received",
        reply,
        time
      );

      scrollMessages();

    } else {

      contact.unread++;

    }


    saveData();

    renderContacts();

  }, 1500);

}


/* =========================================================
   SCROLL
========================================================= */

function scrollMessages() {

  messagesContainer.scrollTop =
    messagesContainer.scrollHeight;

}


/* =========================================================
   RENDERIZAR CONTATOS
========================================================= */

function renderContacts() {

  contactsContainer.innerHTML = "";


  contacts.forEach(contact => {

    const lastMessage =
      contact.messages.length
        ? contact.messages[
            contact.messages.length - 1
          ]
        : null;


    const contactElement =
      document.createElement("div");


    contactElement.className =
      "contact" +
      (
        contact.id === currentContactId
          ? " active"
          : ""
      );


    contactElement.dataset.name =
      contact.name;


    contactElement.onclick = () => {

      openChat(contact.id);

    };


    contactElement.innerHTML = `

      <div class="avatar ${contact.color}">

        ${escapeHTML(contact.initials)}

        ${
          contact.online
            ? '<div class="online-dot"></div>'
            : ''
        }

      </div>


      <div class="contact-info">

        <div class="contact-name">

          <strong>
            ${escapeHTML(contact.name)}
          </strong>

          <span class="time">

            ${
              lastMessage
                ? lastMessage.time
                : ""
            }

          </span>

        </div>


        <div class="last-message">

          ${
            lastMessage
              ? escapeHTML(
                  lastMessage.text
                )
              : "Nova conversa"
          }

        </div>

      </div>


      ${
        contact.unread > 0
          ? `
            <div class="unread">
              ${contact.unread}
            </div>
          `
          : ""
      }

    `;


    contactsContainer.appendChild(
      contactElement
    );

  });

}


/* =========================================================
   PESQUISAR CONTATOS
========================================================= */

function filterContacts() {

  const query =
    searchInput.value
      .toLowerCase()
      .trim();


  document
    .querySelectorAll(".contact")
    .forEach(contact => {

      const name =
        contact.dataset.name
          .toLowerCase();


      if (name.includes(query)) {

        contact.style.display =
          "flex";

      } else {

        contact.style.display =
          "none";

      }

    });

}


/* =========================================================
   ADICIONAR CONTATO
========================================================= */

function newChat() {

  /*
    Nome
  */

  const name =
    prompt(
      "Digite o nome do novo contato:"
    );


  if (!name) return;


  const cleanName =
    name.trim();


  if (!cleanName) return;


  /*
    Verifica se já existe
  */

  const alreadyExists =
    contacts.some(
      contact =>
        contact.name.toLowerCase() ===
        cleanName.toLowerCase()
    );


  if (alreadyExists) {

    alert(
      "Esse contato já existe."
    );

    return;

  }


  /*
    Telefone opcional
  */

  const phone =
    prompt(
      "Digite o telefone (opcional):"
    );


  /*
    Gera iniciais
  */

  const initials =
    getInitials(cleanName);


  /*
    Cores disponíveis
  */

  const colors = [

    "purple",

    "blue",

    "green",

    "orange",

    "pink"

  ];


  const color =
    colors[
      contacts.length %
      colors.length
    ];


  /*
    Novo contato
  */

  const newContact = {

    id: Date.now(),

    name: cleanName,

    phone:
      phone
        ? phone.trim()
        : "",

    initials: initials,

    color: color,

    online: false,

    unread: 0,

    messages: []

  };


  /*
    Adiciona na lista
  */

  contacts.unshift(
    newContact
  );


  /*
    Salva
  */

  saveData();


  /*
    Atualiza interface
  */

  renderContacts();


  /*
    Abre conversa
  */

  openChat(
    newContact.id
  );

}


/* =========================================================
   GERAR INICIAIS
========================================================= */

function getInitials(name) {

  const words =
    name
      .trim()
      .split(/\s+/);


  if (words.length === 1) {

    return words[0]
      .substring(0, 2)
      .toUpperCase();

  }


  return (
    words[0][0] +
    words[words.length - 1][0]
  ).toUpperCase();

}


/* =========================================================
   VOLTAR PARA CONTATOS NO CELULAR
========================================================= */

function backToContacts() {

  app.classList.remove(
    "chat-open"
  );

}


/* =========================================================
   INICIALIZAÇÃO
========================================================= */

function initializeChat() {

  renderContacts();


  /*
    Abre primeira conversa
  */

  const firstContact =
    contacts.find(
      c => c.id === currentContactId
    );


  if (firstContact) {

    updateChatHeader(
      firstContact
    );

    renderMessages(
      firstContact
    );

  }

}


/* =========================================================
   INICIAR
========================================================= */

initializeChat();

</script>
