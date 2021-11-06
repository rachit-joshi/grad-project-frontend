// const createplot = () => {
//     var margin = { top: 10, right: 30, bottom: 30, left: 60 },
//         width = 460 - margin.left - margin.right,
//         height = 460 - margin.top - margin.bottom;

//     var svg = d3.select("#vizplot")
//         .append("svg")
//         .attr("width", width + margin.left + margin.right)
//         .attr("height", height + margin.top + margin.bottom)
//         .append("g")
//         .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

//     const plotMinMaxCoords = getMinMaxCoords(wikiData.fastText_wiki_data);

//     var x = d3.scaleLinear()
//         .domain([plotMinMaxCoords.xMin, plotMinMaxCoords.xMax])
//         .range([0, width]);
//     svg.append("g")
//         .attr("transform", "translate(0," + height + ")")
//         .call(d3.axisBottom(x));


//     var y = d3.scaleLinear()
//         .domain([plotMinMaxCoords.yMin, plotMinMaxCoords.yMax])
//         .range([height, 0]);
//     svg.append("g")
//         .call(d3.axisLeft(y));

//     svg.append('g')
//         .selectAll("dot")
//         .data(wikiData.fastText_wiki_data)
//         .enter()
//         .append("circle")
//         .attr("cx", function (d) { return x(d.embedding_pca[0]); })
//         .attr("cy", function (d) { return y(d.embedding_pca[1]); })
//         .attr("r", 1.5)
//         .style("fill", "#69b3a2")



// };


{/* <Dropdown options={dropdownOptions} onChange={ (e) => datasetSelect(e)} value={deafultDropdownOption} placeholder="Select a Dataset" />
            { allModels ? (
                <>
                    <div className="modelSelect">
                        <h5>Select Model</h5>
                        <ul className="model-list" style={{ listStyleType: "none" }}>
                            {allModels.map((name, index) => {
                                return (
                                    <li key={index}>
                                        <div>
                                            <input type="checkbox"
                                            id={`custom-checkbox-${index}`}
                                            name={name}
                                            value={name}
                                            // checked={checkedState[index]}
                                            onChange={() => handleModelCheck(name)}
                                            />
                                            <label htmlFor={`custom-checkbox-${index}`}>{name}</label>
                                        </div>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                </>
            ) : (
                <h4>Please select dataset</h4>
            )} */}


            const dropdownOptions = [
                'Wikipedia Feb 2007', 'HistWords', 'Opt 3'
            ]
            const deafultDropdownOption = dropdownOptions[0];
        
            // const datasetSelect = (e) => {
            //     console.log("enter switch");
            //     switch (e.value) {
            //         case "Wikipedia Feb 2007":
            //             console.log("...");
            //             console.log(e.value);
            //             for (const dataOpt of dataOptConfig){
            //                 console.log(dataOpt);
            //                 if (dataOpt.dataset === 'WikiFeb2007'){
            //                     console.log("found");
            //                     setAllModels(dataOpt.models);
            //                 }
            //             }
            //             console.log(allModels);
            //             break;
            //         case "HistWords":
            //             console.log("...");
            //             console.log(e.value);
            //             for (let dataOpt of dataOptConfig){
            //                 if (dataOpt.dataset === "HistWords"){
            //                     setAllModels(dataOpt.models);
                                
            //                 }
            //             }
            //             console.log(allModels);
            //             break;
            //         case "Opt 3":
            //             console.log("...");
            //             console.log(e.value);
            //             for (let dataOpt of dataOptConfig){
            //                 if (dataOpt.dataset === "Opt3"){
            //                     setAllModels(dataOpt.models);
                                
            //                 }
            //             }
            //             console.log(allModels);
            //             break;
            //     }
            // }
        
            // const handleModelCheck = (name) => {
            //     if (selectedModels.includes(name)){
            //         setSelectedModels(selectedModels.filter(item => item !== name));
            //     }
            //     else{
            //         setSelectedModels(currArr => [...currArr, name]);
            //     }
            // }









            // const getData = (selectedModels) => {
    //         switch (selectedModels.datasetId){
    //             case 1:
    //                 axios.get("http://localhost:4000/wikidata")
    //                 .then((res) => {
    //                     setModelData(res.data.modelData);
    //                     console.log('got wikiData', res.data);
    //                 });
    //                 break;
    //             case 2:
    //                 axios.get("http://localhost:4000/histworddata")
    //                 .then((res) => {
    //                     setModelData(res.data.modelData);
    //                     console.log('got HistWordData');
    //                 });
    //                 break;
    //         }
    // }

    // const getCombinations = (number) => {
    //     var res=[]
    //     for(var i = 0; i<num-1; ++i){
    //         for(var j=i+1;j<num;++j){
    //             res.push([i,j])
    //         }
    //     }
    //     return res;
    // }