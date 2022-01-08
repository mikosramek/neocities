const _get = require('lodash.get');

const { getHTMLTemplates, createHTMLPage } = require('../utils/file-grabbing');
const { replaceAllKeys } = require('../utils/general-utils');


const createGuestbook = (pageData, metaData) => {
  const { template, metaTemplate } = getHTMLTemplates('guestbook');

  const replacementData = {
    meta_tags: metaTemplate,
    ...metaData,
    title: _get(pageData, 'title[0].text', ''),
    intro_blurb: _get(pageData, 'intro_blurb', ''),
    embed: _get(pageData, 'embed', ''),
  }

  const html = replaceAllKeys(template, replacementData);

  createHTMLPage('guest-book', html);
}

module.exports = createGuestbook;
