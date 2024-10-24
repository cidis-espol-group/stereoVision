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
            <div class="flex justify-center mb-4 my-10">
                {!showCapture ? (
                    <LiveSettings onContinue={handleContinue}/>
                ) : (
                    <DatasetGeneration settings={settings}/>
                )}
            </div>
        </>
    )
}

export default Capture;