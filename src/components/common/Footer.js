import React from "react"
import FooterIcon from "/src/components/common/FooterIcon"


const Footer = () => {
    return (
        <div className={`wrapper w-full janus-footer`}>
            <div className={`flex justify-between`}>
                <div className={`footer-logo`}>
                    <img src={'/image/logo.png'}/>
                </div>

                {/* <div className={`font-bold text-base text-primary-font-color mb-2`}>Social</div> */}
                <div className={`flex flex-row items-center flex-wrap social`}>
                    <FooterIcon
                        src={'/icons/twitter.svg'}
                        alt={"twitter"}
                    />

                    <FooterIcon
                        src={'/icons/telegram.svg'}
                        alt={"Telegram"}
                    />

                    <FooterIcon
                        src={'/icons/mail.svg'}
                        alt={"Email"}
                    />

                    <FooterIcon
                        src={'/icons/discord.svg'}
                        alt={"Discord"}
                    />

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