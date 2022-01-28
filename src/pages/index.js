/* eslint-disable @next/next/no-img-element */
import React, {useEffect, useState} from "react"
import PageHeader from "/src/components/common/PageHeader"
import SolanaTokenItem from "../components/SolanaTokenItem"
import CN from "classnames"
import {DEFAULT_PAGE_NUMBER, DEFAULT_PAGE_SIZE} from "../lib/constants/pagination"
import {listTokenController} from "../lib/controllers/token/listToken"
import {useWallet} from "@solana/wallet-adapter-react"
import {getWishlistListApi, updateWishlistListApi} from "../lib/services/api/wallet"
import _ from "lodash"
import {WISHLIST_ACTION} from "../lib/constants/wallet"
import {notification} from "antd"
import {SORT_AND_FILTER_FIELD} from "../lib/helpers/sort-and-filter-field/token"

const Dashboard = (props) => {
    const {trendingTokens, topSellTokens, topBuyTokens} = props
    const [wishlist, setWishList] = useState([])

    const {publicKey} = useWallet()

    useEffect(() => {
        const fetchWishlist = async (_params) => {
            // setLoading(true)
            const {data: responseData} = await getWishlistListApi({wallet_key: publicKey.toString()})
            const {wishlist} = {...responseData}
            // console.log('wishlist', wishlist)
            setWishList(wishlist)
            // setLoading(false)
        }

        if (publicKey) fetchWishlist().then()
        else setWishList([])
    }, [publicKey])
    // const router = useRouter()

    useEffect(() => {
        // new TokenListProvider().resolve().then((tokens) => {
        //     const tokenList = tokens.filterByClusterSlug('mainnet-beta').getList();
        //     console.log(tokenList);
        // });
    }, [])

    const updateWishlist = async (token, isStared) => {
        if (isStared) {
            const newWishlist = wishlist.filter(address => address !== token.address)
            setWishList(newWishlist)
        } else {
            const newWishlist = _.uniq([...wishlist, token.address])
            setWishList(newWishlist)
        }
        const reqData = {
            walletKey: publicKey.toString(),
            action: isStared ? WISHLIST_ACTION.REMOVE : WISHLIST_ACTION.ADD,
            tokenAddress: token.address
        }
        await updateWishlistListApi(reqData)
    }

    const onStarClick = (token, isStared) => {
        if (!publicKey) {
            return notification.warn({
                message: 'Warning',
                description: "You have to connect your wallet to save this item in your wishlist"
            })
        }
        return updateWishlist(token, isStared)
    }

    return (
        <div className="wrapper flex flex-col items-stretch justify-start pb-12">
            <PageHeader title={"Shopping & Optimizing your Digital Assets on Solana Ecosystem"}/>
            <div className="banner pt-10 lg:pt-20 mb-10 lg:mb-[120px]">
                <div className="mx-auto">
                    <div className="flex flex-col w-full justify-center items-center text-center">
                        <div className="powered flex justify-center content-center items-center mb-8 lg:mb-12">
                            <span className="text-sm font-medium mr-2 lg:text-xl lg:mr-3">Powered by</span>
                            <img className="banner-logo w-[78px] mr-2 lg:mr-3 lg:w-[131px]" src={'/icons/serum.svg'}/>
                            <span className="text-sm font-medium lg:text-xl mr-2 lg:mr-3">&</span>
                            <img className="banner-logo w-[107px] lg:w-[188px]" src={'/icons/solana.svg'}/>
                        </div>
                        <h1 className="banner-title font-semibold text-[28px] lg:text-5xl mb-4 lg:mb-12">Token Shopping
                            Gateway</h1>
                        <p className="banner-description text-base lg:text-2xl">Find the best DeFi opportunities and
                            optimizing your digital
                            assets on Solana ecosystem.</p>
                    </div>

                    <div
                        className={'banner-feature grid grid-cols-1 gap-6 lg:grid-cols-3 lg:gap-8 mt-10 lg:mt-[120px]'}>
                        <div className="banner-feature-item lend">
                            <div
                                className="feature-item-box flex flex-col content-center items-center px-4 py-6 text-center">
                                <div className="flex h-[120px] items-center lg:mb-10 lg:w-[94px] mb-6 w-[62px]">
                                    <img className="feature-image" src={'/image/banner2.svg'}/>
                                </div>
                                <h3 className="feature-title mb-4 text-[28px]">Token Shopping</h3>
                                <p className="feature-description mt-12 lg:mt-16 text-base lg:text-xl">Discovery for the
                                    tokens in your favorite
                                    categories</p>
                                {/*<p className="feature-description text-center">Borrow against collateral</p>*/}
                            </div>
                        </div>

                        <div className="banner-feature-item x-farm">
                            <div
                                className="feature-item-box flex flex-col content-center items-center px-4 py-6 text-center">
                                <div className="flex h-[120px] items-center lg:mb-10 lg:w-[94px] mb-6 w-[62px]">
                                    <img className="feature-image" src={'/image/banner3.svg'}/>
                                </div>
                                <h3 className="feature-title mb-4 text-[28px]">Swap</h3>
                                <p className="feature-description mt-12 lg:mt-16 text-base lg:text-xl">Buy your favorite
                                    tokens by swapping at
                                    the best price</p>
                            </div>
                        </div>

                        <div className="banner-feature-item assist">
                            <div
                                className="feature-item-box flex flex-col content-center items-center px-4 py-6 text-center">
                                <div className="flex h-[120px] items-center lg:mb-10 lg:w-[94px] mb-6 w-[62px]">
                                    <img className="feature-image" src={'/image/banner4.svg'}/>
                                </div>
                                <h3 className="feature-title mb-4 text-[28px]">DeFi Opportunities</h3>
                                <p className="feature-description mt-12 lg:mt-16 text-base lg:text-xl">Find the best
                                    DeFi opportunities based on
                                    the token you own</p>
                            </div>
                        </div>
                    </div>
                    {/*<div className="w-full md:w-1/2 py-6 text-center">*/}
                    {/*    */}
                    {/*</div>*/}
                </div>
            </div>
            {/*<div className="relative -mt-12 lg:-mt-24 text-right">*/}
            {/*    <img src={controlPanelSvg} alt=""/>*/}
            {/*</div>*/}
            <div className="tokens">
                <div className={'flex justify-between'}>
                    <div className="token-title flex place-items-center mb-6 text-xl lg:text-2xl">
                        {/*<FontAwesomeIcon icon={faChartLine} className={"text-xl mr-4"}/>*/}
                        Trending tokens
                    </div>
                    {/*<div className={'view-all'}>*/}
                    {/*    <a href={Paths.Tokens} className={'text-base text-blue-800'}>View all <FontAwesomeIcon*/}
                    {/*        icon={faArrowRight}/></a>*/}
                    {/*</div>*/}
                </div>
                <div className={'grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-8'}>
                    {
                        trendingTokens.map((token) => {
                            const isInWishlist = !!wishlist.includes(token.address)
                            return (
                                <SolanaTokenItem key={token._id} token={token} isStared={isInWishlist}
                                                 onStarClick={onStarClick}/>
                            )
                        })
                    }
                </div>
            </div>

            <div className="tokens mt-8 lg:mt-12">
                <div className={'flex justify-between'}>
                    <div className={"token-title flex place-items-center mb-6 text-xl lg:text-2xl"}>
                        {/*<FontAwesomeIcon icon={faChartLine} className={"text-xl mr-4"}/>*/}
                        Top sell tokens
                    </div>
                    {/*<div className={'view-all'}>*/}
                    {/*    <a href={Paths.Tokens} className={'text-base text-blue-800'}>View all <FontAwesomeIcon*/}
                    {/*        icon={faArrowRight}/></a>*/}
                    {/*</div>*/}
                </div>
                <div className={'grid grid-cols-2 gap-4 lg:gap-8 md:grid-cols-4'}>
                    {
                        topSellTokens.map((token) => {
                            const isInWishlist = !!wishlist.includes(token.address)
                            return (
                                <SolanaTokenItem key={token._id} token={token} isStared={isInWishlist}
                                                 onStarClick={onStarClick}/>
                            )
                        })
                    }
                </div>
            </div>

            <div className="tokens mt-8 lg:mt-12">
                <div className={'flex justify-between'}>
                    <div className="token-title flex place-items-center mb-6 text-xl lg:text-2xl">
                        {/*<FontAwesomeIcon icon={faChartLine} className={"text-xl mr-4"}/>*/}
                        Top buy tokens
                    </div>
                    {/*<div className={'view-all'}>*/}
                    {/*    <a href={Paths.Tokens} className={'text-base text-blue-800'}>View all <FontAwesomeIcon*/}
                    {/*        icon={faArrowRight}/></a>*/}
                    {/*</div>*/}
                </div>
                <div className={'grid grid-cols-2 gap-4 lg:gap-8 md:grid-cols-4'}>
                    {
                        topBuyTokens.map((token) => {
                            const isInWishlist = !!wishlist.includes(token.address)
                            return (
                                <SolanaTokenItem key={token._id} token={token} isStared={isInWishlist}
                                                 onStarClick={onStarClick}/>
                            )
                        })
                    }
                </div>
            </div>
            <div>

            </div>
        </div>
    )
}


export const getServerSideProps = async (context) => {
    const reqQuery = {
        page: DEFAULT_PAGE_NUMBER,
        size: DEFAULT_PAGE_SIZE.HOME_GRID
    }
    const _trendingTokens = listTokenController({
        query: {
            ...reqQuery,
            order_by: SORT_AND_FILTER_FIELD.TOP_TRENDING_RANK,
            order_direction: 1
        }
    })
    const _topSellTokens = listTokenController({
        query: {
            ...reqQuery,
            order_by: SORT_AND_FILTER_FIELD.TOP_SELL_RANK,
            order_direction: 1
        }
    })
    const _topBuyTokens = listTokenController({
        query: {
            ...reqQuery,
            order_by: SORT_AND_FILTER_FIELD.TOP_BUY_RANK,
            order_direction: 1
        }
    })

    const [trendingTokens, topSellTokens, topBuyTokens] = await Promise.all([
        _trendingTokens,
        _topSellTokens,
        _topBuyTokens
    ])

    if (!trendingTokens || !topSellTokens || !topBuyTokens) {
        return {
            notFound: true
        }
    }
    return {
        props: {
            trendingTokens: JSON.parse(JSON.stringify(trendingTokens.items)),
            topSellTokens: JSON.parse(JSON.stringify(topSellTokens.items)),
            topBuyTokens: JSON.parse(JSON.stringify(topBuyTokens.items))
        }
    }
}


export default Dashboard
