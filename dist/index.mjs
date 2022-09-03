// src/index.ts
import JSBI9 from "jsbi";

// src/constants.ts
import JSBI from "jsbi";
var ChainId = /* @__PURE__ */ ((ChainId4) => {
  ChainId4[ChainId4["GNOSIS"] = 100] = "GNOSIS";
  ChainId4[ChainId4["GNOSIS_TESTNET"] = 100100] = "GNOSIS_TESTNET";
  return ChainId4;
})(ChainId || {});
var TradeType = /* @__PURE__ */ ((TradeType2) => {
  TradeType2[TradeType2["EXACT_INPUT"] = 0] = "EXACT_INPUT";
  TradeType2[TradeType2["EXACT_OUTPUT"] = 1] = "EXACT_OUTPUT";
  return TradeType2;
})(TradeType || {});
var Rounding = /* @__PURE__ */ ((Rounding4) => {
  Rounding4[Rounding4["ROUND_DOWN"] = 0] = "ROUND_DOWN";
  Rounding4[Rounding4["ROUND_HALF_UP"] = 1] = "ROUND_HALF_UP";
  Rounding4[Rounding4["ROUND_UP"] = 2] = "ROUND_UP";
  return Rounding4;
})(Rounding || {});
var FACTORY_ADDRESS = "0xcA143Ce32Fe78f1f7019d7d551a6402fC5350c73";
var FACTORY_ADDRESS_MAP = {
  [100 /* GNOSIS */]: FACTORY_ADDRESS,
  [100100 /* GNOSIS_TESTNET */]: "0x6725f303b657a9451d8ba641348b6761a6cc7a17"
};
var INIT_CODE_HASH = "0x00fb7f630766e6a796048ea87d01acd3068e8ff67d078148a3fa3f4a84f69bd5";
var INIT_CODE_HASH_MAP = {
  [100 /* GNOSIS */]: INIT_CODE_HASH,
  [100100 /* GNOSIS_TESTNET */]: "0xd0d4c4cd0848c93cb4fd1f498d7013ee6bfb25783ea21593d5834f5d250ece66"
};
var MINIMUM_LIQUIDITY = JSBI.BigInt(1e3);
var ZERO = JSBI.BigInt(0);
var ONE = JSBI.BigInt(1);
var TWO = JSBI.BigInt(2);
var THREE = JSBI.BigInt(3);
var FIVE = JSBI.BigInt(5);
var TEN = JSBI.BigInt(10);
var _100 = JSBI.BigInt(100);
var FEES_NUMERATOR = JSBI.BigInt(9975);
var FEES_DENOMINATOR = JSBI.BigInt(1e4);
var SolidityType = /* @__PURE__ */ ((SolidityType2) => {
  SolidityType2["uint8"] = "uint8";
  SolidityType2["uint256"] = "uint256";
  return SolidityType2;
})(SolidityType || {});
var SOLIDITY_TYPE_MAXIMA = {
  ["uint8" /* uint8 */]: JSBI.BigInt("0xff"),
  ["uint256" /* uint256 */]: JSBI.BigInt("0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff")
};

// src/errors.ts
var CAN_SET_PROTOTYPE = "setPrototypeOf" in Object;
var InsufficientReservesError = class extends Error {
  constructor() {
    super();
    this.isInsufficientReservesError = true;
    this.name = this.constructor.name;
    if (CAN_SET_PROTOTYPE)
      Object.setPrototypeOf(this, new.target.prototype);
  }
};
var InsufficientInputAmountError = class extends Error {
  constructor() {
    super();
    this.isInsufficientInputAmountError = true;
    this.name = this.constructor.name;
    if (CAN_SET_PROTOTYPE)
      Object.setPrototypeOf(this, new.target.prototype);
  }
};

// src/entities/token.ts
import invariant2 from "tiny-invariant";

// src/utils.ts
import invariant from "tiny-invariant";
import warning from "tiny-warning";
import JSBI2 from "jsbi";
import { getAddress } from "@ethersproject/address";
function validateSolidityTypeInstance(value, solidityType) {
  invariant(JSBI2.greaterThanOrEqual(value, ZERO), `${value} is not a ${solidityType}.`);
  invariant(JSBI2.lessThanOrEqual(value, SOLIDITY_TYPE_MAXIMA[solidityType]), `${value} is not a ${solidityType}.`);
}
function validateAndParseAddress(address) {
  try {
    const checksummedAddress = getAddress(address);
    warning(address === checksummedAddress, `${address} is not checksummed.`);
    return checksummedAddress;
  } catch (error) {
    invariant(false, `${address} is not a valid address.`);
  }
}
function parseBigintIsh(bigintIsh) {
  return bigintIsh instanceof JSBI2 ? bigintIsh : JSBI2.BigInt(bigintIsh);
}
function sqrt(y) {
  validateSolidityTypeInstance(y, "uint256" /* uint256 */);
  let z = ZERO;
  let x;
  if (JSBI2.greaterThan(y, THREE)) {
    z = y;
    x = JSBI2.add(JSBI2.divide(y, TWO), ONE);
    while (JSBI2.lessThan(x, z)) {
      z = x;
      x = JSBI2.divide(JSBI2.add(JSBI2.divide(y, x), x), TWO);
    }
  } else if (JSBI2.notEqual(y, ZERO)) {
    z = ONE;
  }
  return z;
}
function sortedInsert(items, add, maxSize, comparator) {
  invariant(maxSize > 0, "MAX_SIZE_ZERO");
  invariant(items.length <= maxSize, "ITEMS_SIZE");
  if (items.length === 0) {
    items.push(add);
    return null;
  } else {
    const isFull = items.length === maxSize;
    if (isFull && comparator(items[items.length - 1], add) <= 0) {
      return add;
    }
    let lo = 0, hi = items.length;
    while (lo < hi) {
      const mid = lo + hi >>> 1;
      if (comparator(items[mid], add) <= 0) {
        lo = mid + 1;
      } else {
        hi = mid;
      }
    }
    items.splice(lo, 0, add);
    return isFull ? items.pop() : null;
  }
}

// src/entities/currency.ts
import JSBI3 from "jsbi";
var _Currency = class {
  constructor(decimals, symbol, name) {
    validateSolidityTypeInstance(JSBI3.BigInt(decimals), "uint8" /* uint8 */);
    this.decimals = decimals;
    this.symbol = symbol;
    this.name = name;
  }
};
var Currency = _Currency;
Currency.ETHER = new _Currency(18, "XDAI", "XDAI");
var ETHER = Currency.ETHER;

// src/entities/token.ts
var Token = class extends Currency {
  constructor(chainId, address, decimals, symbol, name, projectLink) {
    super(decimals, symbol, name);
    this.chainId = chainId;
    this.address = validateAndParseAddress(address);
    this.projectLink = projectLink;
  }
  equals(other) {
    if (this === other) {
      return true;
    }
    return this.chainId === other.chainId && this.address === other.address;
  }
  sortsBefore(other) {
    invariant2(this.chainId === other.chainId, "CHAIN_IDS");
    invariant2(this.address !== other.address, "ADDRESSES");
    return this.address.toLowerCase() < other.address.toLowerCase();
  }
};
function currencyEquals(currencyA, currencyB) {
  if (currencyA instanceof Token && currencyB instanceof Token) {
    return currencyA.equals(currencyB);
  } else if (currencyA instanceof Token) {
    return false;
  } else if (currencyB instanceof Token) {
    return false;
  } else {
    return currencyA === currencyB;
  }
}
var WXDAI = {
  [100 /* GNOSIS */]: new Token(
    100 /* GNOSIS */,
    "0xe91D153E0b41518A2Ce8Dd3D7944Fa863463a97d",
    18,
    "WXDAI",
    "Wrapped XDAI",
    "https://www.gnosis.org"
  ),
  [100100 /* GNOSIS_TESTNET */]: new Token(
    100100 /* GNOSIS_TESTNET */,
    "0xe91D153E0b41518A2Ce8Dd3D7944Fa863463a97d",
    18,
    "WXDAI",
    "Wrapped XDAI",
    "https://www.gnosis.org"
  )
};
var WNATIVE = {
  [100 /* GNOSIS */]: WXDAI[100 /* GNOSIS */],
  [100100 /* GNOSIS_TESTNET */]: WXDAI[100100 /* GNOSIS_TESTNET */]
};

// src/entities/fractions/currencyAmount.ts
import invariant4 from "tiny-invariant";
import JSBI5 from "jsbi";
import _Big2 from "big.js";
import toFormat2 from "toformat";

// src/entities/fractions/fraction.ts
import invariant3 from "tiny-invariant";
import JSBI4 from "jsbi";
import _Decimal from "decimal.js-light";
import _Big from "big.js";
import toFormat from "toformat";
var Decimal = toFormat(_Decimal);
var Big = toFormat(_Big);
var toSignificantRounding = {
  [0 /* ROUND_DOWN */]: Decimal.ROUND_DOWN,
  [1 /* ROUND_HALF_UP */]: Decimal.ROUND_HALF_UP,
  [2 /* ROUND_UP */]: Decimal.ROUND_UP
};
var toFixedRounding = {
  [0 /* ROUND_DOWN */]: 0 /* RoundDown */,
  [1 /* ROUND_HALF_UP */]: 1 /* RoundHalfUp */,
  [2 /* ROUND_UP */]: 3 /* RoundUp */
};
var Fraction = class {
  constructor(numerator, denominator = ONE) {
    this.numerator = parseBigintIsh(numerator);
    this.denominator = parseBigintIsh(denominator);
  }
  get quotient() {
    return JSBI4.divide(this.numerator, this.denominator);
  }
  get remainder() {
    return new Fraction(JSBI4.remainder(this.numerator, this.denominator), this.denominator);
  }
  invert() {
    return new Fraction(this.denominator, this.numerator);
  }
  add(other) {
    const otherParsed = other instanceof Fraction ? other : new Fraction(parseBigintIsh(other));
    if (JSBI4.equal(this.denominator, otherParsed.denominator)) {
      return new Fraction(JSBI4.add(this.numerator, otherParsed.numerator), this.denominator);
    }
    return new Fraction(
      JSBI4.add(
        JSBI4.multiply(this.numerator, otherParsed.denominator),
        JSBI4.multiply(otherParsed.numerator, this.denominator)
      ),
      JSBI4.multiply(this.denominator, otherParsed.denominator)
    );
  }
  subtract(other) {
    const otherParsed = other instanceof Fraction ? other : new Fraction(parseBigintIsh(other));
    if (JSBI4.equal(this.denominator, otherParsed.denominator)) {
      return new Fraction(JSBI4.subtract(this.numerator, otherParsed.numerator), this.denominator);
    }
    return new Fraction(
      JSBI4.subtract(
        JSBI4.multiply(this.numerator, otherParsed.denominator),
        JSBI4.multiply(otherParsed.numerator, this.denominator)
      ),
      JSBI4.multiply(this.denominator, otherParsed.denominator)
    );
  }
  lessThan(other) {
    const otherParsed = other instanceof Fraction ? other : new Fraction(parseBigintIsh(other));
    return JSBI4.lessThan(
      JSBI4.multiply(this.numerator, otherParsed.denominator),
      JSBI4.multiply(otherParsed.numerator, this.denominator)
    );
  }
  equalTo(other) {
    const otherParsed = other instanceof Fraction ? other : new Fraction(parseBigintIsh(other));
    return JSBI4.equal(
      JSBI4.multiply(this.numerator, otherParsed.denominator),
      JSBI4.multiply(otherParsed.numerator, this.denominator)
    );
  }
  greaterThan(other) {
    const otherParsed = other instanceof Fraction ? other : new Fraction(parseBigintIsh(other));
    return JSBI4.greaterThan(
      JSBI4.multiply(this.numerator, otherParsed.denominator),
      JSBI4.multiply(otherParsed.numerator, this.denominator)
    );
  }
  multiply(other) {
    const otherParsed = other instanceof Fraction ? other : new Fraction(parseBigintIsh(other));
    return new Fraction(
      JSBI4.multiply(this.numerator, otherParsed.numerator),
      JSBI4.multiply(this.denominator, otherParsed.denominator)
    );
  }
  divide(other) {
    const otherParsed = other instanceof Fraction ? other : new Fraction(parseBigintIsh(other));
    return new Fraction(
      JSBI4.multiply(this.numerator, otherParsed.denominator),
      JSBI4.multiply(this.denominator, otherParsed.numerator)
    );
  }
  toSignificant(significantDigits, format = { groupSeparator: "" }, rounding = 1 /* ROUND_HALF_UP */) {
    invariant3(Number.isInteger(significantDigits), `${significantDigits} is not an integer.`);
    invariant3(significantDigits > 0, `${significantDigits} is not positive.`);
    Decimal.set({ precision: significantDigits + 1, rounding: toSignificantRounding[rounding] });
    const quotient = new Decimal(this.numerator.toString()).div(this.denominator.toString()).toSignificantDigits(significantDigits);
    return quotient.toFormat(quotient.decimalPlaces(), format);
  }
  toFixed(decimalPlaces, format = { groupSeparator: "" }, rounding = 1 /* ROUND_HALF_UP */) {
    invariant3(Number.isInteger(decimalPlaces), `${decimalPlaces} is not an integer.`);
    invariant3(decimalPlaces >= 0, `${decimalPlaces} is negative.`);
    Big.DP = decimalPlaces;
    Big.RM = toFixedRounding[rounding];
    return new Big(this.numerator.toString()).div(this.denominator.toString()).toFormat(decimalPlaces, format);
  }
  get asFraction() {
    return new Fraction(this.numerator, this.denominator);
  }
};

// src/entities/fractions/currencyAmount.ts
var Big2 = toFormat2(_Big2);
var CurrencyAmount = class extends Fraction {
  constructor(currency, amount) {
    const parsedAmount = parseBigintIsh(amount);
    validateSolidityTypeInstance(parsedAmount, "uint256" /* uint256 */);
    super(parsedAmount, JSBI5.exponentiate(TEN, JSBI5.BigInt(currency.decimals)));
    this.currency = currency;
  }
  static ether(amount) {
    return new CurrencyAmount(ETHER, amount);
  }
  get raw() {
    return this.numerator;
  }
  add(other) {
    invariant4(currencyEquals(this.currency, other.currency), "TOKEN");
    return new CurrencyAmount(this.currency, JSBI5.add(this.raw, other.raw));
  }
  subtract(other) {
    invariant4(currencyEquals(this.currency, other.currency), "TOKEN");
    return new CurrencyAmount(this.currency, JSBI5.subtract(this.raw, other.raw));
  }
  toSignificant(significantDigits = 6, format, rounding = 0 /* ROUND_DOWN */) {
    return super.toSignificant(significantDigits, format, rounding);
  }
  toFixed(decimalPlaces = this.currency.decimals, format, rounding = 0 /* ROUND_DOWN */) {
    invariant4(decimalPlaces <= this.currency.decimals, "DECIMALS");
    return super.toFixed(decimalPlaces, format, rounding);
  }
  toExact(format = { groupSeparator: "" }) {
    Big2.DP = this.currency.decimals;
    return new Big2(this.numerator.toString()).div(this.denominator.toString()).toFormat(format);
  }
};

// src/entities/fractions/tokenAmount.ts
import invariant5 from "tiny-invariant";
import JSBI6 from "jsbi";
var TokenAmount = class extends CurrencyAmount {
  constructor(token, amount) {
    super(token, amount);
    this.token = token;
  }
  add(other) {
    invariant5(this.token.equals(other.token), "TOKEN");
    return new TokenAmount(this.token, JSBI6.add(this.raw, other.raw));
  }
  subtract(other) {
    invariant5(this.token.equals(other.token), "TOKEN");
    return new TokenAmount(this.token, JSBI6.subtract(this.raw, other.raw));
  }
};

// src/entities/fractions/price.ts
import invariant6 from "tiny-invariant";
import JSBI7 from "jsbi";
var Price = class extends Fraction {
  constructor(baseCurrency, quoteCurrency, denominator, numerator) {
    super(numerator, denominator);
    this.baseCurrency = baseCurrency;
    this.quoteCurrency = quoteCurrency;
    this.scalar = new Fraction(
      JSBI7.exponentiate(TEN, JSBI7.BigInt(baseCurrency.decimals)),
      JSBI7.exponentiate(TEN, JSBI7.BigInt(quoteCurrency.decimals))
    );
  }
  static fromRoute(route) {
    const prices = [];
    for (const [i, pair] of route.pairs.entries()) {
      prices.push(
        route.path[i].equals(pair.token0) ? new Price(pair.reserve0.currency, pair.reserve1.currency, pair.reserve0.raw, pair.reserve1.raw) : new Price(pair.reserve1.currency, pair.reserve0.currency, pair.reserve1.raw, pair.reserve0.raw)
      );
    }
    return prices.slice(1).reduce((accumulator, currentValue) => accumulator.multiply(currentValue), prices[0]);
  }
  get raw() {
    return new Fraction(this.numerator, this.denominator);
  }
  get adjusted() {
    return super.multiply(this.scalar);
  }
  invert() {
    return new Price(this.quoteCurrency, this.baseCurrency, this.numerator, this.denominator);
  }
  multiply(other) {
    invariant6(currencyEquals(this.quoteCurrency, other.baseCurrency), "TOKEN");
    const fraction = super.multiply(other);
    return new Price(this.baseCurrency, other.quoteCurrency, fraction.denominator, fraction.numerator);
  }
  quote(currencyAmount) {
    invariant6(currencyEquals(currencyAmount.currency, this.baseCurrency), "TOKEN");
    if (this.quoteCurrency instanceof Token) {
      return new TokenAmount(this.quoteCurrency, super.multiply(currencyAmount.raw).quotient);
    }
    return CurrencyAmount.ether(super.multiply(currencyAmount.raw).quotient);
  }
  toSignificant(significantDigits = 6, format, rounding) {
    return this.adjusted.toSignificant(significantDigits, format, rounding);
  }
  toFixed(decimalPlaces = 4, format, rounding) {
    return this.adjusted.toFixed(decimalPlaces, format, rounding);
  }
};

// src/entities/pair.ts
import invariant7 from "tiny-invariant";
import JSBI8 from "jsbi";
import { pack, keccak256 } from "@ethersproject/solidity";
import { getCreate2Address } from "@ethersproject/address";
var PAIR_ADDRESS_CACHE = {};
var composeKey = (token0, token1) => `${token0.chainId}-${token0.address}-${token1.address}`;
var Pair = class {
  static getAddress(tokenA, tokenB) {
    const [token0, token1] = tokenA.sortsBefore(tokenB) ? [tokenA, tokenB] : [tokenB, tokenA];
    const key = composeKey(token0, token1);
    if ((PAIR_ADDRESS_CACHE == null ? void 0 : PAIR_ADDRESS_CACHE[key]) === void 0) {
      PAIR_ADDRESS_CACHE = {
        ...PAIR_ADDRESS_CACHE,
        [key]: getCreate2Address(
          FACTORY_ADDRESS_MAP[token0.chainId],
          keccak256(["bytes"], [pack(["address", "address"], [token0.address, token1.address])]),
          INIT_CODE_HASH_MAP[token0.chainId]
        )
      };
    }
    return PAIR_ADDRESS_CACHE[key];
  }
  constructor(tokenAmountA, tokenAmountB) {
    const tokenAmounts = tokenAmountA.token.sortsBefore(tokenAmountB.token) ? [tokenAmountA, tokenAmountB] : [tokenAmountB, tokenAmountA];
    this.liquidityToken = new Token(
      tokenAmounts[0].token.chainId,
      Pair.getAddress(tokenAmounts[0].token, tokenAmounts[1].token),
      18,
      "Panda-LP",
      "Panda LPs"
    );
    this.tokenAmounts = tokenAmounts;
  }
  involvesToken(token) {
    return token.equals(this.token0) || token.equals(this.token1);
  }
  get token0Price() {
    return new Price(this.token0, this.token1, this.tokenAmounts[0].raw, this.tokenAmounts[1].raw);
  }
  get token1Price() {
    return new Price(this.token1, this.token0, this.tokenAmounts[1].raw, this.tokenAmounts[0].raw);
  }
  priceOf(token) {
    invariant7(this.involvesToken(token), "TOKEN");
    return token.equals(this.token0) ? this.token0Price : this.token1Price;
  }
  get chainId() {
    return this.token0.chainId;
  }
  get token0() {
    return this.tokenAmounts[0].token;
  }
  get token1() {
    return this.tokenAmounts[1].token;
  }
  get reserve0() {
    return this.tokenAmounts[0];
  }
  get reserve1() {
    return this.tokenAmounts[1];
  }
  reserveOf(token) {
    invariant7(this.involvesToken(token), "TOKEN");
    return token.equals(this.token0) ? this.reserve0 : this.reserve1;
  }
  getOutputAmount(inputAmount) {
    invariant7(this.involvesToken(inputAmount.token), "TOKEN");
    if (JSBI8.equal(this.reserve0.raw, ZERO) || JSBI8.equal(this.reserve1.raw, ZERO)) {
      throw new InsufficientReservesError();
    }
    const inputReserve = this.reserveOf(inputAmount.token);
    const outputReserve = this.reserveOf(inputAmount.token.equals(this.token0) ? this.token1 : this.token0);
    const inputAmountWithFee = JSBI8.multiply(inputAmount.raw, FEES_NUMERATOR);
    const numerator = JSBI8.multiply(inputAmountWithFee, outputReserve.raw);
    const denominator = JSBI8.add(JSBI8.multiply(inputReserve.raw, FEES_DENOMINATOR), inputAmountWithFee);
    const outputAmount = new TokenAmount(
      inputAmount.token.equals(this.token0) ? this.token1 : this.token0,
      JSBI8.divide(numerator, denominator)
    );
    if (JSBI8.equal(outputAmount.raw, ZERO)) {
      throw new InsufficientInputAmountError();
    }
    return [outputAmount, new Pair(inputReserve.add(inputAmount), outputReserve.subtract(outputAmount))];
  }
  getInputAmount(outputAmount) {
    invariant7(this.involvesToken(outputAmount.token), "TOKEN");
    if (JSBI8.equal(this.reserve0.raw, ZERO) || JSBI8.equal(this.reserve1.raw, ZERO) || JSBI8.greaterThanOrEqual(outputAmount.raw, this.reserveOf(outputAmount.token).raw)) {
      throw new InsufficientReservesError();
    }
    const outputReserve = this.reserveOf(outputAmount.token);
    const inputReserve = this.reserveOf(outputAmount.token.equals(this.token0) ? this.token1 : this.token0);
    const numerator = JSBI8.multiply(JSBI8.multiply(inputReserve.raw, outputAmount.raw), FEES_DENOMINATOR);
    const denominator = JSBI8.multiply(JSBI8.subtract(outputReserve.raw, outputAmount.raw), FEES_NUMERATOR);
    const inputAmount = new TokenAmount(
      outputAmount.token.equals(this.token0) ? this.token1 : this.token0,
      JSBI8.add(JSBI8.divide(numerator, denominator), ONE)
    );
    return [inputAmount, new Pair(inputReserve.add(inputAmount), outputReserve.subtract(outputAmount))];
  }
  getLiquidityMinted(totalSupply, tokenAmountA, tokenAmountB) {
    invariant7(totalSupply.token.equals(this.liquidityToken), "LIQUIDITY");
    const tokenAmounts = tokenAmountA.token.sortsBefore(tokenAmountB.token) ? [tokenAmountA, tokenAmountB] : [tokenAmountB, tokenAmountA];
    invariant7(tokenAmounts[0].token.equals(this.token0) && tokenAmounts[1].token.equals(this.token1), "TOKEN");
    let liquidity;
    if (JSBI8.equal(totalSupply.raw, ZERO)) {
      liquidity = JSBI8.subtract(sqrt(JSBI8.multiply(tokenAmounts[0].raw, tokenAmounts[1].raw)), MINIMUM_LIQUIDITY);
    } else {
      const amount0 = JSBI8.divide(JSBI8.multiply(tokenAmounts[0].raw, totalSupply.raw), this.reserve0.raw);
      const amount1 = JSBI8.divide(JSBI8.multiply(tokenAmounts[1].raw, totalSupply.raw), this.reserve1.raw);
      liquidity = JSBI8.lessThanOrEqual(amount0, amount1) ? amount0 : amount1;
    }
    if (!JSBI8.greaterThan(liquidity, ZERO)) {
      throw new InsufficientInputAmountError();
    }
    return new TokenAmount(this.liquidityToken, liquidity);
  }
  getLiquidityValue(token, totalSupply, liquidity, feeOn = false, kLast) {
    invariant7(this.involvesToken(token), "TOKEN");
    invariant7(totalSupply.token.equals(this.liquidityToken), "TOTAL_SUPPLY");
    invariant7(liquidity.token.equals(this.liquidityToken), "LIQUIDITY");
    invariant7(JSBI8.lessThanOrEqual(liquidity.raw, totalSupply.raw), "LIQUIDITY");
    let totalSupplyAdjusted;
    if (!feeOn) {
      totalSupplyAdjusted = totalSupply;
    } else {
      invariant7(!!kLast, "K_LAST");
      const kLastParsed = parseBigintIsh(kLast);
      if (!JSBI8.equal(kLastParsed, ZERO)) {
        const rootK = sqrt(JSBI8.multiply(this.reserve0.raw, this.reserve1.raw));
        const rootKLast = sqrt(kLastParsed);
        if (JSBI8.greaterThan(rootK, rootKLast)) {
          const numerator = JSBI8.multiply(totalSupply.raw, JSBI8.subtract(rootK, rootKLast));
          const denominator = JSBI8.add(JSBI8.multiply(rootK, FIVE), rootKLast);
          const feeLiquidity = JSBI8.divide(numerator, denominator);
          totalSupplyAdjusted = totalSupply.add(new TokenAmount(this.liquidityToken, feeLiquidity));
        } else {
          totalSupplyAdjusted = totalSupply;
        }
      } else {
        totalSupplyAdjusted = totalSupply;
      }
    }
    return new TokenAmount(
      token,
      JSBI8.divide(JSBI8.multiply(liquidity.raw, this.reserveOf(token).raw), totalSupplyAdjusted.raw)
    );
  }
};

// src/entities/route.ts
import invariant8 from "tiny-invariant";
var Route = class {
  constructor(pairs, input, output) {
    invariant8(pairs.length > 0, "PAIRS");
    invariant8(
      pairs.every((pair) => pair.chainId === pairs[0].chainId),
      "CHAIN_IDS"
    );
    invariant8(
      input instanceof Token && pairs[0].involvesToken(input) || input === ETHER && pairs[0].involvesToken(WNATIVE[pairs[0].chainId]),
      "INPUT"
    );
    invariant8(
      typeof output === "undefined" || output instanceof Token && pairs[pairs.length - 1].involvesToken(output) || output === ETHER && pairs[pairs.length - 1].involvesToken(WNATIVE[pairs[0].chainId]),
      "OUTPUT"
    );
    const path = [input instanceof Token ? input : WNATIVE[pairs[0].chainId]];
    for (const [i, pair] of pairs.entries()) {
      const currentInput = path[i];
      invariant8(currentInput.equals(pair.token0) || currentInput.equals(pair.token1), "PATH");
      const output2 = currentInput.equals(pair.token0) ? pair.token1 : pair.token0;
      path.push(output2);
    }
    this.pairs = pairs;
    this.path = path;
    this.midPrice = Price.fromRoute(this);
    this.input = input;
    this.output = output != null ? output : path[path.length - 1];
  }
  get chainId() {
    return this.pairs[0].chainId;
  }
};

// src/entities/trade.ts
import invariant9 from "tiny-invariant";

// src/entities/fractions/percent.ts
var _100_PERCENT = new Fraction(_100);
var Percent = class extends Fraction {
  toSignificant(significantDigits = 5, format, rounding) {
    return this.multiply(_100_PERCENT).toSignificant(significantDigits, format, rounding);
  }
  toFixed(decimalPlaces = 2, format, rounding) {
    return this.multiply(_100_PERCENT).toFixed(decimalPlaces, format, rounding);
  }
};

// src/entities/trade.ts
function computePriceImpact(midPrice, inputAmount, outputAmount) {
  const exactQuote = midPrice.raw.multiply(inputAmount.raw);
  const slippage = exactQuote.subtract(outputAmount.raw).divide(exactQuote);
  return new Percent(slippage.numerator, slippage.denominator);
}
function inputOutputComparator(a, b) {
  invariant9(currencyEquals(a.inputAmount.currency, b.inputAmount.currency), "INPUT_CURRENCY");
  invariant9(currencyEquals(a.outputAmount.currency, b.outputAmount.currency), "OUTPUT_CURRENCY");
  if (a.outputAmount.equalTo(b.outputAmount)) {
    if (a.inputAmount.equalTo(b.inputAmount)) {
      return 0;
    }
    if (a.inputAmount.lessThan(b.inputAmount)) {
      return -1;
    } else {
      return 1;
    }
  } else {
    if (a.outputAmount.lessThan(b.outputAmount)) {
      return 1;
    } else {
      return -1;
    }
  }
}
function tradeComparator(a, b) {
  const ioComp = inputOutputComparator(a, b);
  if (ioComp !== 0) {
    return ioComp;
  }
  if (a.priceImpact.lessThan(b.priceImpact)) {
    return -1;
  } else if (a.priceImpact.greaterThan(b.priceImpact)) {
    return 1;
  }
  return a.route.path.length - b.route.path.length;
}
function wrappedAmount(currencyAmount, chainId) {
  if (currencyAmount instanceof TokenAmount)
    return currencyAmount;
  if (currencyAmount.currency === ETHER)
    return new TokenAmount(WNATIVE[chainId], currencyAmount.raw);
  invariant9(false, "CURRENCY");
}
function wrappedCurrency(currency, chainId) {
  if (currency instanceof Token)
    return currency;
  if (currency === ETHER)
    return WNATIVE[chainId];
  invariant9(false, "CURRENCY");
}
var Trade = class {
  static exactIn(route, amountIn) {
    return new Trade(route, amountIn, 0 /* EXACT_INPUT */);
  }
  static exactOut(route, amountOut) {
    return new Trade(route, amountOut, 1 /* EXACT_OUTPUT */);
  }
  constructor(route, amount, tradeType) {
    const amounts = new Array(route.path.length);
    const nextPairs = new Array(route.pairs.length);
    if (tradeType === 0 /* EXACT_INPUT */) {
      invariant9(currencyEquals(amount.currency, route.input), "INPUT");
      amounts[0] = wrappedAmount(amount, route.chainId);
      for (let i = 0; i < route.path.length - 1; i++) {
        const pair = route.pairs[i];
        const [outputAmount, nextPair] = pair.getOutputAmount(amounts[i]);
        amounts[i + 1] = outputAmount;
        nextPairs[i] = nextPair;
      }
    } else {
      invariant9(currencyEquals(amount.currency, route.output), "OUTPUT");
      amounts[amounts.length - 1] = wrappedAmount(amount, route.chainId);
      for (let i = route.path.length - 1; i > 0; i--) {
        const pair = route.pairs[i - 1];
        const [inputAmount, nextPair] = pair.getInputAmount(amounts[i]);
        amounts[i - 1] = inputAmount;
        nextPairs[i - 1] = nextPair;
      }
    }
    this.route = route;
    this.tradeType = tradeType;
    this.inputAmount = tradeType === 0 /* EXACT_INPUT */ ? amount : route.input === ETHER ? CurrencyAmount.ether(amounts[0].raw) : amounts[0];
    this.outputAmount = tradeType === 1 /* EXACT_OUTPUT */ ? amount : route.output === ETHER ? CurrencyAmount.ether(amounts[amounts.length - 1].raw) : amounts[amounts.length - 1];
    this.executionPrice = new Price(
      this.inputAmount.currency,
      this.outputAmount.currency,
      this.inputAmount.raw,
      this.outputAmount.raw
    );
    this.nextMidPrice = Price.fromRoute(new Route(nextPairs, route.input));
    this.priceImpact = computePriceImpact(route.midPrice, this.inputAmount, this.outputAmount);
  }
  minimumAmountOut(slippageTolerance) {
    invariant9(!slippageTolerance.lessThan(ZERO), "SLIPPAGE_TOLERANCE");
    if (this.tradeType === 1 /* EXACT_OUTPUT */) {
      return this.outputAmount;
    } else {
      const slippageAdjustedAmountOut = new Fraction(ONE).add(slippageTolerance).invert().multiply(this.outputAmount.raw).quotient;
      return this.outputAmount instanceof TokenAmount ? new TokenAmount(this.outputAmount.token, slippageAdjustedAmountOut) : CurrencyAmount.ether(slippageAdjustedAmountOut);
    }
  }
  maximumAmountIn(slippageTolerance) {
    invariant9(!slippageTolerance.lessThan(ZERO), "SLIPPAGE_TOLERANCE");
    if (this.tradeType === 0 /* EXACT_INPUT */) {
      return this.inputAmount;
    } else {
      const slippageAdjustedAmountIn = new Fraction(ONE).add(slippageTolerance).multiply(this.inputAmount.raw).quotient;
      return this.inputAmount instanceof TokenAmount ? new TokenAmount(this.inputAmount.token, slippageAdjustedAmountIn) : CurrencyAmount.ether(slippageAdjustedAmountIn);
    }
  }
  static bestTradeExactIn(pairs, currencyAmountIn, currencyOut, { maxNumResults = 3, maxHops = 3 } = {}, currentPairs = [], originalAmountIn = currencyAmountIn, bestTrades = []) {
    invariant9(pairs.length > 0, "PAIRS");
    invariant9(maxHops > 0, "MAX_HOPS");
    invariant9(originalAmountIn === currencyAmountIn || currentPairs.length > 0, "INVALID_RECURSION");
    const chainId = currencyAmountIn instanceof TokenAmount ? currencyAmountIn.token.chainId : currencyOut instanceof Token ? currencyOut.chainId : void 0;
    invariant9(chainId !== void 0, "CHAIN_ID");
    const amountIn = wrappedAmount(currencyAmountIn, chainId);
    const tokenOut = wrappedCurrency(currencyOut, chainId);
    for (let i = 0; i < pairs.length; i++) {
      const pair = pairs[i];
      if (!pair.token0.equals(amountIn.token) && !pair.token1.equals(amountIn.token))
        continue;
      if (pair.reserve0.equalTo(ZERO) || pair.reserve1.equalTo(ZERO))
        continue;
      let amountOut;
      try {
        ;
        [amountOut] = pair.getOutputAmount(amountIn);
      } catch (error) {
        if (error.isInsufficientInputAmountError) {
          continue;
        }
        throw error;
      }
      if (amountOut.token.equals(tokenOut)) {
        sortedInsert(
          bestTrades,
          new Trade(
            new Route([...currentPairs, pair], originalAmountIn.currency, currencyOut),
            originalAmountIn,
            0 /* EXACT_INPUT */
          ),
          maxNumResults,
          tradeComparator
        );
      } else if (maxHops > 1 && pairs.length > 1) {
        const pairsExcludingThisPair = pairs.slice(0, i).concat(pairs.slice(i + 1, pairs.length));
        Trade.bestTradeExactIn(
          pairsExcludingThisPair,
          amountOut,
          currencyOut,
          {
            maxNumResults,
            maxHops: maxHops - 1
          },
          [...currentPairs, pair],
          originalAmountIn,
          bestTrades
        );
      }
    }
    return bestTrades;
  }
  static bestTradeExactOut(pairs, currencyIn, currencyAmountOut, { maxNumResults = 3, maxHops = 3 } = {}, currentPairs = [], originalAmountOut = currencyAmountOut, bestTrades = []) {
    invariant9(pairs.length > 0, "PAIRS");
    invariant9(maxHops > 0, "MAX_HOPS");
    invariant9(originalAmountOut === currencyAmountOut || currentPairs.length > 0, "INVALID_RECURSION");
    const chainId = currencyAmountOut instanceof TokenAmount ? currencyAmountOut.token.chainId : currencyIn instanceof Token ? currencyIn.chainId : void 0;
    invariant9(chainId !== void 0, "CHAIN_ID");
    const amountOut = wrappedAmount(currencyAmountOut, chainId);
    const tokenIn = wrappedCurrency(currencyIn, chainId);
    for (let i = 0; i < pairs.length; i++) {
      const pair = pairs[i];
      if (!pair.token0.equals(amountOut.token) && !pair.token1.equals(amountOut.token))
        continue;
      if (pair.reserve0.equalTo(ZERO) || pair.reserve1.equalTo(ZERO))
        continue;
      let amountIn;
      try {
        ;
        [amountIn] = pair.getInputAmount(amountOut);
      } catch (error) {
        if (error.isInsufficientReservesError) {
          continue;
        }
        throw error;
      }
      if (amountIn.token.equals(tokenIn)) {
        sortedInsert(
          bestTrades,
          new Trade(
            new Route([pair, ...currentPairs], currencyIn, originalAmountOut.currency),
            originalAmountOut,
            1 /* EXACT_OUTPUT */
          ),
          maxNumResults,
          tradeComparator
        );
      } else if (maxHops > 1 && pairs.length > 1) {
        const pairsExcludingThisPair = pairs.slice(0, i).concat(pairs.slice(i + 1, pairs.length));
        Trade.bestTradeExactOut(
          pairsExcludingThisPair,
          currencyIn,
          amountIn,
          {
            maxNumResults,
            maxHops: maxHops - 1
          },
          [pair, ...currentPairs],
          originalAmountOut,
          bestTrades
        );
      }
    }
    return bestTrades;
  }
};

// src/router.ts
import invariant10 from "tiny-invariant";
function toHex(currencyAmount) {
  return `0x${currencyAmount.raw.toString(16)}`;
}
var ZERO_HEX = "0x0";
var Router = class {
  constructor() {
  }
  static swapCallParameters(trade, options) {
    const etherIn = trade.inputAmount.currency === ETHER;
    const etherOut = trade.outputAmount.currency === ETHER;
    invariant10(!(etherIn && etherOut), "ETHER_IN_OUT");
    invariant10(!("ttl" in options) || options.ttl > 0, "TTL");
    const to = validateAndParseAddress(options.recipient);
    const amountIn = toHex(trade.maximumAmountIn(options.allowedSlippage));
    const amountOut = toHex(trade.minimumAmountOut(options.allowedSlippage));
    const path = trade.route.path.map((token) => token.address);
    const deadline = "ttl" in options ? `0x${(Math.floor(new Date().getTime() / 1e3) + options.ttl).toString(16)}` : `0x${options.deadline.toString(16)}`;
    const useFeeOnTransfer = Boolean(options.feeOnTransfer);
    let methodName;
    let args;
    let value;
    switch (trade.tradeType) {
      case 0 /* EXACT_INPUT */:
        if (etherIn) {
          methodName = useFeeOnTransfer ? "swapExactETHForTokensSupportingFeeOnTransferTokens" : "swapExactETHForTokens";
          args = [amountOut, path, to, deadline];
          value = amountIn;
        } else if (etherOut) {
          methodName = useFeeOnTransfer ? "swapExactTokensForETHSupportingFeeOnTransferTokens" : "swapExactTokensForETH";
          args = [amountIn, amountOut, path, to, deadline];
          value = ZERO_HEX;
        } else {
          methodName = useFeeOnTransfer ? "swapExactTokensForTokensSupportingFeeOnTransferTokens" : "swapExactTokensForTokens";
          args = [amountIn, amountOut, path, to, deadline];
          value = ZERO_HEX;
        }
        break;
      case 1 /* EXACT_OUTPUT */:
        invariant10(!useFeeOnTransfer, "EXACT_OUT_FOT");
        if (etherIn) {
          methodName = "swapETHForExactTokens";
          args = [amountOut, path, to, deadline];
          value = amountIn;
        } else if (etherOut) {
          methodName = "swapTokensForExactETH";
          args = [amountOut, amountIn, path, to, deadline];
          value = ZERO_HEX;
        } else {
          methodName = "swapTokensForExactTokens";
          args = [amountOut, amountIn, path, to, deadline];
          value = ZERO_HEX;
        }
        break;
    }
    return {
      methodName,
      args,
      value
    };
  }
};

// src/fetcher.ts
import { Contract } from "@ethersproject/contracts";
import { getNetwork } from "@ethersproject/networks";
import { getDefaultProvider } from "@ethersproject/providers";

// src/abis/IPandaPair.json
var IPandaPair_default = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address"
      },
      {
        indexed: true,
        internalType: "address",
        name: "spender",
        type: "address"
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256"
      }
    ],
    name: "Approval",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "sender",
        type: "address"
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount0",
        type: "uint256"
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount1",
        type: "uint256"
      },
      {
        indexed: true,
        internalType: "address",
        name: "to",
        type: "address"
      }
    ],
    name: "Burn",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "sender",
        type: "address"
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount0",
        type: "uint256"
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount1",
        type: "uint256"
      }
    ],
    name: "Mint",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "sender",
        type: "address"
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount0In",
        type: "uint256"
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount1In",
        type: "uint256"
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount0Out",
        type: "uint256"
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount1Out",
        type: "uint256"
      },
      {
        indexed: true,
        internalType: "address",
        name: "to",
        type: "address"
      }
    ],
    name: "Swap",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint112",
        name: "reserve0",
        type: "uint112"
      },
      {
        indexed: false,
        internalType: "uint112",
        name: "reserve1",
        type: "uint112"
      }
    ],
    name: "Sync",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "from",
        type: "address"
      },
      {
        indexed: true,
        internalType: "address",
        name: "to",
        type: "address"
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256"
      }
    ],
    name: "Transfer",
    type: "event"
  },
  {
    constant: true,
    inputs: [],
    name: "DOMAIN_SEPARATOR",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32"
      }
    ],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "MINIMUM_LIQUIDITY",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    payable: false,
    stateMutability: "pure",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "PERMIT_TYPEHASH",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32"
      }
    ],
    payable: false,
    stateMutability: "pure",
    type: "function"
  },
  {
    constant: true,
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address"
      },
      {
        internalType: "address",
        name: "spender",
        type: "address"
      }
    ],
    name: "allowance",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: false,
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address"
      },
      {
        internalType: "uint256",
        name: "value",
        type: "uint256"
      }
    ],
    name: "approve",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool"
      }
    ],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: true,
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address"
      }
    ],
    name: "balanceOf",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: false,
    inputs: [
      {
        internalType: "address",
        name: "to",
        type: "address"
      }
    ],
    name: "burn",
    outputs: [
      {
        internalType: "uint256",
        name: "amount0",
        type: "uint256"
      },
      {
        internalType: "uint256",
        name: "amount1",
        type: "uint256"
      }
    ],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "decimals",
    outputs: [
      {
        internalType: "uint8",
        name: "",
        type: "uint8"
      }
    ],
    payable: false,
    stateMutability: "pure",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "factory",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address"
      }
    ],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "getReserves",
    outputs: [
      {
        internalType: "uint112",
        name: "reserve0",
        type: "uint112"
      },
      {
        internalType: "uint112",
        name: "reserve1",
        type: "uint112"
      },
      {
        internalType: "uint32",
        name: "blockTimestampLast",
        type: "uint32"
      }
    ],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: false,
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address"
      },
      {
        internalType: "address",
        name: "",
        type: "address"
      }
    ],
    name: "initialize",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "kLast",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: false,
    inputs: [
      {
        internalType: "address",
        name: "to",
        type: "address"
      }
    ],
    name: "mint",
    outputs: [
      {
        internalType: "uint256",
        name: "liquidity",
        type: "uint256"
      }
    ],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "name",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string"
      }
    ],
    payable: false,
    stateMutability: "pure",
    type: "function"
  },
  {
    constant: true,
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address"
      }
    ],
    name: "nonces",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: false,
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address"
      },
      {
        internalType: "address",
        name: "spender",
        type: "address"
      },
      {
        internalType: "uint256",
        name: "value",
        type: "uint256"
      },
      {
        internalType: "uint256",
        name: "deadline",
        type: "uint256"
      },
      {
        internalType: "uint8",
        name: "v",
        type: "uint8"
      },
      {
        internalType: "bytes32",
        name: "r",
        type: "bytes32"
      },
      {
        internalType: "bytes32",
        name: "s",
        type: "bytes32"
      }
    ],
    name: "permit",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "price0CumulativeLast",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "price1CumulativeLast",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: false,
    inputs: [
      {
        internalType: "address",
        name: "to",
        type: "address"
      }
    ],
    name: "skim",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: false,
    inputs: [
      {
        internalType: "uint256",
        name: "amount0Out",
        type: "uint256"
      },
      {
        internalType: "uint256",
        name: "amount1Out",
        type: "uint256"
      },
      {
        internalType: "address",
        name: "to",
        type: "address"
      },
      {
        internalType: "bytes",
        name: "data",
        type: "bytes"
      }
    ],
    name: "swap",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "symbol",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string"
      }
    ],
    payable: false,
    stateMutability: "pure",
    type: "function"
  },
  {
    constant: false,
    inputs: [],
    name: "sync",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "token0",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address"
      }
    ],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "token1",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address"
      }
    ],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "totalSupply",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: false,
    inputs: [
      {
        internalType: "address",
        name: "to",
        type: "address"
      },
      {
        internalType: "uint256",
        name: "value",
        type: "uint256"
      }
    ],
    name: "transfer",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool"
      }
    ],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    constant: false,
    inputs: [
      {
        internalType: "address",
        name: "from",
        type: "address"
      },
      {
        internalType: "address",
        name: "to",
        type: "address"
      },
      {
        internalType: "uint256",
        name: "value",
        type: "uint256"
      }
    ],
    name: "transferFrom",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool"
      }
    ],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  }
];

// src/fetcher.ts
import invariant11 from "tiny-invariant";

// src/abis/ERC20.json
var ERC20_default = [
  {
    constant: true,
    inputs: [],
    name: "decimals",
    outputs: [{ name: "", type: "uint8" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  },
  {
    constant: true,
    inputs: [{ name: "", type: "address" }],
    name: "balanceOf",
    outputs: [{ name: "", type: "uint256" }],
    payable: false,
    stateMutability: "view",
    type: "function"
  }
];

// src/fetcher.ts
var TOKEN_DECIMALS_CACHE = {
  [100 /* GNOSIS */]: {
    "0xE0B7927c4aF23765Cb51314A0E0521A9645F0E2A": 9
  }
};
var Fetcher = class {
  constructor() {
  }
  static async fetchTokenData(chainId, address, provider = getDefaultProvider(getNetwork(chainId)), symbol, name) {
    var _a;
    const parsedDecimals = typeof ((_a = TOKEN_DECIMALS_CACHE == null ? void 0 : TOKEN_DECIMALS_CACHE[chainId]) == null ? void 0 : _a[address]) === "number" ? TOKEN_DECIMALS_CACHE[chainId][address] : await new Contract(address, ERC20_default, provider).decimals().then((decimals) => {
      TOKEN_DECIMALS_CACHE = {
        ...TOKEN_DECIMALS_CACHE,
        [chainId]: {
          ...TOKEN_DECIMALS_CACHE == null ? void 0 : TOKEN_DECIMALS_CACHE[chainId],
          [address]: decimals
        }
      };
      return decimals;
    });
    return new Token(chainId, address, parsedDecimals, symbol, name);
  }
  static async fetchPairData(tokenA, tokenB, provider = getDefaultProvider(getNetwork(tokenA.chainId))) {
    invariant11(tokenA.chainId === tokenB.chainId, "CHAIN_ID");
    const address = Pair.getAddress(tokenA, tokenB);
    const [reserves0, reserves1] = await new Contract(address, IPandaPair_default, provider).getReserves();
    const balances = tokenA.sortsBefore(tokenB) ? [reserves0, reserves1] : [reserves1, reserves0];
    return new Pair(new TokenAmount(tokenA, balances[0]), new TokenAmount(tokenB, balances[1]));
  }
};
export {
  ChainId,
  Currency,
  CurrencyAmount,
  ETHER,
  FACTORY_ADDRESS,
  FACTORY_ADDRESS_MAP,
  FEES_DENOMINATOR,
  FEES_NUMERATOR,
  FIVE,
  Fetcher,
  Fraction,
  INIT_CODE_HASH,
  INIT_CODE_HASH_MAP,
  InsufficientInputAmountError,
  InsufficientReservesError,
  JSBI9 as JSBI,
  MINIMUM_LIQUIDITY,
  ONE,
  Pair,
  Percent,
  Price,
  Rounding,
  Route,
  Router,
  SOLIDITY_TYPE_MAXIMA,
  SolidityType,
  TEN,
  THREE,
  TWO,
  Token,
  TokenAmount,
  Trade,
  TradeType,
  WNATIVE,
  WXDAI,
  ZERO,
  _100,
  currencyEquals,
  inputOutputComparator,
  tradeComparator
};
