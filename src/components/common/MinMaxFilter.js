import React, {useEffect, useRef, useState} from "react";
import {Button, Dropdown, InputNumber} from "antd";
import CN from "classnames";
import {isFilterEmpty} from "/src/lib/services/util/object";
import {renderFilterTitle} from "/src/lib/helpers/sort-and-filter-field";

const MinMaxFilter = ({initValue, onSave, title, prefix, suffix, dateIndex}) => {
    const [min, setMin] = useState(initValue.min);
    const [max, setMax] = useState(initValue.max);

    useEffect(() => {
        setMin(initValue.min);
        setMax(initValue.max);
    }, [initValue]);

    const buttonRef = useRef();


    const handlerClearValue = () => {
        setMin(undefined);
        setMax(undefined);
    };

    const handlerSaveValue = () => {
        onSave({
            min: min,
            max: max
        });
        buttonRef.current.click();
    };

    const handlerChangeMinInput = (value) => {
        setMin(value);
    };

    const handlerChangeMaxInput = (value) => {
        setMax(value);
    };

    const overlay = () => {
        return (
            <div className="flex flex-col items-stretch shadow-lg rounded-b-lg bg-white"
                 onClick={e => e.stopPropagation()}>
                <div className="flex-grow relative bg-white" style={{minWidth: 250}}>
                    <div
                        className="flex flex-col bg-white p-4 space-y-2"
                        onClick={e => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between">
                            <div className="w-10 mr-4">Min:</div>
                            <div className={CN("flex items-center")}>
                                {
                                    prefix && <span className={CN("mr-2 font-semibold text-md")}>{prefix}</span>
                                }
                                <InputNumber style={{width: 100, flex: 1}} value={min} onChange={handlerChangeMinInput}
                                             min={0}/>
                                {
                                    suffix &&
                                    <span className={CN("ml-2 font-light text-xs tracking-wide")}>{suffix}</span>
                                }
                            </div>
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="w-10 mr-4">Max:</div>
                            <div className={CN("flex items-center")}>
                                {
                                    prefix && <span className={CN("mr-2 font-semibold text-md")}>{prefix}</span>
                                }
                                <InputNumber style={{width: 100, flex: 1}} value={max} onChange={handlerChangeMaxInput}
                                             min={0}/>
                                {
                                    suffix &&
                                    <span className={CN("ml-2 font-light text-xs tracking-wide")}>{suffix}</span>
                                }
                            </div>
                        </div>
                        <div className={CN("flex self-end")}>
                            <Button size={"medium"} className={CN("mr-4")} onClick={handlerClearValue}>Clear</Button>
                            <Button size={"medium"} type={"primary"} onClick={handlerSaveValue}>Apply</Button>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <Dropdown overlay={overlay()} placement="bottomRight" trigger={['click']}>
            <div
                className={CN(
                    "cursor-pointer hover:bg-blue-100 rounded-sm border border-blue-400",
                    "text-blue-500 bg-white text-center py-1 px-6 first:mb-2"
                )}
                ref={buttonRef}
            >
                {isFilterEmpty(initValue) ? title : `${title}: ${renderFilterTitle(dateIndex, initValue, prefix, suffix)}`}
            </div>
        </Dropdown>
    );
};

export default MinMaxFilter;