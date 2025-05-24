document.addEventListener("DOMContentLoaded", () => {
  console.log("loaded");

  const taxtoggle = document.getElementById("switchCheckDefault");
  if (!taxtoggle) {
    console.warn("Switch element not found!");
    return;
  }

  taxtoggle.addEventListener("change", () => {
    const taxElements = document.querySelectorAll(".tax");
    console.log("Toggle clicked. Found", taxElements.length, "tax elements");

    taxElements.forEach((t) => {
      if (t.style.display === "none" || !t.style.display) {
        t.style.display = "inline";
      } else {
        t.style.display = "none";
      }
    });
  });
});
