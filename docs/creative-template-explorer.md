# Creative template explorer

The landing template explorer demonstrates a core product constraint:

> The release facts remain fixed while creative direction changes.

## Separation of concerns

`explorerRelease` contains product/release facts only.

`creativeTemplateRegistry` contains presentation metadata only:

- template ID and version;
- palette tokens;
- typography style;
- density;
- human-readable description and intended use.

The explorer joins those two inputs at render time. Selecting another template does not mutate or refetch the release.

## Registry contract

Each template direction has a stable `id` and `version`. This is intentionally close to the future renderer registry so the landing does not need to be rewritten when real template selection becomes a product capability.

Current directions:

- Editorial Signal
- Kinetic Product
- Minimal Launch
- Technical Devtool

## Accessibility

The direction selector is a keyboard-accessible tablist:

- Left/Right arrows move between directions;
- Home/End jump to the first/last direction;
- the active panel is linked through ARIA tab/tabpanel semantics.

## RAIDER

- **Reusable:** registry entries are declarative and independent of component structure.
- **Agnostic:** no template is keyed to AgenFetch or another repository.
- **Idempotent:** selecting a template changes presentation only.
- **Durable:** stable IDs and versions provide an upgrade path.
- **Engineering-grade:** release facts and presentation tokens are separate contracts.
- **Retroactive:** the explorer can later consume the production template registry without changing its interaction model.
