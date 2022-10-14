var coll = document.getElementsByClassName("collapsible");
var i;

for (i = 0; i < coll.length; i++) {
  coll[i].addEventListener("click", function() {
    this.classList.toggle("active");
    var content = this.nextElementSibling;
    if (content.style.display === "block") {
      content.style.display = "none"; 
      console.log("Was clicked and had block")
    } else {
      content.style.display = "block";
      console.log("Was clicked and had none")
    }
  });
}
