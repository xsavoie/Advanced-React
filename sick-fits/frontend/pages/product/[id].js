import { useQuery } from "@apollo/client";

const SINGLE_ITEM_QUERY = gql`
query {
  Product(where: {
    id: "61eb0e3cd25ae6c3b48dd6ad"
  }) {
    name
    price
    description
  }
}
`;

export default function SingleProduct({ query }) {
  const {data, loading, query } = useQuery(SINGLE_ITEM_QUERY);

  console.log({data, loading, query});
  return <p>single product {query.id}</p>;
}
