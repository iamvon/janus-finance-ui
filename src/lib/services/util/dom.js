export const addDangerousHiddenStringHTMLtoDOM = (html, id = null) => {
    let child = document.createElement('div');
    if (id) {
        child.id = id
    }
    child.innerHTML = html
    child.style.display = "none"
    document.getElementsByTagName('body')[0].appendChild(child)
    return child
}


export const waitForElement = (selector, callback) => {
    let poops = setInterval(function () {
        let element = document.querySelector(selector)
        if (element) {
            clearInterval(poops);
            callback(element);
        }
    }, 100);
}
