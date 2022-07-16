const fs = require('fs');
const path = require('path');

const schema = require('./schema.json')

// Go to graphql url
// run this query
// past this into schema.json
// then run `npm run get-schema`
const url = `https://<prismic repo-name>.prismic.io/graphql`;
const query = `
  {
    __schema {
      types {
        kind
        name
        possibleTypes {
          name 
        }
      }
    }
  }
`

const writeData = () => {
    // here we're filtering out any type information unrelated to unions or interfaces
    const filteredData = schema.data.__schema.types.filter(
      type => type.possibleTypes !== null,
    );

    schema.data.__schema.types = filteredData;
    fs.writeFileSync(path.resolve(__dirname, 'fragmentTypes.json'), JSON.stringify(schema.data), err => {
      if (err) {
        console.error('Error writing fragmentTypes file', err);
      } else {
        console.log('Fragment types successfully extracted!');
      }
    });
  };

  writeData();