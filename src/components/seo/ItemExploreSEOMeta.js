import {CarouselJsonLd, NextSeo} from "next-seo"
import {SITE_NAME} from "../../lib/seo/site-meta"
import {SEO_DEFAULT_CONFIG} from "../../lib/seo/next-seo.config"

const ItemExploreSEOMeta = ({pageTitle, description, items}) => {
    const baseUrl = process.env.NEXT_PUBLIC_HOST_URL
    const jsonLdData = items.map(it => {
        return {
            url: `${baseUrl}/items/${it.smart_contract}/${it.token_id}`
        }
    })
    return (
        <div>
            <NextSeo {...SEO_DEFAULT_CONFIG}
                     title={`${pageTitle} | ${SITE_NAME}`}
                     description={description}
                     additionalMetaTags={[{
                         property: 'keywords',
                         name: 'keywords',
                         content: 'nonfungible, TokenDetail, blockchain, collectibles, data, smart_contract, token, ETH'
                     }]}
            />
            <CarouselJsonLd
                type="default"
                data={jsonLdData}
            />
        </div>
    )
}

export default ItemExploreSEOMeta