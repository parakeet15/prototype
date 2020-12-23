'use strict';

/**
 * テキストファイルを読み取り、生成した段落要素を返す
 * @param {Object} file File オブジェクト
 * @return {HTMLElement} 段落要素
 */
function textFile(file) {
  const reader = new FileReader();
  reader.readAsText(file);
  reader.onload = event => {
    const text = event.target.result;
    const paragraph = document.createElement('p');
    paragraph.className = 'text-file';
    paragraph.textContent = text;
    // return paragraph;
    return 'Test';
  }
}

/**
 * 画像ファイルを読み取り、生成した画像要素を返す
 * @param {Object} file File オブジェクト
 * @return {HTMLElement} 画像埋め込み要素
 */
function imageFile(file) {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = event => {
    const url = event.target.result;
    const image = document.createElement('img');
    image.className = 'image-file';
    image.src = url;
    return image;
  }
}

/**
 * 動画ファイルを読み取り、生成した動画要素を返す
 * @param {Object} file File オブジェクト
 * @return {HTMLElement} 動画埋め込み要素
 */
function videoFile(file) {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = event => {
    const url = event.target.result;
    const video = document.createElement('video');
    video.className = 'video-file';
    video.src = url;
    return video;
  }
}

/**
 * 音声ファイルを読み取り、生成した音声要素を返す
 * @param {Object} file File オブジェクト
 * @return {HTMLElement} 埋め込み音声要素
 */
function audioFile(file) {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = event => {
    const url = event.target.result;
    const audio = document.createElement('audio');
    audio.className = 'audio-file';
    audio.src = url;
    return audio;
  }
}

export {
  textFile as text,
  imageFile as image,
  videoFile as video,
  audioFile as audio
};