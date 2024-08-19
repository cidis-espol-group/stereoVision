import { responseStore } from "../shared/response";
import { useStore } from "@nanostores/react";
import  Button  from "../components/utils/Button";
import { showVisualStore } from "../shared/apiService";
import LoadingSpinner from "../components/utils/Loading";
import PointCloudViewer from "../components/PointCloudViewer";
import { activeTabStore } from "../shared/tabStore";
import { useEffect, useState } from "react";
import { leftImgPreview, rightImgPreview } from "../shared/imagesStore";

const CloudVisualization = ({ title }) => {
    const response = useStore(responseStore)
    const showVisualization =useStore(showVisualStore)
    const tab = useStore(activeTabStore)
    // const [leftImage, setLeftImage] = useState('');
    // const [rightImage, setRightImage] = useState('');
    const leftImage = useStore(leftImgPreview)
    const rightImage = useStore(rightImgPreview)
    
    // useEffect(() => {
    //     // if (typeof window !== 'undefined') {
    //     //     setLeftImage(localStorage.getItem('leftImage'));
    //     //     setRightImage(localStorage.getItem('rightImage'));
    //     // }
        
    // }, []);

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
            <div className="text-center mb-6">
                <h2 className="text-2xl font-bold my-10">{title}</h2>
                <div className="bg-gray-100 border border-gray-400 rounded-md mx-52">
                    {response ? (
                        //TODO: Manejo de arrays vacios en el response
                        //TODO: Manejo de envio de varias nubes de punto y cambio de tamaño entre densa y no densa
                        <PointCloudViewer pointCloud={response.point_cloud} colors={response.colors}/>
                    ) : (
                        <LoadingSpinner/>
                    )}  
                </div>
            </div>
        </div>
    );
};

export default CloudVisualization;