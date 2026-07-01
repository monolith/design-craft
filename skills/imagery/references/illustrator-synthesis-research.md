# Illustration direction — synthesis from four illustrators (deep-research)

> **Deep-research record** (102 agents, 446 tool calls). Claims adversarially verified (3-vote). **De-noised** — logs stripped. Studies **Coen Pohl · Malika Favre · Victo Ngai · Giorgia Lupi** to extract transferable technique/principle and a **synthesised, ownable** illustration direction — imitate-then-deviate, NOT a copy. Augments [imagery-research.md](imagery-research.md).

## Summary

All four illustrators share one transferable structure: a systematic, constructed scaffold that code CAN build, wrapped in an authored hand that mostly resists generation — and they span the spare-geometric pole (Pohl's Illustrator-3D isometric cities; Favre's few-separation flat-colour negative space) to the ornate/data-dense pole (Ngai's nib-and-Photoshop layered scenes; Lupi's hand-sketched bespoke data encodings). The reproducible core is real and specific: parametric isometric projection (Pohl), limited flat-colour separations built on a rigid grid with negative space doing double duty (Favre), planned/tested palettes plus digital layer-compositing (Ngai's designerly stage), and data→polygon encoding inside an organizing matrix with a bespoke legend, following an explicit 8-step build order (Lupi). The irreducible "select-or-commission, don't-generate" pole is equally clear: Ngai's pressure-modulated nib linework and hand-made paper textures, her deliberately anti-geometric fluid curves, and — more as taste than tool — Favre's judgement of WHERE to cut and Lupi's hand-drawn legend character. The ownable, non-pastiche direction that falls out of imitate-then-DEVIATE: an assistant genuinely constructs the scaffold (parametric isometric SVG + subtractive flat-colour figure-ground on a grid + data-encoded marks and custom legends), reserves the hand for commissioned/selected ornament and linework, and DEVIATES by combining moves no single artist uses together (e.g. isometric geometry carrying data-encoded ornament, unified by one restrained palette and one authored mark treatment) rather than adopting any one signature whole. Note the sharpest correction from verification: Lupi is NOT anti-code — she removes technology only to sketch first, then finalizes digitally — so she anchors the "reproducible-encoding" pole more than the "irreducible-hand" pole.

## Findings (10)

### F1 — high · vote 3-0 (claims 0,1)

Coen Pohl builds his isometric editorial cityscapes by CONSTRUCTING objects with Adobe Illustrator's 3D Extrude/Revolve rather than freehand drawing, and publishes the vector construction outlines alongside finished pieces — confirming a systematic vector-construction method that a parametric/SVG isometric pipeline can genuinely reproduce.

**Evidence / technique.** Pohl (own Behance): 'Rather than drawing in the traditional sense, I mostly use the 3D functions (Extrude and Revolve) in Adobe Illustrator to "build" the objects in each scene,' and 'I've also added the illustrator outlines for each one, to give a bit more insight in the "construction" of the illustrations.' Corroborated by design press (weandthecolor.com). The construction is exactly the code-doable pole: axonometric/isometric projection, extruded prisms, revolved solids — buildable parametrically in SVG/Python. Transferable principle: TREAT ILLUSTRATION AS CONSTRUCTION — build objects from a projection system, and expose the scaffold, so density is systematic rather than hand-composed.

**Sources:** https://www.behance.net/gallery/81749759/A-selection-of-isometric-editorial-illustrations

### F2 — high · vote 3-0 (claims 2,3)

Malika Favre's core method is subtractive/reductive: simplify a subject to its minimum and SUGGEST rather than show, letting the viewer's imagination complete the image — which is the conceptual engine of her extreme negative-space figure-ground and few-colour-separation flat vector work.

**Evidence / technique.** Favre: 'how I can make it as simple as I can and suggest things rather than show them so that I let the imagination of the viewer do the trick'; 'If you can live without it, then you don't need it; get rid of it'; 'If you can remove that line and it still works, then remove that line... Less is more.' The output — bold flat minimalism, reduced palette, one shape doing figure-ground double duty — is what removing/suggesting produces. Reproducible core: flat-vector, 2–4 colour separations, negative space as an active shape. Transferable principle: DESIGN BY SUBTRACTION AND SUGGESTION — remove anything the piece survives without; let ground carry as much meaning as figure.

**Sources:** https://thegreatdiscontent.com/interview/malika-favre/

### F3 — high · vote 3-0 (claim 23)

For Favre, rigid structure and self-imposed rules are the PRECONDITION for creative freedom, not a constraint — a grid/frame first, then free drawing within it.

**Evidence / technique.** Favre: 'I believe that out of structure comes freedom. Setting rules makes it more interesting'; on the Kama Sutra Alphabet, 'the only way to do it was to have a rigid typeface behind it, a frame and a structure that allowed me to draw freely within that.' Corroborated across other interviews (Sense of Creativity: 'using grids and structures allows me to start being free... whatever I do is going to work because of that backbone'). Lead source is secondary (It's Nice That) but corroborated by primary interviews; unanimous. Reproducible core: an explicit grid/module system is code-buildable; the free move within it is taste. Transferable principle: FIX A RIGID SCAFFOLD, IMPROVISE INSIDE IT.

**Sources:** https://www.itsnicethat.com/features/malika-favre-interview

### F4 — high · vote 3-0 across (claim 11 was 2-1) (claims 4,6,11,12)

Victo Ngai works in a traditional-to-digital HYBRID: hand-drawn nib linework and hand-made paper textures (made on separate sheets on a light box) are scanned, then all compositing and colouring happen in Photoshop with planned/tested palettes — so the marks are irreducibly hand-made but the composite/colour stage is a systematic, digitally-reproducible step.

**Evidence / technique.** Ngai: 'I draw the lines with nib pens... then I create layers of texture on paper with various media (paint, crayon, charcoal)... I then scan them in and do the composition and coloring in Photoshop'; 'I create layers of textures on separated pieces of paper... on a light box. Afterwards, I have everything scanned, digitally colored and composed together in Photoshop'; 'The way I work with colors is more like a designer than a painter. I like to plan and test out a few color palette before deciding.' The clean split isolates the code-doable part (layer-stacking, palette planning/testing, compositing) from the irreducible part (the physical marks). Transferable principle: SEPARATE HAND-MADE MARKS FROM DIGITAL ASSEMBLY — plan palettes like a designer, composite like code, but source the marks by hand/commission. Note: some recent linework is freehand-digital (Procreate), so 'analog' is not strictly exclusive — but it remains hand-drawn, not vector-generatable.

**Sources:** https://victo-ngai.com/of-qa · https://wedesignstudios.com/artist-interview-victo-ngai/

### F5 — high · vote 3-0 (claims 5,8,9)

Ngai's linework is the irreducible 'commission/select, don't-generate' pole: she prizes the nib pen for its wide range of line quality, deliberately avoids straight lines and right angles for fluid organic curves, and works softer edges / reduced figure-ground contrast than traditional Chinese ink — traits that procedural SVG/geometry cannot convincingly fake.

**Evidence / technique.** Ngai: 'My favorite traditional medium is nib pen because of the wide range of line quality it gives'; 'I really enjoy the fluidity and curves. I don't really have anything that's straight, right angle, or very vectorized'; she aligns with Gaudí ('the straight line belongs to men, the curved one to God') and prizes 'tactility and warmth of the organic feeling'; 'Chinese paintings tend to have starker contrast between figure-ground because of... ink... I don't work in traditional Chinese media, so that allow me to explore softer edge qualities.' Honest assessment: pressure-modulated line-width variation and hand textures are the maximal irreducible-hand element in the set. For a toolkit: SELECT OR COMMISSION this layer; do not attempt to generate it parametrically.

**Sources:** https://victo-ngai.com/of-qa · https://clarkesworldmagazine.com/ngai_interview/

### F6 — high · vote 3-0 (claims 7,10,13)

Ngai's signature 'East-meets-West' character is a CONSCIOUS synthesis method — she deliberately mixes-and-matches specifically named traditions (Nianhua, Gong Bi Hua, Lianhuanhua, Chinese ink scrolls, Ukiyo-e) with named Western masters (Klimt, Schiele, Gaudí, Turner, Rockwell, N.C. Wyeth, Al Hirschfeld) rather than following either lineage — this is the transferable authored-hand principle.

**Evidence / technique.** Ngai: exposure to 'Nian Hua, Gong Bi Hua, and Lian Hua Hua... I have developed a keen taste for intricate lines and vibrant flat colors'; 'I'm kind of in between two worlds... I kind of mix and match whatever I feel like will work for what I'm trying to convey.' The named, enumerated influences (not a generic 'Asian influence') are what make the synthesis authored and ownable. Transferable principle: BUILD A DISTINCTIVE HAND BY DELIBERATELY FUSING NAMED, SPECIFIC TRADITIONS — the mix, not any single source, is the signature. This is the mechanism behind imitate-then-DEVIATE.

**Sources:** https://victo-ngai.com/of-qa · https://clarkesworldmagazine.com/ngai_interview/ · https://wedesignstudios.com/artist-interview-victo-ngai/

### F7 — high · vote 3-0 (claims 14,18,20)

Giorgia Lupi's core method is 'sketching with data' BY HAND and off-screen to discover a bespoke encoding fitted to the specific dataset, deliberately removing technology at the start and rejecting templated chart types as an ENDPOINT (not as unusable) before finalizing digitally.

**Evidence / technique.** Lupi: 'What I always do when I start a new data project is to move away from the screen and start drawing'; 'I draw with data in my mind, but with no data in my pen: I sketch with data to understand what is contained in the numbers'; 'Sketching with data... leads to designs that are uniquely customized for the specific type of data problems.' Accurat essay: 'intentionally avoiding typical and already tested styles of representation' — but standard charts 'doesn't mean they are an end.' Transferable principle: DERIVE THE ENCODING FROM THE DATA, not from a chart menu — sketch the mapping first, reach for tools second. Reproducible: the resulting bespoke encoding is code-buildable even though the discovery step is hand-sketched.

**Sources:** http://giorgialupi.com/data-humanism-my-manifesto-for-a-new-data-wold · https://www.printmag.com/article/data-humanism-future-of-data-visualization/ · https://medium.com/accurat-in-sight/the-architecture-of-a-data-visualization-470b807799b4

### F8 — high · vote 3-0 (claims 16,17)

Lupi/Accurat construct visualizations via an explicit, reproducible build ORDER: (1) main architecture/organizing matrix, (2) position elements within it, (3) shaped polygonal elements carrying quantitative AND qualitative parameters, colour-categorized, (4) internal relationship links, (5) labels, (6) supplementary context, (7) visual legends, (8) fine-tune shapes/colours/weights for hierarchy — a parametric data→polygon→colour-in-a-grid scheme that is genuinely code-reproducible.

**Evidence / technique.** Lupi (Accurat, own essay) sequences the eight steps nearly verbatim, including 'Constructing shaped elements of dimensionality and form (essentially polygons) with quantitative and qualitative parameters' positioned inside 'a matrix or pattern that will serve as our organizer,' identified 'through colors according to... categorizations,' with a closing 'fine-tuning... shapes, colors, and weights' for hierarchy. She notes the order iterates rather than being strictly linear. This is the strongest code-doable core in the set: data dimensions → polygon geometry + colour category → placed in a grid → layered legend. Transferable principle: A REPRODUCIBLE BUILD ORDER FOR DATA-DRIVEN MARKS that any SVG/Python pipeline can follow.

**Sources:** https://medium.com/accurat-in-sight/the-architecture-of-a-data-visualization-470b807799b4

### F9 — high · vote 3-0 (claims 15,19,21,22)

Lupi's signature legibility comes from CUSTOM legends that carry the data grammar (encoding anecdotal/qualitative meaning — the WHY, e.g. bored/hungry/late — not just categorical keys) plus non-linear, layered storytelling that lets a reader move from macro overview to micro textual detail and 'get happily lost' rather than be handed one conclusion.

**Evidence / technique.** Lupi: 'the different variations of my symbols on the legend indicate anecdotal details that describe these moments: Why was I checking the time? What was I doing? Was I bored, hungry or late?'; Dear Data recorded count AND reason via a personalized symbol system and hand-drawn legend. Accurat: 'providing several and consequent layers of exploration... We call it non-linear storytelling'; 'people can get happily lost exploring individual elements, minor tales and larger trends.' Reproducible: the bespoke legend and layered structure are code-buildable; the hand-drawn legend CHARACTER is the (modest) irreducible-hand touch. Transferable principle: THE LEGEND IS PART OF THE ARTWORK AND CARRIES QUALITATIVE MEANING — encode context, not just categories; reward exploration over a single takeaway.

**Sources:** http://giorgialupi.com/data-humanism-my-manifesto-for-a-new-data-wold · https://www.printmag.com/article/data-humanism-future-of-data-visualization/ · https://medium.com/accurat-in-sight/the-architecture-of-a-data-visualization-470b807799b4

### F10 — medium · vote synthesis over 3-0 claims

SYNTHESIS — the shared transferable DNA across all four is: a SYSTEMATIC CONSTRUCTED SCAFFOLD (that code can build) + CRAFT DENSITY + a DISTINCTIVE AUTHORED HAND, spanning spare-geometric (Favre/Pohl) to ornate/data-dense (Ngai/Lupi); the ownable, non-pastiche direction is to imitate this structure and DEVIATE by combining scaffold-moves no single artist uses together, while cleanly separating a reproducible [technique] layer from a select/commission [taste] layer.

**Evidence / technique.** Each artist pairs a constructable scaffold with an authored hand: Pohl = isometric projection geometry (fully code-doable) + editorial subject taste; Favre = grid + few flat-colour separations + negative space (code-doable) / WHERE to cut (taste); Ngai = layer-compositing + planned palettes (code-doable) / nib linework + hand textures (irreducible); Lupi = data→polygon encoding + 8-step build (code-doable) / hand-sketched discovery + legend character (hand). REPRODUCIBLE layer a code-capable assistant can genuinely BUILD: parametric isometric SVG; subtractive flat-colour figure-ground on a rigid grid; data-encoded polygonal marks with colour categories; bespoke layered legends. TASTE/COMMISSION layer to source, not generate: expressive linework, hand textures, negative-space judgement, the sketch-discovery step. AVOID PASTICHE by never adopting one signature whole; DEVIATE by cross-combining (e.g. isometric geometry that carries data-encoded ornament and a Lupi-style legend, reduced to a Favre-few palette and one authored mark treatment) and by fixing a small distinctive constant set (one projection, one palette logic, one mark). This is interpretive synthesis over the ten high-confidence per-artist findings, so confidence is medium, not high.

**Sources:** https://www.behance.net/gallery/81749759/A-selection-of-isometric-editorial-illustrations · https://thegreatdiscontent.com/interview/malika-favre/ · https://victo-ngai.com/of-qa · https://medium.com/accurat-in-sight/the-architecture-of-a-data-visualization-470b807799b4

## Refuted / corrected (1)

### R1 — 0-3

Data Humanism deliberately substitutes drawing/handcraft for coding as the mode of expression — the 'human touch' is the irreducible-hand pole, marking where her aesthetic resists pure automated/code generation.

**Source.** http://giorgialupi.com/data-humanism-my-manifesto-for-a-new-data-wold

## Caveats

Source strength: every per-artist finding rests on STATED PROCESS (artists' own interviews/manifestos/portfolio notes) — ideal for intent, but self-reports can idealize or omit real workflow steps. Pohl is the thinnest: essentially ONE primary source (his own Behance description), corroborated by design press but with NO surviving evidence on his palette or his specific techniques for keeping dense architecture legible. Favre's structure-yields-freedom finding leads on a SECONDARY source (It's Nice That), though corroborated by primary interviews and unanimous. Ngai claim 11 was 2-1: 'analog/traditional' is slightly imprecise because she has done some recent freehand-DIGITAL (Procreate) linework — still hand-drawn, not vector-generatable, but her tooling is evolving (~2021–22 onward), so this is the one mildly time-sensitive item. The 'code-reproducible vs irreducible-hand' labels attached to several claims are the RESEARCHERS' synthesis layer, not the artists' words — defensible and consistently applied, but interpretive. IMPORTANT CORRECTION: one candidate claim was REFUTED 0-3 — that Data Humanism 'substitutes drawing for coding' as an anti-code stance. It does not: Lupi removes technology only to sketch first, then finalizes with digital tools. Do NOT frame Lupi as the irreducible-hand/anti-code pole; she anchors the reproducible-encoding pole. The final synthesis finding is inference over the verified per-artist findings, hence medium (not high) confidence.

## All sources (20)

- https://www.behance.net/gallery/81749759/A-selection-of-isometric-editorial-illustrations — primary · Coen Pohl — isometric construction & 3D-extrude process
- https://www.itsnicethat.com/features/malika-favre-interview — secondary · Malika Favre — negative-space figure-ground & flat-colour logic
- https://thegreatdiscontent.com/interview/malika-favre/ — primary · Malika Favre — negative-space figure-ground & flat-colour logic
- https://www.domestika.org/en/blog/3017-malika-favre-feminine-vector-illustration — secondary · Malika Favre — negative-space figure-ground & flat-colour logic
- https://visualatelier8.com/positive-and-negative-spaces-by-malika-favre/ — blog · Malika Favre — negative-space figure-ground & flat-colour logic
- https://ccmagazine.es/en/interview-with-the-illustrator-malika-favre/ — secondary · Malika Favre — negative-space figure-ground & flat-colour logic
- https://en.wikipedia.org/wiki/Malika_Favre — secondary · Malika Favre — negative-space figure-ground & flat-colour logic
- http://linesandcolors.com/2013/09/29/victo-ngai/ — blog · Victo Ngai — density, colour-layering & the irreducible hand
- https://victo-ngai.com/of-qa — primary · Victo Ngai — density, colour-layering & the irreducible hand
- https://www.commarts.com/features/victo-ngai — secondary · Victo Ngai — density, colour-layering & the irreducible hand
- https://www.youtube.com/watch?v=XyRMzZ2ROHw — unreliable · Victo Ngai — density, colour-layering & the irreducible hand
- https://clarkesworldmagazine.com/ngai_interview/ — primary · Victo Ngai — density, colour-layering & the irreducible hand
- https://wedesignstudios.com/artist-interview-victo-ngai/ — primary · Victo Ngai — density, colour-layering & the irreducible hand
- http://giorgialupi.com/data-humanism-my-manifesto-for-a-new-data-wold — primary · Giorgia Lupi — data humanism & bespoke visual encoding
- https://medium.com/accurat-in-sight/the-architecture-of-a-data-visualization-470b807799b4 — primary · Giorgia Lupi — data humanism & bespoke visual encoding
- https://eyeondesign.aiga.org/accurats-perfectly-imperfect-approach-to-data-visualization/ — secondary · Giorgia Lupi — data humanism & bespoke visual encoding
- https://www.printmag.com/article/data-humanism-future-of-data-visualization/ — primary · Giorgia Lupi — data humanism & bespoke visual encoding
- https://jeroenhoek.nl/articles/svg-and-isometric-projection.html — blog · Synthesis — reproducible vector/parametric illustration technique
- https://medium.com/@Elijah_Meeks/sketchy-data-visualization-in-semiotic-5811a52f59bc — blog · Synthesis — reproducible vector/parametric illustration technique
- https://weandthecolor.com/isometric-editorial-illustrations-coen-pohl/104035 — secondary · Synthesis — reproducible vector/parametric illustration technique

