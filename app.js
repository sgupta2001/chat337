import Koa from 'koa';
import Router from 'koa-router';
import { readFileSync, existsSync } from 'fs';
import { Chat337, User } from './server.mjs';

const app = new Koa();
const router = new Router();


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


router.get('/', async ctx => {
  ctx.type = '.html';
  ctx.body = readFileSync('./chat.html');
});

router.get('/client.js', async ctx => {
  ctx.type = '.js';
  ctx.body = readFileSync('./client.js');
});

router.get('/image/:fileName', async ctx => {
  ctx.type = '.jpg';
  const fileName = 'resources/' + ctx.params.fileName;
  if (existsSync(fileName)) {
    ctx.body = readFileSync(fileName);
  } else {
    ctx.status = 404;
    ctx.body = `File "${ctx.params.fileName}" not found`;
    ctx.type = '.txt';
  }
});

router.get('/style.css', async ctx => {
  ctx.type = '.css';
  ctx.body = readFileSync('./chat.css');
});

router.get('/json/users.json', async ctx => {
  ctx.type = 'application/json';
  ctx.body = chat.getUsers();
});

router.get('/json/chats/:userId.json', async ctx => {
  ctx.type = 'application/json';
  ctx.body = chat.getChats(ctx.params.userId);
});

router.get('/json/chat/:userId/:receiver.json', async ctx => {
  ctx.type = 'application/json';
  ctx.body = chat.getConversation(ctx.params.userId, ctx.params.receiver);
});

app.use(router.routes());
app.use(router.allowedMethods());

app.listen(33333);
