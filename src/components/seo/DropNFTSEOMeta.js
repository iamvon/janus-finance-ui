import {CarouselJsonLd, NextSeo} from "next-seo"
import {SITE_NAME} from "../../lib/seo/site-meta"
import {SEO_DEFAULT_CONFIG} from "../../lib/seo/next-seo.config"

const DropNFTSEOMeta = ({pageTitle, description, items}) => {
    const jsonLdData = items.map(it => {
        return {
            url: it.website
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
                         content: 'nonfungible, NFTDetail, blockchain, collectibles, data, smart_contract, token, ETH'
                     }]}
            />
            <CarouselJsonLd
                type="default"
                data={jsonLdData}
            />
        </div>
    )
}

export default DropNFTSEOMeta