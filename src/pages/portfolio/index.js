/* eslint-disable @next/next/no-img-element */
import React, {useEffect} from "react"
import PageHeader from "/src/components/common/PageHeader"
import {useRouter} from 'next/router'

const Portfolio = (props) => {
    const {someVars} = props

    const router = useRouter()

    useEffect(() => {

    }, [])

    return (
        <div className="wrapper flex flex-col items-stretch justify-start bg-gray-50 space-y-12 pb-12">
            <PageHeader title={"Portfolio"}/>

        </div>
    )
}


export const getServerSideProps = async (context) => {
    return {
        props: {}
    }
}


export default Portfolio
