import Image from "next/image"


const FooterIcon = ({src, alt}) => {
    return (
        <div className={`cursor-pointer`}>
            <Image
                src={src}
                alt={alt}
                width={20}
                height={20}
            />
        </div>
    )
}

export default FooterIcon