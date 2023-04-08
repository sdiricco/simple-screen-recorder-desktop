# simple-screen-recorder-desktop

## Esempio - Conversione da webm a mp4

Librerie:

- [ffmpeg-installer](https://www.npmjs.com/package/@ffmpeg-installer/ffmpeg)
- [fluent-ffmpeg](https://www.npmjs.com/package/fluent-ffmpeg)

Per convertire correttamente un file `.webm` in un qualsiasi altro formato è necessario prima eseguire il repackaging del file. **Questo è necessario per ogni file in cui manca la duration p il bit rate**. Queste metainformazioni sono necessarie per calcolare correttamente il progresso durante la conversione del file

```js
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffmpeg = require('fluent-ffmpeg');
ffmpeg.setFfmpegPath(ffmpegPath);
ffmpeg('input.webm')
    .videoCodec('copy')
    .audioCodec('copy')
    .save('temp-input.webm')
    .on('error', err => console.log('An error occurred: ' + err.message))
    .on('end', () => console.log('Processing finished successfully'));
```

Successivamente puoi utilizare il seguente codice per convertirlo in un file `.mp4`

```js
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffmpeg = require('fluent-ffmpeg');
ffmpeg.setFfmpegPath(ffmpegPath);
const conversion = ffmpeg('temp-screen-recording.webm')
    .output('screen-recording.mp4')
    .videoCodec('libx264')
    .audioCodec('libmp3lame');

conversion.on('start', commandLine => {
    console.log('start: ',commandLine);
})
conversion.on('codecData', data => {
    console.log('data', data);
})
conversion.on('progress', (progress) => {  
    console.log(progress)
});
conversion.on('end', () => {
    console.log(`Conversion completed successfully`);
});
conversion.on('error', (error) => {
    console.log(`Error during conversion: ${error.message}`);
});
conversion.run();
```