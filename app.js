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
  ctx.body = `
* { -moz-box-sizing: border-box; -webkit-box-sizing: border-box; box-sizing: border-box; }

html {
    height: 100%;
}
body {
    padding: 0;
    margin: 0;
    font-family: "HelveticaNeue-Light", "Helvetica Neue Light", "Helvetica Neue", "Roboto Light", "Segoe UI Web Light", "Segoe UI Light", "Segoe UI Web Regular", "Segoe UI", Helvetica, Arial, sans-serif;
    background: #f9f9f9;
    color: #333;
}
h1 {
  margin: 0;
  text-rendering: optimizeLegibility;
  font-size: 2em;
  line-height: 58px;
  text-align: center;
  font-weight: normal;
}
.title {
  position: fixed;
  top: 0;
  margin: auto;
  width: 100%;
  left: 0;
  right: 0;
  background: #fff;
}
input[type=text], input[type=submit], button {
  -webkit-appearance: none;
  -moz-appearance: none;
  border: 1px solid #ddd;
  color: #333;
  font-size: 1em;
  padding: .7em 1em;
  margin-bottom: 1em;
}
#chat {
  height: 60px;
  position: fixed;
  bottom: 0;
  margin: auto;
  width: 100%;
  left: 0;
  right: 0;
  background: #fff;
}
#chat input {
  margin-left: 25px;
  position: relative;
  top: 0px;
  width: calc(100% - 75px);
}
#output {
  margin: 60px 1em 60px 1em;
  display: flex;
  flex-direction: column-reverse;
  max-height: 100vh;
  overflow: auto;
}
#output span {
  display: block;
  padding: 0.5em;
  padding-left: 60px;
  clear: both;
  font-size: 1.1em;
}
#output img {
  float: left;
  margin-left: -60px;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  margin-right: 0.5em;
  margin-bottom: 0.5em;
}
#button {
  background: #e6e6e6;
  text-shadow: 0 1px 0 #f3f3f3;
  margin: .5em 0 2em 0 !important;
  display: inline-block;
  top: 0px;
  width: 50px !important;
  position: relative;
}
  `;
});

app.use(router.routes());
app.use(router.allowedMethods());

app.listen(33333);
