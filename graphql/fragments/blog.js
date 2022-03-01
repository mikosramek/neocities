module.exports = `
allBlogs {
  edges {
    node {
      title
      pinned_entry {
        ... on Entry {
          name
          _meta {
            id
            firstPublicationDate
            lastPublicationDate
          }
        }
      }
    }
  }
}
`;
