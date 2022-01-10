const { getSliceTemplate } = require('./file-grabbing');
const { replaceAllKeys, IS_DEV, getReadableDate } = require('./general-utils');

const handleEntries = (entries, showDate = false) => {
  const wrapperTemplate = getSliceTemplate('blog-link-wrapper');
  const template = getSliceTemplate('blog-link');

  return replaceAllKeys(
    wrapperTemplate,
    {
      entries: Object.values(entries).map((entry) => {
        let { name, slug, date } = entry;
        if (IS_DEV) {
          slug = `build/${slug}`;
        }
        return replaceAllKeys(
          template,
          {
            name,
            slug,
            date: showDate ? `${getReadableDate(date)}:` : ''
          }
        );
      }).join('\n')
    }
  );
};



module.exports = {
  handleEntries
};
