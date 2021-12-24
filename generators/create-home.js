const path = require('path');
const fs = require('fs-extra')
const _get = require('lodash.get');

const { getHTMLTemplates, createHTMLPage } = require('../utils/file-grabbing');
const { replaceAllKeys } = require('../utils/general-utils');

const createHome = (pageData, metaData) => {
  try {
    const { template, metaTemplate } = getHTMLTemplates('home');

    const body = _get(pageData, 'body', []);
    // console.log(body[0].primary)

    const replacementData = {
      meta_tags: metaTemplate,
      ...metaData,
      title: _get(pageData, 'title[0].text', '')
    }
    
    // figure out a way to template out sections :)

    const html = replaceAllKeys(template, replacementData);

    createHTMLPage('home', html);

  }
  catch (error) {
    console.error(error)
  }
}


module.exports = createHome;