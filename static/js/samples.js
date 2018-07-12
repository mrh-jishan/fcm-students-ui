function init() {
    if (window.goSamples) goSamples();  // init for these samples -- you don't need to call this
    var $ = go.GraphObject.make;  // for conciseness in defining templates

    myDiagram =
        $(go.Diagram, "myDiagramDiv",  // must name or refer to the DIV HTML element
            {
                // start everything in the middle of the viewport
                initialContentAlignment: go.Spot.Center,
                // have mouse wheel events zoom in and out instead of scroll up and down
                "toolManager.mouseWheelBehavior": go.ToolManager.WheelZoom,
                // support double-click in background creating a new node
                // "clickCreatingTool.archetypeNodeData": {text: "new node"},
                // enable undo & redo
                "undoManager.isEnabled": false
            });

    // when the document is modified, add a "*" to the title and enable the "Save" button
    myDiagram.addDiagramListener("Modified", function (e) {
        var button = document.getElementById("SaveButton");
        if (button) button.disabled = !myDiagram.isModified;
        var idx = document.title.indexOf("*");
        if (myDiagram.isModified) {
            if (idx < 0) document.title += "*";
        } else {
            if (idx >= 0) document.title = document.title.substr(0, idx);
        }
    });

    // define the Node template
    myDiagram.nodeTemplate =
        $(go.Node, "Auto",
            new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
            // define the node's outer shape, which will surround the TextBlock
            $(go.Shape, "RoundedRectangle",
                {
                    parameter1: 20,  // the corner has a large radius
                    fill: $(go.Brush, "Linear", {0: "rgb(254, 201, 0)", 1: "rgb(254, 162, 0)"}),
                    stroke: null,
                    portId: "",  // this Shape is the Node's port, not the whole Node
                    fromLinkable: false, fromLinkableSelfNode: false, fromLinkableDuplicates: false,
                    toLinkable: false, toLinkableSelfNode: false, toLinkableDuplicates: false,
                    cursor: "pointer"
                }),
            $(go.TextBlock,
                {
                    font: "bold 12pt helvetica, bold arial, sans-serif",
                    editable: false  // editing the text automatically updates the model data
                },
                new go.Binding("text").makeTwoWay())
        );


    // replace the default Link template in the linkTemplateMap
    myDiagram.linkTemplate =
        $(go.Link,  // the whole link panel
            {
                curve: go.Link.Bezier, adjusting: go.Link.Stretch,
                reshapable: false, relinkableFrom: false, relinkableTo: false,
                toShortLength: 3
            },
            new go.Binding("points").makeTwoWay(),
            new go.Binding("curviness"),
            $(go.Shape,  // the link shape
                {strokeWidth: 1.5}),
            $(go.Shape,  // the arrowhead
                {toArrow: "standard", stroke: null}),
            $(go.Panel, "Auto",
                $(go.Shape,  // the label background, which becomes transparent around the edges
                    {
                        fill: $(go.Brush, "Radial",
                            {0: "rgb(240, 240, 240)", 0.3: "rgb(240, 240, 240)", 1: "rgba(240, 240, 240, 0)"}),
                        stroke: null
                    }),

                $(go.TextBlock, "transition",  // the label text
                    {
                        textAlign: "center",
                        font: "12pt helvetica, arial, sans-serif",
                        margin: 4,
                        editable: false  // enable in-place editing
                    },
                    // editing the text automatically updates the model data
                    new go.Binding("text").makeTwoWay())
            )
        );

    // read in the JSON data from the "mySavedModel" element
    load();
}


function load() {
    fetch(location.protocol + '//' + location.host + '/get_data')
        .then(function (response) {
            return response.json();
        })
        .then(function (res) {
            myDiagram.model = go.Model.fromJson(res.data);
            // console.log(myJson);
        });


}


init();
