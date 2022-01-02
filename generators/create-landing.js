
const _get = require('lodash.get');
const { getHTMLTemplates, createHTMLPage } = require('../utils/file-grabbing');
const { replaceAllKeys } = require('../utils/general-utils');

const createLanding = (pageData, metaData) => {
  try {
    const { template, metaTemplate } = getHTMLTemplates('landing');
  
    const replacementData = {
      meta_tags: metaTemplate,
      ...metaData,
      title: _get(pageData, 'title[0].text', ''),
      background_image: _get(pageData, 'background_image.url', '')
    }
    const html = replaceAllKeys(template, replacementData);
  
    createHTMLPage(null, html);
  } catch (error) {
    console.error(error);
  }
}

module.exports = createLanding;
