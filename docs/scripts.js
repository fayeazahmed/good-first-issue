const FORM = document.querySelector(".searchform");
const INPUT = document.querySelector(".searchform input");
const LOADER = document.querySelector(".loader");
const LOADER_FORM = document.querySelector(".searchform__loader");
const SPINNER = document.querySelector(".searchform__spinner");
const BTN = document.querySelector(".searchform button");
const RESULTS = document.querySelector(".results");
const INFO = document.querySelector(".info")
const INFO_BTN = document.querySelector("nav button")
let INFO_OPEN = false

async function search(e) {
	e.preventDefault();
	const query = INPUT.value;
	if (query !== "") {
		toggleInfo()
		INFO_OPEN = false
		RESULTS.innerHTML = "";
		LOADER.style.display = "block";
		INPUT.disabled = true;
		INPUT.value = "";
		LOADER_FORM.style.display = "block";
		SPINNER.style.display = "block";
		BTN.disabled = true;
		for (let i = 1; i <= 5; i++) {
			let { data } = await axios.get(
				`https://first-issue-finder.herokuapp.com/search/${i}/${query}`
			);
			LOADER_FORM.style.width = `${i * 20}%`;
			appendResult(data);
		}
		LOADER_FORM.style.width = "0%";
		LOADER.style.display = "none";
		LOADER_FORM.style.display = "none";
		SPINNER.style.display = "none";
		INPUT.disabled = false;
		BTN.disabled = false;
	}
}

function toggleInfo() {
	if(INFO_OPEN) {
		INFO.style.display = "none"
		RESULTS.style.display = "block"
		INFO_BTN.classList.remove("btn-dark")
		INFO_BTN.classList.add("btn-outline-dark")
		return
	}
	RESULTS.style.display = "none"
	INFO.style.display = "block"
	INFO_BTN.classList.remove("btn-outline-dark")
	INFO_BTN.classList.add("btn-dark")
}

FORM.addEventListener("submit", search);

INFO_BTN.addEventListener("click", () => {
	if(INFO_OPEN) {
		toggleInfo()
		INFO_OPEN = false
		return
	}
	toggleInfo()
	INFO_OPEN = true
})

function appendResult(resultSet) {
	resultSet.forEach(({ name, stars, description, goodFirstIssues }) => {
		const result = document.createElement("div");
		result.classList.add("result");
		result.innerHTML += `
				<div class="d-flex align-items-center">
					<a class="result__reponame" href="https://github.com/${name}">
						<h3>${name}</h3>
					</a>
					<p class="result__repostars">${stars}</p>
					<i class="fa fa-star-o" aria-hidden="true"></i>
				</div>
				<p class="result__repodesc">
					${description}
				</p>`;

		const issues = document.createElement("div");
		issues.classList.add("issues");
		issues.innerHTML += `<h5 class="issues__header">Good first issues: ${goodFirstIssues.length}</h5>`;

		const ul = document.createElement("ul");
		ul.classList.add("issues__list");
		goodFirstIssues.forEach(({ description, issueOpen, link }) => {
			const a = document.createElement("a");
			a.href = `https://github.com${link}`;
			a.innerHTML += `
					<li>
						<p>
							${description}
							<i class="fa fa-external-link" aria-hidden="true"></i>
						</p>
						<span>${issueOpen}</span>
					</li>`;
			ul.appendChild(a);
		});
		issues.appendChild(ul);
		result.appendChild(issues);
		RESULTS.appendChild(result);
	});
}
