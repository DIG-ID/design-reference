/* Spacing Grid tool: renders the values table, copy-on-click and CSS export. */
(function(){
  "use strict";
  var $ = DR.$, fmt = DR.fmt, seg = DR.seg, REM = DR.REM, PX_TO_PT = DR.PX_TO_PT;

  /* Curated design-system scales (px) */
  var CURATED = {
    4:[4,8,12,16,20,24,28,32,36,40,44,48,56,64,72,80,96,112,128,144,160,192,224,256,320,384,448,512],
    8:[8,16,24,32,40,48,56,64,72,80,96,112,128,160,192,224,256,320,384,448,512],
    16:[16,32,48,64,80,96,112,128,160,192,224,256,320,384,448,512]
  };
  var MILESTONES = [16,32,48,64,96,128,192,256,384,512]; // visually anchor rows

  var state = { base:4, mode:'curated', shape:'bar', copy:'px' };

  seg('#sp-base',     function(v){ state.base = +v; render(); });
  seg('#sp-mode',     function(v){ state.mode = v;  render(); });
  seg('#sp-shape',    function(v){ state.shape = v; render(); });
  seg('#sp-copyunit', function(v){ state.copy = v; });

  function values(){
    if(state.mode === 'all'){
      var out = [], b = state.base;
      for(var v = b; v <= 256; v += b) out.push(v);
      return out;
    }
    return CURATED[state.base];
  }

  function render(){
    var vals = values();
    var maxBar = 512;
    $('#sp-title').textContent = state.base + 'pt grid — ' + (state.mode === 'curated' ? 'design scale' : 'all multiples');
    $('#sp-body').innerHTML = vals.map(function(px){
      var step = px / state.base;
      var rem = px / REM, pt = px * PX_TO_PT;
      var isMile = MILESTONES.indexOf(px) > -1;
      var vis;
      if(state.shape === 'square'){
        var s = Math.min(px, 96);
        vis = '<div class="bar-wrap"><div class="square" style="width:' + s + 'px;height:' + s + 'px" title="' + px + '×' + px + 'px"></div>' +
              (px > 96 ? '<span style="font-size:.7rem;color:var(--text-3)">shown capped at 96px</span>' : '') + '</div>';
      } else {
        var w = Math.min(px, maxBar);
        vis = '<div class="bar-wrap"><div class="bar" style="width:' + w + 'px"></div>' +
              (px > maxBar ? '<span style="font-size:.7rem;color:var(--text-3)">capped</span>' : '') + '</div>';
      }
      return '<tr class="sp-row' + (isMile ? ' milestone' : '') + '" data-px="' + px + '">' +
        '<td class="mono"><span class="mult">×' + fmt(step, 2) + '</span></td>' +
        '<td class="mono"><b>' + px + '</b>px</td>' +
        '<td class="mono">' + fmt(rem, 4) + 'rem</td>' +
        '<td class="mono">' + fmt(pt, 2) + 'pt</td>' +
        '<td class="bar-cell">' + vis + '</td>' +
      '</tr>';
    }).join('');
  }

  $('#sp-body').addEventListener('click', function(e){
    var tr = e.target.closest('tr.sp-row'); if(!tr) return;
    var px = +tr.dataset.px, val;
    if(state.copy === 'rem')      val = fmt(px / REM, 4) + 'rem';
    else if(state.copy === 'pt')  val = fmt(px * PX_TO_PT, 2) + 'pt';
    else                          val = px + 'px';
    DR.copyText(val);
    tr.classList.remove('copied-flash'); void tr.offsetWidth; tr.classList.add('copied-flash');
  });

  $('#sp-export').addEventListener('click', function(){
    var lines = values().map(function(px){
      var step = fmt(px / state.base, 2).replace('.', '-');
      return '  --space-' + step + ': ' + fmt(px / REM, 4) + 'rem; /* ' + px + 'px */';
    });
    DR.openModal('Spacing — ' + state.base + 'pt grid', ':root {\n' + lines.join('\n') + '\n}');
  });

  render();
})();
