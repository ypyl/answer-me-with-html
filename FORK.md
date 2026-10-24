# pi fork

Fork of [QingYunA/answer-me-with-html](https://github.com/QingYunA/answer-me-with-html) (MIT) for the
[pi coding agent](https://github.com/badlogic/pi-mono). Upstream ships a release every day or two, so
this fork changes as little as it can and touches `src/` only for the one lint fix below.

## What the fork changes

| Upstream | This fork |
|---|---|
| `$ARGUMENTS` and `${CLAUDE_SKILL_DIR}` in the instructions | `scripts/am.mjs` relative to the skill directory; pi prints that path as `<location>` |
| Trigger: "use it proactively and liberally, when in doubt use it" | Trigger names the request shapes (explain, draw, compare, review) and the phrases; a one-line answer stays plain text |
| Reply branches for DeepSeek Harness and Codex | One `file://` link rule, one sentence for hosts with an in-app browser |
| Defaults unstated: a browser window per render, a daily update check | Both named, with the `am config set` line that turns them off |
| The STE check rewrites quotations | Quoted text is skipped, the text around it is still checked |
| No pi install notes | Install, sync and verify below |

## Install for pi

The skill lives inside this repository at `skills/answer-me-with-html`. Clone the fork into pi's
skill directory and pi finds it:

```bash
git clone https://github.com/ypyl/answer-me-with-html.git ~/.pi/agent/skills/answer-me-with-html
```

Restart pi, or run `/reload` in a session. Force the skill with:

```
/skill:answer-me-with-html explain the TCP three-way handshake
```

If a copy of the upstream skill sits at `~/.agents/skills/answer-me-with-html`, move it away first.
pi loads both and keeps the first one it finds.

## Settings for pi

The skill directory is nested, so keep the CLI path in a variable:

```bash
AM=~/.pi/agent/skills/answer-me-with-html/skills/answer-me-with-html/scripts/am.mjs
node "$AM" --version
node "$AM" config set open off          # no browser window after each render
node "$AM" config set update_check off  # no daily read of package.json on GitHub
```

Always-on mode is opt-in: add the `[answer-me-with-html always-on]` rule to `~/.pi/agent/AGENTS.md`
only if you want a page on every conclusion.

## Sync with upstream

```bash
cd ~/.pi/agent/skills/answer-me-with-html
git fetch upstream
git merge upstream/main
npm install && npm run build   # only when src/ changed
npm test
```

If `am.mjs` conflicts, take either side and run `npm run build`. Never merge the bundle by hand:
upstream's `CONTRIBUTING.md` says the same.

## Verify the fork

```bash
AM=~/.pi/agent/skills/answer-me-with-html/skills/answer-me-with-html/scripts/am.mjs
node "$AM" lint - <<'EOF'
## A
The reviewer wrote: "We utilize the cache in order to leverage the pool."
EOF
```

The expected output is `STE ✓ 0 warnings`. Upstream reports four warnings for the same draft.

## Privacy

A page is one file, offline, with a locked CSP (`default-src 'none'`, sha256-pinned scripts). Three
things reach the network, all optional: `update_check` reads `package.json` on GitHub once a day,
`am theme add` reads the catalog at answer-me-with-html.com, and video narration calls ElevenLabs when
`ELEVENLABS_API_KEY` is set. The page embeds the draft source and every `src=` code block it quotes,
so a shared page carries that content.
