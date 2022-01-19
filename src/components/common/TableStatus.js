import React, {useMemo} from "react"
import {LoadingOutlined} from "@ant-design/icons"
import {Spin} from "antd"
import {formatLocaleNumber} from "/src/lib/services/util/formatNumber";
import {MAX_RECORD_QUERY} from "/src/lib/constants/pagination"

const TableStatus = ({loading, amount, objectName, verboseObjectName, query}) => {

    const loadingIcon = <LoadingOutlined style={{fontSize: 24, color: '#6B7280'}} spin/>

    const content = useMemo(() => {
        const suffix = amount >= 2 ? verboseObjectName : objectName
        const displayNumber = amount < MAX_RECORD_QUERY ? `Total of ${formatLocaleNumber(amount)}` : `More than ${MAX_RECORD_QUERY}`
        let total = `${displayNumber} ${suffix}`
        if (query) total = total + ` for "${query}"`
        return amount !== 0 ? total : `No ${objectName} found`
    }, [amount, objectName, query, verboseObjectName])

    return (
        <div
            className={`text-lg font-semibold `}
        >
            {
                loading ? (
                    <Spin indicator={loadingIcon}/>
                ) : (
                    <div>
                        {content}
                    </div>
                )
            }
        </div>
    )
}

export default TableStatus