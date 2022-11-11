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

// ================== constantes ======================================================

const hrefApi = "http://127.0.0.1:3000/api/products/"
const products = "http://127.0.0.1:3000/api/products/"
// Extraction du panier dans le tableau cartArray
const cartArray = localStorage.cartJson ? JSON.parse(localStorage.cartJson) : []
// Tri de cartArray (regroupe les articles du panier par id)
cartArray.sort((a, b) => (b.id > a.id ? 1 : -1))
// console.log(cartArray)
const kanapModels = []
// ensemble des identifiants du panier
const cartIds = new Set(cartArray.map((item) => item.id))

// ================== fonctions ======================================================

/**
 * Génère le tableau des requètes API d'après un tableau d'index
 * @param {(string)} cartIds ensemble des identifiants des articles du panier
 * @returns {[Promise]} un tableau de Promises résolues par l'ajout des paramètres 
 * d'un article dans le tableau kanapModels
 */
function fetchIdListGenerator(cartIds) {
    const fetchList = []
    for (let id of cartIds) {
        // console.log(id)
        fetchList.push(
            fetch(`${hrefApi}${id}`)
                .then((response) => {
                    if (response.ok) {
                        return response.json()
                    }
                })
                .then((kanap) => {
                    kanapModels.push(kanap)
                    // console.log(kanap.name)
                })
                .catch((error) => {
                    alert("Echec de chargement des articles")
                }))
    }
    return fetchList
}



/**
 * Ecoute suppression d'un article et mise a jour panier et page
 */
function eventDelete() {
    document
        .querySelectorAll(".deleteItem").forEach((deletItem) => {
            deletItem.addEventListener("click", () => {                
                const itemIndexCart = getItemIndexCart(deletItem, cartArray)
                cartArray.splice(itemIndexCart, 1)
                deletItem.closest("article").remove()
                localStorage.cartJson = JSON.stringify(cartArray)                
                updateTotal(cartArray, kanapModels)
            })
        })
}

/**
 * Ecoute le changement de quantité d'un article et met à jour le panier et le Total
 */
function eventQuantityChange() {

    document
        .querySelectorAll(".itemQuantity")
        .forEach((itemQuantity) => {
            itemQuantity.addEventListener("change", () => {                
                // console.log(getItemIndexCart(itemQuantity, cartArray))
                const itemIndexCart = getItemIndexCart(itemQuantity, cartArray)
                cartArray[itemIndexCart].quantity = itemQuantity.value
                localStorage.cartJson = JSON.stringify(cartArray)                
                updateTotal(cartArray, kanapModels)
            })
        })
}

/**
 * Mise à jour du total (quantité et prix) dans la page
 * @param {[Kanap]} cartArray articles du panier
 * @param {[KanapsObject]} kanapModels paramètres des articles récupérés sur l'API
 */
function updateTotal(cartArray, kanapModels) {
    // localStorage.cartJson = JSON.stringify(cartArray)
    document.getElementById("totalQuantity").textContent = getCartTotal(cartArray)
    document.getElementById("totalPrice").textContent = getTotalPrice(cartArray, kanapModels)
}

/**
 * Pour un évènement sur un élément renvoi l'index du panier correspondant à l'article
 * @param {HTMLElement} Element 
 * @param {[Kanap]} cart 
 * @returns {number} index ou -1 si non trouvé
 */
function getItemIndexCart(Element, cart) {
    const item = Element.closest("article").dataset
    // console.log("Valeurs id et color")
    // console.log("e.id :", e.id)
    // console.log("item.id :", item.id)
    // console.log("e.color :", e.color)
    // console.log("item.color :", item.color)
    // console.log(cart)
    const index = cart.findIndex((k) => (k.id == item.id) && (k.color == item.color))
    return index
}
/**
 * Retourne la quantité d'articles d'un panier
 * @param {[Kanap]} cartArray 
 * @returns {number} si le tableau n'est pas vide, la somme des quantité d'article, 0 sinon
 */
function getCartTotal(cartArray) {
    return cartArray.length > 0 ? cartArray.map((item) => parseInt(item.quantity)).reduce((prev, curr) => prev + curr) : 0
}


/**
 * Retourne le prix total d'un panier
 * @param {[Kanap]} cartArray 
 * @param {[KanapsObject]} kanapModels 
 * @returns {number}
 */
function getTotalPrice(cartArray, kanapModels) {
    let TotalPrice = 0
    if (cartArray.length > 0) {
        cartArray.forEach(cartItem => {
            const modelIndex = kanapModels
                .map(item => item._id)
                .indexOf(cartItem.id)
            TotalPrice += cartItem.quantity * (parseInt(kanapModels[modelIndex].price))
            console.log(TotalPrice)
        }
        )
    }
    return TotalPrice
}

/**
 * Retourne le code HTML permettant d'afficher les articles du panier
 * @param {[KanapsObject]} kanapModels articles issus des requètes vers l'API
 * @param {[Kanap]} cartArray articles issus du panier
 * @returns {string} code HTML
 */
function displayItemPanel(cartArray, kanapModels) {
    let cartItemsContent = ""
    cartArray.forEach(cartItem => {
        // index de lobjet de l'API correspondant à l'article du panier
        const modelIndex = kanapModels
            .map(item => item._id)
            .indexOf(cartItem.id)
        console.log("index du modèle", modelIndex)
        const exemple = `
        <article class="cart__item" data-id=${cartItem.id} data-color=${cartItem.color}>
    <div class="cart__item__img">
      <img src="${kanapModels[modelIndex].imageUrl}" alt="${kanapModels[modelIndex].altTxt}">
    </div>
    <div class="cart__item__content">
      <div class="cart__item__content__description">
        <h2>${kanapModels[modelIndex].name}</h2>
        <p>${cartItem.color}</p>
        <p>${kanapModels[modelIndex].price} €</p>
      </div>
      <div class="cart__item__content__settings">
        <div class="cart__item__content__settings__quantity">
          <p>Qté : </p>
          <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value=${cartItem.quantity}>
        </div>
        <div class="cart__item__content__settings__delete">
          <p class="deleteItem">Supprimer</p>
        </div>
      </div>
    </div>
  </article>
    `
        cartItemsContent += exemple
    });
    return cartItemsContent
}

// ================================================================================

// Contrôle la résolution des requètes vers l'API et met à jour la page avec articles et total

Promise.all(fetchIdListGenerator(cartIds))
    .then(() => {
        document
            .getElementById("cart__items")
            .innerHTML = displayItemPanel(cartArray, kanapModels)
        // document
        //     .querySelectorAll("article")
        //     .forEach(
        //         (article) => {
        //             const price = document.querySelector("article input")
        //         }
        //     )
        updateTotal(cartArray, kanapModels)
        eventDelete()
        eventQuantityChange()
    }
    )
    .catch((error) => alert("Le chargement des articles du panier à échoué, essayez plus tard"))


// ******************** Gestion du formulaire **********************


// ------- variables -------------------------------------------------------------
const firstName = document.getElementById("firstName")
const firstNameErrorMsg = document.getElementById("firstNameErrorMsg")
const lastName = document.getElementById("lastName")
const lastNameErrorMsg = document.getElementById("lastNameErrorMsg")
const address = document.getElementById("address")
const addressErrorMsg = document.getElementById("addressErrorMsg")
const city = document.getElementById("city")
const cityErrorMsg = document.getElementById("cityErrorMsg")
const email = document.getElementById("email")
// ------- regexName Regex utilisé pour les input de type texte sauf 'Adresse' ----
const regexName = /[!@#$%^&*(),;.?\/\\"§:{}|<>0-9]/
// ------- regexName Regex utilisé pour le champ'Adresse' ----
const regexAddress = /[!@$%^*;\/\\"§{}|<>]/


// ------------- listeners 'input' sur les champ de saisie texte -----------------------
firstName.addEventListener("input", () => {
    firstNameErrorMsg.textContent = regexName.test(firstName.value) ? displayErrorMsg("Le prénom") : ""
})
lastName.addEventListener("input", () => {
    lastNameErrorMsg.textContent = regexName.test(lastName.value) ? displayErrorMsg("Le nom") : ""
})
address.addEventListener("input", () => {
    addressErrorMsg.textContent = regexAddress.test(address.value) ? displayErrorMsg("L'adresse", false) : ""
})
city.addEventListener("input", () => {
    cityErrorMsg.textContent = regexName.test(city.value) ? displayErrorMsg("La ville") : ""
})


/**
 * Retourne un message en fonction du libellé du champ
 * @param {string} input nom du champ (le nom, l'adresse ...)
 * @param {boolean=true} noNumber true si ce champ n'accepte pas de chiffre
 * @returns {string} Message d'erreur
 */
function displayErrorMsg(input, noNumber = true) {
    const stringChiffre = noNumber ? "de chiffres ou " : ""
    return `${input} ne doit pas contenir ${stringChiffre}de caractères spéciaux`
}


// ------------ soumission du formulaire ----------------------------------------------------


/**
 * Contrôle l'absence de message d'erreurs dans le formulaire et que le panier n'est pas vide
 * @returns {boolean} renvoi 'true' si aucun d'un message d'erreur et panier non vide
 */
function formControl() {
    let control = false
    const noMsgError = !(firstNameErrorMsg.textContent || lastNameErrorMsg.textContent || addressErrorMsg.textContent || cityErrorMsg.textContent)
    if (noMsgError && (cartArray.length > 0)) {
        // console.log(cartArray)
        control = true
    }
    return control
}


// -------------- Evenement 'Submit' sur le formulaire -----------------------------------
const form = document.getElementsByTagName("form")[0]
form.addEventListener("submit", (e) => {
    e.preventDefault()
    if (formControl()) {
        sendOrder()
    }
    else {
        alert("Le panier est vide ou au moins un des champ des formulaire est incorrect")
    }
})




// --------------- Envoi de la commande -------------------------------------------------
function sendOrder() {
    // ---- objet contact du body ---------------------------------------

    const contact = {
        firstName: firstName.value,
        lastName: lastName.value,
        address: address.value,
        city: city.value,
        email: email.value
    }

    // --------- objet products (tableau des Id des articles) -----------
    const products = cartArray.map((k) => k.id)

    // --------- options de la requète POST -----------------------------
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({ contact, products })
    }

    // ---------- requète POST -----------------------------------------
    fetch(`${hrefApi}order`, options)
        .then((response) => response.json())
        .then((value) => {
            // console.log("réponse ok")
            // console.log(value.orderId)
            window.location.href = `./confirmation.html?orderId=${value.orderId}` 
            // `http://127.0.0.1:5500/front/html/confirmation.html?orderId=${value.orderId}`
        })
        .catch((error) => {
            alert("L'envoi de commande a échoué. Essayez plus tard")
            console.log("catch :", error)
        })


}
