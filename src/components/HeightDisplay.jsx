import { useStore } from "@nanostores/react";
import { showVisualStore } from "../shared/apiService";
import { useEffect, useState } from "react";
import { responseStore } from "../shared/response";


const HeightDisplay = ({module}) =>{
    const showVisualization =useStore(showVisualStore)
    const response = useStore(responseStore)

    const [persons, setPersons] = useState([]);

    useEffect(() => {
        if (response) {
            const personsKeys = Object.keys(response).filter(key => key.startsWith('person'));
            const newPersons = []
            personsKeys.forEach(key => {
                newPersons.push(response[key])
            });
            if (module == "height-estimation-face") newPersons.push({height: (response.height/10), centroid: [0,0,(response.depth/10)]});
            console.log(newPersons);
            setPersons(newPersons); 

        }
    }, [response]);

    return(
        <div id="visualization" className={`p-8  ${ showVisualization ? 'visible': 'hidden' }`}>
            
            {response ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-3/4 mx-auto">
                <div className="grid grid-cols-3 grid-rows-2 shadow-md">
                    <div className="col-span-3 bg-[#14788E] text-white p-2 text-center rounded-t-lg font-semibold text-lg">
                        Height
                    </div>
                    {persons.map((person, index) => (
                        <div key={person} className="contents text-center">
                            <div className={`row-start-${index + 2} border font-semibold py-2`}>
                                Persona {index+1}
                            </div>
                            <div className={`col-span-2 row-start-${index + 2} border py-2`}>
                                {person.height ? person.height.toFixed(2) + " cm": person.message }
                            </div>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-3 grid-rows-2 shadow-md">
                    <div className="col-span-3 bg-[#14788E] text-white p-2 text-center rounded-t-lg font-semibold text-lg">
                        Depth
                    </div>
                    {persons.map((person, index) => (
                        <div key={person} className="contents text-center">
                            <div className={`row-start-${index + 2} border font-semibold py-2`}>
                                Persona {index+1}
                            </div>
                            <div className={`col-span-2 row-start-${index + 2} border py-2`}>
                                {person.centroid[2].toFixed(2)} cm
                            </div>
                        </div>
                    ))}
                </div>
            </div>)
            :
            (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-3/4 mx-auto">
                    <div className="grid grid-cols-3 grid-rows-2 shadow-md">
                        <div className="col-span-3 bg-[#14788E] text-white p-2 text-center rounded-t-lg font-semibold text-lg">
                            Height
                        </div>
                        <div className="animate-pulse contents text-center">
                            <div className="row-start-2 border font-semibold py-2">
                                <div className="h-4 bg-gray-300 rounded w-3/4 mx-auto"></div>
                            </div>
                            <div className="col-span-2 row-start-2 border py-2">
                                <div className="h-4 bg-gray-300 rounded w-3/4 mx-auto"></div>
                            </div>
                            <div className="row-start-3 border font-semibold py-2">
                                <div className="h-4 bg-gray-300 rounded w-3/4 mx-auto"></div>
                            </div>
                            <div className="col-span-2 row-start-3 border py-2">
                                <div className="h-4 bg-gray-300 rounded w-3/4 mx-auto"></div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-3 grid-rows-2 shadow-md">
                        <div className="col-span-3 bg-[#14788E] text-white p-2 text-center rounded-t-lg font-semibold text-lg">
                            Depth
                        </div>
                        <div className="animate-pulse contents text-center">
                            <div className="row-start-2 border font-semibold py-2">
                                <div className="h-4 bg-gray-300 rounded w-3/4 mx-auto"></div>
                            </div>
                            <div className="col-span-2 row-start-2 border py-2">
                                <div className="h-4 bg-gray-300 rounded w-3/4 mx-auto"></div>
                            </div>
                            <div className="row-start-3 border font-semibold py-2">
                                <div className="h-4 bg-gray-300 rounded w-3/4 mx-auto"></div>
                            </div>
                            <div className="col-span-2 row-start-3 border py-2">
                                <div className="h-4 bg-gray-300 rounded w-3/4 mx-auto"></div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
};

export default HeightDisplay;