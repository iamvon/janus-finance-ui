const Paths = {
    Home: '/',
    Portfolio: '/portfolio',
    Token: '/tokens',
    Wishlist: '/wishlist',
    Opportunity: '/opportunity',
    TokenDetail: (contract_address) => `/tokens/${contract_address || ':contract_address'}`,
    Search: '/search'
}
export default Paths
