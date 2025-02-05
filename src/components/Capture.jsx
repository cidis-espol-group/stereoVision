import React, { useState } from "react";
import DatasetGeneration from "./DatasetGeneration";
import LiveSettings from "./LiveSettings";

const Capture = ({}) => {
    const [settings, setSettings] = useState({ fps: '30', resolution: '1920x1080' });
    const [showCapture, setShowCapture] = useState(false)

    const handleContinue = (selectedSettings) => {
        setSettings(selectedSettings);
        setShowCapture(!showCapture)
    };

    return (
        <>
            
                {!showCapture ? (
                    <LiveSettings onContinue={handleContinue}/>
                ) : (
                    <DatasetGeneration settings={settings}/>
                )}
            
        </>
    )
}

export default Capture;