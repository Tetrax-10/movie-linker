;(async () => {
    if (!/^\/title\/tt\d+\/?$/.test(location.pathname)) return

    const Utils = (await import(chrome.runtime.getURL("src/imdb/utils/utils.js")))?.default

    const isMobile = location.host.includes("m.imdb")

    const path = location.pathname.split("/")
    const imdbId = path[2] || null

    if (imdbId) {
        const parentElement = Utils.element.parent()
        const letterboxdElement = Utils.element.letterboxd(imdbId)
        const dividerElement = Utils.element.divider()
        const loadingElement = Utils.element.loading()

        Utils.waitForElement("div:has( > div[data-testid='hero-rating-bar__user-rating'])", 10000, isMobile ? 2 : 1).then((location) => {
            location.insertBefore(parentElement, location.firstChild)
            parentElement.appendChild(letterboxdElement)
            parentElement.appendChild(dividerElement)
            parentElement.appendChild(loadingElement)
        })

        const SECRETS = await (await fetch(chrome.runtime.getURL("secrets.json"))).json()
        const tmdbRawRes = await fetch(`https://api.themoviedb.org/3/find/${imdbId}?api_key=${SECRETS.tmdbApi}&external_source=imdb_id`)
        const tmdbRes = await tmdbRawRes.json()
        const tmdbData = tmdbRes["movie_results"]?.[0] || tmdbRes["tv_results"]?.[0] || tmdbRes["tv_episode_results"]?.[0]

        if (tmdbData) {
            const imdbElement = Utils.element.tmdbButton(tmdbData)
            parentElement.removeChild(loadingElement)
            parentElement.appendChild(imdbElement)
        } else {
            parentElement.removeChild(dividerElement)
            parentElement.removeChild(loadingElement)
        }
    }
})()
