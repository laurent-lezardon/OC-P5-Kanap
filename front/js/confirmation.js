// Kanap - script de la page confirmation

/**
 * Extraction de l'identifiant d'un canapé dans l'url de la page
 * @param {string} href 
 * @returns {string} identifiant du cannapé s'il est présent dans l'url, une chaîne vide sinon
 */
 function getOrderId(href) {
    const urlOrder = new URL(href)
    const search_params = new URLSearchParams(urlOrder.search)
    if (search_params.has("orderId")) {
        return search_params.get("orderId")
    } else return ""
}

const localHref = window.location.href
document.getElementById("orderId").textContent = getOrderId(localHref)
localStorage.clear()