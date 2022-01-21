const Paths = {
    Home: '/',
    Portfolio: '/portfolio',
    Token: '/token',
    Wishlist: '/wishlist',
    Opportunity: '/opportunity',
    TokenDetail: (contract_address) => `/token/${contract_address || ':contract_address'}`,
    Search: '/search'
}
export default Paths
