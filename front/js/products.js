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
/**
 * Kanap est un objet du panier
 * @typedef {object} Kanap
 * @property {string} id
 * @property {string} color
 * @property {number} quantity
 */

// ============== constantes =========================================================

const hrefApi = "http://127.0.0.1:3000/api/products/"
const hrefProduct = window.location.href
const kanapColors = document.getElementById("colors")
const kanapQuantity = document.getElementById("quantity")
const cartButton = document.getElementById("addToCart")
const id = getId(hrefProduct)



// ================= Fonctions ======================================================
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
 * Demande les informations concernant un canapé d'après son identifiant
 * et les met à jour dans la page "produits"
 * 
 */
function askKanap() {
    // Récupération de l'identifiant du produit d'après l'url
    
    fetch(`${hrefApi}${id}`)
        .then((response) => response.json())
        .then(
            /**
             * Affichage des informations du produit (API)
             * @param {KanapsObject} k 
             */
            (k) => {
                document
                    .querySelector(".item__img")
                    .innerHTML = `<img src="${k.imageUrl}" alt="${k.altTxt}">`
                document
                    .getElementById("title")
                    .textContent = k.name
                document
                    .getElementById("price")
                    .textContent = k.price
                document
                    .getElementById("description")
                    .textContent = k.description
                for (color of k.colors) {
                    const newElt = document.createElement("option")
                    newElt.textContent = color
                    kanapColors.appendChild(newElt)
                }
            })
        .catch((error) => {
            alert("Echec de connexion avec le serveur. Essayez plus tard")
            console.log(error)
        })
}


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
    // le panier n'existe pas ajout de l'article
    else {
        cartArray.push(kanap)
    }
    console.log(cartArray)
    localStorage.cartJson = JSON.stringify(cartArray)

}

/** 
 * Recherche un objet "kanap" {id, color, quantity} dans un tableau en fonction
 * des critères "id" et "color"
 * @param {[Kanap]} cartArray panier
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

/**
 * Teste si une valeur est un entier compris entre min et max
 * @param {*} value 
 * @param {Number} min 
 * @param {Number} max 
 * @returns {Boolean}
 */
function isIntegerMinMax(value, min=0,max=0) {
    // astuce permettant de controler que value est un entier
    value = parseFloat(value)
    const isInteger = ((value == +value) && (value % 1 === 0))    
    const isInInterval = ((value >= min) && (value <= max))    
    return isInteger && isInInterval
}


// ================================================================================ 

askKanap()

// ============= evenements =============================================================

// ----------- click sur bouton "Ajouter au panier" ----------------------------
cartButton.addEventListener("click", () => {    
    const addToCartObject = {
        id: id,
        color: kanapColors.value,
        quantity: parseInt(kanapQuantity.value)
    }
    // l'ajout au panier est valide (couleur définie et quantité != 0)
    console.log(kanapQuantity.value)
    // console.log(isIntegerMinMax(kanapQuantity.value,1,100))
    if (kanapColors.value && isIntegerMinMax(kanapQuantity.value,1,100)) {        
        addToLocalStorage(addToCartObject)
        alert("Article ajouté au panier")
    }
    // l'ajout au panier n'est pas valide (couleur non renseignée)
    else if (!kanapColors.value ) {
        kanapColors.style.color = "#fc5858"
    // l'ajout au panier n'est pas valide (quantité = 0)
    } else { kanapQuantity.style.color = "#fc5858" }
})

// ----------- changement de couleur ou de quantité ----------------------------
// Restaure les couleurs de police d'origine lors après un ajout non valide
kanapColors.addEventListener("change", () => kanapColors.style.color = "var(--footer-secondary-color)")
kanapQuantity.addEventListener("change", () => kanapQuantity.style.color = "var(--footer-secondary-color)")




