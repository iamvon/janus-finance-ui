
export const brief_address = (_address) => {
    const address = String(_address)
    const len = address.length
    if (len > 10){
        return address.slice(0,6) + "..." +address.slice(len - 4, len)
    }else{
        return address
    }
}