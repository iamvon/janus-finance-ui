import React, {useContext, useEffect, useRef, useState} from "react"
import {AutoComplete, Input, Spin} from "antd";
import {formatNumber} from "../../lib/services/util/formatNumber";
import {useRouter} from "next/router";
import AppContext from "../../contexts/AppContext"
import {getImageUrl} from "../../lib/services/util/getImageUrl";
import Paths from "../../lib/routes/Paths";
import {debounce, throttle} from "throttle-debounce";
import {SearchOutlined} from "@ant-design/icons";

const {Option} = AutoComplete;

const SearchBar = () => {
    const {searchQuery, setSearchQuery} = useContext(AppContext)

    const [query, setQuery] = useState(searchQuery)
    const [nftSuggestion, setNftSuggestion] = useState([])
    const [collectionSuggestion, setCollectionSuggestion] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [focusInput, setFocusInput] = useState(false)
    const searchBarContainer = useRef(null)
    const router = useRouter()

    useEffect(() => {
        function handleClickOutside(event) {
            if (searchBarContainer.current && !searchBarContainer.current.contains(event.target)) {
                setFocusInput(false)
            }
        }

        // Bind the event listener
        document.addEventListener("mousedown", handleClickOutside)
        return () => {
            // Unbind the event listener on clean up
            document.removeEventListener("mousedown", handleClickOutside)
        };
    }, [searchBarContainer])

    const handleSubmit = () => {
        setFocusInput(false)
        if (router.pathname.includes(Paths.Portfolio)) {
            setSearchQuery(query)
        } else {
            router.push({
                pathname: '/explore',
                query: {
                    q: query,
                    page: 1,
                    order_by: 'score',
                    order_direction: -1
                }
            })
        }
        setQuery('')
    }

    const handleAutocomplete = async (val) => {
        const [
            _nftSuggestion,
            _collectionSuggestion
        ] = await Promise.all([])
        if (_nftSuggestion.data.length > 0 && _collectionSuggestion.data.length > 0) {
            setNftSuggestion(_nftSuggestion.data)
            setCollectionSuggestion(_collectionSuggestion.data)
            console.log(_nftSuggestion.data)
            setIsLoading(false)
        }
    }

    const handleChangeInput = async (e) => {
        const currentInput = e.target.value
        setQuery(currentInput)
        setIsLoading(true)
        if (currentInput.length < 5) {
            throttle(1000, handleAutocomplete(currentInput))
        } else {
            debounce(500, handleAutocomplete(currentInput))
        }
    }

    const handleClickCollection = (item) => {
        // router.push({
        //     pathname: Paths.CollectionDetail(item && item.smart_contract)
        // })
        setFocusInput(false)
    }

    const handleClickNft = (item) => {
        // router.push({
        //     pathname: Paths.NFTDetail(item.smart_contract, item.token_id)
        // })
        setFocusInput(false)
    }

    const searchButton = (
        <div
            className={`flex items-center justify-center text-sm cursor-pointer`}
            onClick={() => handleSubmit()}
        >
            Search
        </div>
    )

    const defaultSuggestionContainer = (title, items, onClick) => {
        return (
            <div className={`flex flex-col w-full`}>
                <div className={`text-gray-500 font-semibold text-sm uppercase mb-4`}>{title}</div>
                {
                    items.map((item, index) => {
                        const logoUrl = item.logo ? item.logo : 'https://bscscan.com/images/main/empty-token.png'
                        return (
                            <div
                                key={index}
                                className={`flex flex-row items-center space-x-4 w-full justify-start hover:bg-blue-100 cursor-pointer rounded-lg p-4`}
                                onClick={() => onClick(item)}
                            >
                                <div>
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img height={32} width={32} src={logoUrl} alt={'thumbnail'}
                                         className={`rounded-full`}/>
                                </div>
                                <div className={`font-semibold text-sm`}>
                                    {item.name ? item.name : ''}
                                </div>
                            </div>
                        )
                    })
                }
            </div>
        )
    }

    const nftSuggestionContainer = (items) => {
        return (
            <div>
                <div className={`text-gray-500 font-semibold text-sm uppercase mb-4`}>NFT</div>
                <div className={`grid grid-cols-12 gap-4`}>
                    {
                        items.map((item, index) => {
                            return (
                                <div
                                    className={`col-span-3 flex flex-col bg-gray-light space-y-2 rounded-lg border cursor-pointer hover:shadow-lg`}
                                    key={index}
                                    onClick={() => handleClickNft(item)}
                                >
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        alt={item.token_id}
                                        src={(item.metadata && getImageUrl(item.metadata.image)) || getImageUrl(null)}
                                        // height={157} width={155}
                                        className={`rounded-t-lg w-full object-fill`}
                                    />
                                    <div className={`p-2`}>
                                        <div
                                            className={`truncate`}>{(item && item.metadata && item.metadata.name) ? item.metadata.name : `#${item.token_id}`}</div>
                                        <div className={`flex flex-row justify-between items-center`}>
                                            <div className={`flex flex-row space-x-2`}>
                                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                                <div>
                                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                                    <img alt={item.token_id}
                                                         src={getImageUrl(item.nft_collection?.logo)} width={16}
                                                         height={16}/>
                                                </div>
                                                {/*<div>*/}
                                                {/*    /!* eslint-disable-next-line @next/next/no-img-element *!/*/}
                                                {/*    <img src={item.platform} alt={'sourceThumbnail'} width={16} height={16}/>*/}
                                                {/*</div>*/}
                                            </div>
                                            <div>
                                                {
                                                    item?.statistic_data?.last_price?.usd && (
                                                        <>
                                                            <span
                                                                className="text-sm">$</span>{formatNumber(item.statistic_data.last_price.usd)}
                                                        </>
                                                    )
                                                }
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
        )
    }

    const suggestionContainer = () => {
        return (
            <div className={`flex flex-col w-full`}>
                {/*{*/}
                {/*    query === "" && !isLoading && defaultSuggestionContainer("collection", DEMO_HOT_ITEMS, handleClickCollection)*/}
                {/*}*/}
                {
                    query !== "" && isLoading &&
                    <div className={`h-full w-full flex justify-center items-center`}>
                        <Spin/>
                    </div>
                }
                {
                    query !== "" && !isLoading &&
                    <div className={`flex flex-col space-y-8`}>
                        {nftSuggestionContainer(nftSuggestion)}
                        {defaultSuggestionContainer("collection", collectionSuggestion, handleClickCollection)}
                    </div>
                }

                {/*<div className={`text-gray-500 font-semibold text-sm uppercase mt-8 mb-4`}>Recent searches</div>*/}
                {/*<div className={`flex flex-row space-x-4`}>*/}
                {/*    {*/}
                {/*        DEMO_RECENT_SEARCH.map((item, index) => {*/}
                {/*            return (*/}
                {/*                <div*/}
                {/*                    key={index}*/}
                {/*                    className={`rounded-lg bg-gray-100 text-gray-500 p-2 text-sm font-medium cursor-pointer`}*/}
                {/*                    onClick={() => setQuery(item.query)}*/}
                {/*                >*/}
                {/*                    {item.query}*/}
                {/*                </div>*/}
                {/*            )*/}
                {/*        })*/}
                {/*    }*/}
                {/*</div>*/}
            </div>
        )
    }

    return (
        <div className={`relative text-sm font-semibold`} ref={searchBarContainer}>
            <Input
                allowClear={true}
                // addonAfter={searchButton}
                value={query}
                onFocus={() => setFocusInput(true)}
                onChange={(e) => handleChangeInput(e)}
                placeholder="Search NFTs / Collections / Addresses"
                prefix={<SearchOutlined/>}
                onPressEnter={() => handleSubmit()}
            />

            {
                focusInput && query !== '' &&
                <div className={`h-auto w-full bg-white shadow-xl rounded-lg mt-2 z-50 absolute p-6 overflow-y-auto`}>
                    {suggestionContainer()}
                </div>
            }
        </div>
    )
}

export default SearchBar