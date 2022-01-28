import Head from "next/head"

const PageHeader = ({title}) => {

    return (
        <Head>
            <title>{title ? `${title} | Janus Finance: Token Shopping Gateway` : "Janus Finance: Token Shopping Gateway"}</title>
        </Head>
    )
}

export default PageHeader