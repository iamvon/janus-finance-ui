import React, {useCallback, useContext, useEffect, useRef, useState} from "react"
import {Input, Modal, Spin} from "antd";
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
    const [modal, setModal] = useState(false)

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
                <div className={`text-gray-500 font-semibold text-sm uppercase`}>{title}</div>
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
        <>
            <div className="MobileSearch lg:hidden">
                <div className="IconSearch"
                     onClick={() => setModal(true)}
                >
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M6.2108 0.382352C2.99705 0.382352 0.382291 2.99711 0.382291 6.21086C0.382291 9.42479 2.99705 12.0394 6.2108 12.0394C9.42473 12.0394 12.0393 9.42479 12.0393 6.21086C12.0393 2.99711 9.42473 0.382352 6.2108 0.382352ZM6.2108 10.9634C3.5903 10.9634 1.45832 8.83137 1.45832 6.21088C1.45832 3.59039 3.5903 1.45838 6.2108 1.45838C8.83129 1.45838 10.9633 3.59036 10.9633 6.21086C10.9633 8.83135 8.83129 10.9634 6.2108 10.9634Z" fill="white"/>
                        <path fillRule="evenodd" clipRule="evenodd" d="M0.249939 6.21086C0.249939 2.92401 2.92395 0.25 6.2108 0.25C9.49783 0.25 12.1717 2.92401 12.1717 6.21086C12.1717 9.49788 9.49782 12.1717 6.2108 12.1717C2.92395 12.1717 0.249939 9.49789 0.249939 6.21086ZM1.59068 6.21088C1.59068 8.75828 3.6634 10.831 6.2108 10.831C8.75819 10.831 10.8309 8.75825 10.8309 6.21086C10.8309 3.66346 8.75819 1.59074 6.2108 1.59074C3.6634 1.59074 1.59068 3.66348 1.59068 6.21088ZM0.382291 6.21086C0.382291 2.99711 2.99705 0.382352 6.2108 0.382352C9.42473 0.382352 12.0393 2.99711 12.0393 6.21086C12.0393 9.42479 9.42473 12.0394 6.2108 12.0394C2.99705 12.0394 0.382291 9.42479 0.382291 6.21086ZM1.45832 6.21088C1.45832 8.83137 3.5903 10.9634 6.2108 10.9634C8.83129 10.9634 10.9633 8.83135 10.9633 6.21086C10.9633 3.59036 8.83129 1.45838 6.2108 1.45838C3.5903 1.45838 1.45832 3.59039 1.45832 6.21088Z" fill="white"/>
                        <path d="M13.4599 12.6991L10.3753 9.61451C10.1651 9.40433 9.82474 9.40433 9.61455 9.61451C9.40437 9.82452 9.40437 10.1653 9.61455 10.3753L12.6992 13.4599C12.8043 13.565 12.9418 13.6175 13.0796 13.6175C13.2171 13.6175 13.3548 13.565 13.4599 13.4599C13.6701 13.2499 13.6701 12.9091 13.4599 12.6991Z" fill="white"/>
                        <path fillRule="evenodd" clipRule="evenodd" d="M10.4689 9.52093L13.5535 12.6055C13.8154 12.8672 13.8154 13.2918 13.5535 13.5535M10.4689 9.52093C10.207 9.25907 9.78288 9.25905 9.52101 9.52088ZM9.52101 9.52088C9.52101 9.52088 9.521 9.52089 9.52101 9.52088C9.25913 9.78258 9.25909 10.2072 9.52097 10.4689C9.52095 10.4689 9.52098 10.4689 9.52097 10.4689L12.6056 13.5535C12.7365 13.6844 12.9081 13.7499 13.0796 13.7499C13.2508 13.7499 13.4226 13.6843 13.5535 13.5535M10.3753 9.61451L13.4599 12.6991C13.6701 12.9091 13.6701 13.2499 13.4599 13.4599C13.3548 13.565 13.2171 13.6175 13.0796 13.6175C12.9418 13.6175 12.8043 13.565 12.6992 13.4599L9.61455 10.3753C9.40437 10.1653 9.40437 9.82452 9.61455 9.61451C9.82474 9.40433 10.1651 9.40433 10.3753 9.61451Z" fill="white"/>
                    </svg>
                </div>

                <Modal
                    visible={modal}
                    onCancel={() => setModal(false)}
                    footer={null}
                    className="ModalGlobalSearch"
                    closeIcon={
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M4.82276 20.0004C4.612 20.0004 4.40124 19.9203 4.2411 19.7589C3.91963 19.4374 3.91963 18.9163 4.2411 18.5948L18.5948 4.2411C18.9162 3.91963 19.4374 3.91963 19.7589 4.2411C20.0804 4.56257 20.0804 5.08376 19.7589 5.40543L5.40543 19.7589C5.24409 19.9193 5.03333 20.0004 4.82276 20.0004Z" fill="#333333"/>
                            <path d="M19.1774 20.0004C18.9667 20.0004 18.7561 19.9203 18.5958 19.7589L4.2411 5.40543C3.91963 5.08376 3.91963 4.56257 4.2411 4.2411C4.56257 3.91963 5.08376 3.91963 5.40543 4.2411L19.7589 18.5948C20.0804 18.9163 20.0804 19.4374 19.7589 19.7589C19.5976 19.9193 19.387 20.0004 19.1774 20.0004Z" fill="#333333"/>
                        </svg>
                    }
                >
                    <div className={`relative text-sm font-semibold`} ref={searchBarContainer}>
                        <Input
                            allowClear={true}
                            // addonAfter={searchButton}
                            value={query}
                            onFocus={() => setFocusInput(true)}
                            onChange={handleChangeInput}
                            placeholder="Search..."
                            prefix={<SearchOutlined />}
                            onPressEnter={() => handleSubmit()}
                            className="mt-4 rounded-full"
                            size="large"
                        />

                        {
                            focusInput && query !== '' &&
                            <div className="mt-5">
                                {suggestionContainer()}
                            </div>
                        }
                    </div>
                </Modal>
            </div>

            <div className={`relative text-sm font-semibold hidden lg:block`} ref={searchBarContainer}>
                <Input
                    allowClear={true}
                    // addonAfter={searchButton}
                    value={query}
                    onFocus={() => setFocusInput(true)}
                    onChange={handleChangeInput}
                    placeholder="Search..."
                    prefix={<SearchOutlined />}
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

            {/*{search}*/}
        </>
    )
}

export default SearchBar