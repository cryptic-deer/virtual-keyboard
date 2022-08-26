const keyboard = {
	// Tracking all the elements
	elements: {
		main: null,
		keysContainer: null,
		keys: [],
	},

	// Tracking events (open & close keyboard)
	eventHandlers: {
		oninput: null,
		onclose: null,
	},

	properties: {
		// cuurent textarea value
		value: "",
		// capslock state
		capsLock: false,
	},

	// Initialize keyboard
	init() {
		// create main elements
		this.elements.main = document.createElement("div");
		this.elements.keysContainer = document.createElement("div");

		// setup main elements
		this.elements.main.classList.add("keyboard", "keyboard--hidden");
		this.elements.keysContainer.classList.add("keyboard__keys");

		// add keys to container
		this.elements.keysContainer.appendChild(this._createKeys());

		// select all the keys
		this.elements.keys =
			this.elements.keysContainer.querySelectorAll(".keyboard__key");

		// add key container to main container
		this.elements.main.appendChild(this.elements.keysContainer);

		// add main container to the actual DOM body
		document.body.appendChild(this.elements.main);

		// automatically use keyboard for elements with .use-keyboard-input
		document.querySelectorAll(".use-keyboard-input").forEach(element => {
			element.addEventListener("focus", () => {
				this.open(element.value, currentValue => {
					element.value = currentValue;
				});
			});
		});
	},

	// Creating the html for the keyboard/keys
	_createKeys() {
		// fragment -> virtual element to append all the keys to
		const fragment = document.createDocumentFragment();

		const keyLayout = [
			"1",
			"2",
			"3",
			"4",
			"5",
			"6",
			"7",
			"8",
			"9",
			"0",
			"backspace",
			"q",
			"w",
			"e",
			"r",
			"t",
			"y",
			"u",
			"i",
			"o",
			"p",
			"caps",
			"a",
			"s",
			"d",
			"f",
			"g",
			"h",
			"j",
			"k",
			"l",
			"enter",
			"done",
			"z",
			"x",
			"c",
			"v",
			"b",
			"n",
			"m",
			",",
			".",
			"?",
			"space",
		];

		// create html for icons
		const createIconHTML = icon_name => {
			return `<i class="material-icons">${icon_name}</i>`;
		};

		// create keys
		keyLayout.forEach(key => {
			const keyElement = document.createElement("button");

			// after which buttons should the keyboard wrap
			const insertLineBreak =
				["backspace", "p", "enter", "?"].indexOf(key) !== -1;

			// add attributes/classes
			keyElement.setAttribute("type", "button");
			keyElement.classList.add("keyboard__key");

			// account for special keys
			switch (key) {
				case "backspace":
					keyElement.classList.add("keyboard__key--wide");
					keyElement.innerHTML = createIconHTML("backspace");

					// delete the last character
					keyElement.addEventListener("click", () => {
						this.properties.value = this.properties.value.substring(
							0,
							this.properties.value.length - 1
						);
						this._triggerEvent("oninput");
					});

					break;

				case "caps":
					keyElement.classList.add(
						"keyboard__key--wide",
						"keyboard__key--activatable"
					);
					keyElement.innerHTML = createIconHTML("keyboard_capslock");

					// set capsLock property to true
					keyElement.addEventListener("click", () => {
						this._toggleCapsLock();
						keyElement.classList.toggle(
							"keyboard__key--active",
							this.properties.capsLock
						);
					});

					break;

				case "enter":
					keyElement.classList.add("keyboard__key--wide");
					keyElement.innerHTML = createIconHTML("keyboard_return");

					// start new line
					keyElement.addEventListener("click", () => {
						this.properties.value += "\n";
						this._triggerEvent("oninput");
					});

					break;

				case "space":
					keyElement.classList.add("keyboard__key--extra-wide");
					keyElement.innerHTML = createIconHTML("space_bar");

					// add an empty character
					keyElement.addEventListener("click", () => {
						this.properties.value += " ";
						this._triggerEvent("oninput");
					});

					break;

				case "done":
					keyElement.classList.add(
						"keyboard__key--wide",
						"keyboard__key--dark"
					);
					keyElement.innerHTML = createIconHTML("check_circle");

					// close the keyboard
					keyElement.addEventListener("click", () => {
						this.close();
						this._triggerEvent("onclose");
					});

					break;

				default:
					keyElement.textContent = key.toLowerCase();

					keyElement.addEventListener("click", () => {
						this.properties.value += this.properties.capsLock
							? key.toUpperCase()
							: key.toLowerCase();
						this._triggerEvent("oninput");
					});

					break;
			}

			// append the current key to the fragment
			fragment.appendChild(keyElement);

			// insert break if the key should be on a new row
			if (insertLineBreak) {
				fragment.appendChild(document.createElement("br"));
			}
		});

		// return the whole fragment that houses all of the created keys
		return fragment;
	},

	// Open or Close the keyboard depending on the passed event
	_triggerEvent(handlerName) {
		if (typeof this.eventHandlers[handlerName] == "function") {
			this.eventHandlers[handlerName](this.properties.value);
		}
	},

	_toggleCapsLock() {
		this.properties.capsLock = !this.properties.capsLock;

		// set capslock state to all of the keys
		for (const key of this.elements.keys) {
			if (key.childElementCount === 0) {
				key.textContent = this.properties.capsLock
					? key.textContent.toUpperCase()
					: key.textContent.toLowerCase();
			}
		}
	},

	// Opening keyboard, initialValue -> if there is already text in the input area
	open(initialValue, oninput, onclose) {
		this.properties.value = initialValue || "";

		this.eventHandlers.oninput = oninput;
		this.eventHandlers.onclose = onclose;

		this.elements.main.classList.remove("keyboard--hidden");
	},

	// Closing keyboard
	close() {
		this.properties.value = "";

		// this.eventHandlers.oninput = oninput;
		// this.eventHandlers.onclose = onclose;

		this.elements.main.classList.add("keyboard--hidden");
	},
};

// DOM loaded => initialize keyboard
window.addEventListener("DOMContentLoaded", () => keyboard.init());
