customElements.define("header-mobile", class extends HTMLElement {
    constructor() {
        super();
        this.addEventListener("click", e => {
            this.classList.toggle("active");
            this.previousElementSibling.classList.toggle("active");
            this.nextElementSibling.classList.toggle("active");
        });
    }
});