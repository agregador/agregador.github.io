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
const words = ["Gore", "Accidents", "Tragedies", "Deaths"],
  colors = ["color-1", "color-2", "color-3", "color-4"],
  text = document.querySelector(".name-site");
function* generator() {
  var index = 0;
  while (true) {
    yield index++;

    if (index > 3) {
      index = 0;
    }
  }
}
function printChar(word) {
  let i = 0;
  text.innerHTML = "";
  text.classList.add(colors[words.indexOf(word)]);
  let id = setInterval(() => {
    if (i >= word.length) {
      deleteChar();
      clearInterval(id);
    } else {
      text.innerHTML += word[i];
      i++;
    }
  }, 500);
}
function deleteChar() {
  let word = text.innerHTML;
  let i = word.length - 1;
  let id = setInterval(() => {
    if (i >= 0) {
      text.innerHTML = text.innerHTML.substring(0, text.innerHTML.length - 1);
      i--;
    } else {
      text.classList.remove(colors[words.indexOf(word)]);
      printChar(words[gen.next().value]);
      clearInterval(id);
    }
  }, 300);
}
let gen = generator();
printChar(words[gen.next().value]);