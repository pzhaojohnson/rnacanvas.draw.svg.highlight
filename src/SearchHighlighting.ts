import type { LiveCollection } from './LiveCollection';

import { LiveSVGElementHighlightings } from './LiveSVGElementHighlightings';

export class SearchHighlighting {
  /**
   * Wrapped live SVG element highlightings.
   */
  readonly #liveSVGElementHighlightings;

  constructor(targetSVGElements: LiveCollection<SVGGraphicsElement>, parentSVGDoc: SVGSVGElement) {
    this.#liveSVGElementHighlightings = new LiveSVGElementHighlightings(targetSVGElements, parentSVGDoc);

    this.#liveSVGElementHighlightings.setPrimaryColor('red');

    this.#liveSVGElementHighlightings.padding = 5;
  }

  get domNode() {
    return this.#liveSVGElementHighlightings.domNode;
  }

  /**
   * Removes the search highlighting from the document body.
   */
  remove(): void {
    this.domNode.remove();
  }
}
