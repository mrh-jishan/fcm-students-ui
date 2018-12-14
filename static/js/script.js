// get the data
drawFCM = function (filterText) {
    d3.csv("static/file/output.csv", function (error, links) {
        var nodes = {};

        links = links.filter(function (res) {
            return res.source == filterText || res.target == filterText;
        })

        // Compute the distinct nodes from the links.
        links.forEach(function (link) {
            link.source = nodes[link.source] ||
                (nodes[link.source] = { name: link.source });
            link.target = nodes[link.target] ||
                (nodes[link.target] = { name: link.target });
            link.value = +link.value;
        });

        var width = window.innerWidth,
            height = window.innerHeight,
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
        var v = d3.scale.linear().range([0, 400]);

        // Scale the range of the data
        v.domain([0, d3.max(links, function (d) { return d.value; })]);

        // asign a type per value to encode opacity
        links.forEach(function (link) {
            if (v(link.value) <= 25) {
                link.type = "twofive";
            } else if (v(link.value) <= 50 && v(link.value) > 25) {
                link.type = "fivezero";
            } else if (v(link.value) <= 75 && v(link.value) > 50) {
                link.type = "sevenfive";
            } else if (v(link.value) <= 100 && v(link.value) > 75) {
                link.type = "onezerozero";
            }
        });

        var svg = d3.select("#container").append("svg")
            .attr("width", width)
            .attr("height", height);

        // build the arrow.
        svg.append("svg:defs").selectAll("marker")
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
        var path = svg.append("svg:g").selectAll("path")
            .data(force.links())
            .enter().append("svg:path")
            .attr("class", function (d) { return "link " + d.type; })
            .attr("id", function (d) {
                return "invis_" + d.source.index + "-" + d.value + "-" + d.target.index;
            })
            .attr("marker-end", "url(#end)");



        var pathLabel = svg.selectAll(".pathLabel")
            .data(force.links());

        pathLabel.enter().append("g").append("svg:text")
            .attr("class", "pathLabel")
            .append("svg:textPath")
            .attr("startOffset", "50%")
            .attr("text-anchor", "middle")
            .attr("xlink:href", function (d) { return "#invis_" + d.source.index + "-" + d.value + "-" + d.target.index; })
            .style("fill", "#000000")
            .style("font-size", 15)
            .text(function (d) { return d.value; });



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
            .style("fill", function (d) { return color(d.name); });


        // add the text 
        node.append("text")
            .attr("x", 12)
            .attr("dy", ".35em")
            .text(function (d) { return d.name; });

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
        function click() {
            d3.select(this).select("text").transition()
                .duration(750)
                .attr("x", 22)
                .style("stroke", "lightsteelblue")
                .style("stroke-width", ".5px")
                .style("font", "20px sans-serif");
            d3.select(this).select("circle").transition()
                .duration(750)
                .attr("r", 16);
        }

        // action to take on mouse double click
        function dblclick() {
            d3.select(this).select("circle").transition()
                .duration(750)
                .attr("r", 6);
            d3.select(this).select("text").transition()
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
draw_fcm_for_students = function () {
    d3.csv("static/file/outputstudents.csv", function (error, links) {
        var nodes = {};

        // Compute the distinct nodes from the links.
        links.forEach(function (link) {
            link.source = nodes[link.source] ||
                (nodes[link.source] = { name: link.source });
            link.target = nodes[link.target] ||
                (nodes[link.target] = { name: link.target });
            link.value = +link.value;
        });

        var width = 600,
            height = window.innerHeight,
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
        var v = d3.scale.linear().range([0, 400]);

        // Scale the range of the data
        v.domain([0, d3.max(links, function (d) { return d.value; })]);

        // asign a type per value to encode opacity
        links.forEach(function (link) {
            if (v(link.value) <= 25) {
                link.type = "twofive";
            } else if (v(link.value) <= 50 && v(link.value) > 25) {
                link.type = "fivezero";
            } else if (v(link.value) <= 75 && v(link.value) > 50) {
                link.type = "sevenfive";
            } else if (v(link.value) <= 100 && v(link.value) > 75) {
                link.type = "onezerozero";
            }
        });

        var svg = d3.select("#panel_content").append("svg")
            .attr("width", width)
            .attr("height", height);

        // build the arrow.
        svg.append("svg:defs").selectAll("marker")
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
        var path = svg.append("svg:g").selectAll("path")
            .data(force.links())
            .enter().append("svg:path")
            .attr("class", function (d) { return "link " + d.type; })
            .attr("id", function (d) {
                return "invis_" + d.source.index + "-" + d.value + "-" + d.target.index;
            })
            .attr("marker-end", "url(#end)");



        var pathLabel = svg.selectAll(".pathLabel")
            .data(force.links());

        pathLabel.enter().append("g").append("svg:text")
            .attr("class", "pathLabel")
            .append("svg:textPath")
            .attr("startOffset", "50%")
            .attr("text-anchor", "middle")
            .attr("xlink:href", function (d) { return "#invis_" + d.source.index + "-" + d.value + "-" + d.target.index; })
            .style("fill", "#000000")
            .style("font-size", 15)
            .text(function (d) { return d.value; });



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
            .style("fill", function (d) { return color(d.name); });


        // add the text 
        node.append("text")
            .attr("x", 12)
            .attr("dy", ".35em")
            .text(function (d) { return d.name; });

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
        function click() {
            d3.select(this).select("text").transition()
                .duration(750)
                .attr("x", 22)
                .style("stroke", "lightsteelblue")
                .style("stroke-width", ".5px")
                .style("font", "20px sans-serif");
            d3.select(this).select("circle").transition()
                .duration(750)
                .attr("r", 16);
        }

        // action to take on mouse double click
        function dblclick() {
            d3.select(this).select("circle").transition()
                .duration(750)
                .attr("r", 6);
            d3.select(this).select("text").transition()
                .duration(750)
                .attr("x", 12)
                .style("stroke", "none")
                .style("fill", "black")
                .style("stroke", "none")
                .style("font", "10px sans-serif");
        }

    });
}


function getData(file) {
    return new Promise(resolve => {
        d3.csv(file, function (error, links) {
            resolve(links);
        });
    });
}