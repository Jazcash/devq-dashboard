let socket = io();

let backlogEl = document.getElementById("backlog");
let unassignedEl = document.getElementById("unassigned");
let inprogressEl = document.getElementById("inprogress");
let retestEl = document.getElementById("retest");
let withclientEl = document.getElementById("withclient");
let goliveEl = document.getElementById("golive");

let config = {};
let devNames = [];

socket.on("init", function(data){
    config = data.config;
    devNames = config.people.devs;
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
    let retestFrag = document.createDocumentFragment();
    let withclientFrag = document.createDocumentFragment();
    let goliveFrag = document.createDocumentFragment();

    let backlogCount = 0;

    for(let i=0; i<issues.length; i++){
        let issue = issues[i];
        let colour = config.colours[devNames.indexOf(issue.fixer.name)];
        if (colour !== undefined){
            issue.colour = colour.bg;
        }
        switch(issue.status.name){
            case "On Hold":
                if (backlogCount < 20){
                    backlogFrag.appendChild(createIssueEl(issue));
                    backlogCount++;
                }
                break;
            case "Open":
                if (devNames.indexOf(issue.fixer.name) !== -1){
                    inprogressFrag.appendChild(createIssueEl(issue));
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

    updateList(backlogEl, backlogFrag);
    updateList(unassignedEl, unassignedFrag);
    updateList(inprogressEl, inprogressFrag);
    updateList(retestEl, retestFrag);
    updateList(withclientEl, withclientFrag);
    updateList(goliveEl, goliveFrag);
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
    innerIssueEl.style = `background-color: ${issue.colour}`;

    let issueProjectEl = document.createElement("div");
    issueProjectEl.className = "project";
    issueProjectEl.textContent = issue.project.name.split("Dev Queue - ")[1];

    let issueTitleEl = document.createElement("div");
    issueTitleEl.className = "title";
    issueTitleEl.textContent = issue.title;

    innerIssueEl.appendChild(issueProjectEl);
    innerIssueEl.appendChild(issueTitleEl);
    issueEl.appendChild(innerIssueEl);

    return issueEl;
}