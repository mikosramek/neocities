const _get = require("lodash.get");

const { getHTMLTemplates, createHTMLPage } = require("../utils/file-grabbing");
const { replaceAllKeys, addCredit, IS_DEV } = require("../utils/general-utils");
const { getSliceTemplate } = require("../utils/file-grabbing");

const handleListEntry = (listEntries) => {
  const wrapperTemplate = getSliceTemplate("lists-link-wrapper");
  const template = getSliceTemplate("lists-link");

  return replaceAllKeys(wrapperTemplate, {
    entries: Object.values(listEntries)
      .map((entry) => {
        let { name, slug } = entry;
        if (IS_DEV) {
          slug = `build/${slug}`;
        }
        return replaceAllKeys(template, {
          slug,
          name,
        });
      })
      .join("\n"),
  });
};

const createLists = (pageData, listEntries, metaData) => {
  try {
    const { template, metaTemplate } = getHTMLTemplates("lists");

    const lists =
      Object.keys(listEntries).length > 0
        ? handleListEntry(listEntries)
        : "<!-- Entries -->";

    const replacementData = {
      meta_tags: metaTemplate,
      ...metaData,
      title: _get(pageData, "title[0].text", ""),
      lists,
    };

    const html = addCredit(replaceAllKeys(template, replacementData));
    createHTMLPage("lists", html);
  } catch (error) {
    console.error(error);
  }
};

module.exports = createLists;
