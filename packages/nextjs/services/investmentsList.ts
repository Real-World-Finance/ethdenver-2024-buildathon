import deployedContracts from "../contracts/deployedContracts";
import {
  /* hardhat, mainnet, */
  sepolia,
} from "@wagmi/core/chains";
import type { Chain } from "viem/types/chain";
import { GenericContractsDeclaration } from "~~/utils/scaffold-eth/contract";

export function investmentsList(currentChain: Chain): string[] {
  if (currentChain.id == sepolia.id) {
    // RWF_Trust instances on Sepolia testnet:
    return [
      //"0xE8Db632234CF3Ee17C9589Ff01d911EfeC1c45fE",
      //Original on video, doesn't work: "0xdbd7A1F63Df3c10D5B2941FEBA9da8f54d2396Db",
      //Original on video: "0x871CFce821F794297acDc708eC33227865c68540",
      //"0xF0eb41b0C64f032eED21c4f918d550c6757F8Eb8", //100% cash reserve
      //"0xA37d0Cb07789A83628ddDFa6458E30AfAf94ee9C",
      //"0x60c4D4a32eCe6A3c519D778Aec639d3123608768", // 100% cash reserve to test selling
      //2024-06-10 with fixed NFTs etc.:
      "0x68bceaa767c90e8be3e782f581104b6f4e6133cf",
      "0x33de84c5ca7310307ad32362fdefcb6bac7ff738",
      "0xe2c1aa563da2711192285fd3596ba7cfef26e93e",
    ];
  } else {
    const contracts = deployedContracts as GenericContractsDeclaration;
    return [contracts[currentChain.id].RWF_Trust.address];
  }
}
