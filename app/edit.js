let cardID
let data = {}

let apikey = null;

const formProjectID = window.document.getElementById('project-id');
const formName = window.document.getElementById('name');
const formGithub = window.document.getElementById('github');
const formDemo = window.document.getElementById('demo');
const formImg = window.document.getElementById('img');
const formDate = window.document.getElementById('date');
const formTeam = window.document.getElementById('team');
const formScore = window.document.getElementById('score');
const formTags = window.document.getElementById('tags');


function setCookie(cname, cvalue, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    let expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

const getCookieValue = (name) => (
    document.cookie.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)')?.pop() || ''
)


async function getFormDate() {
    data = {
        "name": formName.value,
        "github": formGithub.value,
        "demo": formDemo.value,
        "img": formImg.value,
        "date": formDate.value,
        "team": formTeam.value,
        "tags": formTags.value,
        "score": formScore.value
    }
    cardID = formProjectID.value
}

async function fetchCards(type) {
    await getFormDate()

    let response = "";

    // fetch api
    if (type !== "GET") {

        if (apikey === null) {
            apikey = window.prompt("apikey", "Insert API key here");
        }

        // UPDATE
        if (type === "PUT" && apikey !== null) {
            response = await fetch(`${location.protocol + '//' + location.host}/api/update/${cardID}`, {
                method: 'PUT',
                mode: 'cors',
                cache: 'no-cache',
                headers: {
                    'Content-Type': 'application/json',
                    'apikey': apikey
                },
                body: JSON.stringify(data)
            });
        }
        // DELETE
        if (type === "DELETE" && apikey !== null) {
            response = await fetch(`${location.protocol + '//' + location.host}/api/delete/${cardID}`, {
                method: 'DELETE',
                mode: 'cors',
                cache: 'no-cache',
                headers: {
                    'apikey': apikey
                },
                body: JSON.stringify(data)
            });
        }
        // ADD
        if (type === "POST" && apikey !== null) {
            response = await fetch(`${location.protocol + '//' + location.host}/api/add`, {
                method: 'POST',
                mode: 'cors',
                cache: 'no-cache',
                headers: {
                    'Content-Type': 'application/json',
                    'apikey': apikey
                },
                body: JSON.stringify(data)
            });
        }
    }

    // GET
    if (type === "GET") {
        response = await fetch(`${location.protocol + '//' + location.host}/api/get/${cardID}`);
    }

    // Notify response status
    if (response.status === undefined) {
        alert("You are not authorized of modifying content.")
    } else {
        if (response.status === 200 || response.status === 201 || response.status === 302) {
            alert(`Success: ${response.status}`)
        } else {
            alert(`Error: ${response.status}`)
        }
    }
    return response
}

// Clear input fields
async function clear() {
    formProjectID.value = ""
    formName.value = ""
    formGithub.value = ""
    formDemo.value = ""
    formImg.value = ""
    formDate.value = ""
    formTeam.value = ""
    formTags.value = ""
    formScore.value = ""
}

const btnGet = window.document.getElementById('form-get-btn');
const btnPost = window.document.getElementById('form-send-btn');
const btnPut = window.document.getElementById('form-update-btn');
const btnDelete = window.document.getElementById('form-delete-btn');
const btnClear = window.document.getElementById('form-clear-btn');

btnGet.onclick = function () {
    if (formProjectID.value !== "") {
        fetchCards("GET").then(response => {

            if (response.status === 200) {
                response.json().then(e => {
                    formProjectID.value = e.id
                    formName.value = e.name
                    formGithub.value = e.github_url
                    formDemo.value = e.demo_url
                    formImg.value = e.cover_img
                    formDate.value = e.created
                    formTeam.value = e.team
                    const _tags = []
                    e.tags.forEach(tag => {
                        _tags.push(tag.label)
                    })
                    formTags.value = _tags.join(", ")
                    formScore.value = e.score
                })
            }
        })
    } else {
        formProjectID.focus()
        alert("Required field(s) missing.")
    }
}

btnPost.onclick = function () {
    if (formName.value !== "") {
        fetchCards("POST").then()
    } else {
        formName.focus()
        alert("Required field(s) missing.")
    }
}

btnPut.onclick = function () {
    if (formProjectID.value !== "") {
        fetchCards("PUT").then()

    } else {
        formProjectID.focus()
        alert("Required field(s) missing.")
    }
}

btnDelete.onclick = function () {
    if (formProjectID.value !== "") {
        fetchCards("DELETE").then()
    } else {
        formProjectID.focus()
        alert("Required field(s) missing.")
    }
}

btnClear.onclick = function () {
    clear().then()
}