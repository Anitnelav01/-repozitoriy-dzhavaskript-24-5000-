export default class UserPhoto {
  constructor(element, onUpload,uploadBtn) {
    this.element = element;
    this.onUpload = onUpload;
    this.uploadBtn = uploadBtn;

    this.element.addEventListener('dragover', (e) => {
      if (e.dataTransfer.items.length && e.dataTransfer.items[0].kind === 'file') {
        e.preventDefault();
      }
    });

    this.element.addEventListener('drop', (e) => {
      const file = e.dataTransfer.items[0].getAsFile();
      const reader = new FileReader();

      reader.readAsDataURL(file);
      reader.addEventListener('load', () => this.onUpload(reader.result));
      e.preventDefault();
    });
    this.uploadBtn.addEventListener('submit', (e) => {
      e.preventDefault();
      var url = document.querySelector('[data-role="preview"]').style.backgroundImage;
      url = url.substring(4, url.length-1);
      this.onUpload(url);
    })
  }

  set(photo) {
    this.element.style.backgroundImage = `url(${photo})`;
  }
}
