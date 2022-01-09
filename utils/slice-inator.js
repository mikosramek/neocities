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


module.exports = {
  handleSlices,
  getLinkDetails
};
