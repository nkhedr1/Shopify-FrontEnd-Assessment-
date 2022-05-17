const form = document.querySelector('#open-ai-form');
const promptElement = document.querySelector('#prompt');
const responseContainer = document.querySelector('#response-container');
const engineListElement = document.querySelector('#engines');
const selectElements = document.querySelector('.select-options');
let engineList = [];
const secretApiKey = process.env.OPENAI_SECRET;

var url = 'https://api.openai.com/v1/engines';

var xhr = new XMLHttpRequest();
xhr.open('GET', url);

xhr.setRequestHeader('Accept', 'application/json');
xhr.setRequestHeader(
	'Authorization',
	// 'Bearer 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',
	`Bearer ${secretApiKey}`,
);

xhr.onreadystatechange = function () {
	if (xhr.readyState === 4) {
		// console.log(xhr.status);
		// console.log(xhr.responseText);
		var resp = JSON.parse(xhr.responseText);
		engineListElement.removeChild(engineListElement.firstElementChild);

		engineList = resp.data;
		console.log(engineList);
		for (let i = 0; i < engineList.length; i++) {
			engineListElement.insertAdjacentHTML(
				'beforeend',
				`  <option class="select-option" value="${engineList[i].id}">${engineList[i].id}</option>
				`,
			);
		}
	}
};

xhr.send();

form.addEventListener('submit', function (event) {
	event.preventDefault();

	var xhttp = new XMLHttpRequest();
	xhttp.open(
		'POST',
		// 'https://api.openai.com/v1/engines/text-curie-001/completions',
		`https://api.openai.com/v1/engines/${engineListElement.value}/completions`,
		true,
	);
	xhttp.setRequestHeader('Content-Type', 'application/json');
	xhttp.setRequestHeader(
		'Authorization',
		// 'Bearer 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',
		`Bearer ${secretApiKey}`,
	);
	xhttp.onreadystatechange = function () {
		if (this.readyState == 4 && this.status == 200) {
			var response = this.responseText;
			var resp = JSON.parse(response);
			responseContainer.insertAdjacentHTML(
				'afterbegin',
				` <div class="response-inner-container">
                <div>
                    <div>Prompt: ${promptElement.value}</div>
                </div>
                <div>
                    <div>Response: ${resp.choices[0].text}</div>
                </div>
    
            </div>`,
			);
			console.log(resp.choices[0].text);
			console.log(promptElement);
		}
	};
	const data = {
		prompt: promptElement.value,
		temperature: 0.5,
		max_tokens: 64,
		top_p: 1.0,
		frequency_penalty: 0.0,
		presence_penalty: 0.0,
	};

	xhttp.send(JSON.stringify(data));
	console.log(promptElement.value);
});
