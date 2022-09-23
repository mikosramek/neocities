const { InMemoryCache, IntrospectionFragmentMatcher } = require("apollo-cache-inmemory");
const ApolloClient = require("apollo-client").ApolloClient;
const gql = require("graphql-tag");
const PrismicLink = require("apollo-link-prismic").PrismicLink;

const queries = require('./graphql/queries');
const introspectionQueryResultData = require('./schema/fragmentTypes.json');

const fragmentMatcher = new IntrospectionFragmentMatcher({ introspectionQueryResultData });

const client = new ApolloClient({
  link: PrismicLink({
    uri: `https://${process.env.PRISMIC_REPO_NAME}.cdn.prismic.io/graphql`,
    accessToken: process.env.PRISMIC_ACCESS_TOKEN
  }),
  cache: new InMemoryCache({ fragmentMatcher })
});

const getBasePages = () => {
    return new Promise((resolve, reject) => {
        client.query({
            query: gql`${queries.basePages}`
        }).then(response => {
            resolve(response.data);
        }).catch(reject);
    })
}

const getEntries = () => {
    return new Promise((resolve, reject) => {
        client.query({
            query: gql`${queries.firstEntries}`
        }).then((response) => {
            // if data.allEntrys.pageInfo.hasNextPage is true,
            // grab edges.cursor? of last object
            // and recall query :) merging edge nodes
            resolve(response.data)
        }).catch(reject);
    })
}

module.exports = {
    getBasePages,
    getEntries
}
