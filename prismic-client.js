const { InMemoryCache, IntrospectionFragmentMatcher } = require("apollo-cache-inmemory");
const ApolloClient = require("apollo-client").ApolloClient;
const gql = require("graphql-tag");
const PrismicLink = require("apollo-link-prismic").PrismicLink;
const _get = require('lodash.get');

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

// need to keep going while pageInfo.hasNextPage is true
// then fold in 

const entryQuery = (query = queries.firstEntries, edges = []) => {
    return new Promise((resolve, reject) => {
        client.query({
            query: gql`${query}`
        }).then((response) => {
            const newEdges = _get(response, 'data.allEntrys.edges', []);
            edges.push(...newEdges);
            hasNextPage = _get(response, 'data.allEntrys.pageInfo.hasNextPage', false);
            const lastEntryCursor = _get(newEdges[newEdges.length - 1], 'cursor');
            if (hasNextPage) {
                resolve(entryQuery(queries.entries(lastEntryCursor), edges));
            } else {
                resolve(edges);
            }
        }).catch(reject);
    })
}

const getEntries = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const edges = await entryQuery();
            resolve(edges);
        } catch (e) {
            reject(e);
        }
    })
}

module.exports = {
    getBasePages,
    getEntries
}
