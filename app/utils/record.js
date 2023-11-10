
let record
async function startRecording() {
   
}

async function stopRecording() {
    await record.stopAndUnloadAsync();
    const uri = record.getURI();
    return uri
}

export {
    startRecording,
    stopRecording
};
