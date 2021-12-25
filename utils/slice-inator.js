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
  })
}

const handleHomeBodyBanner = (primary) => {
  const id = _get(primary, 'entry._meta.id', null);
  if (!id) return null;

  const entry = _get(EntryHolder, `entries[${id}]`, null);
  if (!entry) return null;

  const slug = _get(entry, 'slug', '');
  const thumb = _get(entry, 'thumbnail.url', '');
  const alt = _get(entry, 'thumbnail.alt', '');

  const template = getSliceTemplate('banner');

  const keys = {
    image_url: thumb,
    image_alt: alt,
    slug
  };

  return replaceAllKeys(template, keys);
}


module.exports = handleSlices;
