export const NULL = null;
export const UNDEFINED = void 0;

export const isNull = (value: unknown): value is null => value === null;
export const isUndefined = (value: unknown): value is undefined =>
  value === undefined;
export const isVoid = (value: unknown): value is null | undefined =>
  isNull(value) || isUndefined(value);

export interface ISiteSetting {
  document_file_size: number;
  image_file_size: number;
  video_file_size: number;
}

export const defaultSiteSetting = {
  document_file_size: 20,
  image_file_size: 5,
  video_file_size: 20,
};
