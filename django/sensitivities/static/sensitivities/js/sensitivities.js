var margins = [20, 20, 75, 180];
var width = 600 - margins[1] - margins[3];
var height = 350 - margins[0] - margins[2];

var nudge = (function () {
  var ε = 1e-6;
  return function (x, s) { return x * (1 + s*ε); }
})();

var xmin = nudge(1e-9, -1);
var xmax = 0.001;
var ymin = 0;
var ymax =  1.05;

var scale_x = d3.scale.log().domain([xmin, xmax]).range([0, width]);
var scale_y = d3.scale.linear().domain([ymin, ymax]).range([height, 0]);

var svg = d3.select("#graph").append("svg");
var graph = svg
    .attr("width", width + margins[1] + margins[3])
    .attr("height", height + margins[0] + margins[2])
    .append("g")
    .attr("transform", "translate(" + margins[3] + ", " + margins[0] + ")");

var log10 = (function () {
  var factor = 1/Math.log(10);
  return function (x) { return Math.log(x)*factor }
})();

var areapath = graph.append("path").attr("class", "area");
var graphpath = graph.append("path").attr("class", "plotline");

var leftedge = 0;

var ec50path = graph.append("path")
    .attr("class", "auxline")
    .style("stroke-dasharray", ("2, 2"));
var ic50path = graph.append("path")
    .attr("class", "auxline")
    .style("stroke-dasharray", ("2, 2"));
var einfpath = graph.append("path")
    .attr("class", "auxline")
    .style("stroke-dasharray", ("2, 2"));
var emaxpath = graph.append("path")
    .attr("class", "auxline")
    .style("stroke-dasharray", ("2, 2"));
var mpath = graph.append("path")
    .attr("class", "auxline")
    .style("stroke-dasharray", ("2, 2"));


var hmelabel = graph.append("g")
    .attr("class", "label")
    .attr("transform", "translate(" + (leftedge + 3) + ", " + 0 + ")")
    .append("text");
hmelabel.append("tspan").text("hme=");
hmelabel.append("tspan").attr("class", "value");

var emaxlabel = graph.append("g")
    .attr("class", "label")
    .attr("transform", "translate(" + (leftedge + 3) + ", " + 0 + ")")
    .append("text");
emaxlabel.append("tspan").text("E");
emaxlabel.append("tspan").attr("class", "subscript")
                         .attr("dy", 0.5 + "ex")
                         .text("max");
emaxlabel.append("tspan").attr("dy", -0.5 + "ex").text("=");
emaxlabel.append("tspan").attr("class", "value");

var einflabel = graph.append("g")
    .attr("class", "label")
    .attr("transform", "translate(" + (leftedge + 3) + ", " + 0 + ")")
    .append("text");

einflabel.append("tspan").text("E");
einflabel.append("tspan").attr("class", "subscript")
                         .attr("dy", 0.5 + "ex")
                         .text("∞");
einflabel.append("tspan").attr("dy", -0.5 + "ex").text("=");
einflabel.append("tspan").attr("class", "value");


var ec50label = graph.append("g")
    .attr("class", "label")
    .attr("transform", "translate(" + scale_x(xmin) + ", " +
                                      (height - 3) + ") " + "rotate(-90)")
    .append("text");
ec50label.append("tspan").text("EC");
ec50label.append("tspan").attr("class", "subscript")
                         .attr("dy", 0.5 + "ex")
                         .text("50");
ec50label.append("tspan").attr("dy", -0.5 + "ex").text("=");
ec50label.append("tspan").attr("class", "value");


var ic50label = graph.append("g")
    .attr("class", "label")
    .attr("transform", "translate(" + scale_x(xmin) + ", " +
                                      (height - 3) + ") " + "rotate(-90)")
    .append("text");
ic50label.append("tspan").text("IC");
ic50label.append("tspan").attr("class", "subscript")
                         .attr("dy", 0.5 + "ex")
                         .text("50");
ic50label.append("tspan").attr("dy", -0.5 + "ex").text("=");
ic50label.append("tspan").attr("class", "value");


(function () {
  var xax = d3.svg.axis()
      .scale(scale_x)
      .tickFormat(function (s) { return "" });

  var sfmt = d3.format('s');

  var ticks = graph.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + scale_y(0) + ")")
        .call(xax)
        .selectAll("text")
        .datum(function (d, i) {
                  var t = parseFloat(d3.format('.2f')(log10(d)));
                  var u = d3.round(t);
                  return {keep: ((t - u == 0) && !!(u % 2)),
                          value: d,
                          log10: u}})
        .filter(function (d, i) { return d.keep })
        .text(function (d, i) {
                return d.log10 < -4 ? null : d.value;
              })
        .filter(function (d, i) { return d.log10 < -4 });

  ticks.append("tspan").text("10");
  ticks.append("tspan").attr("class", "superscript")
                       .attr("dy", -1 + "ex")
                       .text(function (d, i) { return d.log10 });

  var xmid = Math.pow(10, 0.5 * (log10(xmin) + log10(xmax)));

  graph.append("g")
      .attr("class", "label")
      .attr("transform", "translate(" + scale_x(xmid) + ", 0)")
      .append("text")
      .style("text-anchor", "middle")
      .text("concentration")
      .attr("y", height + margins[2]/2);

  var tblock = graph.append("g")
      .attr("class", "label")
      .attr("transform", "translate(" + scale_x(xmid) + ", 0)")
      .append("text")
      .style("text-anchor", "middle")
      .attr("y", margins[0]);

  <!-- tblock.append("tspan").text("E"); -->
  <!-- tblock.append("tspan").attr("class", "subscript") -->
  <!--                       .attr("dy", 0.5 + "ex") -->
  <!--                       .text("max"); -->
  <!-- tblock.append("tspan").attr("dy", -0.5 + "ex").text("="); -->
  <!-- tblock.append("tspan"); -->

  var yax = d3.svg.axis()
      .scale(scale_y)
      .orient("left")
      .tickValues(d3.range(0, nudge(1, 1), 0.5))
      .tickSubdivide(4)
      .tickSize(6, 3, 0)
      .tickFormat(sfmt);

  graph.append("g")
      .attr("class", "y axis")
      .call(yax);

  graph.append("g")
      .attr("class", "label")
      .attr("transform", "translate(" + scale_x(xmin) + ", " +
                                        scale_y(0.5) + ") " +
                         "rotate(-90)")
      .append("text")
      .style("text-anchor", "middle")
      .text("relative viability")
      .attr("y", -margins[3]/4);

})();

var npoints = 700;
var xs = d3.range(npoints)
    .map(d3.scale.linear().domain([0, npoints])
                          .range([Math.log(xmin), Math.log(xmax)]))
    .map(Math.exp);

var line = d3.svg.line()
    .x(function (d) { return scale_x(d.x); })
    .y(function (d) { return scale_y(d.y); });

var auxline = d3.svg.line()
    .x(function (d) { return ('absx' in d) ? d.absx : scale_x(d.x); })
    .y(function (d) { return ('absy' in d) ? d.absy : scale_y(d.y); });

var mintested = 1e-8;
var maxtested = 1e-5;

var area = (function () {
    var base = scale_y(0);
    return d3.svg.area()
                 .x(function (d) { return scale_x(d.x); })
                 .y0(base)
                 .y1(function (d) {
                    return (((mintested <= d.x) && (d.x <= maxtested)) ?
                            scale_y(d.y) : base);
                  });
})();

var plotit = (function () {
  var ffmt = d3.format('0.2f');
  var efmt = d3.format('0.1e');

  return function (EC50, E0, Einf, m) {
    var EC50inv = 1/EC50;
    var minv = 1/m;
    var num = E0 - Einf;
    function drcurve(d) {
      return Einf + num/(1 + Math.pow(d*EC50inv, m));
    };

    var data = xs.map(function (x) {
      return {x: x, y: drcurve(x)}; 
    });

    areapath.attr("d", area(data));
    graphpath.attr("d", line(data));

    var IC50;
    var IC50text;
    var IC50data;
    var ic50color = "";
    if (Einf < 0.5) {
      IC50 = EC50 * Math.pow(num/(0.5 - Einf) - 1, minv);
      IC50text = efmt(IC50);

      if (!((mintested <= IC50) && (IC50 <= maxtested))) {
        IC50color = "outside-tested-range";
      }

      if (IC50 > xmax) {
        IC50 = xmax;
        IC50data = [{x: xmin, y: 0.5}, {x: IC50, y: 0.5}];
      }
      else {
        IC50data = [{x: xmin, y: 0.5}, {x: IC50, y: 0.5}, {x: IC50, y: 0}];
      }
    }
    else {
      IC50 = xmax;
      IC50text = "NA";
      IC50data = [{x: xmin, y: 0.5}, {x: IC50, y: 0.5}];
      IC50color = "not-defined";
    }

    ic50path.attr("d", auxline(IC50data));

    var hme = (E0 + Einf)/2;
    ec50path.attr("d", auxline([{absx: leftedge, y: hme},
                                {x: EC50, y: hme},
                                {x: EC50, y: 0}]));

    var Emax = drcurve(maxtested);
    emaxpath.attr("d", auxline([{absx: leftedge, y: Emax},
                                {x: maxtested, y: Emax}]));

    einfpath.attr("d", auxline([{absx: leftedge, y: Einf},
                                {x: xmax, y: Einf}]));

    var f0 = 2/((E0 - Einf) * m);
    var f1 = E0 + Einf;

    mpath.attr("d", auxline([{x: Math.exp(f0*(f1 - 2*ymax)) * EC50, y: ymax},
                             {x: Math.exp(f0*f1) * EC50, y: 0}]));


    hmelabel.attr("y", scale_y(hme))
            .select(".value")
            .text(ffmt(hme));

    emaxlabel.attr("y", scale_y(Emax))
             .select(".value")
             .text(ffmt(Emax));

    einflabel.attr("y", scale_y(Einf))
             .select(".value")
             .text(ffmt(Einf));


    ec50label.attr("y", scale_x(EC50))
             .select(".value")
             .text(efmt(EC50));

    ic50label.attr("y", scale_x(IC50))
             .select(".value")
             .text(efmt(IC50));

  }
})();

var plotit2 = (function () {
  return function (x, y, θ, dy) {
    // ic50label.text("IC50")
    //   .attr("x", x)
    //   .attr("y", y)
    //   .attr("dy", dy)
    //   .attr("transform", "rotate(" + θ + ")");

    // emaxlabel.text("Emax")
    //   .attr("transform", "translate(" + x + ", " + y + ") " +
    //                      "rotate(" + θ + ")")
    //   .attr("dy", dy);
  }
})();



$( function () {
  function replot() {
    plotit(parseFloat($( "#EC50-slider-value" ).html()),
           1,
           parseFloat($( "#Einf-slider-value" ).html()),
           parseFloat($( "#m-slider-value" ).html()));
  }

  function replot2() {
    return;
    // plotit2(parseInt($( "#x-slider-value" ).html()),
    //         parseInt($( "#y-slider-value" ).html()),
    //         parseInt($( "#θ-slider-value" ).html()),
    //         parseInt($( "#dy-slider-value" ).html()));
  }

  var gfmt = d3.format("0.2g");
  var ffmt = d3.format("0.2f");

  $( "#EC50-slider" ).slider(
      {
        range: "min",
        value: log10(parseFloat($( "#EC50-slider-value" ).html())),
        min: log10(xmin),
        max: log10(xmax),
        step: 0.01,
        slide: function (event, ui) {
           $( "#EC50-slider-value" ).html( gfmt(Math.pow(10, ui.value)) );
           replot();
        }
      });

  $( "#Einf-slider" ).slider(
      {
        range: "min",
        value: parseFloat($( "#Einf-slider-value" ).html()),
        min: 0,
        max: 1,
        step: 0.01,
        slide: function (event, ui) {
           $( "#Einf-slider-value" ).html( ffmt(ui.value) );
           replot();
        }
      });

  // var minvscale = d3.scale.linear().domain([0, 1]).range([5, 1e-5]);
  // var minvscaleinv = d3.scale.linear().domain([5, 1e-5]).range([0, 1]);

  // $( "#m-slider" ).slider(
  //     {
  //       range: "min",
  //       value: minvscaleinv(parseFloat($( "#m-slider-value" ).html())),
  //       min: 0,
  //       max: 1,
  //       step: 0.001,
  //       slide: function (event, ui) {
  //          $( "#m-slider-value" ).html( ffmt(1/minvscale(ui.value)) );
  //          replot();
  //       }
  //     });

  // var mscale = function (x) { return Math.exp(x) - 1; }
  // var mscaleinv = function (y) { return Math.log(y + 1); }

  var mmin = 0.1;
  var a = 1 - mmin;
  var ainv = 1/a;
  var mmax = 100000;
  var alpha = Math.log((mmax - mmin)/a)/Math.log(2);
  var alphainv = 1/alpha;
  var mscale = function (x) { return a * Math.pow(x, alpha) + mmin; }
  var mscaleinv = function (y) { return Math.pow((y - mmin)*ainv, alphainv); }

  var scalemin = mscaleinv(mmin);
  var scalemax = mscaleinv(mmax);
  $( "#m-slider" ).slider(
      {
        range: "min",
        value: mscaleinv(parseFloat($( "#m-slider-value" ).html())),
        min: scalemin,
        max: scalemax,
        step: (scalemax - scalemin) * 0.001,
        slide: function (event, ui) {
           $( "#m-slider-value" ).html( ffmt(mscale(ui.value)) );
           replot();
        }
      });



  // $( "#x-slider" ).slider(
  //     {
  //       range: "min",
  //       value: $( "#x-slider-value" ).html(),
  //       min: -400,
  //       max: 400,
  //       step: 1,
  //       slide: function (event, ui) {
  //          $( "#x-slider-value" ).html( ui.value );
  //          replot2();
  //       }
  //     });

  // //var π = Math.pi;
  // var π = 180;
  // $( "#θ-slider" ).slider(
  //     {
  //       range: "min",
  //       value: -parseFloat($( "#θ-slider-value" ).html()),
  //       min: 0,
  //       max: nudge(2*π, -1),
  //       step: 1,
  //       slide: function (event, ui) {
  //          $( "#θ-slider-value" ).html( -ui.value );
  //          replot2();
  //       }
  //     });

  // $( "#y-slider" ).slider(
  //     {
  //       range: "min",
  //       value: parseFloat($( "#y-slider-value" ).html()),
  //       min: -400,
  //       max: 400,
  //       step: 1,
  //       slide: function (event, ui) {
  //          $( "#y-slider-value" ).html( ui.value );
  //          replot2();
  //       }
  //     });

  // $( "#dy-slider" ).slider(
  //     {
  //       range: "min",
  //       value: parseFloat($( "#dy-slider-value" ).html()),
  //       min: -400,
  //       max: 400,
  //       step: 1,
  //       slide: function (event, ui) {
  //          $( "#dy-slider-value" ).html( ui.value );
  //          replot2();
  //       }
  //     });

  replot();
  // replot2();

});