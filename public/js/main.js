const socket = io();

socket.on("getProducts", (data) => {
    const products = document.getElementById("products_list");
    products.innerHTML = ""
    data.forEach(product => {
        const div = document.createElement("div");
        div.innerHTML = `
            <h3>${product.title}</h3>
            <p>${product.price}</p>
            <p>${product.description}</p>
        `;
        products.appendChild(div);
    })
})