import { useStore } from "@nanostores/react";
import { leftImgPreview, rightImgPreview } from "../shared/imagesStore";
import { showVisualStore } from "../shared/apiService";
import { useEffect } from "react";
import { activeTabStore } from "../shared/tabStore";
import Button from "./utils/Button";
import { responseStore } from "../shared/response";


const ImageVisualization = () =>{
    const leftImage = useStore(leftImgPreview)
    const rightImage = useStore(rightImgPreview)
    const showVisualization =useStore(showVisualStore)
    const tab = useStore(activeTabStore)

    return(
        <div className={`px-8 pt-8 ${ showVisualization ? 'visible': 'hidden' }`}>
            <div className="flex justify-center mb-6">
                <div className="w-1/2 text-center">
                    <p className="mb-2 font-bold">LEFT</p>
                    {leftImage ? (
                        <img src={leftImage} alt="Left" className="w-full h-full object-cover" />
                        ) : (
                        <div className="bg-gray-100 border-dashed border-2 border-gray-400 p-8 rounded-md">
                            <p>No image uploaded</p>
                        </div>
                    )}
                </div>
                <div className="w-1/2 text-center ml-4">
                    <p className="mb-2 font-bold">RIGHT</p>
                    {rightImage ? (
                        <img src={rightImage} alt="Right" className="w-full h-full object-cover" />
                        ) : (
                        <div className="bg-gray-100 border-dashed border-2 border-gray-400 p-8 rounded-md">
                            <p>No image uploaded</p>
                        </div>
                    )}
                </div>
            </div>

            <div className={`flex justify-center my-4 ${tab === 'LIVE' ? 'hidden' : 'visible'}`}>
                <Button label={'Restart'} onClick={()=> {
                    showVisualStore.set(false)
                    responseStore.set(null)
                }} />
            </div>
        </div>
    )
};

export default ImageVisualization;