/* Type Scale tool: scale list, live page preview and resizable splitter. */
(function(){
  "use strict";
  var $ = DR.$, fmt = DR.fmt, seg = DR.seg, escapeHtml = DR.escapeHtml,
      REM = DR.REM, PX_TO_PT = DR.PX_TO_PT;

  var LEVELS = [
    {tag:'h1', exp:6}, {tag:'h2', exp:5}, {tag:'h3', exp:4},
    {tag:'h4', exp:3}, {tag:'h5', exp:2}, {tag:'h6', exp:1},
    {tag:'p', exp:0}, {tag:'small', exp:-1}, {tag:'tiny', exp:-2}
  ];
  var SAMPLE = 'The quick brown fox jumps over the lazy dog';
  var samples = {}; LEVELS.forEach(function(l){ samples[l.tag] = SAMPLE; });

  var unit = 'rem';
  seg('#ts-unit', function(v){ unit = v; renderScale(); });

  var ids = ['ts-basesize','ts-scale','ts-custom','ts-font','ts-bodyweight','ts-bodylh','ts-headfont','ts-headweight','ts-headlh','ts-headls'];
  ids.forEach(function(id){
    $('#' + id).addEventListener('input', function(){
      if(id === 'ts-scale'){
        $('#ts-custom-wrap').style.display = ($('#ts-scale').value === 'custom') ? '' : 'none';
      }
      renderScale();
    });
  });

  function getRatio(){
    var v = $('#ts-scale').value;
    if(v === 'custom') return parseFloat($('#ts-custom').value) || 1.2;
    return parseFloat(v);
  }
  function getCfg(){
    return {
      base: parseFloat($('#ts-basesize').value) || 16,
      ratio: getRatio(),
      font: $('#ts-font').value,
      bodyWeight: $('#ts-bodyweight').value,
      bodyLh: parseFloat($('#ts-bodylh').value) || 1.6,
      headFont: $('#ts-headfont').value,
      headWeight: $('#ts-headweight').value,
      headLh: parseFloat($('#ts-headlh').value) || 1.15,
      headLs: parseFloat($('#ts-headls').value) || 0
    };
  }
  function sizeLabel(px){
    if(unit === 'px') return fmt(px, 2) + 'px';
    if(unit === 'pt') return fmt(px * PX_TO_PT, 2) + 'pt';
    return fmt(px / REM, 3) + 'rem';
  }

  function renderScale(){
    var c = getCfg();
    $('#ts-rows').innerHTML = LEVELS.map(function(l){
      var px = c.base * Math.pow(c.ratio, l.exp);
      var isHead = l.exp > 0;
      var style = 'font-size:' + fmt(px, 3) + 'px;' +
        'font-family:' + (isHead ? (c.headFont === 'inherit' ? c.font : c.headFont) : c.font) + ';' +
        'font-weight:' + (isHead ? c.headWeight : c.bodyWeight) + ';' +
        'line-height:' + (isHead ? c.headLh : c.bodyLh) + ';' +
        (isHead && c.headLs ? 'letter-spacing:' + c.headLs + 'em;' : '') +
        (l.tag === 'tiny' ? 'color:var(--text-3);' : '');
      return '<div class="ts-row">' +
        '<div class="ts-meta" data-px="' + fmt(px, 3) + '" title="Click to copy">' +
          '<span class="ts-tag">' + l.tag + '</span>' +
          '<span class="ts-size">' + sizeLabel(px) + '</span>' +
        '</div>' +
        '<div class="ts-sample" contenteditable="true" spellcheck="false" data-tag="' + l.tag + '" style="' + style + '">' + escapeHtml(samples[l.tag]) + '</div>' +
      '</div>';
    }).join('');
    renderPreview();
  }

  /* ---------- page preview (landing / blog) ---------- */
  var TPL = {
    landing:
      '<header class="pv-nav"><strong>Northwind</strong><span>Features · Pricing · Docs · Contact</span></header>' +
      '<section class="pv-hero">' +
        '<h1>Ship consistent interfaces, faster</h1>' +
        '<p>Northwind gives your team a shared rhythm for spacing and typography, so every screen feels like it belongs to the same product.</p>' +
        '<p><span class="pv-btn primary">Get started</span><span class="pv-btn">See how it works</span></p>' +
      '</section>' +
      '<section>' +
        '<h2>Why teams choose it</h2>' +
        '<div class="pv-cards">' +
          '<div><h3>Modular scale</h3><p>Every size derives from one ratio, keeping hierarchy predictable across pages.</p></div>' +
          '<div><h3>Design tokens</h3><p>Export the whole system as CSS variables and drop it into any codebase.</p></div>' +
          '<div><h3>Works offline</h3><p>A single HTML file with zero dependencies — open it anywhere, anytime.</p></div>' +
        '</div>' +
      '</section>' +
      '<footer class="pv-foot"><small>© 2026 Northwind Labs — Terms · Privacy</small></footer>',
    blog:
      '<article class="pv-article">' +
        '<small>Design systems · March 2026 · 6 min read</small>' +
        '<h1>Choosing a type scale that holds up in real layouts</h1>' +
        '<p class="pv-lede">A modular scale looks tidy in a spec sheet, but the real test is how it behaves inside navigation bars, cards and long-form text.</p>' +
        '<p>Most teams pick a ratio, generate nine sizes and move on. Then the h1 wraps awkwardly on mobile, captions become unreadable, and buttons inherit sizes that were never meant for them.</p>' +
        '<h2>Start from the body size</h2>' +
        '<p>Body text is where readers spend their time, so lock it first — usually 16 to 18px — and let the ratio grow the headings from there instead of designing the hero headline first.</p>' +
        '<blockquote>“The scale is not the system. The system is how the scale survives contact with content.”</blockquote>' +
        '<h3>Test with real content</h3>' +
        '<p>Preview the scale against the kind of pages you actually ship:</p>' +
        '<ul>' +
          '<li>A landing page with a hero and feature cards</li>' +
          '<li>A long-form article with quotes and lists</li>' +
          '<li>Dense UI like tables and sidebars</li>' +
        '</ul>' +
        '<p>If the hierarchy still reads clearly in all three, the ratio is right. If not, adjust the ratio — not the individual sizes.</p>' +
        '<p><small>Filed under typography, design tokens</small></p>' +
      '</article>'
  };

  var layout = 'below', device = 'desktop';
  seg('#pv-layout', function(v){ layout = v; updateLayout(); });
  seg('#ts-device', function(v){ device = v; updateLayout(); });
  $('#pv-tpl').addEventListener('input', renderPreview);

  function renderPreview(){
    var c = getCfg(), f = $('#pv-frame');
    function px(exp){ return fmt(c.base * Math.pow(c.ratio, exp), 3) + 'px'; }
    ['h1','h2','h3','h4','h5','h6'].forEach(function(t, i){ f.style.setProperty('--pv-' + t, px(6 - i)); });
    f.style.setProperty('--pv-p', px(0));
    f.style.setProperty('--pv-small', px(-1));
    f.style.setProperty('--pv-body-font', c.font);
    f.style.setProperty('--pv-head-font', c.headFont === 'inherit' ? c.font : c.headFont);
    f.style.setProperty('--pv-body-weight', c.bodyWeight);
    f.style.setProperty('--pv-head-weight', c.headWeight);
    f.style.setProperty('--pv-body-lh', c.bodyLh);
    f.style.setProperty('--pv-head-lh', c.headLh);
    f.style.setProperty('--pv-head-ls', c.headLs + 'em');
    $('#pv-page').innerHTML = TPL[$('#pv-tpl').value];
  }

  /* per-layout splitter position (% of the first pane), kept while the page is open */
  var splitPct = { below:50, side:50 };

  function updateLayout(){
    var body = $('#ts-body');
    body.classList.toggle('side', layout === 'side');
    body.classList.toggle('below', layout !== 'side');
    body.style.setProperty('--split', splitPct[layout] + '%');
    $('#ts-splitter').setAttribute('aria-orientation', layout === 'side' ? 'vertical' : 'horizontal');
    $('#pv-frame').classList.toggle('mobile', device === 'mobile');
  }

  /* ---------- resizable splitter (drag + arrow keys) ---------- */
  (function(){
    var sp = $('#ts-splitter'), body = $('#ts-body');
    function setPct(p){
      p = Math.min(80, Math.max(20, p));
      splitPct[layout] = p;
      body.style.setProperty('--split', p + '%');
    }
    sp.addEventListener('pointerdown', function(e){
      e.preventDefault();
      try{ sp.setPointerCapture(e.pointerId); }catch(err){}
      sp.classList.add('dragging');
      function move(ev){
        var r = body.getBoundingClientRect();
        var p = (layout === 'side')
          ? (ev.clientX - r.left) / r.width * 100
          : (ev.clientY - r.top) / r.height * 100;
        setPct(p);
      }
      function up(){
        sp.classList.remove('dragging');
        sp.removeEventListener('pointermove', move);
        sp.removeEventListener('pointerup', up);
        sp.removeEventListener('pointercancel', up);
      }
      sp.addEventListener('pointermove', move);
      sp.addEventListener('pointerup', up);
      sp.addEventListener('pointercancel', up);
    });
    sp.addEventListener('keydown', function(e){
      var step = e.shiftKey ? 10 : 2;
      if(e.key === 'ArrowLeft' || e.key === 'ArrowUp'){ setPct(splitPct[layout] - step); e.preventDefault(); }
      else if(e.key === 'ArrowRight' || e.key === 'ArrowDown'){ setPct(splitPct[layout] + step); e.preventDefault(); }
    });
  })();

  /* ---------- fullscreen preview ---------- */
  $('#ts-fullscreen').addEventListener('click', function(){ $('#ts-preview').classList.add('fullscreen'); });
  $('#pv-close').addEventListener('click', function(){ $('#ts-preview').classList.remove('fullscreen'); });
  document.addEventListener('keydown', function(e){
    if(e.key === 'Escape') $('#ts-preview').classList.remove('fullscreen');
  });

  /* ---------- copy a size / keep edited samples ---------- */
  $('#ts-rows').addEventListener('click', function(e){
    var m = e.target.closest('.ts-meta'); if(!m) return;
    var px = parseFloat(m.dataset.px), val;
    if(unit === 'px')      val = fmt(px, 2) + 'px';
    else if(unit === 'pt') val = fmt(px * PX_TO_PT, 2) + 'pt';
    else                   val = fmt(px / REM, 4) + 'rem';
    DR.copyText(val);
  });
  $('#ts-rows').addEventListener('input', function(e){
    var s = e.target.closest('.ts-sample'); if(!s) return;
    samples[s.dataset.tag] = s.textContent;
  });

  /* ---------- CSS export ---------- */
  $('#ts-export').addEventListener('click', function(){
    var c = getCfg();
    var lines = LEVELS.map(function(l){
      var px = c.base * Math.pow(c.ratio, l.exp);
      var name = l.tag === 'p' ? 'base' : l.tag;
      return '  --text-' + name + ': ' + fmt(px / REM, 4) + 'rem; /* ' + fmt(px, 2) + 'px */';
    });
    var css = ':root {\n' +
      '  /* scale ' + fmt(c.ratio, 3) + ' · base ' + c.base + 'px */\n' +
      lines.join('\n') + '\n\n' +
      '  --font-body: ' + c.font + ';\n' +
      '  --font-heading: ' + (c.headFont === 'inherit' ? c.font : c.headFont) + ';\n' +
      '  --leading-body: ' + c.bodyLh + ';\n' +
      '  --leading-heading: ' + c.headLh + ';\n' +
      '  --tracking-heading: ' + c.headLs + 'em;\n' +
      '  --weight-body: ' + c.bodyWeight + ';\n' +
      '  --weight-heading: ' + c.headWeight + ';\n' +
      '}';
    DR.openModal('Type scale — ' + fmt(c.ratio, 3) + ' / ' + c.base + 'px', css);
  });

  /* init */
  renderScale();
  updateLayout();
})();
