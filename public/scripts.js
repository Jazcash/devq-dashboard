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

        if (issue.due_date !== null){
            issue.due_date = new Date(parseInt(issue.due_date.substring(6, 19)));
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

    console.log(inProgressIssues);

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

    let issueBadgeEl = document.createElement("div");
    if (issue.due_date){
        issueBadgeEl.className = "duedate";
        let duedays = Math.round((issue.due_date - new Date()) / (1000*60*60*24));
        let suffix = (duedays > 0) ? " days until due" : " days overdue";
        issueBadgeEl.textContent = Math.abs(duedays) + suffix;
    }

    let issuePriorityEl = document.createElement("div");
    switch(issue.priority.name){
        case "Low": issuePriorityEl.className = "priority low"; break;
        case "Medium": issuePriorityEl.className = "priority medium"; break;
        case "High": issuePriorityEl.className = "priority high"; break;
        case "Critical": issuePriorityEl.className = "priority critical"; break;
    }

    let issueProjectEl = document.createElement("div");
    issueProjectEl.className = "project";
    issueProjectEl.textContent = issue.project.name.split("Dev Queue - ")[1];

    let issueTitleEl = document.createElement("div");
    issueTitleEl.className = "title";
    issueTitleEl.textContent = issue.title;

    innerIssueEl.appendChild(issuePriorityEl);
    innerIssueEl.appendChild(issueProjectEl);
    innerIssueEl.appendChild(issueTitleEl);
    innerIssueEl.appendChild(issueBadgeEl);
    issueEl.appendChild(innerIssueEl);

    return issueEl;
}