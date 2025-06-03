export function cssValueToPx(value: string, parent = document.body): number {
    if (value.endsWith('px')) return parseFloat(value);
  
    const el = document.createElement('div');
    el.style.position = 'absolute';
    el.style.visibility = 'hidden';
    el.style.height = value;
    parent.appendChild(el);
    const pixels = el.offsetHeight;
    parent.removeChild(el);
    return pixels;
  }

  export function getCssVariableInPixels(variable: string, element = document.documentElement): number {
    const style = getComputedStyle(element);
    return cssValueToPx(style.getPropertyValue(variable), element);
  }