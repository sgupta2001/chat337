const https = require('https');

async function main(params) {
  const url = params.url ? params.url : 'https://example.org/';
  const result = await readUrl(url);
  const title = result.match(/<title[^>]*>([^<]+)<\/title>/)[1];
  return {url: url, title: title.trim()};
}

function readUrl(url) {
  return new Promise(function(resolve, reject) {
    https.get(url, (resp) => {
      let data = '';

      resp.on('data', (chunk) => {
        data += chunk;
      });

      resp.on('end', () => {
        resolve(data);
      });
    }).on("error", (err) => {
      reject(err);
    });
  });
}
