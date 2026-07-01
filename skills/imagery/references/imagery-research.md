# Imagery (photography & illustration) — deep-research synthesis

> **Deep-research record** (107 agents, 549 tool calls). Claims adversarially verified (3-vote); confidence + vote per finding. **De-noised** — operational logs stripped; substantive findings only. Evidence base for the design-craft `imagery` skill.

**Scope (confirmed):** SELECT good images · give FEEDBACK/critique · DIRECT treatment · decide photo-vs-illustration · LIGHT programmatic illustration (SVG/Pillow). Does NOT generate photographs; not a heavy photo editor.

## Summary

The evidence core of an imagery skill rests on two of the best-replicated results in perception/instructional science: pictures generally beat words for memory (the picture-superiority effect), and an image that does NOT carry the core message measurably harms comprehension (Mayer's coherence / seductive-details principle) — together these ground the skill's central "does it carry the message?" relevance test as [STRONG], not a soft preference. For directing attention, eye-tracking shows a model's gaze pointed at the product reliably pulls viewers' eyes to it (~4x more product fixations), and a smiling model raises product evaluation and purchase intent — but gaze moves intent-to-buy, not liking, and its steering power is weakened when the face is a famous celebrity that captures attention to itself. In task-oriented browsing, users fixate information-carrying images and skip decorative/generic-stock filler, and affective response to photographic content is systematic enough to have been formally normed (IAPS) — so image choice reliably sets emotional register. The rule of thirds, by contrast, is a documented [MYTH] as an aesthetic predictor: it fails to distinguish high- from low-quality photographs. CRITICAL GAP: this fan-out produced NO surviving evidence for three of the six requested sections — tonal treatment, light programmatic illustration, and accessibility/alt-text (WCAG 1.1.1) — which the skill must source from standards and craft convention directly.

## Verified findings (9)

### F1 — high · vote unanimous (six claims, each 3-0)

[STRONG] The image must carry the message: adding interesting-but-irrelevant material (including decorative/off-brief pictures) to a text+image message measurably reduces comprehension and transfer. This is Mayer's coherence principle plus the seductive-details effect — the direct evidence base for the skill's relevance test and against decorative clutter.

**Evidence.** Six independently-verified claims (0,3,7,8,9 on coherence; 1 on moderation) converge. Merged. CAVEAT for labeling: Mayer's within-lab effect sizes (d=0.86-0.97) are the ceiling; independent meta-analyses put the seductive-details effect at a smaller MEDIUM magnitude (g approx -0.16 to -0.41). The harm is moderated by working memory — large for low-WM learners (d=1.14, Sanchez & Wiley 2006), near-zero for high-WM. Cite direction as [STRONG]; present magnitude as 'largest in low-prior-knowledge, controlled conditions.' Domain note: evidence is from instructional/learning contexts; extension to marketing/brand imagery is reasonable but not directly tested. The refuted '3x recall' magnitude claim (0-3 vote) must NOT be cited.

**Sources:** Mayer & Fiorella (2014), Cambridge Handbook of Multimedia Learning, Ch.12 — coherence supported 23/23 tests, median d=0.86; concise beats cluttered 13/14, median d=0.97 · Harp & Mayer (1998), J. Educational Psychology 90(3):414-434 — 4 experiments, 357 undergrads: seductive details lowered recall of main ideas and transfer solutions · Cambridge Univ. Press, Multimedia Learning — 'People learn better when extraneous material is excluded rather than included'; names 'interesting but irrelevant words and pictures' as a seductive-detail category · Independent meta-analyses: Sundararajan & Adesope (2020) Educational Psychology Review; Rey (2012); 2025 multi-level meta (50 studies) — confirm direction

### F2 — high · vote 3-0

[STRONG] Put captions and labels NEAR the image, not far from it. Spatial contiguity is the largest-effect static-imagery principle — corresponding words and pictures presented together improve learning. Falsifiable guidance for caption/label placement.

**Evidence.** Claim 2, verbatim-confirmed. Independent meta-analysis (Ginns d=0.85) corroborates at a lower pooled magnitude than Mayer's lab median (1.10) — expected, since Mayer's stimuli use complex/novice conditions where the effect peaks. Boundary condition (already scoped by 'corresponding'): the effect can vanish/reverse for UNRELATED representations placed together (Frontiers 2019 'spatial contiguity failure'). Label [STRONG] with the complexity moderator noted.

**Sources:** Mayer & Fiorella (2014), Cambridge Handbook Ch.12 — supported 22/22 tests, median d=1.10 · Ginns (2006) meta-analysis, 50 studies — weighted mean d=0.85 (CI 0.68-1.02), moderated by material complexity · Schroeder & Cenkci (2018), Educational Psychology Review — confirms split-attention/contiguity

### F3 — high · vote unanimous (three claims, each 3-0)

[STRONG-but-conditional] Pictures are generally remembered better than words (picture-superiority effect), but this is NOT universal: it weakens, disappears, or fully reverses when the picture's verbal label is non-discriminative or the images are abstract/homogeneous.

**Evidence.** Claims 4,5,6 merged. The core effect is one of the most replicated in memory research; the boundary conditions are also replicated (Weldon & Roediger 1987 showed reversal under altered retrieval). Skill implication: pictures help memory MOST when the depicted concept is distinctive/discriminable from neighbors, LEAST when images are abstract or a homogeneous set. Modern theory frames this as distinctiveness rather than pure dual-coding, but the empirical guidance is unchanged.

**Sources:** Paivio & Csapo (1973), Cognitive Psychology 5:176-206, via Hogrefe Experimental Psychology (peer-reviewed) — PSE established, 'all else being equal, pictures remembered better than words' · Oates & Reder (CMU) — Exp.1 pictures d'=2.46 vs words d'=2.67, F(1,15)=.54, p>.05 when foils shared target concept: 'if the label of the picture is not discriminative, pictures will be no better remembered than words' · Reder et al. (2006), Psychological Science 17(7):562-567 — under saline, abstract pictures WORST, photos middle, words BEST recognized · Ensor/Surprenant/Neath (2019); Higdon et al. (2025) QJEP — corroborate distinctiveness account

### F4 — high · vote unanimous (two claims, each 3-0)

[STRONG] Yes — viewers follow a model's gaze to the product. A model's gaze directed at the advertised product makes viewers roughly 4x more likely to fixate the product region.

**Evidence.** Claims 10,12 merged. Direct eye-tracking (not self-report). Two primary marketing-science studies plus the robust foundational gaze-cueing literature. Scope carefully: this is an ATTENTION/fixation effect. Stimuli were controlled mock ads, so 'in the wild' generalization is an extrapolation. Label [STRONG] for attention allocation.

**Sources:** Palcu, Sudkamp & Florack (2017), Frontiers in Psychology (PMC5454066) — product-AOI hit odds 4.117x higher for gaze-toward vs away; chi-square(3,N=78)=8.478, p=0.037; gaze main effect Wald p=0.009 · D'Ambrogio, Werksman, Platt & Johnson (2023), Psychology & Marketing 40(4), doi:10.1002/mar.21772 (N=77, eye-tracking+pupillometry) — non-celebrity gaze at product pulls viewers' gaze and dwell to the product · Foundational: Friesen & Kingstone (1998) gaze-cueing; Frischen et al. (2007)

### F5 — medium · vote split (claim 13 3-0; claims 11 and 14 each 2-1)

[CONVENTION / single-study] Gaze's persuasion payoff is narrow: gaze-to-product nudges intention-to-buy but NOT how much the product is liked or willingness-to-pay — and the steering effect is attenuated when the face is a famous celebrity (viewers linger on the star regardless of gaze).

**Evidence.** Merged 11,13,14. The intent/evaluation DISSOCIATION is well-supported and its would-be refuter (gaze-liking) did not replicate. But the purchase-intent lift is a single small unreplicated effect (one-tailed p=0.035, small effect size); the celebrity moderation rests on one study (N=77). Soften the word 'ONLY' to 'weaker/attenuated for celebrities.' Design rule: do NOT assume a gaze-directed layout makes the subject more LIKED — only more looked-at and more likely to be acted on. Label [CONVENTION], flag as single-study.

**Sources:** Palcu, Sudkamp & Florack (2017), Frontiers in Psychology (PMC5454066) — purchase intent M=2.79 (toward) vs 2.09 (away), F(1,62)=3.405, p=0.035 (one-tailed, small eta-p-sq=0.026); attractiveness and WTP unaffected · D'Ambrogio et al. (2023), Psychology & Marketing — celebrity faces capture attention to the face regardless of gaze direction · Replication support for dissociation: Bayliss 'liking' effect (2006, N=24) FAILED preregistered replication (Cognition & Emotion 2019); Gregory et al. (2026) QJEP — another null on evaluation

### F6 — high · vote unanimous (two claims, each 3-0)

[STRONG] Task-relevance, not presence, drives image attention: in goal-directed browsing users fixate information-carrying images (e.g. product photos) and essentially ignore purely decorative 'feel-good' imagery and generic stock people. The 'authentic beats stock' effect is at least partly a stock PENALTY — generic-model photos draw less attention than normal people and function as 'pure filler.'

**Evidence.** Claims 15,16 merged, both from NN/g primary eyetracking. Scope to goal-directed browsing. IMPORTANT boundary the skill must carry: this is an ATTENTION channel — do NOT extend it to 'decorative images have no effect.' Decorative/aesthetic imagery still shapes trust and mood via a separate affective/aesthetic-usability channel (50ms first impressions). The refuted FreshBooks '10% more time on real photos' stat (1-2 vote) and agency conversion figures (2.4x, 4.5x) are folklore — the attention-neglect finding, not a measured conversion penalty, is what's supported.

**Sources:** Nielsen / NN/g (2010), 'Photos as Web Content' (eyetracking) — users attend to info-carrying images, disregard 'big feel-good images that are purely decorative'; 'ignore stock photos of generic people'; photos are 'pure filler' when not task-relevant; model-looking people draw LESS attention than normal people · NN/g banner-blindness work (later) reconfirms decorative-image neglect

### F7 — high · vote unanimous (two claims, each 3-0)

[STRONG] Image content reliably sets emotional register: affective response to photographs is systematic enough to have been formally normed. The IAPS is a standardized set of 1000+ color photographs across many semantic categories, each rated for valence and arousal — the named evidence base that photo choice measurably drives emotion.

**Evidence.** Claims 17,18 merged. IAPS is the canonical, thousands-of-citations instrument for emotion induction. CAVEAT the skill should carry: reliability holds in aggregate/direction, NOT identically per person or culture — documented cross-cultural variance (e.g. ~32% of pictures differ in valence Chinese vs American raters), age, and individual bias. The claim 'reliably sets emotional register' asserts the mechanism, not universal identical ratings, so this qualifies rather than refutes.

**Sources:** Lang, Bradley & Cuthbert, International Affective Picture System (IAPS), Univ. of Florida Center for the Study of Emotion and Attention — 'normative emotional stimuli for experimental investigations of emotion and attention'; 'standardized, emotionally-evocative... color photographs... across a wide range of semantic categories' · IAPS technical manual (Springer BF03193164, 1302 participants); 2023 PMC systematic review; SAM valence/arousal/dominance ratings

### F8 — high · vote 3-0

[STRONG, with a luxury boundary] A model's positive facial expression (smiling vs neutral) in a static ad raises product evaluation, product appeal, and purchase intent — a measured persuasion/conversion effect, not just a mood shift.

**Evidence.** Claim 19, verbatim-confirmed. DVs are persuasion measures, so 'not just mood' is accurate. Boundary condition: the effect is for general/mundane products; it reverses for luxury (where a neutral face reads as more premium) — a moderator, not a refutation. Caveats: student-only samples, single-paper for exact figures, gender-congruence moderation. Note: the proposed MECHANISM (emotional contagion via measured facial mimicry) was REFUTED here (1-2 vote) — cite the effect, not the mimicry explanation.

**Sources:** Isabella & Vieira (2020), RAUSP Management Journal 55(3):375-391 (Exp.1, N=154) — attitude M 3.25 neutral vs 3.77 smiling, F(1,152)=10.98, p<0.001; appeal 2.45 vs 3.24, F=15.29, p<0.001; purchase intent 2.23 vs 2.90, F=10.78, p<0.001 · Boundary: Essiz (2025), Psychology & Marketing — smiling REVERSES for luxury/premium products (neutral reads as more premium)

### F9 — high · vote unanimous (two claims, each 3-0)

[MYTH] The rule of thirds does not predict aesthetic quality. Across 200 photographs, aesthetic ratings correlated only weakly with subjective ROT (rho=0.17) and not at all with computed ROT; highly-aesthetic photos and museum paintings had ROT values about as low as photos that explicitly ignore the rule.

**Evidence.** Claims 20,21 merged. No credible peer-reviewed contradiction; the only counterpoint is photography-blog folklore, which is exactly the convention the study challenges. Scope qualification for the skill: the dataset was already high-quality, so this shows ROT fails to DIFFERENTIATE aesthetics within good work — label [MYTH] specifically for 'ROT-as-aesthetic-predictor,' while leaving room to teach it as a low-stakes framing heuristic (a [CONVENTION] starting point), not a quality guarantee.

**Sources:** Amirshahi, Hayn-Leichsenring, Denzler & Redies (2014), 'Evaluating the Rule of Thirds in Photographs and Paintings,' Art & Perception 2(1-2):163-182 (Brill, peer-reviewed) — 200 photos + 727 paintings + 30-participant experiment; ROT 'seems to play only a minor, if any, role in large sets of high-quality photographs and paintings'

## Refuted / corrected (3)

### R1 — 0-3

The effect is large, not marginal: learners given the base lesson WITHOUT seductive details were roughly three times more likely to recall the structurally important information and performed substantially better on problem-solving transfer. This gives the skill a defensible magnitude when arguing to cut a decorative-but-irrelevant image rather than treating relevance as a soft preference.

**Source.** https://www.researchgate.net/publication/232595492_How_Seductive_Details_Do_Their_Damage_A_Theory_of_Cognitive_Interest_in_Science_Learning

### R2 — 1-2

Authentic photos of real company employees outperform stock imagery: on FreshBooks.com users spent about 10% more time viewing the real-people portrait photos than reading the adjacent biographies, despite the bios occupying far more space.

**Source.** https://www.nngroup.com/articles/photos-as-web-content/

### R3 — 1-2

The mechanism is emotional contagion via facial mimicry: viewers unconsciously mimic a pictured model's smile even with no real interaction, and this mimicry was directly measured (FACS-coded via webcam), explaining HOW a face in an image sets the viewer's mood.

**Source.** https://www.emerald.com/insight/content/doi/10.1108/rausp-03-2019-0038/full/html

## Open questions (from the research — not decided)

- Illustration vs photography — is there MEASURED evidence for when each is more effective (trust, memorability, inclusivity, abstraction, flat-vector vs detailed)? No confirmed claim surfaced; this is the core of Section 4 and remains unresolved.
- Treatment/tonal adjustment — what are the perceptual and mood effects of duotone, grayscale, grain, scrims/overlays, and color grading, and precisely which are cheaply doable in Python/Pillow/CSS/SVG vs needing a real editor? No evidence surfaced.
- Authentic-vs-stock beyond attention neglect — is there a rigorously measured TRUST or CONVERSION penalty for generic stock, or only eyetracking neglect? The strongest supported result is attention filler-status; conversion figures were refuted or are folklore.
- Does gaze-cueing's robust attention effect convert to real-world conversion outside controlled mock ads, and does the celebrity-attenuation replicate beyond the single 2023 study?
- Accessibility (WCAG 1.1.1) — no research-backed claims on informative vs decorative vs functional alt-text, alt="" correctness, or long descriptions; the skill needs these sourced from standards, and it's worth confirming whether any empirical work quantifies their impact.

## Caveats

COVERAGE GAP (the biggest caveat): this fan-out produced ZERO surviving claims for three of the six requested sections. Section 3 (tonal treatment — duotone/grain/scrims/what is code-feasible), Section 4's core (illustration-vs-photography measured evidence, and light programmatic/SVG illustration), and Section 5 (accessibility — WCAG 1.1.1 alt-text, text-over-image contrast, honest imagery) are entirely unevidenced by this research. The skill must source those from authoritative standards (WCAG/W3C, the design-craft accessibility floor) and craft convention directly, and should not imply this research covered them. // MAGNITUDE vs DIRECTION: Mayer's within-lab effect sizes (coherence d=0.86-0.97, contiguity d=1.10) are systematically LARGER than independent meta-analyses (seductive details g approx -0.16 to -0.41; contiguity d approx 0.85). Cite the DIRECTION as [STRONG]; present magnitudes as lab-ceiling, strongest for low-prior-knowledge/low-working-memory audiences. // SINGLE-STUDY RELIANCE: the gaze work leans on Palcu 2017 (N=78) and D'Ambrogio 2023 (N=77). The purchase-intent lift is one small one-tailed effect; the liking-dissociation and celebrity-moderation each rest on a single study (both 2-1 votes). Label these [CONVENTION]/single-study, not [STRONG]. // DOMAIN EXTRAPOLATION: coherence/seductive-details and picture-superiority evidence come from instructional/learning tasks; applying them to marketing/brand imagery is reasonable but not directly tested. // DO NOT CITE (refuted here): the '3x recall' magnitude for seductive details (0-3), the FreshBooks '10% more time on authentic photos' stat and agency conversion multipliers (1-2), and the facial-mimicry/emotional-contagion MECHANISM behind the smiling-model effect (1-2). // TIME-SENSITIVITY: low for the memory/multimedia findings (stable since 1973/2001). The IAPS has dated image content (VHS-era) and public-domain successors exist (OASIS 2016, GAPED, NAPS) — worth noting but doesn't affect the mechanism claim.

## All sources (25)

- https://edtechuvic.ca/wp-content/uploads/sites/11/2022/09/principles-for-reducing-extraneous-processing-in-multimedia-learning-coherence-signaling-redundancy-spatial-contiguity-and-temporal-contiguity-principles.pdf — primary · Cognition of images — memory & comprehension
- https://en.wikipedia.org/wiki/Picture_superiority_effect — secondary · Cognition of images — memory & comprehension
- https://www.researchgate.net/publication/232595492_How_Seductive_Details_Do_Their_Damage_A_Theory_of_Cognitive_Interest_in_Science_Learning — primary · Cognition of images — memory & comprehension
- https://www.cmu.edu/dietrich/psychology/memorylab/publications/10.1.1.646.3474.pdf — primary · Cognition of images — memory & comprehension
- https://econtent.hogrefe.com/doi/10.1027/1618-3169/a000437 — primary · Cognition of images — memory & comprehension
- https://www.cambridge.org/core/books/abs/multimedia-learning/coherence-principle/4E80B70CB76E2166B76E5653EBDE7D3E — primary · Cognition of images — memory & comprehension
- https://onlinelibrary.wiley.com/doi/full/10.1002/mar.21772 — primary · Images of people — gaze, emotion, trust, authenticity
- https://www.ncbi.nlm.nih.gov/pmc/articles/PMC5454066/ — primary · Images of people — gaze, emotion, trust, authenticity
- https://pmc.ncbi.nlm.nih.gov/articles/PMC3260535/ — primary · Images of people — gaze, emotion, trust, authenticity
- https://www.nngroup.com/articles/photos-as-web-content/ — primary · Images of people — gaze, emotion, trust, authenticity
- https://www.semanticscholar.org/paper/International-Affective-Picture-System-(IAPS)-:-and-Lang/09bb229a610acdd3150b8e0176194e7b7cf471b7 — primary · Images of people — gaze, emotion, trust, authenticity
- https://www.emerald.com/insight/content/doi/10.1108/rausp-03-2019-0038/full/html — primary · Images of people — gaze, emotion, trust, authenticity
- https://brill.com/view/journals/artp/2/1-2/article-p163_11.xml?language=en — primary · Selecting & evaluating imagery — photo craft + photo-vs-illustration
- https://www.ncbi.nlm.nih.gov/pmc/articles/PMC11763225/ — primary · Selecting & evaluating imagery — photo craft + photo-vs-illustration
- https://www.tandfonline.com/doi/abs/10.2501/JAR-2023-029 — primary · Selecting & evaluating imagery — photo craft + photo-vs-illustration
- https://www.researchgate.net/publication/403730499_Why_a_human_image_is_better_than_a_human_illustration_in_social_media_advertising — primary · Selecting & evaluating imagery — photo craft + photo-vs-illustration
- https://tympanus.net/codrops/2019/02/05/svg-filter-effects-duotone-images-with-fecomponenttransfer/ — blog · Programmatic treatment & code illustration (feasibility)
- https://developer.mozilla.org/en-US/docs/Web/CSS/filter — primary · Programmatic treatment & code illustration (feasibility)
- https://pillow.readthedocs.io/en/stable/reference/ImageEnhance.html — primary · Programmatic treatment & code illustration (feasibility)
- https://css-tricks.com/grainy-gradients/ — blog · Programmatic treatment & code illustration (feasibility)
- https://github.com/jasonlong/geo_pattern — primary · Programmatic treatment & code illustration (feasibility)
- https://www.w3.org/WAI/tutorials/images/decision-tree/ — primary · Accessibility & imagery integrity (the floor)
- https://www.w3.org/WAI/tutorials/images/complex/ — primary · Accessibility & imagery integrity (the floor)
- https://www.nngroup.com/articles/text-over-images/ — secondary · Accessibility & imagery integrity (the floor)
- https://www.smashingmagazine.com/2023/08/designing-accessible-text-over-images-part1/ — secondary · Accessibility & imagery integrity (the floor)

