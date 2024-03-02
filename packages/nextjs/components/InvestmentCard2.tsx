"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { createConfig, http, readContract } from "@wagmi/core";
import { hardhat, mainnet, sepolia } from "@wagmi/core/chains";
import { useAccount, useSimulateContract, useSwitchChain, useWalletClient, useWriteContract } from "wagmi";
import deployedContracts from "~~/contracts/deployedContracts";
import { isProd } from "~~/utils/env";

const chain = isProd ? sepolia : process.env.NODE_ENV === "local" ? hardhat : sepolia;
const { abi: TokenAbi } = deployedContracts[chain.id].RWF_Trust;

type Props = {
  contractAddr: string;
};

export default function InvestmentCard2({ contractAddr }: Props) {
  const router = useRouter();
  const [metadata, setMetadata] = useState<string | null>(null);
  const { isConnected, chain: currentChain, address: connectedAddress } = useAccount();
  console.log("card2 chain:", chain);
  console.log("card2 connectedAddress:", connectedAddress);
  console.log("card2 tokenAbi:", TokenAbi);
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
        console.log("card2 result:", result);
        setMetadata(result);
      });
    }
  }, [connectedAddress, contractAddr, metadata]);

  return (
    <div
      className="card w-96 bg-base-100 shadow-xl transition ease-in-out hover:bg-slate-50 hover:cursor-pointer"
      onClick={() => {
        console.log("contractAddr", contractAddr);
        router.push(`/investment/${contractAddr}`);
      }}
    >
      <p>InvAddr {contractAddr}</p>
      <p>Metadata {metadata}</p>
    </div>
  );
}
