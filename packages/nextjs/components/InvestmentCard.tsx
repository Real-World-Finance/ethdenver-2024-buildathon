"use client";

import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export type Investment = {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  price: number;
  // category: string;
  // rating: number;
  // id: number;
  // createdAt: string;
  // updatedAt: string;
};

type InvestmentCardProps = {
  investment: Investment;
};

export default function InvestmentCard({ investment }: InvestmentCardProps) {
  const router = useRouter();
  const { name, description, imageUrl, price, id } = investment;
  return (
    <div
      className="card w-96 bg-base-100 shadow-xl transition ease-in-out hover:bg-slate-50 hover:cursor-pointer"
      onClick={() => router.push(`/investment/${id}`)}
    >
      <figure>
        <Image src={imageUrl} alt={name} width={300} height={200} style={{ paddingTop: 32 }} />
        {/* <img src={imageUrl} alt={name} width={300} height={200} style={{ paddingTop: 32 }} /> */}
      </figure>
      <div className="card-body">
        <div className="flex flex-row justify-between">
          <h2 className="card-title">{name}</h2>
          <h2 className="card-title">${price}</h2>
        </div>
        <p>{description}</p>
        {/* <div className="card-actions justify-end">
            <button className="btn btn-primary">Buy Now</button>
          </div> */}
      </div>
    </div>
  );
}
