let cardID
let name = '';
let filter;
let tags = [];
let data = {}

const formProjectID = window.document.getElementById('project-id');
const formName = window.document.getElementById('name');
const formGithub = window.document.getElementById('github');
const formDemo = window.document.getElementById('demo');
const formImg = window.document.getElementById('img');
const formDate = window.document.getElementById('date');
const formTeam = window.document.getElementById('team');
const formScore = window.document.getElementById('score');


async function getFormDate() {
    data = {
        "name": formName.value,
        "github": formGithub.value,
        "demo": formDemo.value,
        "img": formImg.value,
        "date": formDate.value,
        "team": formTeam.value,
        "score": formScore.value
    }
    cardID = formProjectID.value
}

async function fetchCards(type) {
    await getFormDate()
    let response;
    if (type === "PUT") {
        response = await fetch(`http://127.0.0.1:8000/update/${cardID}`);
    }
    if (type === "DELETE") {
        response = await fetch(`http://127.0.0.1:8000/delete/${cardID}`);
    }
    if (type === "POST") {
        response = await fetch(`http://127.0.0.1:8000/add`);
    }
    if (type === "GET") {
        response = await fetch(`http://127.0.0.1:8000/get/${cardID}`);
    }
    alert(response.status)
    return response
}

async function clear() {
    formProjectID.value = ""
    formName.value = ""
    formGithub.value = ""
    formDemo.value = ""
    formImg.value = ""
    formDate.value = ""
    formTeam.value = ""
    formScore.value = ""
}

const btnGet = window.document.getElementById('form-get-btn');
const btnPost = window.document.getElementById('form-send-btn');
const btnPut = window.document.getElementById('form-update-btn');
const btnDelete = window.document.getElementById('form-delete-btn');
const btnClear = window.document.getElementById('form-clear-btn');

btnGet.onclick = function () {
    fetchCards("GET").then( response => {
        console.log(response)
    })
}

btnPost.onclick = function () {
    fetchCards("POST").then()
}

btnPut.onclick = function () {
    fetchCards("PUT").then()
}

btnDelete.onclick = function () {
    fetchCards("DELETE").then()
}

btnClear.onclick = function () {
    clear().then()
}