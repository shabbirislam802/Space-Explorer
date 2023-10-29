import '../styles/style.css'
import {fetchNewsAndCreateCards} from "./utils/api";

let currentOffset = 10;

window.addEventListener('scroll', () => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
        currentOffset += 10;
        fetchNewsAndCreateCards(currentOffset);
    }
});

fetchNewsAndCreateCards(currentOffset);
