const _get = require('lodash.get');

const { getHTMLTemplates, createHTMLPage } = require('../utils/file-grabbing');
const { replaceAllKeys, addCredit } = require('../utils/general-utils');
const { handleEntries } = require('../utils/blog');
const { getLinkDetails } = require('../utils/slice-inator');

const createBlog = (pageData, blogEntries, metaData) => {
  try {
    const { template, metaTemplate } = getHTMLTemplates('blog');

    const pinnedId = _get(pageData, 'pinned_entry._meta.id', '');
    const pinnedEntry = getLinkDetails(pinnedId);
    // remove pinned entry from main entries object
    delete blogEntries[pinnedId];

    const pinned_entry = handleEntries([pinnedEntry]); //.replace(/<\/?li/gi, '<div');
    const entries = Object.keys(blogEntries).length > 0 ?
      handleEntries(blogEntries, true) :
      '<!-- Entries -->';

    const replacementData = {
      meta_tags: metaTemplate,
      ...metaData,
      title: _get(pageData, 'title[0].text', ''),
      pinned_entry,
      entries
    }

    const html = addCredit(replaceAllKeys(template, replacementData));

    createHTMLPage('blog', html);
  }
  catch (error) {
    console.error(error)
  }
}


module.exports = createBlog;