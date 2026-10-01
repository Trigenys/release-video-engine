# Atelier Maître sales demos

Issue #45 adds a reusable product-demo path to Release Video Engine and two first-party Atelier Maître sales assets.

## Outputs

### General demo

- composition: `AtelierMaitre-General-FR`
- output: `out/atelier-maitre/atelier-maitre-demo-general-fr.mp4`
- duration: 5:00
- audience: interested workshop / maintenance prospects
- story: dashboard → work order → planning → stock → billing → reporting → notifications

### Fleet demo

- composition: `AtelierMaitre-Fleet-FR`
- output: `out/atelier-maitre/atelier-maitre-demo-flotte-fr.mp4`
- duration: 5:30
- audience: fleet / transport / logistics operators, initially prompted by SWYFT's request
- story: workshop queue → planning/bays → assignment → progress → parts → ready/SMS workflow → reporting

## Source integrity

UI screenshots are fetched from the public Atelier Maître repository and pinned to commit:

`fc7735c3f459da89b5a2339bd82e2b503f077f09`

This keeps the render tied to a concrete product revision and avoids fabricated UI.

The SMS scene intentionally describes a **workflow** rather than claiming live carrier delivery. The current Atelier Maître source contains Orange/MTN/Camtel number detection and an SMS queue/history, while the gateway implementation in that revision is still mocked.

## Render

```bash
npx tsx scripts/validate-atelier-maitre-demos.mts
node scripts/render-atelier-maitre.mjs
```

The GitHub Actions workflow `Render Atelier Maître sales demos` performs the same validation and uploads both MP4s plus render telemetry as one artifact.
