const express = require("express")
const app = express()
const axios = require("axios")
const exec = require("child_process").execFile
const LocalRiotClientAPI = require("./LocalRiotClient.js")
var localRiotClientAPI = LocalRiotClientAPI.initFromLockFile()
const eapp = require('electron').app
const util = require("util")
const exectasklist = util.promisify(require('child_process').exec)
const shell = require('electron').shell
const settings = require("electron-settings")
var cors = require('cors')
const fs = require("fs")

app.use(cors())

app.get("/ingame/v1/join/:id", async (req, res) => {
    var id = req.params.id

    var credentials_data
    var credentials_success
    await localRiotClientAPI.getCredentials().then(response => {
        credentials_success = true
        credentials_data = response.data
    }).catch(error => {
        credentials_success = false
        res.send(400)
    })

    if(credentials_success == true) {
        var server_region
        await localRiotClientAPI.getServerRegion().then(response => {
            server_region = response.data.affinities.live
        }).catch(error => {
            res.send(400)
        })

        var party_data
        await axios.get(`https://glz-${server_region}-1.${server_region}.a.pvp.net/parties/v1/players/${credentials_data.subject}`, {
            headers: {
                "Authorization": `Bearer ${credentials_data.accessToken}`,
                "X-Riot-Entitlements-JWT": credentials_data.token,
                "X-Riot-ClientPlatform": "ew0KCSJwbGF0Zm9ybVR5cGUiOiAiUEMiLA0KCSJwbGF0Zm9ybU9TIjogIldpbmRvd3MiLA0KCSJwbGF0Zm9ybU9TVmVyc2lvbiI6ICIxMC4wLjE5MDQyLjEuMjU2LjY0Yml0IiwNCgkicGxhdGZvcm1DaGlwc2V0IjogIlVua25vd24iDQp9",
                "X-Riot-ClientVersion":  "release-02.05-shipping-3-531230"
            }
        }).then(response => {
            party_data = response.data
        }).catch(error => {
            console.log(error)
            res.send(400)
        })

        var open_success
        await axios.post(`https://glz-${server_region}-1.${server_region}.a.pvp.net/parties/v1/players/${credentials_data.subject}/joinparty/${id}`, {}, {
            headers: {
                "Authorization": `Bearer ${credentials_data.accessToken}`,
                "X-Riot-Entitlements-JWT": credentials_data.token,
                "X-Riot-ClientPlatform": "ew0KCSJwbGF0Zm9ybVR5cGUiOiAiUEMiLA0KCSJwbGF0Zm9ybU9TIjogIldpbmRvd3MiLA0KCSJwbGF0Zm9ybU9TVmVyc2lvbiI6ICIxMC4wLjE5MDQyLjEuMjU2LjY0Yml0IiwNCgkicGxhdGZvcm1DaGlwc2V0IjogIlVua25vd24iDQp9",
                "X-Riot-ClientVersion":  "release-02.05-shipping-3-531230"
            }
        }).then(response => {
            open_success = true
        }).catch(error => {
            if(error.response.status == 404) {
                res.send(404)
                open_success = false
            } else {
                open_success = false
                res.send(400)
            }
        })

        if(open_success == true) {
            var json = {
                party_id: party_data.CurrentPartyID
            }
            res.status(200).send(json)
        } 
    }
})

app.get("/ingame/v1/create", async (req, res) => {
    var credentials_data
    var credentials_success
    await localRiotClientAPI.getCredentials().then(response => {
        credentials_success = true
        credentials_data = response.data
    }).catch(error => {
        credentials_success = false
        res.send(400)
    })

    if(credentials_success == true) {
        var server_region
        await localRiotClientAPI.getServerRegion().then(response => {
            server_region = response.data.affinities.live
        }).catch(error => {
            res.send(400)
        })

        var party_data
        await axios.get(`https://glz-${server_region}-1.${server_region}.a.pvp.net/parties/v1/players/${credentials_data.subject}`, {
            headers: {
                "Authorization": `Bearer ${credentials_data.accessToken}`,
                "X-Riot-Entitlements-JWT": credentials_data.token,
                "X-Riot-ClientPlatform": "ew0KCSJwbGF0Zm9ybVR5cGUiOiAiUEMiLA0KCSJwbGF0Zm9ybU9TIjogIldpbmRvd3MiLA0KCSJwbGF0Zm9ybU9TVmVyc2lvbiI6ICIxMC4wLjE5MDQyLjEuMjU2LjY0Yml0IiwNCgkicGxhdGZvcm1DaGlwc2V0IjogIlVua25vd24iDQp9",
                "X-Riot-ClientVersion":  "release-02.05-shipping-3-531230"
            }
        }).then(response => {
            party_data = response.data
        }).catch(error => {
            console.log(error)
            res.send(400)
        })

        var open_success
        await axios.post(`https://glz-${server_region}-1.${server_region}.a.pvp.net/parties/v1/parties/${party_data.CurrentPartyID}/accessibility`, {Accessibility: "OPEN"}, {
            headers: {
                "Authorization": `Bearer ${credentials_data.accessToken}`,
                "X-Riot-Entitlements-JWT": credentials_data.token,
                "X-Riot-ClientPlatform": "ew0KCSJwbGF0Zm9ybVR5cGUiOiAiUEMiLA0KCSJwbGF0Zm9ybU9TIjogIldpbmRvd3MiLA0KCSJwbGF0Zm9ybU9TVmVyc2lvbiI6ICIxMC4wLjE5MDQyLjEuMjU2LjY0Yml0IiwNCgkicGxhdGZvcm1DaGlwc2V0IjogIlVua25vd24iDQp9",
                "X-Riot-ClientVersion":  "release-02.05-shipping-3-531230"
            }
        }).then(response => {
            open_success = true
        }).catch(error => {
            open_success = false
            if(error.response.status == 403) {
                var json = {
                    party_id: party_data.CurrentPartyID
                }
                res.status(403).send(json)
            } else {
                res.status(400).send("400")
            }
        })

        if(open_success == true) {
            var json = {
                party_id: party_data.CurrentPartyID
            }
            res.status(200).send(json)
        } 
    }
})

app.get("/ingame/v1/penaltys/", async (req, res) => {
    var credentials_data
    var credentials_success
    await localRiotClientAPI.getCredentials().then(response => {
        credentials_success = true
        credentials_data = response.data
    }).catch(error => {
        credentials_success = false
        res.status(400).send({error: "Fehler beim Server Login"})
    })

    if(credentials_success == true) {
        var server_region
        await localRiotClientAPI.getServerRegion().then(response => {
            server_region = response.data.affinities.live
        }).catch(error => {
            res.status(400).send("Fehler beim Server Login")
        })

        await axios.get(`https://pd.${server_region}.a.pvp.net/restrictions/v2/penalties`, {
            headers: {
                "Authorization": `Bearer ${credentials_data.accessToken}`,
                "X-Riot-Entitlements-JWT": credentials_data.token,
                "X-Riot-ClientPlatform": "ew0KCSJwbGF0Zm9ybVR5cGUiOiAiUEMiLA0KCSJwbGF0Zm9ybU9TIjogIldpbmRvd3MiLA0KCSJwbGF0Zm9ybU9TVmVyc2lvbiI6ICIxMC4wLjE5MDQyLjEuMjU2LjY0Yml0IiwNCgkicGxhdGZvcm1DaGlwc2V0IjogIlVua25vd24iDQp9",
                "X-Riot-ClientVersion":  "release-02.05-shipping-3-531230"
            }
        }).then(response => {
            res.status(200).send(response.data.Penalties)
        }).catch(err => {
            res.status(500).send({error: "Fehler bei der Überprüfung deiner Strafen"})
        })
    }
})

app.get("/client/v1/settings", async (req, res) => {
    res.status(200).send(await settings.get())
})

app.post("/client/v1/link/:source", async (req, res) => {
    var s = {
        "discord": "https://discord.gg/DjEVjH4hxJ",
        "twitter": "https://twitter.com/",
        "twitch": "https://www.twitch.tv/"
    }
    shell.openExternal(s[req.params.source])
    res.send(200)
})

app.post("/client/v1/restart", async (req, res) => {
    eapp.relaunch()
    eapp.exit()
    res.send(200)
})
app.post("/client/v1/startvalorant", async (req, res) => {
    var path = `${process.env.ALLUSERSPROFILE}\\Riot Games\\RiotClientInstalls.json`;
    var data = fs.readFileSync(path, 'utf8');
    var djson = JSON.parse(data)
    await exectasklist(`"${djson.rc_default}" --launch-product=valorant --launch-patchline=live --insecure --app-port=12345`, (error, stdout, stderr) => {
        if(error) {res.send(500)} else {res.send(200)}
    })
})

app.get("/client/v1/status", async (req, res) => {
    await exectasklist("tasklist", (error, stdout, stderr) => {
        if(error) return
        var tasks = stdout.toString().split("\n")
        var bset = false
        for(let i = 0; tasks.length > i; i++) {
            if(tasks[i].includes("VALORANT-Win64-Shipping")) {
                bset = true
            }
        }
        bset == false ? res.status(404).send("404") : res.status(200).send("200")
    })
})

app.listen(42069, () => {console.log("API Online")})