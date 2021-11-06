const paths = [];

await updateList();

document.getElementById('back').addEventListener('click', () => {
    const path = paths.pop();
    updateList(path);
});

const version = await getVersion();

if (version.version !== version.latest) {
    document.getElementById('alert').style.visibility = 'visible';
    document.getElementById('update').addEventListener('click', () => {
        update();
    });
    document.getElementById('close').addEventListener('click', () => {
        document.getElementById('alert').style.visibility = 'hidden';
    });
}

async function updateList(path) {
    document.getElementById('path').value = path || '';
    const list = document.getElementById('list');
    const entries = await getFileSystem(path);
    const items = entries.map(entry => {
        const item = document.createElement('li');
        item.innerHTML = `<button class="secondary">${entry.name}</button>`;
        if (entry.type !== 'File') {
            item.querySelector('button').addEventListener('click', () => {
                paths.push(path);
                updateList(entry.path);
            });
        }
        return item;
    });
    list.replaceChildren(...items);
}

async function getVersion() {
    const response = await fetch('/version');
    return await response.json();
}

async function update() {
    await fetch('/update', {
        method: 'POST'
    });
}

async function getFileSystem(path) {
    const response = await fetch(`/filesystem?${new URLSearchParams({ path: path || '' })}`);
    return await response.json();
}
