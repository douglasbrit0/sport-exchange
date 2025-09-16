import gql from 'graphql-tag';
import * as Urql from 'urql';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
};

export type Liquidity = {
  __typename?: 'Liquidity';
  ammK?: Maybe<Scalars['Float']['output']>;
  depthBest?: Maybe<Scalars['Float']['output']>;
  depthMid?: Maybe<Scalars['Float']['output']>;
  spreadBps?: Maybe<Scalars['Float']['output']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  _noop?: Maybe<Scalars['Boolean']['output']>;
  placeOrder: OrderResult;
};


export type MutationPlaceOrderArgs = {
  order: OrderInput;
};

export type Ohlc = {
  __typename?: 'OHLC';
  close: Scalars['Float']['output'];
  high: Scalars['Float']['output'];
  low: Scalars['Float']['output'];
  open: Scalars['Float']['output'];
  timestamp: Scalars['String']['output'];
};

export type OrderInput = {
  limitPrice?: InputMaybe<Scalars['Float']['input']>;
  playerId: Scalars['ID']['input'];
  side: OrderSide;
  size: Scalars['Float']['input'];
  timeInForce?: InputMaybe<TimeInForce>;
};

export type OrderResult = {
  __typename?: 'OrderResult';
  avgPrice: Scalars['Float']['output'];
  filledSize: Scalars['Float']['output'];
  id: Scalars['ID']['output'];
  status: Scalars['String']['output'];
};

export enum OrderSide {
  Buy = 'BUY',
  Sell = 'SELL'
}

export type Player = {
  __typename?: 'Player';
  chain?: Maybe<Scalars['String']['output']>;
  change24h: Scalars['Float']['output'];
  circulatingSupply: Scalars['Float']['output'];
  contractAddress?: Maybe<Scalars['String']['output']>;
  decimals?: Maybe<Scalars['Int']['output']>;
  id: Scalars['ID']['output'];
  liquidity?: Maybe<Liquidity>;
  marketCap: Scalars['Float']['output'];
  name: Scalars['String']['output'];
  ohlc24h?: Maybe<Ohlc>;
  position?: Maybe<Scalars['String']['output']>;
  price: Scalars['Float']['output'];
  sentimentScore?: Maybe<Scalars['Float']['output']>;
  symbol: Scalars['String']['output'];
  team?: Maybe<Scalars['String']['output']>;
  totalSupply: Scalars['Float']['output'];
  volatility24h: Scalars['Float']['output'];
  volume24h: Scalars['Float']['output'];
};

export type Query = {
  __typename?: 'Query';
  health: Scalars['String']['output'];
  player?: Maybe<Player>;
  players: Array<Player>;
  version: Scalars['String']['output'];
};


export type QueryPlayerArgs = {
  id: Scalars['ID']['input'];
};


export type QueryPlayersArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};

export enum TimeInForce {
  Fok = 'FOK',
  Gtc = 'GTC',
  Ioc = 'IOC'
}

export type PlayerRowFragment = { __typename?: 'Player', id: string, name: string, symbol: string, price: number, marketCap: number, change24h: number };

export type PlayersQueryVariables = Exact<{
  limit: Scalars['Int']['input'];
  offset: Scalars['Int']['input'];
}>;


export type PlayersQuery = { __typename?: 'Query', players: Array<{ __typename?: 'Player', id: string, name: string, symbol: string, price: number, marketCap: number, change24h: number }> };

export type PlaceOrderMutationVariables = Exact<{
  order: OrderInput;
}>;


export type PlaceOrderMutation = { __typename?: 'Mutation', placeOrder: { __typename?: 'OrderResult', id: string, status: string } };

export const PlayerRowFragmentDoc = gql`
    fragment PlayerRow on Player {
  id
  name
  symbol
  price
  marketCap
  change24h
}
    `;
export const PlayersDocument = gql`
    query Players($limit: Int!, $offset: Int!) {
  players(limit: $limit, offset: $offset) {
    ...PlayerRow
  }
}
    ${PlayerRowFragmentDoc}`;

export function usePlayersQuery(options: Omit<Urql.UseQueryArgs<PlayersQueryVariables>, 'query'>) {
  return Urql.useQuery<PlayersQuery, PlayersQueryVariables>({ query: PlayersDocument, ...options });
};
export const PlaceOrderDocument = gql`
    mutation PlaceOrder($order: OrderInput!) {
  placeOrder(order: $order) {
    id
    status
  }
}
    `;

export function usePlaceOrderMutation() {
  return Urql.useMutation<PlaceOrderMutation, PlaceOrderMutationVariables>(PlaceOrderDocument);
};