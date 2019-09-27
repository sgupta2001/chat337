import Koa from 'koa';
import Router from 'koa-router';
import { readFileSync, existsSync } from 'fs';

const app = new Koa();
const router = new Router();

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

app.use(router.routes());
app.use(router.allowedMethods());

app.listen(33333);
