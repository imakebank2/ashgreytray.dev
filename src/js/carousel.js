const track = document.getElementById("carouselTrack");
const next = document.querySelector(".carousel-btn.next");
const prev = document.querySelector(".carousel-btn.prev");

const items = [...track.children];
const gap = 24;

// Clone items for infinite effect
items.forEach(item => {
    track.appendChild(item.cloneNode(true));
    track.insertBefore(item.cloneNode(true), track.firstChild);
});

// Jump to the "real" first slide
const firstRealItem = items[0];
track.scrollLeft = firstRealItem.offsetLeft;

const getScrollAmount = () =>
    items[0].offsetWidth + gap;

// Button navigation
next.onclick = () =>
    track.scrollBy({ left: getScrollAmount(), behavior: "smooth" });

prev.onclick = () =>
    track.scrollBy({ left: -getScrollAmount(), behavior: "smooth" });

// Infinite loop correction
track.addEventListener("scroll", () => {
    const maxScroll =
        items.length * getScrollAmount();

    if (track.scrollLeft <= 0) {
        track.scrollLeft += maxScroll;
    } else if (track.scrollLeft >= maxScroll * 2) {
        track.scrollLeft -= maxScroll;
    }
});
