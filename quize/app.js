(function () {
	const qs = (sel, el = document) => el.querySelector(sel);
	const qsa = (sel, el = document) => Array.from(el.querySelectorAll(sel));

	const state = {
		generated: null,
		testId: null,
		mode: 'teacher',
	};

	function setTheme(theme) {
		document.documentElement.dataset.theme = theme;
		localStorage.setItem('theme', theme);
		qs('#themeToggle').textContent = theme === 'dark' ? '🌞' : '🌙';
	}

	function toggleTheme() {
		const current = document.documentElement.dataset.theme || 'light';
		setTheme(current === 'light' ? 'dark' : 'light');
	}

	function initTheme() {
		setTheme(localStorage.getItem('theme') || 'light');
		qs('#themeToggle').addEventListener('click', toggleTheme);
	}

	function sum(values) { return Object.values(values).reduce((a, b) => a + Number(b || 0), 0); }

	function getSettingsFromForm() {
		const numQuestions = Number(qs('#numQuestions').value || 10);
		const difficulty_distribution = {
			easy: Number(qs('#easyCount').value || 0),
			medium: Number(qs('#mediumCount').value || 0),
			hard: Number(qs('#hardCount').value || 0),
		};
		const type_distribution = {
			mcq: Number(qs('#mcqCount').value || 0),
			true_false: Number(qs('#tfCount').value || 0),
			multiple_correct: Number(qs('#multiCount').value || 0),
			fill_blank: Number(qs('#fillCount').value || 0),
		};
		return { num_questions: numQuestions, difficulty_distribution, type_distribution };
	}

	function validateSettings(settings) {
		const td = settings.type_distribution;
		const dd = settings.difficulty_distribution;
		if (sum(td) !== settings.num_questions) {
			alert('Type distribution must sum to total questions.');
			return false;
		}
		if (sum(dd) !== settings.num_questions) {
			alert('Difficulty distribution must sum to total questions.');
			return false;
		}
		return true;
	}

	function renderPreview(questions) {
		const container = qs('#preview');
		container.innerHTML = '';
		if (!questions || !questions.length) {
			container.textContent = 'No questions generated yet.';
			return;
		}
		questions.forEach((q, i) => {
			const item = document.createElement('div');
			item.className = 'question';
			item.innerHTML = `
				<div class="q-meta">
					<span class="badge">${q.type}</span>
					<span class="badge">${q.difficulty}</span>
					<span class="topic">${q.topic || 'General'}</span>
				</div>
				<div class="q-text">${q.prompt}</div>
				${q.options ? `<ul class="options">${q.options.map((o, idx) => `<li>${String.fromCharCode(65+idx)}. ${o}</li>`).join('')}</ul>` : ''}
			`;
			container.appendChild(item);
		});
	}

	async function createTest() {
		const title = qs('#titleInput').value.trim() || 'Untitled Test';
		const settings = getSettingsFromForm();
		if (!validateSettings(settings)) return;

		const file = qs('#fileInput').files[0];
		const url = qs('#urlInput').value.trim();
		const text = qs('#textInput').value.trim();

		const form = new FormData();
		form.append('title', title);
		form.append('settings', JSON.stringify({
			num_questions: settings.num_questions,
			type_distribution: settings.type_distribution,
			difficulty_distribution: settings.difficulty_distribution,
		}));
		if (file) form.append('file', file);
		else if (url) form.append('url', url);
		else if (text) form.append('text', text);
		else {
			alert('Please upload a file, paste a URL, or paste text.');
			return;
		}

		qs('#generateBtn').disabled = true;
		qs('#generateBtn').textContent = 'Generating...';
		try {
			const resp = await fetch('/api/create_test', { method: 'POST', body: form });
			const data = await resp.json();
			if (!resp.ok) throw new Error(data.error || 'Failed to generate');
			state.generated = data;
			state.testId = data.test_id;
			renderPreview(data.questions);
			qs('#saveBtn').disabled = false;
			qs('#exportBtn').disabled = false;
		} catch (e) {
			alert(e.message);
		} finally {
			qs('#generateBtn').disabled = false;
			qs('#generateBtn').textContent = 'Generate Questions';
		}
	}

	async function exportLink() {
		if (!state.testId) return;
		const resp = await fetch(`/api/export/${state.testId}`);
		const data = await resp.json();
		qs('#exportLink').value = data.link || '';
		if (data.link) {
			qs('#exportLink').select();
			document.execCommand('copy');
		}
	}

	function saveTest() {
		// Already persisted when created; this is just feedback
		if (state.testId) alert('Test saved successfully.');
	}

	function route() {
		const m = location.pathname.match(/\/test\/(.+)$/);
		if (m) {
			state.mode = 'student';
			qs('#teacherView').classList.add('hidden');
			qs('#studentView').classList.remove('hidden');
			loadTest(m[1]);
		} else {
			state.mode = 'teacher';
			qs('#teacherView').classList.remove('hidden');
			qs('#studentView').classList.add('hidden');
		}
	}

	async function loadTest(testId) {
		const resp = await fetch(`/api/test/${testId}`);
		const data = await resp.json();
		if (!resp.ok) { alert(data.error || 'Could not load test'); return; }
		state.testId = data.test_id;
		qs('#testTitle').textContent = data.title || 'Test';
		renderStudentTest(data.questions);
	}

	function renderStudentTest(questions) {
		const container = qs('#testContainer');
		container.innerHTML = '';
		questions.forEach((q, idx) => {
			const block = document.createElement('div');
			block.className = 'question';
			block.dataset.qid = q.id || String(idx);
			let body = `
				<div class="q-meta">
					<span class="badge">${q.type}</span>
					<span class="badge">${q.difficulty}</span>
					<span class="topic">${q.topic || 'General'}</span>
				</div>
				<div class="q-text">${q.prompt}</div>
			`;
			if (q.type === 'mcq' || q.type === 'multiple_correct') {
				body += `<ul class="options">${(q.options||[]).map((o, i) => `
					<li>
						<label>
							<input name="ans-${idx}" type="${q.type==='mcq'?'radio':'checkbox'}" value="${i}" />
							<span>${String.fromCharCode(65+i)}. ${o}</span>
						</label>
					</li>
				`).join('')}</ul>`;
			} else if (q.type === 'true_false') {
				body += `
					<div class="tf">
						<label><input name="ans-${idx}" type="radio" value="true" /> True</label>
						<label><input name="ans-${idx}" type="radio" value="false" /> False</label>
					</div>
				`;
			} else if (q.type === 'fill_blank') {
				body += `<input name="ans-${idx}" type="text" placeholder="Your answer" />`;
			}
			block.innerHTML = body;
			container.appendChild(block);
		});
	}

	function collectAnswers() {
		const container = qs('#testContainer');
		const answers = {};
		qsa('.question', container).forEach((block, idx) => {
			const qid = block.dataset.qid || String(idx);
			const type = block.querySelector('.badge').textContent;
			if (type === 'mcq') {
				const sel = block.querySelector('input[type=radio]:checked');
				answers[qid] = sel ? Number(sel.value) : null;
			} else if (type === 'multiple_correct') {
				answers[qid] = qsa('input[type=checkbox]:checked', block).map(el => Number(el.value));
			} else if (type === 'true_false') {
				const sel = block.querySelector('input[type=radio]:checked');
				answers[qid] = sel ? (sel.value === 'true') : null;
			} else if (type === 'fill_blank') {
				answers[qid] = block.querySelector('input[type=text]')?.value || '';
			}
		});
		return answers;
	}

	async function submitAnswers() {
		if (!state.testId) return;
		const answers = collectAnswers();
		const student_name = qs('#studentName').value.trim() || 'Anonymous';
		const resp = await fetch(`/api/submit/${state.testId}`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ student_name, answers }),
		});
		const data = await resp.json();
		if (!resp.ok) { alert(data.error || 'Submission failed'); return; }
		renderResults(data);
	}

	function renderResults(result) {
		const box = qs('#results');
		box.classList.remove('hidden');
		box.innerHTML = `
			<div class="stats">
				<div><strong>Score:</strong> ${result.score}/${result.total}</div>
				<div><strong>Accuracy:</strong> ${result.accuracy.toFixed(1)}%</div>
			</div>
			<div class="detail"></div>
		`;
		const detail = qs('.detail', box);
		(result.details || []).forEach((d, idx) => {
			const row = document.createElement('div');
			row.className = 'detail-row';
			row.innerHTML = `
				<div class="q">Q${idx+1}: ${d.prompt}</div>
				<div class="a ${d.correct ? 'ok' : 'bad'}">${d.correct ? 'Correct' : 'Wrong'}</div>
				<div class="exp">${d.explanation || ''}</div>
				<div class="rate">Rate this question: ${[1,2,3,4,5].map(n=>`<button data-idx="${idx}" data-rating="${n}">${n}</button>`).join(' ')}</div>
			`;
			detail.appendChild(row);
		});
		qsa('.rate button', box).forEach(b => b.addEventListener('click', onRate));
	}

	async function onRate(e) {
		const btn = e.currentTarget;
		const question_idx = Number(btn.dataset.idx);
		const rating = Number(btn.dataset.rating);
		await fetch(`/api/rate/${state.testId}`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ question_idx, rating }),
		});
		btn.parentElement.innerHTML = 'Thanks for your feedback!';
	}

	// Chatbot
	function initChat() {
		qs('#chatToggle').addEventListener('click', () => {
			qs('#chatPanel').classList.toggle('hidden');
		});
		qs('#chatSend').addEventListener('click', sendChat);
		qs('#chatText').addEventListener('keydown', (e) => { if (e.key === 'Enter') sendChat(); });
	}

	async function sendChat() {
		const input = qs('#chatText');
		const msg = input.value.trim();
		if (!msg) return;
		appendChat('You', msg);
		input.value = '';
		const resp = await fetch('/api/chat', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ message: msg, test_id: state.testId }),
		});
		const data = await resp.json();
		appendChat('Assistant', data.reply || '');
	}

	function appendChat(who, text) {
		const box = qs('#chatMessages');
		const div = document.createElement('div');
		div.className = `msg ${who==='You'?'me':'bot'}`;
		div.textContent = `${who}: ${text}`;
		box.appendChild(div);
		box.scrollTop = box.scrollHeight;
	}

	function initEvents() {
		qs('#generateBtn').addEventListener('click', createTest);
		qs('#exportBtn').addEventListener('click', exportLink);
		qs('#saveBtn').addEventListener('click', saveTest);
		qs('#submitBtn').addEventListener('click', submitAnswers);
	}

	function main() {
		initTheme();
		initEvents();
		initChat();
		route();
	}

	window.addEventListener('DOMContentLoaded', main);
})(); 