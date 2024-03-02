"use client";

import React, { Suspense, useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { createConfig, http, readContract } from "@wagmi/core";
import { hardhat, mainnet, sepolia } from "@wagmi/core/chains";
import type { NextPage } from "next";
import { LoaderIcon } from "react-hot-toast";
import { formatEther, parseEther, parseUnits } from "viem";
import { useAccount, useSimulateContract, useSwitchChain, useWalletClient, useWriteContract } from "wagmi";
import EtherIcon from "~~/components/EtherIcon";
// for development only
import Banner from "~~/components/InvestmentDetailsBanner";
import InvestmentExtraDetails from "~~/components/InvestmentExtraDetails";
import RWFIcon from "~~/components/RWFIcon";
import SpinnerIcon from "~~/components/SpinnerIcon";
import { RainbowKitCustomConnectButton } from "~~/components/scaffold-eth/RainbowKitCustomConnectButton";
// import TokenContractJson from "~~/contracts/TokenShop.sol/RWF_Trust.json";
import deployedContracts from "~~/contracts/deployedContracts";
import scaffoldConfig from "~~/scaffold.config";
import { mockInvestments } from "~~/services/mockInvestment";
import { Investment } from "~~/types/Investment";
import { isProd } from "~~/utils/env";

const chain = isProd ? sepolia : process.env.NODE_ENV === "local" ? hardhat : sepolia;
const { abi: TokenAbi } = deployedContracts[chain.id].RWF_Trust;

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
  const { contractAddr } = useParams();
  const queryClient = useQueryClient();

  const [activeTab, setActiveTab] = useState(Tabs.Buy);
  const [amount, setAmount] = useState("0");
  const [metadata, setMetadata] = useState<Investment | null>(null);

  // query for investment details

  const { data: txnHash, status: writeContractStatus, error: writeContractError, writeContract } = useWriteContract();
  const { isConnected, chain: currentChain, address: connectedAddress } = useAccount();
  const { error: switchChainError, switchChain } = useSwitchChain();

  const getTabClass = (tab: Tabs) => (activeTab === tab ? activeTabClass : inactiveTabClass);

  useEffect(() => {
    if (!metadata && connectedAddress) {
      readContract(
        createConfig({
          chains: [chain],
          transports: {
            [chain.id]: http(),
          },
        }),
        {
          abi: TokenAbi,
          account: connectedAddress,
          functionName: "getMetadata",
          address: contractAddr as `0x${string}`,
          args: [],
        },
      ).then(result => {
        setMetadata(JSON.parse(result));
      });
    }
  }, [connectedAddress, contractAddr, metadata]);

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
    if (Number(amount) > 0 && writeContract) {
      await writeContract({
        address: contractAddr as string,
        abi: TokenAbi,
        functionName: "buy",
        value: parseEther(amount),
        args: [],
      });
    }
  };

  const handleSell = async () => {
    const decimals = await readContract(
      createConfig({
        chains: [chain],
        transports: {
          [chain.id]: http(),
        },
      }),
      {
        abi: TokenAbi,
        account: connectedAddress,
        functionName: "decimals",
        address: contractAddr as string,
      },
    );

    if (Number(amount) > 0 && writeContract) {
      await writeContract({
        address: contractAddr as string,
        abi: TokenAbi,
        functionName: "sell",
        value: parseUnits(amount, decimals),
        args: [],
        account: connectedAddress,
      });
    }
  };

  const handleClick = async () => {
    return activeTab === Tabs.Buy ? await handleBuy() : await handleSell();
  };

  const handleChangeTab = (tab: Tabs) => {
    setActiveTab(tab);
    setAmount("0");
  };

  useEffect(() => {
    if (txnHash) console.log(txnHash);
  }, [txnHash]);

  return (
    <>
      {!!metadata ? (
        <div className="justify-center grid grid-cols-1 gap-4 justify-items-center ml-5 mr-5">
          <Banner investment={metadata} className="w-full max-w-screen-md mt-[25px] mb-[25px]" />
          {/* <InvestmentExtraDetails /> */}
          <div className="min-h-[45vh]  h-auto sm:mx-[100px] w-full flex justify-center md:px-5 sm:px-0 h-[40vh]">
            <div className="max-w-screen-md rounded-lg w-card bg-base-100 shadow-xl transition ease-in-out w-full">
              <h1 className="pl-4 pr-4 pt-4 font-semibold">Invest in {metadata?.symbol}</h1>
              <div className="grid grid-col-1 ml-[15px]">
                <div className="flex flex-row gap-x-[8rem]">
                  <div className="min-w-[180px]">Available Tokens</div>
                  <div>{metadata.availableTokens.toString()}</div>
                </div>
                <div className="flex flex-row gap-x-[8rem]">
                  <div className="min-w-[180px]">Minimum</div>
                  <div>
                    {metadata.minOwnedTokens.toString()} {metadata.symbol}
                  </div>
                </div>
                <div className="flex flex-row gap-x-[8rem]">
                  <div className="min-w-[180px]">Expected ROI</div>
                  <div>{formatEther(metadata.expectedROI)}%</div>
                </div>
                <div className="flex flex-row gap-x-[8rem]">
                  <div className="min-w-[180px]">% Ether In Reserve</div>
                  <div>{formatEther(metadata.pctCashReserve)}%</div>
                </div>
                <div className="flex flex-row gap-x-[8rem]">
                  <div className="min-w-[180px]">% Trust Profit</div>
                  <div>{formatEther(metadata.profitPct)}%</div>
                </div>
                <div className="flex flex-row gap-x-[8rem]">
                  <div className="min-w-[180px]">Early Withdrawal Penalty</div>
                  <div className="text-left justify-left">${formatEther(metadata.earlyWithdrawPenalty)}</div>
                </div>
              </div>
              <div className="card-actions justify-start">
                <div className="flex flex-col w-full">
                  {/* Tabs */}
                  <div className="text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:text-gray-400">
                    <ul className="flex flex-wrap -mb-px">
                      <li className="me-2">
                        <span className={getTabClass(Tabs.Buy)} onClick={() => handleChangeTab(Tabs.Buy)}>
                          Buy
                        </span>
                      </li>
                      <li className="me-2">
                        <span className={getTabClass(Tabs.Sell)} onClick={() => handleChangeTab(Tabs.Sell)}>
                          Sell
                        </span>
                      </li>
                    </ul>
                  </div>

                  <div className="mt-4 relative pl-4 pr-4">
                    <input
                      type="string"
                      name="amount"
                      id="amount"
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      width={"100%"}
                      height={"50px"}
                      style={{ paddingLeft: 10, paddingRight: 10, fontSize: 16 }}
                      autoComplete="off" // hide password manager icon
                      value={amount}
                      onBlur={handleAmountInputBlur}
                      onChange={handleAmmountChange}
                    />
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-[20px] h-full">
                      {/* <Image src="https://www.svgrepo.com/show/349356/ethereum.svg" alt="ether" /> */}
                      {activeTab === Tabs.Buy ? (
                        <EtherIcon width={20} height={20} />
                      ) : (
                        // <RWFIcon width={30} height={30} />
                        <Image
                          src={metadata.imgUrl}
                          alt={metadata.name}
                          width={20}
                          height={20}
                          style={{ borderRadius: 5 }}
                        />
                      )}
                    </div>
                  </div>

                  <div className="w-full mt-4 pl-4 pr-4">
                    {isConnected && currentChain && currentChain.id === chain.id ? (
                      <button
                        className="btn btn-primary w-full rounded-md"
                        onClick={handleClick}
                        disabled={writeContractStatus === "pending"}
                      >
                        {writeContractStatus === "pending" ? (
                          <SpinnerIcon />
                        ) : activeTab === Tabs.Buy ? (
                          "Buy Now"
                        ) : (
                          "Redeem"
                        )}
                      </button>
                    ) : isConnected && currentChain?.id !== chain.id ? (
                      <button
                        className="btn btn-primary btn-error w-full rounded-md"
                        onClick={() => {
                          switchChain({ chainId: chain.id });
                        }}
                      >
                        Switch Network
                      </button>
                    ) : (
                      <RainbowKitCustomConnectButton />
                    )}
                  </div>

                  {writeContractError && (
                    <div
                      role="alert"
                      className="mb-[16px] p-[10px] w-auto mt-4 ml-4 mr-4 text-sm text-red-800 rounded-md bg-red-50 dark:bg-gray-800 dark:text-red-400"
                    >
                      <span>{writeContractError.message}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <LoaderIcon />
      )}
    </>
  );
};

export default InvestmentDetails;
