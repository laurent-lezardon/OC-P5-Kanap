const hrefApi = "http://127.0.0.1:3000/api/products"

function askKanaps() {
    fetch(hrefApi)
        .then((response) => {
            if (response.ok) {
                return response.json()
            }
            console.log("Réponse du serveur NOK")

        })
        .then((value) => {
            console.log(value)
            document
                .getElementById("items")
                .innerHTML = displayKanaps(value)
        })
        .catch((error) => {
            console.error("catch :", error)
            alert("Erreur de chargement de la page, essayez plus tard")
        })
}

/**
 * @typedef {object} KanapsObject
 * @property {string} _id
 * @property {string} name
 * @property {string} imageUrl
 * @property {string} altTxt
 * @property {string[]} colors
 * @property {number} price
 * @property {string} description
 */


/**
 * Construction du code HTML des cartes de canapés d'après le tableau retourné par l'API
 * @param {KanapsObject[]} kanapsObjects 
 * @returns {string} chaîne de caractères correspondant au code HTML 
 */
function displayKanaps(kanapsObjects) {
    let kanapsItems = ""
    kanapsObjects.forEach((kanap) => {
        console.log(kanap._id)
        kanapsItems += `<a href="./product.html?id=${kanap._id}">
    <article>
      <img src=${kanap.imageUrl} alt=${kanap.altTxt}>
      <h3 class="productName">${kanap.name}</h3>
      <p class="productDescription">${kanap.description}</p>
    </article>
  </a>`})    
    return kanapsItems
}


askKanaps()






