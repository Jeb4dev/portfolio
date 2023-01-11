let cards;
let name = '';
let filter;
let tags = [];


async function fetchCards() {
    let response = await fetch(`http://127.0.0.1:8000/`);
    return await response.json()
}

async function sort(type) {
    const sortMethods = {
        "name-az": (a, b) => a.name.localeCompare(b.name),
        "name-za": (a, b) => b.name.localeCompare(a.name),
        "date-new": (a, b) => a.created < b.created,
        "date-old": (a, b) => b.created < a.created,
        "featured": (a, b) => b.score > a.score
    }
    cards.sort(sortMethods[type]);
}

function buildCard(card, index) {
    // card container
    const elem = document.createElement('div');
    elem.id = `card-${index}`;
    elem.classList.add('wide');
    elem.classList.add('card');
    cardContainer.appendChild(elem)


    //////////////////////
    // card img container
    const img_container = document.createElement('div');
    img_container.classList.add('blurring');
    img_container.classList.add('dimmable');
    img_container.classList.add('image');
    elem.appendChild(img_container)

    // card img dimmer
    const img_container_dimmer = document.createElement('div');
    img_container_dimmer.classList.add('ui');
    img_container_dimmer.classList.add('dimmer');
    img_container_dimmer.classList.add('transition');
    img_container_dimmer.classList.add('hidden');
    img_container.appendChild(img_container_dimmer);

    // card img dimmer content
    const dimmer_content = document.createElement('div');
    dimmer_content.classList.add('content')
    img_container_dimmer.appendChild(dimmer_content)

    // card img dimmer content center
    const dimmer_div = document.createElement('div');
    dimmer_div.classList.add('center')
    dimmer_content.appendChild(dimmer_div)

    // card img dimmer content center demo
    if (card.demo_url) {
        const dimmer_a_demo = document.createElement('a');
        dimmer_a_demo.classList.add('ui')
        dimmer_a_demo.classList.add('inverted')
        dimmer_a_demo.classList.add('button')
        dimmer_a_demo.href = card.demo_url
        dimmer_a_demo.target = '_blank'
        dimmer_a_demo.textContent = 'View Demo'
        dimmer_div.appendChild(dimmer_a_demo)
    }

    // card img dimmer content center sourcecode
    if (card.github_url) {
        const dimmer_a_src = document.createElement('a');
        dimmer_a_src.classList.add('ui')
        dimmer_a_src.classList.add('inverted')
        dimmer_a_src.classList.add('button')
        dimmer_a_src.href = card.github_url
        dimmer_a_src.target = '_blank'
        dimmer_a_src.textContent = 'Source Code'
        dimmer_div.appendChild(dimmer_a_src)
    }

    // card img img
    const img = document.createElement('img');
    img.src = card.cover_img;
    img.alt = 'Project Image';
    // img.style = 'object-fit:cover; height: 15em;';
    img_container.appendChild(img);


    /////////////////
    // card content
    const content = document.createElement('div');
    content.classList.add('content');
    elem.appendChild(content)

    // card content right
    const content_span = document.createElement('span');
    content_span.classList.add('right');
    content_span.classList.add('floated');
    content.appendChild(content_span);

    // card content right group
    const content_i = document.createElement('i');
    content_span.appendChild(content_i);

    // card content right team solo
    if (card.team) {
        content_i.classList.add('users');
        content_i.title = 'Group Project';
    }
    // card content right team group
    else {
        content_i.classList.add('user');
        content_i.title = 'Solo Project';
    }

    content_i.classList.add('icon');


    // card content name
    const content_p = document.createElement('p');
    content_p.classList.add('header');
    content_p.classList.add('left');
    content_p.classList.add('aligned');
    content_p.textContent = card.name;
    content.appendChild(content_p)

    // card content date
    const content_div = document.createElement('div');
    content_div.textContent = 'Created in '
    content.appendChild(content_div)

    // card content date span
    const content_span_time = document.createElement('span');
    content_span_time.classList.add('date');
    content_div.appendChild(content_span_time)
    content_div.classList.add('meta');
    content_div.classList.add('left');
    content_div.classList.add('aligned');
    let date = new Date(card.created);
    const month = date.toLocaleString('default', {month: 'long'});
    const year = date.getFullYear();
    content_span_time.textContent = `${month} ${year}`;


    //////////////
    // card extra
    const extraContent = document.createElement('div');
    extraContent.classList.add('extra')
    extraContent.classList.add('content')
    elem.appendChild(extraContent)

    // card extra floated
    const extraContentFloated = document.createElement('div');
    extraContentFloated.classList.add('floated')
    extraContent.appendChild(extraContentFloated)

    // card extra floated tags
    card.tags.forEach(tag => {
        const tag_elem = document.createElement('div');
        tag_elem.classList.add('tags');
        tag_elem.classList.add(tag.label);
        tag_elem.onclick = function () {
            ToggleTag(tag.label)
        };
        tag_elem.textContent = tag.label;
        extraContentFloated.appendChild(tag_elem);
    })

}

async function buildCards(reload) {

    ///////////////
    // Empty cards
    const cardContainer = document.getElementById('cardContainer');
    cardContainer.innerHTML = ''

    // Create Getting Cards <p>
    const p = document.createElement('p');
    p.textContent = 'Getting Cards...'
    cardContainer.appendChild(p)

    // Fetch data from api
    if (reload) {
        cards = await fetchCards();
    }

    await sort(filter)

    if (cards) {
        p.style = 'display:none;'
        let index = 0;

        // create each card
        cards.forEach(card => {

            let show = true

            // filter name
            if (name) {
                if (!card.name.toLowerCase().includes(name.toLowerCase())) {
                    show = false;
                }
            }

            // filter tags
            if (tags.length > 0) {
                tags.forEach(tag => {
                    if (tag != null) {
                        if (show) {
                            show = false
                            card.tags.forEach(cardTag => {
                                if (cardTag.label === tag) {
                                    show = true
                                }
                            })
                        }
                    }
                })
            }

            // filter tag

            if (show) {
                buildCard(card, index++)
            }

        })
    } else {
        p.style = 'display:block;'
        p.textContent = "No data was found."
    }

    // init dimmer
    $('.cards .image').dimmer({
        on: 'hover'
    });
}

async function search() {
    await buildCards(false)
    colorTags()
}

async function clear() {
    inputName.value = ''
    name = ''
    tags = []
    await search()
    colorTags()
}

async function ToggleTag(tag) {
    let found = false

    for (let i = 0; i < tags.length; i++) {
        if (tags[i] === tag) {
            tags[i] = null
            found = true
            removeClass(tag, "selected")
        }
    }

    if (!found) {
        tags.push(tag);
        addClass(tag, "selected")
    }

    await search()

}

function addClass(tag, _class) {
    const elements = document.getElementsByClassName(`tags ${tag}`)
    for (let i = 0; i < elements.length; i++) {
        elements[i].classList.add(_class)
    }
}

function removeClass(tag, _class) {
    const elements = document.getElementsByClassName(`tags ${tag}`)
    for (let i = 0; i < elements.length; i++) {
        elements[i].classList.remove(_class)
    }
}

function colorTags() {
    tags.forEach(tag => {
        addClass(tag, "selected")
    })
}


const inputName = window.document.getElementById('search-name');
const inputSort = window.document.getElementById('select-sort');
const searchBtn = window.document.getElementById('form-search-btn');
const clearBtn = window.document.getElementById('form-clear-btn');


inputName.oninput = function () {
    name = inputName.value;
    search().then();
}

inputSort.onchange = function () {
    filter = inputSort.value
    search().then()
}

searchBtn.onclick = function () {
    search().then()
}

clearBtn.onclick = function () {
    clear().then()
}

searchBtn.style = "display:none;"
name = inputName.value
filter = inputSort.value
buildCards(true).then()
