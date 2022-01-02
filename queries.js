const basePages = `
{
    allHomes {
        edges {
            node {
                title
                meta_image
                meta_page_title
                meta_page_description
                meta_url
                body {
                    ... on HomeBodyBanner {
                        type
                        primary {
                            entry {
                                ... on _Document {
                                    _meta {
                                        id
                                    }
                                }
                            }
                            object_position
                        }
                    }
                    ... on HomeBodyDouble_banner {
                        type
                        primary {
                            left_entry
                            first_object_position
                            second_object_position
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
    allLandings {
        edges {
            node {
                title
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
                    type
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