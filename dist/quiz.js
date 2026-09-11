'use strict';
// Attempts stay in memory during this visit. Answers are independent of the OCR.
window.Quiz = (() => {
  const attempts = new Map();
  const host = () => document.getElementById('quiz-view');
  const make = (tag, className, text) => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  };
  function getAttempt(id) {
    if (!attempts.has(id)) attempts.set(id, {index: 0, answers: [], finished: false});
    return attempts.get(id);
  }
  function result(id) {
    const state = attempts.get(id), questions = window.QUIZZES[id];
    if (!state?.finished || !questions) return null;
    return {score: state.answers.filter((answer, i) => answer === questions[i].answer).length, total: questions.length};
  }
  function announceUpdate() { document.dispatchEvent(new Event('ce2-quiz-update')); }
  function render(id, focus = false) {
    const questions = window.QUIZZES[id];
    const container = host();
    container.replaceChildren();
    if (!questions) return;
    const state = getAttempt(id);
    const sheet = make('div', 'quiz-sheet');
    if (state.finished) {
      const {score, total} = result(id), success = score === total;
      sheet.append(make('p', 'eyebrow', 'MON BILAN'));
      const title = make('h3', '', success ? 'Exercice réussi !' : 'On continue à apprendre.');
      title.tabIndex = -1;
      sheet.append(title, make('p', 'quiz-score', `${score} / ${total}`));
      sheet.append(make('p', 'quiz-summary', success
        ? 'Tu as répondu juste à toutes les questions de cet exercice.'
        : 'Relis les explications, puis essaie à nouveau. Chaque erreur aide à comprendre.'));
      const recap = make('ol', 'quiz-recap');
      questions.forEach((question, i) => {
        const correct = state.answers[i] === question.answer;
        const row = make('li', correct ? 'recap-correct' : 'recap-review');
        row.append(make('strong', '', `${correct ? '✓' : 'À revoir ·'} ${question.question}`));
        row.append(make('p', '', `Ta réponse : ${question.options[state.answers[i]]}`));
        if (!correct) row.append(make('p', '', `Bonne réponse : ${question.options[question.answer]}`));
        row.append(make('p', '', question.explanation));
        recap.append(row);
      });
      const actions = make('div', 'quiz-actions');
      const retry = make('button', 'primary', 'Réessayer');
      retry.onclick = () => { attempts.delete(id); announceUpdate(); render(id, true); };
      const lesson = make('button', '', 'Relire la leçon');
      lesson.onclick = () => document.getElementById('photo-tab').click();
      actions.append(retry, lesson);
      sheet.append(recap, actions);
      container.append(sheet);
      if (focus) title.focus({preventScroll: true});
      return;
    }
    const question = questions[state.index], answered = state.answers[state.index] !== undefined;
    sheet.append(make('p', 'eyebrow', 'JE VÉRIFIE MA COMPRÉHENSION'));
    const progressLabel = make('p', 'quiz-step', `Question ${state.index + 1} sur ${questions.length}`);
    const progress = make('progress', 'quiz-progress');
    progress.max = questions.length;
    progress.value = state.answers.length;
    progress.setAttribute('aria-label', `${state.answers.length} réponses vérifiées sur ${questions.length}`);
    sheet.append(progressLabel, progress);
    const form = make('form', 'quiz-form');
    const fieldset = make('fieldset', 'quiz-question');
    const legend = make('legend', '', question.question);
    legend.tabIndex = -1;
    fieldset.append(legend);
    const help = make('p', 'quiz-help', 'Choisis une réponse, puis vérifie.');
    help.id = 'quiz-help';
    fieldset.setAttribute('aria-describedby', help.id);
    fieldset.append(help);
    const labels = [];
    question.options.forEach((option, index) => {
      const label = make('label', 'quiz-option');
      const input = make('input');
      input.type = 'radio'; input.name = 'quiz-answer'; input.value = String(index); input.required = true;
      input.disabled = answered;
      input.checked = answered && state.answers[state.index] === index;
      label.append(input, make('span', '', option));
      labels.push(label);
      fieldset.append(label);
    });
    const feedback = make('div', 'quiz-feedback');
    feedback.setAttribute('role', 'status');
    feedback.setAttribute('aria-live', 'polite');
    feedback.setAttribute('aria-atomic', 'true');
    feedback.hidden = true;
    const check = make('button', 'primary', 'Vérifier ma réponse');
    check.type = 'submit';
    const next = make('button', 'primary', state.index === questions.length - 1 ? 'Voir mon bilan' : 'Question suivante →');
    next.type = 'button'; next.hidden = true;
    function showFeedback() {
      const answer = state.answers[state.index], correct = answer === question.answer;
      labels[question.answer].classList.add('option-correct');
      labels[question.answer].append(make('small', 'answer-label', 'Bonne réponse'));
      if (!correct) {
        labels[answer].classList.add('option-wrong');
        labels[answer].append(make('small', 'answer-label', 'Ta réponse'));
      }
      feedback.className = 'quiz-feedback ' + (correct ? 'feedback-correct' : 'feedback-review');
      feedback.replaceChildren(make('strong', '', correct ? 'Oui, c’est ça !' : 'Pas tout à fait.'), make('p', '', question.explanation));
      feedback.hidden = false; check.hidden = true; next.hidden = false;
    }
    form.onsubmit = event => {
      event.preventDefault();
      if (state.answers[state.index] !== undefined) return;
      const selected = form.querySelector('input[name="quiz-answer"]:checked');
      if (!selected) { form.reportValidity(); return; }
      state.answers[state.index] = Number(selected.value);
      form.querySelectorAll('input').forEach(input => { input.disabled = true; });
      progress.value = state.answers.length;
      progress.setAttribute('aria-label', `${state.answers.length} réponses vérifiées sur ${questions.length}`);
      showFeedback();
      next.focus({preventScroll: true});
    };
    next.onclick = () => {
      if (state.answers[state.index] === undefined) return;
      if (state.index === questions.length - 1) { state.finished = true; announceUpdate(); }
      else state.index += 1;
      render(id, true);
      document.getElementById('reader').scrollTop = 0;
    };
    form.append(fieldset, feedback, check, next);
    sheet.append(form);
    const review = make('button', 'quiz-review', 'Relire la leçon');
    review.onclick = () => document.getElementById('photo-tab').click();
    sheet.append(review);
    container.append(sheet);
    if (answered) showFeedback();
    if (focus) legend.focus({preventScroll: true});
  }
  return {render, result};
})();
