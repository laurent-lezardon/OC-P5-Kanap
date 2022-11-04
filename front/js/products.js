
/**
 * Extraction de l'identifiant d'un canapé dans l'url de la page
 * @param {string} href url de la page
 * @returns {string} identifiant du cannapé s'il est présent, une chaîne vide sinon
 */
function getId(href) {
    const urlProduct = new URL(hrefProduct)
    const search_params = new URLSearchParams(urlProduct.search)
    if (search_params.has("id")) {
        return search_params.get("id")
    } else return ""
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
 * Demande les informations concernant un canapé d'après son identifiant
 * et les met à jour dans la page "products"
 * 
 */
function askKanap() {
    fetch(`${products}${id}`)
        .then((response) => {
            if (response.ok) {
                return response.json()
            }
            console.log("Réponse du serveur NOK")
        })       
        .then(
            /**
             * Si le serveur répond sans erreur, les informations sont mises à jour dans le code HTML
             * de la page "products"
             * @param {KanapsObject} value 
             */
            (value) => {
            document
                .querySelector(".item__img")
                .innerHTML = `<img src=${value.imageUrl} alt=${value.altTxt}>`
            document
                .getElementById("title")
                .innerText = value.name
            document
                .getElementById("price")
                .innerText = value.price
            document
                .getElementById("description")
                .innerText = value.description
            for (color of value.colors) {
                const newElt = document.createElement("option")
                newElt.innerText = color
                kanapColors.appendChild(newElt)
            }
        })
        .catch((error) => {
            console.log(error)
        })
}


/**
 * @typedef {object} Kanap
 * @property {string} id
 * @property {string} color
 * @property {number} quantity
 */


/**
 * Ajoute un article kanap dans la clé "cartJson" du Local storage
 * @param {Kanap} kanap 
 */
function addToLocalStorage(kanap) {
    let cartArray = [] 
    // si le panier existe   
    if (localStorage.cartJson) {
        cartArray = JSON.parse(localStorage.cartJson)
        const indexFindInCart = indexKanapInCart(cartArray, kanap)
        // si l'index a parcouru la totalité du tableau, c'est qu'il n'a pas trouvé d'article correspondant => ajout de l'article
        if (indexFindInCart === cartArray.length) {
            cartArray.push(kanap)
        } else {
            // un article identique est présent dans le panier, les quantités sont ajoutées            
            cartArray[indexFindInCart].quantity += kanap.quantity
        }
    }
    // le panier n'existe pas
    else {
        cartArray.push(kanap)
    }
    localStorage.cartJson = JSON.stringify(cartArray)
}

/** 
 * Recherche un objet "kanap" {id, color, quantity} dans un tableau en fonction
 * des critères "id" et "color"
 * @param {Kanap[]} cartArray
 * @param {Kanap} kanap 
 * @returns {number} retourne l'index de l'article ayant même id et color dans le tableau
 * ou la longueur du tableau s'il ny a pas de correspondance
 */
function indexKanapInCart(cartArray, kanap) {
    let index = 0
    for (kanapStored of cartArray) {
        if ((kanapStored.id === kanap.id) && (kanapStored.color === kanap.color)) {
            break
        }
        index++
    }
    return index
}

// ============== constantes =========================================================

const products = "http://127.0.0.1:3000/api/products/"
const hrefProduct = window.location.href
const kanapColors = document.getElementById("colors")
const kanapQuantity = document.getElementById("quantity")
const cartButton = document.getElementById("addToCart")
const id = getId(hrefProduct)


// ================================================================================ 

askKanap()

// ============= evenements =============================================================


cartButton.addEventListener("click", () => {
    /**
     * @type {Kanap}
     */
    const addToCartObject = {
        id: id,
        color: kanapColors.value,
        quantity: parseInt(kanapQuantity.value)
    }
    // l'ajout au panier est valide (couleur définie et quantité != 0)
    if (kanapColors.value && (kanapQuantity.value != 0)) {
        console.log(`achat valide ${kanapColors.value} ${kanapQuantity.value}`)
        addToLocalStorage(addToCartObject)
    } 
    // l'ajout au panier n'est pas valide (couleur non renseignée)
    else if (!kanapColors.value) {
        kanapColors.style.color = "orange"
    // l'ajout au panier n'est pas valide (quantité = 0)
    } else { kanapQuantity.style.color = "orange" }
})
// Restaure les couleurs de police d'origine lors après un ajout non valide
kanapColors.addEventListener("change", () => kanapColors.style.color = "var(--footer-secondary-color)")
kanapQuantity.addEventListener("change", () => kanapQuantity.style.color = "var(--footer-secondary-color)")




