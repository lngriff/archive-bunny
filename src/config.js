export const config = {
    mainFolder: './images/',
    startingPage: 'https://google.com',
    viewWindow: {
        x: 370,
        y: 0,
        width: 540,
        height: 980,
    },
    // essentially: which arrow key do you want to press to advance (Right, Left, Up, Down)
    scrollDir: 'Right',
    // should the images be zipped, and into what (eg. zip, 7z)
    archive: true,
    archiveType: 'zip',
    debugPort: 9222,
    // waits in ms
    longWait: 5000,
    shortWait: 3000,
    // show ascii progress bunnies while script is running
    bunnyOn: true,
}