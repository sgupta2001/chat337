// https://www.theguardian.com/commentisfree/2018/feb/18/does-every-cloud-have-silver-lining-not-if-run-by-internet-giant
// https://www.bbc.co.uk/news/technology-48841815

const jsdom = require("jsdom");
const { JSDOM } = jsdom;

function content(doc, query) {
    const elem = doc.querySelector(query);
    if (elem) {
        return elem.content;
    } else {
        return null;
    }
}

async function main(params) {
  const url = params.url ? params.url : 'https://example.org/';
  const doc = (await JSDOM.fromURL(url)).window.document;

  let title = doc.querySelector("title");
  if (title) { title = title.innerHTML.trim(); }
  else {
      title = content(doc, "meta[name='twitter:title']");
  }

  const desc = content(doc, "meta[name='description']") || content(doc, "meta[name='twitter:description']");
  const img = content(doc, "meta[name='twitter:image']") || content(doc, "meta[property='og:image']");


  return {url: url,
          title: title,
          desc: desc,
          img:   img,
  };
}
