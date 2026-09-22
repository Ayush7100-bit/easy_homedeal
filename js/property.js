// EasyHome Deals
// Property Details Data

const properties = {

    1: {
        title: "Modern 1 BHK Apartment",
        type: "Fully Furnished • 1 BHK",
        location: "Sector 55, Gurgaon",
        price: "₹18,000",
        image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80",

        description:
            "A modern and comfortable 1 BHK apartment located in Sector 55, Gurgaon. The property is fully furnished and suitable for working professionals and students looking for a convenient rental home.",

        features: {
            bedroom: "1 BHK",
            bathroom: "1",
            furnishing: "Fully",
            parking: "Available"
        },

        amenities: [
            "✓ Wi-Fi",
            "✓ Air Conditioning",
            "✓ Parking",
            "✓ Power Backup",
            "✓ Kitchen",
            "✓ Security"
        ]
    },


    2: {
        title: "Premium Private Room",
        type: "Fully Furnished • Room",
        location: "Sector 56, Gurgaon",
        price: "₹14,000",
        image: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=80",

        description:
            "A premium fully furnished private room in Sector 56, Gurgaon. Ideal for students and working professionals looking for a comfortable and well-connected place to stay.",

        features: {
            bedroom: "Private",
            bathroom: "1",
            furnishing: "Fully",
            parking: "Available"
        },

        amenities: [
            "✓ Wi-Fi",
            "✓ Air Conditioning",
            "✓ Parking",
            "✓ Power Backup",
            "✓ Bed & Wardrobe",
            "✓ Security"
        ]
    },


    3: {
        title: "Spacious 2 BHK Flat",
        type: "Semi Furnished • 2 BHK",
        location: "Golf Course Road, Gurgaon",
        price: "₹25,000",
        image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",

        description:
            "A spacious 2 BHK flat located near Golf Course Road, Gurgaon. The property offers comfortable living space and is suitable for families and working professionals.",

        features: {
            bedroom: "2 BHK",
            bathroom: "2",
            furnishing: "Semi",
            parking: "Available"
        },

        amenities: [
            "✓ Parking",
            "✓ Power Backup",
            "✓ Modular Kitchen",
            "✓ Security",
            "✓ Balcony",
            "✓ Water Supply"
        ]
    }

};
// Get property ID from URL

const urlParams = new URLSearchParams(window.location.search);

const propertyId = urlParams.get("id");


// Get selected property

const property = properties[propertyId];


// Check if property exists

if (property) {

    // Basic property information

    document.getElementById("propertyTitle").textContent =
        property.title;

    document.getElementById("propertyTypeText").textContent =
        property.type;

    document.getElementById("propertyLocation").textContent =
        "📍 " + property.location;

    document.getElementById("propertyPrice").innerHTML =
        property.price + "<span>/month</span>";


    // Property image

    document.getElementById("propertyImage").src =
        property.image;

    document.getElementById("propertyImage").alt =
        property.title;


    // Description

    document.getElementById("propertyDescription").textContent =
        property.description;


    // Features

    document.getElementById("bedroomFeature").textContent =
        property.features.bedroom;

    document.getElementById("bathroomFeature").textContent =
        property.features.bathroom;

    document.getElementById("furnishingFeature").textContent =
        property.features.furnishing;

    document.getElementById("parkingFeature").textContent =
        property.features.parking;


    // Amenities

    const amenitiesList =
        document.getElementById("amenitiesList");


    amenitiesList.innerHTML = "";


    property.amenities.forEach(function (amenity) {

        const amenityElement =
            document.createElement("span");

        amenityElement.textContent =
            amenity;

        amenitiesList.appendChild(
            amenityElement
        );

    });

}
// Enquiry form

const enquiryForm =
    document.getElementById("enquiryForm");

const enquirySuccess =
    document.getElementById("enquirySuccess");


if (enquiryForm) {

    enquiryForm.addEventListener("submit", function (event) {

        event.preventDefault();


        const name =
            document.getElementById("name").value.trim();


        const propertyTitle =
            document.getElementById("propertyTitle").textContent;


        enquirySuccess.textContent =
            "Thank you, " + name +
            "! Your enquiry for " +
            propertyTitle +
            " has been submitted successfully.";


        enquirySuccess.style.display = "block";


        enquiryForm.reset();

    });

}