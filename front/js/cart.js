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
        console.log(kanapModels)
    }
    )

