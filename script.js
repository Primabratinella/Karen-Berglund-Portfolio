document.addEventListener("DOMContentLoaded", function () {

  // Navbar scroll
  const navbar = document.querySelector(".navbar");

  if (navbar) {
    window.addEventListener("scroll", function () {
      navbar.classList.toggle("scrolled", window.scrollY > 20);
    });
  }

  // Back to top
  const btn = document.querySelector(".back-to-top");

  if (btn) {
    btn.addEventListener("click", function () {
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    });

    window.addEventListener("scroll", function () {
      btn.classList.toggle("show", window.scrollY > window.innerHeight * 0.3);
    });
  }
  console.log(window.scrollY);
  
  // Resume PDF
  const downloadLink = document.getElementById("download-link");

  if (downloadLink) {
    downloadLink.addEventListener("click", function (event) {
      event.preventDefault();

      const element = document.getElementById("resume-content");
      const header = document.querySelector("header");

      if (header) header.style.display = "none";

      html2pdf()
        .from(element)
        .save("Your_Resume.pdf")
        .then(() => {
          if (header) header.style.display = "block";
          alert("Your resume PDF has been generated and will be downloaded.");
        });
    });
  }

});