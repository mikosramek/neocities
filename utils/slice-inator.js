const _get = require('lodash.get');
const EntryHolder = require('./entry-holder');
const { getSliceTemplate } = require('./file-grabbing');
const { replaceAllKeys } = require('./general-utils');

const handleSlices = (slices) => {
  return slices.map((slice) => {
    const { __typename, primary } = slice;
    switch(__typename) {
      case 'HomeBodyBanner':
        return handleHomeBodyBanner(primary);
    }
  }).join('\n');
}

const handleHomeBodyBanner = (primary) => {
  const id = _get(primary, 'entry._meta.id', null);
  const objectPosition = _get(primary, 'object_position', '50% 50%');
  if (!id) return null;

  const entry = _get(EntryHolder, `entries[${id}]`, null);
  if (!entry) return null;

  let slug = _get(entry, 'slug', '');
  const thumb = _get(entry, 'thumbnail.url', '');
  const alt = _get(entry, 'thumbnail.alt', '');

  const template = getSliceTemplate('banner');

  if (process.env.NODE_ENV === 'development') {
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


module.exports = handleSlices;
