module.exports = `
edges {
  cursor
  node {
      _meta {
          id
          uid
          tags
          lastPublicationDate
          firstPublicationDate
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
          ... on EntryBodyText_entry {
            type
            primary {
              subheading
            }
            fields {
              text
            }
          }
      }
  }
}
`;
