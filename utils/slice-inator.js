const _get = require('lodash.get');
const EntryHolder = require('./entry-holder');
const { getSliceTemplate } = require('./file-grabbing');
const { replaceAllKeys, IS_DEV } = require('./general-utils');
const log = require('./chalk');

const handleSlices = (slices) => {
  return slices.map((slice) => {
    const { type, primary, fields } = slice;
    switch(type) {
      case 'banner':
        return handleHomeBodyBanner(primary);
      case 'double_banner':
        return handleHomeDoubleBanner(primary);
      case 'gallery':
        return handleGallery(primary, fields);
      case 'text_entry':
        return handleTextEntry(primary, fields);
      default:
        log.red(`${type} slice not handled`);
        break;
    }
  }).join('\n');
}

const getLinkDetails = (id, prefix = null) => {
  const entry = _get(EntryHolder, `entries[${id}]`, null);
  const slug = _get(entry, 'slug', '');
  const name = _get(entry, 'name', '');
  const thumb = _get(entry, 'thumbnail.url', '');
  const alt = _get(entry, 'thumbnail.alt', '');

  if (prefix) {
    return {
      [`${prefix}_slug`]: slug,
      [`${prefix}_thumb`]: thumb,
      [`${prefix}_alt`]: alt
    }
  }
  return {
    slug,
    thumb,
    alt,
    name
  }
}

getMetaDetails = (id) => {
  const entry = _get(EntryHolder, `entries[${id}]`, null);
  return {
    lastPublicationDate: _get(entry, 'lastPublicationDate', ''),
    date: _get(entry, 'date', '')
  }
}

const handleHomeBodyBanner = (primary) => {
  const id = _get(primary, 'entry._meta.id', null);
  const objectPosition = _get(primary, 'object_position', '50% 50%');
  if (!id) return null;

  let { slug, thumb, alt } = getLinkDetails(id);

  const template = getSliceTemplate('banner');

  if (IS_DEV) {
    slug = `build/${slug}`;
  }

  const keys = {
    image_url: thumb,
    image_alt: alt,
    style: `object-position: ${objectPosition};`,
    slug,
  };

  return replaceAllKeys(template, keys);
}

const handleHomeDoubleBanner = (primary) => {
  const firstId = _get(primary, 'first_entry._meta.id', null);
  const secondId = _get(primary, 'second_entry._meta.id', null);

  if (!firstId || !secondId) return null;

  const leftEntry = _get(primary, 'left_entry', false);
  const firstObjectPosition = _get(primary, 'first_object_position', '50% 50%');
  const secondObjectPosition = _get(primary, 'second_object_position', '50% 50%');

  const firstEntry = getLinkDetails(firstId, 'first');
  const secondEntry = getLinkDetails(secondId, 'second');
  
  if (IS_DEV) {
    firstEntry.first_slug = `build/${firstEntry.first_slug}`;
    secondEntry.second_slug = `build/${secondEntry.second_slug}`;
  }
  
  const template = getSliceTemplate('double-banner');
  const keys = {
    flex_class: leftEntry ? '' : 'reverse',
    first_style: `object-position: ${firstObjectPosition};`,
    second_style: `object-position: ${secondObjectPosition};`,
    ...firstEntry,
    ...secondEntry
  };

  return replaceAllKeys(template, keys);
}

const handleGallery = (primary, fields) => {
  const { gallery_title } = primary;

  const imageTemplate = getSliceTemplate('gallery-image');
  const imageHtml = fields.map((field) => {
    return replaceAllKeys(imageTemplate, {
      image_url: _get(field, 'gallery_image.url', ''),
      image_alt: _get(field, 'gallery_image.alt', '')
    });
  }).join('\n');

  const galleryWrapperTemplate = getSliceTemplate('gallery-wrapper');

  return replaceAllKeys(galleryWrapperTemplate,
    {
      title: gallery_title ? `<h2 class="Slice__gallery-title">${gallery_title}</h2>`: '<!-- title -->',
      images: imageHtml,
    }
  );
}

const handleRichText = (fields) => {
  const paragraphTemplate = getSliceTemplate('paragraph');

  return fields.map((field) => {
    const paragraph = _get(field, 'text', {});
    if (Array.isArray(paragraph)) {
      return paragraph.map(({ text }) => {
        return replaceAllKeys(paragraphTemplate, { copy: injectStyleTags(text) });
      }).join('\n');
    } else {
      return replaceAllKeys(paragraphTemplate, { copy: injectStyleTags(paragraph) });
    }
  }).join('\n');
}

const redactText = (text, replacementCharacter = '_') => {
  const regexStart = /[^_]_[^_ ,]/g;
  const regexEnd = /[^_ ]_[^_]/g;
  const starts = [...text.matchAll(regexStart)];
  const ends = [...text.matchAll(regexEnd)];
  const stringsToReplace = [];

  for (let i = 0; i < starts.length; i++) {
    const startIndex = starts[i].index;
    const endIndex = ends[i].index;

    stringsToReplace.push(text.slice(startIndex + 1, endIndex + 2));
    const stringToReplace = text.slice(startIndex + 1, endIndex + 2);
    text = text.replace(stringToReplace, replacementCharacter.repeat(stringToReplace.length));
  }
  return text;
}

const handleTextEntry = (primary, fields) => {
  const entryTemplate = getSliceTemplate('text-entry');
  
  const subheading = _get(primary, 'subheading', '');
  const text = handleRichText(fields);

  return replaceAllKeys(entryTemplate,
    {
      subheading,
      text
    })
}

const injectStyleTags = (text) => {
  const tags = {
    '&b ' : '<span class="Global__bold">',
    ' e&' : '</span>' // end span
  }

  const newText = Object.entries(tags).reduce((total, [key, value]) => {
    return total.replace(new RegExp(key, 'gi'), value);
  }, text);

  return newText;
}


module.exports = {
  handleSlices,
  getLinkDetails,
  handleRichText,
  redactText,
  getMetaDetails
};
