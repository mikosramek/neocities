const path = require('path');
const fs = require('fs-extra');

const getHTMLTemplates = (pageName) => {
  const filename = path.resolve(__dirname, '..', 'templates', `${pageName}.html`);
  const metaFile = path.resolve(__dirname, '..', 'templates', 'meta.html');
  const template = fs.readFileSync(filename, 'utf8');
  const metaTemplate = fs.readFileSync(metaFile, 'utf8');

  return {
    template,
    metaTemplate
  }
};

const createHTMLPage = (pageName, html, ) => {
  const outputPath = path.resolve(__dirname, '..', 'build', pageName ? pageName : '');
  if (!fs.existsSync(outputPath)){
    fs.mkdirSync(outputPath);
  }
  
  fs.writeFileSync(`${outputPath}/index.html`, html);
}

module.exports = {
  getHTMLTemplates,
  createHTMLPage,
}