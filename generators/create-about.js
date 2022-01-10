
const _get = require('lodash.get');
const { getHTMLTemplates, createHTMLPage } = require('../utils/file-grabbing');
const { replaceAllKeys, addCredit } = require('../utils/general-utils');
const { handleRichText, redactText } = require('../utils/slice-inator');

const handleQuotes = (quotes) => {
  return quotes.map(({ quote }) => {
    const { template } = getHTMLTemplates('quote');
    return replaceAllKeys(template, { quote })
  }).join('\n');
}

const handleBadges = (badges) => {
  return badges.map(({ url = '', image_link }) => {
    const { template } = getHTMLTemplates('badge');
    return replaceAllKeys(template, { url, image_link });
  }).join('\n');
}

const createLanding = (pageData, metaData) => {
  try {
    const { template, metaTemplate } = getHTMLTemplates('about');
    
    const image = _get(pageData, 'miko_image', {});
    const twitterImage = _get(image, 'Twitter.url', '');
    
    metaData.meta_image_twitter = twitterImage;

    const redactedCharacter = _get(pageData, 'redacted_character', undefined);
    const shouldRedactText = _get(pageData, 'redact_text', false);

    const bio = handleRichText(_get(pageData, 'text', []));
    const title = _get(pageData, 'title', '');

    const redactedBio = shouldRedactText ? redactText(bio, redactedCharacter) : bio;
    const redactedTitle = shouldRedactText ? redactText(title, redactedCharacter) : title;

    const quotes = handleQuotes(_get(pageData, 'quotes', []));
    const badges = handleBadges(_get(pageData, 'badges', []));
  
    const replacementData = {
      meta_tags: metaTemplate,
      ...metaData,
      title: redactedTitle,
      img_src: _get(image, 'url', ''),
      img_alt: _get(image, 'alt', ''),
      bio: redactedBio,
      quotes,
      badges
    }
    const html = addCredit(replaceAllKeys(template, replacementData));
  
    createHTMLPage('about', html);
  } catch (error) {
    console.error(error);
  }
}

module.exports = createLanding;
