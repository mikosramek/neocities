'use strict'
const _get = require('lodash.get');
const fs = require('fs-extra');
const path = require('path');

require('dotenv').config();


const { getBasePages, getEntries } = require('./prismic-client');
const baseMeta = require('./meta.config');
const {
    mergeOnto,
    cleanKeys,
    flattenNodes,
    objectifyEdges,
    cleanBodies,
    flattenMetaImages
} = require('./utils/general-utils');
const log = require('./utils/chalk');
const EntryHolder = require('./utils/entry-holder');

const createHome = require('./generators/create-home');
const createLanding = require('./generators/create-landing');
const createPage = require('./generators/create-page');
const createGuestbook = require('./generators/create-guestbook');


const fetchPrismicData = async () => {
    try {
        const data = await getBasePages();

        const home = _get(data, 'allHomes.edges[0].node', {});
        const landing = _get(data, 'allLandings.edges[0].node', {});
        const metaInformation = flattenMetaImages(mergeOnto(baseMeta, home));
        const cleanHome = cleanKeys(home, baseMeta);

        const blog = _get(data, 'allBlogs.edges[0].node', {});

        const guestbook = _get(data, 'allGuestbooks.edges[0].node', {});

        console.info(blog);
        console.info(guestbook);
    
        const allEntries = await getEntries();
        const entries = flattenNodes(_get(allEntries, 'allEntrys.edges'))
        const parsedEntries = objectifyEdges(cleanBodies(entries));
    
        EntryHolder.setEntries(parsedEntries);
    
        // console.log(metaInformation)
        // console.log(JSON.stringify(parsedEntries))
    
        // move entries into globally accessable object
    
        return {
            landing,
            blog,
            guestbook,
            metaInformation,
            home: cleanHome,
            entries: parsedEntries
        }
    }
    catch (error) {
        console.error(error.message);
    }
}


const createPagesAndInjectData = async (pages) => {
    try {
        const { home, landing, entries, metaInformation, blog, guestbook } = pages;
        
        const buildPath = path.resolve(__dirname, 'build');
        
        log.header('Cleaning build folder');
        await fs.emptyDir(buildPath);
        
        log.header(`Creating ${process.env.NODE_ENV} build`);
    
        log.header('Creating Home');
        createHome(home, { ...metaInformation });

        log.header('Creating Landing');
        createLanding(landing, { ...metaInformation });

        log.header('Creating Guestbook');
        createGuestbook(guestbook, { ...metaInformation });
    
        log.header('Creating pages');
        for (const [key, value] of Object.entries(entries)) {
            const { slug } = value;
            log.subtitle(`Creating ${slug}`);
            createPage(slug, value, { ...metaInformation });
        }
    
        log.header('Copying over static files')
        // copy static files into build
        fs.copySync(path.resolve(__dirname, 'static'), buildPath); 
    }
    catch (error) {
        console.error(error.message);
    }
}

fetchPrismicData()
    .then(createPagesAndInjectData);
