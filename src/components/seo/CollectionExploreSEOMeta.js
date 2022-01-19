import {CarouselJsonLd, NextSeo} from "next-seo"
import {SITE_KEYWORDS, SITE_NAME} from "../../lib/seo/site-meta"
import {SEO_DEFAULT_CONFIG} from "../../lib/seo/next-seo.config"

const CollectionExploreSEOMeta = ({pageTitle, description, collections}) => {
    const baseUrl = process.env.NEXT_PUBLIC_HOST_URL
    const jsonLdData = collections.map(it => {
        return {
            url: `${baseUrl}/collections/${it.smart_contract}`
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
                         content: SITE_KEYWORDS
                     }]}
            />
            <CarouselJsonLd
                type="default"
                data={jsonLdData}
            />
        </div>
    )
}

export default CollectionExploreSEOMeta