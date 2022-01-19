import React from "react"
import {faBabyCarriage, faExchangeAlt, faShoppingCart, faSync} from "@fortawesome/free-solid-svg-icons"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import CN from "classnames"


const EvenItem = ({value}) => {
    let data = {
        text: "Unknown",
        icon: faSync
    }

    switch (value) {
        case "sale":
            data = {
                icon: faShoppingCart,
                text: "Sale"
            }
            break
        case "transfer":
            data = {
                icon: faExchangeAlt,
                text: "Transfer"
            }
            break
        case "minted":
            data = {
                icon: faBabyCarriage,
                text: "Minted"
            }
            break
        default:
            data.text = value
            break
    }

    return (
        <div className={CN("flex place-items-center")}>
            <FontAwesomeIcon className={CN("mr-4 text-sm text-gray-400")} icon={data.icon}/>
            <div className={CN("capitalize text-sm font-medium")}>{data.text}</div>
        </div>
    )
}


export default EvenItem