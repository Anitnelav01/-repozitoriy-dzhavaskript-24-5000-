export default class UserList {
  constructor(element) {
    this.element = element;
    this.items = new Set();
  }

  buildDOM() {
    const fragment = document.createDocumentFragment();

    this.element.innerHTML = '';

    for (const name of this.items) {
      const element = document.createElement('div');


      element.classList.add('user-list-item');
      element.innerHTML = `
        <div class="user-item-left">
            <div
            style="background-image: url(/mega-chat-3/photos/${name}.png?t=${Date.now()})" 
            class="user-item-photo" data-role="user-avatar" data-user=${name}></div>
        </div>
        <div class="user-item-right">${name}
        </div>`;

      fragment.append(element);
    }
    this.element.append(fragment);
  }

  add(name) {
    this.items.add(name);
    this.buildDOM();
  }

  remove(name) {
    this.items.delete(name);
    this.buildDOM();
  }
}
