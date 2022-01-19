import Image from "next/image"


const FooterIcon = ({src, alt}) => {
    return (
        <div className={`cursor-pointer mr-2`}>
            <Image
                src={src}
                alt={alt}
                width={16}
                height={16}
            />
        </div>
    )
}

export default FooterIcon