// EasyHome Deals
// Property Search and Filter System


// Get search elements
const locationInput = document.getElementById("locationInput");
const propertyType = document.getElementById("propertyType");
const budget = document.getElementById("budget");
const searchBtn = document.getElementById("searchBtn");

// Get all property cards
const propertyCards = document.querySelectorAll(".property-card");


// Search button event
searchBtn.addEventListener("click", function () {

    // Get user input
    const locationValue = locationInput.value.toLowerCase().trim();
    const typeValue = propertyType.value;
    const budgetValue = budget.value;

    let visibleProperties = 0;


    // Check every property
    propertyCards.forEach(function (card) {

        // Get property information
        const location = card
            .querySelector(".property-location")
            .textContent
            .toLowerCase();

        const type = card
            .querySelector(".property-type")
            .textContent
            .toLowerCase();

        const priceText = card
            .querySelector("strong")
            .textContent;

        // Convert price text into number
        const price = parseInt(
            priceText.replace(/[^\d]/g, "")
        );


        // Location filter
        const locationMatch =
            locationValue === "" ||
            location.includes(locationValue);


        // Property type filter
        let typeMatch = true;

        if (typeValue !== "Any Property") {
            typeMatch = type.includes(
                typeValue.toLowerCase()
            );
        }


        // Budget filter
        let budgetMatch = true;

        if (budgetValue === "Under ₹10,000") {
            budgetMatch = price < 10000;
        }

        else if (budgetValue === "₹10,000 - ₹15,000") {
            budgetMatch = price >= 10000 && price <= 15000;
        }

        else if (budgetValue === "₹15,000 - ₹20,000") {
            budgetMatch = price > 15000 && price <= 20000;
        }

        else if (budgetValue === "Above ₹20,000") {
            budgetMatch = price > 20000;
        }


        // Show or hide property
        if (
            locationMatch &&
            typeMatch &&
            budgetMatch
        ) {

            card.style.display = "";

            visibleProperties++;

        } else {

            card.style.display = "none";

        }

    });


    // Show message if no property matches
    showNoResultsMessage(visibleProperties);

});


// Function to show "No properties found"
function showNoResultsMessage(count) {

    let message =
        document.getElementById("noResults");


    // If no properties found
    if (count === 0) {

        if (!message) {

            message = document.createElement("p");

            message.id = "noResults";

            message.textContent =
                "No properties found matching your search.";

            message.style.textAlign = "center";
            message.style.marginTop = "30px";
            message.style.fontSize = "18px";
            message.style.fontWeight = "500";

            document
                .querySelector(".property-grid")
                .appendChild(message);
        }

    }

    // Remove message when properties are found
    else {

        if (message) {
            message.remove();
        }

    }

}