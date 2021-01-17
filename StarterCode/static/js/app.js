
function init() {
    // create variable to use dropdown menu
    var dropdownMenu = d3.select("#selDataset");

    // use samples.json to fill menu with names
    d3.json("samples.json").then((data) => {
        var names = data.names;

        names.forEach((sample) => {
            dropdownMenu.append("option")
                .text(sample)
                .property("value", sample);    
        });
        
        var firstDisplay = names[0];sahp
        barchart(firstDisplay);
        bubble(firstDisplay);
        meta(firstDisplay);
    });
}

function optionChanged(new_name) {
    //buildscharts when dropdown menu is changed
    barchart(new_name);
    bubble(new_name);
    meta(new_name);
}

function barchart(sample) {
    d3.json("samples.json").then((data) => {
        // pull one object from JSON for dropdown selected name
        var samples = data.samples;
        var tinyJSON = samples.filter(sampleID => sampleID.id == sample);
        var object = tinyJSON[0];

        // create variables to hold data from object
        var otu_ids = object.otu_ids;
        var otu_labels = object.otu_labels;
        var sample_values = object.sample_values;

        // create variable for the bar chart data and layout
        var BAR_layout = {
            title: "Top 10 Bacterial Cultures in this Belly Button",
            margin: {t: 50, l: 150}
        };

        
        var BAR_trace1 = [
            {
                y: otu_ids.slice(0, 10).map(otuID => `OTU ID: ${otuID}`).reverse(),
                x: sample_values.slice(0, 10).reverse(), //reverse to match correctly
                text: otu_labels.slice(0, 10).reverse(),
                type: "bar",
                orientation: "h"
            }
        ];
        // build bar chart
        Plotly.newPlot("bar", BAR_trace1, BAR_layout);
    }); 
} 

function bubble(sample) {
    d3.json("samples.json").then((data) => {
        // pull one object from JSON for dropdown selected name
        var samples = data.samples;
        var tinyJSON = samples.filter(sampleID => sampleID.id == sample);
        var object = tinyJSON[0];

        // create variables to hold data from object
        var otu_ids = object.otu_ids;
        var otu_labels = object.otu_labels;
        var sample_values = object.sample_values;

        // create variable for the bar chart data and layout
        var bubble_layout = {
            title: "Occurance of OTUs",
            showlegend: false,
            height: 500,
            width: 1200
        };

        var bubble_trace1 = [
            {
                y: sample_values,
                x: otu_ids,
                text: otu_labels,
                mode: 'markers',
                marker: {
                    color: otu_ids,
                    size: sample_values
                }
            }
        ];
        // build bar chart
        Plotly.newPlot("bubble", bubble_trace1, bubble_layout);

    });
}

function meta(sample) {
    d3.json("samples.json").then((data) => {
        // pull one object from JSON for dropdown selected name
        var metadata = data.metadata;
        var tinyJSON2 = metadata.filter(sampleID => sampleID.id == sample);
        var object2 = tinyJSON2[0];

        // select the metadata display area
        var Display = d3.select("#sample-metadata");

        // clear display area
        Display.html("");

        // use Object.entries to add each key:value pair
        Object.entries(object2).forEach(([key, value]) => {
            Display.append("p").text(`${key}:${value}`);
        });
    }); 
} 

init()