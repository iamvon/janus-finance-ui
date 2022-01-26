import { TOKEN_PROGRAM_ID } from "@solana/spl-token"
import { TokenListProvider, TokenInfo } from '@solana/spl-token-registry';
import {SOLANA_CHAIN_ID} from './const'
import axios from "axios"

export const getTokenMap = async () => {
    return new TokenListProvider().resolve().then(tokens => {
        const tokenList = tokens.filterByChainId(SOLANA_CHAIN_ID).getList();
        const tokenMaps = tokenList.reduce((map, item) => {
            map.set(item.address, item);
            return map;
        },new Map());
        return tokenMaps
    });
}

export const getAccountStake = async (address) => {
    try {
        const response = await axios.get(`https://api.solscan.io/account/stake?address=${address}`)
        const {data} = response
        const {success} = data
        if (success) {
            return data.data
        } else {
            return {}
        }
    } catch (err) {
        return {}
    }
}


export const scanTokenByPK = async (connection, walletAddress) => {
    const tokenMap = await getTokenMap()
    const accounts = await connection.getParsedProgramAccounts(
        TOKEN_PROGRAM_ID,
        {
            filters: [
                {
                dataSize: 165, // number of bytes
                },
                {
                    memcmp: {
                        offset: 32, // number of bytes
                        bytes: walletAddress, // base58 encoded string
                    },
                },
            ],
        }
    );
    const tokens = accounts.map(({account}) => {
        const {parsed, program} = account.data
        const {info, type} = parsed
        const {tokenAmount, isNative, mint, owner, state} = info
        const {amount, decimals, uiAmount, uiAmountString} = tokenAmount
        const token = tokenMap.get(mint);
        return {
            type,
            isNative, 
            mint, 
            owner, 
            state,
            amount, 
            decimals, 
            uiAmount, 
            uiAmountString,
            ...token
        }
    })
    return tokens
}

