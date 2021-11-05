class FileExplorer extends HTMLElement {
    paths = [];

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
<div class="file-explorer">
    <h1>File explorer</h1>
    <div class="file-explorer-toolbar">
        <button class="file-explorer-back">Back</button>
        <input class="file-explorer-path" readonly aria-label="Path">
    </div>
    <ul class="file-explorer-list"></ul>
</div>

<style>
:focus {
    outline: 0;
    box-shadow: 0 0 0 .15em #000, 0 0 0 .25em #FFF, 0 0 .5em #000;
}
.file-explorer {
    max-width: 60em;
    padding: 1em;
    margin: 0 auto;
    font-family: Rubik,-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif;
}
.file-explorer-toolbar {
    display: flex;
}
.file-explorer-back {
    background: #411E8F;
    color: #EEEEEE;
    border: 0;
    border-radius: 2em;
    font-size: 1.25em;
    font-family: Rubik,-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif;
    padding: .25em 1em;
    margin-right: 1em;
    transition: all .1s ease;
}
.file-explorer-back:hover, .file-explorer-back:focus {
    transform: scale(1.1);
}
.file-explorer-path {
    flex-grow: 1;
    background: #411E8F;
    color: #EEEEEE;
    border: 0;
    border-radius: 1em;
    font-size: 1.25em;
    font-family: Rubik,-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif;
    padding: .25em .5em;
    transition: all .1s ease;
}
.file-explorer-list {
    list-style-type: none;
    display: flex;
    flex-wrap: wrap;
    padding: 0;
    gap: 1em;
    margin: 2em 0;
}
.file-explorer-list li {
}
.file-explorer-list li button {
    background: #352F44;
    color: #EEEEEE;
    font-size: 1.25em;
    font-family: Rubik,-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif;
    border: 0;
    border-radius: 2em;
    padding: .25em 1em;
    transition: all .1s ease;
}
.file-explorer-list li button:hover, .file-explorer-list li button:focus {
    transform: scale(1.1);
}
</style>`;
        this.shadowRoot.querySelector('.file-explorer-back').addEventListener('click', () => {
            const path = this.paths.pop();
            this.update(path);
        });
        this.update();
    }

    async update(path) {
        const entries = path ? await this.getEntries(path) : await this.getDrives();
        const children = entries.map(entry => this.createEntryElement(path, entry));
        const listElement = this.shadowRoot.querySelector('.file-explorer-list');
        listElement.replaceChildren(...children);
        const inputElement = this.shadowRoot.querySelector('.file-explorer-path');
        inputElement.value = path || '';
    }

    createEntryElement(path, entry) {
        const li = document.createElement('li');
        const button = document.createElement('button');
        button.textContent = entry.name || entry;
        button.addEventListener('click', () => {
            if (entry.type !== 'File') {
                this.paths.push(path);
                this.update(entry.path || entry);
            }
        });
        li.appendChild(button);
        return li;
    }

    async getDrives() {
        const response = await fetch('/filesystem/drives');
        return await response.json();
    }

    async getEntries(path) {
        const response = await fetch(`/filesystem/entries?${new URLSearchParams({ path })}`);
        return await response.json();
    }
}

customElements.define('file-explorer', FileExplorer);
