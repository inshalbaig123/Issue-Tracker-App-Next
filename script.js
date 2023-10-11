// function that checks if there are issues in the local storage when page loads
(function startLocalStorage() {
    if(localStorage.getItem("issues") !== null) {
        // if user realoads page and there are some issues stored in local storage this function will display them again on the page
        displayAllIssues();
    } else {
        // if on page load there is nothing in local storage this will create an array that will store future issues
        // issues are being storred as objects inside of the array
        localStorage.setItem("issues", JSON.stringify([]));
    }
})();

// description, assignedTo and severity input fields
const description = document.querySelector(".description");
const assignedTo = document.querySelector(".assigned");
const severity = document.querySelector(".severity-range");

// selecting submit button
const submit = document.querySelector(".input-button");
// adding event listener on submit button that adds the issue
submit.addEventListener("click", displayIssue);

// function that gathers all the info for creating issue object
// its being called inside of displayIssue funciton that is being invoked when user presses Submit button
function createIssue() {
    // warn signs for description and assignedTo input fields
    const warnDescription = document.querySelector(".warn-description");
    const warnAssignedTo = document.querySelector(".warn-assignedTo");

    // creating random id for each issue added
    const issueId = Math.round(Math.random() * 1000000) + "-" + Math.round(Math.random() * 1000000);

    // creating object that will store info about a single issue
    let issue = {
        id: issueId,
        isOpen: "Open"
    };

    // making warn signs invisible - like a reset before the next check
    warnDescription.style.visibility = "hidden";
    warnAssignedTo.style.visibility = "hidden";

    // if there is no value inside of description or assingedTo input fields the function will return, issue will not be created and user will have to fill all the fields
    if(description.value === "" && assignedTo.value === "") {
        warnDescription.style.visibility = "visible";
        warnAssignedTo.style.visibility = "visible";
        return false;        
    } else if(description.value === "") {
        warnDescription.style.visibility = "visible";
        return false;
    } else if(assignedTo.value === "") {
        warnAssignedTo.style.visibility = "visible";
        return false;
    }

    // hidding warn signs again after all the input has been filled
    warnDescription.style.visibility = "hidden";
    warnAssignedTo.style.visibility = "hidden";

    // if all the input fields have necessary data it is being stored in "issue" object
    issue.description = description.value;
    issue.assignedTo = assignedTo.value;

    // storing severity based on range input
    if(severity.value === "0") {
        issue.severity = "Low";
    } else if(severity.value === "1") {
        issue.severity = "Medium";
    } else {
        issue.severity = "High";
    }

    // returning created issue
    return issue;
}

// function that displays info about the issue
function displayIssue() {
    // getting issue object form creatIssue function
    const issue = createIssue();

    // checking if issue was properly created
    if(!issue) {
        // if not, function returns and user has to add necessary info
        return;
    }

    // arr "issues" is called from the local storage so issue can be added to it
    // this way data is saved and later used from local storage
    let issueArr = JSON.parse(localStorage.getItem("issues"));
    // issue(object) is added to the array
    issueArr.push(issue);
    // array is being then being returned to the local storage as a string
    localStorage.setItem("issues", JSON.stringify(issueArr));

    // selecting div that will display all the issues
    const issuesDisplayDiv = document.querySelector(".issues");

    // creating "HTML like" string with string templates that will display all our data from the issue object
    const htmlString = `
    <div class="issue">
        <div class="issue-id-open">
            <div class="issue-id">
                <p>Issue ID: </p>
                <p>${issue.id}</p>
            </div>
            <p class="issue-open">${issue.isOpen}</p>
        </div>

        <div class="issue-main">
            <h1 class="issue-description">${issue.description}</h1>
            <div class="issue-severity">
                <img src="images/clock.png">
                <p>${issue.severity}</p>
            </div>
            <div class="issue-assignedTo">
                <img src="images/avatars/avatar.png">
                <p>${issue.assignedTo}</p>
            </div>
        </div>
        
        <div class="issue-buttons">
            <div class="issue-button-close">Close</div>
            <div class="issue-button-delete">Delete</div>
        </div>
    </div>`;

    // placing the issue on the page by creating an "issue card" from previously formed "HTML like" string
    issuesDisplayDiv.insertAdjacentHTML("afterbegin", htmlString);

    // selecting "delete" button and giving it "deleteIssue" function
    const deleteButton = document.querySelector(".issue-button-delete");
    deleteButton.addEventListener("click", deleteIssue);

    // selecting "close" button and giving it "closeIssue" function
    const closeButton = document.querySelector(".issue-button-close");
    closeButton.addEventListener("click", closeIssue);

    // removing all the info from input fields - reseting them
    description.value = "";
    assignedTo.value = "";
    severity.value = 0;
    
}

// function that is called if there is issue data in the local storage
// used on page reload to check if some data have been saved to the local storage and then placing it again on the page inside of the "issues" div
function displayAllIssues() {
    // selecting issues div that holds issues
    const issuesDisplayDiv = document.querySelector(".issues");
    // parsing the info from local storage and storing it inside of issuesArr variable - array with objects as values
    const issuesArr = JSON.parse(localStorage.getItem("issues"));

    // going trough array and displaying info for every single object - displaying issues one by one
    for(let i = 0; i < issuesArr.length; i++) {

        const htmlString = `
        <div class="issue">
            <div class="issue-id-open">
                <div class="issue-id">
                    <p>Issue ID: </p>
                    <p>${issuesArr[i].id}</p>
                </div>
                <p class="issue-open">${issuesArr[i].isOpen}</p>
            </div>
    
            <div class="issue-main">
                <h1 class="issue-description">${issuesArr[i].description}</h1>
                <div class="issue-severity">
                    <img src="images/clock.png">
                    <p>${issuesArr[i].severity}</p>
                </div>
                <div class="issue-assignedTo">
                    <img src="images/avatars/avatar.png">
                    <p>${issuesArr[i].assignedTo}</p>
                </div>
            </div>
            
            <div class="issue-buttons">
                <div class="issue-button-close">Close</div>
                <div class="issue-button-delete">Delete</div>
            </div>
        </div>`;

        // displaying issue on the page
        issuesDisplayDiv.insertAdjacentHTML("afterbegin", htmlString);

        // selecting "delete" and "close" buttons again and giving them event listeners for deleting or clsoing the issue
        const deleteButtons = document.querySelectorAll(".issue-button-delete");
        const closeButtons = document.querySelectorAll(".issue-button-close");

        for(let i = 0; i < deleteButtons.length; i++) {
            deleteButtons[i].addEventListener("click", deleteIssue);
            closeButtons[i].addEventListener("click", closeIssue);
        }
    }
}

// function that deletes the issue
// function is being called on "delete" button press
function deleteIssue(e) {
    // targeting the issue ID on which "delete" button user pressed
    // soo we know which issue to delete
    const deletedIssueId = e.target.parentNode.parentNode.children[0].children[0].children[1].innerHTML;

    // parsing issues arr from local storage to do the search and remove the issue that is not wanted
    let issuesArr = JSON.parse(localStorage.getItem("issues"));

    // going trough array and finding the ID that matches the one on clicked issue
    // matching ID from clicked issue and issues in local storage
    // when match is found issue is being deleted on that index number
    // issue is now only being deleted from the local storage 
    for(let i = 0; i < issuesArr.length; i++) {
        if(issuesArr[i].id === deletedIssueId) {
            issuesArr.splice(i,1);
            break;
        }
    }

    // new and updated issues array is again being stored in local storage
    localStorage.setItem("issues", JSON.stringify(issuesArr));
    // issue on which user clicked is now being removed from the page
    e.target.parentNode.parentNode.remove();
}

// function that regulates if the issue is "open" or "closed"
function closeIssue(e) {
    // selecting the element that holds "open" value
    let issueOpen = e.target.parentNode.parentNode.children[0].children[1];
    // selecting ID from the clicked issue
    const closedIssueID = e.target.parentNode.parentNode.children[0].children[0].children[1].innerHTML;

    // changing value of the issue on the page
    issueOpen.innerHTML = "Closed";

    // parsing issues array form the local storage to update clicked issue
    let issuesArr = JSON.parse(localStorage.getItem("issues"));

    // finding the clicked issue and changing the value from "open" to "closed" in the array that is being storred in local storage
    for(let i = 0; i < issuesArr.length; i++) {
        if(issuesArr[i].id === closedIssueID) {
            issuesArr[i].isOpen = "Closed";
            break;
        }
    }

    // uploading newly updated issues array back to the local storage
    localStorage.setItem("issues", JSON.stringify(issuesArr));
}
