'use strict';
(() => {
  const questions = [
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
  const byId = id => document.getElementById(id);
  const dialog = byId('evaluation'), host = byId('evaluation-content');
  const make = (tag, className, text) => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  };
  let answers = [], finished = false;
  function render(focus = false) {
    host.replaceChildren();
    const sheet = make('div', 'quiz-sheet');
    if (finished) {
      const score = questions.filter((q, i) => answers[i] === q.answer).length;
      const title = make('h3', '', 'Ma note'); title.tabIndex = -1;
      sheet.append(title, make('p', 'quiz-score', `${score} / 10`), make('p', '', score === 10 ? 'Bravo, tu as tout réussi !' : 'Voici le corrigé pour comprendre tes réponses et progresser.'));
      const recap = make('ol', 'quiz-recap');
      questions.forEach((q, i) => {
        const correct = answers[i] === q.answer;
        const row = make('li', correct ? 'recap-correct' : 'recap-review');
        row.append(make('strong', '', `${q.lesson} · ${q.question} — ${correct ? '1' : '0'} / 1`));
        if (q.passage) row.append(passage(q.passage));
        row.append(make('p', '', `Ta réponse : ${q.options[answers[i]]}`));
        if (!correct) row.append(make('p', '', `Bonne réponse : ${q.options[q.answer]}`));
        row.append(make('p', '', q.explanation)); recap.append(row);
      });
      const retry = make('button', 'primary', 'Recommencer l’évaluation');
      retry.onclick = () => { answers = []; finished = false; render(true); };
      sheet.append(recap, retry); host.append(sheet);
      byId('evaluation-last').hidden = false;
      byId('evaluation-last').textContent = `Dernière note de cette visite : ${score} / 10`;
      byId('evaluation-start').textContent = 'Voir mon résultat →';
      if (focus) title.focus();
      dialog.scrollTop = 0;
      return;
    }
    sheet.append(make('p', '', 'Choisis une réponse par question. Tu peux modifier tes réponses avant de terminer. La note et le corrigé apparaîtront à la fin.'));
    const form = make('form', 'evaluation-form');
    questions.forEach((q, i) => {
      const field = make('fieldset', 'quiz-question');
      field.append(make('legend', '', `${i + 1}. ${q.lesson} · ${q.question} (1 point)`));
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
      answers = questions.map((q, i) => Number(form.querySelector(`input[name="evaluation-${i}"]:checked`).value));
      finished = true; render(true);
    };
    sheet.append(form); host.append(sheet);
    byId('evaluation-start').textContent = 'Reprendre l’évaluation →';
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
  const evaluationHash = '#evaluation-grammaire-g1-g2-g3';
  function openEvaluation() {
    render();
    if (!dialog.open) dialog.showModal();
    document.body.classList.add('reading');
    dialog.scrollTop = 0;
  }
  function syncRoute() {
    if (location.hash === evaluationHash) openEvaluation();
    else if (dialog.open) dialog.close();
  }
  byId('evaluation-start').onclick = () => {
    if (location.hash === evaluationHash) openEvaluation();
    else location.hash = evaluationHash;
  };
  byId('evaluation-close').onclick = () => dialog.close();
  dialog.addEventListener('close', () => {
    if (location.hash === evaluationHash) history.replaceState(null, '', location.pathname + location.search);
    if (!byId('reader').open) document.body.classList.remove('reading');
  });
  window.addEventListener('hashchange', syncRoute);
  syncRoute();
})();
