const fs = require('fs');
const path = require('path');

//// Supprime d.ts ////
function removeDtsFiles(faust_root) {
    const dtsFiles = fs.readdirSync(faust_root,{recursive:true})
        .filter(file => file.endsWith('.d.ts'))
        .map(file => path.join(faust_root, file))
        
    dtsFiles.forEach(file => fs.unlinkSync(file))
}

//// Supprime les libraries ////
function removeLibs(faust_root) {
    /// Supprime
    try{
        fs.rmdirSync(path.join(faust_root, 'faust-ui'),{recursive:true, force:true})
        fs.rmdirSync(path.join(faust_root, 'faustwasm'),{recursive:true, force:true})
        fs.rmdirSync(path.join(faust_root, 'fftw'),{recursive:true, force:true})
        fs.rmdirSync(path.join(faust_root, 'sdk'),{recursive:true, force:true})
        fs.rmdirSync(path.join(faust_root, 'sdk-parammgr'),{recursive:true, force:true})
    }catch(e){}

    /// Redirige vers les libs communes
    const libs = ['sdk-parammgr', 'sdk', 'faustwasm', 'faust-ui']
    for(const name of ['index.js', 'gui.js']){
        const file = path.join(faust_root, name)
        let content = fs.readFileSync(file, 'utf-8')
        for(const lib of libs) {
            content = content.replaceAll(`'./${lib}/index.js'`, `'../../../common/${lib}/index.js'`)
            content = content.replaceAll(`"./${lib}/index.js"`, `'../../../common/${lib}/index.js'`)
        }
        content = content.replaceAll(`'\${this._baseURL}/fftw/index.js'`, `\${this._baseURL}/../../../common/fftw/index.js`)
        content = content.replaceAll(`'./faust-ui/index.css'`, `'./../../../common/faust-ui/index.css'`)
        fs.writeFileSync(file,content)
    }
}

//// Supprime le host ////
function removeHost(faust_root) {
    try{
        fs.rmdirSync(path.join(faust_root, 'host'),{recursive:true, force:true})
    }catch(e){}
}

//// Get faust roots ////
const WAM_ROOT = path.join(__dirname, 'docs')

function getFaustRoots() {
    const faustRoots = fs.readdirSync(WAM_ROOT, { withFileTypes: true, recursive: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => path.join(dirent.parentPath, dirent.name))
        .filter(dirPath => fs.existsSync(path.join(dirPath, 'dsp-meta.json')))
    return faustRoots
}

console.log(getFaustRoots())


//// Execute ////
for(const faust_root of getFaustRoots()) {
    removeDtsFiles(faust_root)
    removeLibs(faust_root)
    removeHost(faust_root)
}