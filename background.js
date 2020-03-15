// to avoid CORS issue
chrome.runtime.onMessage.addListener(
    function(url, sender, onSuccess) {
        console.log('Send request to :' + url)
        fetch(url)
            .then(response => response.text())
            .then(responseText => onSuccess({ url: url, body: responseText }))

        return true;
    }
);