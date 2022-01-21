import React from "react";


const TokenTag = ({text, onRemove}) => {
    return (
        <div
            className="flex justify-between items-center mb-3 bg-blue-100 text-blue-800 text-sm font-semibold px-2.5 py-1 rounded dark:bg-blue-200 dark:text-blue-800">
            <div className={'flex'}>
                #{text}
            </div>
            <dev className="flex cursor-pointer text-red-600" onClick={() => onRemove(text)}>x</dev>
        </div>
    );
};

export default TokenTag;