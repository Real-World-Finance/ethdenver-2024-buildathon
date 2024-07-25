# 🏗 Scaffold-ETH 2

<h4 align="center">
  <a href="https://docs.scaffoldeth.io">Documentation</a> |
  <a href="https://scaffoldeth.io">Website</a>
</h4>

🧪 An open-source, up-to-date toolkit for building decentralized applications (dapps) on the Ethereum blockchain. It's designed to make it easier for developers to create and deploy smart contracts and build user interfaces that interact with those contracts.

⚙️ Built using NextJS, RainbowKit, Hardhat, Wagmi, Viem, and Typescript.

- ✅ **Contract Hot Reload**: Your frontend auto-adapts to your smart contract as you edit it.
- 🪝 **[Custom hooks](https://docs.scaffoldeth.io/hooks/)**: Collection of React hooks wrapper around [wagmi](https://wagmi.sh/) to simplify interactions with smart contracts with typescript autocompletion.
- 🧱 [**Components**](https://docs.scaffoldeth.io/components/): Collection of common web3 components to quickly build your frontend.
- 🔥 **Burner Wallet & Local Faucet**: Quickly test your application with a burner wallet and local faucet.
- 🔐 **Integration with Wallet Providers**: Connect to different wallet providers and interact with the Ethereum network.

![Debug Contracts tab](https://github.com/scaffold-eth/scaffold-eth-2/assets/55535804/b237af0c-5027-4849-a5c1-2e31495cccb1)

## Requirements

Before you begin, you need to install the following tools:

- [Node (>= v18.17)](https://nodejs.org/en/download/)
- Yarn ([v1](https://classic.yarnpkg.com/en/docs/install/) or [v2+](https://yarnpkg.com/getting-started/install))
- [Git](https://git-scm.com/downloads)

## Quickstart

To get started with Scaffold-ETH 2, follow the steps below:

1. Clone this repo & install dependencies

```
git clone https://github.com/scaffold-eth/scaffold-eth-2.git
cd scaffold-eth-2
yarn install
```

2. Run a local network in the first terminal:

```
yarn chain
```

This command starts a local Ethereum network using Hardhat. The network runs on your local machine and can be used for testing and development. You can customize the network configuration in `hardhat.config.ts`.

3. On a second terminal, deploy the test contract:

```
yarn deploy
```

This command deploys a test smart contract to the local network. The contract is located in `packages/hardhat/contracts` and can be modified to suit your needs. The `yarn deploy` command uses the deploy script located in `packages/hardhat/deploy` to deploy the contract to the network. You can also customize the deploy script.

4. On a third terminal, start your NextJS app:

```
yarn start
```

Visit your app on: `http://localhost:3000`. You can interact with your smart contract using the `Debug Contracts` page. You can tweak the app config in `packages/nextjs/scaffold.config.ts`.

Run smart contract test with `yarn hardhat:test`

- Edit your smart contract `YourContract.sol` in `packages/hardhat/contracts`
- Edit your frontend in `packages/nextjs/pages`
- Edit your deployment scripts in `packages/hardhat/deploy`

## Documentation

Visit our [docs](https://docs.scaffoldeth.io) to learn how to start building with Scaffold-ETH 2.

To know more about its features, check out our [website](https://scaffoldeth.io).

## Contributing to Scaffold-ETH 2

We welcome contributions to Scaffold-ETH 2!

Please see [CONTRIBUTING.MD](https://github.com/scaffold-eth/scaffold-eth-2/blob/main/CONTRIBUTING.md) for more information and guidelines for contributing to Scaffold-ETH 2.

# Real World Finance

## Running on server or locally

```sh
sudo docker run -d --rm -it -v"$PWD":/mnt -u$UID:$(id -g) -p80:3000 -p8545:8545 \
    --name ethdenver2024 node sh -c 'cd /mnt && exec yarn start'
```

## Test playbook

### Initial setup

These are the default Hardhat accounts, import them on your wallet:

```text
Account #0: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266 (10000 ETH)
Private Key: 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80

Account #1: 0x70997970C51812dc3A010C7d01b50e0d17dc79C8 (10000 ETH)
Private Key: 0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d
```

Account #0 creates and owns the contracts on `yarn deploy` and we will assume it's the investment trust representative.

We will use Account #1 as one investor.

Add <http://localhost:8545> with chain id `31337` to your wallet, import the Hardhat accounts and select Account #1.

Initially Account #0 will have `9999.9901 ETH` because of gas costs for the deployment of the contracts and Account #1 the full `10000 ETH`.

On the home page select "Connect Wallet" in the upper left, select the Account #1 and the "Bufficorn Castle (BCC)" investment should show up after this.

In the "Debug Contracts" screen, the `RWF_Trust` contract has `0 ETH` and `0 BCC` of `totalSupply`.

The `NFTPoI` contract also has a `totalSupply` of `0 NFTs` and if we call the `tokenURI` method with `tokenId 0` as value, it will revert with a "non existent token" exception, the same for `tokenByIndex` and `ownerOf`.

### Buying

Return to the home page and select the "Bufficorn Castle (BCC)" investment.

Buy `0.1 ETH` of it, wait a bit (seconds) for the transaction confirmation and a bit more for the investment information to refresh, also if you are lucky (experimental interface which also isn't well supported on free public RPC endpoints) you will be asked if you want to automatically add the NFT to your wallet.

In case you need to add the ERC-721 NFT manually to your wallet, add it with the `NFTPoI` contract address which should be `0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0`, and since this is the first NFT, it's `tokenId` is `0`.

You can also add the investment ERC-20 fungible token using the `TokenShop` contract address which should be `0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512` and it should auto-complete with the `BCC` symbol.

Account #1 will now have `9999.8998 ETH` (small divergence because of gas but also because of `BCC` token value rounding down since it's an integer) and `333 BCC`.

"Available Tokens" in the investment details should now show `499667 BCC` because:

```python
account1Balance = 10000.0 #initial ETH
ethSent = 0.1
account1Balance -= ethSent
# ETH to USD exchange value (hardcoded to avoid having to use an oracle in this proof of concept):
ethUSDExchangeValue = 3335.31
initialPrice = 1 #default initial USD price per token shown in the upper left of the investment
price = initialPrice
initialAvailableTokens = 500000
tokenAmount = ethSent * ethUSDExchangeValue / price #=333.531
tokenAmount = int(tokenAmount) #tokens are integer
returnedETH = ethSent - (tokenAmount * price / ethUSDExchangeValue) #=0.000159 ETH because of the integer rounding
account1Balance += returnedETH
account1BCC = tokenAmount
finalAvailableTokens = initialAvailableTokens - tokenAmount #=499667
```

In the "Debug Contracts" screen, the `RWF_Trust` contract should have a balance of `0.0198 ETH`, because of gas and:

```python
# This doesn't show in the UI but is the cash that by default gets kept on the contract for early withdrawals:
pctCashReserve = 20
ownerETH = (100 - pctCashReserve) * ethSent / 100 #=0.08 ETH
contractETH = ethSent - ownerETH #=0.02 ETH
```

Account #0 will have `10000.0701 ETH` because:

```python
account0Balance = 9999.9901 #the initial balance shown earlier
account0Balance += ownerETH #=10000.0701 ETH
```

If you go to the "Debug Contracts" screen, the `NFTPoI` contract now has a `totalSupply` of `1 NFT`, calling `tokenURI` with `0` as `tokenId` should show an URL which if visited shows a JSON which has a useful image URL and metadata, `ownerOf` with `0` as `tokenId` should return `0x70997970C51812dc3A010C7d01b50e0d17dc79C8` which is the Account #1 address.

### Investment price fluctuations

Let's assume time passes and the investment property gained some value, for example `10%` more value, since it's more finished or market fluctuation or whatever...

For that, the investment owner which in our case is Account #0, can go to the "Debug Contracts" screen, select the `RWF_Trust` contract, and in the `setPrice` method input `1100000000000000000` (corresponding to `1.10 * 10**18`).

Returning to the app and refreshing it, will show `$1.10` as the USD value of the `BCC` in the upper right.

### Selling part of the investment with early withdrawal penalty

Now let's sell / redeem `33 BCC` tokens (with the Account #1 remember) and after the transaction is confirmed, the "Available Tokens" will show `499700 BCC`, we will have `9999.9094 ETH` and `300 BCC`, also the `RWF_Trust` contract will have `0.0102 ETH` because:

```python
price = 1.1 #we increased earlier
tokenAmount = 33
finalAvailableTokens += tokenAmount #=499700
earlyWithdrawPenalty = 10 #10% as set in the contract constructor
penalty = tokenAmount * price * earlyWithdrawPenalty / 100 #=3.63 tokens (33*1.1 is 36.3 tokens)
profit = (price - initialPrice) * tokenAmount #=3.3 tokens
profitPct = 15 #15% of the profit earnings are for the platform owners (as shown in the investment)
platformProfit = profit * profitPct / 100 #=0.4950 tokens
amountUSD = tokenAmount * price - penalty - platformProfit #=32.1750 tokens
ethAmount =  amountUSD / ethUSDExchangeValue #=0.0096 ETH
account1Balance += ethAmount #=9999.9098
contractETH -= ethAmount #=0.0103
```

### Ending the investment

More time passes and the investment is finished, let's assume business went well and the final ROI is `17%` (more than the initially advertised `15%` yay!), so let's send the rewards to the beneficiaries.

With the trust owner which is Account #0 we go to "Debug Contracts" and in the `RWF_Trust` contract, we call `setPrice` with `1170000000000000000` (`1.17 * 10**18`).

Next we need to call `investmentExecution` to distribute the funds between all the beneficiaries, but we can't call it unless the `dueDate` has passed by, so we must change it first with `setDueDate` with `0` (or whatever Unix Timestamp in the past you wish).

If we now do the call to `investmentExecution` with `0 ETH` as value, it will revert too, indicating the amount of ETH we should send in addition to the funds already on the contract, which is `92749939286003399 WEI`.

Calculating things by hand and ignoring gas we end up with needing to send about `0.0926 ETH` or `92600000000000000 WEI`:

- `7.65` USD are for the platform owners (this one arranged directly)
- `0.1030 ETH` for Account #1 (since it's the only beneficiary), ending with `10000.0127 ETH` in total at the end
- and Account #0 will have `9999.9775 ETH`

```python
price = 1.17 #increased earlier
tokenAmount = initialAvailableTokens - finalAvailableTokens #=300 tokens
profit = (price - initialPrice) * tokenAmount #=USD 51
platformProfit = profit * profitPct / 100 #=USD 7.65
amountUSD = tokenAmount * price - platformProfit #=USD 343.35
ethAmount =  amountUSD / ethUSDExchangeValue #=0.1030 ETH
sendETH = ethAmount - contractETH #=0.0926 ETH to add to the contract
account1Balance += ethAmount #=10000.0127 ETH
account0Balance -= sendETH #=9999.9775 ETH
```

So now we can finally call the `investmentExecution` method with it's indicated `92749939286003399 WEI`.

The `RWF_Trust` contract will have `0 ETH` of balance and `0 BCC` of `totalSupply`, Account #0 `9999.9771 ETH` and #1 `10000.0123 ETH` and `0 BCC`.
