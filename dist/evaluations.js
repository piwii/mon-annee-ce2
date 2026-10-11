'use strict';
(() => {
  const grammarQuestions = [
    {lesson:'G1', question:'Quelle suite de mots est une phrase correcte ?', options:['Le chat dort sur le tapis.', 'le chat dort sur le tapis', 'Dort tapis le sur chat.'], answer:0, explanation:'Une phrase a un sens, commence par une majuscule et se termine par un point.'},
    {lesson:'G1', question:'Que manque-t-il au début de « les enfants jouent. » ?', options:['Un point', 'Une majuscule', 'Un mot'], answer:1, explanation:'Le premier mot doit commencer par une majuscule : « Les enfants jouent. »'},
    {lesson:'G1', question:'Quelle suite de mots a du sens ?', options:['Une mange souris fromage du.', 'Fromage souris du une mange.', 'Une souris mange du fromage.'], answer:2, explanation:'Les mots doivent être dans un ordre qui permet de comprendre la phrase.'},
    {lesson:'G2', question:'Combien de phrases y a-t-il dans ce texte ?', passage:['Lina ouvre son livre.', 'Elle regarde les images.'], options:['1 phrase', '2 phrases', '3 phrases'], answer:1, explanation:'On compte deux phrases : chacune commence par une majuscule et se termine par un point.'},
    {lesson:'G2', question:'Combien de lignes numérotées vois-tu dans cet encadré ?', passage:['Le petit chat', 'dort sur', 'le canapé.'], options:['1 ligne', '2 lignes', '3 lignes'], answer:2, explanation:'Le texte est disposé sur trois lignes numérotées, mais il ne forme qu’une seule phrase.'},
    {lesson:'G2', question:'Combien de phrases y a-t-il dans cet encadré ?', passage:['Le petit chat', 'dort sur', 'le canapé.'], options:['1 phrase', '2 phrases', '3 phrases'], answer:0, explanation:'Il n’y a qu’une phrase, de « Le » jusqu’au point après « canapé ». Une phrase peut occuper plusieurs lignes.'},
    {lesson:'G3', question:'Quel est le type de « Le train arrive à la gare. » ?', options:['Interrogative', 'Déclarative', 'Impérative'], answer:1, explanation:'Cette phrase donne une information : elle est déclarative.'},
    {lesson:'G3', question:'Quel est le type de « Où est ton cartable ? » ?', options:['Impérative', 'Déclarative', 'Interrogative'], answer:2, explanation:'Cette phrase pose une question : elle est interrogative.'},
    {lesson:'G3', question:'Quelle phrase donne un ordre ?', options:['Range tes chaussures.', 'Tes chaussures sont rouges.', 'Où sont tes chaussures ?'], answer:0, explanation:'« Range tes chaussures. » demande à quelqu’un d’agir : c’est une phrase impérative.'},
    {lesson:'G3', question:'Quel signe termine une phrase interrogative ?', options:['Le point (.)', 'Le point d’exclamation (!)', 'Le point d’interrogation (?)'], answer:2, explanation:'Une phrase interrogative pose une question et se termine par un point d’interrogation.'}
  ];
  const conjugationQuestions = [
    {lesson:'Repérer le temps', question:'À quel temps est « Hier, j’ai été malade. » ?', options:['Au présent', 'Au passé', 'Au futur'], answer:1, explanation:'« J’ai été » est le verbe être au passé composé : il indique ici le passé.'},
    {lesson:'Repérer le temps', question:'À quel temps est « Demain, nous aurons une surprise. » ?', options:['Au passé', 'Au présent', 'Au futur'], answer:2, explanation:'« Nous aurons » est le verbe avoir au futur simple.'},
    {lesson:'Présent · être', question:'Complète au présent : « Aujourd’hui, vous … en classe. »', options:['êtes', 'sont', 'étiez'], answer:0, explanation:'Au présent, le verbe être se conjugue « vous êtes ».'},
    {lesson:'Présent · avoir', question:'Complète au présent : « Maintenant, tu … huit ans. »', options:['a', 'avais', 'as'], answer:2, explanation:'Au présent, on écrit « tu as », avec un s.'},
    {lesson:'Présent · être', question:'Complète au présent : « Aujourd’hui, nous … prêts. »', options:['sont', 'sommes', 'serons'], answer:1, explanation:'Au présent, on dit « nous sommes ». « Nous serons » est au futur.'},
    {lesson:'Passé · passé composé · être', question:'Complète au passé composé : « Hier, elle … en retard. »', options:['a été', 'est été', 'était'], answer:0, explanation:'Au passé composé, être se conjugue avec l’auxiliaire avoir au présent et le participe passé été : « elle a été ».'},
    {lesson:'Passé · passé composé · avoir', question:'Complète au passé composé : « Hier, nous … une surprise. »', options:['avons', 'sommes eu', 'avons eu'], answer:2, explanation:'Au passé composé, on écrit « nous avons eu » : avoir au présent suivi du participe passé eu.'},
    {lesson:'Passé · passé composé · avoir', question:'Complète au passé composé : « Hier soir, tu … peur de l’orage. »', options:['a eu', 'as eu', 'avais'], answer:1, explanation:'Au passé composé, avoir se conjugue « tu as eu ». L’auxiliaire s’accorde avec tu : as.'},
    {lesson:'Futur · être', question:'Complète au futur : « Demain, ils … à la piscine. »', options:['seront', 'sont', 'serons'], answer:0, explanation:'Au futur simple, on écrit « ils seront », avec -ont. « Serons » s’utilise avec nous.'},
    {lesson:'Futur · avoir', question:'Complète au futur : « Demain, j’… un nouveau livre. »', options:['avais', 'ai', 'aurai'], answer:2, explanation:'Au futur simple, le verbe avoir se conjugue « j’aurai ».'},
    {"lesson": "Présent · être", "question": "Complète au présent : « Je … à la bibliothèque. »", "options": ["suis", "es", "serai"], "answer": 0, "explanation": "Au présent, on écrit « je suis »."},
    {"lesson": "Présent · avoir", "question": "Complète au présent : « Nous … des crayons de couleur. »", "options": ["ont", "avons", "avions"], "answer": 1, "explanation": "Au présent, le verbe avoir se conjugue « nous avons »."},
    {"lesson": "Présent · avoir", "question": "Complète au présent : « Elles … un ballon. »", "options": ["sont", "a", "ont"], "answer": 2, "explanation": "Au présent, on écrit « elles ont ». « Sont » est une forme du verbe être."},
    {"lesson": "Passé · passé composé · être", "question": "Complète au passé composé : « Hier, j’… chez ma grand-mère. »", "options": ["ai été", "suis été", "étais"], "answer": 0, "explanation": "Le passé composé du verbe être se forme avec avoir : « j’ai été »."},
    {"lesson": "Passé · passé composé · être", "question": "Complète au passé composé : « Pendant la sortie, vous … très sages. »", "options": ["êtes été", "avez été", "avez eu"], "answer": 1, "explanation": "Avec vous, le passé composé du verbe être est « vous avez été »."},
    {"lesson": "Passé · passé composé · avoir", "question": "Complète au passé composé : « Hier, ils … une bonne idée. »", "options": ["ont été", "avaient", "ont eu"], "answer": 2, "explanation": "Avec ils, le passé composé du verbe avoir est « ils ont eu »."},
    {"lesson": "Futur · être", "question": "Complète au futur : « Demain, tu … de retour. »", "options": ["seras", "sera", "es"], "answer": 0, "explanation": "Au futur simple, on écrit « tu seras », avec un s."},
    {"lesson": "Futur · être", "question": "Complète au futur : « Bientôt, nous … en vacances. »", "options": ["seront", "serons", "sommes"], "answer": 1, "explanation": "Au futur simple, on écrit « nous serons », avec -ons."},
    {"lesson": "Futur · avoir", "question": "Complète au futur : « Demain, vous … le temps de jouer. »", "options": ["aviez", "avez", "aurez"], "answer": 2, "explanation": "Au futur simple, avoir se conjugue « vous aurez »."},
    {"lesson": "Futur · avoir", "question": "Complète au futur : « L’année prochaine, elle … neuf ans. »", "options": ["aura", "auras", "a"], "answer": 0, "explanation": "Au futur simple, on écrit « elle aura ». « Auras » s’utilise avec tu."}
  ];
  const evaluations = [
    {hash:'#evaluation-grammaire-g1-g2-g3', title:'G1, G2 et G3', label:'ÉVALUATION 1 · GRAMMAIRE', start:'evaluation-start', last:'evaluation-last', questions:grammarQuestions, answers:[], finished:false},
    {hash:'#evaluation-etre-avoir-passe-present-futur', title:'Être et avoir : passé, présent et futur', label:'ÉVALUATION 2 · CONJUGAISON', start:'conjugation-start', last:'conjugation-last', questions:conjugationQuestions, answers:[], finished:false}
  ];
  let active = evaluations[0];
  const byId = id => document.getElementById(id);
  const dialog = byId('evaluation'), host = byId('evaluation-content');
  const make = (tag, className, text) => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  };
  function render(focus = false) {
    const {questions, answers, finished} = active;
    const points = 10 / questions.length;
    const format = value => value.toLocaleString('fr-FR');
    byId('evaluation-title').textContent = active.title;
    byId('evaluation-label').textContent = active.label;
    host.replaceChildren();
    const sheet = make('div', 'quiz-sheet');
    if (finished) {
      const score = questions.filter((q, i) => answers[i] === q.answer).length * points;
      const title = make('h3', '', 'Ma note'); title.tabIndex = -1;
      sheet.append(title, make('p', 'quiz-score', `${format(score)} / 10`), make('p', '', score === 10 ? 'Bravo, tu as tout réussi !' : 'Voici le corrigé pour comprendre tes réponses et progresser.'));
      const recap = make('ol', 'quiz-recap');
      questions.forEach((q, i) => {
        const correct = answers[i] === q.answer;
        const row = make('li', correct ? 'recap-correct' : 'recap-review');
        row.append(make('strong', '', `${q.lesson} · ${q.question} — ${format(correct ? points : 0)} / ${format(points)}`));
        if (q.passage) row.append(passage(q.passage));
        row.append(make('p', '', `Ta réponse : ${q.options[answers[i]]}`));
        if (!correct) row.append(make('p', '', `Bonne réponse : ${q.options[q.answer]}`));
        row.append(make('p', '', q.explanation)); recap.append(row);
      });
      const retry = make('button', 'primary', 'Recommencer l’évaluation');
      retry.onclick = () => { active.answers = []; active.finished = false; byId(active.last).hidden = true; render(true); };
      sheet.append(recap, retry); host.append(sheet);
      byId(active.last).hidden = false;
      byId(active.last).textContent = `Dernière note de cette visite : ${format(score)} / 10`;
      byId(active.start).textContent = 'Voir mon résultat →';
      if (focus) title.focus();
      dialog.scrollTop = 0;
      return;
    }
    sheet.append(make('p', '', 'Choisis une réponse par question. Tu peux modifier tes réponses avant de terminer. La note et le corrigé apparaîtront à la fin.'));
    const form = make('form', 'evaluation-form');
    questions.forEach((q, i) => {
      const field = make('fieldset', 'quiz-question');
      field.append(make('legend', '', `${i + 1}. ${q.lesson} · ${q.question} (${format(points)} point)`));
      if (q.passage) field.append(passage(q.passage));
      q.options.forEach((option, j) => {
        const label = make('label', 'quiz-option'), input = make('input');
        input.type = 'radio'; input.name = `evaluation-${i}`; input.value = String(j); input.required = true; input.checked = answers[i] === j;
        input.onchange = () => { answers[i] = j; };
        label.append(input, make('span', '', option)); field.append(label);
      });
      form.append(field);
    });
    const submit = make('button', 'primary', 'Terminer et voir ma note'); submit.type = 'submit';
    form.append(submit);
    form.onsubmit = event => {
      event.preventDefault();
      if (!form.reportValidity()) return;
      active.answers = questions.map((q, i) => Number(form.querySelector(`input[name="evaluation-${i}"]:checked`).value));
      active.finished = true; render(true);
    };
    sheet.append(form); host.append(sheet);
    byId(active.start).textContent = 'Reprendre l’évaluation →';
    if (focus) { byId('evaluation-title').tabIndex = -1; byId('evaluation-title').focus(); dialog.scrollTop = 0; }
  }
  function passage(lines) {
    const block = make('div', 'evaluation-passage');
    lines.forEach((line, i) => {
      const row = make('div'); const number = make('span', 'line-number', String(i + 1)); number.setAttribute('aria-hidden', 'true');
      row.append(number, make('span', '', line)); block.append(row);
    });
    return block;
  }
  function openEvaluation() {
    render();
    if (!dialog.open) dialog.showModal();
    document.body.classList.add('reading');
    dialog.scrollTop = 0;
  }
  function syncRoute() {
    const selected = evaluations.find(evaluation => evaluation.hash === location.hash);
    if (selected) { active = selected; openEvaluation(); }
    else if (dialog.open) dialog.close();
  }
  evaluations.forEach(evaluation => {
    byId(evaluation.start).onclick = () => {
      active = evaluation;
      if (location.hash === evaluation.hash) openEvaluation();
      else location.hash = evaluation.hash;
    };
  });
  byId('evaluation-close').onclick = () => dialog.close();
  dialog.addEventListener('close', () => {
    if (evaluations.some(evaluation => evaluation.hash === location.hash)) history.replaceState(null, '', location.pathname + location.search);
    if (!byId('reader').open) document.body.classList.remove('reading');
  });
  window.addEventListener('hashchange', syncRoute);
  syncRoute();
})();
