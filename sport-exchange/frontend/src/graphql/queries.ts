import { gql } from "urql";

export const PLAYER_ROW = gql`
  fragment PlayerRow on Player {
    id
    name
    symbol
    price
    marketCap
    change24h
  }
`;

export const PLAYERS = gql`
  query Players($limit: Int!, $offset: Int!) {
    players(limit: $limit, offset: $offset) {
      ...PlayerRow
    }
  }
  ${PLAYER_ROW}
`;

export const PLACE_ORDER = gql`
  mutation PlaceOrder($order: OrderInput!) {
    placeOrder(order: $order) {
      id
      status
    }
  }
`;
