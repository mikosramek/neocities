# All Manor of Duns

A neocities website to show off my images


## Requirements
- [`make`](https://stackoverflow.com/questions/32127524/how-to-install-and-use-make-in-windows)
- ruby + [neocities gem](https://github.com/neocities/neocities-ruby)
- [Prismic account/repo](https://prismic.io)
- [neocities account](https://neocities.org/)

## Setup
- Get your prismic repo name + access token
- Follow steps in `schema/schemaQuery`
- Fill out `.env`
- Update makefile sitename variable to neocities site
- Login via neocities gem
    - `neocities help`
    - running any command should prompt for a login
- run `make publish`

## Caveats
- slices / setup + graphql is based on my prismic slices, which means graphql + node paths are unique to my repo
- pagination of graphql pages hasn't been tested / verified, as my repo doesn't have enough pages to require it