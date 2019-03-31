// get the data
view_students_data = (filterText) => {
    d3.csv("static/file/students.csv", async (error, links) => {
        var nodes = {};

        links = links.filter((res) => res.source == filterText || res.target == filterText)

        experts_data = await $getData('static/file/experts.csv');

        // Compute the distinct nodes from the links.
        links.forEach(function (link) {
            link.source = nodes[link.source] || (nodes[link.source] = {name: link.source});
            link.target = nodes[link.target] || (nodes[link.target] = {name: link.target});
            link.value = +link.value;
        });

        var width = $("#container").innerWidth(),
            height = window.innerHeight - 100,
            color = d3.scale.category20c();


        var force = d3.layout.force()
            .nodes(d3.values(nodes))
            .links(links)
            .size([width, height])
            .linkDistance(250)
            .charge(-400)
            .on("tick", tick)
            .start();

        var svg = d3.select("#container")
            .append("svg")
            .attr("width", width)
            .attr("height", height);


        // build the arrow.
        svg.append("svg:defs")
            .selectAll("marker")
            .data(["end"])      // Different link/path types can be defined here
            .enter().append("svg:marker")    // This section adds in the arrows
            .attr("id", String)
            .attr("viewBox", "0 -5 10 10")
            .attr("refX", 15)
            .attr("refY", -1.5)
            .attr("markerWidth", 6)
            .attr("markerHeight", 6)
            .attr("orient", "auto")
            .append("svg:path")
            .attr("d", "M0,-5L10,0L0,5");

        // add path 'link ' + d.type
        // add the links and the arrows
        var path = svg.append("svg:g")
            .selectAll("path")
            .data(force.links())
            .enter()
            .append("svg:path")
            .attr("class", (data) => {
                // console.log(data);
                if (data.value <= 60) {
                    return 'link red-line';
                } else if (data.value > 60 && data.value <= 75) {
                    return 'link orange-line';
                } else if (data.value > 75 && data.value <= 90) {
                    return 'link yellow-line';
                } else {
                    return 'link green-line';
                }
                // console.log(experts_data);
                // return experts_data.some(d => d.source == data.source.name && d.target == data.target.name && data.value == d.value) ? 'link' : 'link red-line';
            })
            .attr("id", (d) => "invis_" + d.source.index + "-" + d.value + "-" + d.target.index)
            .attr("marker-end", "url(#end)");

        var pathLabel = svg.selectAll(".pathLabel")
            .data(force.links());

        pathLabel.enter()
            .append("g")
            .append("svg:text")
            .attr("class", "pathLabel")
            .append("svg:textPath")
            .attr("startOffset", "50%")
            .attr("text-anchor", "middle")
            .attr("xlink:href", (d) => "#invis_" + d.source.index + "-" + d.value + "-" + d.target.index)
            .style("fill", "#000000")
            .style("font-size", 15)
            .text(function (d) {
                return d.value;
            });


        // define the nodes
        var node = svg.selectAll(".node")
            .data(force.nodes())
            .enter()
            .append("g")
            .attr("class", "node")
            .on("click", click)
            .on("dblclick", dblclick)
            .call(force.drag);

        // add the nodes
        node.append("circle")
            .attr("r", 5)
            .style("fill", (d) => color('#0000ff'));

        // add the text 
        node.append("text")
            .attr("x", 12)
            .attr("dy", ".35em")
            .text(function (d) {
                return d.name;
            });


        // var g = svg.append("g")
        //     .attr("class", "everything");

        // add the curvy lines
        function tick() {
            // d3.select("#Graph svg").selectAll("path")
            path.attr("d", function (d) {
                var dx = d.target.x - d.source.x,
                    dy = d.target.y - d.source.y,
                    dr = Math.sqrt(dx * dx + dy * dy);
                return "M" +
                    d.source.x + "," +
                    d.source.y + "A" +
                    dr + "," + dr + " 0 0,1 " +
                    d.target.x + "," +
                    d.target.y;
            });
            node.attr("transform", function (d) {
                return "translate(" + d.x + "," + d.y + ")";
            });
        }

        // action to take on mouse click
        function click(d) {
            d3.select(this).select("text")
                .transition()
                .duration(750)
                .attr("x", 22)
                .style("stroke", "lightsteelblue")
                .style("stroke-width", ".5px")
                .style("font", "20px sans-serif");

            $html = '';

            links.filter((e) => e.source.name === d.name || e.target.name === d.name).forEach((res, index) => {
                $data = experts_data.find(d => d.source == res.source.name && d.target == res.target.name);
                // console.log($data);
                $html += `<tr><td>${res.source.name}</td>
                    <td>${res.target.name}</td>
                    <td>${res.value}</td>
                    <td>${$data.value}</td></tr >`;
            });

            $("#selectedNode tbody").html($html);

            // d3.select(this).select("circle").transition()
            //     .duration(750)
            //     .attr("r", 16);
        }

        // action to take on mouse double click
        function dblclick() {
            d3.select(this).select("circle")
                .transition()
                .duration(750)
                .attr("r", 6);
            d3.select(this).select("text")
                .transition()
                .duration(750)
                .attr("x", 12)
                .style("stroke", "none")
                .style("fill", "black")
                .style("stroke", "none")
                .style("font", "10px sans-serif");
        }

    });
}


// get the data
view_experts_data = (filterText) => {
    d3.csv("static/file/experts.csv", function (error, links) {
        var nodes = {};

        links = links.filter((res) => res.source == filterText || res.target == filterText)

        // Compute the distinct nodes from the links.
        links.forEach(function (link) {
            link.source = nodes[link.source] || (nodes[link.source] = {name: link.source});
            link.target = nodes[link.target] || (nodes[link.target] = {name: link.target});
            link.value = +link.value;
        });

        var width = $("#container").innerWidth(),
            height = window.innerHeight - 100,
            color = d3.scale.category20c();


        var force = d3.layout.force()
            .nodes(d3.values(nodes))
            .links(links)
            .size([width, height])
            .linkDistance(250)
            .charge(-400)
            .on("tick", tick)
            .start();


        // Set the range
        // var v = d3.scale.linear().range([0, 100]);

        // Scale the range of the data
        // v.domain([0, d3.max(links, (d) => d.value)]);

        // asign a type per value to encode opacity
        links.forEach(function (link) {
            if ((link.value) <= 0.1) {
                link.type = "twofive";
            } else if ((link.value) <= 0.1 || (link.value) > 0.2) {
                link.type = "fivezero";
            } else if ((link.value) <= 0.2 || (link.value) > 0.3) {
                link.type = "sevenfive";
            } else if ((link.value) <= 0.3 || (link.value) > 0.4) {
                link.type = "onezerozero";
            }
        });

        var svg = d3.select("#container")
            .append("svg")
            .attr("width", width)
            .attr("height", height);


        // build the arrow.
        svg.append("svg:defs")
            .selectAll("marker")
            .data(["end"])      // Different link/path types can be defined here
            .enter().append("svg:marker")    // This section adds in the arrows
            .attr("id", String)
            .attr("viewBox", "0 -5 10 10")
            .attr("refX", 15)
            .attr("refY", -1.5)
            .attr("markerWidth", 6)
            .attr("markerHeight", 6)
            .attr("orient", "auto")
            .append("svg:path")
            .attr("d", "M0,-5L10,0L0,5");


        // add path
        // add the links and the arrows
        var path = svg.append("svg:g")
            .selectAll("path")
            .data(force.links())
            .enter()
            .append("svg:path")
            .attr("class", (d) => "link " + d.type)
            .attr("id", (d) => "invis_" + d.source.index + "-" + d.value + "-" + d.target.index)
            .attr("marker-end", "url(#end)");


        var pathLabel = svg.selectAll(".pathLabel")
            .data(force.links());

        pathLabel.enter()
            .append("g")
            .append("svg:text")
            .attr("class", "pathLabel")
            .append("svg:textPath")
            .attr("startOffset", "50%")
            .attr("text-anchor", "middle")
            .attr("xlink:href", (d) => {
                return "#invis_" + d.source.index + "-" + d.value + "-" + d.target.index;
            })
            .style("fill", "#000000")
            .style("font-size", 15)
            .text(function (d) {
                return d.value;
            });


        // define the nodes
        var node = svg.selectAll(".node")
            .data(force.nodes())
            .enter()
            .append("g")
            .attr("class", "node")
            .on("click", click)
            .on("dblclick", dblclick)
            .call(force.drag);

        // add the nodes
        node.append("circle")
            .attr("r", 5)
            .style("fill", (d) => color(d.name));

        // add the text 
        node.append("text")
            .attr("x", 12)
            .attr("dy", ".35em")
            .text(function (d) {
                return d.name;
            });


        // var g = svg.append("g")
        //     .attr("class", "everything");

        // add the curvy lines
        function tick() {
            // d3.select("#Graph svg").selectAll("path")
            path.attr("d", function (d) {
                var dx = d.target.x - d.source.x,
                    dy = d.target.y - d.source.y,
                    dr = Math.sqrt(dx * dx + dy * dy);
                return "M" +
                    d.source.x + "," +
                    d.source.y + "A" +
                    dr + "," + dr + " 0 0,1 " +
                    d.target.x + "," +
                    d.target.y;
            });
            node.attr("transform", function (d) {
                return "translate(" + d.x + "," + d.y + ")";
            });
        }

        // action to take on mouse click
        function click(d) {
            d3.select(this).select("text")
                .transition()
                .duration(750)
                .attr("x", 22)
                .style("stroke", "lightsteelblue")
                .style("stroke-width", ".5px")
                .style("font", "20px sans-serif");

            // d3.select(this).select("circle").transition()
            //     .duration(750)
            //     .attr("r", 16);
        }

        // action to take on mouse double click
        function dblclick() {
            d3.select(this).select("circle")
                .transition()
                .duration(750)
                .attr("r", 6);
            d3.select(this).select("text")
                .transition()
                .duration(750)
                .attr("x", 12)
                .style("stroke", "none")
                .style("fill", "black")
                .style("stroke", "none")
                .style("font", "10px sans-serif");
        }

    });
}

$getData = function (url) {
    return new Promise(resolve => {
        d3.csv(url, function (error, links) {
            resolve(links);
        });
    });
}

$getOutputData = function (url, source) {
    return new Promise(resolve => {
        d3.csv(url, function (error, links) {
            const data = links.filter(fd => fd.source == source || fd.target == source);
            resolve(data);
        });
    });
};


$getJSON = function (outputstudents, output) {
    return new Promise(resolve => {
        $getData(outputstudents).then(data => {
            const unique_output = data.filter((e, i) => data.findIndex((x) => x.source == e.source && x.target == e.target) == i);
            $getOutputData(output, data[0].source).then(allData => {
                resolve({outputstudents: unique_output, allOutputFile: allData});
            });
        });
    });
};


checking_with_experts_data = async (data) => {
    return $getData('static/file/experts.csv').then(res => {
        var result = res.some(d => d.source == data.source.name && d.target == data.target.name && data.value == d.value)
        return result;
    })
};