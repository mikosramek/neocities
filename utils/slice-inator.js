const _get = require("lodash.get");
const { v4: uuidv4 } = require("uuid");
const EntryHolder = require("./entry-holder");
const { getSliceTemplate } = require("./file-grabbing");
const { replaceAllKeys, IS_DEV } = require("./general-utils");
const log = require("./chalk");

const handleSlices = (slices) => {
  return slices
    .map((slice) => {
      const { type, primary, fields } = slice;
      switch (type) {
        case "banner":
          return handleHomeBodyBanner(primary);
        case "double_banner":
          return handleHomeDoubleBanner(primary);
        case "gallery":
          return handleGallery(primary, fields);
        case "text_entry":
          return handleTextEntry(primary, fields);
        case "wideimage":
          return handleWideImage(fields);
        case "model":
          return handleModel(primary);
        case "list":
          return handleList(primary, fields);
        default:
          console.log(slice);
          log.red(`${type} slice not handled`);
          break;
      }
    })
    .join("\n");
};

const getLinkDetails = (id, prefix = null) => {
  const entry = _get(EntryHolder, `entries[${id}]`, null);
  const slug = _get(entry, "slug", "");
  const name = _get(entry, "name", "");
  const thumb = _get(entry, "thumbnail.url", "");
  const alt = _get(entry, "thumbnail.alt", "");

  if (prefix) {
    return {
      [`${prefix}_slug`]: slug,
      [`${prefix}_thumb`]: thumb,
      [`${prefix}_alt`]: alt,
    };
  }
  return {
    slug,
    thumb,
    alt,
    name,
  };
};

getMetaDetails = (id) => {
  const entry = _get(EntryHolder, `entries[${id}]`, null);
  return {
    lastPublicationDate: _get(entry, "lastPublicationDate", ""),
    date: _get(entry, "date", ""),
  };
};

const handleHomeBodyBanner = (primary) => {
  const id = _get(primary, "entry._meta.id", null);
  const objectPosition = _get(primary, "object_position", "50% 50%");
  if (!id) return null;

  let { slug, thumb, alt } = getLinkDetails(id);

  const template = getSliceTemplate("banner");

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
};

const handleHomeDoubleBanner = (primary) => {
  const firstId = _get(primary, "first_entry._meta.id", null);
  const secondId = _get(primary, "second_entry._meta.id", null);

  if (!firstId || !secondId) return null;

  const leftEntry = _get(primary, "left_entry", false);
  const firstObjectPosition = _get(primary, "first_object_position", "50% 50%");
  const secondObjectPosition = _get(
    primary,
    "second_object_position",
    "50% 50%"
  );

  const firstEntry = getLinkDetails(firstId, "first");
  const secondEntry = getLinkDetails(secondId, "second");

  if (IS_DEV) {
    firstEntry.first_slug = `build/${firstEntry.first_slug}`;
    secondEntry.second_slug = `build/${secondEntry.second_slug}`;
  }

  const template = getSliceTemplate("double-banner");
  const keys = {
    flex_class: leftEntry ? "" : "reverse",
    first_style: `object-position: ${firstObjectPosition};`,
    second_style: `object-position: ${secondObjectPosition};`,
    ...firstEntry,
    ...secondEntry,
  };

  return replaceAllKeys(template, keys);
};

const handleWideImage = (fields) => {
  const imageTemplate = getSliceTemplate("wide-image");
  const imageHtml = fields
    .map((field) => {
      return replaceAllKeys(imageTemplate, {
        image_url: _get(field, "image.url", ""),
        image_alt: _get(field, "image.alt", ""),
      });
    })
    .join("\n");

  const galleryWrapperTemplate = getSliceTemplate("wide-image-wrapper");

  return replaceAllKeys(galleryWrapperTemplate, {
    title: "<!-- title -->",
    images: imageHtml,
  });
};

const handleGallery = (primary, fields) => {
  const { gallery_title } = primary;

  const imageTemplate = getSliceTemplate("gallery-image");
  const imageHtml = fields
    .map((field) => {
      return replaceAllKeys(imageTemplate, {
        image_url: _get(field, "gallery_image.url", ""),
        image_alt: _get(field, "gallery_image.alt", ""),
      });
    })
    .join("\n");

  const galleryWrapperTemplate = getSliceTemplate("gallery-wrapper");

  return replaceAllKeys(galleryWrapperTemplate, {
    title: gallery_title
      ? `<h2 class="Slice__gallery-title">${gallery_title}</h2>`
      : "<!-- title -->",
    images: imageHtml,
  });
};

const handleRichText = (fields) => {
  const paragraphTemplate = getSliceTemplate("paragraph");

  return fields
    .map((field) => {
      const paragraph = _get(field, "text", {});
      if (Array.isArray(paragraph)) {
        return paragraph
          .map(({ text }) => {
            return replaceAllKeys(paragraphTemplate, {
              copy: injectStyleTags(text),
            });
          })
          .join("\n");
      } else {
        return replaceAllKeys(paragraphTemplate, {
          copy: injectStyleTags(paragraph),
        });
      }
    })
    .join("\n");
};

const redactText = (text, replacementCharacter = "_") => {
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
    text = text.replace(
      stringToReplace,
      replacementCharacter.repeat(stringToReplace.length)
    );
  }
  return text;
};

const handleTextEntry = (primary, fields) => {
  const entryTemplate = getSliceTemplate("text-entry");

  const subheading = _get(primary, "subheading", "");
  const text = handleRichText(fields);

  return replaceAllKeys(entryTemplate, {
    subheading,
    text,
  });
};

const handleModel = (primary) => {
  const modelTemplate = getSliceTemplate("model");

  const modelUrl = _get(primary, "model.url", "");

  const uuid = uuidv4();

  return replaceAllKeys(modelTemplate, {
    modelUrl,
    uuid,
  });
};

const handleList = (primary, fields) => {
  const listTemplate = getSliceTemplate("list");

  const listEntryTemplate = getSliceTemplate("list-entry");
  const entriesHtml = fields
    .map((field) => {
      const description = _get(field, "list_entry_description", "");
      const trait = _get(field, "list_entry_command_trait", "");
      const artefact = _get(field, "list_entry_artefact", "");
      const spell = _get(field, "list_entry_spell", "");
      const other = _get(field, "list_entry_other", "");

      return replaceAllKeys(listEntryTemplate, {
        name: _get(field, "list_entry_name", ""),
        image_url: _get(field, "list_entry_image.url", ""),
        image_alt: _get(field, "list_entry_image.alt", ""),
        description: description
          ? `<p class="Slice__list-entry-description">${description}</p>`
          : "<!-- description -->",
        general: _get(field, "list_entry_general", false)
          ? '<p class="Slice__list-entry-general">General</p>'
          : "<!-- not a general -->",
        trait: trait
          ? `<p class="Slice__list-entry-trait">Command trait: <span>${trait}</span></p>`
          : "<!-- command trait -->",
        artefact: artefact
          ? `<p class="Slice__list-entry-artefact">Taken Artefact: <span>${artefact}</span></p>`
          : "<!-- artefact -->",
        spell: spell
          ? `<p class="Slice__list-entry-spell">Known spells: <span>${spell}</span></p>`
          : "<!-- spell -->",
        other: other
          ? `<p class="Slice__list-entry-other">${other}</p>`
          : "<!-- other -->",
      });
    })
    .join("\n");

  return replaceAllKeys(listTemplate, {
    title: _get(primary, "list_title[0].text", ""),
    description: injectStyleTags(_get(primary, "list_description[0].text", "")),
    entries: entriesHtml,
  });
};

const injectStyleTags = (text) => {
  const tags = {
    "&b ": '<span class="Global__bold">',
    " e&": "</span>", // end span
  };

  const newText = Object.entries(tags).reduce((total, [key, value]) => {
    return total.replace(new RegExp(key, "gi"), value);
  }, text);

  return newText;
};

module.exports = {
  handleSlices,
  getLinkDetails,
  handleRichText,
  redactText,
  getMetaDetails,
};
