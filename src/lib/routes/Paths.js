const Paths = {
    Home: '/',
    Portfolio: '/portfolio',
    NFT: '/nft',
    Wishlist: '/wishlist',
    Opportunity: '/opportunity',
    NFTDetail: (smart_contract, token_id) => `/items/${smart_contract || ':smart_contract'}/${token_id || ':token_id'}`,
    Search: '/search'
}
export default Paths
