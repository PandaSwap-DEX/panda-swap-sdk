import JSBI from 'jsbi'

// exports for external consumption
export type BigintIsh = JSBI | number | string

export enum ChainId {
  // ETHEREUM = 1,
  // RINKEBY = 4,
  GNOSIS = 100,
  GNOSIS_TESTNET = 100100,
}

export enum TradeType {
  EXACT_INPUT,
  EXACT_OUTPUT,
}

export enum Rounding {
  ROUND_DOWN,
  ROUND_HALF_UP,
  ROUND_UP,
}

export const FACTORY_ADDRESS = '0x2b316B60a79b2C5CC7145CcD449E82414d9148ab'

export const FACTORY_ADDRESS_MAP = {
  [ChainId.GNOSIS]: FACTORY_ADDRESS,
  [ChainId.GNOSIS_TESTNET]: '0x2b316B60a79b2C5CC7145CcD449E82414d9148ab',
}

export const INIT_CODE_HASH = '0x93b44c6184eab6881db78e8b70225d3b3b9ac5149fbc5fd5f835193df64ba66d'

export const INIT_CODE_HASH_MAP = {
  [ChainId.GNOSIS]: INIT_CODE_HASH,
  [ChainId.GNOSIS_TESTNET]: '0x93b44c6184eab6881db78e8b70225d3b3b9ac5149fbc5fd5f835193df64ba66d',
}

export const MINIMUM_LIQUIDITY = JSBI.BigInt(1000)

// exports for internal consumption
export const ZERO = JSBI.BigInt(0)
export const ONE = JSBI.BigInt(1)
export const TWO = JSBI.BigInt(2)
export const THREE = JSBI.BigInt(3)
export const FIVE = JSBI.BigInt(5)
export const TEN = JSBI.BigInt(10)
export const _100 = JSBI.BigInt(100)
export const FEES_NUMERATOR = JSBI.BigInt(9975)
export const FEES_DENOMINATOR = JSBI.BigInt(10000)

export enum SolidityType {
  uint8 = 'uint8',
  uint256 = 'uint256',
}

export const SOLIDITY_TYPE_MAXIMA = {
  [SolidityType.uint8]: JSBI.BigInt('0xff'),
  [SolidityType.uint256]: JSBI.BigInt('0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'),
}
