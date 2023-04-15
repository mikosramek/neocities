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
          ... on EntryBodyModel {
            type
            primary {
              model {
                ... on _FileLink {
                  url
                }
              }
            }
          }
          ... on EntryBodyGallery {
              type
              primary {
                  gallery_title
              }
              fields {
                  gallery_image
              }
          }
          ... on EntryBodyWideimage {
            type
            fields {
              image
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
          ... on EntryBodyList {
            type
            primary {
              list_title
              list_description
            }
            fields {
              list_entry_name
              list_entry_image
              list_entry_spell
              list_entry_other
              list_entry_general
              list_entry_artefact
              list_entry_description
              list_entry_command_trait
            }
          }
      }
  }
}
`;
