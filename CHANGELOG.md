# Changelog

Fork changes only. Upstream release notes: [releases](https://github.com/QingYunA/answer-me-with-html/releases).

## 2026-10-25 (pi fork)

### Fixed

- **Quotations.** The STE check treated a quoted sentence as the author's own prose. A quoted
  30-word reviewer sentence with "utilize" and "in order to" produced four warnings and told the
  model to rewrite the quotation. `clean()` now drops quoted spans before the rules run: `"..."`,
  `“…”`, `「…」`, `『…』`, `«…»`, `„…“`. Single quotes stay, because they are usually apostrophes.
  The text around a quote is still checked, and so are quoted words inside a step.
- **Paths.** Five `${CLAUDE_SKILL_DIR}/scripts/am.mjs` calls became `scripts/am.mjs`, resolved
  against the skill directory. pi prints that path as `<location>` and never replaces the variable.
- **Arguments.** `$ARGUMENTS` became "the text after `/skill:answer-me-with-html`". pi appends skill
  arguments to the instructions instead of substituting them.
- **Reply links.** Four host-specific paragraphs became one `file://` rule plus one sentence for
  hosts with an in-app browser or a `present` tool.
- **Competing prose rules.** Section 6 now defers to an installed prose-editing skill instead of
  setting a second, different threshold.

### Changed

- **Trigger.** The description no longer says "use it proactively and liberally, when in doubt use
  it". It names the request shapes and the phrases, and keeps plain text as the default for a
  one-line answer. The description is 526 characters, down from 996, which leaves room to grow.
- **Defaults named.** The skill says that `am render` opens a browser window and that the CLI reads
  `package.json` on GitHub once a day, with the `am config set` line for each.
- **Always-on path.** The rule file is named as `~/.pi/agent/AGENTS.md`.

### Added

- `FORK.md`: what changed, pi install, settings, upstream sync, verification, privacy.
- `CHANGELOG.md`: this file.
- `test/lint.test.js`: quotations in English and CJK, a quote that would break the paragraph limit,
  and a step whose quoted tail is skipped while the step itself is not.
