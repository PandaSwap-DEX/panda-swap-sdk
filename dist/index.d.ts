import JSBI from 'jsbi';
export { default as JSBI } from 'jsbi';
import * as _ethersproject_providers from '@ethersproject/providers';

declare type BigintIsh = JSBI | number | string;
declare enum ChainId {
    GNOSIS = 100,
    GNOSIS_TESTNET = 100100
}
declare enum TradeType {
    EXACT_INPUT = 0,
    EXACT_OUTPUT = 1
}
declare enum Rounding {
    ROUND_DOWN = 0,
    ROUND_HALF_UP = 1,
    ROUND_UP = 2
}
declare const FACTORY_ADDRESS = "0xcA143Ce32Fe78f1f7019d7d551a6402fC5350c73";
declare const FACTORY_ADDRESS_MAP: {
    100: string;
    100100: string;
};
declare const INIT_CODE_HASH = "0x00fb7f630766e6a796048ea87d01acd3068e8ff67d078148a3fa3f4a84f69bd5";
declare const INIT_CODE_HASH_MAP: {
    100: string;
    100100: string;
};
declare const MINIMUM_LIQUIDITY: JSBI;
declare const ZERO: JSBI;
declare const ONE: JSBI;
declare const TWO: JSBI;
declare const THREE: JSBI;
declare const FIVE: JSBI;
declare const TEN: JSBI;
declare const _100: JSBI;
declare const FEES_NUMERATOR: JSBI;
declare const FEES_DENOMINATOR: JSBI;
declare enum SolidityType {
    uint8 = "uint8",
    uint256 = "uint256"
}
declare const SOLIDITY_TYPE_MAXIMA: {
    uint8: JSBI;
    uint256: JSBI;
};

/**
 * Indicates that the pair has insufficient reserves for a desired output amount. I.e. the amount of output cannot be
 * obtained by sending any amount of input.
 */
declare class InsufficientReservesError extends Error {
    readonly isInsufficientReservesError: true;
    constructor();
}
/**
 * Indicates that the input amount is too small to produce any amount of output. I.e. the amount of input sent is less
 * than the price of a single unit of output after fees.
 */
declare class InsufficientInputAmountError extends Error {
    readonly isInsufficientInputAmountError: true;
    constructor();
}

/**
 * A currency is any fungible financial instrument on Ethereum, including Ether and all ERC20 tokens.
 *
 * The only instance of the base class `Currency` is Ether.
 */
declare class Currency {
    readonly decimals: number;
    readonly symbol?: string;
    readonly name?: string;
    /**
     * The only instance of the base class `Currency`.
     */
    static readonly ETHER: Currency;
    /**
     * Constructs an instance of the base class `Currency`. The only instance of the base class `Currency` is `Currency.ETHER`.
     * @param decimals decimals of the currency
     * @param symbol symbol of the currency
     * @param name of the currency
     */
    protected constructor(decimals: number, symbol?: string, name?: string);
}
declare const ETHER: Currency;

/**
 * Represents an ERC20 token with a unique address and some metadata.
 */
declare class Token extends Currency {
    readonly chainId: ChainId;
    readonly address: string;
    readonly projectLink?: string;
    constructor(chainId: ChainId, address: string, decimals: number, symbol?: string, name?: string, projectLink?: string);
    /**
     * Returns true if the two tokens are equivalent, i.e. have the same chainId and address.
     * @param other other token to compare
     */
    equals(other: Token): boolean;
    /**
     * Returns true if the address of this token sorts before the address of the other token
     * @param other other token to compare
     * @throws if the tokens have the same address
     * @throws if the tokens are on different chains
     */
    sortsBefore(other: Token): boolean;
}
/**
 * Compares two currencies for equality
 */
declare function currencyEquals(currencyA: Currency, currencyB: Currency): boolean;
declare const WXDAI: {
    100: Token;
    100100: Token;
};
declare const WNATIVE: {
    100: Token;
    100100: Token;
};

declare class Route {
    readonly pairs: Pair[];
    readonly path: Token[];
    readonly input: Currency;
    readonly output: Currency;
    readonly midPrice: Price;
    constructor(pairs: Pair[], input: Currency, output?: Currency);
    get chainId(): ChainId;
}

declare class Fraction {
    readonly numerator: JSBI;
    readonly denominator: JSBI;
    constructor(numerator: BigintIsh, denominator?: BigintIsh);
    get quotient(): JSBI;
    get remainder(): Fraction;
    invert(): Fraction;
    add(other: Fraction | BigintIsh): Fraction;
    subtract(other: Fraction | BigintIsh): Fraction;
    lessThan(other: Fraction | BigintIsh): boolean;
    equalTo(other: Fraction | BigintIsh): boolean;
    greaterThan(other: Fraction | BigintIsh): boolean;
    multiply(other: Fraction | BigintIsh): Fraction;
    divide(other: Fraction | BigintIsh): Fraction;
    toSignificant(significantDigits: number, format?: object, rounding?: Rounding): string;
    toFixed(decimalPlaces: number, format?: object, rounding?: Rounding): string;
    /**
     * Helper method for converting any super class back to a fraction
     */
    get asFraction(): Fraction;
}

declare class CurrencyAmount extends Fraction {
    readonly currency: Currency;
    /**
     * Helper that calls the constructor with the ETHER currency
     * @param amount ether amount in wei
     */
    static ether(amount: BigintIsh): CurrencyAmount;
    protected constructor(currency: Currency, amount: BigintIsh);
    get raw(): JSBI;
    add(other: CurrencyAmount): CurrencyAmount;
    subtract(other: CurrencyAmount): CurrencyAmount;
    toSignificant(significantDigits?: number, format?: object, rounding?: Rounding): string;
    toFixed(decimalPlaces?: number, format?: object, rounding?: Rounding): string;
    toExact(format?: object): string;
}

declare class Price extends Fraction {
    readonly baseCurrency: Currency;
    readonly quoteCurrency: Currency;
    readonly scalar: Fraction;
    static fromRoute(route: Route): Price;
    constructor(baseCurrency: Currency, quoteCurrency: Currency, denominator: BigintIsh, numerator: BigintIsh);
    get raw(): Fraction;
    get adjusted(): Fraction;
    invert(): Price;
    multiply(other: Price): Price;
    quote(currencyAmount: CurrencyAmount): CurrencyAmount;
    toSignificant(significantDigits?: number, format?: object, rounding?: Rounding): string;
    toFixed(decimalPlaces?: number, format?: object, rounding?: Rounding): string;
}

declare class TokenAmount extends CurrencyAmount {
    readonly token: Token;
    constructor(token: Token, amount: BigintIsh);
    add(other: TokenAmount): TokenAmount;
    subtract(other: TokenAmount): TokenAmount;
}

declare class Pair {
    readonly liquidityToken: Token;
    private readonly tokenAmounts;
    static getAddress(tokenA: Token, tokenB: Token): string;
    constructor(tokenAmountA: TokenAmount, tokenAmountB: TokenAmount);
    /**
     * Returns true if the token is either token0 or token1
     * @param token to check
     */
    involvesToken(token: Token): boolean;
    /**
     * Returns the current mid price of the pair in terms of token0, i.e. the ratio of reserve1 to reserve0
     */
    get token0Price(): Price;
    /**
     * Returns the current mid price of the pair in terms of token1, i.e. the ratio of reserve0 to reserve1
     */
    get token1Price(): Price;
    /**
     * Return the price of the given token in terms of the other token in the pair.
     * @param token token to return price of
     */
    priceOf(token: Token): Price;
    /**
     * Returns the chain ID of the tokens in the pair.
     */
    get chainId(): ChainId;
    get token0(): Token;
    get token1(): Token;
    get reserve0(): TokenAmount;
    get reserve1(): TokenAmount;
    reserveOf(token: Token): TokenAmount;
    getOutputAmount(inputAmount: TokenAmount): [TokenAmount, Pair];
    getInputAmount(outputAmount: TokenAmount): [TokenAmount, Pair];
    getLiquidityMinted(totalSupply: TokenAmount, tokenAmountA: TokenAmount, tokenAmountB: TokenAmount): TokenAmount;
    getLiquidityValue(token: Token, totalSupply: TokenAmount, liquidity: TokenAmount, feeOn?: boolean, kLast?: BigintIsh): TokenAmount;
}

declare class Percent extends Fraction {
    toSignificant(significantDigits?: number, format?: object, rounding?: Rounding): string;
    toFixed(decimalPlaces?: number, format?: object, rounding?: Rounding): string;
}

interface InputOutput {
    readonly inputAmount: CurrencyAmount;
    readonly outputAmount: CurrencyAmount;
}
declare function inputOutputComparator(a: InputOutput, b: InputOutput): number;
declare function tradeComparator(a: Trade, b: Trade): number;
interface BestTradeOptions {
    maxNumResults?: number;
    maxHops?: number;
}
/**
 * Represents a trade executed against a list of pairs.
 * Does not account for slippage, i.e. trades that front run this trade and move the price.
 */
declare class Trade {
    /**
     * The route of the trade, i.e. which pairs the trade goes through.
     */
    readonly route: Route;
    /**
     * The type of the trade, either exact in or exact out.
     */
    readonly tradeType: TradeType;
    /**
     * The input amount for the trade assuming no slippage.
     */
    readonly inputAmount: CurrencyAmount;
    /**
     * The output amount for the trade assuming no slippage.
     */
    readonly outputAmount: CurrencyAmount;
    /**
     * The price expressed in terms of output amount/input amount.
     */
    readonly executionPrice: Price;
    /**
     * The mid price after the trade executes assuming no slippage.
     */
    readonly nextMidPrice: Price;
    /**
     * The percent difference between the mid price before the trade and the trade execution price.
     */
    readonly priceImpact: Percent;
    /**
     * Constructs an exact in trade with the given amount in and route
     * @param route route of the exact in trade
     * @param amountIn the amount being passed in
     */
    static exactIn(route: Route, amountIn: CurrencyAmount): Trade;
    /**
     * Constructs an exact out trade with the given amount out and route
     * @param route route of the exact out trade
     * @param amountOut the amount returned by the trade
     */
    static exactOut(route: Route, amountOut: CurrencyAmount): Trade;
    constructor(route: Route, amount: CurrencyAmount, tradeType: TradeType);
    /**
     * Get the minimum amount that must be received from this trade for the given slippage tolerance
     * @param slippageTolerance tolerance of unfavorable slippage from the execution price of this trade
     */
    minimumAmountOut(slippageTolerance: Percent): CurrencyAmount;
    /**
     * Get the maximum amount in that can be spent via this trade for the given slippage tolerance
     * @param slippageTolerance tolerance of unfavorable slippage from the execution price of this trade
     */
    maximumAmountIn(slippageTolerance: Percent): CurrencyAmount;
    /**
     * Given a list of pairs, and a fixed amount in, returns the top `maxNumResults` trades that go from an input token
     * amount to an output token, making at most `maxHops` hops.
     * Note this does not consider aggregation, as routes are linear. It's possible a better route exists by splitting
     * the amount in among multiple routes.
     * @param pairs the pairs to consider in finding the best trade
     * @param currencyAmountIn exact amount of input currency to spend
     * @param currencyOut the desired currency out
     * @param maxNumResults maximum number of results to return
     * @param maxHops maximum number of hops a returned trade can make, e.g. 1 hop goes through a single pair
     * @param currentPairs used in recursion; the current list of pairs
     * @param originalAmountIn used in recursion; the original value of the currencyAmountIn parameter
     * @param bestTrades used in recursion; the current list of best trades
     */
    static bestTradeExactIn(pairs: Pair[], currencyAmountIn: CurrencyAmount, currencyOut: Currency, { maxNumResults, maxHops }?: BestTradeOptions, currentPairs?: Pair[], originalAmountIn?: CurrencyAmount, bestTrades?: Trade[]): Trade[];
    /**
     * similar to the above method but instead targets a fixed output amount
     * given a list of pairs, and a fixed amount out, returns the top `maxNumResults` trades that go from an input token
     * to an output token amount, making at most `maxHops` hops
     * note this does not consider aggregation, as routes are linear. it's possible a better route exists by splitting
     * the amount in among multiple routes.
     * @param pairs the pairs to consider in finding the best trade
     * @param currencyIn the currency to spend
     * @param currencyAmountOut the exact amount of currency out
     * @param maxNumResults maximum number of results to return
     * @param maxHops maximum number of hops a returned trade can make, e.g. 1 hop goes through a single pair
     * @param currentPairs used in recursion; the current list of pairs
     * @param originalAmountOut used in recursion; the original value of the currencyAmountOut parameter
     * @param bestTrades used in recursion; the current list of best trades
     */
    static bestTradeExactOut(pairs: Pair[], currencyIn: Currency, currencyAmountOut: CurrencyAmount, { maxNumResults, maxHops }?: BestTradeOptions, currentPairs?: Pair[], originalAmountOut?: CurrencyAmount, bestTrades?: Trade[]): Trade[];
}

/**
 * Options for producing the arguments to send call to the router.
 */
interface TradeOptions {
    /**
     * How much the execution price is allowed to move unfavorably from the trade execution price.
     */
    allowedSlippage: Percent;
    /**
     * How long the swap is valid until it expires, in seconds.
     * This will be used to produce a `deadline` parameter which is computed from when the swap call parameters
     * are generated.
     */
    ttl: number;
    /**
     * The account that should receive the output of the swap.
     */
    recipient: string;
    /**
     * Whether any of the tokens in the path are fee on transfer tokens, which should be handled with special methods
     */
    feeOnTransfer?: boolean;
}
interface TradeOptionsDeadline extends Omit<TradeOptions, 'ttl'> {
    /**
     * When the transaction expires.
     * This is an atlernate to specifying the ttl, for when you do not want to use local time.
     */
    deadline: number;
}
/**
 * The parameters to use in the call to the Panda Router to execute a trade.
 */
interface SwapParameters {
    /**
     * The method to call on the Panda Router.
     */
    methodName: string;
    /**
     * The arguments to pass to the method, all hex encoded.
     */
    args: (string | string[])[];
    /**
     * The amount of wei to send in hex.
     */
    value: string;
}
/**
 * Represents the Panda Router, and has static methods for helping execute trades.
 */
declare abstract class Router {
    /**
     * Cannot be constructed.
     */
    private constructor();
    /**
     * Produces the on-chain method name to call and the hex encoded parameters to pass as arguments for a given trade.
     * @param trade to produce call parameters for
     * @param options options for the call parameters
     */
    static swapCallParameters(trade: Trade, options: TradeOptions | TradeOptionsDeadline): SwapParameters;
}

/**
 * Contains methods for constructing instances of pairs and tokens from on-chain data.
 */
declare abstract class Fetcher {
    /**
     * Cannot be constructed.
     */
    private constructor();
    /**
     * Fetch information for a given token on the given chain, using the given ethers provider.
     * @param chainId chain of the token
     * @param address address of the token on the chain
     * @param provider provider used to fetch the token
     * @param symbol optional symbol of the token
     * @param name optional name of the token
     */
    static fetchTokenData(chainId: ChainId, address: string, provider?: _ethersproject_providers.BaseProvider, symbol?: string, name?: string): Promise<Token>;
    /**
     * Fetches information about a pair and constructs a pair from the given two tokens.
     * @param tokenA first token
     * @param tokenB second token
     * @param provider the provider to use to fetch the data
     */
    static fetchPairData(tokenA: Token, tokenB: Token, provider?: _ethersproject_providers.BaseProvider): Promise<Pair>;
}

export { BestTradeOptions, BigintIsh, ChainId, Currency, CurrencyAmount, ETHER, FACTORY_ADDRESS, FACTORY_ADDRESS_MAP, FEES_DENOMINATOR, FEES_NUMERATOR, FIVE, Fetcher, Fraction, INIT_CODE_HASH, INIT_CODE_HASH_MAP, InsufficientInputAmountError, InsufficientReservesError, MINIMUM_LIQUIDITY, ONE, Pair, Percent, Price, Rounding, Route, Router, SOLIDITY_TYPE_MAXIMA, SolidityType, SwapParameters, TEN, THREE, TWO, Token, TokenAmount, Trade, TradeOptions, TradeOptionsDeadline, TradeType, WNATIVE, WXDAI, ZERO, _100, currencyEquals, inputOutputComparator, tradeComparator };
