document.addEventListener('DOMContentLoaded', () => {
  document.documentElement.dataset.theme = 'light';
  document.querySelectorAll('details').forEach(details => {if(details.querySelector('.errorlist')) details.open=true;});
  document.querySelectorAll('.product-sections a').forEach(link => link.addEventListener('click', () => {
    const target=document.querySelector(link.getAttribute('href')); if(target) target.querySelectorAll('details').forEach(d=>d.open=true);
  }));
});
document.addEventListener('DOMContentLoaded', () => {
  const preview = document.querySelector('.seo-preview');
  if (!preview) return;
  const name = document.querySelector('#id_name'), title = document.querySelector('#id_seo_title'), description = document.querySelector('#id_seo_description'), slug = document.querySelector('#id_slug');
  const update = () => {
    preview.querySelector('h3').textContent = title.value || `${name.value || 'Название товара'} — SexyGram`;
    preview.querySelector('p').textContent = description.value || `${name.value || 'Название товара'}. Цена и наличие в магазине SexyGram.`;
    preview.querySelector('small').textContent = `sexygram.ru / catalog / ${slug.value || 'адрес-после-сохранения'}`;
  };
  [name,title,description,slug].forEach(field=>field.addEventListener('input',update));
});
document.addEventListener('DOMContentLoaded', () => {
  function updateAttribute(select) {
    const option=select.selectedOptions[0];
    if(!option?.dataset.kind) return;
    const row=select.closest('tr');
    const old=row?.querySelector('.field-value input, .field-value select');
    if(!old) return;
    const kind=option.dataset.kind;
    const input=document.createElement(kind==='choice'||kind==='boolean'?'select':'input');
    input.name=old.name;input.id=old.id;
    if(input.tagName==='SELECT') {
      const values=kind==='boolean'?['да','нет']:JSON.parse(option.dataset.options||'[]');
      [''].concat(values).forEach(value=>{const item=document.createElement('option');item.value=value;item.textContent=value||'Выберите значение';input.append(item);});
    } else {input.type=kind==='number'?'number':'text';input.maxLength=500;if(kind==='number')input.step='any';}
    input.value=old.value;
    old.replaceWith(input);
  }
  document.querySelectorAll('select[name$="-attribute"]').forEach(updateAttribute);
  document.addEventListener('change',event=>{if(event.target.matches('select[name$="-attribute"]'))updateAttribute(event.target);});
});
document.addEventListener('DOMContentLoaded',()=>{
  document.querySelectorAll('.product-filters details').forEach(details=>{details.open=false;});
});
document.addEventListener('DOMContentLoaded', () => {
  const oldPrice = document.querySelector('#id_old_price');
  const price = document.querySelector('#id_price');
  const preview = document.querySelector('#discount-preview');
  if (!oldPrice || !price || !preview) return;
  const money = new Intl.NumberFormat('ru-RU', {maximumFractionDigits: 2});
  const cents = value => {
    const text = value.trim().replace(',', '.');
    if (!/^\d+(\.\d{1,2})?$/.test(text)) return null;
    const amount = Number(text);
    if (!Number.isFinite(amount) || amount > 9999999999.99) return null;
    return Math.round(amount * 100);
  };
  const update = () => {
    if (!oldPrice.value) {
      preview.textContent = 'Без скидки. Чтобы добавить её, укажите цену до скидки.';
      return;
    }
    const before = cents(oldPrice.value), current = cents(price.value);
    if (before === null || current === null || before <= 0) {
      preview.textContent = 'Укажите обе цены в рублях, с точностью до копеек.';
      return;
    }
    if (before < current) {
      preview.textContent = 'Цена до скидки должна быть не ниже цены продажи.';
      return;
    }
    const amount = before - current;
    const percent = Math.round(amount * 1000 / before) / 10;
    preview.textContent = `${money.format(percent)}% · ${money.format(amount / 100)} ₽`;
  };
  [oldPrice, price].forEach(input => input.addEventListener('input', update));
  update();
});
document.addEventListener('DOMContentLoaded', () => {
  const error = document.querySelector('.errornote');
  if (error) {
    document.querySelectorAll('.form-row.errors details').forEach(details => {details.open = true;});
    error.setAttribute('tabindex', '-1');
    error.focus();
    error.scrollIntoView({block: 'start'});
  }
  const group = document.querySelector('#photos-group');
  if (!group) return;
  const rows = () => Array.from(group.querySelectorAll('tbody tr')).filter(row => row.querySelector('input[name$="-position"]') && !row.classList.contains('empty-form'));
  const renumber = () => {
    rows().forEach((row, index) => {row.querySelector('input[name$="-position"]').value = index;});
    const first = document.querySelector('#id_main_photo');
    if(first) first.value = '';
  };
  rows().forEach(row => {
    const cell = row.querySelector('.field-position');
    ['В начало', 'В конец'].forEach((text, index) => {
      const button = document.createElement('button');
      button.type = 'button';button.className = 'media-order-button';button.textContent = text;
      button.addEventListener('click', () => {
        const list = rows();
        if(index === 0) list[0].before(row); else list[list.length - 1].after(row);
        renumber();
      });
      cell.append(button);
    });
  });
});
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.product-filters details').forEach(details => {
    const selected = details.querySelector('li.selected a');
    const summary = details.querySelector('summary');
    if (selected && summary) summary.textContent = `${details.dataset.filterTitle}: ${selected.textContent.trim()}`;
  });
  if (!document.body.classList.contains('model-product')) return;
  const actions = document.querySelector('#changelist .actions');
  if (!actions) return;
  const scope = document.createElement('span');
  scope.className = 'action-scope'; scope.setAttribute('aria-live', 'polite');
  actions.append(scope);
  const update = () => {
    const all = document.querySelector('input[name="select_across"]')?.value === '1';
    const count = document.querySelectorAll('input.action-select:checked').length;
    const text = all ? 'Область: все результаты текущего поиска и фильтров' : `Выбрано на текущей странице: ${count}`;
    if (scope.textContent !== text) scope.textContent = text;
  };
  new MutationObserver(update).observe(actions, {subtree:true,childList:true,attributes:true,characterData:true});
  document.querySelector('#changelist-form')?.addEventListener('change', update);
  update();
});
