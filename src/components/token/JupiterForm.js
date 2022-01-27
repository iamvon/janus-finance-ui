import React, { useEffect, useMemo, useState, useCallback } from "react";
import { PublicKey } from "@solana/web3.js";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { useJupiter } from "@jup-ag/react-hook";
import { TOKEN_LIST_URL } from '@jup-ag/core'
import SwapTokenSelect from "./SwapTokenSelect"
import { ChevronDownIcon, SwitchHorizontalIcon } from '@heroicons/react/solid'
import { RefreshClockwiseIcon, WalletIcon } from './icons'
import { useTranslation } from 'next-i18next'
import Button, { IconButton, LinkButton } from './Button'
import {
  CogIcon,
  ExclamationCircleIcon,
  InformationCircleIcon,
  ExternalLinkIcon,
  SwitchVerticalIcon,
} from '@heroicons/react/outline'
import SwapTokenInfo from './SwapTokenInfo'
import { useViewport } from '../../hook/useViewport'
import {
  getTokenAccountsByOwnerWithWrappedSol,
  nativeToUi,
  zeroKey,
} from '@blockworks-foundation/mango-client'
import useLocalStorageState from '../../hook/useLocalStorageState'
import { sortBy, sum } from 'lodash'
import { numberFormatter } from './SwapTokenInfo'
import Tooltip from './Tooltip'
import SwapSettingsModal from './SwapSettingsModal'
import Modal from './Modal'
import { abbreviateAddress } from '../../utils'

const JupiterForm = ({
  inputMintAddress,
  outputMintAddress,
}) => {
  const wallet = useWallet();
  const connected = wallet.connected
  const { t } = useTranslation(['common', 'swap'])
  const [selectedRoute, setSelectedRoute] = useState(null)
  const [showRoutesModal, setShowRoutesModal] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [showWalletDraw, setShowWalletDraw] = useState(false)
  const [loadWalletTokens, setLoadWalletTokens] = useState(false)
  const [tokenPrices, setTokenPrices] = useState(null)
  const [walletTokenPrices, setWalletTokenPrices] = useState(null)
  const [walletTokens, setWalletTokens] = useState([])
  const [swapping, setSwapping] = useState(false)
  const { width } = useViewport()
  const { connection } = useConnection();
  const [hasSwapped, setHasSwapped] = useLocalStorageState('hasSwapped', false)
  const [showInputTokenSelect, setShowInputTokenSelect] = useState(false)
  const [showOutputTokenSelect, setShowOutputTokenSelect] = useState(false)
  const [tokens, setTokens] = useState([])
  const [slippage, setSlippage] = useState(0.1)
  const [coinGeckoList, setCoinGeckoList] = useState(null)

  const [formValue, setFormValue] = useState({
    amount: null,
    inputMint: new PublicKey(inputMintAddress),
    outputMint: new PublicKey(outputMintAddress),
    slippage,
  })

  const [depositAndFee, setDepositAndFee] = useState(null)
  const isMobile = width ? width < breakpoints.sm : false
  const [feeValue, setFeeValue] = useState(null)
  const [swapRate, setSwapRate] = useState(false)
  const [activeTab, setActiveTab] = useState('Market Data')

  const handleTabChange = (tabName) => {
    setActiveTab(tabName)
  }

  // @ts-ignore
  const [inputTokenInfo, outputTokenInfo] = useMemo(() => {
    return [
      tokens.find(
        (item) => item?.address === formValue.inputMint?.toBase58() || ''
      ),
      tokens.find(
        (item) => item?.address === formValue.outputMint?.toBase58() || ''
      ),
    ]
  }, [
    formValue.inputMint?.toBase58(),
    formValue.outputMint?.toBase58(),
    tokens,
  ])

  // tokens.map((token) =>  console.log(`token: ${JSON.stringify(token)}`)  )
  // console.log(formValue.inputMint.toBase58(), formValue.outputMint.toBase58())
  // console.log(inputTokenInfo, outputTokenInfo)

  // useEffect(() => {
  //   if (width >= 1680) {
  //     setShowWalletDraw(true)
  //   }
  // }, [])

  // useEffect(() => {
  //   if (width >= 1680) {
  //     setShowWalletDraw(true)
  //   }
  // }, [])

  useEffect(() => {
    const fetchCoinGeckoList = async () => {
      const response = await fetch(
        'https://api.coingecko.com/api/v3/coins/list'
      )
      const data = await response.json()
      setCoinGeckoList(data)
    }

    fetchCoinGeckoList()
  }, [])

  useEffect(() => {
    if (connected) {
      fetchWalletTokens()
    }
  }, [connected])

  useEffect(() => {
    if (!coinGeckoList?.length) return
    setTokenPrices(null)
    const fetchTokenPrices = async () => {
      const inputId = coinGeckoList.find((x) =>
        inputTokenInfos?.extensions?.coingeckoId
          ? x?.id === inputTokenInfos.extensions.coingeckoId
          : x?.symbol?.toLowerCase() === inputTokenInfo?.symbol?.toLowerCase()
      )?.id
      const outputId = coinGeckoList.find((x) =>
        outputTokenInfos?.extensions?.coingeckoId
          ? x?.id === outputTokenInfos.extensions.coingeckoId
          : x?.symbol?.toLowerCase() === outputTokenInfo?.symbol?.toLowerCase()
      )?.id

      if (inputId && outputId) {
        const results = await fetch(
          `https://api.coingecko.com/api/v3/simple/price?ids=${inputId},${outputId}&vs_currencies=usd`
        )
        const json = await results.json()
        if (json[inputId]?.usd && json[outputId]?.usd) {
          setTokenPrices({
            inputTokenPrice: json[inputId].usd,
            outputTokenPrice: json[outputId].usd,
          })
        }
      }
    }

    if (inputTokenInfo && outputTokenInfo) {
      fetchTokenPrices()
    }
  }, [inputTokenInfo, outputTokenInfo, coinGeckoList])

  const amountInDecimal = useMemo(() => {
    return formValue.amount * 10 ** (inputTokenInfo?.decimals || 1)
  }, [inputTokenInfo, formValue.amount])

  const { routeMap, allTokenMints, routes, loading, exchange, error, refresh } =
    useJupiter({
      ...formValue,
      amount: amountInDecimal,
      slippage: formValue.slippage,
    })

  useEffect(() => {
    fetch(TOKEN_LIST_URL['mainnet-beta'])
      .then((response) => response.json())
      .then((result) => {
        const tokens = allTokenMints.map((mint) =>
          result.find((item) => item?.address === mint)
        )
        setTokens(tokens)
      })
  }, [allTokenMints])

  useEffect(() => {
    if (routes) {
      setSelectedRoute(routes[0])
    }
  }, [routes])

  const fetchWalletTokens = useCallback(async () => {
    const ownedTokens = []
    const ownedTokenAccounts = await getTokenAccountsByOwnerWithWrappedSol(
      connection,
      wallet.publicKey
    )

    const tokenList = await (await fetch(TOKEN_LIST_URL['mainnet-beta'])).json()

    ownedTokenAccounts.forEach((account) => {

      const decimals = tokenList.find(
        (t) => t?.address === account.mint.toBase58()
      )?.decimals

      const uiBalance = nativeToUi(account.amount, decimals)
      ownedTokens.push({ account, uiBalance })
    })
    setWalletTokens(ownedTokens)
  }, [wallet, connection, tokens])

  useEffect(() => {
    const getDepositAndFee = async () => {
      const fees = await selectedRoute.getDepositAndFee()
      setDepositAndFee(fees)
    }
    if (selectedRoute && connected) {
      getDepositAndFee()
    }
  }, [selectedRoute])

  const inputWalletBalance = () => {
    if (walletTokens.length) {
      const walletToken = walletTokens.filter((t) => {
        return t.account.mint.toString() === inputTokenInfo?.address
      })
      const largestTokenAccount = sortBy(walletToken, 'uiBalance').reverse()[0]
      return largestTokenAccount?.uiBalance || 0.0
    }

    return 0.0
  }

  const outputWalletBalance = () => {
    if (walletTokens.length) {
      const walletToken = walletTokens.filter((t) => {
        return t.account.mint.toString() === outputTokenInfo?.address
      })
      const largestTokenAccount = sortBy(walletToken, 'uiBalance').reverse()[0]
      return largestTokenAccount?.uiBalance || 0.0
    }
    return 0.0
  }

  const [walletTokensWithInfos] = useMemo(() => {
    const userTokens = []
    tokens.map((item) => {
      const found = walletTokens.find(
        (token) => token.account.mint.toBase58() === item?.address
      )
      if (found) {
        userTokens.push({ ...found, item })
      }
    })
    return [userTokens]
  }, [walletTokens, tokens])

  const getWalletTokenPrices = async () => {
    const ids = walletTokensWithInfos.map(
      (token) => token.item.extensions?.coingeckoId
    )
    const response = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=${ids.toString()}&vs_currencies=usd`
    )
    const data = await response.json()
    setWalletTokenPrices(data)
  }

  const refreshWallet = async () => {
    setLoadWalletTokens(true)
    await fetchWalletTokens()
    await getWalletTokenPrices()
    setLoadWalletTokens(false)
  }

  const getSwapFeeTokenValue = async () => {
    const mints = selectedRoute.marketInfos.map((info) => info.lpFee.mint)
    const response = await fetch(
      `https://api.coingecko.com/api/v3/simple/token_price/solana?contract_addresses=${mints.toString()}&vs_currencies=usd`
    )
    const data = await response.json()

    const feeValue = selectedRoute.marketInfos.reduce((a, c) => {
      const feeToken = tokens.find((item) => item?.address === c.lpFee?.mint)
      const amount = c.lpFee?.amount / Math.pow(10, feeToken?.decimals)
      if (data[c.lpFee?.mint]) {
        return a + data[c.lpFee?.mint].usd * amount
      }
      if (c.lpFee?.mint === 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v') {
        return a + 1 * amount
      }
    }, 0)
    setFeeValue(feeValue)
  }

  useEffect(() => {
    if (selectedRoute) {
      getSwapFeeTokenValue()
    }
  }, [selectedRoute])

  useEffect(() => {
    getWalletTokenPrices()
  }, [walletTokensWithInfos])

  const handleSelectRoute = (route) => {
    setShowRoutesModal(false)
    setSelectedRoute(route)
  }

  const handleSwitchMints = () => {
    setFormValue((val) => ({
      ...val,
      inputMint: formValue.outputMint,
      outputMint: formValue.inputMint,
    }))
  }

  const sortedTokenMints = sortBy(tokens, (token) => {
    return token?.symbol?.toLowerCase()
  })

  const sortedUserTokenMints = sortBy(walletTokens, (token) => {
    return token?.symbol?.toLowerCase()
  })

  const outputTokenMints = useMemo(() => {
    if (routeMap.size && formValue.inputMint) {
      const routeOptions = routeMap.get(formValue.inputMint.toString())

      const routeOptionTokens = routeOptions.map((address) => {
        return tokens.find((t) => {
          return t?.address === address
        })
      })

      return routeOptionTokens
    } else {
      return sortedTokenMints
    }
  }, [routeMap, tokens, formValue.inputMint])

  // console.log(`sortedTokenMints: ${sortedTokenMints}`)
  // console.log(`sortedUserTokenMints: ${sortedUserTokenMints}`)

  // console.log(`tokens: ${tokens.length}`)
  // console.log(`walletTokens: ${walletTokens.length}`)

  const outAmountUi = selectedRoute
    ? selectedRoute.outAmount / 10 ** (outputTokenInfo?.decimals || 1)
    : null

  const swapDisabled = loading || !selectedRoute || routes?.length === 0

  const inputTokenInfos = inputTokenInfo ? (inputTokenInfo) : null
  const outputTokenInfos = outputTokenInfo ? (outputTokenInfo) : null

  return (
    <div className="grid grid-cols-12 lg:space-x-4 pb-20">
      <div className="col-span-12 xl:col-start-1">
        <div className="flex flex-col md:flex-row md:space-x-6">
          <div className="py-4 md:py-0 w-full md:w-1/2 lg:w-2/3">
            {inputTokenInfo &&
            outputTokenInfo && (
                <SwapTokenInfo
                    inputTokenId={inputTokenInfos?.extensions?.coingeckoId}
                    outputTokenId={outputTokenInfos?.extensions?.coingeckoId}
                />
            )}
          </div>
          <div className="w-full md:w-1/2 lg:w-1/3">
            <div className="relative z-10">
              <div className="bg-th-bkg-2 rounded-lg p-6 SwapBox">
                <div className="font-semibold text-base mb-4">Swap</div>

                <div className="flex justify-between mb-2">
                  <label
                    htmlFor="inputMint"
                    className="block text-sm font-semibold"
                  >
                    Pay
                  </label>
                  <div className="space-x-3">
                    <label htmlFor="amount" className="text-sm">
                      Balance: {inputWalletBalance()}
                    </label>
                    {connected ? (
                      <>
                        <LinkButton
                          className="text-th-primary text-xs"
                          onClick={() => {
                            setFormValue((val) => ({
                              ...val,
                              amount: (inputWalletBalance() / 2).toFixed(5),
                            }))
                          }}
                        >
                          half
                        </LinkButton>
                        <LinkButton
                          className="text-th-primary text-xs"
                          onClick={() => {
                            setFormValue((val) => ({
                              ...val,
                              amount: inputWalletBalance(),
                            }))
                          }}
                        >
                          max
                        </LinkButton>
                      </>
                    ) : null}
                  </div>
                </div>

                <div className="grid grid-cols-2 InputToken">
                  <div className="col-span-1">
                    <button
                      className="hover:bg-th-bkg-3 -ml-2 p-2"
                      onClick={() => setShowInputTokenSelect(true)}
                    >
                      <div className="flex h-8 items-center">
                        {inputTokenInfo?.logoURI ? (
                          <img
                            className="rounded-full TokenIcon"
                            src={inputTokenInfo?.logoURI}
                            width="24"
                            height="24"
                            alt={inputTokenInfo?.symbol}
                          />
                        ) : null}
                        <div className="ml-2 TokenName">
                          {inputTokenInfo?.symbol}
                        </div>
                        <ChevronDownIcon className="flex-shrink-0 h-5 w-5 ml-1 text-th-fgd-3" />
                      </div>
                    </button>
                  </div>
                  <div className="col-span-1 flex items-center">
                    <input
                      name="amount"
                      id="amount"
                      className="TokenValue"
                      value={formValue.amount || ''}
                      placeholder="0.00"
                      type="number"
                      pattern="[0-9]*"
                      onInput={(e) => {
                        let newValue = e.target?.value || 0
                        newValue = Number.isNaN(newValue) ? 0 : newValue

                        setFormValue((val) => ({
                          ...val,
                          amount: newValue,
                        }))
                      }}
                    />
                  </div>
                </div>

                <div className="flex justify-center my-2">
                  <button onClick={handleSwitchMints} className="IconSwap">
                    <SwitchVerticalIcon className="default-transition h-8 w-8 rounded-full p-1.5 bg-th-bkg-4 text-th-fgd-1 hover:text-th-primary" />
                  </button>
                </div>

                <div className="flex items-center justify-between mb-2">
                  <label htmlFor="outputMint" className="font-semibold text-sm">
                    Receive
                  </label>
                  <span className="text-sm">
                    Balance: {outputWalletBalance()}
                  </span>
                </div>

                <div className="grid grid-cols-2 InputToken">
                  <div className="col-span-1">
                    <button
                      className="flex h-12 items-center hover:bg-th-bkg-3 -ml-2 p-2"
                    // onClick={() => setShowOutputTokenSelect(true)}
                    >
                      {outputTokenInfo?.logoURI ? (
                        <img
                          className="rounded-full TokenIcon"
                          src={outputTokenInfo?.logoURI}
                          width="24"
                          height="24"
                          alt={outputTokenInfo?.symbol}
                        />
                      ) : null}
                      <div className="ml-2 TokenName">
                        {outputTokenInfo?.symbol}
                      </div>
                      {/* <ChevronDownIcon className="flex-shrink-0 h-5 w-5 ml-1 text-th-fgd-3" /> */}
                    </button>
                  </div>
                  <div className="col-span-1 relative flex items-center">
                    <input
                      name="amount"
                      id="amount"
                      className="TokenValue"
                      disabled
                      placeholder="0.00"
                      value={
                        selectedRoute?.outAmount && formValue.amount
                          ? Intl.NumberFormat('en', {
                            minimumSignificantDigits: 1,
                            maximumSignificantDigits: 6,
                          }).format(
                            selectedRoute?.outAmount /
                            10 ** (outputTokenInfo?.decimals || 1)
                          )
                          : ''
                      }
                    />
                    {selectedRoute?.outAmount &&
                      formValue.amount &&
                      tokenPrices?.outputTokenPrice ? (
                      <div className="absolute mt-1 right-0 text-th-fgd-3 text-xs">
                        ≈ $
                        {(
                          (selectedRoute?.outAmount /
                            10 ** (outputTokenInfo?.decimals || 1)) *
                          tokenPrices?.outputTokenPrice
                        ).toFixed(2)}
                      </div>
                    ) : null}
                  </div>
                </div>

                {routes?.length && selectedRoute ? (
                  <div className="mt-8 text-th-fgd-3 text-xs">
                    <div className="border border-th-bkg-4 mb-4 pb-4 px-3 pt-4 relative rounded-md">
                      {selectedRoute === routes[0] ? (
                        <div className="absolute bg-th-primary font-bold px-1 rounded-sm text-th-bkg-1 text-xs -top-2">
                          Best Swap
                        </div>
                      ) : null}
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="font-bold overflow-ellipsis text-sm text-th-fgd-1 whitespace-nowrap">
                            {selectedRoute?.marketInfos.map((info, index) => {
                              let includeSeparator = false
                              if (
                                selectedRoute?.marketInfos.length > 1 &&
                                index !== selectedRoute?.marketInfos.length - 1
                              ) {
                                includeSeparator = true
                              }
                              return (
                                <span key={index}>{`${info.marketMeta.amm.label
                                  } ${includeSeparator ? 'x ' : ''}`}</span>
                              )
                            })}
                          </span>
                          <div className="mr-2 mt-0.5 text-th-fgd-3 text-xs font-normal">
                            {inputTokenInfo?.symbol} →{' '}
                            {selectedRoute?.marketInfos.map((r, index) => {
                              const showArrow =
                                index !== selectedRoute?.marketInfos.length - 1
                                  ? true
                                  : false
                              return (
                                <span key={index}>
                                  <span>
                                    {
                                      tokens.find(
                                        (item) =>
                                          item?.address ===
                                          r?.outputMint?.toString()
                                      )?.symbol
                                    }
                                  </span>
                                  {showArrow ? ' → ' : ''}
                                </span>
                              )
                            })}
                          </div>
                        </div>
                        <Button
                          className="bg-transparent border border-th-fgd-4 font-normal pb-1 pt-1 px-2 rounded-md text-th-fgd-3 text-center text-xs"
                          disabled={routes?.length === 1}
                          onClick={() => setShowRoutesModal(true)}
                        >
                          {routes?.length} routes found
                        </Button>
                      </div>
                    </div>
                    <div className="px-3 space-y-2">
                      <div className="flex items-center justify-between mb-4">
                        <div className="font-bold text-sm text-th-fgd-1">
                          Swap Details
                        </div>
                        <div className="flex items-center space-x-2">
                          <IconButton onClick={() => refresh()}>
                            <RefreshClockwiseIcon
                              className={`h-4 w-4 ${loading ? 'animate-spin' : ''
                                }`}
                            />
                          </IconButton>
                          <IconButton onClick={() => setShowSettings(true)}>
                            <CogIcon className="h-4 w-4" />
                          </IconButton>
                        </div>
                      </div>
                      <div className="flex justify-between">
                        <span>Rate</span>
                        <div>
                          <div className="flex items-center justify-end">
                            <div className="text-right text-th-fgd-1">
                              {swapRate ? (
                                <>
                                  1 {inputTokenInfo?.symbol} ≈{' '}
                                  {numberFormatter.format(
                                    outAmountUi / formValue?.amount
                                  )}{' '}
                                  {outputTokenInfo?.symbol}
                                </>
                              ) : (
                                <>
                                  1 {outputTokenInfo?.symbol} ≈{' '}
                                  {numberFormatter.format(
                                    formValue?.amount / outAmountUi
                                  )}{' '}
                                  {inputTokenInfo?.symbol}
                                </>
                              )}
                            </div>
                            <SwitchHorizontalIcon
                              className="cursor-pointer default-transition h-4 ml-1 text-th-fgd-3 w-4 hover:text-th-fgd-2"
                              onClick={() => setSwapRate(!swapRate)}
                            />
                          </div>
                          {tokenPrices?.outputTokenPrice &&
                            tokenPrices?.inputTokenPrice ? (
                            <div
                              className={`text-right ${((formValue?.amount / outAmountUi -
                                tokenPrices?.outputTokenPrice /
                                tokenPrices?.inputTokenPrice) /
                                (formValue?.amount / outAmountUi)) *
                                100 <=
                                0
                                ? 'text-th-green'
                                : 'text-th-red'
                                }`}
                            >
                              {Math.abs(
                                ((formValue?.amount / outAmountUi -
                                  tokenPrices?.outputTokenPrice /
                                  tokenPrices?.inputTokenPrice) /
                                  (formValue?.amount / outAmountUi)) *
                                100
                              ).toFixed(1)}
                              %{' '}
                              <span className="text-th-fgd-4">{`${((formValue?.amount / outAmountUi -
                                tokenPrices?.outputTokenPrice /
                                tokenPrices?.inputTokenPrice) /
                                (formValue?.amount / outAmountUi)) *
                                100 <=
                                0
                                ? 'cheaper than CoinGecko'
                                : 'more expensive than CoinGecko'
                                } `}</span>
                            </div>
                          ) : null}
                        </div>
                      </div>
                      <div className="flex justify-between">
                        <span>Price Impact</span>
                        <div className="text-right text-th-fgd-1">
                          {selectedRoute?.priceImpactPct * 100 < 0.1
                            ? '< 0.1%'
                            : `~ ${(
                              selectedRoute?.priceImpactPct * 100
                            ).toFixed(4)}%`}
                        </div>
                      </div>
                      <div className="flex justify-between">
                        <span>Minimum Received</span>
                        <div className="text-right text-th-fgd-1">
                          {numberFormatter.format(
                            selectedRoute?.outAmountWithSlippage /
                            10 ** outputTokenInfo?.decimals || 1
                          )}{' '}
                          {outputTokenInfo?.symbol}
                        </div>
                      </div>
                      {!isNaN(feeValue) ? (
                        <div className="flex justify-between">
                          <span>Swap Fee</span>
                          <div className="flex items-center">
                            <div className="text-right text-th-fgd-1">
                              ≈ ${feeValue?.toFixed(2)}
                            </div>
                            <Tooltip
                              content={
                                <div className="space-y-2.5">
                                  {selectedRoute?.marketInfos.map(
                                    (info, index) => {
                                      const feeToken = tokens.find(
                                        (item) =>
                                          item?.address === info.lpFee?.mint
                                      )
                                      return (
                                        <div key={index}>
                                          <span>
                                            Fees paid to {info.marketMeta?.amm?.label}
                                          </span>
                                          <div className="text-th-fgd-1">
                                            {(
                                              info.lpFee?.amount /
                                              Math.pow(10, feeToken?.decimals)
                                            ).toFixed(6)}{' '}
                                            {feeToken?.symbol} (
                                            {info.lpFee?.pct * 100}
                                            %)
                                          </div>
                                        </div>
                                      )
                                    }
                                  )}
                                </div>
                              }
                              placement={'left'}
                            >
                              <InformationCircleIcon className="cursor-help h-3.5 ml-1.5 w-3.5 text-th-primary" />
                            </Tooltip>
                          </div>
                        </div>
                      ) : (
                        selectedRoute?.marketInfos.map((info, index) => {
                          const feeToken = tokens.find(
                            (item) => item?.address === info.lpFee?.mint
                          )
                          return (
                            <div className="flex justify-between" key={index}>
                              <span>
                                Fees paid to  {info.marketMeta?.amm?.label}
                              </span>
                              <div className="text-right text-th-fgd-1">
                                {(
                                  info.lpFee?.amount /
                                  Math.pow(10, feeToken?.decimals)
                                ).toFixed(6)}{' '}
                                {feeToken?.symbol} ({info.lpFee?.pct * 100}%)
                              </div>
                            </div>
                          )
                        })
                      )}
                      {connected ? (
                        <>
                          <div className="flex justify-between">
                            <span>Transaction Fee</span>
                            <div className="text-right text-th-fgd-1">
                              {depositAndFee
                                ? depositAndFee?.signatureFee / Math.pow(10, 9)
                                : '-'}{' '}
                              SOL
                            </div>
                          </div>
                          {depositAndFee?.ataDepositLength ||
                            depositAndFee?.openOrdersDeposits?.length ? (
                            <div className="flex justify-between">
                              <div className="flex items-center">
                                <span>Deposit</span>
                                <Tooltip
                                  content={
                                    <>
                                      {depositAndFee?.ataDepositLength ? (
                                        <div>You need to have an Associated Token Account.</div>
                                      ) : null}
                                      {depositAndFee?.openOrdersDeposits
                                        ?.length ? (
                                        <div className="mt-2">
                                          Serum requires an OpenOrders account for each token. You can close the account and recover the SOL later. {' '}
                                          <a
                                            href="https://docs.google.com/document/d/1qEWc_Bmc1aAxyCUcilKB4ZYpOu3B0BxIbe__dRYmVns/"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                          >
                                            {"Here's how"}
                                          </a>
                                        </div>
                                      ) : null}
                                    </>
                                  }
                                  placement={'left'}
                                >
                                  <InformationCircleIcon className="cursor-help h-3.5 ml-1.5 w-3.5 text-th-primary" />
                                </Tooltip>
                              </div>
                              <div>
                                {depositAndFee?.ataDepositLength ? (
                                  <div className="text-right text-th-fgd-1">
                                    {depositAndFee?.ataDepositLength === 1
                                      ? `${(depositAndFee?.ataDeposit / Math.pow(10, 9)).toFixed(5)} SOL for ${depositAndFee?.ataDepositLength} ATA Account`
                                      : `${(depositAndFee?.ataDeposit / Math.pow(10, 9)).toFixed(5)} SOL for ${depositAndFee?.ataDepositLength} ATA Accounts`
                                    }
                                  </div>
                                ) : null}
                                {depositAndFee?.openOrdersDeposits?.length ? (
                                  <div className="text-right text-th-fgd-1">
                                    {depositAndFee?.openOrdersDeposits.length >
                                      1
                                      ? `${(sum(depositAndFee?.openOrdersDeposits) / Math.pow(10, 9)).toFixed(5)} SOL for
                                          ${depositAndFee?.openOrdersDeposits.length} Serum OpenOrders Accounts`
                                      : `${(sum(depositAndFee?.openOrdersDeposits) / Math.pow(10, 9)).toFixed(5)} SOL for ${depositAndFee?.openOrdersDeposits.length} Serum OpenOrders Account`
                                    }
                                  </div>
                                ) : null}
                              </div>
                            </div>
                          ) : null}
                        </>
                      ) : null}
                    </div>
                  </div>
                ) : null}
                {error && (
                  <div className="flex items-center justify-center mt-2 text-th-red">
                    <ExclamationCircleIcon className="h-5 mr-1.5 w-5" />
                    Error in Jupiter – Try changing your input
                  </div>
                )}

                <Button
                  disabled={swapDisabled}
                  onClick={async () => {
                    if (!connected && zeroKey !== wallet?.publicKey) {
                      wallet.connect()
                    } else if (!loading && selectedRoute && connected) {
                      setSwapping(true)
                      let txCount = 1
                      let errorTxid
                      const swapResult = await exchange({
                        wallet: {
                          sendTransaction: wallet.sendTransaction,
                          publicKey: wallet.publicKey,
                          signAllTransactions: wallet.signAllTransactions,
                          signTransaction: wallet.signTransaction,
                        },
                        // wallet: wallet,
                        route: selectedRoute,
                        confirmationWaiterFactory: async (txid, totalTxs) => {
                          console.log('txid, totalTxs', txid, totalTxs)
                          if (txCount === totalTxs) {
                            errorTxid = txid
                            // notify({
                            //   type: 'confirm',
                            //   title: 'Confirming Transaction',
                            //   txid,
                            // })
                          }
                          await connection.confirmTransaction(txid)

                          txCount++
                          return await connection.getTransaction(txid, {
                            commitment: 'confirmed',
                          })
                        },
                      })
                      console.log('swapResult', swapResult)

                      setSwapping(false)
                      fetchWalletTokens()
                      if ('error' in swapResult) {
                        console.log('Error:', swapResult.error)
                        // notify({
                        //   type: 'error',
                        //   title: swapResult.error.name,
                        //   description: swapResult.error.message,
                        //   txid: errorTxid,
                        // })
                      } else if ('txid' in swapResult) {
                        // notify({
                        //   type: 'success',
                        //   title: 'Swap Successful',
                        //   description: `Swapped ${swapResult.inputAmount /
                        //     10 ** (inputTokenInfo?.decimals || 1)
                        //     } ${inputTokenInfo?.symbol} to ${swapResult.outputAmount /
                        //     10 ** (outputTokenInfo?.decimals || 1)
                        //     } ${outputTokenInfo?.symbol}`,
                        //   txid: swapResult.txid,
                        // })
                        setFormValue((val) => ({
                          ...val,
                          amount: null,
                        }))
                      }
                    }
                  }}
                  className="w-full btn btn-success mt-4"
                >
                  {connected
                    ? swapping
                      ? `Swapping...`
                      : `Swap`
                    : `Connect wallet`}
                </Button>
              </div>

              {showRoutesModal ? (
                <Modal
                  isOpen={showRoutesModal}
                  onClose={() => setShowRoutesModal(false)}
                >
                  <div className="font-bold mb-4 text-th-fgd-1 text-center text-lg">
                    {routes?.length} routes found
                  </div>
                  <div className="max-h-96 overflow-x-hidden overflow-y-auto thin-scroll pr-1">
                    {routes.map((route, index) => {
                      const selected = selectedRoute === route
                      return (
                        <div
                          key={index}
                          className={`bg-th-bkg-3 border default-transition rounded mb-2 hover:bg-th-bkg-4 ${selected
                            ? 'border-th-primary text-th-primary hover:border-th-primary'
                            : 'border-transparent text-th-fgd-1'
                            }`}
                        >
                          <button
                            className="p-4 w-full"
                            onClick={() => handleSelectRoute(route)}
                          >
                            <div className="flex justify-between items-center">
                              <div className="flex flex-col text-left">
                                <div className="whitespace-nowrap overflow-ellipsis">
                                  {route.marketInfos.map((info, index) => {
                                    let includeSeparator = false
                                    if (
                                      route.marketInfos.length > 1 &&
                                      index !== route.marketInfos.length - 1
                                    ) {
                                      includeSeparator = true
                                    }
                                    return (
                                      <span key={index}>{`${info.marketMeta.amm.label
                                        } ${includeSeparator ? 'x ' : ''}`}</span>
                                    )
                                  })}
                                </div>
                                <div className="text-th-fgd-4 text-xs font-normal">
                                  {inputTokenInfo?.symbol} →{' '}
                                  {route.marketInfos.map((r, index) => {
                                    const showArrow =
                                      index !== route.marketInfos.length - 1
                                        ? true
                                        : false
                                    return (
                                      <span key={index}>
                                        <span>
                                          {
                                            tokens.find(
                                              (item) =>
                                                item?.address ===
                                                r?.outputMint?.toString()
                                            )?.symbol
                                          }
                                        </span>
                                        {showArrow ? ' → ' : ''}
                                      </span>
                                    )
                                  })}
                                </div>
                              </div>
                              <div className="text-lg">
                                {numberFormatter.format(
                                  route.outAmount /
                                  10 ** (outputTokenInfo?.decimals || 1)
                                )}
                              </div>
                            </div>
                          </button>
                        </div>
                      )
                    })}
                  </div>
                </Modal>
              ) : null}
              {showInputTokenSelect ? (
                <SwapTokenSelect
                  isOpen={showInputTokenSelect}
                  onClose={() => setShowInputTokenSelect(false)}
                  // sortedTokenMints={[sortedUserTokenMints[0]]}
                  sortedTokenMints={sortedTokenMints}
                  onTokenSelect={(token) => {
                    setShowInputTokenSelect(false)
                    setFormValue((val) => ({
                      ...val,
                      inputMint: new PublicKey(token?.address),
                    }))
                  }}
                />
              ) : null}
              {showOutputTokenSelect ? (
                <SwapTokenSelect
                  isOpen={showOutputTokenSelect}
                  onClose={() => setShowOutputTokenSelect(false)}
                  sortedTokenMints={outputTokenMints}
                  onTokenSelect={(token) => {
                    setShowOutputTokenSelect(false)
                    setFormValue((val) => ({
                      ...val,
                      outputMint: new PublicKey(token?.address),
                    }))
                  }}
                />
              ) : null}
              {showSettings ? (
                <SwapSettingsModal
                  isOpen={showSettings}
                  onClose={() => setShowSettings(false)}
                  slippage={slippage}
                  setSlippage={setSlippage}
                />
              ) : null}
              {connected && !hasSwapped ? (
                <Modal isOpen={!hasSwapped} onClose={() => setHasSwapped(true)}>
                  <div className="flex flex-col justify-center">
                    <div className="text-center text-th-fgd-3">
                      {t('swap-in-wallet')}
                    </div>
                  </div>
                </Modal>
              ) : null}
              {showInputTokenSelect ? (
                <SwapTokenSelect
                  isOpen={showInputTokenSelect}
                  onClose={() => setShowInputTokenSelect(false)}
                  sortedTokenMints={sortedTokenMints}
                  // sortedTokenMints={[sortedUserTokenMints[0]]}
                  onTokenSelect={(token) => {
                    setShowInputTokenSelect(false)
                    setFormValue((val) => ({
                      ...val,
                      inputMint: new PublicKey(token?.address),
                    }))
                  }}
                />
              ) : null}
              {showOutputTokenSelect ? (
                <SwapTokenSelect
                  isOpen={showOutputTokenSelect}
                  onClose={() => setShowOutputTokenSelect(false)}
                  sortedTokenMints={outputTokenMints}
                  onTokenSelect={(token) => {
                    setShowOutputTokenSelect(false)
                    setFormValue((val) => ({
                      ...val,
                      outputMint: new PublicKey(token?.address),
                    }))
                  }}
                />
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default JupiterForm
