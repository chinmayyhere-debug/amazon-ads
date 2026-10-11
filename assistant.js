/* Search-bar assistant: answers come only from Chinmay's resume and the Ads lab.
   No API, no keys. Unknown questions get an honest hand-off to Chinmay. */
(function () {
  const LAB = "lab.html";
  const QA = [
    { id: "who", chip: "Who is Chinmay?",
      keys: ["who", "about", "yourself", "himself", "introduce", "summary", "name", "tell me about him"],
      a: `Chinmay Parmar is a data and ad measurement analyst based in Toronto. He has two years at CIBC: first as a Fraud / Dispute Analyst investigating 10,000+ card cases, now as an Account Officer in Insolvency. He holds a B.Eng in Computer Engineering and a Graduate Certificate in AI &amp; Data Science, and he built the Amazon Ads Measurement Lab on this page in SQL and Python.` },
    { id: "fit", chip: "Why is he a fit for Amazon Ads?",
      keys: ["fit", "why should", "amazon", "hire", "consultant", "site", "qualif", "suitable"],
      a: `He built a full measurement lab specifically for the Analytics Consultant (SITE) role. It covers the posting's requirements one by one:<ul><li>Advanced SQL across multiple tables</li><li>Incrementality, marketing mix modeling and media attribution</li><li>Customer segmentation and modeling in Python</li><li>Turning analysis into recommendations for executives</li></ul>Add two years at CIBC working with real transaction data and stakeholders. <a href="${LAB}">Open the lab</a>` },
    { id: "lab", chip: "Walk me through the lab",
      keys: ["lab", "project", "walk", "demo", "how does", "study", "coffee", "northfield", "built"],
      a: `A fictional coffee brand on Amazon.ca spends about $140K a week on Sponsored Products, Sponsored Brands, Prime Video ads and Amazon DSP video. The lab answers four questions:<ul><li><b>Did the ads work?</b> Holdout test: +30% lift, 2.46x iROAS.</li><li><b>Which ad gets credit?</b> Attribution models over-credit DSP video 3.6x.</li><li><b>Who responds?</b> Loyal buyers do; lapsed shoppers don't.</li><li><b>Where should money go?</b> The MMM finds +4.6% sales on the same budget.</li></ul><a href="${LAB}">Explore it yourself</a>` },
    { id: "sql", chip: "How strong is his SQL?",
      keys: ["sql", "query", "queries", "database", "join", "cte", "window"],
      a: `The lab runs on a 5-table SQLite database: shoppers, campaigns, ad_impressions (about 218,000 rows), brand_purchases (about 240,000) and weekly_media. He wrote 5 queries using CTEs, window functions like <code>ROW_NUMBER()</code>, and multi-table joins to build the lift test, customer journeys and segmentation features. You can read every query, with real output, in the <a href="${LAB}#sql">SQL tab</a>.` },
    { id: "mmm", chip: "Explain the marketing mix model",
      keys: ["mmm", "mix", "media mix", "budget", "adstock", "saturation", "roas", "optimiz"],
      a: `It models 156 weeks of spend and sales with carryover (an ad keeps working after its week) and saturation (each extra dollar does less), controlling for trend, seasonality, Q4 and promotions. Fit: R² 0.975, 2.8% error on 13 held-out weeks, and every product's ROAS within about 15% of the true value. A budget optimizer then moves money to the best next-dollar return: +4.6% sales on the same budget. <a href="${LAB}#planner">Try the planner</a>` },
    { id: "lift", chip: "What's the 7x finding?",
      keys: ["7x", "lift", "incremental", "holdout", "naive", "causal", "test", "experiment"],
      a: `Comparing shoppers who saw an ad with those who didn't suggests a +223% lift. But ads go to people already likely to buy. A randomized holdout, where 10% of shoppers see no ads, shows the real lift is +30%. So the easy number overstates impact about 7x. Knowing the difference between correlation and causation is the core of ad measurement.` },
    { id: "exp", chip: "Tell me about his experience",
      keys: ["experience", "cibc", "bank", "job", "work", "fraud", "dispute", "insolvency", "career", "background"],
      a: `<ul><li><b>CIBC, Account Officer, Insolvency</b> (Jul 2025 to now): manages a portfolio of insolvency accounts, analyzes financial information to recommend next steps, and partners with Legal, Compliance and branch teams.</li><li><b>CIBC, Fraud / Dispute Analyst</b> (Oct 2024 to Jun 2025): investigated 10,000+ card fraud and dispute cases, analyzing transaction histories and reporting findings.</li><li><b>SAV Associates, IT Audit Intern</b> (Feb to Sep 2024): SOC 1 and SOC 2 control testing and client recommendations.</li></ul>` },
    { id: "python", chip: "What about Python and modeling?",
      keys: ["python", "model", "pandas", "scikit", "sklearn", "statistic", "machine learning", "ml", "data science", "segment", "k-means", "kmeans", "attribution", "markov"],
      a: `In the lab he used pandas, NumPy, SciPy and scikit-learn for: two-proportion z-tests and bootstrap confidence intervals, a Markov chain attribution model, K-Means segmentation on recency, frequency and spend, and the marketing mix model with a global optimizer. He also has a Graduate Certificate in AI &amp; Data Science and Oracle's OCI Data Science Professional certification.` },
    { id: "data", chip: "Is the data real?",
      keys: ["real data", "data real", "is the data", "what data", "dataset", "simulat", "fake", "synthetic", "fictional"],
      a: `No, and that's deliberate. Real advertiser data is private, and simulated data lets every method be checked against a known true answer, which real data never allows. The simulator includes realistic traps like targeting bias, carryover, diminishing returns and a Q4 peak. The brand is fictional and no Amazon data was used.` },
    { id: "edu", chip: "Education and certifications",
      keys: ["education", "degree", "school", "college", "university", "certif", "oracle", "ibm", "google"],
      a: `<ul><li>Graduate Certificate, AI &amp; Data Science, Loyalist College (2023 to 2024)</li><li>B.Eng, Computer Engineering, Gujarat Technological University (2018 to 2022)</li><li>Oracle: OCI Data Science Professional, OCI Generative AI Professional, Database@AWS Architect Professional</li><li>IBM: Fundamentals of Building AI Agents</li><li>Google Cloud Skills Boost, Diamond League</li></ul>` },
    { id: "contact", chip: "How do I reach him?",
      keys: ["contact", "email", "reach", "phone", "linkedin", "available", "availability", "location", "toronto", "remote", "interview"],
      a: `He's based in Toronto and open to analytics and ad measurement roles in Toronto or remote across Canada. Email: <b>chinmayy.parmar@gmail.com</b> or <a href="https://www.linkedin.com/in/chinmayyhere/">LinkedIn</a>. He's happy to walk through the lab live.` },
  ];
  const FALLBACK = `I only know what's on Chinmay's resume and in his lab, so that one is best asked directly: <b>chinmayy.parmar@gmail.com</b>.`;
  const ICON = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#0f1111" stroke-width="2.2" stroke-linecap="round"><circle cx="10.5" cy="10.5" r="6.5"/><path d="M15.5 15.5 21 21"/></svg>';

  const box = document.getElementById("search"), input = document.getElementById("q"), drop = document.getElementById("drop"), form = document.getElementById("ask");
  let answered = null, active = -1;

  const esc = s => s.replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  function match(text) {
    const t = text.toLowerCase(); let best = null, score = 0;
    QA.forEach(q => { const s = q.keys.reduce((n, k) => n + (new RegExp('\\b' + k).test(t) ? 2 : 0), 0); if (s > score) { score = s; best = q; } });
    return score ? best : null;
  }
  function suggestions(text) {
    const t = text.trim().toLowerCase();
    let list = QA.filter(q => !(answered && answered.q && q.id === answered.q.id));
    if (t) {
      const words = t.split(/\s+/).filter(w => w.length > 1);
      list = list.map(q => ({ q, s: words.reduce((n, w) => n + (q.chip.toLowerCase().includes(w) ? 2 : 0) + (q.keys.some(k => k.includes(w) || w.includes(k)) ? 1 : 0), 0) }))
                 .filter(x => x.s > 0).sort((a, b) => b.s - a.s).map(x => x.q);
    }
    return list.slice(0, 6);
  }
  function render() {
    const typed = input.value;
    const sugs = suggestions(answered ? "" : typed);
    let html = "";
    if (answered) html += `<div class="ans"><div class="q">${esc(answered.text)}</div><div class="a">${answered.q ? answered.q.a : FALLBACK}</div></div>`;
    if (sugs.length) {
      html += `<div class="sect">${answered ? "Related questions" : typed.trim() ? "Suggested" : "Popular questions about Chinmay"}</div>`;
      html += sugs.map((q, i) => `<button type="button" class="sug${i === active ? " act" : ""}" role="option" data-id="${q.id}">${ICON}<span>${q.chip}</span></button>`).join("");
    } else if (!answered && typed.trim()) {
      html += `<div class="sect">Press Enter to ask</div>`;
    }
    html += `<div class="foot">Answers come from Chinmay's resume and his Amazon Ads lab.</div>`;
    drop.innerHTML = html;
    drop.querySelectorAll(".sug").forEach(b => b.addEventListener("mousedown", e => { e.preventDefault(); const q = QA.find(x => x.id === b.dataset.id); ask(q.chip, q); }));
  }
  function open() { drop.hidden = false; input.setAttribute("aria-expanded", "true"); render(); }
  function close() { drop.hidden = true; input.setAttribute("aria-expanded", "false"); active = -1; }
  function ask(text, q) {
    answered = { text, q: q || match(text) };
    input.value = ""; active = -1; open(); drop.scrollTop = 0;
  }
  input.addEventListener("focus", open);
  input.addEventListener("input", () => { answered = null; active = -1; open(); });
  input.addEventListener("keydown", e => {
    const items = drop.querySelectorAll(".sug");
    if (e.key === "ArrowDown" && items.length) { e.preventDefault(); active = (active + 1) % items.length; render(); }
    else if (e.key === "ArrowUp" && items.length) { e.preventDefault(); active = (active - 1 + items.length) % items.length; render(); }
    else if (e.key === "Escape") { close(); input.blur(); }
  });
  form.addEventListener("submit", e => {
    e.preventDefault();
    const items = drop.querySelectorAll(".sug");
    if (active >= 0 && items[active]) { const q = QA.find(x => x.id === items[active].dataset.id); ask(q.chip, q); return; }
    const v = input.value.trim(); if (!v) { open(); return; }
    ask(v);
  });
  document.addEventListener("mousedown", e => { if (!box.contains(e.target)) close(); });
})();
