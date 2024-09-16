import { atom } from 'nanostores';

export const leftImgPreview = atom(null); 
export const rightImgPreview = atom(null);

export const visualizationConfigStore = atom({
    showKeypoints: true,
    showPersonCentroid: true,
    showChestPlane: true,
    ShowHeadPlane: true,
    showNormalVector: true,
    ShowHeadCentroid: true,
    ShowHeadNormalVector: true,
    ShowGroupCentroid: true,
    ShowGroupNormalVector: true,
    ShowGroupLine: true,
    ShowGroupHeadCentroid: true,
    ShowGroupHeadNormalVector: true
});