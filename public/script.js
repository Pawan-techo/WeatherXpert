document.addEventListener("DOMContentLoaded", function () {
    const cityInput = document.getElementById("cityInput");
    const suggestionsBox = document.getElementById("suggestions");

    // Static city list for suggestions
    const cityList = ["Mumbai", "Delhi", "Bangalore", "Hyderabad", "Chennai", "Kolkata", "Pune", "Jaipur", "Ahmedabad", "Surat"];

    cityInput.addEventListener("input", function () {
        const inputVal = cityInput.value.toLowerCase();
        suggestionsBox.innerHTML = "";

        if (inputVal.length > 0) {
            const filteredCities = cityList.filter(city => city.toLowerCase().startsWith(inputVal));
            suggestionsBox.style.display = filteredCities.length ? "block" : "none";

            filteredCities.forEach(city => {
                const li = document.createElement("li");
                li.textContent = city;
                li.addEventListener("click", function () {
                    cityInput.value = city;
                    suggestionsBox.style.display = "none";
                });
                suggestionsBox.appendChild(li);
            });
        } else {
            suggestionsBox.style.display = "none";
        }
    });

    document.addEventListener("click", function (e) {
        if (!suggestionsBox.contains(e.target) && e.target !== cityInput) {
            suggestionsBox.style.display = "none";
        }
    });
});

