/* Public, read-only content rendering. Authentication and writes live in Pages CMS. */
(() => {
  'use strict';
  const root = new URL('../', document.currentScript.src);
  const text = value => typeof value === 'string' ? value.slice(0, 20000) : '';
  const items = value => Array.isArray(value) ? value.slice(0, 100) : [];
  const object = value => value && typeof value === 'object' && !Array.isArray(value) ? value : {};
  const q = selector => document.querySelector(selector);
  const qa = selector => document.querySelectorAll(selector);

  function linkURL(value) {
    const raw = text(value).trim();
    if (!raw || /[\u0000-\u0020\u007f\\]/.test(raw)) return null;
    try {
      const url = new URL(raw);
      if (url.username || url.password) return null;
      if (url.protocol === 'https:' && url.hostname) return url.href;
      if (url.protocol === 'mailto:' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(url.pathname) && !/%0[ad]/i.test(raw)) return url.href;
    } catch { /* Invalid links are omitted. */ }
    return null;
  }

  function assetURL(value, extensions) {
    const raw = text(value).trim();
    if (!raw || /[\u0000-\u001f\u007f\\?#:]/.test(raw) || raw.startsWith('/')) return null;
    try {
      const decoded = decodeURIComponent(raw);
      if (decoded.split('/').some(part => part === '..' || part === '.') || /[\\?#:\u0000-\u001f]/.test(decoded)) return null;
      const url = new URL(raw, root);
      if (url.origin !== root.origin || !url.pathname.startsWith(root.pathname)) return null;
      if (!extensions.some(ext => url.pathname.toLowerCase().endsWith('.' + ext))) return null;
      return url.href;
    } catch { return null; }
  }

  function setText(selector, value) {
    if (typeof value !== 'string') return;
    qa(selector).forEach(el => { el.textContent = text(value); el.classList.add('cms-multiline'); });
  }
  function el(tag, className, value) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (value !== undefined) { node.textContent = text(value); node.classList.add('cms-multiline'); }
    return node;
  }
  function link(value, className = 'quiet-link') {
    const entry = object(value);
    const href = linkURL(entry.url);
    if (entry.enabled === false || !href || !text(entry.label).trim()) return null;
    const node = el('a', className, entry.label);
    node.href = href;
    node.rel = 'noopener noreferrer';
    return node;
  }
  function list(selector, values) {
    if (!Array.isArray(values)) return;
    q(selector).replaceChildren(...items(values).filter(v => text(v).trim()).map(v => el('li', '', v)));
  }
  function assetLinks(selector, value, extensions) {
    if (typeof value !== 'string') return;
    const href = assetURL(value, extensions);
    qa(selector).forEach(node => {
      node.hidden = !href;
      if (href) node.setAttribute(node.tagName === 'IMG' ? 'src' : 'href', href);
      else node.removeAttribute(node.tagName === 'IMG' ? 'src' : 'href');
    });
  }

  function render(data) {
    if (!data || typeof data !== 'object' || Array.isArray(data) || !data.profile) throw new Error('Invalid website content');
    const p = object(data.profile);
    setText('#name', p.heading);
    setText('.brand-label', p.name);
    setText('.tagline', p.tagline);
    setText('.role', p.role);
    setText('.intro', p.intro);
    if (text(p.name)) q('.brand').setAttribute('aria-label', text(p.name) + ', back to top');
    if (text(p.pageTitle)) document.title = text(p.pageTitle);
    if (typeof p.description === 'string') q('meta[name="description"]').content = text(p.description);
    assetLinks('.portrait img', p.portrait, ['png','jpg','jpeg','webp']);
    if (typeof p.portraitAlt === 'string') q('.portrait img').alt = text(p.portraitAlt);
    assetLinks('a[href$=".pdf"]', p.cv, ['pdf']);
    assetLinks('a[href$=".vcf"]', p.contactFile, ['vcf']);
    assetLinks('[data-cv-scan], #cv-scan-dialog img, #cv-scan-dialog a[download]', p.cvQr, ['png','jpg','jpeg','webp']);
    const email = text(p.email).trim();
    if (/^[A-Za-z0-9.!#$%&'*+/=?^_`{|}~-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(email)) {
      q('.email-link').href = 'mailto:' + email;
      q('.email-link').textContent = email;
      q('#contact .actions > a').href = 'mailto:' + email + '?subject=' + encodeURIComponent(text(object(data.contact).subject));
    }
    const siteURL = linkURL(p.siteUrl);
    if (siteURL && siteURL.startsWith('https:')) {
      q('.site-address').href = siteURL;
      q('.site-address').textContent = siteURL.replace(/^https:\/\//, '');
    }
    if (Array.isArray(p.links)) {
      // Only replace the social links: preserve the contact download and its listeners.
      qa('.hero .actions > a').forEach(node => node.remove());
      const actions = q('.hero .actions');
      const first = actions.firstChild;
      items(p.links).forEach(entry => {
        const node = link(entry, 'button button-secondary');
        if (node) actions.insertBefore(node, first);
      });
    }
    list('.journey ol', data.journey);

    const work = object(data.work);
    q('#work').hidden = work.enabled === false;
    q('.nav a[href="#work"]').hidden = work.enabled === false;
    setText('#work-title', work.title);
    setText('.other-work', work.note);
    if (Array.isArray(work.projects)) {
      const projects = items(work.projects).map(object).filter(item => item.enabled !== false && text(item.title).trim()).map(item => {
        const card = el('article', 'project' + (item.highlight === true ? ' award' : ''));
        card.append(el('p','section-label',item.label), el('h3','',item.title), el('p','',item.description));
        if (items(item.tags).length) {
          const tags = el('ul','tags');
          tags.setAttribute('aria-label','Project themes');
          tags.append(...items(item.tags).map(tag => el('li','',tag)));
          card.append(tags);
        }
        const more = link({label:item.linkLabel,url:item.url});
        if (more) card.append(more);
        if (text(item.note)) card.append(el('span','award-note',item.note));
        return card;
      });
      q('.work-grid').replaceChildren(...projects);
    }
    const about = object(data.about);
    q('#about').hidden = about.enabled === false;
    q('.nav a[href="#about"]').hidden = about.enabled === false;
    setText('#about-title',about.title);
    setText('#about > div:first-child .section-copy',about.text);
    list('.interest-list',about.interests);
    setText('.opportunity h2',about.opportunityTitle);
    setText('.opportunity .section-copy',about.opportunityText);
    if (typeof about.opportunityUrl === 'string') {
      const more = link({label:about.opportunityLinkLabel,url:about.opportunityUrl});
      q('.opportunity > a')?.remove();
      if (more) q('.opportunity').append(more);
    }
    const conversation = object(data.conversation);
    q('.icebreaker').hidden = conversation.enabled === false;
    setText('.icebreaker > p',conversation.title);
    if (Array.isArray(conversation.links)) {
      q('.icebreaker ul').replaceChildren(...items(conversation.links).map(entry => {
        const a = link(entry);
        if (!a) return null;
        const li = el('li'); li.append(a); return li;
      }).filter(Boolean));
    }
    const contact = object(data.contact);
    setText('#contact-title',contact.title);
    setText('#contact > div:first-child > .section-copy',contact.text);
    if (typeof contact.buttonLabel === 'string') q('#contact .actions > a').firstChild.textContent = text(contact.buttonLabel) + ' ';
    setText('footer > span',text(p.name) + ' · ' + text(p.tagline).replace(/\n/g,' '));
    if (Array.isArray(data.sections)) {
      q('#extra-sections').replaceChildren(...items(data.sections).map(object).filter(item => item.enabled !== false && text(item.title).trim()).map((item,index) => {
        const section = el('section','content-section extra-section');
        const title = el('h2','section-heading',item.title);
        title.id = 'extra-heading-' + index;
        section.setAttribute('aria-labelledby',title.id);
        section.append(el('p','section-label',item.label),title,el('p','section-copy',item.text));
        const links = items(item.links).map(entry => link(entry,'button button-secondary')).filter(Boolean);
        if (links.length) { const actions = el('div','actions'); actions.append(...links); section.append(actions); }
        return section;
      }));
    }
  }
  fetch(new URL('content/site.json', root), {credentials:'omit', cache:'no-cache'})
    .then(response => { if (!response.ok) throw new Error('Content unavailable'); return response.json(); })
    .then(render)
    .catch(() => { console.warn('Website content could not be loaded; showing the saved HTML version.'); });
})();
