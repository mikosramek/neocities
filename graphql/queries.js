const home = require("./fragments/home");
const landing = require("./fragments/landing");
const guestbook = require("./fragments/guestbook");
const blog = require("./fragments/blog");
const lists = require("./fragments/lists");
const about = require("./fragments/about");
const baseEntries = require("./fragments/baseEntries");

const basePages = `
{
    ${home}
    ${landing}
    ${guestbook}
    ${blog}
    ${about}
    ${lists}
}
`;

const firstEntries = `
{
    allEntrys (sortBy:meta_firstPublicationDate_ASC) {
        totalCount
        pageInfo {
            hasNextPage
        }
        ${baseEntries}
    }
}
`;

const entries = (lastId) => `
{
    allEntrys (after: "${lastId}", first: 20, sortBy:meta_firstPublicationDate_ASC) {
        totalCount
        pageInfo {
            hasNextPage
        }
        ${baseEntries}
    }
}
`;

module.exports = {
  basePages,
  firstEntries,
  entries,
};
