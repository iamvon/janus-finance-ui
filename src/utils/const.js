
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';

export const CLUSTER = process.env.NEXT_PUBLIC_APP_CLUSTER == "mainnet-beta"
    ? "mainnet-beta"
    : process.env.NEXT_PUBLIC_APP_CLUSTER === "testnet"
        ? "testnet"
        : "mainnet-beta";

export const WALLET_ADAPTER_NETWORK = CLUSTER === "mainnet-beta"
    ? WalletAdapterNetwork.Mainnet
    : CLUSTER === "testnet"
        ? WalletAdapterNetwork.Testnet
        : WalletAdapterNetwork.Devnet;

export const SOLANA_RPC_ENDPOINT = CLUSTER === "devnet"
    ? 'https://api.devnet.solana.com'
    : "https://solana-api.projectserum.com";

export const SolScan =
    CLUSTER === "mainnet-beta"
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

export const lamportsValueSolana = 1 / 1000000000

export const SOLANA_CHAIN_ID = CLUSTER === "mainnet-beta"
    ? ENV.MainnetBeta
    : CLUSTER === "testnet"
        ? ENV.Testnet
        : ENV.Devnet;

export const SonarWatchEnpoint = "https://api.sonar.watch"

const liquidityPoolMapping = {
    'https://www.mercurial.finance/': 'https://mercurial.finance/api/pools',
    'https://api.raydium.io/': 'https://api.raydium.io/pairs',
    'https://api.orca.so': 'https://api.orca.so/allPools',
}