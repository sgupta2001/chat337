class Chat337GlobalData {
  constructor() {
    this.userId = null;
    this.profilePicture = null;
    this.receiverUserId = null;
  }
}

globalThis.chat337 = new Chat337GlobalData();

async function showUsers() {
  const response = await fetch("/json/users.json");

  const login = document.getElementById("login");
  if (response.ok) {
    const users = await response.json();

    for (const user of users) {
      login.insertAdjacentHTML('beforeend', `
        <span onClick="showChats('${user.userId}', '${user.profilePicture}')">
          <img src="/image/${user.profilePicture}">
          ${user.userName}
        </span>`);
    }
  } else {
    login.insertAdjacentText('beforeend', "Failed to retrieve users.");
  }
}

async function showChats(userId, profilePicture) {
  globalThis.chat337.userId = userId;
  globalThis.chat337.profilePicture = profilePicture;

  const response = await fetch(`/json/chats/${userId}.json`);

  const chats = document.getElementById("chats-elements");

  if (response.ok) {
    const data = await response.json();

    // clean up old elements
    while (chats.lastChild) {
      chats.removeChild(chats.lastChild);
    }

    for (const chat of data.chats) {
      const sender = chat.sender;
      let user;
      for (const u of data.users) {
        if (u.userId == sender) {
          user = u;
        }
      }

      chats.insertAdjacentHTML('beforeend', `
        <span onClick="showChat('${userId}', '${sender}')">
          <img src="/image/${user.profilePicture}">
          <span class="name">${user.userName}</span>
          <span class="last-msg">${chat.text}</span>
        </span>`);
    }
  } else {
    chats.insertAdjacentText('beforeend', `Failed to retrieve chats for ${userId}.`);
  }

  enableView("chats");
}

async function showChat(userId, receiver) {
  globalThis.chat337.receiverUserId = receiver;

  const response = await fetch(`/json/chat/${userId}/${receiver}.json`);
  const output = document.getElementById("output");

  if (response.ok) {
    const data = await response.json();

    // clean up old elements
    while (output.lastChild) {
      output.removeChild(output.lastChild);
    }

    const users = new Map();
    for (const u of data.users) {
      users.set(u.userId, u);
    }

    for (const m of data.messages) {
      addMessage(users.get(m.sender), m.text);
    }
  } else {
    output.insertAdjacentText(
      'beforeend', `Failed to retrieve conversation between ${userId} and ${receiver}.`);
  }

  enableView("conversation");
}

function enableView(view) {
  const chats = document.getElementById("chats");
  const login = document.getElementById("login");
  const conversation = document.getElementById("conversation");

  chats.style.display = "none";
  login.style.display = "none";
  conversation.style.display = "none";

  switch (view) {
    case "chats":
      chats.style.display = "block";
      break;
    case "login":
      login.style.display = "block";
      break;
    case "conversation":
      conversation.style.display = "block";
      break;
  }
}

function showLogin() {
  enableView("login");
}

function addMessage(user, message) {
  const msg = `<span><img src="/image/${user.profilePicture}">${message}</span>`;

  const output = document.getElementById("output");
  output.insertAdjacentHTML('beforeend', msg); // afterbegin
  output.scrollTop = output.scrollHeight;
}

function sendMessage(event) {
  event.preventDefault();
  const input = document.getElementById("chat-message-input");

  addMessage({profilePicture: globalThis.chat337ProfilePicture}, input.value);
  input.value = "";
}

window.addEventListener("load", function () {
  showUsers();

  const form = document.getElementById("chat-message");
  form.addEventListener("submit", sendMessage);

  const output = document.getElementById("output");
  output.scrollTop = output.scrollHeight;
});
