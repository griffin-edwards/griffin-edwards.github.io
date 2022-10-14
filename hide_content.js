var con = document.getElementsByClassName("content");
var j;

for (j = 0; j < con.length; j++) {
  if (con[j].style.display === "block") {
    con[j].style.display = "none";
  }
}