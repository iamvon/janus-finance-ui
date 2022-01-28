import React from "react";
import CN from "classnames";


const SkeletonAssetItem = ({minWidth}) => {
    return <div className={CN('shadow rounded-lg p-3', {"min-w-1/6": minWidth})}
                style={{minHeight: '233px', backgroundColor: '#232D36'}}>
        <div className="flex flex-col items-start justify-between">
            <div className="w-full rounded-lg" style={{minHeight: '100px', backgroundColor: '#00ffa333'}}>
            </div>
            <div className="w-full mt-4" style={{minHeight: '50px', backgroundColor: '#00ffa333'}}>
            </div>
        </div>
    </div>;
};

export default SkeletonAssetItem;