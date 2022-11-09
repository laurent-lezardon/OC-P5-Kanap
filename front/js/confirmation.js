const localHref = window.location.href
console.log(localHref)

/**
 * Extraction de l'identifiant d'un canapé dans l'url de la page
 * @param {string} href url de la page
 * @returns {string} identifiant du cannapé s'il est présent, une chaîne vide sinon
 */
 function getOrderId(href) {
    const urlProduct = new URL(href)
    const search_params = new URLSearchParams(urlProduct.search)
    if (search_params.has("orderId")) {
        return search_params.get("orderId")
    } else return ""
}


console.log(getOrderId(localHref))
document.getElementById("orderId").innerText = getOrderId(localHref)
localStorage.clear()