document.addEventListener("DOMContentLoaded", () => {
        const prominentImage = document.querySelector(".gallery-image.prominent");
        const icons = document.querySelectorAll(".icon");
        const yearDisplay = document.getElementById("yearDisplay"); // reference to the new element

        icons.forEach(icon => {
                icon.addEventListener("click", () => {
                        const newSrc = icon.getAttribute("src");
                        const newAlt = icon.getAttribute("alt");

                        // Skip if the image is already displayed.
                        if (prominentImage.getAttribute("src") !== newSrc) {
                                // Begin fade-out
                                prominentImage.style.transition = "opacity 0.3s ease-out";
                                prominentImage.style.opacity = "0";
                                // After the fade-out duration, update image and year, then fade back in.
                                setTimeout(() => {
                                        prominentImage.src = newSrc;
                                        prominentImage.alt = newAlt;
                                        yearDisplay.textContent = newAlt; // update the year display
                                        prominentImage.style.opacity = "1";
                                }, 300);
                        }
                });
        });
});    