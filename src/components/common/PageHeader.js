import Head from "next/head"

const PageHeader = ({title}) => {

    return (
        <Head>
            <title>{title ? `${title} | Janus` : "Janus"}</title>
        </Head>
    )
}

export default PageHeader