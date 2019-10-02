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

    const response = await fetch(`/json/chats/${userId}`);

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
    const response = await fetch("/json/users");


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

    const response = await fetch(`/json/chat/${userId}/${receiver}`);


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

  async addMessage(user, message) {
    const msg = `<span><img src="/image/${user.profilePicture}">${message}</span>`;

    this.outputElem.insertAdjacentHTML('beforeend', msg); // afterbegin
    this.outputElem.scrollTop = this.outputElem.scrollHeight;

    await this.showLinkInMessage(message, this.outputElem.lastChild);
  }

  async showLinkInMessage(message, msgElem) {
    // message = "Check out:\nhttps://www.theguardian.com/commentisfree/2018/feb/18/does-every-cloud-have-silver-lining-not-if-run-by-internet-giant";
    // message = "Check out:\nhttps://www.bbc.co.uk/news/technology-48841815";
    const match = message.match(/(?:(?:https?|ftp):\/\/|\b(?:[a-z\d]+\.))(?:(?:[^\s()<>]+|\((?:[^\s()<>]+|(?:\([^\s()<>]+\)))?\))+(?:\((?:[^\s()<>]+|(?:\(?:[^\s()<>]+\)))?\)|[^\s`!()\[\]{};:'".,<>?«»“”‘’]))?/i);

    if (match) {
      const url = match[0];
      if (url.endsWith('.')) {
        // try to exclude last word in sentence, likely not a url
        return;
      }
      const result = await this.requestDetailsForUrl(url);
      const desc = result.desc ? `<p>${result.desc}</p>` : '';
      const img = result.img ? `<img src="${result.img}">` : '';
      msgElem.insertAdjacentHTML('afterend', `
        <span class='msg-details'><a href="${result.url}">
          <p><strong>${result.title}</strong></p>
          ${desc}
          ${img}
        </a></span>
      `);
    }
  }

  async requestDetailsForUrl(url) {
    const response = await fetch(
      "https://29c22c97.eu-gb.apiconnect.appdomain.cloud/chat337/get-meta",
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({url: url})
      });
    return await response.json();
  }

  async sendMessage(event) {
    event.preventDefault();

    const msg = this.inputElem.value;
    this.inputElem.value = "";

    const messageDisplayed = this.addMessage(this, msg);

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

    await messageDisplayed;
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
