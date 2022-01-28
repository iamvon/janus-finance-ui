import React from "react";
import {renderTagName} from "../lib/helpers/tag"


const TokenTag = ({text, onRemove}) => {
    return (
        <div className="flex justify-between items-center mb-3 bg-blue-100 text-blue-800 text-sm font-semibold px-2.5 py-1 rounded dark:bg-blue-200 dark:text-blue-800 select-item">
            <div className={'flex selected-text'}>{renderTagName(text)}</div>
            <dev className="flex cursor-pointer selected-remove" onClick={() => onRemove(text)}>x</dev>
        </div>
    );
};

export default TokenTag;