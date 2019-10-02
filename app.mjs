import Koa from 'koa';
import Router from 'koa-router';
import { readFileSync, existsSync } from 'fs';
import { initSystem } from './server.mjs';
import koaBody from 'koa-body';

const PORT = process.env.PORT || 33333

const app = new Koa();
const router = new Router();

const chat = initSystem();

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

router.get('/json/users', async ctx => {
  ctx.type = 'application/json';
  ctx.body = chat.getUsers();
});

router.get('/json/chats/:userId', async ctx => {
  ctx.type = 'application/json';
  ctx.body = chat.listAllContacts(ctx.params.userId);
});

router.get('/json/chat/:userId/:receiver', async ctx => {
  ctx.type = 'application/json';
  ctx.body = chat.allMessages(ctx.params.userId, ctx.params.receiver);
});

router.post('/json/send/:receiverId', koaBody(), async ctx => {
  chat.sendMessage(ctx.request.body.sender, ctx.params.receiverId, ctx.request.body.message);
  ctx.status = 201;
});

app.use(router.routes());
app.use(router.allowedMethods());

app.listen(PORT);
