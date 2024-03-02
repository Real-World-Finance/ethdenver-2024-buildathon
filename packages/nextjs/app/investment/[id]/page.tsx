"use client";

import React, { useCallback, useState } from "react";
import { useParams } from "next/navigation";
import { mainnet, sepolia } from "@wagmi/core/chains";
import type { NextPage } from "next";
import { useAccount, useSwitchChain, useWalletClient, useWriteContract } from "wagmi";
import EtherIcon from "~~/components/EtherIcon";
// for development only
import Banner from "~~/components/InvestmentDetailsBanner";
import { RainbowKitCustomConnectButton } from "~~/components/scaffold-eth/RainbowKitCustomConnectButton";
import TokenAbi from "~~/contracts/TokenShop";
import { mockInvestments } from "~~/services/mockInvestment";

const validAmountRegex = /^[0-9]{0,78}\.?[0-9]{0,18}$/;

enum Tabs {
  Buy = "Buy",
  Sell = "Sell",
}

const activeTabClass =
  "inline-block p-4 text-blue-600 border-b-2 border-blue-600 rounded-t-lg dark:text-blue-500 dark:border-blue-500 active";
const inactiveTabClass =
  "inline-block p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300";

const InvestmentDetails: NextPage = () => {
  const { id } = useParams();

  const [activeTab, setActiveTab] = useState(Tabs.Buy);
  const [amount, setAmount] = useState("0");

  // query for investment details
  const investment = mockInvestments[0];

  const { data: hash, writeContract } = useWriteContract();
  const { isConnected, chain: currentChain, address: connectedAddress } = useAccount();
  // console.log("account:", account);
  const walletClient = useWalletClient();
  // console.log("walletClient:", walletClient);
  const { error: switchChainError, switchChain } = useSwitchChain();

  const getTabClass = (tab: Tabs) => (activeTab === tab ? activeTabClass : inactiveTabClass);

  const chain = process.env.NODE_ENV === "production" ? mainnet : sepolia;

  console.log("currentChain:", currentChain);
  console.log("isConnected:", isConnected);

  const handleAmountInputBlur = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!e.target.value.trim()) {
        setAmount("0");
      }
    },
    [setAmount],
  );

  const handleAmmountChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      if (validAmountRegex.test(value)) {
        setAmount(value);
      }
    },
    [setAmount],
  );

  const handleBuy = async () => {
    // const txn = await writeContract({
    //   address: connectedAddress as `0x${string}`,
    //   abi:
    // });
    // console.log("txn:", txn);
    console.log("handleBuy");
  };

  const handleSell = () => {
    console.log("handleSell");
  };

  const handleClick = useCallback(
    async (e: MouseEventHandler<HTMLButtonElement>) => {
      return activeTab === Tabs.Buy ? handleBuy() : handleSell();
    },
    [activeTab],
  );

  return (
    <>
      <Banner investment={investment} />
      <div className="grid lg:grid-cols-2 md:grid-cols-2 gap-4 sm:grid-cols-1 justify-items-end m-auto pl-5 pr-5">
        <div className="bg-white shadow-xl rounded-lg ">
          <h2 className="font-semibold text-2xl mb-4">OUSG Details</h2>
          <p className="text-gray-700 mb-4">
            Dive deep into the specifics of the OUSG product, understand its workings, and explore its unique features.
          </p>
          <div className="mb-4">
            <h3 className="font-semibold text-xl">Key Features</h3>
            <ul className="list-disc list-inside text-gray-600">
              <li>Decentralized Finance Integration</li>
              <li>High Yield Returns</li>
              <li>Stablecoin Compatibility</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-xl">Investment Strategy</h3>
            <p className="text-gray-600">
              The investment strategy focuses on maximizing returns through diversified portfolios, leveraging DeFi
              protocols, and ensuring security and transparency.
            </p>
          </div>
        </div>
        <div className="card w-96 bg-base-100 shadow-xl transition ease-in-out hover:bg-slate-50 hover:cursor-pointer w-full">
          <h1>Invest in {investment.name}</h1>
          <div className="card-actions justify-start">
            <div className="flex flex-col w-full">
              {/* Tabs */}
              <div className="text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:text-gray-400 dark:border-gray-700">
                <ul className="flex flex-wrap -mb-px">
                  <li className="me-2">
                    <span className={getTabClass(Tabs.Buy)} onClick={() => setActiveTab(Tabs.Buy)}>
                      Buy
                    </span>
                  </li>
                  <li className="me-2">
                    <span className={getTabClass(Tabs.Sell)} onClick={() => setActiveTab(Tabs.Sell)}>
                      Sell
                    </span>
                  </li>
                </ul>
              </div>

              <div className="mt-2 relative">
                <input
                  type="string"
                  name="amount"
                  id="amount"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  width={"100%"}
                  autoComplete="off" // hide password manager icon
                  value={amount}
                  onBlur={handleAmountInputBlur}
                  onChange={handleAmmountChange}
                />
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 h-full">
                  {/* <Image src="https://www.svgrepo.com/show/349356/ethereum.svg" alt="ether" /> */}
                  <EtherIcon width={20} height={20} />
                </div>
              </div>

              {isConnected && currentChain && currentChain.id === chain.id ? (
                <button className="btn btn-primary" onClick={handleClick}>
                  {activeTab === Tabs.Buy ? "Buy Now" : "Redeem"}
                </button>
              ) : isConnected && currentChain?.id !== chain.id ? (
                <button className="btn btn-primary btn-error" onClick={() => switchChain({ chainId: chain.id })}>
                  Switch Network
                </button>
              ) : (
                // <button className="btn btn-primary" onClick={openConnectModal}>Connect Wallet</button>
                <RainbowKitCustomConnectButton />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default InvestmentDetails;
