
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
            console.log(value)
            // displayKanap(value)
            // console.log(value.imageUrl)
            console.log(document.querySelector(".item__img"))
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
            // const kanapColors = document.getElementById("colors")
            // console.log(kanapColors)
            for (color of value.colors) {
                // console.log(color)
                const newElt = document.createElement("option")
                newElt.innerText = color
                kanapColors.appendChild(newElt)
            }

        })
        .catch((error) => {
            console.log(error)
        })
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
    if (kanapColors.value && (kanapQuantity.value != 0)) {
        console.log(`achat valide ${kanapColors.value} ${kanapQuantity.value}`)
    } else if (!kanapColors.value) {         
        kanapColors.style.color = "orange"        
    } else {kanapQuantity.style.color = "orange"}
})

kanapColors.addEventListener("change", () => kanapColors.style.color = "var(--footer-secondary-color)")
kanapQuantity.addEventListener("change", () => kanapQuantity.style.color = "var(--footer-secondary-color)")




