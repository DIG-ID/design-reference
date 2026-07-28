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

  /* ---------- tabs ---------- */
  $$('.tab-btn').forEach(function(btn){
    btn.addEventListener('click', function(){
      $$('.tab-btn').forEach(function(b){ b.classList.remove('active'); b.setAttribute('aria-selected', 'false'); });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');
      $$('.panel').forEach(function(p){ p.classList.remove('active'); });
      $('#panel-' + btn.dataset.tab).classList.add('active');
    });
  });

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
