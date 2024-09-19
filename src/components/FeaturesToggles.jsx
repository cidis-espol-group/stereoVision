import { useStore } from "@nanostores/react";
import ToggleButton from "./utils/ToggleButton";
import { visualizationConfigStore } from "../shared/imagesStore";

const FeaturesToggles = () => {
  const visualizationConfig = useStore(visualizationConfigStore);

  const allKeys = Object.keys(visualizationConfig);

  const peopleFeatures = allKeys.filter((key) => !key.includes("Group"));
  const groupFeatures = allKeys.filter((key) => key.includes("Group"));

  const renderToggle = (featureKey) => {
    // Remover 'Group' del featureKey si está presente
    let labelKey = featureKey.includes("Group")
      ? featureKey.replace("Group", "").replace(/^show/i, "")
      : featureKey;

    // Generar una etiqueta legible a partir del labelKey
    const label = labelKey
      .replace(/([A-Z])/g, " $1")
      .replace(/^show/i, "")
      .replace(/^./, function (str) {
        return str.toUpperCase();
      })
      .trim();

    return (
      <div className="m-3" key={featureKey}>
        <h3 className="font-semibold">{label}</h3>
        <ToggleButton
          leftLabel={"Hide"}
          rightLabel={"Show"}
          checked={visualizationConfig[featureKey]}
          onChange={() => {
            visualizationConfigStore.set({
              ...visualizationConfigStore.get(),
              [featureKey]: !visualizationConfig[featureKey],
            });
          }}
        />
      </div>
    );
  };

  return (
    <>
      <div className="flex items-center align-middle">
        <div className="flex-grow border-t border-gray-400"></div>
        <h2 className="mx-4 font-bold text-2xl text-center my-3">People features</h2>
        <div className="flex-grow border-t border-gray-400"></div>
      </div>
      <div className="flex flex-wrap">
        {peopleFeatures.map(renderToggle)}
      </div>

      <div className="flex items-center align-middle">
        <div className="flex-grow border-t border-gray-400"></div>
        <h2 className="mx-4 font-bold text-2xl text-center my-3">Group features</h2>
        <div className="flex-grow border-t border-gray-400"></div>
      </div>
      <div className="flex flex-wrap">
        {groupFeatures.map(renderToggle)}
      </div>
    </>
  );
};

export default FeaturesToggles;
