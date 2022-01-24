/* eslint-disable @next/next/no-img-element */
import React, {useEffect, useState} from "react"
import PageHeader from "/src/components/common/PageHeader"
import SolanaTokenItem from "../components/SolanaTokenItem"
import CN from "classnames"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {faChartLine} from "@fortawesome/free-solid-svg-icons"
import Paths from "../lib/routes/Paths"
import {DEFAULT_PAGE_NUMBER, DEFAULT_PAGE_SIZE} from "../lib/constants/pagination"
import {listTokenController} from "../lib/controllers/token/listToken"
import {useWallet} from "@solana/wallet-adapter-react"
import {getWishlistListApi, updateWishlistListApi} from "../lib/services/api/wallet"
import _ from "lodash"
import {WISHLIST_ACTION} from "../lib/constants/wallet"
import {notification} from "antd"

const Dashboard = (props) => {
    const {trendingTokens} = props
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
            <div className="pt-24">
                <div className="container px-3 mx-auto flex flex-wrap flex-col md:flex-row items-center">
                    <div className="flex flex-col w-full md:w-1/2 justify-center items-start text-center md:text-left">
                        <p className="uppercase tracking-loose w-full">Welcome to Janus Finance!</p>
                        <h1 className="my-4 text-5xl font-bold leading-tight">Token Shopping Gateway</h1>
                        <p className="leading-normal text-2xl mb-8">Find the best defi opportunities and optimizing your
                            digital assets on Solana ecosystem</p>
                        {/*<button*/}
                        {/*    className="mx-auto lg:mx-0 hover:underline bg-white text-gray-800 font-bold rounded-full my-6 py-4 px-8 shadow-lg focus:outline-none focus:shadow-outline transform transition hover:scale-105 duration-300 ease-in-out">*/}
                        {/*    Subscribe*/}
                        {/*</button>*/}
                    </div>
                    <div className="w-full md:w-1/2 py-6 text-center">
                        <img className="w-full md:pl-20 z-50" src={'/control_panel.svg'} alt={''}/>
                    </div>
                </div>
            </div>
            {/*<div className="relative -mt-12 lg:-mt-24 text-right">*/}
            {/*    <img src={controlPanelSvg} alt=""/>*/}
            {/*</div>*/}
            <div className={''}>
                <div className={'flex justify-between'}>
                    <div className={CN("flex place-items-center mb-6")}>
                        <FontAwesomeIcon icon={faChartLine} className={"text-xl mr-4"}/>
                        <span className={CN("font-bold text-lg")}>Trending tokens</span>
                    </div>
                    <div className={'flex'}>
                        <a href={Paths.Token} className={'text-base text-blue-800'}>See more</a>
                    </div>
                </div>
                <div className={'grid grid-cols-2 gap-4 md:grid-cols-3'}>
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
        </div>
    )
}


export const getServerSideProps = async (context) => {
    const reqInit = {
        query: {
            page: DEFAULT_PAGE_NUMBER,
            size: DEFAULT_PAGE_SIZE.GRID
        }
    }
    const _solanaTokens = listTokenController(reqInit)

    const [solanaTokens] = await Promise.all([
        _solanaTokens,
    ])

    if (!solanaTokens) {
        return {
            notFound: true,
        }
    }
    return {
        props: {
            trendingTokens: JSON.parse(JSON.stringify(solanaTokens.items))
        }
    }
}


export default Dashboard
