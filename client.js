class Chat337Client {
  constructor() {
    this.userId = null;
    this.profilePicture = null;
    this.receiverUserId = null;

    this.chatsElem = document.getElementById("chats-elements");
    this.loginElem = document.getElementById("login");
    this.outputElem = document.getElementById("output");

    this.chatsWrapper = document.getElementById("chats");
    this.conversationElem = document.getElementById("conversation");
    this.inputElem = document.getElementById("chat-message-input");
  }

  async showCurrentChats() {
    this.showChats(this.userId, this.profilePicture);
  }

  async showChats(userId, profilePicture) {
    this.userId = userId;
    this.profilePicture = profilePicture;

    const response = await fetch(`/json/chats/${userId}.json`);

    if (response.ok) {
      const data = await response.json();

      // clean up old elements
      while (this.chatsElem.lastChild) {
        this.chatsElem.removeChild(this.chatsElem.lastChild);
      }

      for (const chat of data.chats) {
        const sender = chat.sender;
        let user;
        for (const u of data.users) {
          if (u.userId == sender) {
            user = u;
          }
        }

        this.chatsElem.insertAdjacentHTML('beforeend', `
          <span onClick="globalThis.chat337.showChat('${userId}', '${sender}')">
            <img src="/image/${user.profilePicture}">
            <span class="name">${user.userName}</span>
            <span class="last-msg">${chat.text}</span>
          </span>`);
      }
    } else {
      this.chatsElem.insertAdjacentText('beforeend', `Failed to retrieve chats for ${userId}.`);
    }

    this.enableView("chats");
  }

  async showUsers() {
    const response = await fetch("/json/users.json");


    if (response.ok) {
      const users = await response.json();

      for (const user of users) {
        this.loginElem.insertAdjacentHTML('beforeend', `
          <span onClick="globalThis.chat337.showChats('${user.userId}', '${user.profilePicture}')">
            <img src="/image/${user.profilePicture}">
            ${user.userName}
          </span>`);
      }
    } else {
      this.loginElem.insertAdjacentText('beforeend', "Failed to retrieve users.");
    }
  }

  async showChat(userId, receiver) {
    this.receiverUserId = receiver;

    const response = await fetch(`/json/chat/${userId}/${receiver}.json`);


    if (response.ok) {
      const data = await response.json();

      // clean up old elements
      while (this.outputElem.lastChild) {
        this.outputElem.removeChild(this.outputElem.lastChild);
      }

      const users = new Map();
      for (const u of data.users) {
        users.set(u.userId, u);
      }

      for (const m of data.messages) {
        this.addMessage(users.get(m.sender), m.text);
      }
    } else {
      this.outputElem.insertAdjacentText(
        'beforeend', `Failed to retrieve conversation between ${userId} and ${receiver}.`);
    }

    this.enableView("conversation");
  }

  enableView(view) {

    this.chatsWrapper.style.display = "none";
    this.loginElem.style.display = "none";
    this.conversationElem.style.display = "none";

    switch (view) {
      case "chats":
        this.chatsWrapper.style.display = "block";
        break;
      case "login":
        this.loginElem.style.display = "block";
        break;
      case "conversation":
        this.conversationElem.style.display = "block";
        break;
    }
  }

  showLogin() {
    this.enableView("login");
  }

  addMessage(user, message) {
    const msg = `<span><img src="/image/${user.profilePicture}">${message}</span>`;

    this.outputElem.insertAdjacentHTML('beforeend', msg); // afterbegin
    this.outputElem.scrollTop = this.outputElem.scrollHeight;
  }

  async sendMessage(event) {
    event.preventDefault();


    const msg = this.inputElem.value;

    this.addMessage(this, msg);

    this.inputElem.value = "";

    await fetch(
      `/json/send/${this.receiverUserId}`,
      {
        method: 'POST',
        body: JSON.stringify({
          sender: this.userId,
          message: msg
        }),
        headers: { 'Content-Type': 'application/json' }
      });
  }
}

window.addEventListener("load", function () {
  const client  = new Chat337Client();
  globalThis.chat337 = client;
  client.showUsers();

  const form = document.getElementById("chat-message");
  form.addEventListener("submit", event => client.sendMessage(event));

  const output = document.getElementById("output");
  output.scrollTop = output.scrollHeight;
});
