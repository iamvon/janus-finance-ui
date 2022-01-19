import React from "react";
import CN from "classnames";


const SkeletonAssetItem = ({minWidth}) => {
    return <div className={CN('shadow rounded-lg p-3 bg-white dark:bg-gray-800', {"min-w-1/6": minWidth})}
                style={{minHeight: '200px'}}>
        <div className="flex flex-col items-start justify-between">
            <div className="bg-gray-200 w-full rounded-lg" style={{minHeight: '150px'}}>

            </div>
            <div className="bg-gray-200 w-full mt-4" style={{minHeight: '30px'}}>

            </div>
        </div>
    </div>;
};

export default SkeletonAssetItem;