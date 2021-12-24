'use strict'
const _get = require('lodash.get')

if (process.env.NODE_ENV === 'development') {
    require('dotenv').config();
}

const { getHomeAndLanding, getEntries } = require('./prismic-client');
const baseMeta = require('./meta.config');
const {
    mergeOnto,
    cleanKeys,
    flattenNodes,
    objectifyEdges,
    cleanBodies,
    flattenMetaImages
} = require('./utils/general-utils');
const log = require('./utils/chalk')
const createHome = require('./generators/create-home');


const fetchPrismicData = async () => {
    const data = await getHomeAndLanding();
    const home = _get(data, 'allHomes.edges[0].node', {});
    const landing = _get(data, 'allLandings.edges[0].node', {});
    const metaInformation = flattenMetaImages(mergeOnto(baseMeta, home));
    const cleanHome = cleanKeys(home, baseMeta);

    const allEntries = await getEntries();
    const entries = flattenNodes(_get(allEntries, 'allEntrys.edges'))
    const parsedEntries = objectifyEdges(cleanBodies(entries));

    // console.log(metaInformation)
    // console.log(JSON.stringify(parsedEntries))

    // move entries into globally accessable object

    return {
        home: cleanHome,
        landing,
        metaInformation,
        entries: parsedEntries
    }
}


const createPagesAndInjectData = (pages) => {
    const { home, landing, entries, metaInformation } = pages;


    log.header('Creating Home')
    createHome(home, metaInformation);

    for (const [key, value] of Object.entries(entries)) {
        const { slug } = value;
        log.header(`Creating ${slug}`)
        log.footer(`Finished ${slug}`)
    }
    console.info('Done creating pages.')
}

fetchPrismicData()
    .then(createPagesAndInjectData);
