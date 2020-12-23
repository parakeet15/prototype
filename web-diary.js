'use strict';

import * as handleFiles from './modules/handle-files.js';
import { removeAllChildren } from './modules/utils.js';

// ツールバー
const createButton = document.getElementById('create-button');
const saveButton = document.getElementById('save-button');
const deleteButton = document.getElementById('delete-button');
const fileElement = document.getElementById('add-file-input');

// メインコンテンツ
const titleInput = document.getElementById('title-input');
const contentArea = document.getElementById('content-area');
const createdDate = document.getElementById('created-date');
const saveList = document.getElementById('save-list');

/**
 * リストアイテムのスタイルを設定する
 * @param {HTMLElement} listItem 選択した項目
 */
function listStyle(listItem) {
    for (let savedItem of saveList.getElementsByClassName('saved-item')) {
        savedItem.style.display = 'flex';
        savedItem.style.backgroundColor = '#ffffff';
        listItem.style.backgroundColor = '#eeeeee';
    }
}

fileElement.addEventListener('change', handleFile, false);

/**
 * ユーザーが選択したファイルを添付する
 * @param {Object} event Event オブジェクト
 */
function handleFile(event) {
    const file = event.target.files[0];
    if ((1 * 1024 * 1024) <= file.size) {
        alert('1MB以下のファイルを添付できます');
        fileElement.value = null;
        return;
    }
    switch (file.type) {
        case 'text/plain':
            const text = handleFiles.text(file);
            contentArea.appendChild(text);
            break;
        case 'video/quicktime':
        case 'video/x-msvideo':
        case 'video/mp4':
            const video = handleFiles.video(file);
            contentArea.appendChild(video);
            break;
        case 'image/jpeg':
        case 'image/png':
        case 'image/gif':
            const image = handleFiles.image(file);
            contentArea.appendChild(image);
            break;
        case 'audio/x-aiff':
        case 'audio/mpeg':
        case 'audio/wav':
            const audio = handleFiles.audio(file);
            contentArea.appendChild(audio);
        default:
            alert('未対応の形式です');
            break;
    }
    fileElement.value = null;
}

/**
 * ローカルストレージに記事を保存する
 * @param {String} key 保存するキーの名称
 */
function save(key) {
    if (titleInput.value.length === 0) {
        titleInput.value = 'Untitled';
    }
    const diary = {
        title: titleInput.value,
        content: contentArea.innerHTML,
        createdAt: new Date(parseInt(key.split('-')[1])).toLocaleString()
    }
    try {
        localStorage.setItem(key, JSON.stringify(diary));
    } catch (error) {
        titleInput.value = null;
        load(saveList.querySelector(`li[data-key="${key}"]`) || saveList.firstChild);
        alert(`“${diary.title}”を保存できませんでした。\nローカルストレージの空き領域が不足しています。`);
        console.warn(`ローカルストレージの空き領域が不足しています`, error);
    }
    addToList(key);
}

/**
 * 保存したデータをリストに追加する
 * @param {String} key キーの名称
 */
function addToList(key) {
    const container = document.createElement('div');
    const video = document.createElement('video');
    const image = document.createElement('img');
    const title = document.createElement('h3');
    const text = document.createElement('p');
    container.className = 'container';
    video.className = 'thumbnail';
    image.className = 'thumbnail';
    title.className = 'list-title';
    text.className = 'list-text';
    if (contentArea.getElementsByTagName('video').length) {
        video.setAttribute('loop', '');
        video.setAttribute('muted', '');
        video.setAttribute('autoplay', '');
        video.setAttribute('disablepictureinpicture', '');
        video.src = contentArea.getElementsByTagName('video')[0].src;
        container.appendChild(video);
    } else if (contentArea.getElementsByTagName('img').length) {
        image.src = contentArea.getElementsByTagName('img')[0].src;
        container.appendChild(image);
    } else {
        image.src = './images/no-image.png';
        container.appendChild(image);
    }
    title.innerText = titleInput.value;
    container.appendChild(title);
    text.innerText = contentArea.textContent;
    container.appendChild(text);
    titleInput.value = null;
    if (saveList.querySelector(`li[data-key="${key}"]`)) {
        const savedItem = saveList.querySelector(`li[data-key="${key}"]`);
        removeAllChildren(savedItem);
        savedItem.appendChild(container);
        load(savedItem);
    } else {
        const savedItem = document.createElement('li');
        savedItem.className = 'saved-item';
        savedItem.dataset.key = key;
        savedItem.appendChild(container);
        saveList.insertBefore(savedItem, saveList.firstChild);
        savedItem.onclick = () => load(savedItem);
        load(savedItem);
    }
}

// 新規作成
createButton.addEventListener('click', create, false);

/**
 * 新しく記事を作成する
 */
function create() {
    titleInput.value = null;
    removeAllChildren(contentArea);
    removeAllChildren(createdDate);
    save(`diary-${Date.now()}`);
}

/**
 * 引数に渡されたキーを削除する
 * @param {String} key 削除するキーの名称
 */
function remove(key) {
    localStorage.removeItem(key);
    if (saveList.querySelector(`li[data-key="${key}"]`)) {
        saveList.querySelector(`li[data-key="${key}"]`).remove();
    }
    saveList.firstChild ? load(saveList.firstChild) : create();
}

/**
 * ローカルストレージからデータを取得して表示する
 * @param {String} key 取得するキーの名称
 */
function output(key) {
    const diary = JSON.parse(localStorage.getItem(key));
    titleInput.value = diary.title;
    contentArea.innerHTML = diary.content;
    createdDate.innerText = diary.createdAt;
}

/**
 * 引数に渡された要素の情報を取得して操作する
 * @param {HTMLElement} listItem 選択した要素
 */
function load(listItem) {
    listStyle(listItem);
    listItem.scrollIntoView({ behavior: 'smooth' });
    const key = listItem.dataset.key;
    if (localStorage.getItem(key)) {
        try {
            output(key);
        } catch (error) {
            remove(key);
            console.warn(`“${key}” のデータを取得できませんでした`, error);
        }
        saveButton.onclick = () => save(key);
        deleteButton.onclick = () => remove(key);
    } else {
        remove(key);
        console.warn(`“${key}” の値を取得できません`);
    }
}

// ページ読み込み時
window.onload = () => {
    const items = new Array();
    for (let i = 0; i < localStorage.length; i++) {
        items.push(localStorage.key(i));
    }
    const keys = items.filter(item => /diary-\d+/.test(item)).sort((a, b) => parseInt(a.split('-')[1]) - parseInt(b.split('-')[1]));
    if (keys.length === 0) {
        create();
        return;
    }
    keys.forEach(key => {
        try {
            output(key);
            addToList(key);
        } catch (error) {
            remove(key);
            console.warn(`“${key}” のデータを取得できませんでした`, error);
        }
    });
    console.assert(
        keys.length === saveList.childElementCount,
        `リストの項目数が正しくありません`
    );
}