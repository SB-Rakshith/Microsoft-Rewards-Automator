chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
	if (message.message === "search") {
		console.log("Message received from background.js:", message.word);
		let searchTextarea = document.getElementById("sb_form_q");
		if (searchTextarea) {
			const searchstart = [
				"what is ",
				"",
				"what are ",
				"meaning of ",
				"",
				"what is the meaning of ",
				"what is the definition of ",
				"define ",
				"",
				"definition of ",
				"what is the ",
				"what do you mean by ",
				"similar words of ",
				"",
				"synonyms of ",
				"antonyms of ",
				"what is the synonym of ",
				"what is the antonym of ",
				"what is the opposite of ",
				"",
				"what is the opposite meaning of ",
				"is it a word: ",
				"is it a word ",
				"please search ",
				"search ",
				"what the hell is ",
				"",
				"spelling of ",
				"what is the spelling of ",
				"what is the correct spelling of ",
				"what is the correct spelling for ",
				"what is the correct spelling ",
				"is this a hero name? ",
			];
			// const start = random item from searchstart
			const start = searchstart[Math.floor(Math.random() * searchstart.length)];
			searchTextarea.value = start + message.word;
			let formElement = searchTextarea.closest("form");
			if (formElement) {
				formElement.submit();
			}
		}
	}
});
// check url
if (window.location.href.includes("bing")) {
	console.log("content.js has been loaded.");
}