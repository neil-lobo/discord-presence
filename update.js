async function getValues()
{
    const res = await fetch("https://raw.githubusercontent.com/The-Overmen/discord-presence-values/master/values.json")
    if (res.status != 200) return

    const json = await res.json();
    let games = json.games;
    let consoles = json.consoles;

    for(let game in games) {
        let option = document.createElement("option")
        option.value = game;
        option.innerText = games[game].details
        document.getElementById("games").appendChild(option)
    }

    for(let console in consoles) {
        let option = document.createElement("option")
        option.value = console;
        option.innerText = consoles[console].name
        document.getElementById("consoles").appendChild(option)
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

getValues();