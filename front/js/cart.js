

/**
 * representation objet fournie par l'API d'un canapé
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
 * représentation objet d'un article du panier
 * @typedef {object} Kanap
 * @property {string} id
 * @property {string} color
 * @property {number} quantity
 */

const products = "http://127.0.0.1:3000/api/products/"
const cartArray = JSON.parse(localStorage.cartJson)
cartArray.sort((a, b) => (b.id > a.id ? 1 : -1))
console.log(cartArray)
const kanapModels = []
// ensemble des identifiant du panier
const cartIds = new Set(cartArray.map((item) => item.id))

/**
 * Génère le tableau des requètes API d'après un tableau d'index
 * @param {[string]} cartIds (const globale)
 * @returns {[Promise]} 
 */
function fetchIdListGenerator(cartIds) {
    const fetchList = []
    for (let id of cartIds) {
        console.log(id)
        fetchList.push(
            fetch(`${products}${id}`)
                .then((response) => {
                    if (response.ok) {
                        return response.json()
                    }
                })
                .then((kanap) => {
                    kanapModels.push(kanap)
                    console.log(kanap.name)
                }))

    }
    return fetchList
}


Promise.all(fetchIdListGenerator(cartIds))
    .then(() => {
        document
            .getElementById("cart__items")
            .innerHTML = displayItemPanel(cartArray, kanapModels)

        document.querySelectorAll("article").forEach(
            (article) => {
                // console.log(article.dataset.id)
                const price = document.querySelector("article input")
                // console.log(price.value)
            }
        )
        document.getElementById("totalQuantity").innerText = getCartTotal(cartArray)
        document.getElementById("totalPrice").innerText = getTotalPrice(cartArray, kanapModels)
        eventDelete()
        eventQuantityChange()

    }
    )

function eventDelete() {
    document
        .querySelectorAll(".deleteItem").forEach((deletItem) => {
            deletItem.addEventListener("click", () => {
                // console.log("click !")            
                // console.log(deletItem.closest("article"))
                // console.log(getItemIndexCart(deletItem, cartArray))
                const itemIndexCart = getItemIndexCart(deletItem, cartArray)
                cartArray.splice(itemIndexCart, 1)
                localStorage.cartJson = JSON.stringify(cartArray)
                deletItem.closest("article").remove()


            })
        })
}

function eventQuantityChange() {

    document
        .querySelectorAll(".itemQuantity")
        .forEach((itemQuantity) => {
            itemQuantity.addEventListener("change", () => {
                // console.log(itemQuantity.value)
                // const item = itemQuantity.closest("article").dataset
                // console.log(item.id)
                // console.log(item.color)
                console.log(getItemIndexCart(itemQuantity, cartArray))
                const itemIndexCart = getItemIndexCart(itemQuantity, cartArray)
                cartArray[itemIndexCart].quantity = itemQuantity.value
                localStorage.cartJson = JSON.stringify(cartArray)


            })

        })
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
    return cartArray.length > 0 ? cartArray.map((item) => item.quantity).reduce((prev, curr) => prev + curr) : 0
}


/**
 * Retourne la valeur d'un panier
 * @param {*} cartArray 
 * @param {*} kanapModels 
 * @returns 
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
      <img src=${kanapModels[modelIndex].imageUrl} alt=${kanapModels[modelIndex].altTxt}>
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


// ******************** formulaire **********************

const regexName = /[!@#$%^&*(),;.?\/\\"§:{}|<>0-9]/
const regexAddress = /[!@$%^*;\/\\"§{}|<>]/
firstName = document.getElementById("firstName")
firstNameErrorMsg = document.getElementById("firstNameErrorMsg")
lastName = document.getElementById("lastName")
lastNameErrorMsg = document.getElementById("lastNameErrorMsg")
address = document.getElementById("address")
addressErrorMsg = document.getElementById("addressErrorMsg")
city = document.getElementById("city")
cityErrorMsg = document.getElementById("cityErrorMsg")
email = document.getElementById("email")


// ------------- listeners 'input' sur les champ de saisie texte -----------------------
firstName.addEventListener("input", () => {
    firstNameErrorMsg.innerText = regexName.test(firstName.value) ? displayErrorMsg("Le prénom") : ""
})
lastName.addEventListener("input", () => {
    lastNameErrorMsg.innerText = regexName.test(lastName.value) ? displayErrorMsg("Le nom") : ""
})
address.addEventListener("input", () => {
    addressErrorMsg.innerText = regexAddress.test(address.value) ? displayErrorMsg("L'adresse", false) : ""
})
city.addEventListener("input", () => {
    cityErrorMsg.innerText = regexName.test(city.value) ? displayErrorMsg("La ville") : ""
})


/**
 * 
 * @param {string} input nom du champ (le nom, l'adresse ...)
 * @param {boolean=true} noNumber true si ce champ n'accepte pas de titre
 * @returns 
 */
function displayErrorMsg(input, noNumber = true) {
    const stringChiffre = noNumber ? "" : "chiffres ou "
    return `${input} ne doit pas contenir ${stringChiffre}de caractères spéciaux`
}


// ------------ soumission du formulaire ----------------------------------------------------
const form = document.getElementsByTagName("form")[0]
form.addEventListener("submit", (e) => {
    if (formControl()) {
        e.preventDefault() // a supprimer après test
        sendOrder()
    }
    else { e.preventDefault() }


})

function formControl() {
    let control = false
    if (!(firstNameErrorMsg.innerHTML || lastNameErrorMsg.innerText || addressErrorMsg.innerText || cityErrorMsg.innerText)) {
        console.log("pas d'erreur")
        control = true
    }
    return control

}

// --------------- Envoi de la commande -------------------------------------------------
function sendOrder() {
    console.log("contrôle valide")
    const contact = {
        firstName: firstName.value,
        lastName: lastName.value,
        address: address.value,
        city: city.value,
        email: email.value
    }

    const products = cartArray.map((k) => k.id)
    console.log(JSON.stringify(products))
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept' : 'application/json'
        },
        body: JSON.stringify({contact, products})
    }
    fetch("http://127.0.0.1:3000/api/products/order", options)
        .then((response) => response.json())
        .then((value) => {
            console.log("réponse ok")
            console.log(value)
            console.log(window.location.href)
        })
        .catch((error) => {
            console.log("catch :",error)
        })


}
