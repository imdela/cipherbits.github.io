(function(){
  "use strict";

  // Runtime strings, inlined at build time.
  const I18N = window.I18N || {};

  const STORAGE_KEY = 'cipherbits:v1';
  const THEME_KEY = 'cipherbits:theme';

  const CHARSETS = {
    lower: 'abcdefghijklmnopqrstuvwxyz',
    upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    digits: '0123456789',
    symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?'
  };
  const AMBIGUOUS = new Set(['l','1','I','O','0']);
  const SCRAMBLE_POOL = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
  const GUESSES_PER_SECOND = 1e11; // one consumer GPU at fast-hash speed
  const MAX_QUANTITY = 1000;
  const BULK_THRESHOLD = 5; // above this, passwords go to a file instead of the screen
  const MAX_NO_SEQ_ATTEMPTS = 25;
  const UNIVERSE_AGE_YEARS = 1.38e10; // ~ age of the observable universe
  const SCIENTIFIC_FROM_YEARS = 1e4;  // 10,000 years -> scientific notation
  const LANG = I18N.lang_code || 'en';

  // Thresholds on entropy bits, not crack time.
  const STRENGTH_LEVELS = [
    { maxBits: 64,  key: 'lvl_very_weak', icon: '⚠' },
    { maxBits: 80,  key: 'lvl_weak',      icon: '▲' },
    { maxBits: 128, key: 'lvl_strong',    icon: '✓' },
    { maxBits: Infinity, key: 'lvl_very_strong', icon: '✓✓' }
  ];

  const el = {
    passwordDisplay: document.getElementById('passwordDisplay'),
    outputLines: document.getElementById('outputLines'),
    placeholder: document.getElementById('placeholder'),
    entropyRow: document.getElementById('entropyRow'),
    entropyLabel: document.getElementById('entropyLabel'),
    generateBtn: document.getElementById('generateBtn'),
    copyBtn: document.getElementById('copyBtn'),
    downloadBtn: document.getElementById('downloadBtn'),
    feedback: document.getElementById('feedback'),
    optionsError: document.getElementById('optionsError'),
    lengthRange: document.getElementById('lengthRange'),
    lengthValue: document.getElementById('lengthValue'),
    optLower: document.getElementById('optLower'),
    optUpper: document.getElementById('optUpper'),
    optDigits: document.getElementById('optDigits'),
    optSymbols: document.getElementById('optSymbols'),
    symbolsCustom: document.getElementById('symbolsCustom'),
    customSymbols: document.getElementById('customSymbols'),
    optNoSimilar: document.getElementById('optNoSimilar'),
    optNoSeq: document.getElementById('optNoSeq'),
    optNoDup: document.getElementById('optNoDup'),
    optBeginLetter: document.getElementById('optBeginLetter'),
    quantity: document.getElementById('quantity'),
    quantityMinus: document.getElementById('quantityMinus'),
    quantityPlus: document.getElementById('quantityPlus'),
    optAutoClear: document.getElementById('optAutoClear'),
    optSave: document.getElementById('optSave'),
    strengthBadge: document.getElementById('strengthBadge'),
    strengthHint: document.getElementById('strengthHint'),
    themeToggle: document.getElementById('themeToggle')
  };

  let currentList = [];
  let clearClipboardTimer = null;

  function t(key){
    return I18N[key] || key;
  }

  function reducedMotion(){
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  // Rejection sampling — no modulo bias.
  function secureRandomIndex(max){
    const arr = new Uint32Array(1);
    const limit = Math.floor(0xFFFFFFFF / max) * max;
    let val;
    do {
      crypto.getRandomValues(arr);
      val = arr[0];
    } while (val >= limit);
    return val % max;
  }

  // Settings persistence (localStorage, only when opted in)
  function readSettings(){
    return {
      length: parseInt(el.lengthRange.value, 10),
      lower: el.optLower.checked,
      upper: el.optUpper.checked,
      digits: el.optDigits.checked,
      symbols: el.optSymbols.checked,
      customSymbols: el.customSymbols.value,
      noSimilar: el.optNoSimilar.checked,
      noSeq: el.optNoSeq.checked,
      noDup: el.optNoDup.checked,
      beginLetter: el.optBeginLetter.checked,
      quantity: getQuantity(),
      autoclear: !!(el.optAutoClear && el.optAutoClear.checked)
    };
  }

  function applySettings(s){
    el.lengthRange.value = s.length;
    el.lengthValue.textContent = s.length;
    el.optLower.checked = s.lower;
    el.optUpper.checked = s.upper;
    el.optDigits.checked = s.digits;
    el.optSymbols.checked = s.symbols;
    el.customSymbols.value = s.customSymbols || '';
    el.optNoSimilar.checked = s.noSimilar;
    el.optNoSeq.checked = s.noSeq;
    el.optNoDup.checked = s.noDup;
    el.optBeginLetter.checked = s.beginLetter;
    el.quantity.value = Math.min(MAX_QUANTITY, Math.max(1, s.quantity));
    if (el.optAutoClear) el.optAutoClear.checked = s.autoclear;
  }

  function loadSettings(){
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const s = JSON.parse(raw);
      if (s && typeof s === 'object' && s.length) {
        applySettings(s);
        if (el.optSave) el.optSave.checked = true;
      }
    } catch (err){
      /* corrupt or unavailable storage — start fresh */
    }
  }

  function persistSettings(){
    if (el.optSave && el.optSave.checked){
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(readSettings())); }
      catch (err) { /* storage unavailable — non-fatal */ }
    } else {
      try { localStorage.removeItem(STORAGE_KEY); } catch (err) {}
    }
  }

  // Character pool
  function charsetPool(){
    const sets = [];
    if (el.optLower.checked) sets.push(CHARSETS.lower);
    if (el.optUpper.checked) sets.push(CHARSETS.upper);
    if (el.optDigits.checked) sets.push(CHARSETS.digits);
    if (el.optSymbols.checked){
      const custom = el.customSymbols.value.trim();
      sets.push(custom.length > 0 ? custom : CHARSETS.symbols);
    }
    let pool = sets.join('');
    if (el.optNoSimilar.checked){
      pool = pool.split('').filter(c => !AMBIGUOUS.has(c)).join('');
    }
    return pool;
  }

  function activeLetters(){
    let letters = '';
    if (el.optLower.checked) letters += CHARSETS.lower;
    if (el.optUpper.checked) letters += CHARSETS.upper;
    if (el.optNoSimilar.checked) letters = letters.split('').filter(c => !AMBIGUOUS.has(c)).join('');
    return letters;
  }

  // Generation
  function samplePassword(length, pool, noDup){
    if (noDup){
      const copy = pool.split('');
      let out = '';
      for (let i = 0; i < length; i++){
        const idx = secureRandomIndex(copy.length);
        out += copy.splice(idx, 1)[0];
      }
      return out;
    }
    let out = '';
    for (let i = 0; i < length; i++){
      out += pool[secureRandomIndex(pool.length)];
    }
    return out;
  }

  function hasSequential(pwd){
    for (let i = 0; i < pwd.length - 1; i++){
      const a = pwd.charCodeAt(i);
      const b = pwd.charCodeAt(i + 1);
      const isAlnum = (a >= 48 && a <= 57) || (a >= 65 && a <= 90) || (a >= 97 && a <= 122);
      if (isAlnum && b - a === 1) return true;
    }
    return false;
  }

  function generateOne(length, pool, letters, flags){
    for (let attempt = 0; attempt < MAX_NO_SEQ_ATTEMPTS; attempt++){
      let pwd = samplePassword(length, pool, flags.noDup);
      if (flags.beginLetter && letters.length > 0){
        pwd = letters[secureRandomIndex(letters.length)] + pwd.slice(1);
      }
      if (!flags.noSeq || !hasSequential(pwd)) return pwd;
    }
    // Extremely unlikely fallback — return the last candidate.
    return samplePassword(length, pool, flags.noDup);
  }

  function validate(){
    const pool = charsetPool();
    const letters = activeLetters();
    const flags = {
      beginLetter: el.optBeginLetter.checked,
      noDup: el.optNoDup.checked,
      noSeq: el.optNoSeq.checked
    };
    const length = parseInt(el.lengthRange.value, 10);

    if (pool.length === 0){
      return { ok: false, message: t('err_no_charset') };
    }
    if (flags.beginLetter && letters.length === 0){
      return { ok: false, message: t('err_begin_letter') };
    }
    if (flags.noDup && length > pool.length){
      return { ok: false, message: t('err_dup_length') };
    }
    return { ok: true, pool, letters, flags, length };
  }

  // Rendering
  function calcEntropy(length, poolSize){
    if (poolSize <= 1) return 0;
    return length * Math.log2(poolSize);
  }

  function pluralize(unitKey, value){
    const forms = (I18N.units && I18N.units[unitKey]) || [unitKey, unitKey + 's'];
    return value >= 2 ? forms[1] : forms[0];
  }

  function strengthLevel(bits){
    for (const lvl of STRENGTH_LEVELS){
      if (bits < lvl.maxBits) return lvl;
    }
    return STRENGTH_LEVELS[STRENGTH_LEVELS.length - 1];
  }

  function toSuperscript(n){
    return String(n).split('').map(c => '⁰¹²³⁴⁵⁶⁷⁸⁹'[c]).join('');
  }

  function formatHugeYears(years){
    const exp = Math.floor(Math.log10(years));
    const mant = years / Math.pow(10, exp);
    const m = mant.toLocaleString(LANG, { maximumFractionDigits: 1 });
    const base = `~${m}×10${toSuperscript(exp)} ${pluralize('year', years)}`;
    if (years >= UNIVERSE_AGE_YEARS) return `${base} — ${t('crack_beyond_universe')}`;
    return base;
  }

  function formatCrackTime(bits){
    const avgGuesses = Math.pow(2, bits) / 2;
    const seconds = avgGuesses / GUESSES_PER_SECOND;
    const units = [
      ['century', 100 * 365.25 * 86400],
      ['year', 365.25 * 86400],
      ['day', 86400],
      ['hour', 3600],
      ['minute', 60],
      ['second', 1]
    ];
    const years = seconds / (365.25 * 86400);
    if (years >= SCIENTIFIC_FROM_YEARS) return formatHugeYears(years);
    for (const [unitKey, unitSeconds] of units){
      if (seconds >= unitSeconds){
        const value = seconds / unitSeconds;
        const rounded = value >= 100
          ? Math.round(value).toLocaleString(LANG)
          : value.toLocaleString(LANG, { maximumFractionDigits: 1 });
        return `~${rounded} ${pluralize(unitKey, value)}`;
      }
    }
    return t('crack_instant');
  }

  function animateReveal(finalPassword){
    el.outputLines.innerHTML = '';
    const spans = finalPassword.split('').map(() => document.createElement('span'));
    spans.forEach(s => el.outputLines.appendChild(s));

    if (reducedMotion()){
      finalPassword.split('').forEach((c, i) => { spans[i].textContent = c; });
      return;
    }
    finalPassword.split('').forEach((finalChar, i) => {
      let tick = 0;
      const maxTicks = 7 + i;
      const interval = setInterval(() => {
        if (tick < maxTicks - 2){
          spans[i].textContent = SCRAMBLE_POOL[Math.floor(Math.random() * SCRAMBLE_POOL.length)];
        } else {
          spans[i].textContent = finalChar;
          clearInterval(interval);
        }
        tick++;
      }, 32);
    });
  }

  function renderList(list, entropyBits){
    el.outputLines.innerHTML = '';
    el.placeholder.hidden = list.length > 0;
    el.copyBtn.hidden = false;
    if (list.length === 0) return;

    if (list.length === 1){
      animateReveal(list[0]);
    } else {
      list.forEach((pwd, i) => {
        const line = document.createElement('div');
        line.className = 'line';
        line.setAttribute('role', 'button');
        line.setAttribute('tabindex', '0');
        line.setAttribute('aria-label', `${i + 1}`);
        line.title = t('btn_copy');
        const text = document.createElement('span');
        text.textContent = pwd;
        const index = document.createElement('span');
        index.className = 'line-index';
        index.textContent = String(i + 1);
        line.appendChild(text);
        line.appendChild(index);
        line.addEventListener('click', () => copyPassword(pwd));
        line.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' '){
            e.preventDefault();
            copyPassword(pwd);
          }
        });
        el.outputLines.appendChild(line);
      });
    }

    el.entropyRow.hidden = false;
    const template = t('entropy_template');
    el.entropyLabel.innerHTML = template
      .replace('{bits}', `<strong>${Math.round(entropyBits).toLocaleString(LANG)}</strong>`)
      .replace('{time}', formatCrackTime(entropyBits));

    // role="status": announce only when the verdict changes.
    const lvl = strengthLevel(entropyBits);
    el.strengthBadge.dataset.level = lvl.key;
    el.strengthHint.dataset.level = lvl.key;
    const badgeText = `${lvl.icon} ${t(lvl.key)}`;
    if (el.strengthBadge.textContent !== badgeText){
      el.strengthBadge.textContent = badgeText;
    }
    el.strengthBadge.hidden = false;

    const curLength = parseInt(el.lengthRange.value, 10);
    const weak = (lvl === STRENGTH_LEVELS[0] || lvl === STRENGTH_LEVELS[1]);
    const hint = weak ? t('adv_weak') : (curLength < 15 ? t('hint_len_recommended') : '');
    el.strengthHint.textContent = hint;
    el.strengthHint.hidden = !hint;

    const multiple = list.length > 1;
    el.copyBtn.textContent = multiple ? t('btn_copy_all') : t('btn_copy');
    el.downloadBtn.hidden = !multiple;
  }

  function renderBulk(){
    el.outputLines.innerHTML = '';
    el.placeholder.hidden = true;
    const note = document.createElement('p');
    note.className = 'bulk-note';
    note.textContent = t('bulk_note').replace('{n}', currentList.length.toLocaleString(LANG));
    el.outputLines.appendChild(note);
    el.entropyRow.hidden = true;
    el.strengthBadge.hidden = true;
    el.strengthHint.hidden = true;
    el.strengthHint.textContent = '';
    el.copyBtn.hidden = true;
    el.downloadBtn.hidden = false;
    downloadFile();
  }

  function clearOutput(){
    el.outputLines.innerHTML = '';
    el.placeholder.hidden = false;
    el.entropyRow.hidden = true;
    el.strengthBadge.hidden = true;
    el.strengthHint.hidden = true;
    el.strengthHint.textContent = '';
    el.copyBtn.hidden = false;
    el.copyBtn.textContent = t('btn_copy');
    el.downloadBtn.hidden = true;
    currentList = [];
  }

  function downloadFile(){
    if (currentList.length === 0) return;
    const blob = new Blob([currentList.join('\n')], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'passwords.txt';
    a.click();
    URL.revokeObjectURL(url);
  }

  // Main flow — nothing is generated until the user clicks Generate.
  function generate(){
    const result = validate();
    if (!result.ok){
      el.optionsError.textContent = result.message;
      clearOutput();
      el.feedback.textContent = '';
      return;
    }
    el.optionsError.textContent = '';
    el.feedback.textContent = '';

    const quantity = getQuantity();
    const flags = { beginLetter: result.flags.beginLetter, noDup: result.flags.noDup, noSeq: result.flags.noSeq };
    const list = [];
    for (let i = 0; i < quantity; i++){
      list.push(generateOne(result.length, result.pool, result.letters, flags));
    }
    currentList = list;

    if (quantity > BULK_THRESHOLD){
      renderBulk();
    } else {
      renderList(list, calcEntropy(result.length, result.pool.length));
    }
    persistSettings();
  }

  async function copyToClipboard(text){
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (err){
      return false;
    }
  }

  function copyPassword(text){
    copyToClipboard(text).then(ok => {
      el.feedback.textContent = ok ? t('copy_success') : t('copy_fail');
      if (ok && el.optAutoClear && el.optAutoClear.checked){
        if (clearClipboardTimer) clearTimeout(clearClipboardTimer);
        clearClipboardTimer = setTimeout(async () => {
          const clip = await navigator.clipboard.readText().catch(() => null);
          if (clip === text){
            await navigator.clipboard.writeText('').catch(() => {});
          }
        }, 45000);
      }
    });
  }

  // Quantity helpers
  function getQuantity(){
    return Math.min(MAX_QUANTITY, Math.max(1, parseInt(el.quantity.value, 10) || 1));
  }

  function stepQuantity(delta){
    el.quantity.value = Math.min(MAX_QUANTITY, Math.max(1, getQuantity() + delta));
  }

  // Theme — default comes from the template, the toggle persists the choice.
  function initTheme(){
    let stored = null;
    try { stored = localStorage.getItem(THEME_KEY); } catch (err) {}
    if (stored === 'light' || stored === 'dark'){
      document.documentElement.setAttribute('data-theme', stored);
    }
  }

  function toggleTheme(){
    const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    try { localStorage.setItem(THEME_KEY, next); } catch (err) {}
  }

  // Theme toggle — shared chrome on every page.
  el.themeToggle.addEventListener('click', toggleTheme);

  // Language dropdown — one label in the header, the rest behind a toggle.
  const langCurrent = document.getElementById('langCurrent');
  const langMenu = document.getElementById('langMenu');
  if (langCurrent && langMenu){
    function setLangOpen(open){
      langMenu.hidden = !open;
      langCurrent.setAttribute('aria-expanded', String(open));
    }
    langCurrent.addEventListener('click', (e) => {
      e.stopPropagation();
      setLangOpen(langMenu.hidden);
    });
    document.addEventListener('click', () => setLangOpen(false));
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') setLangOpen(false);
    });
  }

  // The generator lives on the home page only. The engine functions above
  // are shared; only the wiring and init below are page-specific, so pages
  // without the generator (roadmap, …) can reuse this file for the chrome.
  if (el.generateBtn){
    el.generateBtn.addEventListener('click', generate);

    el.copyBtn.addEventListener('click', () => {
      if (currentList.length === 0) return;
      copyPassword(currentList.join('\n'));
    });

    el.downloadBtn.addEventListener('click', downloadFile);

    el.lengthRange.addEventListener('input', () => {
      el.lengthValue.textContent = el.lengthRange.value;
    });

    el.quantity.addEventListener('change', () => {
      el.quantity.value = getQuantity();
    });
    el.quantityMinus.addEventListener('click', () => stepQuantity(-1));
    el.quantityPlus.addEventListener('click', () => stepQuantity(1));

    el.optSymbols.addEventListener('change', syncSymbolsCustom);
    if (el.optSave) el.optSave.addEventListener('change', persistSettings);

    function syncSymbolsCustom(){
      if (el.symbolsCustom) el.symbolsCustom.hidden = !el.optSymbols.checked;
    }
    function updateLengthValue(){
      el.lengthValue.textContent = el.lengthRange.value;
    }

    loadSettings();
    syncSymbolsCustom();
    updateLengthValue();
    clearOutput();
  }

  initTheme();
})();
