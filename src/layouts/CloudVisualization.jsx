import { useEffect, useRef } from "react";

import { useStore } from "@nanostores/react";
import { responseStore } from "../shared/response";
import { activeTabStore, scrollToSection } from "../shared/tabStore";
import { leftImgPreview, rightImgPreview } from "../shared/imagesStore";
import { loadingStore, showVisualStore, isRoiStore } from "../shared/apiService";

import  Button  from "../components/utils/Button";
import LoadingSpinner from "../components/utils/Loading";
import PointCloudViewer from "../components/PointCloudViewer";
import Download from "../components/utils/Download";

const CloudVisualization = ({ title, module }) => {
    const response = useStore(responseStore)
    const showVisualization =useStore(showVisualStore)
    const tab = useStore(activeTabStore)
    const loading = useStore(loadingStore)
    const leftImage = useStore(leftImgPreview)
    const rightImage = useStore(rightImgPreview)
    const sectionRef = useRef(null);
    const target = useStore(scrollToSection);
    const isRoi = useStore(isRoiStore)

    const pcColors = ['blue', 'red', 'green']

    
    useEffect(() => {
        if (target === 'visualization' && sectionRef.current) {
          sectionRef.current.scrollIntoView({ behavior: 'smooth' });
          scrollToSection.set(null); // Resetea el store después de hacer el scroll
        }
      }, [target]);


    const handleRestart = () => {
        localStorage.removeItem('leftImage');
        localStorage.removeItem('rightImage');
        window.location.reload();
    };
    
    return(
        <div className={`p-8 ${ showVisualization ? 'visible': 'hidden' }`}>
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
            <div className={`flex justify-center mb-6 ${tab === 'LIVE' ? 'hidden' : 'visible'}`}>
                <Button label={'Restart'} onClick={handleRestart} />
            </div>
            <div className="mx-24">
                <div className="flex justify-between mb-6">
                    <h2 className="text-2xl font-bold my-10">{title}</h2>
                    <Download module={module} className={loading ? 'hidden': 'visible'}/>
                </div>
                <div className="text-center">
                    <div ref={sectionRef} id="visualization" className="bg-gray-100 border border-gray-400 rounded-md ">
                        {!response || loading ? (
                            <LoadingSpinner/>
                        ) : (
                            <PointCloudViewer pointCloud={response.point_cloud} colors={response.colors} {...(!isRoi && { size: '4' })} {...(!isRoi && { shape: 'circle' })} {...(!isRoi && { color: 'blue' })}/>
                            // <div>
                            //     {response.point_clouds.map((index, point_cloud) => (
                            //         <PointCloudViewer key={index} pointCloud={point_cloud} colors={response.colors[index]} {...(!isRoi && { size: '4' })} {...(!isRoi && { shape: 'circle' })} {...(!isRoi && { color: pcColors[index] })}/>
                            //     ))}
                            // </div>
                        )}  
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CloudVisualization;