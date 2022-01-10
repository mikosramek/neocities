module.exports = `
allAbouts {
  edges {
    node {
      title
      miko_image
      text
      redacted_character
      redact_text
      quotes {
        quote
      }
      badges {
        url
        image_link
      }
    }
  }
}
`;
