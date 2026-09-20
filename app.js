document.getElementById("getData").addEventListener("click", function () {

    const zipCode = document.getElementById("zipCode").value;

    document.getElementById("results").innerHTML =
        `<p>You entered ZIP code: <strong>${zipCode}</strong></p>`;

});
