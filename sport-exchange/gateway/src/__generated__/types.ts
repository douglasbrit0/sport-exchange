import type { GraphQLResolveInfo } from 'graphql';
import type { GraphQLContext } from '../context';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };
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

export type OrderSide =
  | 'BUY'
  | 'SELL';

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

export type TimeInForce =
  | 'FOK'
  | 'GTC'
  | 'IOC';



export type ResolverTypeWrapper<T> = Promise<T> | T;

export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> = ResolverFn<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;



/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  Boolean: ResolverTypeWrapper<Scalars['Boolean']['output']>;
  Float: ResolverTypeWrapper<Scalars['Float']['output']>;
  ID: ResolverTypeWrapper<Scalars['ID']['output']>;
  Int: ResolverTypeWrapper<Scalars['Int']['output']>;
  Liquidity: ResolverTypeWrapper<Liquidity>;
  Mutation: ResolverTypeWrapper<{}>;
  OHLC: ResolverTypeWrapper<Ohlc>;
  OrderInput: OrderInput;
  OrderResult: ResolverTypeWrapper<OrderResult>;
  OrderSide: OrderSide;
  Player: ResolverTypeWrapper<Player>;
  Query: ResolverTypeWrapper<{}>;
  String: ResolverTypeWrapper<Scalars['String']['output']>;
  TimeInForce: TimeInForce;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  Boolean: Scalars['Boolean']['output'];
  Float: Scalars['Float']['output'];
  ID: Scalars['ID']['output'];
  Int: Scalars['Int']['output'];
  Liquidity: Liquidity;
  Mutation: {};
  OHLC: Ohlc;
  OrderInput: OrderInput;
  OrderResult: OrderResult;
  Player: Player;
  Query: {};
  String: Scalars['String']['output'];
};

export type LiquidityResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['Liquidity'] = ResolversParentTypes['Liquidity']> = {
  ammK?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  depthBest?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  depthMid?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  spreadBps?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MutationResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  _noop?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  placeOrder?: Resolver<ResolversTypes['OrderResult'], ParentType, ContextType, RequireFields<MutationPlaceOrderArgs, 'order'>>;
};

export type OhlcResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['OHLC'] = ResolversParentTypes['OHLC']> = {
  close?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  high?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  low?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  open?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  timestamp?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type OrderResultResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['OrderResult'] = ResolversParentTypes['OrderResult']> = {
  avgPrice?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  filledSize?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  status?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type PlayerResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['Player'] = ResolversParentTypes['Player']> = {
  chain?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  change24h?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  circulatingSupply?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  contractAddress?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  decimals?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  liquidity?: Resolver<Maybe<ResolversTypes['Liquidity']>, ParentType, ContextType>;
  marketCap?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  ohlc24h?: Resolver<Maybe<ResolversTypes['OHLC']>, ParentType, ContextType>;
  position?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  price?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  sentimentScore?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  symbol?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  team?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  totalSupply?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  volatility24h?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  volume24h?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type QueryResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  health?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  player?: Resolver<Maybe<ResolversTypes['Player']>, ParentType, ContextType, RequireFields<QueryPlayerArgs, 'id'>>;
  players?: Resolver<Array<ResolversTypes['Player']>, ParentType, ContextType, RequireFields<QueryPlayersArgs, 'limit' | 'offset'>>;
  version?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
};

export type Resolvers<ContextType = GraphQLContext> = {
  Liquidity?: LiquidityResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  OHLC?: OhlcResolvers<ContextType>;
  OrderResult?: OrderResultResolvers<ContextType>;
  Player?: PlayerResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
};

