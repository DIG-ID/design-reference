/* Gate Checklist tool: a reusable, gated checklist for web projects.
 *
 * A project moves through ordered PHASES. Each phase has a GATE (a checklist of
 * items). Required items gate the phase; non-required items are "recommended".
 * Gates here are ADVISORY: the phase status shows BLOCKED / READY TO CLOSE, but
 * closing a phase is never hard-blocked. Closing records who closed it and when,
 * for sign-off records; a closed phase can be reopened.
 *
 * State is a single run persisted in localStorage (no per-project management yet
 * — see TODO.md). Source material: website-content-checklist.md.
 */
(function(){
  "use strict";
  var $ = DR.$, $$ = DR.$$, escapeHtml = DR.escapeHtml;

  /* ============================================================
   * DATA MODEL
   * PHASES: ordered list. Each phase:
   *   { id, title, blurb, groups: [ { title, items: [Item] } ] }
   * Item:
   *   { id (globally unique), label, description?, required }
   * Only `required` items count toward the gate; the rest are recommended.
   * ============================================================ */
  var PHASES = [
    {
      id: 'kickoff',
      title: 'Kickoff & Scope',
      blurb: 'Name one Content Owner and one Approver, put the copywriting scope in writing, and agree the sitemap and a hard content deadline — before anything gets designed.',
      groups: [
        { title: 'Roles & ownership', items: [
          { id: 'kickoff-owner',     label: 'Content Owner assigned', description: 'One person accountable for content arriving in the right shape, on time.', required: true },
          { id: 'kickoff-approver',  label: 'Approver assigned', description: 'One person who gives the final yes/no. Can be the same person as the owner, but the role must exist.', required: true },
          { id: 'kickoff-raci',      label: 'Writer, reviewer and content-input roles defined', description: 'RACI-lite: who writes, who checks SEO/quality, and who owns putting content into the build. The client sends content through the agreed channel (brief or document), not straight into the site.', required: false }
        ]},
        { title: 'Scope & contract', items: [
          { id: 'kickoff-scope',     label: 'Copywriting scope decided and in writing', description: 'We write / client writes to a brief / subcontracted — stated in the proposal with responsibilities and deadlines.', required: true },
          { id: 'kickoff-revisions', label: 'Number of content revision rounds capped and stated', required: false },
          { id: 'kickoff-brief',     label: 'Structured content brief prepared for the client', description: 'If the client provides content they get a template (goal, audience, message, must-include facts, word count, tone), never a blank page.', required: false }
        ]},
        { title: 'Gates & schedule', items: [
          { id: 'kickoff-sitemap',   label: 'Sitemap + page inventory agreed and signed', required: true },
          { id: 'kickoff-deadline',  label: 'Content deadline set as a hard gate, with buffer', description: 'Falls before design lock. Every gate has a named owner and a date.', required: true }
        ]}
      ]
    },
    {
      id: 'content',
      title: 'Content',
      blurb: 'The heart of the playbook (Part A). Run it per page: strategy, copy quality, SEO, conversion, brand/tone and DACH legal — then get the Approver’s sign-off.',
      groups: [
        { title: 'Strategy (before writing a word)', items: [
          { id: 'content-goal',       label: 'Primary goal defined (inform / convert / rank / support)', description: 'Pick one dominant goal per page.', required: true },
          { id: 'content-audience',   label: 'Primary audience named', description: 'Leisure guest, corporate/MICE, wedding, wellness…', required: true },
          { id: 'content-action',     label: 'Primary conversion action chosen', description: 'Book now, Check availability, Request offer, Call.', required: true },
          { id: 'content-keyword',    label: 'Primary keyword + search intent assigned', description: 'From keyword research, not guesswork.', required: true },
          { id: 'content-supporting', label: '1–3 supporting keywords / entities', required: false },
          { id: 'content-funnel',     label: 'Funnel position clear and copy length matches it', required: false },
          { id: 'content-competitors',label: 'Quick glance at what the top 3 ranking pages cover', required: false }
        ]},
        { title: 'Message & copy quality', items: [
          { id: 'content-message',    label: 'One clear message per page', description: 'What should the visitor think, feel and do?', required: true },
          { id: 'content-valueprop',  label: 'Value proposition above the fold', description: 'Why this hotel, in one line.', required: true },
          { id: 'content-benefits',   label: 'Benefits before features', required: false },
          { id: 'content-scannable',  label: 'Scannable: short paragraphs, subheads, bullets', description: 'Kills the giant text blocks.', required: false },
          { id: 'content-voice',      label: 'Active voice, second person, concrete language', required: false },
          { id: 'content-terms',      label: 'Consistent terminology across pages', required: false }
        ]},
        { title: 'SEO', items: [
          { id: 'content-title',      label: 'Title tag — ~50–60 chars, keyword front-loaded, brand at end', required: true },
          { id: 'content-meta',       label: 'Meta description — ~140–155 chars, with a reason to click', required: true },
          { id: 'content-h1',         label: 'Exactly one H1, then a logical H2 → H3 hierarchy', required: true },
          { id: 'content-slug',       label: 'URL slug short, keyword, hyphenated, no stopwords', required: false },
          { id: 'content-internal',   label: 'Internal links to money pages with descriptive anchors', required: false },
          { id: 'content-alt',        label: 'Image alt text descriptive, never stuffed', required: false },
          { id: 'content-schema',     label: 'Structured data where relevant', description: 'Hotel / LodgingBusiness, LocalBusiness, FAQPage, BreadcrumbList, Offer.', required: false },
          { id: 'content-cannibal',   label: 'No keyword cannibalisation between pages or languages', required: false }
        ]},
        { title: 'Conversion (CRO)', items: [
          { id: 'content-primarycta', label: 'One primary CTA per page, unmistakable', required: true },
          { id: 'content-ctarepeat',  label: 'CTA above the fold and repeated further down', required: false },
          { id: 'content-booking',    label: 'Booking path is one click away', required: false },
          { id: 'content-trust',      label: 'Trust signals present (ratings, reviews, awards, real photos)', required: false },
          { id: 'content-forms',      label: 'Forms as short as legally/operationally possible', required: false }
        ]},
        { title: 'Brand & tone', items: [
          { id: 'content-formality',  label: 'Formality decided per language (Sie vs du) and applied consistently', description: 'In German this is a brand decision applied across the whole site.', required: true },
          { id: 'content-tone',       label: 'Voice matches the brand tone guide', required: false },
          { id: 'content-transcreate',label: 'Translations transcreated, not literal — a native reviews each language', required: false }
        ]},
        { title: 'Legal & compliance (DACH)', items: [
          { id: 'content-impressum',  label: 'Impressum / Imprint present and correct', description: 'Legally required in DE/AT/CH.', required: true },
          { id: 'content-consent',    label: 'Privacy + cookie consent aligned — no pre-consent firing', description: 'Check the tag manager.', required: true },
          { id: 'content-entity',     label: 'Correct legal entity, address, VAT/register info', required: false },
          { id: 'content-licensing',  label: 'Image & font licensing cleared', required: false },
          { id: 'content-a11y',       label: 'Accessibility basics met (alt, contrast, heading order)', required: false },
          { id: 'content-claims',     label: 'Pricing/offer claims accurate and not misleading', required: false }
        ]},
        { title: 'Sign-off', items: [
          { id: 'content-proofread',  label: 'Proofread by a native speaker per language', required: true },
          { id: 'content-noplaceholder', label: 'No placeholder / lorem ipsum / TODO left anywhere', required: true },
          { id: 'content-approved',   label: 'Final Approver has signed off', required: true }
        ]}
      ]
    },
    {
      id: 'design',
      title: 'Design',
      blurb: 'Design does not lock until content is approved for the key templates. Close and approve desktop before starting responsive.',
      groups: [
        { title: 'Design gate', items: [
          { id: 'design-content',     label: 'Content approved for the key templates', description: 'Upstream dependency — design should not lock without it.', required: true },
          { id: 'design-locked',      label: 'Design locked for the key templates', required: true },
          { id: 'design-desktop',     label: 'Desktop comps closed and approved', required: true },
          { id: 'design-responsive',  label: 'Responsive only started after desktop is locked', required: false }
        ]}
      ]
    },
    {
      id: 'development',
      title: 'Development',
      blurb: 'Dev starts only after design is locked. Do responsive after desktop is closed. No live ad-hoc content edits — change requests only.',
      groups: [
        { title: 'Development gate', items: [
          { id: 'dev-designlocked',   label: 'Design locked before development started', required: true },
          { id: 'dev-complete',       label: 'Development complete', required: true },
          { id: 'dev-responsive',     label: 'Responsive done (only after desktop was locked)', required: true },
          { id: 'dev-noadhoc',        label: 'No live ad-hoc content edits — changes batched as logged requests', description: 'Any change after content lock is a change request with a cost/time impact.', required: false },
          { id: 'dev-cmsscope',       label: 'Client CMS access deferred to after go-live (scoped fields only)', description: 'During the build the client contributes through the agreed channel, not by editing the site directly.', required: false }
        ]}
      ]
    },
    {
      id: 'prelaunch',
      title: 'Pre-launch QA',
      blurb: 'Last check before go-live: links, native proofread, no placeholders, mobile read, and DACH legal/compliance — then final sign-off.',
      groups: [
        { title: 'Content & links', items: [
          { id: 'qa-links',           label: 'All links work; no orphan pages', required: true },
          { id: 'qa-proofread',       label: 'Proofread per language by a native speaker', required: true },
          { id: 'qa-placeholders',    label: 'No placeholder / lorem ipsum / TODO left anywhere', required: true },
          { id: 'qa-mobile',          label: 'Reads well on mobile (line length, block size)', required: false }
        ]},
        { title: 'Legal & compliance', items: [
          { id: 'qa-impressum',       label: 'Impressum present and correct', required: true },
          { id: 'qa-consent',         label: 'Consent compliant — no tags firing before consent', required: true },
          { id: 'qa-a11y',            label: 'Accessibility basics met (alt, contrast, heading order)', required: false }
        ]},
        { title: 'Sign-off', items: [
          { id: 'qa-signoff',         label: 'Final Approver sign-off', required: true }
        ]}
      ]
    },
    {
      id: 'golive',
      title: 'Go-live',
      blurb: 'Flip the switch cleanly: redirects, indexing, analytics, backups and monitoring in place.',
      groups: [
        { title: 'Launch gate', items: [
          { id: 'live-redirects',     label: 'Redirects in place (old → new URLs)', required: true },
          { id: 'live-indexing',      label: 'Indexing allowed + sitemap submitted', description: 'Robots/noindex removed; sitemap pushed to Search Console.', required: true },
          { id: 'live-analytics',     label: 'Analytics live and consent-safe', required: true },
          { id: 'live-backups',       label: 'Backups configured', required: false },
          { id: 'live-monitoring',    label: 'Uptime / monitoring in place', required: false }
        ]}
      ]
    }
  ];

  /* ============================================================
   * STATE + PERSISTENCE
   * state = {
   *   checks: { itemId: true },              // ticked items
   *   closed: { phaseId: { at, by } },       // closed phases (ISO date + name)
   *   notes:  { phaseId: "free text" },
   *   current: phaseId                       // selected phase
   * }
   * ============================================================ */
  var KEY = 'DR_gates_v1';
  var state = load();

  function load(){
    var base = { checks:{}, closed:{}, notes:{}, current: PHASES[0].id };
    try{
      var raw = localStorage.getItem(KEY);
      if(raw){
        var saved = JSON.parse(raw);
        base.checks = saved.checks || {};
        base.closed = saved.closed || {};
        base.notes  = saved.notes  || {};
        if(saved.current && PHASES.some(function(p){ return p.id === saved.current; })) base.current = saved.current;
      }
    }catch(e){}
    return base;
  }
  function save(){
    try{ localStorage.setItem(KEY, JSON.stringify(state)); }catch(e){}
  }

  /* ---------- lookups & computed status ---------- */
  function phaseById(id){ return PHASES.filter(function(p){ return p.id === id; })[0]; }
  function phaseItems(phase){
    return phase.groups.reduce(function(acc, g){ return acc.concat(g.items); }, []);
  }
  /* Gate stats for a phase: required done / total, and whether all required pass. */
  function stats(phase){
    var req = 0, done = 0;
    phaseItems(phase).forEach(function(it){
      if(it.required){ req++; if(state.checks[it.id]) done++; }
    });
    return { reqDone: done, reqTotal: req, ready: req === 0 || done === req };
  }
  function phaseStatus(phase){
    if(state.closed[phase.id]) return 'closed';
    return stats(phase).ready ? 'ready' : 'blocked';
  }

  /* ============================================================
   * RENDER
   * ============================================================ */
  function render(){
    renderSteps();
    renderOverview();
    renderPhase();
  }

  /* Sub-navigation: the ordered phase stepper below the main nav. */
  function renderSteps(){
    $('#gc-steps').innerHTML = PHASES.map(function(p, i){
      var st = phaseStatus(p);
      var active = p.id === state.current;
      return '<button class="gc-step' + (active ? ' active' : '') + '" data-phase="' + p.id + '"' +
        ' role="tab" aria-selected="' + active + '" data-status="' + st + '">' +
        '<span class="gc-step-num">' + (i + 1) + '</span>' +
        '<span class="gc-step-name">' + escapeHtml(p.title) + '</span>' +
        '<span class="gc-step-dot" aria-hidden="true"></span>' +
      '</button>';
    }).join('');
  }

  /* Top overview: how far along the run is. */
  function renderOverview(){
    var idx = PHASES.map(function(p){ return p.id; }).indexOf(state.current) + 1;
    var closedCount = PHASES.filter(function(p){ return state.closed[p.id]; }).length;
    $('#gc-overview').innerHTML =
      '<strong>Gate Checklist</strong>' +
      '<span class="gc-overview-sub">Phase ' + idx + ' of ' + PHASES.length + ' · ' + closedCount + ' closed</span>';
  }

  function renderPhase(){
    var phase = phaseById(state.current);
    var s = stats(phase);
    $('#gc-title').textContent = phase.title;
    $('#gc-blurb').textContent = phase.blurb;
    renderBadge(phase, s);

    /* checklist groups */
    $('#gc-groups').innerHTML = phase.groups.map(function(g){
      var rows = g.items.map(function(it){
        var checked = state.checks[it.id] ? ' checked' : '';
        return '<label class="gc-item' + (it.required ? ' required' : '') + '">' +
          '<input type="checkbox" data-item="' + it.id + '"' + checked + '>' +
          '<span class="gc-item-body">' +
            '<span class="gc-item-label">' + escapeHtml(it.label) +
              (it.required ? '<span class="gc-req" title="Required — gates the phase">required</span>'
                           : '<span class="gc-rec" title="Recommended — does not gate the phase">recommended</span>') +
            '</span>' +
            (it.description ? '<span class="gc-item-desc">' + escapeHtml(it.description) + '</span>' : '') +
          '</span>' +
        '</label>';
      }).join('');
      return '<section class="gc-group"><h4>' + escapeHtml(g.title) + '</h4>' + rows + '</section>';
    }).join('');

    renderGate(phase);
  }

  function renderBadge(phase, s){
    var el = $('#gc-badge');
    var st = phaseStatus(phase);
    var text = st === 'closed' ? 'CLOSED' : (st === 'ready' ? 'READY TO CLOSE' : 'BLOCKED');
    el.textContent = text + (s.reqTotal ? ' · ' + s.reqDone + '/' + s.reqTotal + ' required' : '');
    el.className = 'gc-badge gc-' + st;
  }

  /* Gate panel: notes, previous-phase warning, and close / reopen controls. */
  function renderGate(phase){
    var closed = state.closed[phase.id];
    var idx = PHASES.map(function(p){ return p.id; }).indexOf(phase.id);
    var prev = idx > 0 ? PHASES[idx - 1] : null;
    var warn = (prev && !state.closed[prev.id] && !closed)
      ? '<p class="gc-warn">Heads-up: “' + escapeHtml(prev.title) + '” isn’t closed yet. Gates are advisory, so you can still work here — but the workflow expects the previous gate closed first.</p>'
      : '';

    var notes = escapeHtml(state.notes[phase.id] || '');
    var closeBlock;
    if(closed){
      closeBlock =
        '<div class="gc-closed">' +
          '<span class="gc-closed-info">Closed by <strong>' + escapeHtml(closed.by || '—') + '</strong> on ' + escapeHtml(formatDate(closed.at)) + '</span>' +
          '<button class="btn" id="gc-reopen">Reopen phase</button>' +
        '</div>';
    } else {
      closeBlock =
        '<div class="gc-close">' +
          '<label class="gc-close-label" for="gc-closedby">Closed by</label>' +
          '<input type="text" id="gc-closedby" placeholder="Your name" autocomplete="name">' +
          '<button class="btn primary" id="gc-close">Close phase</button>' +
        '</div>';
    }

    $('#gc-gate').innerHTML =
      warn +
      '<label class="gc-notes-label" for="gc-notes">Notes (optional)</label>' +
      '<textarea id="gc-notes" class="gc-notes" rows="3" placeholder="Anything worth recording for this gate…">' + notes + '</textarea>' +
      closeBlock;
  }

  function formatDate(iso){
    try{ return new Date(iso).toLocaleString(); }catch(e){ return iso || ''; }
  }

  /* Lightweight refresh after a checkbox toggle (keeps notes/caret untouched). */
  function refreshStatus(){
    renderSteps();
    renderOverview();
    var phase = phaseById(state.current);
    renderBadge(phase, stats(phase));
    // the previous-phase warning can change as gates open/close, but not on a tick
  }

  /* ============================================================
   * EVENTS
   * ============================================================ */
  /* phase switching via the stepper */
  $('#gc-steps').addEventListener('click', function(e){
    var b = e.target.closest('.gc-step'); if(!b) return;
    state.current = b.dataset.phase; save(); render();
  });

  /* tick / untick an item */
  $('#gc-groups').addEventListener('change', function(e){
    var cb = e.target.closest('input[data-item]'); if(!cb) return;
    if(cb.checked) state.checks[cb.dataset.item] = true;
    else delete state.checks[cb.dataset.item];
    save(); refreshStatus();
  });

  /* notes + close/reopen (delegated on the gate panel, which is re-rendered) */
  $('#gc-gate').addEventListener('input', function(e){
    if(e.target.id !== 'gc-notes') return;
    var v = e.target.value;
    if(v) state.notes[state.current] = v; else delete state.notes[state.current];
    save(); // no re-render: keep the caret where it is
  });
  $('#gc-gate').addEventListener('click', function(e){
    if(e.target.id === 'gc-close'){
      var by = ($('#gc-closedby').value || '').trim();
      state.closed[state.current] = { at: new Date().toISOString(), by: by };
      save(); render();
      DR.toast('Phase closed');
    } else if(e.target.id === 'gc-reopen'){
      delete state.closed[state.current];
      save(); render();
      DR.toast('Phase reopened');
    }
  });

  /* ---------- report (Markdown + print) ---------- */
  function buildReport(){
    return PHASES.map(function(p){
      var s = stats(p);
      var st = phaseStatus(p);
      var closed = state.closed[p.id];
      return {
        phase: p, stats: s, status: st, closed: closed,
        notes: state.notes[p.id] || ''
      };
    });
  }

  function toMarkdown(){
    var out = ['# Gate Checklist — report', '', '_Generated ' + new Date().toLocaleString() + '_', ''];
    buildReport().forEach(function(r, i){
      var label = r.status === 'closed' ? 'CLOSED' : (r.status === 'ready' ? 'READY TO CLOSE' : 'BLOCKED');
      out.push('## ' + (i + 1) + '. ' + r.phase.title + ' — ' + label +
        (r.stats.reqTotal ? ' (' + r.stats.reqDone + '/' + r.stats.reqTotal + ' required)' : ''));
      if(r.closed) out.push('_Closed by ' + (r.closed.by || '—') + ' on ' + formatDate(r.closed.at) + '_');
      out.push('');
      r.phase.groups.forEach(function(g){
        out.push('### ' + g.title);
        g.items.forEach(function(it){
          out.push('- [' + (state.checks[it.id] ? 'x' : ' ') + '] ' + it.label + (it.required ? ' *(required)*' : ''));
        });
        out.push('');
      });
      if(r.notes){ out.push('> Notes: ' + r.notes, ''); }
    });
    return out.join('\n');
  }

  function toReportHtml(){
    var html = '<h1>Gate Checklist — report</h1>' +
      '<p class="gc-print-meta">Generated ' + escapeHtml(new Date().toLocaleString()) + '</p>';
    buildReport().forEach(function(r, i){
      var label = r.status === 'closed' ? 'CLOSED' : (r.status === 'ready' ? 'READY TO CLOSE' : 'BLOCKED');
      html += '<section class="gc-print-phase">' +
        '<h2>' + (i + 1) + '. ' + escapeHtml(r.phase.title) +
          ' <span class="gc-print-status gc-' + r.status + '">' + label +
          (r.stats.reqTotal ? ' · ' + r.stats.reqDone + '/' + r.stats.reqTotal + ' required' : '') + '</span></h2>';
      if(r.closed) html += '<p class="gc-print-closed">Closed by <strong>' + escapeHtml(r.closed.by || '—') + '</strong> on ' + escapeHtml(formatDate(r.closed.at)) + '</p>';
      r.phase.groups.forEach(function(g){
        html += '<h3>' + escapeHtml(g.title) + '</h3><ul class="gc-print-items">';
        g.items.forEach(function(it){
          var on = state.checks[it.id];
          html += '<li class="' + (on ? 'on' : 'off') + '"><span class="gc-print-box">' + (on ? '✔' : '') + '</span>' +
            escapeHtml(it.label) + (it.required ? ' <em>(required)</em>' : '') + '</li>';
        });
        html += '</ul>';
      });
      if(r.notes) html += '<p class="gc-print-notes"><strong>Notes:</strong> ' + escapeHtml(r.notes) + '</p>';
      html += '</section>';
    });
    return html;
  }

  $('#gc-copy').addEventListener('click', function(){
    DR.openModal('Gate Checklist — report (Markdown)', toMarkdown());
  });
  $('#gc-print-btn').addEventListener('click', function(){
    var cp = document.getElementById('cp-print'); if(cp) cp.innerHTML = ''; // avoid printing the other tool's stale report
    $('#gc-print').innerHTML = toReportHtml();
    window.print();
  });
  $('#gc-reset').addEventListener('click', function(){
    if(!window.confirm('Reset the whole checklist? All ticks, notes and closed phases will be cleared.')) return;
    state = { checks:{}, closed:{}, notes:{}, current: PHASES[0].id };
    save(); render();
    DR.toast('Checklist reset');
  });

  /* init */
  render();
})();
