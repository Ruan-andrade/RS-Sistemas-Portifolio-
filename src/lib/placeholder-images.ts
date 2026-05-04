import data from './placeholder-images.json';

export type ImagePlaceholder = {
  id: string;
  description: string;
  imageUrl: string;
  imageHint: string;
};

// This data is now unused, but kept for reference if needed later.
export const PlaceHolderImages: ImagePlaceholder[] = data.placeholderImages;
