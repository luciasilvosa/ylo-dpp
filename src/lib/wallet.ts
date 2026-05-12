import { BrowserProvider, JsonRpcSigner, Contract } from "ethers";
import { CONTRACT_ADDRESS, CHAIN_ID } from "./config";
import { DPP_REGISTRY_ABI } from "./abi";

declare global {
  interface Window {
    ethereum?: any;
  }
}

export async function conectarWallet(): Promise<{
  provider: BrowserProvider;
  signer: JsonRpcSigner;
  address: string;
}> {
  if (!window.ethereum) {
    throw new Error("Metamask no esta instalado");
  }

  const provider = new BrowserProvider(window.ethereum);
  await provider.send("eth_requestAccounts", []);
  const signer = await provider.getSigner();
  const address = await signer.getAddress();

  const network = await provider.getNetwork();
  if (Number(network.chainId) !== CHAIN_ID) {
    await cambiarAPolygonAmoy();
  }

  return { provider, signer, address };
}

async function cambiarAPolygonAmoy() {
  try {
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: "0x" + CHAIN_ID.toString(16) }],
    });
  } catch (error: any) {
    if (error.code === 4902) {
      await window.ethereum.request({
        method: "wallet_addEthereumChain",
        params: [
          {
            chainId: "0x" + CHAIN_ID.toString(16),
            chainName: "Polygon Amoy",
            nativeCurrency: { name: "POL", symbol: "POL", decimals: 18 },
            rpcUrls: ["https://rpc-amoy.polygon.technology"],
            blockExplorerUrls: ["https://amoy.polygonscan.com"],
          },
        ],
      });
    } else {
      throw error;
    }
  }
}

export function getContrato(signer: JsonRpcSigner): Contract {
  return new Contract(CONTRACT_ADDRESS, DPP_REGISTRY_ABI, signer);
}