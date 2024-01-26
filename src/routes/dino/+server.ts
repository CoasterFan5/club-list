import defaultClubImage from './defaultClubImage.svg?raw'

const colors: Record<number, string> = {
  1: "#fff",
  2: "#e63947",
  3: "#b4b4b4",
  4: "#27aae1",
  5: "#8b5e3c",
  6: "#c59c6d",
  7: "#9e3947",
  8: "#d1d3d4",
  9: "#e6e7e8",
  10: "#1c75bc"
}

export const GET = ({ url }) => {
  let image = defaultClubImage;

  for (const key of url.searchParams.keys()) {
    if (colors[Number(key)]) {
      const color = url.searchParams.get(key);
      image = image.replace(`.cls-${key}{fill:}`, `.cls-${key}{fill:${color}}`);
    }
  }
  for (const key of Object.keys(colors)) {
    if (colors[Number(key)]) {
      const color = colors[Number(key)];
      image = image.replace(`.cls-${key}{fill:}`, `.cls-${key}{fill:${color}}`);
    }
  }
  return new Response(image, {
    headers: {
      'Content-Type': 'image/svg+xml'
    }
  });
}
