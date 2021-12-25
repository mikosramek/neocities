const _get = require('lodash.get');
const { getHTMLTemplates, createHTMLPage } = require('../utils/file-grabbing');
const { replaceAllKeys, getKeys } = require('../utils/general-utils');


const createPage = (slug, pageData, metaData) => {
  const { template, metaTemplate } = getHTMLTemplates('entry');

  const keys = getKeys([
    'name',
    'description',
    'short_description',
    'meta_image.url',
    'meta_image.twitter.url',
    'big_image.url',
    'big_image.alt',
    'big_image.Mobile.url',
    'big_image.Mobile.alt'
  ], pageData);

  const { meta_image_url, meta_image_twitter_url, ...nonMeta } = keys;
  const title = metaData.meta_page_title;

  
  metaData.meta_url += slug;
  metaData.meta_image_base = meta_image_url;
  metaData.meta_image_twitter = meta_image_twitter_url;
  metaData.meta_page_title = keys.name;
  metaData.meta_page_description = keys.short_description;


  const replacementData = {
    meta_tags: metaTemplate,
    ...metaData,
    ...nonMeta,
    title
  }

  const html = replaceAllKeys(template, replacementData);

  createHTMLPage(slug, html);

}

module.exports = createPage;