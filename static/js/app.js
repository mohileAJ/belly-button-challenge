// Build the metadata panel
function buildMetadata(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // get the metadata field
    const metadata = data.metadata;

    // Filter the metadata for the object with the desired sample number
    const sampleNum = parseInt(sample);
    const object = metadata.filter(object => object.id === sampleNum)[0];

    // Use d3 to select the panel with id of `#sample-metadata`
    const panel = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    panel.html("");

    // Inside a loop, you will need to use d3 to append new
    // tags for each key-value in the filtered metadata.
    for (const [key, val] of Object.entries(object)) {
      panel.append("p").text(`${key.toUpperCase()}: ${val}`);
    }
  });
}

// function to build both charts
function buildCharts(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the samples field
    const samples = data.samples;

    // Filter the samples for the object with the desired sample number
    const obj = samples.filter(object => object.id === sample)[0];

    // Get the otu_ids, otu_labels, and sample_values
    const otu_ids = obj.otu_ids;
    const otu_labels = obj.otu_labels;
    const sample_values = obj.sample_values;

    // Build a Bubble Chart
    const bubbleChart = {
      type: "bubble",
      x: otu_ids,
      y: sample_values,
      mode: "markers",
      text: otu_labels,
      marker: {
        size: sample_values,
        color: otu_ids,
      }
    };

    // Render the Bubble Chart
    Plotly.newPlot("bubble", [bubbleChart], {
      title: "Bacteria Cultures Per Sample",
      xaxis: {
        title: "OTU ID"
      },
      yaxis: {
        title: "Number of Bacteria"
      }
    });

    // For the Bar Chart, map the otu_ids to a list of strings for your yticks
    const labels = otu_ids.map(id => `OTU ${id}`);

    // Build a Bar Chart
    // Don't forget to slice and reverse the input data appropriately
    const barChart = {
      type: "bar",
      orientation: "h",
      x: sample_values.slice(0, 10).reverse(),
      y: labels.slice(0, 10).reverse(),
      text: otu_labels
    };

    // Render the Bar Chart
    Plotly.newPlot("bar", [barChart], {
      title: "Top 10 Bacteria Cultures Found",
      yaxis: {
        title: "Number of Bacteria"
      }
    });
  });
}

// Function to run on page load
function init() {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {
    console.log(data);
    // Get the names field
    const names = data.names;

    // Use d3 to select the dropdown with id of `#selDataset`
    const dropdown = d3.select("#selDataset");

    // Use the list of sample names to populate the select options
    // Hint: Inside a loop, you will need to use d3 to append a new
    // option for each sample name.
    for (const name of names) {
      dropdown.append("option").text(name).property("value", name);
    }

    // Get the first sample from the list
    const firstSample = names[0];

    // Build charts and metadata panel with the first sample
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Function for event listener
function optionChanged(newSample) {
  // Build charts and metadata panel each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
