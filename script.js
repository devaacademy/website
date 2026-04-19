/* ================================================================
   DEVA WEBSITE — COMPLETE JAVASCRIPT
   Navbar · Drawer · Scroll · Counters · Filter · FAQ · Donate
   Contact · Newsletter · Ticker · Lina AI Chatbot
================================================================ */
'use strict';

/* ── Navbar shadow + active link ── */
var navbar = document.getElementById('navbar');
var btt    = document.getElementById('btt');

(function() {
  var tb = document.querySelector('.topbar');
  function setNavTop() {
    if (!navbar) return;
    navbar.style.top = (tb && window.innerWidth > 768) ? tb.offsetHeight + 'px' : '0';
  }
  setNavTop();
  window.addEventListener('resize', setNavTop);
})();

window.addEventListener('scroll', function() {
  var y = window.scrollY;
  if (navbar) navbar.classList.toggle('scrolled', y > 10);
  if (btt)    btt.classList.toggle('show', y > 500);
  /* Active nav link */
  document.querySelectorAll('section[id]').forEach(function(sec) {
    var a = document.querySelector('.nav-a[href="#' + sec.id + '"]');
    if (!a) return;
    var off = (navbar ? navbar.offsetHeight : 72) + 40;
    a.classList.toggle('active', y + off >= sec.offsetTop && y + off < sec.offsetTop + sec.offsetHeight);
  });
}, { passive: true });

/* ── Back-to-top ── */
if (btt) btt.addEventListener('click', function() { window.scrollTo({ top: 0, behavior: 'smooth' }); });

/* ── Smooth scroll ── */
document.querySelectorAll('a[href^="#"]').forEach(function(a) {
  a.addEventListener('click', function(e) {
    var target = document.querySelector(a.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    window.scrollTo({ top: target.offsetTop - ((navbar ? navbar.offsetHeight : 72) + 10), behavior: 'smooth' });
  });
});

/* ── Mobile drawer ── */
var burger   = document.getElementById('burger');
var drawer   = document.getElementById('mobDrawer');
var overlay  = document.getElementById('mobOverlay');
var mobClose = document.getElementById('mobClose');

function openDrawer() {
  if (!drawer) return;
  drawer.classList.add('open');
  if (overlay) overlay.classList.add('show');
  if (burger)  { burger.classList.add('open'); burger.setAttribute('aria-expanded','true'); }
  document.body.style.overflow = 'hidden';
}
function closeDrawer() {
  if (!drawer) return;
  drawer.classList.remove('open');
  if (overlay) overlay.classList.remove('show');
  if (burger)  { burger.classList.remove('open'); burger.setAttribute('aria-expanded','false'); }
  document.body.style.overflow = '';
}
if (burger)   burger.addEventListener('click', function() { drawer && drawer.classList.contains('open') ? closeDrawer() : openDrawer(); });
if (mobClose) mobClose.addEventListener('click', closeDrawer);
if (overlay)  overlay.addEventListener('click', closeDrawer);
if (drawer)   drawer.querySelectorAll('a').forEach(function(a) { a.addEventListener('click', closeDrawer); });
document.addEventListener('keydown', function(e) { if (e.key === 'Escape') closeDrawer(); });

/* ── Animated counters ── */
var fired = new Set();
function animateCounter(el) {
  if (fired.has(el)) return;
  fired.add(el);
  var target = parseInt(el.dataset.to, 10);
  var steps  = 80;
  var inc    = target / steps;
  var cur    = 0;
  var timer  = setInterval(function() {
    cur += inc;
    if (cur >= target) { cur = target; clearInterval(timer); }
    el.textContent = Math.round(cur).toLocaleString();
  }, 20);
}

/* ── IntersectionObserver for counters only (sections always visible) ── */
var cntObs = new IntersectionObserver(function(entries) {
  entries.forEach(function(entry) {
    if (entry.isIntersecting) { animateCounter(entry.target); cntObs.unobserve(entry.target); }
  });
}, { threshold: 0.2 });
document.querySelectorAll('.cnt[data-to]').forEach(function(el) { cntObs.observe(el); });

/* ── Program filter tabs ── */
var pfBtns = document.querySelectorAll('.pf-btn');
var progCards = document.querySelectorAll('.prog-card[data-cat]');
pfBtns.forEach(function(btn) {
  btn.addEventListener('click', function() {
    pfBtns.forEach(function(b) { b.classList.remove('active'); });
    btn.classList.add('active');
    var cat = btn.dataset.cat;
    progCards.forEach(function(card) {
      card.style.display = (cat === 'all' || card.dataset.cat === cat) ? '' : 'none';
    });
  });
});

/* ── FAQ accordion ── */
document.querySelectorAll('.faq-q').forEach(function(btn) {
  btn.addEventListener('click', function() {
    var item   = btn.closest('.faq-item');
    var body   = item.querySelector('.faq-body');
    var isOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item.open').forEach(function(i) {
      i.classList.remove('open');
      var b = i.querySelector('.faq-body');
      if (b) b.style.maxHeight = '0';
      var ic = i.querySelector('.faq-icon');
      if (ic) ic.style.transform = '';
    });
    if (!isOpen && body) {
      item.classList.add('open');
      body.style.maxHeight = body.scrollHeight + 'px';
      var ic = btn.querySelector('.faq-icon');
      if (ic) ic.style.transform = 'rotate(45deg)';
    }
  });
});

/* ── Donate amount picker ── */
document.querySelectorAll('.dam').forEach(function(btn) {
  btn.addEventListener('click', function() {
    document.querySelectorAll('.dam').forEach(function(b) { b.classList.remove('active'); });
    btn.classList.add('active');
    var wrap = document.getElementById('customAmtWrap');
    if (btn.classList.contains('custom')) {
      if (wrap) wrap.style.display = '';
    } else {
      if (wrap) wrap.style.display = 'none';
      var inp = document.getElementById('donateAmountInput');
      if (inp && btn.dataset.amt) inp.value = btn.dataset.amt;
    }
  });
});

/* ── Contact form ── */
var cForm = document.getElementById('contact-form');
var cOk   = document.getElementById('contactOk');
if (cForm) {
  cForm.addEventListener('submit', function(e) {
    e.preventDefault();
    var b = cForm.querySelector('button[type="submit"]');
    if (b) { b.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending…'; b.disabled = true; }
    setTimeout(function() {
      cForm.style.display = 'none';
      if (cOk) { cOk.hidden = false; }
    }, 1300);
  });
}

/* ── Donate form ── */
var dForm = document.getElementById('donateForm');
var dOk   = document.getElementById('donateOk');
if (dForm) {
  dForm.addEventListener('submit', function(e) {
    e.preventDefault();
    var b = dForm.querySelector('button[type="submit"]');
    if (b) { b.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing…'; b.disabled = true; }
    setTimeout(function() {
      dForm.style.display = 'none';
      if (dOk) { dOk.hidden = false; }
    }, 1300);
  });
}

/* ── Newsletter form ── */
var nlForm = document.getElementById('nl-form');
if (nlForm) {
  nlForm.addEventListener('submit', function(e) {
    e.preventDefault();
    var b = nlForm.querySelector('button');
    if (b) { b.innerHTML = '<i class="fas fa-check"></i> Subscribed!'; b.style.background = '#16a34a'; b.disabled = true; }
  });
}

/* ── Ticker pause on hover ── */
var ticker = document.querySelector('.ticker-track');
if (ticker) {
  ticker.addEventListener('mouseenter', function() { ticker.style.animationPlayState = 'paused'; });
  ticker.addEventListener('mouseleave', function() { ticker.style.animationPlayState = 'running'; });
}

/* ================================================================
   LINA AI CHATBOT WIDGET
================================================================ */
(function() {

  var AGENT_URL = 'https://agent.jotform.com/019bf00a11657e8b9df5290059ac83dbfc9f?embedMode=iframe&background=1&shadow=1';
  var AGENT_ID  = '019bf00a11657e8b9df5290059ac83dbfc9f';

  var btn        = document.getElementById('lina-chat-btn');
  var panel      = document.getElementById('lina-panel');
  var closeBtn   = document.getElementById('lina-close-btn');
  var welcome    = document.getElementById('lina-welcome');
  var iframeWrap = document.getElementById('lina-iframe-wrap');
  var loader     = document.getElementById('lina-loader');
  var tip        = document.getElementById('lina-tip');
  var greeting   = document.getElementById('lina-greeting');
  var greetClose = document.getElementById('lina-greeting-close');
  var recommend  = document.getElementById('lina-recommend');
  var lrbOpen    = document.getElementById('lrb-open-chat');
  var lrbDismiss = document.getElementById('lrb-dismiss');
  var badge      = document.getElementById('lina-badge');

  if (!btn || !panel) { console.error('Lina: missing btn or panel'); return; }

  var iframeCreated = false;

  function createIframe() {
    if (iframeCreated) return;
    iframeCreated = true;
    var iframe = document.createElement('iframe');
    iframe.src   = AGENT_URL;
    iframe.title = 'Lina — DEVA AI Advisor';
    iframe.allow = 'microphone; camera';
    iframe.setAttribute('frameborder', '0');
    iframe.setAttribute('scrolling', 'no');
    iframe.style.cssText = 'width:100%;height:100%;border:none;display:block;flex:1;';
    iframe.addEventListener('load', function() {
      if (loader) loader.style.display = 'none';
      if (window.jotformEmbedHandler) {
        window.jotformEmbedHandler("iframe[id='JotFormIFrame-" + AGENT_ID + "']", "https://www.jotform.com");
      }
    });
    if (iframeWrap) iframeWrap.appendChild(iframe);
  }

  function openChat() {
    panel.classList.add('open');
    btn.setAttribute('aria-expanded','true');
    if (badge) badge.style.display = 'none';
    if (greeting) greeting.classList.remove('show');
    if (recommend) recommend.classList.remove('show');
    if (tip) tip.classList.remove('show');
    /* Show iframe directly, skip welcome on repeated opens */
    window.startLina();
  }

  function closeChat() {
    panel.classList.remove('open');
    btn.setAttribute('aria-expanded','false');
  }

  window.startLina = function() {
    if (welcome)    welcome.style.display = 'none';
    if (iframeWrap) { iframeWrap.style.display = 'flex'; iframeWrap.style.flex = '1'; }
    createIframe();
  };

  /* Toggle on button click */
  btn.addEventListener('click', function() {
    panel.classList.contains('open') ? closeChat() : openChat();
  });

  if (closeBtn) closeBtn.addEventListener('click', closeChat);

  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && panel.classList.contains('open')) closeChat();
  });

  /* Tooltip on hover */
  btn.addEventListener('mouseenter', function() { if (tip) tip.classList.add('show'); });
  btn.addEventListener('mouseleave', function() { if (tip) tip.classList.remove('show'); });

  /* Proactive greeting after 4s */
  setTimeout(function() {
    if (!panel.classList.contains('open') && greeting) greeting.classList.add('show');
  }, 4000);
  setTimeout(function() { if (greeting) greeting.classList.remove('show'); }, 14000);
  if (greetClose) greetClose.addEventListener('click', function() { greeting.classList.remove('show'); });

  /* Recommendation banner after 20s */
  setTimeout(function() {
    if (!panel.classList.contains('open') && recommend) recommend.classList.add('show');
    setTimeout(function() { if (recommend) recommend.classList.remove('show'); }, 10000);
  }, 20000);

  if (lrbOpen) lrbOpen.addEventListener('click', function() {
    if (recommend) recommend.classList.remove('show');
    openChat();
  });
  if (lrbDismiss) lrbDismiss.addEventListener('click', function() {
    if (recommend) recommend.classList.remove('show');
  });

  /* Lina section CTAs */
  document.querySelectorAll('[data-lina-open], .lina-cta-btn').forEach(function(el) {
    el.addEventListener('click', function() { openChat(); });
  });

})();