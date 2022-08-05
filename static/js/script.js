// import KEYS from "../assets/Keys.js"


//test
// const public = "pk_test_51LS7RAAPmRoahpyHmi2Aaf44P1cKQta538vRX3GlkBznVLl1bup4jR6eLc3ZpGD2FZrFwlhUJLl2CX8XOZGh2GPj00nBzAnxtu"
// const secret = "sk_test_51LS7RAAPmRoahpyHhShkD0YtLqU7spLJnZmJH3Osdy0SciBdOobrJkJUUY0s5o7QZVe7OVCiAvG2LLfs4oZBjpKq00b3O2DYYz"

//production
const public = "pk_live_51LS7RAAPmRoahpyHCNCEBmIm1w6y5nUEM7rBi4oJBq3HpLaQKm3Do1QNE4PPq7IBFh9dQ8HGtXWSHph5EMafEn4x00cBBEtVUZ"
const secret = "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"

const $d = document;
const $arepas = $d.getElementById("arepas");
const $template = $d.getElementById("arepa-template").content;
const $fragment = $d.createDocumentFragment();
const options = { headers: {Authorization: `Bearer ${secret}`}}
const FormatoDeMoneda = num => `$${num.slice(0, -2)}.${num.slice(-2)}`;



let products, prices;

Promise.all([
    fetch("https://api.stripe.com/v1/products", options),
    fetch("https://api.stripe.com/v1/prices", options)
])
.then(responses => Promise.all(responses.map(res => res.json())))
.then(json => {
    product = json[0].data
    price = json[1].data
    _product = []
    _price = []
    for(var i = 0; i < product.length; i++){
        if(product[i]['active'] == true){
            _product.push(product[i])
        }
    }
    for(var j = 0; j < _product.length; j++){
        if(price[j].product == _product[j].id){
            _price.push(price[j])
        }
    }
    console.log(_product)
    console.log(_price)

    _price.forEach(el => {
        let productData = _product.filter(product => product.id === el.product);
        
        $template.querySelector(".arepa").setAttribute("data-price", el.id);
        $template.querySelector("img").src = productData[0].images[0];
        $template.querySelector("img").alt = productData[0].name;
        $template.querySelector("figcaption").innerHTML = `${productData[0].name} ${FormatoDeMoneda(el.unit_amount_decimal)} ${(el.currency).toUpperCase()}`;

        let $clone = $d.importNode($template, true);

        $fragment.appendChild($clone);
    });

    $arepas.appendChild($fragment);

})
.catch(error => {
    let message = error.statuText || "Ocurrió un error en la petición";
    $arepas.innerHTML = `Error: ${error.status}: ${message}`;
})

$d.addEventListener("click", e => {
    if (e.target.matches(".arepas *")) {
        let priceId = e.target.parentElement.getAttribute("data-price");

        Stripe(public).redirectToCheckout({
            lineItems: [{
                price: priceId,
                quantity: 1
            }],
            mode: "subscription",
            successUrl:"http://localhost/arepa",
            cancelUrl:"https://localhost/arepa/assets/cancel.html"
        })
        .then(res => {
            if (res.error){
                $arepas.insertAdjacentElement("afterend", res.error.message)
            }
        })
    }
})






































/////////////////////////////////////////////////////////////////////////////////////////////




// .then(json => {
//     products = json[0].data;
//     prices = json[1].data;
//     prices.forEach(el => {
//         let productData = products.filter(product => product.id === el.product);
        
//         $template.querySelector(".arepa").setAttribute("data-price", el.id);
//         $template.querySelector("img").src = productData[0].images[0];
//         $template.querySelector("img").alt = productData[0].name;
//         $template.querySelector("figcaption").innerHTML = `${productData[0].name} ${FormatoDeMoneda(el.unit_amount_decimal)} ${(el.currency).toUpperCase()}`;

//         let $clone = $d.importNode($template, true);

//         $fragment.appendChild($clone);
//     });

//     $arepas.appendChild($fragment);
// })