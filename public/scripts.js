// colors: https://flatuicolors.com/

let socket = io();

let backlogEl = document.getElementById("backlog");
let unassignedEl = document.getElementById("unassigned");
let inprogressEl = document.getElementById("inprogress");
let retestEl = document.getElementById("retest");
let withclientEl = document.getElementById("withclient");
let goliveEl = document.getElementById("golive");

let infoBarEl = document.getElementById("info-bar");

let config = {};
let devNames = [];

socket.on("init", function(data){
	config = data.config;
	devNames = config.people.devs;
	renderIssues(data.issues);
	setupInfoBar();
});

socket.on("issues", function(issues){
	renderIssues(issues);
});

function renderIssues(issues){
	let backlogFrag = document.createDocumentFragment();
	let unassignedFrag = document.createDocumentFragment();
	let inprogressFrag = document.createDocumentFragment();
	let retestFrag = document.createDocumentFragment();
	let withclientFrag = document.createDocumentFragment();
	let goliveFrag = document.createDocumentFragment();

	let backlogCount = 0;
	let inProgressIssues = [];

	issues = issues.sort(function(a, b){
		return a.project.name.localeCompare(b.project.name);
	});

	for(let i=0; i<issues.length; i++){
		let issue = issues[i];

		let colour = config.colours[devNames.indexOf(issue.fixer.name)];
		if (colour !== undefined){
			issue.colour = colour;
		}

		issue.created_on = new Date(parseInt(issue.created_on.substring(6, 19)));

		switch(issue.status.name){
			case "On Hold":
				if (backlogCount < 20){
					backlogFrag.appendChild(createIssueEl(issue));
					backlogCount++;
				}
				break;
			case "Open":
				if (devNames.indexOf(issue.fixer.name) !== -1){
					inProgressIssues.push(issue);
				} else if(issue.fixer.name === "Quba unassigned"){
					unassignedFrag.appendChild(createIssueEl(issue));
				} else if (issue.fixer.name === "Quba with client"){
					withclientFrag.appendChild(createIssueEl(issue));
				}
				break;
			case "Ready for Retest":
				retestFrag.appendChild(createIssueEl(issue));
				break;
			case "Ready for Next Release":
				goliveFrag.appendChild(createIssueEl(issue));
		}
	}

	inProgressIssues = inProgressIssues.sort(function(a, b){
		return a.fixer.name.localeCompare(b.fixer.name);
	});

	for (let i=0; i<inProgressIssues.length; ++i){
		inprogressFrag.appendChild(createIssueEl(inProgressIssues[i]));
	}

	updateList(backlogEl, backlogFrag);
	updateList(unassignedEl, unassignedFrag);
	updateList(inprogressEl, inprogressFrag);
	updateList(retestEl, retestFrag);
	updateList(withclientEl, withclientFrag);
	updateList(goliveEl, goliveFrag);

	console.log(issues);
}

function updateList(el, frag){
	while (el.firstChild){
		el.removeChild(el.firstChild);
	}
	el.appendChild(frag);
}

function createIssueEl(issue){
	let issueEl = document.createElement("a");
	issueEl.className = "issue";
	issueEl.href = `https://${config.subdomain}.mydonedone.com/issuetracker/projects/${issue.project.id}/issues/${issue.order_number}`;
	issueEl.setAttribute('target', '_blank');

	let innerIssueEl = document.createElement("div");
	innerIssueEl.className = "issue-inner";
	if (issue.colour)
		innerIssueEl.style = `background-color: ${issue.colour.bg}; color: ${issue.colour.fg}`;

	let issueDateEl = document.createElement("div");
	issueDateEl.className = "date";
	let days = Math.round((new Date() - issue.created_on) / (1000*60*60*24));
	let suffix = (days === 1) ? "day" : "days";
	issueDateEl.textContent = `Raised ${days} ${suffix} ago`;

	let issueProjectEl = document.createElement("div");
	issueProjectEl.className = "project";
	issueProjectEl.textContent = issue.project.name.split("Dev Queue - ")[1];

	let issueTitleEl = document.createElement("div");
	issueTitleEl.className = "title";
	issueTitleEl.textContent = issue.title;

	innerIssueEl.appendChild(issueProjectEl);
	innerIssueEl.appendChild(issueTitleEl);
	innerIssueEl.appendChild(issueDateEl);
	issueEl.appendChild(innerIssueEl);

	return issueEl;
}

function setupInfoBar(){
	let infoBarFrag = document.createDocumentFragment();

	for (let i=0; i<devNames.length; ++i){
		let dev = devNames[i];
		let colour = config.colours[i];

		let fixerKeyEl = document.createElement("div");
		fixerKeyEl.className = "fixer-key";

		let fixerColourEl = document.createElement("div");
		fixerColourEl.className = "fixer-colour";
		fixerColourEl.style = `background-color: ${colour.bg}`;

		let fixerNameEl = document.createElement("div");
		fixerNameEl.className = "fixer-name";
		fixerNameEl.textContent = dev;

		fixerKeyEl.appendChild(fixerColourEl);
		fixerKeyEl.appendChild(fixerNameEl);

		infoBarFrag.appendChild(fixerKeyEl);
	}

	while (infoBarEl.firstChild){
		infoBarEl.removeChild(infoBarEl.firstChild);
	}
	
	infoBarEl.appendChild(infoBarFrag);
}