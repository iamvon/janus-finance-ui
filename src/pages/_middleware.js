import {NextResponse} from 'next/server'
import Paths from "../lib/routes/Paths"

export async function middleware(req, ev) {
    const appMode = process.env.NEXT_PUBLIC_APP_MODE
    // console.log(appMode)
    const prodHiddenPaths = ['/', '/explore', '/collections', '/items']
    const {pathname} = req.nextUrl
    if (appMode === 'production' && prodHiddenPaths.includes(pathname)) {
        return NextResponse.redirect(Paths.Wishlist)
    }
    return NextResponse.next()
}