/* eslint-disable @next/next/no-img-element */
import React from "react"
import PageHeader from "/src/components/common/PageHeader"
import CN from "classnames"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {faHeart} from "@fortawesome/free-solid-svg-icons"
import WishlistTable from "../../components/WishlistTable"

const Wishlist = (props) => {
    return (
        <div className="wishlist-page wrapper flex flex-col justify-start pb-12">
            <PageHeader title={"Wishlist"}/>
            <div className={'mt-8'}>
                <div className={'flex justify-between items-baseline'}>
                    <div className={CN("flex place-items-center mb-6")}>
                        <FontAwesomeIcon icon={faHeart} className={"text-2xl mr-4"} style={{color: "#e91e63"}}/>
                        <span className={CN("font-bold text-2xl")}>Wishlist</span>
                    </div>
                    {/*<div className={'flex text-base'}>*/}
                    {/*    Displaying {itemData.length} of {total} assets*/}
                    {/*</div>*/}
                </div>
                <div>
                    <WishlistTable tableSize={10} pagination={true}/>
                </div>
            </div>
        </div>
    )
}


// export const getStaticProps = async (context) => {
//     return {
//         props: {}
//     }
// }

export default Wishlist
