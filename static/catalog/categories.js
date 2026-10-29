(() => {
  'use strict';
  function init() {
    document.querySelectorAll('.sg-category-picker').forEach(root => {
      const search = root.querySelector('.sg-category-search');
      const labels = Array.from(root.querySelectorAll('.sg-category-options label'));
      const empty = root.querySelector('.sg-category-empty');
      const count = root.querySelector('.sg-category-count');
      function update() {
        const term = search.value.toLocaleLowerCase().trim();
        let matches = 0, selectedCount = 0;
        labels.forEach(label => {
          const input = label.querySelector('input[type="checkbox"]');
          if (!input) return;
          const path = input.dataset.path || label.textContent;
          const match = path.toLocaleLowerCase().includes(term);
          label.parentElement.hidden = !match && !input.checked;
          if (match) matches++;
          if (input.checked) selectedCount++;
        });
        count.textContent = selectedCount ? `Выбрано: ${selectedCount}` : 'Не выбрано';
        empty.hidden = matches !== 0 || !term;
      }
      search.addEventListener('input', update);
      root.addEventListener('change', update);
      root.querySelector('.sg-category-done').addEventListener('click', () => {root.open = false; root.querySelector('summary').focus();});
      update();
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
