import {detailToken} from "/src/lib/actions/token/tokenDetail"

export const getDetailController = async (req) => {
    const {contractAddress} = req.params
    return detailToken({contractAddress: contractAddress})
}
