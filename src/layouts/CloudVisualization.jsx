import { useEffect, useRef, useState } from "react";

import { useStore } from "@nanostores/react";
import { responseStore } from "../shared/response";
import { scrollToSection } from "../shared/tabStore";
import { loadingStore, showVisualStore, isRoiStore } from "../shared/apiService";
import { data } from "../shared/json";

import LoadingSpinner from "../components/utils/Loading";
import PointCloudViewer from "../components/PointCloudViewer";
import Download from "../components/utils/Download";
import Features from '../components/Features';
import Checkbox from "../components/utils/Checkbox";
import { visualizationConfigStore } from "../shared/imagesStore";
import ToggleButton from "../components/utils/ToggleButton";
import FeaturesToggles from "../components/FeaturesToggles";

const CloudVisualization = ({ title, module }) => {
    const response = useStore(responseStore)
    const showVisualization =useStore(showVisualStore)
    const loading = useStore(loadingStore)
    const sectionRef = useRef(null);
    const target = useStore(scrollToSection);
    const isRoi = useStore(isRoiStore)

    
    useEffect(() => {
        if (target === 'visualization' && sectionRef.current) {
          sectionRef.current.scrollIntoView({ behavior: 'smooth' });
          scrollToSection.set(null); // Resetea el store después de hacer el scroll
        }
        console.log('cloud visualization:',module);
        
        
    }, [target]);

    
    return(
        <div className={`p-8 ${ showVisualization ? 'visible': 'hidden' }`}>
            <div className="mx-24">
                <div className="flex justify-between mb-6">
                    <h2 className="text-2xl font-bold my-10">{title}</h2>
                    <Download module={module} className={loading ? 'hidden': 'visible'}/>
                </div>
                <div className=" flex">
                    <div ref={sectionRef} id="visualization" className={` bg-gray-100 border border-gray-400 rounded-md ${module == 'feature-extraction'? 'w-3/4':'w-full'}`}>
                        {!response || loading ? (
                            <LoadingSpinner/>
                        ) : (
                            <div id="visualization-content">
                                {module === 'feature-extraction' && (
                                    <Features features={response.features} max_coords={response.max_coords}/>
                                    // <Features features={response.features} max_coords={[50.315, 50.941, 356.8]}/>
                                )}
                                
                                {module === 'dense-point-cloud' && (
                                    <PointCloudViewer 
                                        pointCloud={response.point_cloud} 
                                        colors={response.colors} 
                                        {...(!isRoi && { size: '4' })} 
                                        {...(!isRoi && { shape: 'circle' })} 
                                    />
                                )}

                                {module === 'no-dense-point-cloud' && (
                                    <PointCloudViewer 
                                        pointCloud={response.point_clouds} 
                                        colors={response.colors} 
                                        {...(!isRoi && { size: '4' })} 
                                        {...(!isRoi && { shape: 'circle' })} 
                                    />
                                )}
                            </div>
                        )}  
                    </div>
                    {module === 'feature-extraction' && response && (
                        <div className="w-1/4 pl-10">
                            <h1 className="font-bold text-3xl text-center mb-3">
                                Features
                            </h1>
                            <div className="flex flex-wrap text-m">
                                <p className="m-3 w-full sm:w-1/2 lg:w-1/3"><span className="font-semibold">People Count:</span> {response.features.count}</p>
                                <p className="m-3 w-full sm:w-1/2 lg:w-1/3"><span className="font-semibold">Group Form:</span> {response.features.character}</p>
                            </div>
                            
                            <FeaturesToggles/>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CloudVisualization;