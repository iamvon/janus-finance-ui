import moment from 'moment'

const getLocalMoment = (strDatetime) => {
    return moment(strDatetime)
}

export const formatDatetime = (strDatetime) => {
    const currentYear = moment().get('year')
    const inputYear = moment(strDatetime).get('year')

    const format =
        currentYear === inputYear ? 'MMM DD hh:mm A' : 'YYYY MMM DD hh:mm A'
    return strDatetime != null
        ? getLocalMoment(strDatetime).format(format)
        : 'N/A'
}

export const formatDate = (strDatetime) => {
    const currentYear = moment().get('year')
    const inputYear = moment(strDatetime).get('year')

    const format = currentYear === inputYear ? 'MMM DD' : 'YYYY MMM DD'
    return strDatetime != null
        ? getLocalMoment(strDatetime).format(format)
        : 'N/A'
}

export const formatShortDatetime = (strDatetime) => {
    return getLocalMoment(strDatetime).format('HH:mm DD/MM/YY')
}

export const formatVerbosesDatetime = (strDatetime) => {
    return getLocalMoment(strDatetime).format('DD-MM-YYYY [at] h:mm A')
}

export const formatSimpleDate = (strDatetime) => {
    return getLocalMoment(strDatetime).format('DD-MM-YYYY')
}

export const getMonthName = (strDatetime) => {
    let re = /(?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|(Nov|Dec)(?:ember)?)/g
    let result = re.exec(strDatetime)
    return result[0]
}

export const convertFromJavaDate = (str) => {
    let re = /\d{4}-\d{2}-\d{2}/g
    let result = re.exec(str)
    return result[0]
}

export const tickFormatter = (item, unit) => {
    const mItem = moment(item)
    if (!mItem.isValid())
        return ''

    let format

    if (['hour', 'h', 'minute', 'minute'].includes(unit)) {
        if (mItem.get('h') === 0) format = 'MMM DD HH:mm'
        else format = 'HH:mm'
    }
    else if (unit === 'day' || unit === 'd') {
        const currentYear = moment().year();
        if (currentYear === mItem.get('year'))
            format = 'DD MMM'
        else
            format = 'DD MMM YYYY'
    }
    else {
        format = 'DD MMM'
    }

    return mItem.format(format)
}
