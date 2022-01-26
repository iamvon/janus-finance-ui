import Image from "next/image"


const FooterIcon = ({src, alt}) => {
    return (
        <div className={`cursor-pointer ml-5`}>
            <Image
                src={src}
                alt={alt}
                width={30}
                height={30}
            />
        </div>
    )
}

export default FooterIcon