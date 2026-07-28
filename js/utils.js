/* Shared constants and helpers, exposed on the window.DR namespace.
   Classic script (no ES modules) so the tool keeps working when opened via file://. */
window.DR = (function(){
  "use strict";

  var REM = 16;               // 1rem = 16px
  var PX_TO_PT = 72 / 96;     // 0.75 (screen 96dpi)

  function $(s, c){ return (c || document).querySelector(s); }
  function $$(s, c){ return Array.prototype.slice.call((c || document).querySelectorAll(s)); }

  /* Format a number with trailing zeros stripped */
  function fmt(n, d){
    var s = n.toFixed(d === undefined ? 3 : d);
    return s.replace(/\.?0+$/, '') || '0';
  }

  /* Escape user-provided text before injecting it with innerHTML */
  function escapeHtml(s){
    return String(s).replace(/[&<>"']/g, function(ch){
      return { '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[ch];
    });
  }

  var toastTimer = null;
  function toast(msg){
    var t = $('#toast');
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function(){ t.classList.remove('show'); }, 1400);
  }

  function copyText(txt, label){
    function done(){ toast('Copied: ' + (label || txt)); }
    function fallback(){
      var ta = document.createElement('textarea');
      ta.value = txt; ta.style.position = 'fixed'; ta.style.opacity = '0';
      document.body.appendChild(ta); ta.select();
      try{ document.execCommand('copy'); done(); }catch(e){}
      document.body.removeChild(ta);
    }
    if(navigator.clipboard && navigator.clipboard.writeText){
      navigator.clipboard.writeText(txt).then(done, function(){ fallback(); });
    } else fallback();
  }

  /* Wire a segmented control; returns a getter for the active value */
  function seg(id, onChange){
    var el = $(id);
    el.addEventListener('click', function(e){
      var b = e.target.closest('button'); if(!b) return;
      $$('button', el).forEach(function(x){ x.classList.remove('active'); });
      b.classList.add('active');
      onChange(b.dataset.v);
    });
    return function(){ return $('button.active', el).dataset.v; };
  }

  return {
    REM: REM,
    PX_TO_PT: PX_TO_PT,
    $: $,
    $$: $$,
    fmt: fmt,
    escapeHtml: escapeHtml,
    toast: toast,
    copyText: copyText,
    seg: seg
  };
})();
