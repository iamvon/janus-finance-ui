import React from "react"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {faGlobe, faHeart as fullHeart} from "@fortawesome/free-solid-svg-icons"
import CN from "classnames"
import {
    faDiscord,
    faFacebook,
    faInstagram,
    faMediumM,
    faReddit,
    faTelegram,
    faTwitter
} from "@fortawesome/free-brands-svg-icons"
import {formatFloatNumber} from "../lib/helpers/number"
import Paths from "../lib/routes/Paths"
import {faHeart as outlineHeart} from "@fortawesome/free-regular-svg-icons"

const SolanaTokenItem = ({token, isStared = false, onStarClick}) => {
    const extensions = token.extensions
    const tags = token.tag
    const tags3first = tags.slice(0, 3);
    let tagsString = ''
    if(tags3first.length > 0){
        tagsString = '#' + tags3first.join(', #')
    }

    return (
        <div className="solana-token-item">
            <a className="solana-token-item-header" href={Paths.TokenDetail(token.address)}
               target="_blank" rel="noreferrer">
                <div className="card-element">
                    <div className="token-logo">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={token.logoURI}
                             alt={extensions.description} loading="lazy"/>
                    </div>
                    <div className="token-content mt-1">
                        <h2 className="token-name">{token.name}</h2>
                        <div className="token-tags">
                            {tagsString}
                        </div>
                    </div>
                </div>
                {/*<div className="card-element">*/}
                {/*    <h3 className="token-description">{extensions.description}</h3>*/}
                {/*</div>*/}
            </a>
            <div className="solana-token-item-footer title w-full">
                <div className="flex justify-center items-center token-content mt-2">
                    {/*<div className="flex token-social">*/}
                    {/*    {*/}
                    {/*        extensions.discord && (*/}
                    {/*            <a href={extensions.discord} target="_blank" rel="noopener noreferrer">*/}
                    {/*                <FontAwesomeIcon icon={faDiscord} className={CN("text-base")}/>*/}
                    {/*            </a>*/}
                    {/*        )*/}
                    {/*    }*/}
                    {/*    {*/}
                    {/*        extensions.facebook && (*/}
                    {/*            <a href={extensions.facebook} target="_blank" rel="noopener noreferrer">*/}
                    {/*                <FontAwesomeIcon icon={faFacebook} className={CN("text-base")}/>*/}
                    {/*            </a>*/}
                    {/*        )*/}
                    {/*    }*/}
                    {/*    {*/}
                    {/*        extensions.instagram && (*/}
                    {/*            <a href={extensions.instagram} target="_blank" rel="noopener noreferrer">*/}
                    {/*                <FontAwesomeIcon icon={faInstagram} className={CN("text-base")}/>*/}
                    {/*            </a>*/}
                    {/*        )*/}
                    {/*    }*/}
                    {/*    {*/}
                    {/*        extensions.medium && (*/}
                    {/*            <a href={extensions.medium} target="_blank" rel="noopener noreferrer">*/}
                    {/*                <FontAwesomeIcon icon={faMediumM} className={CN("text-base")}/>*/}
                    {/*            </a>*/}
                    {/*        )*/}
                    {/*    }*/}
                    {/*    {*/}
                    {/*        extensions.reddit && (*/}
                    {/*            <a href={extensions.reddit} target="_blank" rel="noopener noreferrer">*/}
                    {/*                <FontAwesomeIcon icon={faReddit} className={CN("text-base")}/>*/}
                    {/*            </a>*/}
                    {/*        )*/}
                    {/*    }*/}
                    {/*    {*/}
                    {/*        extensions.telegram && (*/}
                    {/*            <a href={extensions.telegram} target="_blank" rel="noopener noreferrer">*/}
                    {/*                <FontAwesomeIcon icon={faTelegram} className={CN("text-base")}/>*/}
                    {/*            </a>*/}
                    {/*        )*/}
                    {/*    }*/}
                    {/*    {*/}
                    {/*        extensions.twitter && (*/}
                    {/*            <a href={extensions.twitter} target="_blank" rel="noopener noreferrer">*/}
                    {/*                <FontAwesomeIcon icon={faTwitter} className={CN("text-base")}/>*/}
                    {/*            </a>*/}
                    {/*        )*/}
                    {/*    }*/}
                    {/*    {*/}
                    {/*        extensions.website && (*/}
                    {/*            <a href={extensions.website} target="_blank" rel="noopener noreferrer">*/}
                    {/*                <FontAwesomeIcon icon={faGlobe} className={CN("text-base")}/>*/}
                    {/*            </a>*/}
                    {/*        )*/}
                    {/*    }*/}
                    {/*</div>*/}
                    {/*<div className={'flex'}>*/}
                        <div className={'price'}>
                            $ {formatFloatNumber(token.price)}
                        </div>
                    {/*</div>*/}
                </div>
            </div>
            <div className={'wishlist-button'} onClick={() => onStarClick(token, isStared)}>
                <FontAwesomeIcon icon={isStared ? fullHeart : outlineHeart} className={CN("text-base")}/>
            </div>
        </div>
    )
}

export default SolanaTokenItem