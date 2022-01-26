export const formatFloatNumber = (number) => {
    return number ? number.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }) : 0;
};

export const formatPriceNumber = (number) => {
    return number ? number.toLocaleString(undefined, {
        minimumFractionDigits: 0,
        maximumFractionDigits: 8
    }) : 0;
};

export const formatPercentIncrease = (percent) => {
    if (percent === 0) {
        return 0;
    }
    let string = '';
    if (percent > 0) {
        string += '+';
    } else {
        string += '-';
    }

    return string + ' ' + Math.abs(percent).toFixed(1);
};

export const formatThousandNumber = (number) => {
    return number ? number.toLocaleString() : 0;
};