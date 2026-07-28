/* App shell: theme toggle, tab switching and the CSS-export modal. */
(function(){
  "use strict";
  var $ = DR.$, $$ = DR.$$;

  /* ---------- theme toggle ---------- */
  $('#theme-toggle').addEventListener('click', function(){
    var next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    try{ localStorage.setItem('theme', next); }catch(e){}
  });

  /* ---------- tabs (with hash deep-linking, e.g. index.html#playbook) ---------- */
  var TABS = $$('.tab-btn').map(function(b){ return b.dataset.tab; });

  function activateTab(name){
    if(TABS.indexOf(name) === -1) name = TABS[0];
    $$('.tab-btn').forEach(function(b){
      var on = b.dataset.tab === name;
      b.classList.toggle('active', on);
      b.setAttribute('aria-selected', on ? 'true' : 'false');
    });
    $$('.panel').forEach(function(p){ p.classList.remove('active'); });
    $('#panel-' + name).classList.add('active');
  }

  /* A click just updates the hash; the hashchange handler does the switching,
     so deep-links, clicks and the back/forward buttons all go through one path. */
  $$('.tab-btn').forEach(function(btn){
    btn.addEventListener('click', function(){ location.hash = btn.dataset.tab; });
  });
  window.addEventListener('hashchange', function(){
    activateTab((location.hash || '').replace(/^#/, ''));
  });
  // honour a hash present on first load, otherwise keep the default tab
  if(location.hash) activateTab(location.hash.replace(/^#/, ''));

  /* ---------- modal (CSS export) ---------- */
  function openModal(title, code){
    $('#modal-title').textContent = title;
    $('#modal-code').textContent = code;
    $('#modal').classList.add('open');
  }
  DR.openModal = openModal;

  $('#modal-close').addEventListener('click', function(){ $('#modal').classList.remove('open'); });
  $('#modal').addEventListener('click', function(e){
    if(e.target.id === 'modal') $('#modal').classList.remove('open');
  });
  $('#modal-copy').addEventListener('click', function(){
    DR.copyText($('#modal-code').textContent, 'CSS variables');
  });
  document.addEventListener('keydown', function(e){
    if(e.key === 'Escape') $('#modal').classList.remove('open');
  });
})();
