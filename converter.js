const ytdl = require('ytdl-core');
const ffmpeg = require('ffmpeg-static');
const { exec } = require('child_process');

const youtubeUrl = 'https://www.youtube.com/watch?v=A99BPQ9M5wk'; // Reemplaza VIDEO_ID con el ID real del video

const downloadOptions = {
  quality: 'highestaudio',
  filter: 'audioonly',
};

const convertToFormat = async (format) => {
  try {
    const info = await ytdl.getInfo(youtubeUrl);
    const audioFormats = ytdl.filterFormats(info.formats, 'audioonly');
    const audioUrl = audioFormats[0].url;

    const outputPath = `output.${format}`;

    let command;
    if (format === 'wav') {
      command = `${ffmpeg} -i "${audioUrl}" -vn -acodec pcm_s16le -ar 44100 -ac 2 "${outputPath}"`;
    } else if (format === 'mp3') {
      command = `${ffmpeg} -i "${audioUrl}" -vn -ar 44100 -ac 2 -ab 192k -f mp3 "${outputPath}"`;
    }

    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error('Error al convertir el video:', error);
        return;
      }

      console.log('Video convertido exitosamente. Archivo de salida:', outputPath);

      const downloadLink = document.createElement('a');
      downloadLink.href = outputPath;
      downloadLink.download = `audio.${format}`;
      downloadLink.click();
    });
  } catch (error) {
    console.error('Error al obtener información del video:', error);
  }
};

convertToFormat('wav'); // Convertir a formato WAV
convertToFormat('mp3'); // Convertir a formato MP3
