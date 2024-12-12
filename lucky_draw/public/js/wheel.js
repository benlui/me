// reference: https://codepen.io/deab/pen/gObXawr
$(document).ready(function () {	
    window.onbeforeunload = function () {
        return "Please don't leave~~";
    };

    const height = window.innerHeight;
    const width = window.innerWidth;
    const shortest = (height > width) ? width : height;
    // console.log(height, width);
    const CHART_SIZE = (shortest < 500) ? ((shortest < 400) ? 250 : 300) : 500;
    const FONT_SIZE = (shortest < 500) ? ((shortest < 400) ? 10 : 14) : 16;

    var padding = {top:20, right:40, bottom:0, left:0},
                w = CHART_SIZE - padding.left - padding.right,
                h = CHART_SIZE - padding.top  - padding.bottom,
                r = Math.min(w, h)/2,
                rotation = 0,
                oldrotation = 0,
                picked = 100000,
                oldpick = [],
                color = d3.scale.category20c(); //category20c()
                //randomNumbers = getRandomNumbers();
            //http://osric.com/bingo-card-generator/?title=HTML+and+CSS+BINGO!&words=padding%2Cfont-family%2Ccolor%2Cfont-weight%2Cfont-size%2Cbackground-color%2Cnesting%2Cbottom%2Csans-serif%2Cperiod%2Cpound+sign%2C%EF%B9%A4body%EF%B9%A5%2C%EF%B9%A4ul%EF%B9%A5%2C%EF%B9%A4h1%EF%B9%A5%2Cmargin%2C%3C++%3E%2C{+}%2C%EF%B9%A4p%EF%B9%A5%2C%EF%B9%A4!DOCTYPE+html%EF%B9%A5%2C%EF%B9%A4head%EF%B9%A5%2Ccolon%2C%EF%B9%A4style%EF%B9%A5%2C.html%2CHTML%2CCSS%2CJavaScript%2Cborder&freespace=true&freespaceValue=Web+Design+Master&freespaceRandom=false&width=5&height=5&number=35#results
            
    var data = [
        {"label":"Seat 11",  "value":11,  "question":""},
        {"label":"Seat 12",  "value":12,  "question":""},
        {"label":"Seat 1",  "value":1,  "question":""},
        {"label":"Seat 2",  "value":2,  "question":""},
        {"label":"Seat 3",  "value":3,  "question":""},
        {"label":"Seat 4",  "value":4,  "question":""},
        {"label":"Seat 5",  "value":5,  "question":""},
        {"label":"Seat 6",  "value":6,  "question":""},
        {"label":"Seat 7",  "value":7,  "question":""},
        {"label":"Seat 8",  "value":8,  "question":""},
        {"label":"Seat 9",  "value":9,  "question":""},
        {"label":"Seat 10",  "value":10,  "question":""},
    ];

    // draw the wheel using d3
    var svg = d3.select('#chart')
        .append("svg")
        .data([data])
        .attr("width",  w + padding.left + padding.right)
        .attr("height", h + padding.top + padding.bottom);

    var container = svg.append("g")
        .attr("class", "chartholder")
        .attr("transform", "translate(" + (w/2 + padding.left) + "," + (h/2 + padding.top) + ")");

    var vis = container.append("g");
        
    var pie = d3.layout.pie().sort(null).value(function(d){return 1;});
    // declare an arc generator function
    var arc = d3.svg.arc().outerRadius(r);
    // select paths, use arc generator to draw
    var arcs = vis.selectAll("g.slice")
        .data(pie)
        .enter()
        .append("g")
        .attr("class", "slice");
        
    arcs.append("path")
        .attr("id", function(d, i){ return `path-${i}`; })
        .attr("fill", function(d, i){ return color(i); /*'#eeeeee'; */ })
        .attr("d", function (d) { return arc(d); });
    // add the text
    arcs.append("text").attr("transform", function(d){
            d.innerRadius = 0;
            d.outerRadius = r;
            d.angle = (d.startAngle + d.endAngle)/2;
            return "rotate(" + (d.angle * 180 / Math.PI - 90) + ")translate(" + (d.outerRadius -10) +")";
        })
        .attr("text-anchor", "end")
        .text( function(d, i) {
            return data[i].label;
        });

    //make arrow
    svg.append("g")
        .attr("transform", "translate(" + (w + padding.left + padding.right) + "," + ((h/2)+padding.top) + ")")
        .append("path")
        .attr("d", "M-" + (r*.15) + ",0L0," + (r*.05) + "L0,-" + (r*.05) + "Z")
        .style({"fill":"black"});
    //draw spin circle
    container.append("circle")
        .attr("cx", 0)
        .attr("cy", 0)
        .attr("r", 60)
        .style({"fill":"white","cursor":"pointer"});
    //spin text
    container.append("text")
        .attr("id", "spin-text")
        .attr("x", 0)
        .attr("y", 15)
        .attr("text-anchor", "middle")
        .text("SPIN")
        .style({"font-weight":"bold", "font-size":"30px"});

    // responsive
    $(`#chart`).width(`${CHART_SIZE}px`);
    $(`#chart`).height(`${CHART_SIZE}px`);
    $(`text`).css(`font-size`, `${FONT_SIZE}px`);
    $(`li`).css(`font-size`, `${FONT_SIZE}px`);
    $(`#spin-text`).css(`font-size`, `30px`);


    // container.on("click", spin); // SPIN clicked
    container.on("click", draw); // SPIN clicked

    var picked_num = [];

    // draw on wheel function
    function draw() {

        if(picked_num.length >= data.length) {
            alert("No more left! Enjoy the party!");
            return;
        }

        const delayTime = 20;
        const MIN_ROUND = 3;
        var round = MIN_ROUND + Math.floor((Math.random() * 10)+1);
        var lucky_num = Math.floor((Math.random() * data.length)+1); // start from 1
        // var currIdx = 0;
        const count = data.length;
        // console.log(`round:${round}, data.length:${data.length}, lucky_num:${lucky_num}`);

        // roll for #round
        for (var r = 0; r < round; r++) {
            let stopAt = (r === round - 1) ? lucky_num : count;
            for (var i = 0; i < stopAt; i++) {
                roll(r, i, count, (r === round - 1 && i === stopAt - 1));
            }
        }

        function setFill(idx, count, isFinal = false, color = "#A02337") {
            // console.log(`setFill[isFinal:${isFinal}], idx:${idx}`);
            for(var j=0; j < count; j++){
                if(isFinal) {
                    // update as final
                    if(picked_num.indexOf(lucky_num) === -1) picked_num.push(lucky_num);
                    if(j === 0) console.log(`picked_num:`, picked_num);
                    if(picked_num.indexOf(j + 1) !== -1) {
                        $(`#path-${j}`).css("fill", color);	
                    } else {
                        $(`#path-${j}`).css("fill", "");
                    }
                } else {
                    // normal spin
                    if(j == idx) {
                        $(`#path-${j}`).css("fill", color);	
                    } else {
                        if(picked_num.indexOf(j + 1) !== -1) {
                            // do nothing
                        } else {
                            $(`#path-${j}`).css("fill", "");
                        }
                    }
                }
            }
        }

        function roll(r, idx, count, isFinal = false) {
            setTimeout(function() {setFill(idx, count, isFinal);}, (delayTime * idx) + (r * count * delayTime));
        }
    }

    /*
    // SPIN function
    function spin(d){
        container.on("click", null);
        //all slices have been seen, all done
        console.log("OldPick: " + oldpick.length, "Data length: " + data.length);
        if (oldpick.length == data.length) {
            console.log("done");
            container.on("click", null);
            return;
        }
        var ps = 360 / data.length,
            pieslice = Math.round(1440 / data.length),
            rng = Math.floor((Math.random() * 1440) + 360);

        rotation = (Math.round(rng / ps) * ps);

        picked = Math.round(data.length - (rotation % 360) / ps);
        picked = picked >= data.length ? (picked % data.length) : picked;
        if (oldpick.indexOf(picked) !== -1) {
            d3.select(this).call(spin);
            return;
        } else {
            oldpick.push(picked);
        }
        rotation += 90 - Math.round(ps / 2);
        vis.transition()
            .duration(3000)
            .attrTween("transform", rotTween)
            .each("end", function () {
                //mark question as seen
                d3.select(".slice:nth-child(" + (picked + 1) + ") path")
                    .attr("fill", "#111");
                //populate question
                d3.select("#question h1")
                    .text(data[picked].question);
                oldrotation = rotation;

                // Get the result value from object "data"
                console.log(data[picked].value)

                // Comment the below line for restrict spin to sngle time
                container.on("click", spin);
            });
    }

    function rotTween(to) {
        var i = d3.interpolate(oldrotation % 360, rotation);
        return function(t) {
            return "rotate(" + i(t) + ")";
        };
    }

    function getRandomNumbers(){
        var array = new Uint16Array(1000);
        var scale = d3.scale.linear().range([360, 1440]).domain([0, 100000]);
        if(window.hasOwnProperty("crypto") && typeof window.crypto.getRandomValues === "function"){
            window.crypto.getRandomValues(array);
            console.log("works");
        } else {
            //no support for crypto, get crappy random numbers
            for(var i=0; i < 1000; i++){
                array[i] = Math.floor(Math.random() * 100000) + 1;
            }
        }
        return array;
    }
    */  
});