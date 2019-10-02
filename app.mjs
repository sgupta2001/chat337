import Koa from 'koa';
import Router from 'koa-router';
import { readFileSync, existsSync } from 'fs';
import { initSystem } from './server.mjs';
import koaBody from 'koa-body';

const PORT = process.env.PORT || 33333

const app = new Koa();
const router = new Router();

const chat = initSystem();

function replyWithFile(ctx, fileName, type) {
  ctx.type = type;
  if (existsSync(fileName)) {
    ctx.body = readFileSync(fileName);
  } else {
    ctx.status = 404;
    ctx.body = `File "${fileName}" not found.`;
    ctx.type = '.txt';
  }
}

router.get('/', async ctx => {
  replyWithFile(ctx, './resources/chat.html', '.html');
});

router.get('/client.js', async ctx => {
  replyWithFile(ctx, './client.js', '.js');
});

router.get('/image/:fileName', async ctx => {
  replyWithFile(ctx, 'resources/' + ctx.params.fileName, '.jpg');
});

router.get('/style.css', async ctx => {
  replyWithFile(ctx, './resources/chat.css', '.css');
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
