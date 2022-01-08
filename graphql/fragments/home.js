module.exports = `
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
`;
