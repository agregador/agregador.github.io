var search;
$.getJSON("/search.json", function(json){
    search = json;
});
window.addEventListener("click", function(e){
    if (document.querySelector("live-search-results").contains(e.target)) {
        return;
    }
    if (document.querySelector("input[is='live-search']").contains(e.target)){
        if (e.target.value.length > 2) {
            e.target.classList.add("active");
            e.target.nextElementSibling.classList.remove("disabled");
        }
    } else {
        document.querySelector("input[is='live-search']").classList.remove("active");
        document.querySelector("live-search-results").classList.add("disabled");
    }
    e.stopPropagation();
});
class LiveSearchEngine extends HTMLInputElement {
    constructor() {
        super();
        this.addEventListener("input", () => {
            this.LiveSearchEngine(this);
        });
    }
    LiveSearchEngineEmpty = (input) => {
        (input.value.length > 2) ? input.classList.add("active") : input.classList.remove("active");
        if (input.value.length <= 2) {
            input.nextElementSibling.innerHTML = "";
            input.nextElementSibling.classList.add("disabled")
            return;
        }
    }
    LiveSearchEngine = (input) => {
        var results = this.LiveSearchEngineTemplate(input);
        input.nextElementSibling.innerHTML = results;
        input.nextElementSibling.classList.remove("disabled");
        this.LiveSearchEngineEmpty(input);
    }
    LiveSearchEngineTemplate = (input) => {
        var results = "",
            empty = "<live-search-result-empty>Nenhum resultado encontrado, tente ser menos específico.</live-search-result-empty>",
            regexp_string = new RegExp(input.value, "i");
        search.forEach((post, key, last) => {
            if ((post.title.search(regexp_string) != -1) 
                || (post.hash.search(regexp_string) != -1)) {
            results += `<a href="`+ post.url +`">
                <live-search-result-poster>
                    <img src="https://via.placeholder.com/48" alt="`+post.title+`">
                </live-search-result-poster>
                <live-search-result-summary>
                    <live-search-result-title>`+post.title+`</live-search-result-title>
                    <live-search-result-uploader>`+post.author+`</live-search-result-uploader>
                </live-search-result-summary>
            </a>`;
            }
        });
        return (results.length === 0) ? empty : results;
    }
};
customElements.define("live-search", LiveSearchEngine, { extends: "input" });