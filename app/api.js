let cardID
let data = {}

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

function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) === 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}


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
    const apikey = getCookie("apikey");
    let response = "";

    // fetch api
    if (apikey !== "") {

        // UPDATE
        if (type === "PUT") {
            response = await fetch(`http://127.0.0.1:8000/update/${cardID}`, {
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
        if (type === "DELETE") {
            response = await fetch(`http://127.0.0.1:8000/delete/${cardID}`, {
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
        if (type === "POST") {
            response = await fetch(`http://127.0.0.1:8000/add`, {
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
        response = await fetch(`http://127.0.0.1:8000/get/${cardID}`);
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