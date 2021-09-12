function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {

  console.log('hello!')

    // 3. Create a variable that holds the samples array. 
  var sampleArray = data.samples;

    // 4. Create a variable that filters the samples for the object with the desired sample number.

  var sampleID = sampleArray.filter(Item => Item.id == sample);

    //  5. Create a variable that holds the first sample in the array.

  var chartSample = sampleID[0];

  console.log(chartSample)

    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.

  var otuIDs = [];
  var otuIDs_copy = [];
  var otuLBLs = [];
  var sampleVals = [];

    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 

  var chartSampleArray = [];
  var sampleItem = {};
  


  for (i=0; i<chartSample.sample_values.length; i++) {

      sampleItem = {"otu_ids": chartSample.otu_ids[i], "otu_labels": chartSample.otu_labels[i] , "sample_values": chartSample.sample_values[i] };
      chartSampleArray.push(sampleItem);

  }

  console.log(chartSampleArray);

  chartSampleArray.sort(function(a,b) {

    return b.sample_values - a.sample_values;

  } );


  chartSampleArray = chartSampleArray.slice(0,10);

  console.log(chartSampleArray);

  chartSampleArray.forEach(function(ots) {

    otuIDs.push(ots.otu_ids);
    otuIDs_copy.push(ots.otu_ids);
    otuLBLs.push(ots.otu_labels);
    sampleVals.push(ots.sample_values);


  }

  )


 for (i=0; i<otuIDs.length; i++) {                // This section is the top 10 STRING array of the otu ids

    otuIDs[i] = "OTU  " + otuIDs[i].toString();
    
 }

 otuIDs = otuIDs.reverse();           
 sampleVals = sampleVals.reverse();
 otuIDs_copy = otuIDs_copy.reverse();


  console.log(otuIDs, " ", sampleVals);

  console.log(otuIDs_copy);

  // BAR CHART

    // 8. Create the trace for the bar chart. 
    var barData = [ {
      
      x : sampleVals,
      y : otuIDs,
      marker : {color : [ "#CEA353", "#CEC653", "#BACE53", "#8DCE53", "#53CE55", "#53CE9B", "#539DCE", "#535ECE", "#A953CE", "#CE53C6"] },
      type: "bar",
      orientation: "h",
      text: otuLBLs

    }];

    // 9. Create the layout for the bar chart. 
    var barLayout = {
     
      title:  "Top 10 Bacterial Cultures Found",

      margin: {
        l: 100,
        r: 100,
        t: 100,
        b: 100
      }


    };
    
    Plotly.newPlot("bar_chart", barData, barLayout);


// BUBBLE CHART

 // 1. Create the trace for the bubble chart.

// Colors for bubbles

function colorFnc() {

  let hexArray = ["#CEA353", "#CEC653", "#BACE53", "#8DCE53", "#53CE55", "#53CE9B", "#539DCE", "#535ECE", "#A953CE", "#CE53C6"];

  return hexArray;
};


// Size of the bubbles

function sizeFnc(numArray) {

  let sizes = [];

  for (i=0; i<numArray.length; i++) {

    size = 100*Math.sqrt(numArray[i]);
    sizes.push(size);

  };

  console.log(sizes);
  return sizes;

};


 var bubbleData = [ {

    x: otuIDs_copy,
    y: sampleVals,
    text: otuLBLs,
    mode: 'markers',
    marker: {

        color: colorFnc(),
        size: sizeFnc(otuIDs_copy),
        sizemode: 'area',
        symbol: 'circle'

}

}

];

 // 2. Create the layout for the bubble chart.

 var bubbleLayout = {

    title: "Bacterial Cultures Per Sample",
    xaxis: {
      title: {
        text: 'OTU ID',
        font: {
          family: 'Courier New, monospace',
          size: 18,
          color: '#7f7f7f'},
              }
            },
    text: otuLBLs

   
 };


 // 3. Use Plotly to plot the data with the layout.
 Plotly.newPlot("bubble", bubbleData, bubbleLayout ); 



// Bacteria list of the otu ids

function labelParser(bacteria) {

  var bacteria_sample =[];
  var bacteria_array = [];
  
  for (i=0; i<bacteria.length; i++) {
  
  bacteria_sample = bacteria[i];
  bacteria_sample = bacteria_sample.split(";");
  bacteria_array.push(bacteria_sample);
  
  };
  
  // remove duplicats
  
  let uniqueBacteria = [...new Set(bacteria_array)];
  
  console.log(uniqueBacteria);
  
  
// Add html beneath the bubble chart div

document.getElementById("bacterialist").innerHTML = uniqueBacteria;
  
};

  // call function and pass it the otuIDs array

  labelParser(otuLBLs);


 // GAUGE CHART

 var metaArray = data.metadata;
 var metaResult = [];
 var sortedwashFreq = [];
 var washFreq = [];
 var washFreqResult;
 var maxwashFreq;
 var valuewashFreq;
 var otuidResult;
 

 console.log(metaArray);

// washFre store all values of key "wfreq"

 for (i=0; i< metaArray.length; i++) {

  let item = metaArray[i];
  let freq = item.wfreq;
  washFreq.push(freq);

 }

 // sortedwashFreq stores wreq values in descending order

 sortedwashFreq = washFreq.sort( (first, second) => {return second - first; } );

// maxwashFreq is used to set the upper limit on the gauge graph

 maxwashFreq = sortedwashFreq[0];
 maxwashFreq = parseFloat(maxwashFreq);

 // metaResult corresponds to the selected id from the dropdown menu
 
 metaResult = metaArray.filter(Item => Item.id == sample);

 // washFreqResult is an object not an array for the selected id

 washFreqResult = metaResult[0];
 

 // otuidResult stores the id of washFreqResult

 otuidResult = washFreqResult.id;

 // valuewashFreq is the wfreq of the selected id

 valuewashFreq = washFreqResult.wfreq;
 
// changed to Float

 valuewashFreq = parseFloat(valuewashFreq);

 // call gaugeChart

 console.log(valuewashFreq);
 console.log(maxwashFreq);

 gaugeChart(otuidResult, valuewashFreq, maxwashFreq );

    
  });  // Ending braces of buildCharts function
}


function gaugeChart(otuid , value, maxvalue) {

console.log(value);
console.log(maxvalue);

// 4. Create the trace for the gauge chart.
var gaugeData = [ 
  {
  domain: {x : [0,1], y : [0, 1] } ,
  value: value,
  title: {text : "Belly Button Washing Frequency"+"<br>"+"Scrubs Per Week" },
  type: "indicator",
  mode: 'gauge + number+delta',
  delta: { reference: 5 },
  gauge: {
    bar: {color : "blue"},
    axis: { range: [null, maxvalue] },
    steps: [
      { range: [0, 5], color: "ligthgray" },
      { range: [5, 10], color: "gray" }
    ],
    threshold: {
      line: { color: "red", width: 4 },
      thickness: 0.75,
      value: 9
    }
 
  } } 
  ];
  
  // 5. Create the layout for the gauge chart.
  var gaugeLayout = { 
    margin: { t: 25, b: 25},
    paper_bgcolor: "offwhite",
    font: { color: "darkblue", family: "Arial"}
  
  };

  // 6. Use Plotly to plot the gauge data and layout.
  Plotly.newPlot("gauge", gaugeData, gaugeLayout);

  // Fill in HTML elements with otu id and washes values

  document.getElementById("otuvalue").innerHTML = otuid;
  document.getElementById("washesvalue").innerHTML =  value;
  document.getElementById("maxwashesvalue").innerHTML =  maxvalue;

 

}  // End of the gaugeChart function which is outside of the buildCharts function


