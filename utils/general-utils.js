const _get = require('lodash.get')
const log = require('./chalk')

const IS_DEV = process.env.NODE_ENV === 'development';

const mergeOnto = (base, objectToImprint) => {
    const newBase = JSON.parse(JSON.stringify(base));
    for (const [key, value] of Object.entries(objectToImprint)) {
        if (newBase[key] !== null && newBase[key] !== undefined) newBase[key] = value;
    }
    return newBase;
}

const cleanKeys = (objectToClean, keysToRemove) => {
    const newBase = JSON.parse(JSON.stringify(objectToClean));
    for (const key of Object.keys(keysToRemove)) {
        delete newBase[key]
    }
    return newBase;
}

const flattenNodes = (edges) => {
    return edges.map(({ node }) => node);
}

const objectifyEdges = (edges) => {
    const map = {};
    edges.forEach((node) => {
        const id = _get(node, '_meta.id', null)
        const slug = _get(node, '_meta.uid')
        delete node._meta;
        map[id] = {
            ...node,
            slug
        };
    })
    return map;
}

cleanBodies = (edges) => {
    return edges.map(({ body, ...rest}) => {
        return {
            ...rest,
            body: cleanBody(body)
        }
    })
}

const flattenMetaImages = (meta) => {
    const { meta_image, ...rest } = meta;
    return {
        ...rest,
        meta_image_base: _get(meta_image, 'url', ''),
        meta_image_twitter: _get(meta_image, 'twitter.url', '')
    }
}

const cleanBody = (body) => {
    return body.map(({ primary, fields, type }) => ({ primary, fields, type }));
}

const replaceAllKeys = (text, objectWithKeys) => {
    let newText = text;
    for (const [key, value] of Object.entries(objectWithKeys)) {
        const test = new RegExp(`%${key}%`, 'gi');
        if (IS_DEV) {
            test.test(newText) ?
                log.green(`✓ ${key}`) :
                log.red(`✗ ${key}`)
        }
        newText = newText.replace(test, value);
    }
    return newText;
}

const getKeys = (keys, object) => {
    const map = {};
    keys.forEach((key) => {
      const value = _get(object, key, null);
      map[key.replace(/\./g, '_')] = value;
    })
    return map;
}

module.exports = {
    mergeOnto,
    cleanKeys,
    flattenNodes,
    objectifyEdges,
    cleanBodies,
    replaceAllKeys,
    flattenMetaImages,
    getKeys,
    IS_DEV
}