import CN from "classnames"
import Image from "next/image"
import React from "react"

const PlatformIcon = ({url, alt}) => {
    return (
        <div
            className={CN("justify-center items-center rounded-full background-transparent mr-2")}
            style={{
                width: 24,
                height: 24,
            }}
        >
            <Image
                className="rounded-full"
                alt={alt}
                src={url}
                width={24}
                height={24}
                layout="responsive"
                objectFit="cover"
            />
        </div>
    )
}

export default PlatformIcon