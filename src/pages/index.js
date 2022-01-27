/* eslint-disable @next/next/no-img-element */
import React, {useEffect, useState} from "react"
import PageHeader from "/src/components/common/PageHeader"
import SolanaTokenItem from "../components/SolanaTokenItem"
import CN from "classnames"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {faArrowRight} from "@fortawesome/free-solid-svg-icons"
import Paths from "../lib/routes/Paths"
import {DEFAULT_PAGE_NUMBER, DEFAULT_PAGE_SIZE} from "../lib/constants/pagination"
import {listTokenController} from "../lib/controllers/token/listToken"
import {useWallet} from "@solana/wallet-adapter-react"
import {getWishlistListApi, updateWishlistListApi} from "../lib/services/api/wallet"
import _ from "lodash"
import {WISHLIST_ACTION} from "../lib/constants/wallet"
import {notification} from "antd"

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
                description: "You have to connect your wallet to save this item in your wishlist",
            });
        }
        return updateWishlist(token, isStared)
    }

    return (
        <div className="wrapper flex flex-col items-stretch justify-start space-y-36 pb-12">
            <PageHeader title={"Dashboard"}/>
            <div className="banner pt-24">
                <div className="container px-3 mx-auto">
                    <div className="flex flex-col w-full justify-center items-center text-center">
                        <div className="powered flex justify-center content-center items-center">
                            <span>Powered by</span>
                            <img className="banner-logo" src={'/icons/serum.svg'}/>
                            <span>&</span>
                            <img className="banner-logo" src={'/icons/solana.svg'}/>
                        </div>
                        <h1 className="banner-title">Token Shopping Gateway</h1>
                        <p className="banner-description">Find the best DeFi opportunities and optimizing your digital
                            assets on Solana ecosystem.</p>
                    </div>
                    <div className={'banner-feature grid grid-cols-2 gap-6 md:grid-cols-3'}>
                        <div className="banner-feature-item lend">
                            <div className="feature-item-box flex flex-col content-center items-center">
                                <img className="feature-image" src={'/image/banner2.svg'}/>
                                <h3 className="feature-title text-center">Token Shopping</h3>
                                <h5 className="feature-subtitle text-center">Lending & borrowing</h5>
                                <p className="feature-description text-center">Discovery for the tokens in your favorite
                                    categories</p>
                                {/*<p className="feature-description text-center">Borrow against collateral</p>*/}
                            </div>
                        </div>
                        <div className="banner-feature-item x-farm">
                            <div className="feature-item-box flex flex-col content-center items-center">
                                <img className="feature-image" src={'/image/banner3.svg'}/>
                                <h3 className="feature-title text-center">Swap</h3>
                                <h5 className="feature-subtitle text-center">First-in-market cross-margin leveraged
                                    yield farming</h5>
                                <p className="feature-description text-center">Buy your favorite tokens by swapping at
                                    the best price</p>
                            </div>
                        </div>
                        <div className="banner-feature-item assist">
                            <div className="feature-item-box flex flex-col content-center items-center">
                                <img className="feature-image" src={'/image/banner4.svg'}/>
                                <h3 className="feature-title text-center">DeFi Opportunities</h3>
                                <h5 className="feature-subtitle text-center">Auto-deleveraging to reduce liquidation
                                    risks</h5>
                                <p className="feature-description text-center">Find the best DeFi opportunities based on
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
            <div className={'tokens'}>
                <div className={'flex justify-between'}>
                    <div className={CN("token-title flex place-items-center mb-6")}>
                        {/*<FontAwesomeIcon icon={faChartLine} className={"text-xl mr-4"}/>*/}
                        Trending tokens
                    </div>
                    {/*<div className={'view-all'}>*/}
                    {/*    <a href={Paths.Tokens} className={'text-base text-blue-800'}>View all <FontAwesomeIcon*/}
                    {/*        icon={faArrowRight}/></a>*/}
                    {/*</div>*/}
                </div>
                <div className={'grid grid-cols-2 gap-6 md:grid-cols-4'}>
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

            <div className={'tokens'}>
                <div className={'flex justify-between'}>
                    <div className={CN("token-title flex place-items-center mb-6")}>
                        {/*<FontAwesomeIcon icon={faChartLine} className={"text-xl mr-4"}/>*/}
                        Top sell tokens
                    </div>
                    {/*<div className={'view-all'}>*/}
                    {/*    <a href={Paths.Tokens} className={'text-base text-blue-800'}>View all <FontAwesomeIcon*/}
                    {/*        icon={faArrowRight}/></a>*/}
                    {/*</div>*/}
                </div>
                <div className={'grid grid-cols-2 gap-6 md:grid-cols-4'}>
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

            <div className={'tokens'}>
                <div className={'flex justify-between'}>
                    <div className={CN("token-title flex place-items-center mb-6")}>
                        {/*<FontAwesomeIcon icon={faChartLine} className={"text-xl mr-4"}/>*/}
                        Top buy tokens
                    </div>
                    {/*<div className={'view-all'}>*/}
                    {/*    <a href={Paths.Tokens} className={'text-base text-blue-800'}>View all <FontAwesomeIcon*/}
                    {/*        icon={faArrowRight}/></a>*/}
                    {/*</div>*/}
                </div>
                <div className={'grid grid-cols-2 gap-6 md:grid-cols-4'}>
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
    const _trendingTokens = listTokenController({query: {...reqQuery, is_top_trending: true}})
    const _topSellTokens = listTokenController({query: {...reqQuery, is_top_sell: true}})
    const _topBuyTokens = listTokenController({query: {...reqQuery, is_top_buy: true}})

    const [trendingTokens, topSellTokens, topBuyTokens] = await Promise.all([
        _trendingTokens,
        _topSellTokens,
        _topBuyTokens
    ])

    if (!trendingTokens || !topSellTokens || !topBuyTokens) {
        return {
            notFound: true,
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
