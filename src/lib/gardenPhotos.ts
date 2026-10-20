// Photos of the herbs we grow, licensed CC BY-SA from Wikimedia Commons. Wherever one is
// shown, the licence requires visible credit: author, licence (linked) and source (linked).

export interface GardenPhoto {
  name: string;
  src: string;
  alt: string;
  /** Grid placement in the home page collage. */
  span: string;
  /** object-position, so the crop keeps the flower in view. */
  focus: string;
  author: string;
  license: string;
  licenseUrl: string;
  source: string;
}

export const GARDEN_PHOTOS: GardenPhoto[] = [
  {
    name: 'Lavender',
    src: '/images/garden/lavender.webp',
    alt: 'A bumblebee feeding on purple lavender blossoms',
    span: 'row-span-2',
    focus: '40% center',
    author: 'Martin Falbisoner',
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0',
    source: 'https://commons.wikimedia.org/wiki/File:Bumblebee_on_Lavender_Blossom.JPG',
  },
  {
    name: 'Echinacea',
    src: '/images/garden/echinacea.webp',
    alt: 'A pink echinacea coneflower in bloom',
    span: '',
    focus: 'center 30%',
    author: 'Gzen92',
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0',
    source: 'https://commons.wikimedia.org/wiki/File:%C3%89chinac%C3%A9e_pourpre_(Echinacea_purpurea)_(2).jpg',
  },
  {
    name: 'Chamomile',
    src: '/images/garden/chamomile.webp',
    alt: 'White chamomile flowers with yellow centres',
    span: '',
    focus: 'center',
    author: 'kallerna',
    license: 'CC BY-SA 3.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/3.0',
    source: 'https://commons.wikimedia.org/wiki/File:Kamomillasaunio_(Matricaria_recutita).JPG',
  },
  {
    name: 'Hibiscus (roselle)',
    src: '/images/garden/hibiscus.webp',
    alt: 'A cream roselle hibiscus flower with a deep red centre',
    span: 'col-span-2',
    focus: 'center 40%',
    author: 'Horacio Cambeiro',
    license: 'CC BY-SA 3.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/3.0',
    source: 'https://commons.wikimedia.org/wiki/File:Roselle_flower_(Hibiscus_Sabdariffa)_in_Capiov%C3%AD.jpg',
  },
  {
    name: 'Moringa',
    src: '/images/garden/moringa.webp',
    alt: 'Clusters of small white moringa blossoms',
    span: 'col-span-2',
    focus: 'center 35%',
    author: 'Ramesh Kunnappully',
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0',
    source: 'https://commons.wikimedia.org/wiki/File:Moringa_oleifera_flowers_20231217_095210_01.jpg',
  },
  {
    name: 'Turmeric',
    src: '/images/garden/turmeric.webp',
    alt: 'A pale green turmeric flower among its leaves',
    span: '',
    focus: 'center',
    author: 'Manojk',
    license: 'CC BY-SA 3.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/3.0',
    source: 'https://commons.wikimedia.org/wiki/File:Curcuma_longa_flower.jpg',
  },
];

/** The garden photo of a herb, matched on its first word ("Lavender Flower" -> Lavender). */
export function gardenPhotoFor(herbName: string) {
  const key = herbName.toLowerCase().split(/[\s(]/)[0];
  return GARDEN_PHOTOS.find((photo) => photo.name.toLowerCase().startsWith(key));
}
