import { Chat337, User } from "../server.mjs";
import { expect } from "chai";

describe('Chat337 Server Basics', function() {
  let chat;

  before(function() {
    const smarr = new User("smarr", "Stefan Marr", "Stefan-Marr.jpg");
    const queen = new User("queen", "The Queen", "Queen-Elizabeth-II.jpg");
    const chancellor = new User("chancellor", "The Chancellor", "Angela-Merkel.jpg");

    chat = new Chat337([smarr, queen, chancellor]);
  })

  describe('Conversation Id need to be unique, order, ...', function () {
    it('should generate ids that uniquely identify a conversation between two user ids' , function () {
      const chat = new Chat337([]);
      let id1 = chat.getConversationId("aaa", "aaa");
      let id2 = chat.getConversationId("aaa", "aaa");
      expect(id1).to.equal(id2);

      id1 = chat.getConversationId("aaa", "bbb");
      id2 = chat.getConversationId("bbb", "aaa");
      expect(id1).to.equal(id2);

      id1 = chat.getConversationId("BB", "zzz");
      id2 = chat.getConversationId("zzz", "BB");
      expect(id1).to.equal(id2);

      id1 = chat.getConversationId("BBz", "zz");
      id2 = chat.getConversationId("BB", "zzz");
      expect(id1).to.not.equal(id2);
    });
  });

  describe('Users are kept', function() {
    it("Initial users should be in list of users", function() {
      const users = chat.getUsers();
      expect(users).lengthOf(3);
    });
  });

  describe('Message Sending', function() {
    it("Sent messages should be in a conversation", function() {
      let data = chat.allMessages('smarr', 'queen');

      expect(data.messages).lengthOf(0);
      chat.sendMessage('smarr', 'queen', 'test message');

      data = chat.allMessages('smarr', 'queen');
      expect(data.messages).lengthOf(1);
    });
  });
});
