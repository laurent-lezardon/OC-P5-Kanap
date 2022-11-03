console.log("script démarré")


function askKanap() {
    fetch("http://127.0.0.1:3000/api/products")
        .then((response) => {
            if (response.ok) {
                return response.json()
            }
            console.log("Réponse du serveur NOK")

        })
        .then((value) => {
            console.log(value)
            document
                .getElementById("items")
                .innerHTML = displayKanaps(value)

            console.log(document.querySelectorAll("#items > a"))
            // kanapEvent()
        })
        .catch((error) => {
            console.log(error)
        })
}


/**
 * 
 * @param {*} kanapsObjects 
 * @returns 
 */
function displayKanaps(kanapsObjects) {
    let kanapsItems = ""
    kanapsObjects.forEach((kanap) => {
        kanapsItems += `<a href="./product.html?id=${kanap.id}">
    <article>
      <img src=${kanap.imageUrl} alt=${kanap.altTxt}>
      <h3 class="productName">${kanap.name}</h3>
      <p class="productDescription">${kanap.description}</p>
    </article>
  </a>`})
    //   console.log(kanapsItems)
    return kanapsItems
}

askKanap()


// function kanapEvent() {
//     const kanapsAnchors = document.querySelectorAll("#items > a")
//     kanapsAnchors.forEach((kanap) => {
//         kanap.addEventListener("click", () => {
//             console.log("click")
//         })
//     })

// }




