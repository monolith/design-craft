# Le Corbusier — Polychromie Architecturale: colour system & colour theory

> **Deep-research record** (recovered from a `deep-research` run: 101 agents, 526 tool calls). Claims adversarially verified (3-vote); confidence + vote per finding.
> **De-noised** — operational logs stripped; substantive findings only. This is the evidence base behind the
> colour skill's **Corbusier** house-palette [CONVENTION]; read it to see which parts are now genuinely sourced.

**Research question.** Le Corbusier's architectural colour system — Polychromie Architecturale (the 1931 and 1959 colour collections). Research, with named sources, separating proven/established facts from convention and myth: (1) the actual colours — how many, their tonal/hue families, and how the two collections (1931 ~43 colours, 1959 ~20 more, ~63 total) are organised; (2) the colour-theory principles and harmony rules behind it — "architectural polychromy," the "colour keyboards"/claviers de couleurs, why these muted/greyed hues, how Le Corbusier intended them to be combined (which pair, which are "dynamic" vs "constructive/calm"), and the spatial/psychological effects he claimed (colour to organise space, advance/recede, evoke mood); (3) how the system has been standardised and digitised — Les Couleurs Le Corbusier / kt.COLOR, NCS/RAL/hex mappings, licensing; (4) its validity and applicability as a restrained, low-saturation palette for modern web/UI and data-visualization design (does the harmony logic transfer to screens; contrast/accessibility implications of the muted tones). Focus on colours and colour theory specifically, not his architecture or furniture.

## Summary

Le Corbusier's Polychromie Architecturale is a standardized system of 63 architectural colours across two collections he designed for the Swiss wallpaper maker Salubra — 43 muted "Puristic" shades dated 1931 (organised into ~12 keyboards / 14 series) and 20 brighter, "more powerful and dynamic" shades dated 1959 (one additional keyboard), for ~13 keyboards total. Its harmony engine is the claviers de couleurs ("colour keyboards"): mood-grouped sample cards (Space, Sky, Velvet, Wall, Sand, Landscape, etc.) with a sliding window that isolates a few compatible tones so any revealed set stays harmonious; a peer-reviewed NCS analysis (Serra et al., 2016) reverse-engineered the underlying rules as equal chromaticness (saturation), contrast in blackness (lightness), and warm-cool contrast rather than complementary-hue contrast. The theory ("architectural polychromy") treats colour as a structural means equal to plan and section — blues/greens recede and create depth, red fixes the wall, and Le Corbusier claimed physiological effects (blue calming, red exciting). Today the system is trademark-protected and globally licensed as Les Couleurs® Le Corbusier® (Les Couleurs Suisse AG with the Fondation Le Corbusier), digitized by kt.COLOR with NCS decompositions and internal codes (32xxx for 1931, 4320A–W for 1959). On modern applicability: a cross-cultural empirical study (Serra, Manav & Gouaich, 2021) found designers actually prefer pale, low-saturated colours — consistent with the palette's restrained character — but the transfer of its harmony logic to emissive RGB screens and its WCAG contrast implications are not directly established by the surviving evidence.

## Verified findings (8)

### F1 — high · vote 3-0 (merged from claims [0],[2],[14],[17])

The Polychromie Architecturale is a standardized system of 63 colours in two collections: 43 shades dated 1931 and 20 additional shades dated 1959, all originally designed for the Swiss wallpaper manufacturer Salubra. The 1959 additions (beginning 'rouge vermillon 59') are brighter and more intense.

**Evidence.** The 43 + 20 = 63 count is undisputed and appears across the commercial licensor (lescouleurs.ch, kt.COLOR), the authoritative Fondation Le Corbusier, Wikipedia ('Le Corbusier's Architectural Polychromy'), and the standard scholarly reference — Arthur Ruegg, 'Polychromie architecturale: Le Corbusier's Color Keyboards from 1931 and 1959' (Birkhauser, ISBN 9783035606614), whose title itself confirms the two-collection dating. Wikipedia notes 'no scholarly disagreement about the counts or categorization.' The Salubra origin is confirmed by a neutral antiquarian source (Ursus Books). A separate refuted claim mis-dated the second collection as 1952; 1959 is correct.

**Sources:** https://www.lescouleurs.ch/en/the-colours/ · https://ktcolor.com/en/shop/polychromie-le-corbusier/ · https://www.lescouleurs.ch/the-colour-system · https://www.fondationlecorbusier.fr/en/le-corbusier/works/architecture/polychromie-architecturale/ · Ruegg, Polychromie architecturale, Birkhauser, ISBN 9783035606614 · Wikipedia: Le Corbusier's Architectural Polychromy

### F2 — high · vote 3-0 (merged from claims [3],[9],[15],[17])

The 63 colours are organised across ~13 'keyboards' (claviers de couleurs / Musterkarten): the 1931 collection = 43 shades on 12 keyboards (each keyboard drawing on 31 colours, combinable via a Bristol-card slider), and the 1959 collection = 20 shades on 1 additional keyboard. The 1931 shades are also framed as 14 series ('Puristic Shades').

**Evidence.** Fondation Le Corbusier states verbatim: 1931 = '43 shades as well as 12 color keyboards. Each keyboard consisted of 31 colors'; 1959 = '20 additional shades (brighter and more intense) and a color keyboard.' Ruegg's Birkhauser monograph (3rd ed.) is specified as '174 pages with 13 keyboards and 63 full-size colour samples' (12 + 1 = 13). The internal arithmetic is consistent: keyboards reuse the 43/20 unique shades across cards, so '31 per keyboard' is card composition, not palette total. Minor terminology variance (lescouleurs.ch frames 1931 as '14 series' with codes 32xxx; kt.COLOR '12 keyboards') is granularity, not contradiction.

**Sources:** https://www.fondationlecorbusier.fr/en/le-corbusier/works/architecture/polychromie-architecturale/ · https://ktcolor.com/en/shop/polychromie-le-corbusier/ · https://www.lescouleurs.ch/the-colour-system · https://lescouleurs.ch/en/about-us/faq/ · Ruegg, Polychromie architecturale, Birkhauser

### F3 — high · vote 3-0 (merged from claims [1],[4],[8],[16],[18],[19])

The harmony mechanism is the mood-grouped 'colour keyboards' (claviers de couleurs). In 1931 Le Corbusier grouped colours by emotional and spatial effect into named atmospheres — Space (espace), Sky (ciel), Velvet (velours), Wall (mur), Sand (sable), Landscape (paysage) — and a physical sliding window isolates a small set of shades (sources vary: 2-3 or 3-5) so any revealed combination is harmonious. It was intended as a systematic aid that 'places the task of choosing on a sound systematic basis,' not free choice.

**Evidence.** The 'colour keyboards' term is canonical, not marketing: it is the literal title of Ruegg's authoritative Birkhauser monograph and is used by Fondation Le Corbusier, the V&A, and peer-reviewed studies. Fondation Le Corbusier documents the named moods and the slider/frame mechanism. ArchDaily quotes Le Corbusier's own words: 'these Keyboards of Color aim at stimulating personal selection... color harmonies which are definitely architectural.' Caveats (non-refuting): the licensor's 'combined in any way' oversimplifies the pre-composed 3-5-colour card structure; slider-count differs across sources (2-3 vs 3-5). A separate claim that the slider is the *sole* intended harmony rule was refuted 0-3.

**Sources:** https://www.lescouleurs.ch/en/the-colours/ · https://www.lescouleurs.ch/the-colour-system · https://www.fondationlecorbusier.fr/en/le-corbusier/works/architecture/polychromie-architecturale/ · https://ktcolor.com/en/shop/polychromie-le-corbusier/ · https://lescouleurs.ch/en/about-us/faq/ · Ruegg, Polychromie architecturale, Birkhauser

### F4 — high · vote 3-0 (merged from claims [5],[6])

A peer-reviewed NCS analysis of Le Corbusier's actual 1931 Salubra keyboards identified his combination logic as: pairing colours of equal chromaticness (equal saturation), seeking contrast in blackness (lightness/darkness), and contrasting cool with warm colours — a rule slightly distinct from classic complementary-hue contrast.

**Evidence.** Serra et al. (2016), 'Color combination criteria in Le Corbusier's Purist architecture based on Salubra claviers from 1931,' Color Research & Application (Wiley), doi 10.1002/col.21940. The study decomposed each colour in the Natural Color System into hue, blackness, and chromaticness and analysed the actual 312 four-colour combinations from the 1931 keyboards. Verbatim abstract: 'the preference of colors with equal chromaticness, the search of some contrast in blackness, or the usual resource of contrasting cool with warm colors, something slightly different to the contrast of complementary colors.' NCS is device-independent/perceptual, which is what makes the rules potentially portable to screens. Peer-reviewed primary source, corroborated across ResearchGate/Semantic Scholar mirrors.

**Sources:** https://onlinelibrary.wiley.com/doi/10.1002/col.21940 · Serra et al. (2016), Color Research & Application, doi 10.1002/col.21940

### F5 — high · vote 3-0 (merged from claims [7],[12])

Le Corbusier's theory ('architectural polychromy') frames colour as a structural design means equal in power to the ground plan and section — a component of them, not decoration — capable of moving walls in depth and ranking their importance.

**Evidence.** Fondation Le Corbusier carries his verbatim statements: 'Polychromy is as powerful a means of architecture as the plan and the section' (attributed to his 1936 Rome conference paper) and 'Architectural polychromy does not kill walls, but it can move them in depth and classify them in importance.' Corroborated by ArchDaily, Building Design (bdonline), Wikipedia, and echoed by the licensor ('a means as powerful as the ground plan and section. Or better: polychromy, a component of the ground plan and the section itself'). The non-decorative framing is explicit ('does not kill walls').

**Sources:** https://www.lescouleurs.ch/the-colours · https://www.fondationlecorbusier.fr/en/le-corbusier/works/architecture/polychromie-architecturale/ · ArchDaily; bdonline; Wikipedia: Le Corbusier's Architectural Polychromy

### F6 — high · vote 3-0 (merged from claims [10],[11])

Le Corbusier assigned colours opposing spatial and psychological roles: blues and greens recede, create depth, distance and atmosphere; red fixes and affirms the wall's exact position, dimension and presence. He further claimed physiological reactions — blue calming, red exciting ('blue at rest, red in action').

**Evidence.** Fondation Le Corbusier holds the verbatim French: 'Le bleu et ses composes verts creent de l'espace, donnent de la distance... eloignent le mur'; 'Le rouge... fixe le mur, affirme sa situation exacte, sa dimension, sa presence'; and under 'Reactions physiologiques profondes': 'Le bleu agit sur l'organisme comme un calmant, le rouge comme un excitant. L'un est au repos, l'autre est action.' Corroborated by Wikipedia, ArchDaily, and the licensor ('if a wall is blue it recedes; if red it holds the plane'). IMPORTANT: these are Le Corbusier's stated claims about intended effect, correctly framed as his theory — not empirically validated colour physiology.

**Sources:** https://www.fondationlecorbusier.fr/en/le-corbusier/works/architecture/polychromie-architecturale/ · Wikipedia: Le Corbusier's Architectural Polychromy · ArchDaily · https://www.lescouleurs.ch/the-colours

### F7 — high · vote 3-0 (merged from claims [20],[17]; standardization aspects of [5])

The system has been standardized and digitized as a globally licensed, trademark-protected offering — 'Les Couleurs® Le Corbusier®' — with rights held by Les Couleurs Suisse AG (exclusive worldwide licensor) and the Fondation Le Corbusier (underlying copyright, © FLC / ADAGP). kt.COLOR realizes it physically and provides NCS decompositions and internal codes (32xxx for the 1931 series; 4320A–4320W for the 1959 set).

**Evidence.** lescouleurs.ch states Les Couleurs Suisse AG is the 'exclusive worldwide licensor' entrusted by the Fondation Le Corbusier, uses the registered 'Les Couleurs® Le Corbusier' brand, and displays '©FLC / ADAGP.' Coding scheme (32xxx / 4320A–W) and the NCS mapping are documented on the licensor/kt.COLOR pages and the Serra NCS study. Minor imprecision: the arrangement is a licensor/copyright split (FLC copyright + Les Couleurs Suisse AG trademark and license), not literal co-ownership; 'held jointly' is a fair summary of the site's own 'Rights held by' phrasing. Caveat: primary citations here are the commercial rights-holder, though the licensing structure is self-evidently authoritative on itself.

**Sources:** https://lescouleurs.ch/en/about-us/faq/ · https://lescouleurs.ch/en/about-us/les-couleurs-suisse-ag · https://ktcolor.com/en/shop/polychromie-le-corbusier/ · https://www.lescouleurs.ch/the-colour-system · https://onlinelibrary.wiley.com/doi/10.1002/col.21940

### F8 — high · vote 3-0 (from claim [13])

On modern applicability: an empirical cross-cultural preference study using the actual 1931 Salubra keyboards as stimuli found architecture/interior-design students slightly dislike or are indifferent to Le Corbusier's own combinations and instead prefer pale, low-saturated colours; the least-preferred were green and brown hues, and value (lightness) and saturation drove preference. This supports the appeal of a restrained low-saturation palette while questioning the universality of his specific combinations.

**Evidence.** Serra, Manav & Gouaich (2021), 'Assessing architectural color preference after Le Corbusier's 1931 Salubra keyboards: A cross cultural analysis,' Frontiers of Architectural Research (Elsevier/HEP), doi 10.1016/j.foar.2021.03.002. Peer-reviewed primary source, lead author an established architectural-colour researcher, verified against the journal's own abstract. Scope caveat (qualifies, does not refute): the stimulus was a single interior (a bedroom of Le Corbusier's Swiss Pavilion), so results are context-specific to interior architecture, not a universal verdict — and NOT a test on emissive screens or data-visualization.

**Sources:** https://www.sciencedirect.com/science/article/pii/S2095263521000236 · Serra, Manav & Gouaich (2021), Frontiers of Architectural Research, doi 10.1016/j.foar.2021.03.002

## Refuted / corrected (4)

### R1 — 0-3

Le Corbusier created the two colour palettes between 1931 and 1952 (not 1959 per this source), and designed them to be harmonious and to embody specific spatial and human effects.

**Source.** https://www.lescouleurs.ch/en/the-colours/

### R2 — 0-3

The 3–5-shades-per-keyboard combination mechanism (a physical slider that reveals only compatible tones together) is the intended harmony rule, confirmed verbatim on kt.COLOR's own page.

**Source.** https://ktcolor.com/en/shop/polychromie-le-corbusier/

### R3 — 1-2

Le Corbusier's 1931 Salubra palette is dominated by earthy hues and deliberately omits whole colour families — yellows, violets, black, and white are notably absent.

**Source.** https://onlinelibrary.wiley.com/doi/10.1002/col.21940

### R4 — 0-3

Le Corbusier's Polychromie Architecturale comprises 63 architectural colours, developed between 1931 and 1952, organised into two architectural colour palettes/collections.

**Source.** https://www.lescouleurs.ch/the-colours

## Caveats

Source-quality: the bulk of primary citations for the count, keyboard structure, and 'harmony' framing are the commercial rights-holder (Les Couleurs Suisse AG / lescouleurs.ch and its realizer kt.COLOR). This is mitigated because the load-bearing facts are independently corroborated by the authoritative Fondation Le Corbusier, Arthur Ruegg's Birkhauser scholarly monograph, and peer-reviewed Serra papers; marketing phrasing ('perfect and surprising harmonies,' 'combined in any way') should be discounted as puffery over a real underlying structure.

Count/terminology variance (not contradictions): 12 vs 13 keyboards (12 = 1931 only; 13 = full system incl. 1959); '14 series' (lescouleurs.ch) vs '12 keyboards' (Fondation/kt.COLOR) for the 1931 set; slider reveals '2-3' (Fondation) vs '3-5' (kt.COLOR) shades. These are granularity/framing differences.

Theory vs proven effect: the spatial and psychological effects (blue recedes/calms, red fixes/excites) are Le Corbusier's own claims and design intent, NOT empirically validated colour physiology. Treat as historical doctrine.

Applicability gap: the surviving evidence does NOT address WCAG contrast or accessibility of these muted, low-saturation tones on screens, nor whether the NCS-derived harmony rules (validated for reflective wallpaper/paint) transfer to emissive RGB displays. The favorable transfer inference rests only on (a) NCS being perceptual/device-independent and (b) the 2021 single-interior preference study — both indirect.

Refuted/low-confidence items for transparency: the '1931–1952' dating is wrong (it is 1959); the claim that the slider is the sole intended harmony rule was refuted; and the claim that the 1931 palette is 'earthy-dominated and omits yellows/violets/black/white' failed verification (1-2) — so the exact hue-family composition of the 63 is NOT established here.

Time-sensitivity: the art-historical facts are settled and stable. The licensing/commercial details (trademark holder, kt.COLOR realization, one FAQ URL that now 404s) are current as of mid-2026 and could change; verify the live licensor pages before relying on them commercially.

## All sources

- https://www.lescouleurs.ch/en/the-colours/ — primary · broad/primary — the colours and structure
- https://www.amazon.com/Polychromie-Architecturale-Corbusiers-Farbenklaviaturen-Keyboards/dp/3035606617 — secondary · broad/primary — the colours and structure
- https://en.wikipedia.org/wiki/Le_Corbusier's_Architectural_Polychromy — secondary · broad/primary — the colours and structure
- https://ktcolor.com/en/shop/polychromie-le-corbusier/ — primary · broad/primary — the colours and structure
- https://corbusier.arnorichter.de/ — blog · broad/primary — the colours and structure
- https://onlinelibrary.wiley.com/doi/10.1002/col.21940 — primary · academic/theory — harmony rules and claviers
- https://www.lescouleurs.ch/the-colours — primary · academic/theory — harmony rules and claviers
- https://www.fondationlecorbusier.fr/en/le-corbusier/works/architecture/polychromie-architecturale/ — primary · academic/theory — harmony rules and claviers
- https://www.archdaily.com/1003880/le-corbusiers-color-theory-embracing-polychromy-in-architecture — secondary · academic/theory — harmony rules and claviers
- https://www.lescouleurs.ch/post/le-corbusier-s-architectural-polychromy-a-masterclass-in-colour-in-architecture — secondary · academic/theory — harmony rules and claviers
- https://www.sciencedirect.com/science/article/pii/S2095263521000236 — primary · academic/theory — harmony rules and claviers
- https://www.lescouleurs.ch/the-colour-system — primary · standardization/digitization — the licensed system
- https://lescouleurs.ch/en/about-us/faq/ — primary · standardization/digitization — the licensed system
- https://ktcolor.com/en/about-us/ — primary · standardization/digitization — the licensed system
- https://hueatlas.com/color-palettes/le-corbusier-color-palette/ — blog · standardization/digitization — the licensed system
- https://ktcolor.com/en/blog/le-corbusiers-colors/ — secondary · practitioner/implementation — screens, UI, dataviz
- https://gist.github.com/oelna/743be12076895e2c2d662c631f34ec97 — blog · practitioner/implementation — screens, UI, dataviz
- https://birkhauser.com/en/book/9783035606614 — secondary · contrarian/skeptical — proven vs myth vs convention
- https://www.architectsjournal.co.uk/archive/luxurious-look-of-corbusian-colour — secondary · contrarian/skeptical — proven vs myth vs convention

