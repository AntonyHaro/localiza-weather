let currentIndex = 0;

function showSlide(index) {
    const slides = document.querySelectorAll(".carousel-item");
    const totalSlides = slides.length;

    // Loop back to the first slide if at the ends
    if (index >= totalSlides) {
        currentIndex = 0;
    } else if (index < 0) {
        currentIndex = totalSlides - 1;
    } else {
        currentIndex = index;
    }

    // Move the carousel
    const offset = -currentIndex * 100; // Move to the current slide
    document.querySelector(
        ".carousel-inner"
    ).style.transform = `translateX(${offset}%)`;
}

function moveSlide(direction) {
    showSlide(currentIndex + direction);
}

// Inicializa o carrossel
showSlide(currentIndex);
