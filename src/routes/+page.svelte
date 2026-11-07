<svelte:head>
	<title>CV - Ulf Dellbrügge</title>
</svelte:head>

<div class="print-controls">
	<button type="button" onclick={() => window.print()}>Print / Save as PDF</button>
</div>

<main class="cv-document">
	<section id="title">
		<h1>
			<span>Ulf Dellbrügge</span>
			<span class="dash"></span>
			<span>SOFTWARE ENGINEER (FULL-STACK / TYPESCRIPT)</span>
		</h1>
	</section>

	<section id="subtitle">
		<p>
			<strong>
				Full-stack software engineer building reliable TypeScript, frontend, and backend systems
			</strong>
		</p>
	</section>

	<section class="contact">
		<p>
			<span>Relocating to London (Skilled Worker visa route)</span>
			<span class="dash"></span>
			<span>Open to sponsorship</span>
		</p>
	</section>
	<section class="contact">
		<p>
			<span>
				<a href="https://www.linkedin.com/in/ulfdellbruegge/" target="_blank"> LinkedIn </a>
			</span>
			<span class="dash"></span>
			<span>
				<a href="mailto:ulfdellbruegge@gmail.com"> ulfdellbruegge@gmail.com </a>
			</span>
			<span class="dash"></span>
			<span>
				<a href="https://github.com/xintamosaik" target="_blank"> github.com/xintamosaik </a>
			</span>
		</p>
	</section>
	<section id="commercial_impact">
		<h2>Commercial Impact Highlights</h2>
		<ul>
			<li>
				<strong>Replaced a 5,000+ LOC legacy AdController</strong> with a 60-line config-driven system
				→ removed third-party dependency and enabled version-controlled deployments
			</li>
			<li>
				Reduced delivery feedback loops from 3–5 minutes to under 1 second, accelerating iteration
				and release confidence
			</li>
			<li>Cut bug rates ~20% in key workflows, improving system stability and stakeholder trust</li>
		</ul>
	</section>

	<!-- SUMMARY-->

	<section id="summary">
		<h2>Summary</h2>

		<p>
			Software Engineer experienced in TypeScript, JavaScript, React, Vue, Node.js, and
			containerised services. Strong track record of modernising legacy systems, improving delivery
			speed, and shipping maintainable production software.
		</p>
		<p>
			Comfortable working across frontend, backend, tooling, and infrastructure, with experience in
			Dockerised microservice environments and complex legacy codebases.
		</p>
		<p>
			Particularly effective in ambiguous environments where systems need to be understood,
			simplified, stabilised, and moved toward better engineering practices.
		</p>
	</section>

	<!-- EXPERIENCE-->

	<section id="experience">
		<h2>Experience</h2>
		<div class="job entry">
			<h3>
				<span>Software Engineer</span>
				<span class="dash"></span>
				<span>iq digital media marketing gmbh</span>
			</h3>
			<h4>
				<span>Jan 2024 - May 2025</span>
				<span class="dash"></span>
				<span>Düsseldorf, Germany</span>
			</h4>

			<ul>
				<li>
					<p>
						<strong>Reverse-engineered and replaced a 5,000-line legacy AdController</strong>
						with a ~60-line config-driven core — restored control over deployment, removed reliance on
						third-party TMS, enabled versioning, and laid the foundation for CI/CD and TypeScript-based
						development across ad tech infrastructure.
					</p>
				</li>
				<li>
					<p>
						<strong>Built the SkyMover system</strong> to unify ad positioning logic across 40+ client
						websites — replaced hundreds of scattered, error-prone layout scripts with a 100-line JS module,
						significantly reducing integration time per client and lowering ongoing maintenance overhead
						across 40+ revenue-generating websites.
					</p>
				</li>
				<li>
					<p>
						<strong>Architected and delivered a modern ad template builder</strong>
						using TypeScript and esbuild — replaced a fragile, manual system with import/export support,
						modular design, and a local test environment. Reduced feedback loop time from 3–5 minutes
						to under 1 second, enabling rapid iteration and future testing capabilities.
					</p>
				</li>

				<li>
					<p>
						<strong>Created internal DX tools</strong> including a test harness for templates, a URL builder
						to streamline QA workflows, and macro validation logic — significantly improved developer
						efficiency, reduced context-switching, and accelerated the migration of legacy templates.
					</p>
				</li>
				<li>
					<p>
						<strong>Drove culture shift toward engineering best practices</strong>
						by introducing TypeScript, ESLint, JSdoc, domain-based folder structures, and fast-feedback
						mindsets. Mentored junior teammates, led pair programming efforts, and helped reshape quality
						habits within a historically chaotic delivery environment.
					</p>
				</li>

				<li>
					<p>
						<strong>Supported development of a Chrome extension</strong> for PM and stakeholder visibility
						into ad setup status — contributed React and Chrome API guidance, improving internal transparency
						around campaign configuration.
					</p>
				</li>
			</ul>
		</div>
		<div class="job entry">
			<h3>
				<span>Software Engineer</span>
				<span class="dash"></span>
				<span>aufinity Group GmbH</span>
			</h3>
			<h4>
				<span>Sep 2025 - Now</span>
				<span class="dash"></span>
				<span>Cologne, Germany</span>
			</h4>

			<ul>
				<li>
					Delivered production changes across a Dockerised microservice platform using Vue, Fastify,
					MongoDB, Redis, and Kubernetes.
				</li>
				<li>
					Developed and maintained frontend and backend services within a proprietary internal
					framework used across multiple services.
				</li>
				<li>
					Reached full delivery velocity within weeks by quickly understanding the internal
					framework, service boundaries, and deployment workflow.
				</li>
				<li>
					Implemented unit and integration tests in a JSDoc-typed JavaScript environment, improving
					confidence in service changes.
				</li>
				<li>
					Contributed to containerised release workflows and Kubernetes-based deployments supporting
					reliable production delivery.
				</li>
			</ul>
		</div>

		<div class="job entry">
			<h3>
				<span>Full Stack Developer</span>
				<span class="dash"></span>
				<span>Qanuk GmbH</span>
			</h3>
			<h4>
				<span>April 2021 - December 2023</span>
				<span class="dash"></span>
				<span>Osnabrück, Niedersachsen, Germany</span>
			</h4>
			<ul>
				<li>
					<strong>Rebuilt an 8,000+ line legacy invoicing system</strong>
					into a modular WordPress plugin (q_invoice) using MVC architecture, domain/feature slicing,
					AJAX-based UX, and modern PHP practices. Achieved full feature parity in ~7 months, introduced
					multi-language support, custom tax handling, import/export logic, and reduced friction for business
					stakeholders through faster, dynamic interfaces.
				</li>
				<li>
					<strong>Designed and implemented a flexible internal reporting system</strong>
					(PHP + Chart.js) that enabled visual filtering across event types, cities, and date ranges —
					a key decision-making tool praised by the CEO for its usability and depth. Architected for extensibility,
					with lazy AJAX rendering and data-driven config logic.
				</li>
				<li>
					<strong>Reduced noise and instability in the admin panel</strong>
					by fixing 50–70 recurring PHP bugs and cleaning up thousands of warnings. Introduced a lightweight
					logging system with trace capabilities, restoring error log usability and giving the team visibility
					into regressions.
				</li>
				<li>
					<strong>Refactored scattered legacy code</strong> (PHP/JS) into modular components with clear
					boundaries — cutting bug rates by ~40% in key workflows and improving overall developer confidence
					and responsiveness.
				</li>
				<li>
					<strong>Took initiative to drive peer mentoring</strong> and code quality practices in a chaotic,
					process-light environment: introduced Discord-based pair programming sessions, launched informal
					review habits, and promoted better naming, structure, and JS/PHP linting across the team.
				</li>
				<li>
					<strong>Introduced WP_React, JSdoc, ESLint, and static PHP analysis tools</strong>
					to strengthen reliability and readability. Drove early Docker adoption to enable testability,
					though the team was not yet ready for full TDD.
				</li>
				<li>
					Used Postman for API development, Adminer for SQL analysis, and
					<strong
						>proactively learned unfamiliar tooling to support architectural improvements</strong
					>
					on the fly.
				</li>
			</ul>
		</div>
	</section>

	<!-- SKILLS -->

	<section>
		<h2>Skills</h2>
		<ul>
			<li>
				<strong>Core Stack:</strong> TypeScript, JavaScript (ES6+), React, Vue, Node.js (Fastify)
			</li>
			<li>
				<strong>Infrastructure & DevOps:</strong> Docker, Kubernetes, GitHub Actions, GitLab CI, AWS,
				GCP
			</li>
			<li>
				<strong>Data & Storage:</strong> MongoDB, SQL (MySQL/PostgreSQL), ORM
			</li>
			<li>
				<strong>Tooling & Quality:</strong> ESLint, JSDoc, TDD/BDD, CI/CD, DevOps practices
			</li>
		</ul>
	</section>

	<!-- EDUCATION -->

	<section>
		<h2>Education</h2>

		<div class="education entry">
			<h3>
				<span>Master of Arts in Sociology</span>
				<span class="dash"></span>
				<span>Universität Bielefeld</span>
			</h3>
			<h4>
				<span>September 2021</span>
				<span class="dash"></span>
				<span>Bielefeld, NRW, Germany</span>
			</h4>
			<p>Specialization: Qualitative Studies and Workplace Studies/Ethnomethodology</p>
		</div>
	</section>
</main>

<style>
	/* Restore document defaults affected by Tailwind Preflight. */
	.cv-document {
		line-height: normal;
	}

	.cv-document :where(h1, h2, h3, h4, p, ul) {
		margin: revert;
		font-size: revert;
		font-weight: revert;
	}

	.cv-document ul {
		list-style-type: disc;
	}

	.cv-document strong {
		font-weight: bolder;
	}

	.print-controls {
		padding: 1rem;
	}

	.print-controls button {
		cursor: pointer;
		border: 1px solid #aaa;
		border-radius: 0.25rem;
		padding: 0.5rem 0.75rem;
	}

	@media print {
		.print-controls {
			display: none;
		}
	}

	.cv-document {
		font-family: 'Helvetica', 'Verdana', 'Roboto', 'Arial', sans-serif;
		margin: 0;
		font-size: 9pt;
	}

	.cv-document {
		padding-top: 1em;
		border-right: 1ch yellow solid;
		max-width: 210mm;
	}

	.cv-document ul {
		padding-inline-start: 4ch;
	}

	.cv-document p {
		margin-top: 6pt;
	}

	.cv-document li,
	.cv-document p {
		line-height: 1.7;
	}

	.cv-document a {
		color: rgb(7, 43, 94);
		text-decoration: none;
	}

	.cv-document a:hover {
		text-decoration: underline;
	}

	.cv-document h1,
	.cv-document h2,
	.cv-document h3,
	.cv-document h4,
	.cv-document p {
		margin-bottom: 0;
	}

	.cv-document h1,
	.cv-document h2,
	.cv-document h3 {
		text-transform: uppercase;
	}

	.cv-document h1 {
		margin-top: 0;
		font-size: 18pt;
	}

	.cv-document h2 {
		margin-top: 28pt;
		font-size: 16pt;
	}

	.cv-document h3 {
		margin-top: 16pt;
		font-size: 14pt;
	}

	.cv-document h4 {
		font-weight: normal;
		font-style: italic;
		margin-top: 4pt;
		font-size: 11pt;
	}

	.cv-document section#title,
	.cv-document section.contact {
		display: flex;
		gap: 1ch;
	}

	.cv-document .dash:before {
		content: '\00B7';
	}

	@media print {
		@page {
			size: A4;
		}

		.cv-document {
			margin-left: 10mm;
			margin-right: 10mm;
			border: none;
		}

		.cv-document ul li {
			page-break-inside: avoid;
		}
	}
</style>
