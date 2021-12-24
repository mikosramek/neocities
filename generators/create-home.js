const path = require('path');
const fs = require('fs');
const _get = require('lodash.get');
const { replaceAllKeys } = require('../utils/general-utils');
const log = require('../utils/chalk')

const createHome = (pageData, metaData) => {
  try {
    const filename = path.resolve(__dirname, 'templates', 'home.html');
    const template = fs.readFileSync(filename, 'utf8');

    const body = _get(pageData, 'body', []);
    // console.log(body[0].primary)

    const replacementData = {
      ...metaData,
      title: _get(pageData, 'title[0].text', '')
    }

    const html = replaceAllKeys(template, replacementData);

      // figure out a way to template out sections :)

    const outputPath = path.resolve(__dirname, 'build', 'home');
    if (!fs.existsSync(outputPath)){
      fs.mkdirSync(outputPath);
    }
    
    fs.writeFileSync(`${outputPath}/index.html`, html);
    log.footer(`build/home/index.html created`)
  }
  catch (error) {
    console.error(error)
  }
}


module.exports = createHome;