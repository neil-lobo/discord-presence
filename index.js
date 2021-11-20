const { app, BrowserWindow } = require('electron')
const clientId = "911416089341227008";
const {Client} = require("discord-rpc");
const express = require("express")();
const bodyParser = require('body-parser')
const fetch = require('electron-fetch').default

express.use(bodyParser.urlencoded({ extended: false }))
express.use(bodyParser.json())

const rpc = new Client({transport:"ipc"});

let games = {}
let consoles = {}

const createWindow = () => {
    const win = new BrowserWindow({
        width: 800,
        height: 600
    })

    win.loadFile('index.html')
}

rpc.on("disconnect", async () => {
    await rpc.destroy();
})

express.post("/update", (req, res) => {
    const data = req.body

    if (!games[data.game] || !consoles[data.console]) {
        console.log(data)
        res.status(400).send();
    }

    const state = {
        ...games[data.game],
        ...consoles[data.console],
        startTimestamp: Date.now(),
    }

    rpc.setActivity(state);
    res.status(201).send();
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})

app.whenReady().then(async () => {
    const res = await fetch("https://raw.githubusercontent.com/The-Overmen/discord-presence-values/master/values.json")
    if (res.status != 200) app.quit()

    const json = await res.json()
    games = json.games
    consoles = json.consoles

    await express.listen(3000);
    console.log("[EXPRESS] Listening...")
    try {
        await rpc.login({clientId:clientId});
        console.log("[DISCORD RPC] Connected!")
    }
    catch(err) {
        console.log(err);
        process.exit(1);
    }
    createWindow()
})