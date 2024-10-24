import LiveSettings from "./LiveSettings";

const MultimediaCapture = ({}) => {
    const [settings, setSettings] = useState({ fps: '30', resolution: '1920x1080' });

    const handleContinue = (selectedSettings) => {
        setSettings(selectedSettings);
    };


    return (
        <>
            <LiveSettings onContinue={handleContinue}/>

            <DatasetGeneration settings={settings}/>

        </>
    )
}

export default MultimediaCapture;