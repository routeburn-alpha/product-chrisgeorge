<script lang="ts">
	import { base } from '$app/paths';
	import type { Pack } from '$lib/packs';

	let { data } = $props();
	const pack = $derived<Pack>(data.pack);

	let index = $state(0);
	let selected = $state<number | null>(null);
	let answers = $state<number[]>([]);
	let finished = $state(false);

	const question = $derived(pack.questions[index]);
	const isCorrect = $derived(selected !== null && selected === question.correctIndex);
	const score = $derived(
		answers.filter((a: number, i: number) => a === pack.questions[i].correctIndex).length
	);

	function choose(i: number) {
		if (selected !== null) return;
		selected = i;
	}

	function next() {
		if (selected === null) return;
		answers = [...answers, selected];
		if (index + 1 >= pack.questions.length) {
			finished = true;
		} else {
			index = index + 1;
			selected = null;
		}
	}

	function restart() {
		index = 0;
		selected = null;
		answers = [];
		finished = false;
	}
</script>

<div class="container">
	{#if !finished}
		<div class="progress-row">
			<a class="back" href="{base}/">← All packs</a>
			<span class="progress">Question {index + 1} of {pack.questions.length}</span>
		</div>

		<h1 class="pack-title">{pack.title}</h1>

		<div class="question-card">
			<p class="prompt">{question.prompt}</p>

			<div class="choices">
				{#each question.choices as choice, i (i)}
					{@const showCorrect = selected !== null && i === question.correctIndex}
					{@const showWrong = selected === i && i !== question.correctIndex}
					<button
						type="button"
						class="choice"
						class:selected={selected === i}
						class:correct={showCorrect}
						class:wrong={showWrong}
						disabled={selected !== null}
						onclick={() => choose(i)}
					>
						<span class="letter">{String.fromCharCode(65 + i)}</span>
						<span class="choice-text">{choice}</span>
					</button>
				{/each}
			</div>

			{#if selected !== null}
				<div class="explanation" class:correct={isCorrect} class:wrong={!isCorrect}>
					<strong>{isCorrect ? 'Correct!' : 'Not quite.'}</strong>
					{question.explanation}
				</div>
				<button type="button" class="next" onclick={next}>
					{index + 1 >= pack.questions.length ? 'See your score' : 'Next question →'}
				</button>
			{/if}
		</div>
	{:else}
		<div class="result-card">
			<p class="result-label">You scored</p>
			<p class="result-score">{score} <span class="of">/ {pack.questions.length}</span></p>
			<p class="result-summary">
				{#if score === pack.questions.length}
					Perfect round. Send this pack to a friend who thinks they're better.
				{:else if score >= pack.questions.length * 0.7}
					Strong showing — try one of the other packs next.
				{:else if score >= pack.questions.length * 0.4}
					Not bad. Run it back.
				{:else}
					Rough one. The explanations are there for a reason — give it another go.
				{/if}
			</p>
			<div class="result-actions">
				<button type="button" class="primary" onclick={restart}>Play again</button>
				<a class="secondary" href="{base}/">Pick another pack</a>
			</div>
		</div>
	{/if}
</div>

<style>
	.container {
		max-width: 640px;
		margin: 0 auto;
		padding: 1rem 1.5rem 3rem;
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
	}

	.progress-row {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 1.5rem;
		font-size: 0.85rem;
	}

	.back {
		color: #1d4ed8;
		text-decoration: none;
		font-weight: 500;
	}

	.back:hover {
		text-decoration: underline;
	}

	.progress {
		color: #888;
	}

	.pack-title {
		font-size: 1rem;
		font-weight: 600;
		color: #888;
		margin: 0 0 0.75rem;
		text-transform: uppercase;
		letter-spacing: 0.04em;
	}

	.question-card {
		background: #fff;
		border: 1px solid #e2e2e2;
		border-radius: 12px;
		padding: 1.75rem;
	}

	.prompt {
		font-size: 1.25rem;
		font-weight: 600;
		color: #111;
		margin: 0 0 1.5rem;
		line-height: 1.4;
	}

	.choices {
		display: flex;
		flex-direction: column;
		gap: 0.625rem;
	}

	.choice {
		display: flex;
		align-items: center;
		gap: 0.875rem;
		text-align: left;
		padding: 0.875rem 1rem;
		border: 1.5px solid #e2e2e2;
		border-radius: 10px;
		background: #fff;
		font: inherit;
		font-size: 0.95rem;
		color: #222;
		cursor: pointer;
		transition: border-color 100ms ease, background 100ms ease, transform 100ms ease;
	}

	.choice:not(:disabled):hover {
		border-color: #1d4ed8;
		background: #f5f9ff;
	}

	.choice:disabled {
		cursor: default;
	}

	.choice.correct {
		border-color: #1d4ed8;
		background: #eff6ff;
		color: #1e3a8a;
	}

	.choice.wrong {
		border-color: #d97706;
		background: #fffbeb;
		color: #92400e;
	}

	.letter {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 1.75rem;
		height: 1.75rem;
		border-radius: 6px;
		background: #f5f5f5;
		font-size: 0.8rem;
		font-weight: 700;
		color: #555;
		flex-shrink: 0;
	}

	.choice.correct .letter {
		background: #1d4ed8;
		color: #fff;
	}

	.choice.wrong .letter {
		background: #d97706;
		color: #fff;
	}

	.choice-text {
		flex: 1;
	}

	.explanation {
		margin-top: 1.25rem;
		padding: 0.875rem 1rem;
		border-radius: 8px;
		font-size: 0.9rem;
		line-height: 1.5;
	}

	.explanation.correct {
		background: #eff6ff;
		color: #1e3a8a;
	}

	.explanation.wrong {
		background: #fffbeb;
		color: #92400e;
	}

	.next {
		margin-top: 1rem;
		width: 100%;
		padding: 0.75rem 1rem;
		border: none;
		border-radius: 8px;
		background: #1d4ed8;
		color: #fff;
		font: inherit;
		font-weight: 600;
		font-size: 0.95rem;
		cursor: pointer;
		transition: background 100ms ease;
	}

	.next:hover {
		background: #1e40af;
	}

	.result-card {
		text-align: center;
		background: #fff;
		border: 1px solid #e2e2e2;
		border-radius: 12px;
		padding: 3rem 2rem;
		margin-top: 1rem;
	}

	.result-label {
		color: #888;
		font-size: 0.9rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		margin: 0 0 0.5rem;
	}

	.result-score {
		font-size: 4rem;
		font-weight: 800;
		color: #1d4ed8;
		margin: 0;
		line-height: 1;
	}

	.result-score .of {
		color: #888;
		font-weight: 400;
		font-size: 2rem;
	}

	.result-summary {
		color: #555;
		font-size: 1rem;
		margin: 1.5rem auto 2rem;
		max-width: 36ch;
		line-height: 1.5;
	}

	.result-actions {
		display: flex;
		gap: 0.75rem;
		justify-content: center;
	}

	.primary, .secondary {
		padding: 0.75rem 1.25rem;
		border-radius: 8px;
		font: inherit;
		font-weight: 600;
		font-size: 0.95rem;
		cursor: pointer;
		text-decoration: none;
		display: inline-flex;
		align-items: center;
	}

	.primary {
		background: #1d4ed8;
		color: #fff;
		border: none;
	}

	.primary:hover {
		background: #1e40af;
	}

	.secondary {
		background: #fff;
		color: #1d4ed8;
		border: 1.5px solid #1d4ed8;
	}

	.secondary:hover {
		background: #f5f9ff;
	}
</style>
