/**
 * KanapsObjet est un objet "kanapé" retourné par l'API
 * @typedef {object} KanapsObject
 * @property {string} _id
 * @property {string} name
 * @property {string} imageUrl
 * @property {string} altTxt
 * @property {[string]} colors
 * @property {number} price
 * @property {string} description
 */



const hrefApi = "http://127.0.0.1:3000/api/products/"
// export {hrefApi}

/**
 * Récupère les articles de l'API et les affiches
 */
function askKanaps() {
    fetch(hrefApi)
        .then((response) => response.json())
        .then((value) => {
            console.log(value)
            document
                .getElementById("items")
                .innerHTML = displayKanaps(value)
        })
        .catch((error) => {
            console.error("Erreur :", error)
            alert("Echec de connexion avec le serveur. Essayez plus tard")
        })
}





/**
 * Construction du code HTML des cartes de canapés d'après le tableau retourné par l'API
 * @param {[KanapsObject]} kanapsObjects 
 * @returns {string} chaîne de caractères correspondant au code HTML 
 */
function displayKanaps(kanapsObjects) {
    let kanapsItems = ""
    kanapsObjects.forEach((kanap) => {       
        kanapsItems += `
        <a href="./product.html?id=${kanap._id}">
            <article>
                <img src="${kanap.imageUrl}" alt="${kanap.altTxt}">      
                <h3 class="productName">${kanap.name}</h3>
                <p class="productDescription">${kanap.description}</p>
            </article>
        </a>`})    
    return kanapsItems
}


askKanaps()






