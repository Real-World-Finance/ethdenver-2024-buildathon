export type Investment = {
  price: bigint;
  dueDate: number;
  earlyWithdrawPenalty: bigint;
  minOwnedTokens: bigint;
  availableTokens: bigint;
  nftContractAddress: string;
  imgUrl: string;
  name: string;
  symbol: string;
  expectedROI: bigint;
  pctCashReserve: bigint;
  profitPct: bigint;
};
