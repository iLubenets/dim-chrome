console.log('DIM extension loaded.');

document.body.addEventListener('click', function(event) {
    if (event.target.className !== 'item') {
        return
    }
    setTimeout(function() {
        var itemPopup = document.getElementsByClassName('move-popup-dialog');
        if (itemPopup.length == 0) {
            return
        }

        // cleanup
        cleanExtensionPopup();

        // load data from light.gg
        const lightggItemUrl = parseLightggItemUrl();
        chrome.runtime.sendMessage(
            lightggItemUrl,
            function(lightggHtml) {
                displayExtensionPopup(
                    prepareContentFromLightgg(lightggItemUrl, lightggHtml)
                )
            });
    }, 100);
}, false);

function parseLightggItemUrl() {
    const itemUrl = document.querySelector('div.item-title-container > div.item-title-link > a').href;
    const regex = /items\/(\d+)/g;
    return 'https://www.light.gg/db/items/' + regex.exec(itemUrl)[1];
}

function prepareContentFromLightgg(lightggItemUrl, lightggHtml) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(lightggHtml, 'text/html');

    // header
    var container = '<div class="item-header">' +
        '<a target="_blank" href="' + lightggItemUrl + '">LIGHT.GG</a>' +
        '</div>';

    // rating
    container += '<div class="rating">' +
        'PVE: ' + doc.querySelector('#review-container > div:nth-child(2) > span').textContent +
        '    ' +
        'PVP: ' + doc.querySelector('#review-container > div:nth-child(3) > span').textContent +
        '</div>';

    // stats
    if (doc.getElementById('socket-container').innerHTML.includes('Item has recommended perks from the community.')) {
        const statColomns = doc.querySelectorAll('#socket-container > div.clearfix.perks > ul')
        const dataBalloonSearch = /data-balloon=/gm;
        container += statColomns[statColomns.length - 5].outerHTML.replace(dataBalloonSearch, 'title=') +
            statColomns[statColomns.length - 4].outerHTML.replace(dataBalloonSearch, 'title=') +
            statColomns[statColomns.length - 3].outerHTML.replace(dataBalloonSearch, 'title=') +
            statColomns[statColomns.length - 2].outerHTML.replace(dataBalloonSearch, 'title=') +
            statColomns[statColomns.length - 1].outerHTML.replace(dataBalloonSearch, 'title=');
    } else if (doc.getElementById('stats') != null) {
        container += doc.getElementById('stats').outerHTML;
    }

    return container;
}

function displayExtensionPopup(contentHtml) {
    const extensionContainer = document.createElement('div');
    extensionContainer.className = 'extension-popup'
    extensionContainer.innerHTML = contentHtml;

    const itemPopup = document.getElementsByClassName('move-popup-dialog');
    itemPopup.item(0).append(extensionContainer);
}

function cleanExtensionPopup() {
    var extensionPopup = document.getElementsByClassName('extension-popup');
    while (extensionPopup.length > 0) {
        extensionPopup[0].parentNode.removeChild(extensionPopup[0]);
    }
}