export function initSystem() {
  const smarr = new User("smarr", "Stefan Marr", "Stefan-Marr.jpg");
  const queen = new User("queen", "The Queen", "Queen-Elizabeth-II.jpg");
  const chancellor = new User("chancellor", "The Chancellor", "Angela-Merkel.jpg");

  const chat = new Chat337([
    smarr,
    queen,
    chancellor
  ]);

  chat.sendMessage("queen", "smarr", "Lorem ipsum dolor sit amet, consectetuer adipiscing elit.");
  chat.sendMessage("chancellor", "smarr", "Lorem ipsum dolor sit amet, consectetuer adipiscing elit.");

  chat.sendMessage("smarr", "queen", "Lorem ipsum dolor sit amet, consectetuer adipiscing elit.");
  chat.sendMessage("chancellor", "queen", "Lorem ipsum dolor sit amet, consectetuer adipiscing elit.");

  chat.sendMessage("queen", "chancellor", "Lorem ipsum dolor sit amet, consectetuer adipiscing elit.");
  chat.sendMessage("smarr", "chancellor", "Lorem ipsum dolor sit amet, consectetuer adipiscing elit.");

  return chat;
}


class Message {
  constructor(sender, receiver, text, isRead = false) {
    this.sender = sender;
    this.receiver = receiver;
    this.text = text;
    this.isRead = isRead;
  }
}

export class User {
  constructor(userId, userName, profilePicture, contacts) {
    this.userId = userId;
    this.userName = userName;
    this.profilePicture = profilePicture;
    this.messages = [];
    this.lastReadMessage = -1;
    this.contacts = contacts;
  }

  send(message) {
    this.messages.push(message);
  }

  getChats() {
    const last = new Map();

    for (const m of this.messages) {
      last.set(m.sender, m);
    }

    const chats = [];
    for (const m of last.values()) {
      chats.unshift({sender: m.sender, text: m.text, isRead: m.isRead});
    }
    return chats;
  }
}

export class Chat337 {
  constructor(listOfUsers) {
    this.users = new Map();
    for (const user of listOfUsers) {
      this.users.set(user.userId, user);
    }

    this.conversation = new Map();
  }

  listAllContacts(userId) {
    const user = this.users.get(userId);
    const chats = user.getChats();

    const users = [];
    for (const chat of chats) {
      const user = this.users.get(chat.sender);
      users.push(this.toBasicUser(user));
    }

    return {
      chats: chats,
      users: users
    }
  }

  allMessages(user1, user2) {
    const id = this.getConversationId(user1, user2);
    this.ensureConversation(id);

    const conversation = this.conversation.get(id);
    return {
      messages: conversation,
      users: [
        this.toBasicUser(this.users.get(user1)),
        this.toBasicUser(this.users.get(user2))
      ]
    } ;
  }

  newMessages() {

  }

  getProfile() {

  }

  setProfile() {

  }

  ensureConversation(conversationId) {
    if (!this.conversation.has(conversationId)) {
      this.conversation.set(conversationId, []);
    }
  }

  sendMessage(sender, receiver, message) {
    const msg = new Message(sender, receiver, message);
    const user = this.users.get(receiver);
    const conversationId = this.getConversationId(sender, receiver);
    this.ensureConversation(conversationId);

    this.conversation.get(conversationId).push(msg);
    user.send(msg);
  }

  toBasicUser(user) {
    return {
      userId: user.userId,
      userName: user.userName,
      profilePicture: user.profilePicture};
  }

  getUsers() {
    const result = [];
    for (const user of this.users.values()) {
      result.push(this.toBasicUser(user));
    }
    return result;
  }

  getConversationId(user1, user2) {
    if (user1 < user2) {
      return `${user1}//${user2}`;
    } else {
      return `${user2}//${user1}`;
    }
  }
}
