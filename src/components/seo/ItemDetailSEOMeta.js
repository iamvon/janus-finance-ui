import {NextSeo} from "next-seo"
import {SITE_NAME} from "../../lib/seo/site-meta"
import {SEO_DEFAULT_CONFIG} from "../../lib/seo/next-seo.config"

const ItemExploreSEOMeta = ({pageTitle, description}) => {
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
            {/*<CarouselJsonLd*/}
            {/*    type="default"*/}
            {/*    data={jsonLdData}*/}
            {/*/>*/}
        </div>
    )
}

export default ItemExploreSEOMeta