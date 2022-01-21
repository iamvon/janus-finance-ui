import {CarouselJsonLd, NextSeo} from "next-seo";
import {SEO_DEFAULT_CONFIG} from "../../lib/seo/next-seo.config";
import {SITE_NAME} from "../../lib/seo/site-meta";

const WhalesTrackingSEOMeta = ({pageTitle, description, items}) => {
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

export default WhalesTrackingSEOMeta