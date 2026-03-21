export {}


// Settings //
const WAM_PATH = location.hash.substring(1) || "module/generator/voice"
const WAM_URL = `./${WAM_PATH}/index.js`

// Select box //*
const dict = await fetch('./wams.json').then(res => res.json())
const select = document.createElement("select")
document.body.appendChild(select)
for(const wam of dict) {
    const option = document.createElement("option")
    option.textContent = wam
    option.value = wam
    if(wam.replaceAll('\\', '/') === WAM_PATH) option.selected = true
    option.onclick = () => {
        location.hash = wam.replaceAll('\\', '/')
        location.reload()
    }
    select.appendChild(option)
}


// Initialize options //
await new Promise(resolve => document.onclick = resolve)

const initializeWamHost = (await import("https://www.webaudiomodules.com/sdk/2.0.0-alpha.6/src/initializeWamHost.js")).default

const audioContext = new AudioContext()

const [group, key] = await initializeWamHost(audioContext, "example")

// The keyboard //
const Piano = (await import("https://mainline.i3s.unice.fr/wam2/packages/simpleMidiKeyboard/index.js")).default
const piano = await Piano.createInstance(group, audioContext)
const pianoGui = await piano.createGui()
document.body.appendChild(pianoGui)

// The sound //
const audio = document.createElement("audio")
audio.src = "./sound.wav"
audio.crossOrigin = "anonymous"
audio.loop = true
audio.controls = true
document.body.appendChild(audio)
const source = audioContext.createMediaElementSource(audio)

// The WAM //
const Module = (await import(WAM_URL)).default

const module = await Module.createInstance(group, audioContext)

piano.audioNode.connectEvents(module.audioNode.instanceId)
source.connect(module.audioNode)
module.audioNode.connect(audioContext.destination)

const gui = await module.createGui()

document.body.appendChild(gui)