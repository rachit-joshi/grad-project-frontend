import React from "react";
import * as d3 from 'd3';
const COLOR_SCALE = d3.schemeRdYlBu[4]

const CoordPlot = ({filteredWords,baseComparisonModel,dataset,filterSelect, datasetModels, rankingModel, setRankingModel}) => {

    React.useEffect(() => {
        console.log(filteredWords,baseComparisonModel)
        if(filteredWords){dataPrep()}
        setRankingModel(null)
        console.log(dataset)
    },[filteredWords,filterSelect]);


    const dataPrep = () => {
        var plotData = []
        var vistiedIdx = []
        var maxScale = 0
        var minScale = 100
        filteredWords.forEach((set) => {
            var filteredFrom = set.models.filter(function (ele, Idx) {return ele != datasetModels[baseComparisonModel]})[0]
            var toExtract = filterSelect.toLowerCase() === 'least similar' ? set.wordSimPairs.slice(-20).map((wordVal)=> wordVal[0]) : set.wordSimPairs.slice(0,20).map((wordVal)=> wordVal[0]);
            // console.log(filteredFarom,toExtract)

            toExtract.forEach((wIdx) => {
                if (vistiedIdx.includes(wIdx)) {
                    plotData.forEach((plt) => {
                        if (plt.wordIdx === wIdx) {
                            let newColor = [...plt.color, filteredFrom]
                            plt.color = newColor
                        }
                    })
                }
                else {
                    var temp2 = {}
                    temp2.color = [filteredFrom]
                    temp2.wordIdx = wIdx
                    filteredWords.forEach((set) => {
                        var secModel = set.models.filter(function (ele, Idx) {return ele != datasetModels[baseComparisonModel]})
                        let simRounded = set.simValues[wIdx].toFixed(2)    
                        temp2[secModel] = parseInt(simRounded*100)
                        maxScale = temp2[secModel] > maxScale ? temp2[secModel] : maxScale
                        minScale = temp2[secModel] < minScale ? temp2[secModel] : minScale
                    })
                    plotData.push(temp2)
                    vistiedIdx.push(wIdx)
                }
            })
        })
        console.log(plotData)
        //console.log(maxScale)
        if (plotData) {
            createCoordPlot(plotData,minScale,maxScale)
        }
    }

    function createCoordPlot (plotData,minScale,maxScale) {
        var topsModel = null
        d3.selectAll(`#coordplot > *`).remove();

            var margin ={top: 30, right: 50, bottom: 10, left: 50},
                width = 460 - margin.left - margin.right,
                height = 200 - margin.top - margin.bottom;


            var selectFilterModel = function(d, Idx){
                //console.log(" kcabs ",Idx,rankingModel);
                if (!topsModel){
                    topsModel = Idx
                    setRankingModel(Idx)
                    highlightFilterModel(Idx)
                }
                else if (topsModel == Idx){
                    //console.log("setNone")
                    topsModel = null
                    setRankingModel(null)
                    deselectFilterModel()
                }
                else {
                    //console.log("filtermodel")
                    topsModel = Idx
                    setRankingModel(Idx)
                    highlightFilterModel(Idx)
                }
            }

            var highlightFilterModel = function(Idx){
                //first every group turns grey
                d3.selectAll(".line")
                .transition().duration(200)
                .style("stroke", "lightgrey")
                .style("opacity", "0.2")
                // Second the hovered specie takes its color
                d3.selectAll("." + Idx)
                    .transition().duration(200)
                    .style("stroke", color(Idx))
                    .style("opacity", "1")
            }

            var deselectFilterModel = function(d){
                console.log("deselectrun")
                d3.selectAll(".line")
                    .transition().duration(200).delay(1000)
                    .style("stroke", function(d){ return( color(d.color[0]))} )
                    .style("opacity", "1")
            }

            var mouseoverPath = function(event, data) {
                //console.log(d, Idx)
                Tooltip
                  .style("opacity", 1)
                d3.select(`.i${data.wordIdx}`)
                  .style("stroke-width", "5.5px")
                  .style("opacity", 1)
              }
              var mousemovePath = function(event, data) {
                    Tooltip
                  .html("For word : " + `"${data.wordIdx}" similarity score with : <br>`)
                .style("left", (event.pageX) + "px")
                .style("top", (event.pageY) + "px")
              }
              var mouseleavePath = function(event, Idx) {
                Tooltip
                  .style("opacity", 0)
                d3.select(`.i${Idx.wordIdx}`)
                  .style("stroke-width", "1.5px")
                  .style("opacity", 0.8)
             }

            var svg = d3.select("#coordplot")
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform",
                    "translate(" + margin.left + "," + margin.top + ")")
            //.on("click", deselectFilterModel) //make filtermodel state, check with idx in selectFilterModel , deselect if same column is pressed twice 

            var Tooltip = d3.select("#coordplot")
                .append("div")
                .style("opacity", 0)
                .attr("class", "tooltip")
                .style("background-color", "white")
                .style("border", "solid")
                .style("border-width", "2px")
                .style("border-radius", "5px")
                .style("padding", "5px")
            

            var dimensions = Object.keys(plotData[0]).filter(function(ele, Idx) {return (ele !== "color") && (ele !== "wordIdx" )});
            var color = d3.scaleOrdinal().domain(dimensions).range(COLOR_SCALE);

            var y = {}
            for (let i in dimensions) {
                let name = dimensions[i]
                y[name] = d3.scaleLinear()
                .domain( [Math.floor((minScale-1)/10)*10,Math.ceil((maxScale+1)/10)*10])
                .range([height, 0])
            }


            var x = d3.scalePoint()
                    .range([0, width])
                    .domain(dimensions);


            function path(d) {
                return d3.line()(dimensions.map(function(p) { return [x(p), y[p](d[p])]; }));
            }

            svg
                .selectAll("myPath")
                .data(plotData)
                .enter()
                .append("path")
                .attr("class", function (d) { return "line " + `i${d.wordIdx}` + " " + d.color[0] + " " + `${ d.color[1] ? d.color[1] : "" }` } ) // 2 class for each line: 'line' and the group name
                .attr("d",  path)
                .style("fill", "none" )
                .style("stroke", function(d){ return( color(d.color[0]))} )
                .style("stroke-width", "1.5px")
                .style("opacity", 0.5)
                .on("mouseover", (event,d) =>  mouseoverPath(event,d))
                .on("mousemove", (event,d) =>  mousemovePath(event,d))
                .on("mouseleave", (event,d) =>  mouseleavePath(event,d))


                svg.selectAll("myAxis")
                    // For each dimension of the dataset I add a 'g' element:
                    .data(dimensions).enter()
                    .append("g")
                    .attr("class", "axis")
                    // I translate this element to its right position on the x axis
                    .attr("transform", function(d) { return "translate(" + x(d) + ")"; })
                    // And I build the axis with the call function
                    .each(function(d) { d3.select(this).call(d3.axisLeft().ticks(5).scale(y[d])); })
                    // Add axis title
                    .append("text")
                    .style("text-anchor", "middle")
                    .attr("y", -9)
                    .text(function(d) { return d; })
                    .style("fill", "black")
                    .on("click", selectFilterModel)
        }

    return (
        <>
            <div id="coordplot"></div>
        </>
    )
}

export default CoordPlot

