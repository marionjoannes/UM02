// https://observablehq.com/@marionjoannes/untitled@651
export default function define(runtime, observer) {
  const main = runtime.module();
  const fileAttachments = new Map([["GDP_1@4",new URL("./files/66ddc6b25d896342b7ae4dce738042b77b94fc1759e5df01eecf505ce52e99f072be6a54e1891fe5bf016338716e318ae8ae8592d08a62d9487288a117773ef9",import.meta.url)]]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], function(md){return(
md`###  WICH EU MEMBER SPENDS THE MOST AND WHERE?

#### *General governments expenditures in the European Union (EU) in 2017 and repartition across different fields*
&NewLine;

##### Click on a bar to see the details of the expenditures of the corresponding country, or click the background to go back up.`
)});
  main.variable(observer("chart")).define("chart", ["d3","width","height","x","root","up","xAxis","yAxis","down"], function(d3,width,height,x,root,up,xAxis,yAxis,down)
{
  const svg = d3.create("svg")
      .attr("width", width)
      .attr("height", height);

  x.domain([0, root.value]);
 
  svg.append("rect")
      .attr("class", "background")
      .attr("fill", "#171226")
      .attr("pointer-events", "all")
      .attr("width", width)
      .attr("height", height)
      .attr("cursor", "pointer")
      .on("click", d => up(svg, d));

  svg.append("g")
      .call(xAxis);

  svg.append("g")
      .call(yAxis);

  down(svg, root);

  return svg.node();
}
);
  main.variable(observer()).define(["md"], function(md){return(
md`###### The expenditures are measured as percentage of GDP. All EU countries compile their data according to the 2008 System of National Accounts (SNA). All the EU contries are represented appart from Bugaria, Croatia, Romania, Republic of Cyprus and Malta. The percentage are rounded to 0.01. 
&NewLine;
###### *Source : OECD (2020), General government spending (indicator). doi: 10.1787/a31cbf4d-en (Accessed on 06 January 2020)*
&emsp; 
`
)});
  main.variable(observer("bar")).define("bar", ["margin","barStep","barPadding","x"], function(margin,barStep,barPadding,x){return(
function bar(svg, down, d, selector) {
  const g = svg.insert("g", selector)
      .attr("class", "enter")
      .attr("transform", `translate(0,${margin.top + barStep * barPadding})`)
      .attr("text-anchor", "end")
      .attr("fill","White")
      .style("font", "12px sans-serif");
      
  const bar = g.selectAll("g")
    .data(d.children)
    .join("g")
      .attr("cursor", d => !d.children ? null : "pointer")
      .on("click", d => down(svg, d));
  
  bar.append("text")
      .attr("x", margin.left -6)
      .attr("y", barStep * (1 - barPadding) / 2)
      .attr("dy", ".35em")
      .text(d => d.data.name);
     
  bar.append("text")
      .attr("x", margin.left + 670)
      .attr("y", barStep * (1 - barPadding) / 2)
      .attr("dy", ".35em")
      .text(d => d.data.value +" %");
  
   bar.append("rect")
      .attr("x", x(0))
      .attr("width", d => x(d.value) - x(0))
      .attr("height", barStep * (1 - barPadding));

  
  return g;
}
)});
  main.variable(observer("down")).define("down", ["d3","duration","bar","stack","stagger","x","xAxis","barStep","color"], function(d3,duration,bar,stack,stagger,x,xAxis,barStep,color){return(
function down(svg, d) {
  if (!d.children || d3.active(svg.node())) return;

  // Rebind the current node to the background.
  svg.select(".background").datum(d);

  // Define two sequenced transitions.
  const transition1 = svg.transition().duration(duration);
  const transition2 = transition1.transition();

  // Mark any currently-displayed bars as exiting.
  const exit = svg.selectAll(".enter")
      .attr("class", "exit");

  // Entering nodes immediately obscure the clicked-on bar, so hide it.
  exit.selectAll("rect")
      .attr("fill-opacity", p => p === d ? 0 : null);

  // Transition exiting bars to fade out.
  exit.transition(transition1)
      .attr("fill-opacity", 0)
      .remove();

  // Enter the new bars for the clicked-on data.
  // Per above, entering bars are immediately visible.
  const enter = bar(svg, down, d, ".y-axis")
      .attr("fill-opacity", 0);

  // Have the text fade-in, even though the bars are visible.
  enter.transition(transition1)
      .attr("fill-opacity", 1);

  // Transition entering bars to their new y-position.
  enter.selectAll("g")
      .attr("transform", stack(d.index))
    .transition(transition1)
      .attr("transform", stagger());

  // Update the x-scale domain.
  x.domain([0, d3.max(d.children, d => d.value)]);

  // Update the x-axis.
  svg.selectAll(".x-axis").transition(transition2)
      .call(xAxis);

  // Transition entering bars to the new x-scale.
  enter.selectAll("g").transition(transition2)
      .attr("transform", (d, i) => `translate(0,${barStep * i})`);

  // Color the bars as parents; they will fade to children if appropriate.
  enter.selectAll("rect")
      .attr("fill", color(true))
      .attr("fill-opacity", 1)
    .transition(transition2)
      .attr("fill", d => color(!!d.children))
      .attr("width", d => x(d.value) - x(0));
}
)});
  main.variable(observer("up")).define("up", ["duration","x","d3","xAxis","stagger","stack","color","bar","down","barStep"], function(duration,x,d3,xAxis,stagger,stack,color,bar,down,barStep){return(
function up(svg, d) {
  if (!d.parent || !svg.selectAll(".exit").empty()) return;

  // Rebind the current node to the background.
  svg.select(".background").datum(d.parent);

  // Define two sequenced transitions.
  const transition1 = svg.transition().duration(duration);
  const transition2 = transition1.transition();

  // Mark any currently-displayed bars as exiting.
  const exit = svg.selectAll(".enter")
      .attr("class", "exit");

  // Update the x-scale domain.
  x.domain([0, d3.max(d.parent.children, d => d.value)]);

  // Update the x-axis.
  svg.selectAll(".x-axis").transition(transition1)
      .call(xAxis);

  // Transition exiting bars to the new x-scale.
  exit.selectAll("g").transition(transition1)
      .attr("transform", stagger());

  // Transition exiting bars to the parent’s position.
  exit.selectAll("g").transition(transition2)
      .attr("transform", stack(d.index));

  // Transition exiting rects to the new scale and fade to parent color.
  exit.selectAll("rect").transition(transition1)
      .attr("width", d => x(d.value) - x(0))
      .attr("fill", color(true));

  // Transition exiting text to fade out.
  // Remove exiting nodes.
  exit.transition(transition2)
      .attr("fill-opacity", 0)
      .remove();

  // Enter the new bars for the clicked-on data's parent.
  const enter = bar(svg, down, d.parent, ".exit")
      .attr("fill-opacity", 0);

  enter.selectAll("g")
      .attr("transform", (d, i) => `translate(0,${barStep * i})`);

  // Transition entering bars to fade in over the full duration.
  enter.transition(transition2)
      .attr("fill-opacity", 1);

  // Color the bars as appropriate.
  // Exiting nodes will obscure the parent bar, so hide it.
  // Transition entering rects to the new x-scale.
  // When the entering parent rect is done, make it visible!
  enter.selectAll("rect")
      .attr("fill", d => color(!!d.children))
      .attr("fill-opacity", p => p === d ? 0 : null)
    .transition(transition2)
      .attr("width", d => x(d.value) - x(0))
      .on("end", function(p) { d3.select(this).attr("fill-opacity", 1); });
}
)});
  main.variable(observer("stack")).define("stack", ["x","barStep"], function(x,barStep){return(
function stack(i) {
  let value = 0;
  return d => {
    const t = `translate(${x(value) - x(0)},${barStep * i})`;
    value += d.value;
    return t;
  };
}
)});
  main.variable(observer("stagger")).define("stagger", ["x","barStep"], function(x,barStep){return(
function stagger() {
  let value = 0;
  return (d, i) => {
    const t = `translate(${x(value) - x(0)},${barStep * i})`;
    value += d.value;
    return t;
  };
}
)});
  main.variable(observer("root")).define("root", ["d3","data"], function(d3,data){return(
d3.hierarchy(data)
    .sum(d => d.value)
    .sort((a, b) => b.value - a.value)
    .eachAfter(d => d.index = d.parent ? d.parent.index = d.parent.index + 1 || 0 : 0)
)});
  main.variable(observer("data")).define("data", ["FileAttachment"], function(FileAttachment){return(
FileAttachment("GDP_1@4").json()
)});
  main.variable(observer("x")).define("x", ["d3","margin","width"], function(d3,margin,width){return(
d3.scaleLinear().range([margin.left, width - margin.right])
)});
  main.variable(observer("xAxis")).define("xAxis", ["margin"], function(margin){return(
g => g
    .attr("class", "x-axis")
    .attr("transform", `translate(0,${margin.top})`)
    .call(g => (g.selection ? g.selection() : g).select(".domain").remove())
)});
  main.variable(observer("yAxis")).define("yAxis", ["margin","height"], function(margin,height){return(
g => g
    .attr("class", "y-axis")
    .attr("transform", `translate(${margin.left + 0.5},0)`)
    .call(g => g.append("line")
        .attr("y1", margin.top)
        .attr("y2", height - margin.bottom))
)});
  main.variable(observer("color")).define("color", ["d3"], function(d3){return(
d3.scaleOrdinal([true, false], ["#acdad9", "#3ce896"])
)});
  main.variable(observer("barStep")).define("barStep", function(){return(
27
)});
  main.variable(observer("barPadding")).define("barPadding", ["barStep"], function(barStep){return(
8 / barStep
)});
  main.variable(observer("duration")).define("duration", function(){return(
750
)});
  main.variable(observer("height")).define("height", ["root","barStep","margin"], function(root,barStep,margin)
{
  let max = 1;
  root.each(d => d.children && (max = Math.max(max, d.children.length)));
  return max * barStep + margin.top + margin.bottom;
}
);
  main.variable(observer("margin")).define("margin", function(){return(
{top: 30, right: 150, bottom: 30, left: 200}
)});
  main.variable(observer("d3")).define("d3", ["require"], function(require){return(
require("d3@5")
)});
  return main;
}
