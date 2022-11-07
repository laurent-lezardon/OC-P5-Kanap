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
        console.log("total articles", getCartTotal(cartArray))
        // console.log(kanapModels)
    }
    )

function getCartTotal(cartArray) {
    return cartArray.map((item) => item.quantity).reduce((prev,curr) => prev + curr)
}

/**
 * 
 * @param {[KanapsObject]} kanapModels
 * @param {Kanap} cartArray 
 * @returns {string} code HTML contenant les articles du panier
 */
function displayItemPanel(cartArray, kanapModels) {
    let cartItemsContent = ""
    cartArray.forEach(cartItem => {
        // console.log(cartItem.id)
        // console.log(kanapModels.map(item => item._id))
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

console.log()
