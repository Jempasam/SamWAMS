const path = require("path")
const fs = require("fs")

const WAM_ROOT = path.join(__dirname, 'docs')

function getWamRoots() {
    const faustRoots = fs.readdirSync(WAM_ROOT, { withFileTypes: true, recursive: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => path.join(dirent.parentPath, dirent.name))
        .filter(dirPath => fs.existsSync(path.join(dirPath, 'descriptor.json')))
        .map(dirPath => dirPath.substring(WAM_ROOT.length + 1))
    return faustRoots
}

fs.writeFileSync(path.join(__dirname, 'docs/wams.json'), JSON.stringify(getWamRoots(), null, 2))