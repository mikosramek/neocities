const basePages = `
{
    allHomes (id: "YcUf8RIAAC0AZTym") {
        edges {
            node {
                title
                meta_image
                meta_page_title
                meta_page_description
                meta_url
                body {
                    ... on HomeBodyBanner {
                        primary {
                            entry {
                                ... on _Document {
                                    _meta {
                                        id
                                    }
                                }
                            }
                        }
                    }
                    ... on HomeBodyDouble_banner {
                        primary {
                            left_entry
                            first_entry {
                                ... on _Document {
                                    _meta {
                                        id
                                    }
                                }
                            }
                            second_entry {
                                ... on _Document {
                                    _meta {
                                        id
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    allLandings (id: "YcUgIBIAAC4AZT1_") {
        edges {
            node {
                title
                model_name
                enter_button_copy
                background_image
            }
        } 
    }
}
`

const baseEntryEdges = `
    edges {
        cursor
        node {
            _meta {
                id
                uid
            }
            name
            thumbnail
            description
            short_description
            meta_image
            big_image
            body {
                __typename
                ... on EntryBodyGallery {
                    primary {
                        gallery_title
                    }
                    fields {
                        gallery_image
                    }
                }
            }
        }
    }
`

const firstEntries = `
{
    allEntrys (sortBy:meta_firstPublicationDate_ASC) {
        totalCount
        pageInfo {
            hasNextPage
        }
        ${baseEntryEdges}
    }
}
`

const entries = `
{
    allEntrys (after: "YXJyYXljb25uZWN0aW9uOjA", first: 20, sortBy:meta_firstPublicationDate_ASC) {
        totalCount
        pageInfo {
            hasNextPage
        }
        ${baseEntryEdges}
    }
}
`

module.exports = {
    basePages,
    firstEntries,
    entries
}