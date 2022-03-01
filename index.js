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
    flattenMetaImages,
    tagEntries
} = require('./utils/general-utils');
const log = require('./utils/chalk');
const EntryHolder = require('./utils/entry-holder');

const createHome = require('./generators/create-home');
const createLanding = require('./generators/create-landing');
const createPage = require('./generators/create-page');
const createGuestbook = require('./generators/create-guestbook');
const createBlog = require('./generators/create-blog');
const createAbout = require('./generators/create-about');


const fetchPrismicData = async () => {
    try {
        const data = await getBasePages();

        const home = _get(data, 'allHomes.edges[0].node', {});
        const landing = _get(data, 'allLandings.edges[0].node', {});
        const metaInformation = flattenMetaImages(mergeOnto(baseMeta, home));
        const cleanHome = cleanKeys(home, baseMeta);

        const blog = _get(data, 'allBlogs.edges[0].node', {});

        const guestbook = _get(data, 'allGuestbooks.edges[0].node', {});
        const about = _get(data, 'allAbouts.edges[0].node', {});
    
        const allEntries = await getEntries();
        // remove node key from object
        const entries = flattenNodes(_get(allEntries, 'allEntrys.edges'));
        // get rid of unneeded _meta info
        const parsedEntries = objectifyEdges(cleanBodies(entries));
        // separate each entry into tagged objects
        const taggedEntries = tagEntries(parsedEntries);
    
        EntryHolder.setEntries(parsedEntries);
    
        return {
            landing,
            blog,
            guestbook,
            about,
            metaInformation,
            home: cleanHome,
            miniEntries: taggedEntries.mini,
            blogEntries: taggedEntries.blog,
        }
    }
    catch (error) {
        console.error(error.message);
    }
}


const createPagesAndInjectData = async (pages) => {
    try {
        const { home, landing, miniEntries, blogEntries, metaInformation, blog, guestbook, about } = pages;
        
        const buildPath = path.resolve(__dirname, 'build');
        
        log.header('Cleaning build folder');
        await fs.emptyDir(buildPath);
        
        log.header(`Creating ${process.env.NODE_ENV} build`);
    
        // in these calls, we spread certain objects so that we're not changing them as we move through the pages
        // the spread creates a "new" object
        log.header('Creating Home');
        createHome(home, { ...metaInformation });

        log.header('Creating Landing');
        createLanding(landing, { ...metaInformation });

        log.header('Creating Blog');
        createBlog(blog, { ...blogEntries }, { ...metaInformation });

        log.header('Creating Guestbook');
        createGuestbook(guestbook, { ...metaInformation });

        log.header('Creating About');
        createAbout(about, { ...metaInformation });
    
        log.header('Creating mini pages');
        for (const value of Object.values(miniEntries)) {
            const { slug } = value;
            log.subtitle(`Creating ${slug}`);
            createPage(slug, value, { ...metaInformation }, 'home');
        }

        log.header('Creating blog pages');
        for (const value of Object.values(blogEntries)) {
            const { slug } = value;
            log.subtitle(`Creating ${slug}`);
            createPage(slug, value, { ...metaInformation }, 'blog');
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
