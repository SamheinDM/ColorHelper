## Installation

Install dependences
```javascript
npm install
```

## Build

First we need to make a build...
```javascript
npm run build
```

## Run

...then we can run the app...
```javascript
npm run electron
```

## Packing

...or pack it to independant application with installer.
```javascript
npm run package
```
Packed app will be in ./out/color-helper-win32-x64/color-helper.exe

Or if you need instalation file, you can find it in ./out/make/squirrel.windows/x64/Setup.exe
Instalation don't let you chose anything (sry), but put shortcut to app on your desktop.
App can be deleted from Programs and Components menu in Windows Control panel.
