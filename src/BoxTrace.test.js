/**
 * @jest-environment jsdom
 */

import { BoxTrace } from './BoxTrace';

describe('BoxTrace class', () => {
  it('can be appended to and removed from container SVG elements', () => {
    let boxTrace = new BoxTrace();

    let container = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    expect(container.childNodes.length).toBe(0);

    boxTrace.appendTo(container);
    expect(container.childNodes.length).toBe(1);

    boxTrace.remove();
    expect(container.childNodes.length).toBe(0);
  });

  test('trace method', () => {
    let boxTrace = new BoxTrace();

    let container = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    boxTrace.appendTo(container);

    boxTrace.trace({ x: -22, y: 84, width: 501, height: 221 });

    expect(container.childNodes[0].childNodes[0].getAttribute('d')).toBe('M -22 84 h 501 v 221 h -501 z');
    expect(container.childNodes[0].childNodes[1].getAttribute('d')).toBe('M -22 84 h 501 v 221 h -501 z');
  });

  test('setThickness method', () => {
    let boxTrace = new BoxTrace();

    let container = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    boxTrace.appendTo(container);

    boxTrace.setThickness(8.19772);

    expect(container.childNodes[0].childNodes[0].getAttribute('stroke-width')).toBe('8.19772');
    expect(container.childNodes[0].childNodes[1].getAttribute('stroke-width')).toBe('8.19772');
  });

  test('setOpacity method', () => {
    let boxTrace = new BoxTrace();

    let container = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    boxTrace.appendTo(container);

    boxTrace.setOpacity(0.56072);
    expect(container.childNodes[0].getAttribute('opacity')).toBe('0.56072');
  });
});
