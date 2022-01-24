import gql from 'graphql-tag';
import { PAGINATION_QUERY } from '../components/Pagination';

export default function paginationField() {
  return {
    keyArgs: false,
    read(existing = [], { args, cache }) {
      // console.log(existing, args, cache);
      const { skip, first } = args;

      // read number of items on the page from cache
      const data = cache.readQuery({ query: PAGINATION_QUERY });
      const count = data?._allProductsMeta?.count;
      const page = skip / first + 1;
      const pages = Math.ceil(count / first);
      // check if we have existing items + filter out undefined
      const items = existing.slice(skip, skip + first).filter((x) => x);
      // if there are items + there arn't enough items to satisfy how many were requested + we are on last page
      // then just send it
      if (items.length && items.length !== first && page === pages) {
        return items;
      }

      if (items.length !== first) {
        // no items, go fetch network
        return false;
      }

      if (items.length) {
        // console.log(`There are ${items.length} items in the cache, sending to apollo`);
        return items;
      }

      return false;
    },
    merge(existing, incoming, { args }) {
      const { skip, first } = args;
      console.log(`merging items from network, ${incoming.length}`);
      const merged = existing ? existing.slice(0) : [];
      for (let i = skip; i < skip + incoming.length; i++) {
        merged[i] = incoming[i - skip];
      }
      console.log(merged);
      return merged;
    },
  };
}
