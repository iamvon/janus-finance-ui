import {connectToDatabase} from "/src/lib/connections/mongodb"
import {getModel} from "../../models"


export const detailToken = async ({contractAddress}) => {
    await connectToDatabase()
    const SolanaToken = getModel('SolanaToken')

    const item = await SolanaToken
        .findOne({address: contractAddress})
        .lean()

    return {...item}
}