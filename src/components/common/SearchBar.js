import React, {useCallback, useContext, useEffect, useRef, useState} from "react"
import {Input, Spin} from "antd";
import {useRouter} from "next/router";
import AppContext from "../../contexts/AppContext"
import Paths from "../../lib/routes/Paths";
// import {debounce, throttle} from "throttle-debounce";
import {debounce} from 'lodash';
import {SearchOutlined} from "@ant-design/icons";
import {getTokenListApi} from "../../lib/services/api/token";


const SearchBar = () => {
    const {searchQuery, setSearchQuery} = useContext(AppContext)
    const [query, setQuery] = useState(searchQuery)
    // const [nftSuggestion, setNftSuggestion] = useState([])
    const [collectionSuggestion, setCollectionSuggestion] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [focusInput, setFocusInput] = useState(false)
    const searchBarContainer = useRef(null)
    const router = useRouter()

    useEffect(() => {
        setQuery(searchQuery)
    }, [searchQuery])

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

    const handleSubmit = async () => {
        setFocusInput(false)
        setSearchQuery(query)
        // if (router.pathname.includes(Paths.Tokens)) {
        //     // setSearchQuery(query)
        // } else {
        await router.push({
            pathname: Paths.Tokens,
            query: {
                q: query,
                page: 1,
                order_by: 'score',
                order_direction: -1
            }
        })
        // }
        // setQuery('')
    }

    const handleAutocomplete = async (val) => {
        console.log(val)
        const _collectionSuggestion = await getTokenListApi({
            q: val
        })
        if (_collectionSuggestion.data.items.length > 0) {
            setCollectionSuggestion(_collectionSuggestion.data.items)
        }
        setIsLoading(false)
        // const [
        //     _nftSuggestion,
        //     _collectionSuggestion
        // ] = await Promise.all([])
        // if (_nftSuggestion.data.length > 0 && _collectionSuggestion.data.length > 0) {
        //     setNftSuggestion(_nftSuggestion.data)
        //     setCollectionSuggestion(_collectionSuggestion.data)
        //     console.log(_nftSuggestion.data)
        //     setIsLoading(false)
        // }
    }

    // function debounce(func, timeout = 1000){
    //     console.log("AHJHJ")
    //     let timer;
    //     return (...args) => {
    //         clearTimeout(timer);
    //         console.log("NGUUU")
    //         timer = setTimeout(() => { func.apply(this, args); }, timeout);
    //     };
    // }

    const handleChangeInput = (e) => {
        const currentInput = e.target.value
        setQuery(currentInput)
        setIsLoading(true)
        handleAutocompleteDebounce(currentInput)
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const handleAutocompleteDebounce = useCallback(debounce((currentInput) => {
        handleAutocomplete(currentInput)
    }, 500), [])

    const handleClickCollection = (item) => {
        router.push({
            pathname: Paths.TokenDetail(item && item.address)
        })
        // console.log(item)
        setFocusInput(false)
    }

    // const handleClickNft = (item) => {
    //     // router.push({
    //     //     pathname: Paths.TokenDetail(item.smart_contract, item.token_id)
    //     // })
    //     setFocusInput(false)
    // }

    // const searchButton = (
    //     <div
    //         className={`flex items-center justify-center text-sm cursor-pointer`}
    //         onClick={() => handleSubmit()}
    //     >
    //         Search
    //     </div>
    // )

    const defaultSuggestionContainer = (title, items, onClick) => {
        return (
            <div className={`flex flex-col w-full`}>
                <div className={`text-gray-500 font-semibold text-sm uppercase mb-4`}>{title}</div>
                {
                    items.length > 0 ? items.map((item, index) => {
                        const logoUrl = item.logoURI ? item.logoURI : 'https://bscscan.com/images/main/empty-token.png'
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
                    }) : (
                        <div className={'flex items-center'}>
                            No result
                        </div>
                    )
                }
            </div>
        )
    }

    // const nftSuggestionContainer = (items) => {
    //     return (
    //         <div>
    //             <div className={`text-gray-500 font-semibold text-sm uppercase mb-4`}>NFT</div>
    //             <div className={`grid grid-cols-12 gap-4`}>
    //                 {
    //                     items.map((item, index) => {
    //                         return (
    //                             <div
    //                                 className={`col-span-3 flex flex-col bg-gray-light space-y-2 rounded-lg border cursor-pointer hover:shadow-lg`}
    //                                 key={index}
    //                                 onClick={() => handleClickNft(item)}
    //                             >
    //                                 {/* eslint-disable-next-line @next/next/no-img-element */}
    //                                 <img
    //                                     alt={item.token_id}
    //                                     src={(item.metadata && getImageUrl(item.metadata.image)) || getImageUrl(null)}
    //                                     // height={157} width={155}
    //                                     className={`rounded-t-lg w-full object-fill`}
    //                                 />
    //                                 <div className={`p-2`}>
    //                                     <div
    //                                         className={`truncate`}>{(item && item.metadata && item.metadata.name) ? item.metadata.name : `#${item.token_id}`}</div>
    //                                     <div className={`flex flex-row justify-between items-center`}>
    //                                         <div className={`flex flex-row space-x-2`}>
    //                                             {/* eslint-disable-next-line @next/next/no-img-element */}
    //                                             <div>
    //                                                 {/* eslint-disable-next-line @next/next/no-img-element */}
    //                                                 <img alt={item.token_id}
    //                                                      src={getImageUrl(item.nft_collection?.logo)} width={16}
    //                                                      height={16}/>
    //                                             </div>
    //                                             {/*<div>*/}
    //                                             {/*    /!* eslint-disable-next-line @next/next/no-img-element *!/*/}
    //                                             {/*    <img src={item.platform} alt={'sourceThumbnail'} width={16} height={16}/>*/}
    //                                             {/*</div>*/}
    //                                         </div>
    //                                         <div>
    //                                             {
    //                                                 item?.statistic_data?.last_price?.usd && (
    //                                                     <>
    //                                                         <span
    //                                                             className="text-sm">$</span>{formatNumber(item.statistic_data.last_price.usd)}
    //                                                     </>
    //                                                 )
    //                                             }
    //                                         </div>
    //                                     </div>
    //                                 </div>
    //                             </div>
    //                         )
    //                     })
    //                 }
    //             </div>
    //         </div>
    //     )
    // }

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
                        {/* {nftSuggestionContainer(nftSuggestion)} */}
                        {defaultSuggestionContainer("token", collectionSuggestion, handleClickCollection)}
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
                onChange={handleChangeInput}
                placeholder="Search..."
                prefix={<SearchOutlined/>}
                onPressEnter={() => handleSubmit()}
            />

            {
                focusInput && query !== '' &&
                <div style={{maxHeight: '400px'}}
                     className={` w-full bg-white shadow-xl rounded-lg mt-2 z-50 absolute p-6 overflow-y-auto`}>
                    {suggestionContainer()}
                </div>
            }
        </div>
    )
}

export default SearchBar