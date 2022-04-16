const { getSliceTemplate } = require('./file-grabbing');
const { replaceAllKeys, IS_DEV, getReadableDate } = require('./general-utils');
const { getDaysSince } = require('./date-helper');

const handleEntries = (entries, showDate = false) => {
  const wrapperTemplate = getSliceTemplate('blog-link-wrapper');
  const template = getSliceTemplate('blog-link');

  return replaceAllKeys(
    wrapperTemplate,
    {
      entries: Object.values(entries).map((entry) => {
        let { name, slug, date, lastPublicationDate } = entry;
        if (IS_DEV) {
          slug = `build/${slug}`;
        }
        const daysSinceLastPub = getDaysSince(lastPublicationDate);
        const daysSinceFirstPub = getDaysSince(date);
        return replaceAllKeys(
          template,
          {
            name,
            slug,
            date: showDate ? `${getReadableDate(date)}:` : '',
            new: daysSinceFirstPub < 7 ? 'visible' : 'hidden', // 7 days from date
            updated: daysSinceLastPub < 7 ? 'visible' : 'hidden' // 7 days from lastPublicationDate
          }
        );
      }).join('\n')
    }
  );
};



module.exports = {
  handleEntries
};
