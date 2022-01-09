const _get = require('lodash.get');
const { getHTMLTemplates, createHTMLPage } = require('../utils/file-grabbing');
const { replaceAllKeys, getKeys, IS_DEV } = require('../utils/general-utils');
const { handleSlices } = require('../utils/slice-inator');

const createPage = (slug, pageData, metaData, returnPage) => {
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

  const description = keys.description ? keys.description.reduce((total, current) => {
    const { text } = current;
    if (!text) return total + '<br>';
    return total + `
      <p class="Entry__header-description-copy">
        ${text}
      </p>
    `
  }, '') : '<!-- Description -->';
  
  metaData.meta_url += slug;
  metaData.meta_image_base = meta_image_url;
  metaData.meta_image_twitter = meta_image_twitter_url;
  metaData.meta_page_title = keys.name;
  metaData.meta_page_description = keys.short_description;

  const body = _get(pageData, 'body', []);
  const slices = body ? handleSlices(body) : '<!-- Body -->';

  const replacementData = {
    meta_tags: metaTemplate,
    ...metaData,
    ...nonMeta,
    title,
    description,
    gallery: slices,
    back_link: IS_DEV ? `/build/${returnPage}` : `/${returnPage}`
  }

  const html = replaceAllKeys(template, replacementData);

  createHTMLPage(slug, html);

}

module.exports = createPage;