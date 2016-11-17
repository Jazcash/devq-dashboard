let socket = io();

let backlogEl = document.getElementById("backlog");
let unassignedEl = document.getElementById("unassigned");
let inprogressEl = document.getElementById("inprogress");
let onuatEl = document.getElementById("onuat");
let withclientEl = document.getElementById("withclient");
let goliveEl = document.getElementById("golive");

let config = {};
let devNames = [];

socket.on("init", function(data){
    config = data.config;
    devNames = config.devs.map((dev) => dev.name);
    renderIssues(data.issues);
});

socket.on("issues", function(issues){
    renderIssues(issues);
});

function renderIssues(issues){
    console.log(issues);

    let backlogFrag = document.createDocumentFragment();
    let unassignedFrag = document.createDocumentFragment();
    let inprogressFrag = document.createDocumentFragment();
    let onuatFrag = document.createDocumentFragment();
    let withclientFrag = document.createDocumentFragment();
    let goliveFrag = document.createDocumentFragment();

    for(let i=0; i<issues.length; i++){
        let issue = issues[i];
        switch(issue.status.name){
            case "On Hold":
                backlogFrag.appendChild(createIssueEl(issue));
                break;
            case "Open":
                if (devNames.indexOf(issue.fixer.name) !== -1){
                    let colour = config.devs[devNames.indexOf(issue.fixer.name)].colour;
                    inprogressFrag.appendChild(createIssueEl(issue, colour));
                } else if(issue.fixer.name === "Unassigned Dev"){
                    unassignedFrag.appendChild(createIssueEl(issue));
                } else {
                    onuatFrag.appendChild(createIssueEl(issue));
                }
                break;
            case "Ready for Retest":
                withclientFrag.appendChild(createIssueEl(issue));
                break;
            case "Ready for Next Release":
                goliveFrag.appendChild(createIssueEl(issue));
        }
    }

    updateList(backlogEl, backlogFrag);
    updateList(unassignedEl, unassignedFrag);
    updateList(inprogressEl, inprogressFrag);
    updateList(onuatEl, onuatFrag);
    updateList(withclientEl, withclientFrag);
    updateList(goliveEl, goliveFrag);
}

function updateList(el, frag){
    while (el.firstChild){
        el.removeChild(el.firstChild);
    }
    el.appendChild(frag);
}

function createIssueEl(issue, colour){
    let issueEl = document.createElement("a");
    issueEl.className = "issue";
    issueEl.href = `https://${config.subdomain}.mydonedone.com/issuetracker/projects/${issue.project.id}/issues/${issue.order_number}`;
    issueEl.setAttribute('target', '_blank');

    let innerIssueEl = document.createElement("div");
    innerIssueEl.className = "issue-inner";
    innerIssueEl.style = `background-color: ${colour}`;

    let issueProjectEl = document.createElement("div");
    issueProjectEl.className = "project";
    issueProjectEl.textContent = issue.project.name;

    let issueTitleEl = document.createElement("div");
    issueTitleEl.className = "title";
    issueTitleEl.textContent = issue.title;

    innerIssueEl.appendChild(issueProjectEl);
    innerIssueEl.appendChild(issueTitleEl);
    issueEl.appendChild(innerIssueEl);

    return issueEl;
}