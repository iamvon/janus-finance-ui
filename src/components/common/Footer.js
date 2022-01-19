import React from "react"
import FooterIcon from "/src/components/common/FooterIcon"


const Footer = () => {
    return (
        <div className={`wrapper py-10 bg-white w-full`}>
            <div className={`text-blue-400 font-bold text-xl w-1/3 sm:w-1/4 md:w-3/5`}>
                Janus
            </div>
            <div className={`flex flex-col md:flex-row space-y-5 md:space-x-20 text-left`}>
                <div className={`flex flex-col justify-center`}>

                    {/* <div className={`font-bold text-base text-primary-font-color mb-2`}>Social</div> */}
                    <div className={`flex flex-row items-center flex-wrap mb-2`}>
                        <FooterIcon
                            src={'/icons/facebook.svg'}
                            alt={"facebook"}
                        />
                        <FooterIcon
                            src={'/icons/twitter.svg'}
                            alt={"twitter"}
                        />
                        <FooterIcon
                            src={'/icons/instagram.svg'}
                            alt={"instagram"}
                        />
                        <FooterIcon
                            src={'/icons/youtube.svg'}
                            alt={"youtube"}
                        />
                        <FooterIcon
                            src={'/icons/linkedin.svg'}
                            alt={"linkedin"}
                        />
                    </div>
                </div>

                <div className={`flex flex-col justify-start`}>
                    <div className={` mb-2 font-bold text-base text-primary-font-color`}>About</div>
                    <div className={` mb-2 text-gray-400 text-sm cursor-pointer hover:underline`}>About us</div>
                    <div className={` mb-2 text-gray-400 text-sm cursor-pointer hover:underline`}>Terms of service</div>
                    <div className={` mb-2 text-gray-400 text-sm cursor-pointer hover:underline`}>Contact us</div>
                </div>

                <div className={`flex flex-col justify-start`}>
                    <div className={`mb-2 font-bold text-base text-primary-font-color`}>Resources</div>
                    <div className={`mb-2 text-gray-400 text-sm cursor-pointer hover:underline`}>Case studies</div>
                    <div className={`mb-2 text-gray-400 text-sm cursor-pointer hover:underline`}>Blog</div>
                    <div className={`mb-2 text-gray-400 text-sm cursor-pointer hover:underline`}>API - Developers hub
                    </div>
                    <div className={`mb-2 text-gray-400 text-sm cursor-pointer hover:underline`}>FAQ - Frequently asked
                        questions
                    </div>
                </div>
            </div>

            <div className={`flex flex-col space-y-4 sm:space-x-0 sm:flex-row justify-between pt-6 items-center`}>
                <div className={`flex flex-row space-x-4 sm:space-x-10 text-gray-400 text-sm`}>
                    <div className={`cursor-pointer hover:underline`}>
                        Terms & Conditions
                    </div>
                    <div className={`cursor-pointer hover:underline`}>
                        Privacy policy
                    </div>
                    <div className={`cursor-pointer hover:underline`}>
                        Cookie policy
                    </div>
                </div>

                <div className={`flex flex-row space-x-4 items-center`}>
                    <div className={`text-gray-400 text-sm`}>@ 2021 Janus. All rights reserved</div>
                </div>
            </div>
        </div>
    )
}

export default Footer