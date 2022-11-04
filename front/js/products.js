
/**
 * 
 * @param {*} href 
 * @returns 
 */
function getId(href) {
    const urlProduct = new URL(hrefProduct)
    const search_params = new URLSearchParams(urlProduct.search)
    if (search_params.has("id")) {
        return search_params.get("id")
    } else return false
}

/**
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
        .then((value) => {            
            document
                .querySelector(".item__img")
                .innerHTML = `<img src=${value.imageUrl} alt=${value.alTxt}>`
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
 * 
 * @param {*} kanap 
 */
function addToLocalStorage(kanap) {
    let cartArray = []
    if (localStorage.cartJson) {
        cartArray = JSON.parse(localStorage.cartJson)
        const indexFindInCart = indexKanapInCart(cartArray, kanap)
        if (indexFindInCart === cartArray.length) {
            cartArray.push(kanap)
        } else {
            cartArray[indexFindInCart].quantity = parseInt(cartArray[indexFindInCart].quantity) + parseInt(kanap.quantity)
        }
    }
    else {
        cartArray.push(kanap)
    }
    localStorage.cartJson = JSON.stringify(cartArray)
}

/** 
 * 
 * @param {Array} cartArray tableau d'objet
 * @param {Object} kanap {id, color, quantity}
 * @returns {Number} index de l'article ayant même id et color dans le tableau
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
    const addToCartObject = {
        id: id,
        color: kanapColors.value,
        quantity: kanapQuantity.value
    }
    if (kanapColors.value && (kanapQuantity.value != 0)) {
        console.log(`achat valide ${kanapColors.value} ${kanapQuantity.value}`)

        addToLocalStorage(addToCartObject)


    } else if (!kanapColors.value) {
        kanapColors.style.color = "orange"
    } else { kanapQuantity.style.color = "orange" }
})

kanapColors.addEventListener("change", () => kanapColors.style.color = "var(--footer-secondary-color)")
kanapQuantity.addEventListener("change", () => kanapQuantity.style.color = "var(--footer-secondary-color)")




