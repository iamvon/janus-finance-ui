import React from "react"
import fs from "fs"
import path from "path"
import {StatusCodes} from "http-status-codes"

const nodeEnv = process.env.NODE_ENV
const excludePages = nodeEnv === 'production' ? [
    "api",
    "_app.js",
    "_document.js",
    "_middleware.js",
    "_error.js",
    "items",
    "collections",
    "explore.js"
] : [
    "api",
    "_app.js",
    "_document.js",
    "_middleware.js",
    "_error.js",
]

const handler = async (req, res) => {
    const {method} = req
    switch (method) {
        case "GET":
            return handlerGet(req, res)
        default:
            return res.status(StatusCodes.METHOD_NOT_ALLOWED).end("METHOD NOT ALLOWED")
    }
}

const handlerGet = async (req, res) => {
    const baseUrl = process.env.NEXT_PUBLIC_HOST_URL

    const staticPages = fs
        .readdirSync("src/pages")
        .filter((staticPage) => {
            return !excludePages.includes(staticPage)
        })
        .map((staticPagePath) => {
            const pathName = path.parse(staticPagePath).name
            const pageName = pathName === "index" ? "" : pathName
            return `${baseUrl}/${pageName}`
        })

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
        <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
            ${staticPages.map((url) => {
        return `
                    <url>
                      <loc>${url}</loc>
                      <lastmod>${new Date().toISOString()}</lastmod>
                      <changefreq>hourly</changefreq>
                      <priority>1.0</priority>
                    </url>
                  `
    })
        .join("")}
        </urlset>
      `

    res.setHeader("Content-Type", "text/xml")
    res.write(sitemap)
    res.end()
}

export default handler
