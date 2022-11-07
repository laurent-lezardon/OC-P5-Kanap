console.log("Bonjour tout le monde")

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
                console.log(article.dataset.id)
                const price = document.querySelector("article input")
                console.log(price.value)
            }
        )
        document.getElementById("totalQuantity").innerText = getCartTotal(cartArray)
        document.getElementById("totalPrice").innerText = getTotalPrice(cartArray, kanapModels)
    }
    )


/**
 * Retourne la quantité d'articles d'un panier
 * @param {[Kanap]} cartArray 
 * @returns 
 */
    function getCartTotal(cartArray) {
    return cartArray.map((item) => item.quantity).reduce((prev, curr) => prev + curr)
}


/**
 * Retourne la valeur d'un panier
 * @param {*} cartArray 
 * @param {*} kanapModels 
 * @returns 
 */
function getTotalPrice(cartArray, kanapModels) {
    let TotalPrice = 0
    cartArray.forEach(cartItem => {
        const modelIndex = kanapModels
            .map(item => item._id)
            .indexOf(cartItem.id)
        TotalPrice += cartItem.quantity * (parseInt(kanapModels[modelIndex].price))
        console.log(TotalPrice)
    }
    )
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


