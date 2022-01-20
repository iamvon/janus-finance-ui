
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';

export const CLUSTER = process.env.NEXT_PUBLIC_APP_CLUSTER === "mainnet"
    ? "mainnet"
    : process.env.NEXT_PUBLIC_APP_CLUSTER === "testnet"
    ? "testnet"
    : "devnet";

export const WALLET_ADAPTER_NETWORK = CLUSTER === "mainnet"
    ? WalletAdapterNetwork.Mainnet
    : CLUSTER === "testnet"
    ? WalletAdapterNetwork.Testnet
    : WalletAdapterNetwork.Devnet;

export const SolScan =
CLUSTER === "mainnet"
    ? {
        network: "mainnet-beta",
        url: 'https://api.solscan.io'
    }
    : CLUSTER === "testnet"
    ? {
        network: "testnet",
        url: 'https://api-testnet.solscan.io'
    }
    : {
        network: "devnet",
        url: 'https://api-devnet.solscan.io'
    };

export const ENV = {
    MainnetBeta: 101,
    Testnet: 102,
    Devnet: 103,
}

export const SOLANA_CHAIN_ID = CLUSTER === "mainnet"
    ? ENV.MainnetBeta
    : CLUSTER === "testnet"
    ? ENV.Testnet
    : ENV.Devnet;

export const SonarWatchEnpoint = "https://api.sonar.watch"