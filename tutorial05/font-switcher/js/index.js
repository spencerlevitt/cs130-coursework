const makeBigger = () => {
  console.log("make bigger!");
  document.querySelector(".content p").style.fontSize = "30px";
};

const makeSmaller = () => {
  console.log("make smaller!");
  document.querySelector(".content p").style.fontSize = "10px";
};

document.querySelector("nav .a1").onclick = makeBigger;
document.querySelector("nav .a2").onclick = makeSmaller;
