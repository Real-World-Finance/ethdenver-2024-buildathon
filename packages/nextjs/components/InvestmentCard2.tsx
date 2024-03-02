"use client";
import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { createConfig, http, readContract } from "@wagmi/core";
import { hardhat, mainnet, sepolia } from "@wagmi/core/chains";
import { useAccount, useSimulateContract, useSwitchChain, useWalletClient, useWriteContract } from "wagmi";
import deployedContracts from "~~/contracts/deployedContracts";

const chain = process.env.NODE_ENV === "production" ? mainnet : process.env.NODE_ENV === "local" ? hardhat : sepolia;
const { abi: TokenAbi } = deployedContracts[hardhat.id].RWF_Trust;

export default function InvestmentCard2({ investmentAddress }) {
    const router = useRouter();
    const { isConnected, chain: currentChain, address: connectedAddress } = useAccount();
    const getMetadata = readContract(
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
          //address: deployedContracts[chain.id].RWF_Trust.address as `0x${string}`,
          address: investmentAddress as `0x${string}`,
        },
      );
    return (
        <div
          className="card w-96 bg-base-100 shadow-xl transition ease-in-out hover:bg-slate-50 hover:cursor-pointer"
          onClick={() => router.push(`/investment/${investmentAddress}`)}
        >
           <p>InvAddr {investmentAddress}</p>
           <p>Metadata {getMetadata}</p>

        </div>
    );
}