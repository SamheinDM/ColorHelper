/* eslint-disable default-case */
const electron = require('electron');
const app = electron.app;

// const squirrelUrl = "http://localhost:3333";
if (handleSquirrelEvent(app)) {
    // squirrel event handled and app will exit in 1000ms, so don't do anything else
    return;
}

const BrowserWindow = electron.BrowserWindow;
const ipcMain = electron.ipcMain;

const dbAPI = require('./db');

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1000, 
        height: 700,
        minWidth: 1000,
        minHeight: 700,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false // read contextBridge
        }
    });

    // and load the index.html of the app.
    // mainWindow.loadURL('http://localhost:3000');
    mainWindow.loadFile('./build/index.html');

    mainWindow.removeMenu();
    // Open the DevTools.
    // mainWindow.webContents.openDevTools();

    // Emitted when the window is closed.
    mainWindow.on('closed', function () {
        mainWindow = null
    })
}

// app.on('ready', function (){
//     // Add this condition to avoid error when running your application locally
//     if (process.env.NODE_ENV !== "dev") startAutoUpdater(squirrelUrl)
//   });

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', function () {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit()
    }
});

app.on('activate', function () {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null) {
        createWindow()
    }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

ipcMain.on('get-default-data', (event) => {
    event.returnValue = dbAPI.getDefault();
});

ipcMain.on('save-recipe', (event, data) => {
    if (dbAPI.getRecipe(data.name) === undefined) {
        dbAPI.saveRecipe(data);
        event.reply('recipe-saved', data.name);
    } else {
        event.reply('already-exist');
    }
});

ipcMain.on('get-recipies-list', (event) => {
    event.returnValue = dbAPI.getRecipiesList();
});

ipcMain.on('get-recipe', (event, recipeName) => {
    event.returnValue = dbAPI.getRecipe(recipeName);
});

ipcMain.on('update-recipe', (_event, data) => {
    dbAPI.updateRecipe(data);
});

ipcMain.on('delete-recipe', (_event, recipe) => {
    dbAPI.deleteRecipe(recipe);
});

// const startAutoUpdater = (squirrelUrl) => {
//     // The Squirrel application will watch the provided URL
//     electron.autoUpdater.setFeedURL(`${squirrelUrl}/win64/`);
  
//     // Display a success message on successful update
//     electron.autoUpdater.addListener("update-downloaded", (event, releaseNotes, releaseName) => {
//       electron.dialog.showMessageBox({"message": `The release ${releaseName} has been downloaded`});
//     });
  
//     // Display an error message on update error
//     electron.autoUpdater.addListener("error", (error) => {
//       electron.dialog.showMessageBox({"message": "Auto updater error: " + error});
//     });
  
//     // tell squirrel to check for updates
//     electron.autoUpdater.checkForUpdates();
//   }

function handleSquirrelEvent(application) {
    if (process.argv.length === 1) {
        return false;
    }

    const ChildProcess = require('child_process');
    const path = require('path');

    const appFolder = path.resolve(process.execPath, '..');
    const rootAtomFolder = path.resolve(appFolder, '..');
    const updateDotExe = path.resolve(path.join(rootAtomFolder, 'Update.exe'));
    const exeName = path.basename(process.execPath);

    const spawn = function(command, args) {
        let spawnedProcess;

        try {
            spawnedProcess = ChildProcess.spawn(command, args, {
                detached: true
            });
        } catch (error) {}

        return spawnedProcess;
    };

    const spawnUpdate = function(args) {
        return spawn(updateDotExe, args);
    };

    const squirrelEvent = process.argv[1];
    switch (squirrelEvent) {
        case '--squirrel-install':
        case '--squirrel-updated':
            // Optionally do things such as:
            // - Add your .exe to the PATH
            // - Write to the registry for things like file associations and
            //   explorer context menus

            // Install desktop and start menu shortcuts
            spawnUpdate(['--createShortcut', exeName]);

            setTimeout(application.quit, 1000);
            return true;

        case '--squirrel-uninstall':
            // Undo anything you did in the --squirrel-install and
            // --squirrel-updated handlers

            // Remove desktop and start menu shortcuts
            spawnUpdate(['--removeShortcut', exeName]);

            setTimeout(application.quit, 1000);
            return true;

        case '--squirrel-obsolete':
            // This is called on the outgoing version of your app before
            // we update to the new version - it's the opposite of
            // --squirrel-updated

            application.quit();
            return true;
    }
};
