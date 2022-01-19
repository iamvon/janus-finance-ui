import React, {useEffect, useRef, useState} from "react";
import {Button, Dropdown} from "antd";
import CN from "classnames";
import {DateRange} from 'react-date-range';
import {isFilterEmpty} from "/src/lib/services/util/object";
import {renderFilterTitle} from "/src/lib/helpers/sort-and-filter-field";
import {getDateFromRange} from "../../lib/services/util/timeRange";

const DATE_KEY = "selection";

const MinMaxFilter = ({initValue, onSave, title, dateIndex}) => {
    const [state, setState] = useState([
        {
            startDate: new Date(),
            endDate: new Date(),
            key: DATE_KEY
        }
    ]);

    const [selected, setSelected] = useState('')

    const buttonRef = useRef();

    useEffect(() => {
        setState([{
            startDate: initValue.min,
            endDate: initValue.max,
            key: DATE_KEY
        }]);
    }, [initValue]);

    const handlerClearValue = () => {
        setState([{
            startDate: undefined,
            endDate: undefined,
            key: DATE_KEY
        }]);
    };

    const handlerSaveValue = () => {
        onSave({
            min: state[0].startDate,
            max: state[0].endDate
        });
        buttonRef.current.click();
    };

    const handleChangeSelected = (val) => {
        const {from, to} = getDateFromRange(val)
        setState([{
            startDate: from,
            endDate: to,
            key: DATE_KEY
        }])
        setSelected(val)
    }

    console.log(state)


    const overlay = () => {
        return (
            <div className="flex flex-col items-stretch shadow-lg rounded-b-lg bg-white"
                 onClick={e => e.stopPropagation()}>
                <div className="flex-grow relative bg-white" style={{minWidth: 250}}>
                    <div
                        className="flex flex-col bg-white p-4 space-y-2"
                        onClick={e => e.stopPropagation()}
                    >
                        <div className="text-center font-semibold text-lg pt-2">
                            {title}
                        </div>
                        <hr/>
                        <div className={`flex flex-row justify-evenly text-sm font-medium py-2`}>
                            <div
                                onClick={() => handleChangeSelected('t24h')}
                                className={`${selected === 't24h' && 'bg-gray-200'} py-2 px-4 shadow rounded-lg cursor-pointer hover:bg-gray-200`}
                            >
                                24h
                            </div>
                            <div
                                onClick={() => handleChangeSelected('t7d')}
                                className={`${selected === 't7d' && 'bg-gray-200'} py-2 px-4 shadow rounded-lg cursor-pointer hover:bg-gray-200`}
                            >
                                7d
                            </div>
                            <div
                                onClick={() => handleChangeSelected('t30d')}
                                className={`${selected === 't30d' && 'bg-gray-200'} py-2 px-4 shadow rounded-lg cursor-pointer hover:bg-gray-200`}
                            >
                                30d
                            </div>
                            <div
                                onClick={() => handleChangeSelected('tAll')}
                                className={`${selected === 'tAll' && 'bg-gray-200'} py-2 px-4 shadow rounded-lg cursor-pointer hover:bg-gray-200`}
                            >
                                All
                            </div>
                        </div>
                        <div className="flex justify-between font-semibold text-md pb-2">
                            <div className="flex-1 text-center">
                                Start time
                            </div>
                            <div className="flex-1 text-center">
                                End time
                            </div>
                        </div>
                        <DateRange
                            onChange={item => setState([item[DATE_KEY]])}
                            showSelectionPreview={true}
                            moveRangeOnFirstSelection={false}
                            retainEndDateOnFirstSelection={true}
                            months={2}
                            ranges={state}
                            direction="horizontal"
                            startDatePlaceholder="Not selected"
                            endDatePlaceholder="Not selected"
                        />
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
        <Dropdown overlay={overlay()} placement="bottomCenter" trigger={['click']}>
            <div
                className={CN(
                    "cursor-pointer hover:bg-blue-100 rounded-sm border ",
                    "border-blue-400 text-blue-500 bg-white text-center py-1 px-6 first:mb-2"
                )}
                ref={buttonRef}
            >
                {isFilterEmpty(initValue) ? title : `${title}: ${renderFilterTitle(dateIndex, initValue)}`}
            </div>
        </Dropdown>
    );
};

export default MinMaxFilter;