/* eslint-disable @next/next/no-img-element */
import React, {useRef, useState} from "react"
import PropTypes from "prop-types"
import Paths from "/src/lib/routes/Paths"
import {getImageUrl} from "/src/lib/services/util/getImageUrl"
import CN from "classnames"
import LazyLoad from "react-lazyload"
import {Modal, Spin, Tooltip} from "antd"
import {useRouter} from "next/router"
import {formatNumber} from "/src/lib/services/util/number"
import {formatFloatNumber} from "../../lib/helpers/number";
import Link from "next/link"

const RANKING_MODE = 1
const STANDARD_MODE = 2

const NftItem = (props) => {
    const {data, minWidth, scrollContainer, mode} = props
    const [loading, setLoading] = useState(true)
    const [showRarity, setShowRarity] = useState(false)
    const router = useRouter()

    const refPlaceholder = useRef()

    const removePlaceholder = () => {
        refPlaceholder.current.remove()
        setLoading(false)
    }

    const rarityDetail = (data) => {
        const itemMeta = data?.metadata ? data?.metadata : data?.nft_item?.metadata
        return (
            <div className={`flex flex-row space-x-4 mt-8`}>
                <div className={`bg-white flex flex-row justify-between shadow-md rounded-lg p-4 w-1/2`}>
                    <div className={`w-1/2`}>
                        {
                            itemMeta && itemMeta.image ?
                                <img
                                    alt={data.token_id}
                                    src={(itemMeta && getImageUrl(itemMeta.image)) || getImageUrl(null)}
                                    className={CN(
                                        "mx-auto rounded-lg object-fill h-full w-full",
                                        {"opacity-40": loading}
                                    )}
                                    onLoad={removePlaceholder}
                                    onError={removePlaceholder}
                                />
                                :
                                data.nft_collection && data.nft_collection.logo ?
                                    <div className="background-default w-full overflow-hidden relative">
                                        <div
                                            className="background-image bg-cover bg-no-repeat bg-center h-48 w-full overflow-hidden"
                                            style={{backgroundImage: `url(${data.nft_collection.logo})`}}/>
                                        <div
                                            className="image-box absolute inset-0 flex flex-col justify-center content-center">
                                            <img
                                                alt={data.token_id}
                                                src={(data.nft_collection && getImageUrl(data.nft_collection.logo)) || getImageUrl(null)}
                                                className={CN(
                                                    "mx-auto object-fill mb-2",
                                                    {"opacity-40": loading}
                                                )}
                                                onLoad={removePlaceholder}
                                                onError={removePlaceholder}
                                            />
                                            <p className={CN("mx-auto object-fill text-white font-medium drop-shadow-sm")}>Content
                                                not available yet</p>
                                        </div>
                                    </div>
                                    :
                                    <div className="background-default w-full overflow-hidden relative">
                                        <div
                                            className="background-image bg-cover bg-no-repeat bg-center h-48 w-full overflow-hidden bg-gray-500"/>
                                        <div
                                            className="image-box absolute inset-0 flex flex-col justify-center content-center">
                                            <img
                                                alt={data.token_id}
                                                src={getImageUrl(null)}
                                                className={CN(
                                                    "mx-auto object-fill mb-2",
                                                    {"opacity-40": loading}
                                                )}
                                                onLoad={removePlaceholder}
                                                onError={removePlaceholder}
                                            />
                                            <p className={CN("mx-auto object-fill text-white font-medium drop-shadow-sm")}>Content
                                                not available yet</p>
                                        </div>
                                    </div>
                        }
                    </div>
                    <div className={`flex flex-col space-y-4 px-4 w-1/2 text-gray-600`}>
                        <div className={`text-xl font-semibold text-gray-700`}>
                            {(itemMeta && itemMeta.name) ? itemMeta.name : `#${data.token_id}`}
                        </div>
                        <div className={`flex flex-row justify-between items-center text-sm font-semibold`}>
                            <div>
                                Rarity score
                            </div>
                            <div>
                                {formatFloatNumber(data?.rarity?.score)}
                            </div>
                        </div>
                        <div className={`flex flex-row justify-between items-center text-sm font-semibold`}>
                            <div>
                                Rarity ranking
                            </div>
                            <div className={`p-1 rounded-lg bg-blue-200 font-semibold text-sm`}>
                                #{data?.rarity?.rank}
                            </div>
                        </div>
                        <div className={`flex flex-row justify-between items-center text-sm font-semibold`}>
                            <div>
                                Price
                            </div>
                            <div>
                                {
                                    data?.statistic_data?.last_price?.usd ? (
                                        <>
                                            <span>$</span>{formatNumber(data.statistic_data.last_price.usd)}
                                        </>
                                    ) : "--"
                                }
                            </div>
                        </div>
                        <Link href={Paths.TokenDetail(data.smart_contract)}>
                            <a>
                                <div
                                    className={`flex text-blue-500 p-2 border border-blue-500 cursor-pointer border-2 font-semibold rounded-lg justify-center`}>
                                    See more
                                </div>
                            </a>
                        </Link>
                    </div>
                </div>
                <div className={`bg-white shadow-md rounded-lg p-4 space-y-4 w-1/2`}>
                    <div className={`text-xl text-gray-700 font-semibold`}>
                        Traits
                    </div>
                    <div className={`grid grid-cols-12 gap-2 text-sm font-semibold bg-blue-50 p-2 rounded-lg`}>
                        <div className={`col-span-5`}>Trait type</div>
                        <div className={`col-span-5`}>Value</div>
                        <div className={`col-span-2`}>Rarity</div>
                    </div>
                    <div className={`h-36 overflow-y-auto`}>
                        {data?.metadata?.props?.map((prop, i) => {
                            return (
                                <div
                                    className={`grid grid-cols-12 gap-2 text-sm font-semibold p-2 rounded-lg`}
                                    key={i}
                                >
                                    <div className={`col-span-5 text-gray-700`}>{prop?.type}</div>
                                    <div className={`col-span-5 text-gray-600`}>{prop?.value}</div>
                                    <div className={`col-span-2 text-blue-400`}>{prop?.rarity}</div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
        )
    }

    const handleClick = () => {
        if (mode !== null && mode === RANKING_MODE)
            setShowRarity(true)
        else
            router.push(Paths.TokenDetail(data.smart_contract, data.token_id))
    }

    const itemMeta = data?.metadata ? data?.metadata : data?.nft_item?.metadata
    const itemTitle = (itemMeta && itemMeta.name) ? `${itemMeta.name}: #${data.token_id}` : `#${data.token_id}`
    return (
        <div onClick={handleClick}
             className={CN(
                 "asset-item border bg-gray-light hover:shadow rounded-lg dark:bg-gray-800 flex flex-col justify-between items-stretch cursor-pointer",
                 {
                     "lg:min-w-1/6": minWidth,
                     "md:min-w-1/4": minWidth
                 }
             )}
        >
            <div>
                <div className="flex flex-col items-stretch justify-start">
                    <div className="block relative">
                        <div
                            className="flex absolute items-center place-content-center"
                            style={{
                                width: 180,
                                height: 180
                            }}
                            ref={refPlaceholder}
                        >
                            <Spin/>
                        </div>
                        <LazyLoad
                            scrollContainer={scrollContainer}
                            resize={true}
                        >
                            {
                                data && itemMeta && itemMeta.image ? <img
                                        alt={data.token_id}
                                        src={(itemMeta && getImageUrl(itemMeta.image)) || getImageUrl(null)}
                                        className={CN(
                                            "mx-auto rounded-lg object-fill h-48 w-full",
                                            {"opacity-40": loading}
                                        )}
                                        onLoad={removePlaceholder}
                                        onError={removePlaceholder}
                                    />
                                    : data.nft_collection && data.nft_collection.logo ?
                                        <div className="background-default w-full overflow-hidden relative">
                                            <div
                                                className="background-image bg-cover bg-no-repeat bg-center h-48 w-full overflow-hidden"
                                                style={{backgroundImage: `url(${data.nft_collection.logo})`}}/>
                                            <div
                                                className="image-box absolute inset-0 flex flex-col justify-center content-center">
                                                <img
                                                    alt={data.token_id}
                                                    src={(data.nft_collection && getImageUrl(data.nft_collection.logo)) || getImageUrl(null)}
                                                    className={CN(
                                                        "mx-auto object-fill mb-2",
                                                        {"opacity-40": loading}
                                                    )}
                                                    onLoad={removePlaceholder}
                                                    onError={removePlaceholder}
                                                />
                                                <p className={CN("mx-auto object-fill text-white font-medium drop-shadow-sm")}>Content
                                                    not available yet</p>
                                            </div>
                                        </div> : <div className="background-default w-full overflow-hidden relative">
                                            <div
                                                className="background-image bg-cover bg-no-repeat bg-center h-48 w-full overflow-hidden bg-gray-500"/>
                                            <div
                                                className="image-box absolute inset-0 flex flex-col justify-center content-center">
                                                <img
                                                    alt={data.token_id}
                                                    src={getImageUrl(null)}
                                                    className={CN(
                                                        "mx-auto object-fill mb-2",
                                                        {"opacity-40": loading}
                                                    )}
                                                    onLoad={removePlaceholder}
                                                    onError={removePlaceholder}
                                                />
                                                <p className={CN("mx-auto object-fill text-white font-medium drop-shadow-sm")}>Content
                                                    not available yet</p>
                                            </div>
                                        </div>
                            }
                        </LazyLoad>
                    </div>
                    <Tooltip title={itemTitle}>
                        <div className="mt-4 text-sm truncate font-semibold text-gray-700 dark:text-white mx-2"
                             style={{maxWidth: "12rem"}}>
                            {itemTitle}
                        </div>
                    </Tooltip>
                </div>

                {
                    mode !== null && mode === RANKING_MODE ?
                        <div className={`flex justify-between items-center mx-2 mt-2 mb-4`}>
                            <div className={`p-1 rounded-lg bg-blue-200 font-semibold text-sm`}>
                                #{data?.rarity?.rank}
                            </div>
                            <div className="dark:text-gray-100 text-right text-sm font-bold flex-grow">
                                {
                                    data?.statistic_data?.last_price?.usd ? (
                                        <>
                                            <span>$</span>{formatNumber(data.statistic_data.last_price.usd)}
                                        </>
                                    ) : "--"
                                }
                            </div>
                        </div>
                        :
                        <div className="flex items-center justify-between mx-2 mt-2 mb-4">
                            <div className="block relative flex-shrink cursor-pointer">
                                <img alt={data.token_id} src={getImageUrl(data.nft_collection?.logo)}
                                     className="mx-auto object-cover rounded-full h-5 w-5 "
                                />
                            </div>
                            <div className="text-gray-500 text-sm font-medium flex-shrink ml-2 truncate w-1/2">
                                <Tooltip title={data.nft_collection?.name}>
                                    {data.nft_collection?.name}
                                </Tooltip>
                            </div>
                            <div className="dark:text-gray-100 text-right text-sm font-bold my-2 flex-grow">
                                {
                                    data?.statistic_data?.last_price?.usd ? (
                                        <>
                                            <span>$</span>{formatNumber(data.statistic_data.last_price.usd)}
                                        </>
                                    ) : "--"
                                }
                            </div>
                        </div>
                }
            </div>

            <Modal
                centered
                visible={showRarity}
                footer={null}
                width={'50%'}
                onCancel={() => setShowRarity(false)}
            >
                {rarityDetail(data)}
            </Modal>
        </div>
    )
}

NftItem.propTypes = {
    data: PropTypes.any.isRequired,
    minWidth: PropTypes.bool,
    scrollContainer: PropTypes.any
}

NftItem.defaultProps = {
    minWidth: false
}

export default NftItem