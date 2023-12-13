const Utils = (() => {
    async function waitForElement(selector, timeout = null) {
        return new Promise((resolve) => {
            if (document.querySelector(selector)) {
                return resolve(document.querySelector(selector))
            }

            const observer = new MutationObserver(async () => {
                if (document.querySelector(selector)) {
                    resolve(document.querySelector(selector))
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

    function formatNumber(number) {
        if (number >= 1000000) {
            const million = number / 1000000
            return million % 1 === 0 ? million.toFixed(0) + "M" : million.toFixed(1) + "M"
        } else if (number >= 1000) {
            const thousand = number / 1000
            return thousand.toFixed(0) + "K"
        } else {
            return number
        }
    }

    function createParentElement() {
        const parentElement = document.createElement("div")
        parentElement.id = "linker-parent"

        return parentElement
    }

    function createLetterboxdElement(tmdbId, type) {
        const letterboxdElement = document.createElement("a")
        letterboxdElement.href = `https://letterboxd.com/tmdb/${tmdbId}/${type === "tv" ? "tv" : ""}`
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

    function createImdbContainer() {
        const imdbContainer = document.createElement("div")
        imdbContainer.id = "linker-imdb-container"

        return imdbContainer
    }

    function createImdbLinkElement(imdbId, svg) {
        const link = document.createElement("a")
        link.href = `https://imdb.com/title/${imdbId}`
        link.target = "_blank"
        link.innerHTML = svg

        return link
    }

    function createImdbRatingElement(rating, numRatings) {
        const text = rating !== undefined ? `${rating.toFixed(1)}${numRatings !== undefined ? ` ( ${formatNumber(numRatings)} )` : ""}` : null

        const ratingElement = document.createElement("div")
        ratingElement.id = "linker-imdb-rating"
        ratingElement.innerText = text

        if (text) {
            return ratingElement
        } else {
            return null
        }
    }

    return {
        waitForElement: waitForElement,
        formatNumber: formatNumber,
        element: {
            parent: createParentElement,
            letterboxd: createLetterboxdElement,
            divider: createDivider,
            loading: createLoadingElement,
            imdbContainer: createImdbContainer,
            imdbLink: createImdbLinkElement,
            imdbRating: createImdbRatingElement,
        },
    }
})()

export default Utils
