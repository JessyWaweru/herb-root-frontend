import clsx from 'clsx';
import type { GardenPhoto } from '../../lib/gardenPhotos';

/** The credit line the garden photos' CC BY-SA licences require wherever they are shown. */
export function PhotoCredits({ photos, className, linkClassName = 'hover:text-sage-800' }: { photos: GardenPhoto[]; className?: string; linkClassName?: string }) {
  return (
    <p className={clsx('text-[11px] leading-relaxed', className)}>
      Photos (cropped):{' '}
      {photos.map((photo, i) => (
        <span key={photo.name}>
          <a href={photo.source} target="_blank" rel="noopener noreferrer" className={clsx('underline underline-offset-2', linkClassName)}>
            {photo.name}
          </a>{' '}
          by {photo.author},{' '}
          <a href={photo.licenseUrl} target="_blank" rel="noopener noreferrer license" className={clsx('underline underline-offset-2', linkClassName)}>
            {photo.license}
          </a>
          {i < photos.length - 1 ? '; ' : '. '}
        </span>
      ))}
      Via Wikimedia Commons.
    </p>
  );
}
