// all the static text & cute little ASCII art
export const title = `
 _____         _   _            _____                 
|  _  |___ ___| |_|_|_ _ ___   | __  |_ _ ___ ___ _ _ 
|     |  _|  _|   | | | | -_|  | __ -| | |   |   | | |
|__|__|_| |___|_|_|_|\\_/|___|  |_____|___|_|_|_|_|_  |
                                                 |___|                                     
`;

export const usage = `A helpful little cli for clicking thru and screenshotting websites`;

export const about = `Archive Bunny is a cli for clicking through and capturing content, like slideshows or image collections, on websites.

You can capture multiple collections by giving the bunny a comma-separated list of headings (eg. Best Dog Breeds, 100 Recipes, etc).

Because of the specificity of the HTML selectors used for navigation you may need to edit the script itself (archive-script.js) in addition to the config (type "archbunny view-config" or "archbunny edit-config").

Some in-browser setup may be required (or advisable) before running the archive script, and bunny will pause execution to wait for you to give the go ahead.
`
// might want some static text w no bunnies for bunny haters

export const startBunny =
` /)/)
( . .)  Hi! Let's get started.
(   ) I'm going to launch a browser for you.

`;

export const readyYet = `Have you completed all the setup on your end? (y/n) `

export const getNames = `What categories are we archiving? `

export const workingBunny =
`
 (\\ __/)  
 („•  •„) *.*.
  _U _ U_______________
 |      Working!!      |   
 |_____________________|
   `
;

export function gotOneBunny(title) {
    return `
 /)  /)
(˶• ֊ •) .*. Archive get!! .*.
/  7  7
        Copied ${title}
`; 
} 

export const noMatchBunny = 
` /) /)
(´• •̀ ) I couldn't find anything that matched your categories, sorry.
( U  U)
`;

export function errorBunny(errorText) {
    return `
  /) /)
( ; _ ;) An error occurred.
( U  U)
${errorText}
`; 
} 
