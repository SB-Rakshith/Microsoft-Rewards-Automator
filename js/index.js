let tabId;
let running;
let speed;
const stop = $("#stop");


chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
	if (message.message === "search") {
		running = response.running;
		console.log("Updating UI attempted after response received.");
		updateUI();
		if (!running) {
			chrome.tabs.update({
				url: "https://www.bing.com",
			});
			console.log("Updated tab with bing url");
		}
	}
});

if (!running) {
	chrome.runtime.sendMessage(
		{
			message: "check",
		},
		function (response) {
			console.log(
				"response received for running status:",
				response.running,
			);
			running = response.running;
			console.log("Updating UI attempted after response received.");
			updateUI();
			chrome.tabs.query(
				{ active: true, currentWindow: true },
				function (tabs) {
					tabId = tabs[0].id;
					console.log(`Tab ID is: ${tabId}`);
				},
			);
			if (!running) {
				chrome.tabs.update({
					url: "https://www.bing.com",
				});
				console.log("Updated tab with bing url");
			}
		},
	);
}

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
	if (message.message === "done") {
		running = false;
		
		
		updateUI();
	}
});

function updateUI() {
	$(".btn").each(function () {
		$(this).toggleClass("blocked", running);
	});
	$("#stop").css("display", running ? "block" : "none");
	console.log("UI updated.");
}

$(document).ready(function () {
	const m = $("#mobile");
	const pc = $("#desktop");
	const userDefined = $("#userDefined");
	const s30 = $("#s30");
	const s60 = $("#s60");
	const s90 = $("#s90");
	const s150 = $("#s150");
	const slow = $("#slow");
	const fast = $("#fast");
	const variable = $("#variable");

	// Stop button
	$("#stop").click(function () {
		chrome.runtime.sendMessage(
			{
				message: "stop",
			},
			function (response) {
				console.log("response received:", response.running);
				running = response.running;
				updateUI();
				
			},
		);
	});

	function triggerSearch(mobile, desktop) {
		const mobileValue = parseInt(mobile);
		const desktopValue = parseInt(desktop);
		console.log(
			"Triggering search with values:",
			mobileValue,
			desktopValue,
			tabId,
			speed,
		);
		chrome.runtime.sendMessage(
			{
				message: "run",
				tabId: tabId,
				mValue: mobileValue,
				pcValue: desktopValue,
				time: speed,
			},
			function (response) {
				console.log("response received:", response.running);
				running = response.running;
				updateUI();
			},
		);
	}

	// Style the popup window
	$("body").css({
		width: window.screen.width / 5 + "px",
		"max-height": window.screen.height / 2 + "px",
	});

	// Set the speed value
	speed = localStorage.getItem("time");
	if (speed === null) {
		speed = "variable";
		localStorage.setItem("time", speed);
	}
	const speedValues = ["slow", "fast", "variable"];
	speedValues.forEach((value) => {
		if (speed === value) {
			slow.toggleClass("disabled", value !== "slow");
			fast.toggleClass("disabled", value !== "fast");
			variable.toggleClass("disabled", value !== "variable");
		}
	});

	slow.click(function () {
		setSpeed("slow");
		console.log("Slow clicked.");
	});
	fast.click(function () {
		setSpeed("fast");
	});
	variable.click(function () {
		setSpeed("variable");
	});
	function setSpeed(speedValue) {
		console.log(`Time value stored as '${speedValue}'.`);
		slow.toggleClass("disabled", speedValue !== "slow");
		fast.toggleClass("disabled", speedValue !== "fast");
		variable.toggleClass("disabled", speedValue !== "variable");
		speed = speedValue;
		localStorage.setItem("time", speed);
	}

	// Handle the user defined search
	userDefined.click(function () {
		triggerSearch(m.val(), pc.val());
	});

	// Handle the predefined search
	s30.click(function () {
		triggerSearch("0", "12");
	});
	s60.click(function () {
		triggerSearch("12", "24");
	});
	s90.click(function () {
		triggerSearch("24", "36");
	});
	s150.click(function () {
		triggerSearch("36", "60");
	});
});