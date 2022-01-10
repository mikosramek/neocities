const _get = require('lodash.get');

const { getHTMLTemplates, createHTMLPage } = require('../utils/file-grabbing');
const { replaceAllKeys, addCredit } = require('../utils/general-utils');
const { handleSlices } = require('../utils/slice-inator');

const createHome = (pageData, metaData) => {
  try {
    const { template, metaTemplate } = getHTMLTemplates('home');

    const body = _get(pageData, 'body', []);

    const slices = handleSlices(body);

    const replacementData = {
      meta_tags: metaTemplate,
      ...metaData,
      slices,
      title: _get(pageData, 'title[0].text', '')
    }

    const html = addCredit(replaceAllKeys(template, replacementData));

    createHTMLPage('home', html);
  }
  catch (error) {
    console.error(error)
  }
}


module.exports = createHome;