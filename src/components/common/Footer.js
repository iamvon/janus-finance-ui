import React from "react"
import FooterIcon from "/src/components/common/FooterIcon"


const Footer = () => {
    return (
        <div className={`wrapper w-full janus-footer py-4 lg:py-6`}>
            <div className={`flex justify-between flex-wrap`}>
                <div className="footer-logo w-full lg:w-auto mb-4 lg:mb-0">
                    <img src={'/image/logo.png'} className="m-auto"/>
                </div>

                {/* <div className={`font-bold text-base text-primary-font-color mb-2`}>Social</div> */}
                <div className={`flex flex-row items-center justify-center flex-wrap social w-full lg:w-auto`}>
                    <div className="mr-4">
                        <FooterIcon
                            src={'/icons/twitter.svg'}
                            alt={"twitter"}
                        />
                    </div>

                    <div className="mr-4">
                        <FooterIcon
                            src={'/icons/telegram.svg'}
                            alt={"Telegram"}
                        />
                    </div>

                    <div className="mr-4">
                        <FooterIcon
                            src={'/icons/mail.svg'}
                            alt={"Email"}
                        />
                    </div>

                    <div className="mr-4">
                        <FooterIcon
                            src={'/icons/discord.svg'}
                            alt={"Discord"}
                        />
                    </div>

                    <FooterIcon
                        src={'/icons/medium.svg'}
                        alt={"Medium"}
                    />
                </div>
            </div>
        </div>
    )
}

export default Footer