import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import React, {useState} from "react"
import {Tooltip} from "antd"
import {faCopy} from "@fortawesome/free-solid-svg-icons"
import CN from "classnames"

const TOOLTIP_TITLE = {
    COPY: "Copy to clipboard",
    COPIED: "Copied"
}

const CopyIcon = ({handlerCopy}) => {

    const [timer, setTimer] = useState(null)
    const [title, setTitle] = useState(TOOLTIP_TITLE.COPY)

    const onClick = () => {
        if (handlerCopy){
            handlerCopy()
            if (timer){
                clearTimeout(timer)
            }
            setTitle(TOOLTIP_TITLE.COPIED)
            const _timer = setTimeout(() => {
                setTitle(TOOLTIP_TITLE.COPY)
            }, 3000)
            setTimer(_timer)
        }
    }


    return (
        <Tooltip title={title}>
            <FontAwesomeIcon icon={faCopy} className={CN("ml-2 text-gray-400 cursor-pointer")} onClick={onClick}/>
        </Tooltip>
    )
}

export default CopyIcon