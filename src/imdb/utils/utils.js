const Utils = (() => {
    async function waitForElement(selector, timeout = null, nthElement = 1) {
        nthElement -= 1

        return new Promise((resolve) => {
            if (document.querySelectorAll(selector)?.[nthElement]) {
                return resolve(document.querySelectorAll(selector)?.[nthElement])
            }

            const observer = new MutationObserver(async () => {
                if (document.querySelectorAll(selector)?.[nthElement]) {
                    resolve(document.querySelectorAll(selector)?.[nthElement])
                    observer.disconnect()
                } else {
                    if (timeout) {
                        async function timeOver() {
                            return new Promise((resolve) => {
                                setTimeout(() => {
                                    observer.disconnect()
                                    resolve(false)
                                }, timeout)
                            })
                        }
                        resolve(await timeOver())
                    }
                }
            })

            observer.observe(document.body, {
                childList: true,
                subtree: true,
            })
        })
    }

    function createParentElement() {
        const parentElement = document.createElement("div")
        parentElement.id = "linker-parent"

        return parentElement
    }

    function createLetterboxdElement(imdbId) {
        const letterboxdElement = document.createElement("a")
        letterboxdElement.id = "linker-letterboxd-a"
        letterboxdElement.href = `https://letterboxd.com/imdb/${imdbId}/`
        letterboxdElement.target = "_blank"

        const letterboxdImage = document.createElement("img")
        letterboxdImage.id = "linker-letterboxd"
        letterboxdImage.src = chrome.runtime.getURL("assets/letterboxd.png")

        letterboxdElement.appendChild(letterboxdImage)

        return letterboxdElement
    }

    function createDivider() {
        const divider = document.createElement("div")
        divider.id = "linker-divider"

        return divider
    }

    function createLoadingElement() {
        const loadingElement = document.createElement("img")
        loadingElement.id = "linker-loading"
        loadingElement.src = chrome.runtime.getURL("assets/loading.gif")

        return loadingElement
    }

    function createTmdbButtonElement(tmdbId) {
        const tmdbElement = document.createElement("a")
        tmdbElement.id = "linker-tmdb-link"
        tmdbElement.target = "_blank"
        tmdbElement.innerText = "TMDB"

        if (tmdbId["media_type"] !== "tv_episode") {
            tmdbElement.href = `https://www.themoviedb.org/${tmdbId["media_type"]}/${tmdbId.id}`
        } else {
            tmdbElement.href = `https://www.themoviedb.org/tv/${tmdbId["show_id"]}/season/${tmdbId["season_number"]}/episode/${tmdbId["episode_number"]}`
        }

        return tmdbElement
    }

    return {
        waitForElement: waitForElement,
        element: {
            parent: createParentElement,
            letterboxd: createLetterboxdElement,
            divider: createDivider,
            loading: createLoadingElement,
            tmdbButton: createTmdbButtonElement,
        },
    }
})()

export default Utils
