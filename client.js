async function showUsers() {
  const response = await fetch("/json/users.json");

  const login = document.getElementById("login");
  if (response.ok) {
    const users = await response.json();

    for (const user of users) {
      login.insertAdjacentHTML('beforeend', `
        <span onClick="showChats('${user.userId}')">
          <img src="/image/${user.profilePicture}">
          ${user.userName}
        </span>`);
    }
  } else {
    login.insertAdjacentText('beforeend', "Failed to retrieve users.");
  }
}

async function showChats(userId) {
  const response = await fetch(`/json/chats/${userId}.json`);

  const login = document.getElementById("login");
  login.style.display = "none";

  const chats = document.getElementById("chats");

  if (response.ok) {
    const data = await response.json();

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
  chats.style.display = "block";
}

async function showChat(userId, receiver) {
  const response = await fetch(`/json/chat/${userId}/${receiver}.json`);

  const chats = document.getElementById("chats");
  chats.style.display = "none";

  const conversation = document.getElementById("conversation");

  if (response.ok) {
    const data = await response.json();
  } else {
    conversation.insertAdjacentText(
      'beforeend', `Failed to retrieve conversation between ${userId} and ${receiver}.`);
  }

  conversation.style.display = "block";
}

function addMessage(user, message) {
  const msg = `<span><img src="/image/${user}.jpg">${message}</span>`;

  const output = document.getElementById("output");
  output.insertAdjacentHTML('beforeend', msg); // afterbegin
  output.scrollTop = output.scrollHeight;
}

function sendMessage(event) {
  event.preventDefault();
  const input = document.getElementById("chat-message-input");

  addMessage("Stefan-Marr", input.value);
  input.value = "";
}

window.addEventListener("load", function () {
  showUsers();

  const form = document.getElementById("chat-message");
  form.addEventListener("submit", sendMessage);

  const output = document.getElementById("output");
  output.scrollTop = output.scrollHeight;
});
