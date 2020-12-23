'use strict';

/**
 * テキストファイルを読み取り、生成した段落要素を返す
 * @param {Object} file File オブジェクト
 * @return {HTMLElement} 段落要素
 */
function textFile(file) {
  const divided = document.createElement('div');
  divided.className = 'text-file';
  divided.dataset.file = file.name;

  const reader = new FileReader();
  reader.readAsText(file);
  reader.onload = event => {
    const text = event.target.result;
    divided.textContent = text;
  }

  return divided;
}

/**
 * 画像ファイルを読み取り、生成した画像要素を返す
 * @param {Object} file File オブジェクト
 * @return {HTMLElement} 画像埋め込み要素
 */
function imageFile(file) {
  const image = document.createElement('img');
  image.className = 'image-file';
  image.dataset.file = file.name;

  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = event => {
    const url = event.target.result;
    image.src = url;
  }

  return image;
}

/**
 * 動画ファイルを読み取り、生成した動画要素を返す
 * @param {Object} file File オブジェクト
 * @return {HTMLElement} 動画埋め込み要素
 */
function videoFile(file) {
  const video = document.createElement('video');
  video.className = 'video-file';
  video.dataset.file = file.name;
  video.setAttribute('contenteditable', 'false');
  video.setAttribute('controlslist', 'nodownload');
  video.setAttribute('disablepictureinpicture', '');
  video.setAttribute('controls', '');
  video.setAttribute('autoplay', '');
  video.setAttribute('loop', '');

  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = event => {
    const url = event.target.result;
    video.src = url;
  }

  return video;
}

/**
 * 音声ファイルを読み取り、生成した音声要素を返す
 * @param {Object} file File オブジェクト
 * @return {HTMLElement} 埋め込み音声要素
 */
function audioFile(file) {
  const audio = document.createElement('audio');
  audio.className = 'audio-file';
  audio.dataset.file = file.name;
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = event => {
    const url = event.target.result;
    audio.src = url;
  }
  return audio;
}

export {
  textFile as text,
  imageFile as image,
  videoFile as video,
  audioFile as audio
};