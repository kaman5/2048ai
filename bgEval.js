
importScripts("Engine.js");
onmessage = (e) => {
    var workerResult = e.data;
    let eng = new Engine();
    postMessage(eng.evaluate(workerResult));
}