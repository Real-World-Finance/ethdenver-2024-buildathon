"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { createConfig, http, readContract } from "@wagmi/core";
import { formatEther } from "viem";
import { useAccount } from "wagmi";
import SpinnerIcon from "~~/components/SpinnerIcon";
import deployedContracts from "~~/contracts/deployedContracts";
import { Investment } from "~~/types/Investment";
import { GenericContractsDeclaration } from "~~/utils/scaffold-eth/contract";

type Props = {
  contractAddr: string;
};

export default function InvestmentCard2({ contractAddr }: Props) {
  const router = useRouter();
  const [metadata, setMetadata] = useState<Investment | null>(null);
  const { chain: currentChain, address: connectedAddress } = useAccount();
  if (!currentChain) return (<p>Connect your wallet please.</p>);
  const contracts = deployedContracts as GenericContractsDeclaration;
  const { abi: TokenAbi } = contracts[currentChain.id].RWF_Trust;

  useEffect(() => {
    if (!metadata) {
      readContract(
        createConfig({
          chains: [currentChain],
          transports: {
            [currentChain.id]: http(),
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
        console.log("metadata", metadata);
      });
    }
  }, [connectedAddress, contractAddr, metadata]);

  return !!metadata ? (
    <div
      className="card w-full bg-base-100 shadow-xl transition ease-in-out hover:bg-slate-50 hover:cursor-pointer"
      onClick={() => {
        console.log("contractAddr", contractAddr);
        router.push(`/investment/${contractAddr}`);
      }}
    >
      <div className="card-body">
        <div className="flex flex-row justify-between">
          <h2 className="card-title">
            {metadata.name} ({metadata.symbol})
          </h2>
          <h2 className="card-title">${formatEther(metadata.price)}</h2>
        </div>
        <figure>
          <Image src={metadata.imgUrl} alt={metadata.name} width={100} height={100} style={{ borderRadius: 10 }} />
        </figure>
        <div className="flex flex-row justify-between">
          <h3>Available Tokens</h3>
          <h3>{metadata.availableTokens.toString()}</h3>
        </div>
        <div className="flex flex-row justify-between">
          <h3>Minimum</h3>
          <h3>
            {metadata.minOwnedTokens.toString()} {metadata.symbol}
          </h3>
        </div>
        <div className="flex flex-row justify-between">
          <h3>Expected ROI</h3>
          <h3>{formatEther(metadata.expectedROI)}%</h3>
        </div>
        <div className="flex flex-row justify-between">
          <h3>Early Withdrawal Penalty</h3>
          <h3>{formatEther(metadata.earlyWithdrawPenalty)}%</h3>
        </div>
      </div>
    </div>
  ) : (
    <div className="flex content-center justify-center items-center">
      <SpinnerIcon width={80} height={80} />
    </div>
  );
}
