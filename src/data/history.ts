import type {ThumbSpec} from '../components/WeldThumb';
import type {View} from '../components/Photo';
import {PHOTO_FRONT, PHOTO_FRONT_SIZE} from './hero';
import {VIEW_THUMB} from '../story/layout';

const NAT = PHOTO_FRONT_SIZE; // every dataset photo is 2000×900

/** Thumbnail framing (2.22:1) centred on a bead box with 30 % horizontal padding. */
const viewFromBox = (b: [number, number, number, number]): View => {
  const cx = (b[0] + b[2]) / 2;
  const cy = (b[1] + b[3]) / 2;
  const w = Math.min(NAT.w, (b[2] - b[0]) * 1.3);
  const h = w / 2.22;
  return {x: cx - w / 2, y: Math.max(0, Math.min(NAT.h - h, cy - h / 2)), w, h};
};

/**
 * The operator's earlier welds (chapter 7). Photos are REAL label-removed dataset photos of
 * other welds from the same two sessions (good_weld_6_02-17-23_Fe410, undercut_4_03-15-23_Fe410);
 * bead boxes are SAM 3.1 top candidates for those views. The operator assignment and the
 * weld numbers are ILLUSTRATIVE (the dataset has no operator field); the stored mechanism
 * marks on the earlier undercut welds are intended system behaviour, not recorded diagnoses.
 */
export const HISTORY: ThumbSpec[] = [
  {id: '043', label: 'Weld 043', status: 'good', src: 'hero/history/good_02-17-23-0104-00.jpg', natural: NAT, view: viewFromBox([715.2, 260.0, 1255.4, 299.8])},
  {id: '051', label: 'Weld 051', status: 'undercut', src: 'hero/history/undercut_03-15-23-0062-05.jpg', natural: NAT, view: viewFromBox([736.0, 296.2, 1259.3, 341.7])},
  {id: '062', label: 'Weld 062', status: 'undercut', src: 'hero/history/undercut_03-15-23-0070-05.jpg', natural: NAT, view: viewFromBox([752.9, 294.2, 1304.4, 342.5])},
  {id: '071', label: 'Weld 071', status: 'good', src: 'hero/history/good_02-17-23-0105-00.jpg', natural: NAT, view: viewFromBox([824.4, 281.5, 1320.6, 418.7])},
  {id: '087', label: 'Weld 087', status: 'undercut', src: PHOTO_FRONT, natural: NAT, view: VIEW_THUMB},
];
export const HERO_INDEX = 4;
