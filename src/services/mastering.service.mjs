import fs from 'fs';
import Aimastering from 'aimastering';
import _ from 'lodash';

// Call API with promise interface
const callApiDeferred = async function(api, method) {
    const apiArgments = Array.prototype.slice.call(arguments, 2);

    return new Promise((resolve, reject) => {
        const callback = (error, data, response) => {
            if (error) {
                reject(error, response);
            } else {
                resolve(data, response);
            }
        };
        const args = _.flatten([
            apiArgments,
            callback
        ]);

        method.apply(api, args);
    });
};

const sleep = async function(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
};

export const main = async function(inputLocation, outputLocation) {
    // configure API client
    const client = Aimastering.ApiClient.instance;
    const bearer = client.authentications['bearer'];
    // bearer.apiKey = process.env.AIMASTERING_ACCESS_TOKEN;

    client.timeout = 70000

    // API key must be 'guest_' + [arbitrary string]
    // Unless the API key is leaked, the data will not be visible to others.
    bearer.apiKey = 'guest_7dk1h3uutho3visotfogt8292q8rcgomg16t8g21lpm'

    // create api
    const audioApi = new Aimastering.AudioApi(client);
    const masteringApi = new Aimastering.MasteringApi(client);

    // upload input audio
    console.log('starts')
    const inputAudioData = fs.createReadStream(inputLocation);
    const inputAudio = await callApiDeferred(audioApi, audioApi.createAudio, {
        'file': inputAudioData,
    });
    console.error(inputAudio);

    // start mastering
    let mastering = await callApiDeferred(masteringApi, masteringApi.createMastering, inputAudio.id, {
        'mode': 'default',
    });
    console.error(mastering);

    // wait for the mastering completion
    while (mastering.status === 'waiting' || mastering.status === 'processing') {
        mastering = await callApiDeferred(masteringApi, masteringApi.getMastering, mastering.id);
        console.error('waiting for the mastering completion progression: ' +
            (100 * mastering.progression).toFixed() + '%');
        await sleep(5000);
    }

    // download output audio
    const outputAudioData = await callApiDeferred(audioApi, audioApi.downloadAudio, mastering.output_audio_id);
    fs.writeFileSync(outputLocation, outputAudioData);

    console.error('the output file was written to ' + outputLocation);
    return 'Success'
};

export const getMasteredFiles = async function(directory, files = []) {
    const fileList = fs.readdirSync(directory);
    let fileContents = null;
    for (const file of fileList) {
        const name = `${directory}/${file}`;
        if (fs.statSync(name).isDirectory()) {
            await getMasteredFiles(name, files);
        } else {
            try {
                // Read the contents of the file
                fileContents = fs.readFileSync(name);
                // Do something with the file contents
                console.log('File contents:', fileContents);
            } catch (error) {
                console.error('Error reading file:', error);
            }
            files.push(fileContents);
        }
    }
    if (files == null) {
        return 'No mastered files'
    }
    return files[0];
}