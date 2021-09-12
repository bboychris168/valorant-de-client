const {app, BrowserWindow, Tray} = require("electron")
const path = require("path")
const load = require("./content/backend/load.js")
const api = require("./content/backend/api.js")
const util = require("util")
const exec = require('child_process').exec
const { autoUpdater } = require('electron-updater');
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0
autoUpdater.autoDownload = true
app.disableHardwareAcceleration()

app.on("ready", async () => {
    const win = new BrowserWindow({
        width: 1000,
        height: 600,
        icon: "./content/backend/VALORANT_D_TRANSPARENT.png",
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            enableRemoteModule: true
        },
        show: true
    })
    win.setMenuBarVisibility(false)
    win.loadFile("./content/ui/functional.html")
    /*const splash = new BrowserWindow({width: 200, height: 200, frame: false, alwaysOnTop: true, show: true, transparent: true, webPreferences: {nodeIntegration: true},});
    splash.loadFile(`./content/ui/splash.html`);

    autoUpdater.on("update-available", async () => {
        autoUpdater.on("update-downloaded", async () => {
            autoUpdater.quitAndInstall();
        })
    })
    autoUpdater.on("update-not-available", async () => {
            splash.destroy()
            win.show()
            exec("tasklist", (error, stdout, stderr) => {
                if(error) return
                var tasks = stdout.toString().split("\n")
                var bset = false
                for(let i = 0; tasks.length > i; i++) {
                    if(tasks[i].includes("VALORANT-Win64-Shipping")) {
                        bset = true
                    }
                }
                bset == false ? win.loadFile("./content/ui/error.html") : win.loadFile("./content/ui/functional.html")
            })
            setInterval(async () => {
                exec("tasklist", (error, stdout, stderr) => {
                    if(error) return
                    var tasks = stdout.toString().split("\n")
                    var bset = false
                    for(let i = 0; tasks.length > i; i++) {
                        if(tasks[i].includes("VALORANT-Win64-Shipping")) {
                            bset = true
                        }
                    }
                    console.log(bset)
                    if(bset == false) {
                        app.exit()
                    }
                })
            }, 10000)
    })

    autoUpdater.on("error", async (error) => {
        console.log(error)
        splash.destroy()
        win.show()
    })
    autoUpdater.checkForUpdatesAndNotify();
    */
})

app.on("window-all-closed", () => {
    app.quit()
})

app.on("quit", () => {
    app.quit()
})