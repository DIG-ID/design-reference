/* Content Playbook tool: a personal do-and-deliver guide for the content person.
 *
 * Audience: whoever owns content on a web project (content lead and/or copywriter),
 * including people who are NOT professional copywriters. For each stage it answers
 * "what am I supposed to do, how do I do it well, and what do I hand off?" —
 * with a plain-language guide, a good-vs-bad example, a checklist and a deliverable.
 *
 * Two levels of work, mirroring how content is actually produced:
 *   - SETUP: project-level decisions made once (scope, sitemap, tone, Sie/du).
 *   - Per-page stages: repeated for every page (Prepare → Write → SEO → Convert →
 *     Legal → QA & handoff). The Prepare stage carries the per-page worksheet.
 *
 * State is persisted in localStorage; you can keep several pages and export any
 * page (worksheet + checklist state) as Markdown or a print/PDF handoff sheet.
 * Source material: website-content-checklist.md.
 */
(function(){
  "use strict";
  var $ = DR.$, escapeHtml = DR.escapeHtml;

  /* ============================================================
   * CONTENT MODEL
   * Stage: { id, title, short, guide, why, example:{bad,good}?, items:[{id,label,desc?}],
   *          deliverable, sheet? (true only on the worksheet stage) }
   * `setup` is the project-level stage; STAGES are per page.
   * ============================================================ */
  var SETUP = {
    id: 'setup', scope: 'project', title: 'Project setup', short: 'Decide these once for the whole site — before any page is written.',
    guide: 'Before working on any page, settle the decisions that apply to the whole site. If they are not settled, every page reopens them and the tone drifts. As the content owner, record them in writing so they are not changed informally later.',
    why: 'Most content problems come from skipping this step: with no agreed sitemap, tone or formality decision, ten pages end up in ten voices and content arrives as scattered, unstructured fragments.',
    example: {
      bad: '“We will decide the tone later.” German pages mix formal *Sie* and informal *du*, and content arrives through scattered emails, chat messages and unfinished documents.',
      good: 'A one-page tone guide (“warm, concrete, second person; *Sie* across the whole DE site”), a signed sitemap, and a content brief the client completes in one place.'
    },
    items: [
      { id: 'set-scope', label: 'Copywriting scope is decided and in writing', desc: 'We write / client writes to a brief / subcontracted — with responsibilities and deadlines in the proposal.' },
      { id: 'set-sitemap', label: 'Sitemap + page inventory agreed and signed' },
      { id: 'set-tone', label: 'A tone guide exists (even one page)', desc: 'Voice, do’s and don’ts, a couple of on-brand sentences.' },
      { id: 'set-formality', label: 'Formality decided per language (Sie vs du) and written down', desc: 'In German this is a brand decision applied consistently across the whole site.' },
      { id: 'set-revisions', label: 'Number of revision rounds capped and stated' },
      { id: 'set-brief', label: 'Content brief sent to the client (use the "Client brief" export)', desc: 'Per page: goal, audience, key message, must-include facts — never a blank page.' },
      { id: 'set-intake', label: 'Client briefed to send facts and bullet points, not finished copy' },
      { id: 'set-assets', label: 'Existing material gathered (current site, brochures, Figma text, photos)' }
    ],
    /* Practical guidance on collecting content from the client with the least friction. */
    tips: [
      'Ask for facts and bullet points, not finished copy. The client knows the business; writing the copy is your job.',
      'Do not hand over a blank page. Send the “Client brief” export from this tool: one structured document, one section per page.',
      'Collect everything in one place, not scattered across emails and chat messages.',
      'Reuse what already exists — current site, brochures, Figma text — and review it yourself rather than asking the client to rewrite.',
      'Include one completed example page so the client can see the expected format.',
      'Set a deadline per batch and agree the number of revision rounds in advance.'
    ],
    deliverable: 'A short tone guide, a signed sitemap, and the client brief sent (with a completed example).'
  };

  var STAGES = [
    {
      id: 'prepare', title: 'Prepare the page', short: 'Before you write a word.',
      guide: 'Decide the purpose of the page before writing it: one main goal, one main audience, one primary action, one primary keyword. Complete the worksheet below — if you cannot answer these, the page is not ready to write, and writing it anyway produces generic copy that ranks for nothing and converts no one.',
      why: 'A page that tries to do everything achieves nothing. Defining the goal and audience first is what makes the copy specific enough to work.',
      example: {
        bad: '“Welcome to our hotel. We have rooms, a restaurant, a spa and a great location for your stay.” — no goal, no audience, no next step.',
        good: 'Goal: convert · Audience: corporate/MICE · Action: Check availability · Keyword: “business hotel Lucerne”. Now the copy can be about exactly that.'
      },
      items: [
        { id: 'prep-goal', label: 'Primary goal chosen (inform / convert / rank / support)', desc: 'Pick one dominant goal.' },
        { id: 'prep-audience', label: 'Primary audience named', desc: 'Leisure guest, corporate/MICE, wedding, wellness…' },
        { id: 'prep-action', label: 'Primary conversion action chosen', desc: 'Book now, Check availability, Request offer, Call.' },
        { id: 'prep-keyword', label: 'Primary keyword + search intent assigned', desc: 'From keyword research, not a guess.' },
        { id: 'prep-support', label: '1–3 supporting keywords / entities noted' },
        { id: 'prep-competitors', label: 'Reviewed what the top 3 ranking pages cover' }
      ],
      deliverable: 'A completed, approved worksheet for the page (below) before writing starts.',
      sheet: true
    },
    {
      id: 'write', title: 'Write the copy', short: 'Message, structure and voice.',
      guide: 'One clear message per page, placed where readers look first. Lead with the benefit to the reader, not the feature specification. Keep blocks short and scannable — subheadings, paragraphs of 2–4 lines, bullet points. Write in the active voice, second person (“you”), with concrete language. Apply the tone and formality decided in Setup.',
      why: 'Readers scan before they read; long blocks of text and feature lists lose them before they reach your best line.',
      example: {
        bad: '“Our rooms are 40 m² and feature air conditioning, a minibar and a flat-screen TV.”',
        good: '“Room to actually breathe — 40 m² to spread out, work, and still relax. Air-con, minibar, big-screen TV as standard.”'
      },
      items: [
        { id: 'wr-message', label: 'One clear message — what should the visitor think, feel and do?' },
        { id: 'wr-valueprop', label: 'Value proposition sits above the fold', desc: 'Why this hotel, in one line.' },
        { id: 'wr-benefits', label: 'Benefits before features' },
        { id: 'wr-scannable', label: 'Scannable: short paragraphs, subheadings, bullet points' },
        { id: 'wr-voice', label: 'Active voice, second person, concrete language' },
        { id: 'wr-terms', label: 'Consistent terminology (decided once: rooms vs suites, guests vs visitors)' },
        { id: 'wr-open', label: 'The opening line leads directly into the content — no filler introduction' }
      ],
      deliverable: 'Draft copy per page in the agreed submission format — a shared document or the brief template, in one place rather than scattered across emails and chats.'
    },
    {
      id: 'seo', title: 'SEO', short: 'Make it findable without stuffing.',
      guide: 'Treat the title tag and meta description as the page’s advert in search results. Use exactly one H1 and a logical H2 → H3 order (no skipped levels, no decorative headings). Link to your key pages with descriptive anchors, give images meaningful alt text, and add structured data where relevant. Match depth to intent — a room page is not a 2,000-word essay.',
      why: 'The title and meta are often the only copy a searcher reads before deciding to click. Clean headings and internal links tell Google what the page is for.',
      example: {
        bad: 'Title: “Home | Welcome to the best hotel in the region for everyone”. Three H1s, no internal links.',
        good: 'Title: “Lake-View Suites in Lucerne — Business & Leisure | Hotel X”. One H1, H2s per section, links to Rooms and Booking.'
      },
      items: [
        { id: 'seo-title', label: 'Title tag — ~50–60 chars, keyword front-loaded, brand at the end' },
        { id: 'seo-meta', label: 'Meta description — ~140–155 chars, with a reason to click' },
        { id: 'seo-h1', label: 'Exactly one H1, then a logical H2 → H3 hierarchy' },
        { id: 'seo-slug', label: 'URL slug short, keyword, hyphenated, no stopwords' },
        { id: 'seo-internal', label: 'Internal links to key pages (rooms, booking, offers) with descriptive anchor text' },
        { id: 'seo-alt', label: 'Image alt text descriptive, keyword only where natural' },
        { id: 'seo-schema', label: 'Structured data where relevant', desc: 'Hotel / LodgingBusiness, LocalBusiness, FAQPage, BreadcrumbList, Offer.' },
        { id: 'seo-cannibal', label: 'No two pages (or languages) fighting for the same keyword' }
      ],
      deliverable: 'Title, meta, slug and heading structure per page, plus an internal-linking note.'
    },
    {
      id: 'convert', title: 'Convert', short: 'Give every page a clear next step.',
      guide: 'One primary call to action per page, unmistakable, above the fold and repeated further down. Keep the booking path one click away. Back it with honest trust signals (ratings, real photos, awards) and keep forms as short as possible. No page should be a dead end — always point somewhere useful next.',
      why: 'Strong copy with no clear next step wastes the visit, and competing buttons are as ineffective as none.',
      example: {
        bad: 'Page ends with a paragraph and no next step — or five equal-weight buttons competing for the click.',
        good: 'One “Check availability” above the fold, repeated near the end, plus a phone number and a real review snippet.'
      },
      items: [
        { id: 'cv-cta', label: 'One primary CTA per page, unmistakable' },
        { id: 'cv-repeat', label: 'CTA visible above the fold and repeated further down' },
        { id: 'cv-booking', label: 'Booking path is one click away' },
        { id: 'cv-trust', label: 'Trust signals present (ratings, reviews, awards, real photos)' },
        { id: 'cv-urgency', label: 'Urgency/scarcity only where it is genuinely true' },
        { id: 'cv-forms', label: 'Forms as short as legally/operationally possible' },
        { id: 'cv-deadend', label: 'No dead ends — every page points somewhere useful next' }
      ],
      deliverable: 'A defined primary CTA and next step for each page.'
    },
    {
      id: 'legal', scope: 'project', title: 'Legal & compliance (DACH)', short: 'Site-wide legal requirements in DE/AT/CH — checked once, not per page.',
      guide: 'Make sure the Impressum is present and correct, the privacy/cookie consent is aligned with no tags firing before consent, and the legal entity details are right. Clear image and font licensing, meet accessibility basics (increasingly a legal requirement in the EU), and keep pricing/offer claims accurate. When in doubt, raise it with whoever owns legal rather than guessing.',
      why: 'In the DACH region these are not optional; a missing Impressum or tracking that fires before consent is a real legal risk.',
      example: {
        bad: 'Analytics fires on page load before consent; “best prices guaranteed” with nothing to back it.',
        good: 'Tags gated behind consent in the tag manager; claims accurate and dated; Impressum linked in the footer.'
      },
      items: [
        { id: 'lg-impressum', label: 'Impressum / Imprint present and correct' },
        { id: 'lg-consent', label: 'Privacy + cookie consent aligned — no pre-consent firing', desc: 'Check the tag manager.' },
        { id: 'lg-entity', label: 'Correct legal entity, address, VAT/register info' },
        { id: 'lg-licensing', label: 'Image & font licensing cleared' }
      ],
      deliverable: 'A short site-wide compliance note, with anything risky flagged to legal.'
    },
    {
      id: 'qa', title: 'QA & handoff', short: 'Finish cleanly and package the deliverables.',
      guide: 'Proofread each language with a native speaker — not an automated translation. Remove every placeholder, lorem ipsum and “TODO”. Check all links, read the page on mobile, and keep formatting consistent per locale (capitalisation, dates, numbers). Then obtain the Approver’s explicit sign-off, and hand over the package: worksheet + approved copy + SEO fields + compliance note.',
      why: 'The final details — a leftover “TODO: pricing”, a broken link, a proofread not done by a native speaker — are what the client notices first.',
      example: {
        bad: 'The page goes live with “TODO: add pricing” still in it, and the German text was proofread by a non-native speaker.',
        good: 'Native proofread completed, links checked, page read on mobile, Approver signed off, and the full content package handed over.'
      },
      items: [
        { id: 'qa-proof', label: 'Proofread by a native speaker per language' },
        { id: 'qa-placeholder', label: 'No placeholder / lorem ipsum / TODO left anywhere' },
        { id: 'qa-links', label: 'All links work; no orphan pages' },
        { id: 'qa-mobile', label: 'Reads well on mobile (line length, block size)' },
        { id: 'qa-format', label: 'Formatting consistent (capitalisation, punctuation, number/date per locale)' },
        { id: 'qa-a11y', label: 'This page: accessibility basics (alt text, contrast, real heading order)' },
        { id: 'qa-claims', label: 'This page: pricing/offer claims accurate and not misleading' },
        { id: 'qa-approved', label: 'Final Approver has signed off' }
      ],
      deliverable: 'The final content package: worksheet + approved copy + SEO fields + compliance note.'
    }
  ];

  /* Per-page worksheet (Part C of the playbook). */
  var SHEET_FIELDS = [
    { id: 'page',     label: 'Page' },
    { id: 'goal',     label: 'Goal', type: 'select', options: ['', 'inform', 'convert', 'rank', 'support'] },
    { id: 'audience', label: 'Audience' },
    { id: 'message',  label: 'Main message', type: 'textarea' },
    { id: 'cta',      label: 'Primary CTA' },
    { id: 'keyword',  label: 'Primary keyword' },
    { id: 'title',    label: 'Title tag' },
    { id: 'meta',     label: 'Meta description', type: 'textarea' },
    { id: 'h1',       label: 'H1' },
    { id: 'links',    label: 'Links out to' },
    { id: 'approved', label: 'Approved by' }
  ];

  /* Client-facing brief: a client-appropriate subset (NOT our SEO worksheet), with hints.
     Exported blank, one section per page, ready to send. */
  var CLIENT_BRIEF_FIELDS = [
    { label: 'Goal', hint: 'What should this page achieve? (inform / convert / rank)' },
    { label: 'Who it’s for', hint: 'The main audience for the page' },
    { label: 'Key message', hint: 'In one or two sentences, what must the visitor take away?' },
    { label: 'Must-include facts', hint: 'Prices, features, addresses, opening hours, figures — as bullet points' },
    { label: 'Primary action', hint: 'What should the visitor do next? (Book, Call, Request an offer…)' },
    { label: 'Existing material to reuse', hint: 'Links or files: current site, brochures, Figma text, photos' },
    { label: 'Anything to avoid', hint: 'Wording, claims or topics that are off-limits' }
  ];

  var ALL = [SETUP].concat(STAGES);
  function stageById(id){ return ALL.filter(function(s){ return s.id === id; })[0]; }

  /* Two scopes: site-wide (checked once) vs per page. */
  var PROJECT_STAGES = ALL.filter(function(s){ return s.scope === 'project'; });
  var PAGE_STAGES    = ALL.filter(function(s){ return s.scope !== 'project'; });

  /* ============================================================
   * STATE + PERSISTENCE
   * state = {
   *   project: { checks:{} },                // site-wide stages (Setup, Legal)
   *   pages: [ { id, name, checks:{}, sheet:{} } ],
   *   current: pageId,
   *   stage: stageId
   * }
   * Site-wide stages read/write state.project.checks; per-page stages
   * read/write the current page's checks & sheet.
   * ============================================================ */
  var KEY = 'DR_playbook_v1';
  var seq = 1;
  var state = load();

  function newPage(name){ return { id: 'p' + (seq++), name: name || ('Page ' + seq), checks:{}, sheet:{} }; }
  function load(){
    var base = { project:{checks:{}}, pages:[], current:null, stage:'setup' };
    try{
      var raw = localStorage.getItem(KEY);
      if(raw){
        var s = JSON.parse(raw);
        // migrate older state that stored site-wide checks under `setup`
        base.project = (s.project && s.project.checks) ? s.project : ((s.setup && s.setup.checks) ? s.setup : {checks:{}});
        base.pages = Array.isArray(s.pages) ? s.pages : [];
        base.stage = stageById(s.stage) ? s.stage : 'setup';
        base.current = s.current;
        // keep the id sequence ahead of any restored page ids
        base.pages.forEach(function(p){
          var n = parseInt(String(p.id).replace(/\D/g, ''), 10);
          if(n >= seq) seq = n + 1;
        });
      }
    }catch(e){}
    if(!base.pages.length) base.pages = [newPage('Page 1')];
    if(!base.pages.some(function(p){ return p.id === base.current; })) base.current = base.pages[0].id;
    return base;
  }
  function save(){ try{ localStorage.setItem(KEY, JSON.stringify(state)); }catch(e){} }

  function currentPage(){ return state.pages.filter(function(p){ return p.id === state.current; })[0] || state.pages[0]; }
  /* Where a stage's checks live: site-wide stages share state.project; per-page stages use the current page. */
  function checksFor(stage){ return stage.scope === 'project' ? state.project.checks : currentPage().checks; }
  function stageDone(stage){
    var c = checksFor(stage);
    return stage.items.every(function(it){ return c[it.id]; });
  }
  function stageProgress(stage){
    var c = checksFor(stage), done = 0;
    stage.items.forEach(function(it){ if(c[it.id]) done++; });
    return { done: done, total: stage.items.length };
  }

  /* ============================================================
   * RENDER
   * ============================================================ */
  function render(){
    renderPageBar();
    renderSteps();
    renderStage();
  }

  function renderPageBar(){
    $('#cp-page').innerHTML = state.pages.map(function(p){
      return '<option value="' + p.id + '"' + (p.id === state.current ? ' selected' : '') + '>' + escapeHtml(p.name) + '</option>';
    }).join('');
    // The page selector only applies to per-page stages.
    var isProject = stageById(state.stage).scope === 'project';
    $('#cp-pagebar').classList.toggle('cp-dim', isProject);
    $('#cp-page').disabled = isProject;
    $('#cp-del').disabled = isProject || state.pages.length <= 1;
  }

  function stepButton(s, num){
    var active = s.id === state.stage;
    var done = stageDone(s);
    return '<button class="gc-step' + (active ? ' active' : '') + '" data-stage="' + s.id + '"' +
      ' role="tab" aria-selected="' + active + '" data-status="' + (done ? 'closed' : 'todo') + '">' +
      '<span class="gc-step-num">' + num + '</span>' +
      '<span class="gc-step-name">' + escapeHtml(s.title) + '</span>' +
      '<span class="gc-step-dot" aria-hidden="true"></span>' +
    '</button>';
  }
  /* Stepper grouped by scope: site-wide stages (checked once) then the per-page flow (1..n). */
  function renderSteps(){
    var html = '<span class="cp-steps-label">Site-wide · once</span>';
    PROJECT_STAGES.forEach(function(s){ html += stepButton(s, '·'); });
    html += '<span class="cp-steps-sep" aria-hidden="true"></span><span class="cp-steps-label">Per page</span>';
    PAGE_STAGES.forEach(function(s, i){ html += stepButton(s, i + 1); });
    $('#cp-steps').innerHTML = html;
  }

  function renderStage(){
    var stage = stageById(state.stage);
    var p = stageProgress(stage);
    $('#cp-title').textContent = stage.title;
    $('#cp-short').textContent = stage.short;
    var badge = $('#cp-progress');
    badge.textContent = p.done + '/' + p.total + ' done';
    badge.className = 'gc-badge ' + (p.done === p.total ? 'gc-closed' : 'gc-blocked');

    var html = '';

    /* Guide */
    html += '<div class="cp-guide">' +
      '<h4>What good looks like</h4>' +
      '<p>' + escapeHtml(stage.guide) + '</p>' +
      '<p class="cp-why"><strong>Why it matters:</strong> ' + escapeHtml(stage.why) + '</p>' +
    '</div>';

    /* Good vs bad example */
    if(stage.example){
      html += '<div class="cp-example">' +
        '<div class="cp-ex cp-bad"><span class="cp-ex-tag">Weak</span><p>' + escapeHtml(stage.example.bad) + '</p></div>' +
        '<div class="cp-ex cp-good"><span class="cp-ex-tag">Better</span><p>' + escapeHtml(stage.example.good) + '</p></div>' +
      '</div>';
    }

    /* Practical tips (e.g. collecting content from the client) */
    if(stage.tips){
      html += '<div class="cp-tips"><h4>Getting content from the client</h4><ul>' +
        stage.tips.map(function(t){ return '<li>' + escapeHtml(t) + '</li>'; }).join('') +
      '</ul></div>';
    }

    /* Per-page worksheet (Prepare stage only) */
    if(stage.sheet){
      var sheet = currentPage().sheet;
      html += '<div class="cp-sheet"><h4>Page worksheet — ' + escapeHtml(currentPage().name) + '</h4>' +
        '<p class="cp-sheet-hint">Fill one line each. If you can’t, the page isn’t ready to write.</p>' +
        '<div class="cp-sheet-grid">' +
        SHEET_FIELDS.map(function(f){
          var v = sheet[f.id] || '';
          var field;
          if(f.type === 'select'){
            field = '<select data-sheet="' + f.id + '">' + f.options.map(function(o){
              return '<option value="' + escapeHtml(o) + '"' + (o === v ? ' selected' : '') + '>' + escapeHtml(o || '—') + '</option>';
            }).join('') + '</select>';
          } else if(f.type === 'textarea'){
            field = '<textarea data-sheet="' + f.id + '" rows="2">' + escapeHtml(v) + '</textarea>';
          } else {
            field = '<input type="text" data-sheet="' + f.id + '" value="' + escapeHtml(v) + '">';
          }
          return '<label class="cp-sheet-field' + (f.type === 'textarea' ? ' cp-wide' : '') + '"><span>' + escapeHtml(f.label) + '</span>' + field + '</label>';
        }).join('') +
        '</div></div>';
    }

    /* Checklist */
    var checks = checksFor(stage);
    html += '<div class="cp-check"><h4>Do these</h4>' +
      stage.items.map(function(it){
        return '<label class="gc-item"><input type="checkbox" data-item="' + it.id + '"' + (checks[it.id] ? ' checked' : '') + '>' +
          '<span class="gc-item-body"><span class="gc-item-label">' + escapeHtml(it.label) + '</span>' +
          (it.desc ? '<span class="gc-item-desc">' + escapeHtml(it.desc) + '</span>' : '') +
          '</span></label>';
      }).join('') +
    '</div>';

    /* Deliverable */
    html += '<div class="cp-deliver"><span class="cp-deliver-tag">Hand off</span>' + escapeHtml(stage.deliverable) + '</div>';

    $('#cp-body').innerHTML = html;

    /* The export buttons follow the current scope: page handoff vs project report. */
    var proj = stage.scope === 'project';
    $('#cp-print-btn').textContent = proj ? 'Print project' : 'Print handoff';
    $('#cp-copy').textContent = proj ? 'Copy project' : 'Copy handoff';
    $('#cp-print-btn').title = proj ? 'Print / PDF of the site-wide checklist (Setup + Legal)' : 'Print / PDF of this page’s handoff (worksheet + per-page checklist) — for your records';
    $('#cp-copy').title = proj ? 'Copy the site-wide checklist as Markdown' : 'Copy this page’s handoff as Markdown — for your records';
  }

  function refreshProgress(){
    renderSteps();
    var stage = stageById(state.stage), p = stageProgress(stage);
    var badge = $('#cp-progress');
    badge.textContent = p.done + '/' + p.total + ' done';
    badge.className = 'gc-badge ' + (p.done === p.total ? 'gc-closed' : 'gc-blocked');
  }

  /* ============================================================
   * EVENTS
   * ============================================================ */
  $('#cp-steps').addEventListener('click', function(e){
    var b = e.target.closest('.gc-step'); if(!b) return;
    state.stage = b.dataset.stage; save(); render();
  });

  $('#cp-page').addEventListener('change', function(){
    state.current = $('#cp-page').value; save(); render();
  });
  $('#cp-new').addEventListener('click', function(){
    var name = (window.prompt('Name for the new page?', 'Page ' + (state.pages.length + 1)) || '').trim();
    if(!name) return;
    var p = newPage(name);
    state.pages.push(p); state.current = p.id;
    if(stageById(state.stage).scope === 'project') state.stage = 'prepare';
    save(); render();
  });
  $('#cp-del').addEventListener('click', function(){
    if(state.pages.length <= 1) return;
    if(!window.confirm('Delete “' + currentPage().name + '” and its worksheet?')) return;
    state.pages = state.pages.filter(function(p){ return p.id !== state.current; });
    state.current = state.pages[0].id;
    save(); render();
  });

  /* checklist ticks + worksheet edits (delegated on the re-rendered body) */
  $('#cp-body').addEventListener('change', function(e){
    var cb = e.target.closest('input[data-item]');
    if(cb){
      var c = checksFor(stageById(state.stage));
      if(cb.checked) c[cb.dataset.item] = true; else delete c[cb.dataset.item];
      save(); refreshProgress();
      return;
    }
    var sel = e.target.closest('select[data-sheet]');
    if(sel){ writeSheet(sel.dataset.sheet, sel.value); }
  });
  $('#cp-body').addEventListener('input', function(e){
    var f = e.target.closest('[data-sheet]');
    if(f && f.tagName !== 'SELECT') writeSheet(f.dataset.sheet, f.value); // no re-render: keep the caret
  });
  function writeSheet(id, val){
    var sheet = currentPage().sheet;
    if(val) sheet[id] = val; else delete sheet[id];
    save();
  }

  /* ---------- export (Markdown + print) ---------- */
  /* Shared helpers: render a list of stages against a checks object. */
  function stagesMd(stages, checks){
    var lines = [];
    stages.forEach(function(s){
      var d = 0; s.items.forEach(function(it){ if(checks[it.id]) d++; });
      lines.push('## ' + s.title + ' (' + d + '/' + s.items.length + ')');
      s.items.forEach(function(it){ lines.push('- [' + (checks[it.id] ? 'x' : ' ') + '] ' + it.label); });
      lines.push('');
    });
    return lines;
  }
  function stagesHtml(stages, checks){
    return stages.map(function(s){
      return '<h2>' + escapeHtml(s.title) + '</h2><ul class="cp-print-items">' +
        s.items.map(function(it){
          var on = checks[it.id];
          return '<li class="' + (on ? 'on' : 'off') + '"><span class="cp-print-box">' + (on ? '✔' : '') + '</span>' + escapeHtml(it.label) + '</li>';
        }).join('') + '</ul>';
    }).join('');
  }

  /* Per-page handoff: worksheet + the per-page stages for that page (no site-wide checks). */
  function pageReport(page){
    var lines = ['# Content handoff — ' + page.name, '', '_Generated ' + new Date().toLocaleString() + '_', '', '## Worksheet'];
    SHEET_FIELDS.forEach(function(f){ lines.push('- **' + f.label + ':** ' + (page.sheet[f.id] || '—')); });
    lines.push('');
    return lines.concat(stagesMd(PAGE_STAGES, page.checks)).join('\n');
  }
  function pageReportHtml(page){
    var h = '<h1>Content handoff — ' + escapeHtml(page.name) + '</h1>' +
      '<p class="cp-print-meta">Generated ' + escapeHtml(new Date().toLocaleString()) + '</p>';
    h += '<h2>Worksheet</h2><table class="cp-print-sheet">' +
      SHEET_FIELDS.map(function(f){
        return '<tr><th>' + escapeHtml(f.label) + '</th><td>' + escapeHtml(page.sheet[f.id] || '—') + '</td></tr>';
      }).join('') + '</table>';
    return h + stagesHtml(PAGE_STAGES, page.checks);
  }

  /* Site-wide report: the project-level stages (Setup + Legal), shared across all pages. */
  function projectReport(){
    var lines = ['# Project report', '', '_Generated ' + new Date().toLocaleString() + '_', '', '_Site-wide checks, shared across all pages._', ''];
    return lines.concat(stagesMd(PROJECT_STAGES, state.project.checks)).join('\n');
  }
  function projectReportHtml(){
    return '<h1>Project report</h1>' +
      '<p class="cp-print-meta">Generated ' + escapeHtml(new Date().toLocaleString()) + ' — site-wide checks, shared across all pages</p>' +
      stagesHtml(PROJECT_STAGES, state.project.checks);
  }

  /* Blank client-facing brief: one section per page, with instructions. */
  function clientBrief(){
    var lines = [
      '# Content brief',
      '',
      'Please fill in one section per page below. Send us **facts and bullet points, not finished copy** — we write it for you. Reuse anything you already have (current website, brochures, Figma text, photos) and just point us to it. Keep everything in this one document.',
      ''
    ];
    state.pages.forEach(function(p){
      lines.push('## Page: ' + p.name, '');
      CLIENT_BRIEF_FIELDS.forEach(function(f){
        lines.push('**' + f.label + '** — _' + f.hint + '_', '', '- ', '');
      });
    });
    return lines.join('\n');
  }

  $('#cp-copy').addEventListener('click', function(){
    if(stageById(state.stage).scope === 'project') DR.openModal('Project report — site-wide checks', projectReport());
    else DR.openModal('Content handoff — ' + currentPage().name, pageReport(currentPage()));
  });
  $('#cp-brief').addEventListener('click', function(){
    DR.openModal('Client brief — send to the client (' + state.pages.length + ' page' + (state.pages.length === 1 ? '' : 's') + ')', clientBrief());
  });
  $('#cp-print-btn').addEventListener('click', function(){
    var gc = document.getElementById('gc-print'); if(gc) gc.innerHTML = ''; // avoid printing the other tool's stale report
    $('#cp-print').innerHTML = stageById(state.stage).scope === 'project' ? projectReportHtml() : pageReportHtml(currentPage());
    window.print();
  });

  /* init */
  render();
})();
