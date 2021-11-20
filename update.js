let consoles = {}
let games = {}

async function getValues() {
    const res = await fetch("https://raw.githubusercontent.com/The-Overmen/discord-presence-values/master/values.json")
    if (res.status != 200) return

    const json = await res.json();
    games = json.games;
    consoles = json.consoles;

    // for(let game in games) {
    //     let option = document.createElement("option")
    //     option.value = game;
    //     option.innerText = games[game].details
    //     document.getElementById("games").appendChild(option)
    // }
}

async function setConsoles(c) {
    let first = null;
    for(let console in c) {
        if (!first) first = console
        let option = document.createElement("option")
        option.value = console;
        option.innerText = consoles[console].name
        document.getElementById("consoles").appendChild(option)
    }

    document.getElementById("consoles").value = first;
    return first;
}

async function setGames(g, console) {
    document.getElementById("games").innerHTML = ""
    for(let game in g) {
        if (g[game]["console"] != console) continue;

        let option = document.createElement("option")
        option.value = game;
        option.innerText = games[game].details
        document.getElementById("games").appendChild(option)
    }
}

document.getElementById("update").addEventListener("click", () => {
    let data = {};
    
    data.game = document.getElementById("games").value;
    data.console = document.getElementById("consoles").value;
    
    fetch("http://localhost:3000/update", {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        method: "POST",
        body: JSON.stringify(data)
    })
})

document.getElementById("consoles").addEventListener("change", () => {
    let value = document.getElementById("consoles").value
    setGames(games, value);
})

getValues()
    .then(() => setConsoles(consoles))
    .then((first) => setGames(games, first))