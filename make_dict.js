const path = require("path")
const fs = require("fs")

const WAM_ROOT = path.join(__dirname, 'docs')

// Settings
const WEB_ROOT = "https://jempasam.github.io/SamWAMS/"

// Create wam dict
function getWamRoots() {
    const faustRoots = fs.readdirSync(WAM_ROOT, { withFileTypes: true, recursive: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => path.join(dirent.parentPath, dirent.name))
        .filter(dirPath => fs.existsSync(path.join(dirPath, 'descriptor.json')))
        .map(dirPath => dirPath.substring(WAM_ROOT.length + 1))
    return faustRoots
}

// Write to JSON
fs.writeFileSync(path.join(__dirname, 'docs/wams.json'), JSON.stringify(getWamRoots(), null, 2))

// Write to README
let list = ""
for(const wam of getWamRoots()) {
    const modified = wam.replaceAll("\\", "/")
    const descriptor = JSON.parse(fs.readFileSync(`${WAM_ROOT}/${modified}/descriptor.json`))
    list += `
|    | ${wam  .padEnd(100," ")}|
|----|-${"" .padEnd(100,"-")}|
|Name| ${(descriptor.name+" "+descriptor.version) .padEnd(100," ")}|
|Desc| ${descriptor.description .padEnd(100," ")}|
|Use | ${(WEB_ROOT+modified+"/index.js") .padEnd(100," ")}|
|Test| ${(WEB_ROOT+"#"+modified) .padEnd(100," ")}|
`
}

let final = fs.readFileSync(path.join(__dirname, 'RAW_README.md'), 'utf-8')
final = final.replace("{{WAM_LIST}}", list)
fs.writeFileSync(path.join(__dirname, 'README.md'), final)
