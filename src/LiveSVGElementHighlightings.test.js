/**
 * @jest-environment jsdom
 */

import { LiveSVGElementHighlightings } from './LiveSVGElementHighlightings';

class LiveSetMock {
  [Symbol.iterator]() {
    return [].values();
  }

  addEventListener() {}
}

function createSVGSVGElement() {
  return document.createElementNS('http://www.w3.org/2000/svg', 'svg');
}

describe('LiveSVGElementHighlightings class', () => {
  it('can be appended to and removed from container SVG elements', () => {
    let highlightings = new LiveSVGElementHighlightings(new LiveSetMock(), createSVGSVGElement());

    let container = createSVGSVGElement();
    expect(container.childNodes.length).toBe(0);

    highlightings.appendTo(container);
    expect(container.childNodes.length).toBe(1);

    highlightings.remove();
    expect(container.childNodes.length).toBe(0);
  });
});
