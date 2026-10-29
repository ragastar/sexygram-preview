(() => {
  "use strict";
  function setup(root) {
    const input = root.querySelector('input[type="file"]');
    const previews = root.querySelector('.sg-photo-previews');
    const status = root.querySelector('.sg-photo-status');
    if (!input || input.dataset.ready) return;
    input.dataset.ready = '1';
    input.accept = 'image/*,video/mp4,video/webm,.mp4,.webm';
    let selected = [];
    let objectUrls = [];
    const button = (label, handler, disabled = false) => {
      const element = document.createElement('button');
      element.type = 'button';
      element.textContent = label;
      element.disabled = disabled;
      element.addEventListener('click', handler);
      return element;
    };
    function render(sync = false) {
      if (sync) {
        const transfer = new DataTransfer();
        selected.forEach(file => transfer.items.add(file));
        input.files = transfer.files;
      }
      objectUrls.forEach(url => URL.revokeObjectURL(url));
      objectUrls = [];
      previews.replaceChildren();
      const total = selected.reduce((size, file) => size + file.size, 0);
      status.textContent = selected.length ? `Выбрано файлов: ${selected.length}. Размер: ${(total / 1048576).toFixed(1)} МБ.` : '';
      let error = '';
      if (selected.length > 12) error = 'Можно добавить не больше 12 файлов за один раз.';
      else if (selected.some(file => !/\.(mp4|webm)$/i.test(file.name) && file.size > 8388608)) error = 'Одно из фото больше 8 МБ.';
      else if (total > 20971520) error = 'Общий размер больше 20 МБ. Уберите часть фото.';
      input.setCustomValidity(error);
      if (error) status.textContent += ' ' + error;
      selected.forEach((file, index) => {
        const card = document.createElement('div');
        card.className = 'sg-photo-card';
        const url = URL.createObjectURL(file);
        objectUrls.push(url);
        const isVideo = /\.(mp4|webm)$/i.test(file.name);
        const image = document.createElement(isVideo ? 'video' : 'img');
        if (isVideo) {image.controls = true; image.preload = 'metadata';}
        image.src = url;
        image.alt = file.name;
        const caption = document.createElement('p');
        caption.textContent = `${index + 1}. ${file.name}`;
        const controls = document.createElement('div');
        controls.className = 'sg-photo-controls';
        controls.append(
          button('←', () => { [selected[index - 1], selected[index]] = [selected[index], selected[index - 1]]; render(true); }, index === 0),
          button('→', () => { [selected[index + 1], selected[index]] = [selected[index], selected[index + 1]]; render(true); }, index === selected.length - 1),
          button('Убрать', () => { selected.splice(index, 1); render(true); })
        );
        controls.children[0].setAttribute('aria-label', `Переместить файл ${index + 1} раньше`);
        controls.children[1].setAttribute('aria-label', `Переместить файл ${index + 1} позже`);
        card.append(image, caption, controls);
        previews.append(card);
      });
    }
    input.addEventListener('change', () => { selected = Array.from(input.files); render(); });
    input.form?.addEventListener('reset', () => { selected = []; render(); });
  }
  function init() { document.querySelectorAll('.sg-photo-picker').forEach(setup); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
