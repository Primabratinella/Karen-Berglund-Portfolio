document.addEventListener("DOMContentLoaded", function () {

  // Navbar scroll effect
  const navbar = document.querySelector(".navbar");

  if (navbar) {
    window.addEventListener("scroll", () => {
      navbar.classList.toggle("scrolled", window.scrollY > 20);
    });
  }

  // Back to top button
  const btn = document.querySelector(".back-to-top");

  if (btn) {
    window.addEventListener("scroll", () => {
      btn.classList.toggle("show", window.scrollY > 100);
    });

    btn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  // Resume PDF download
  const downloadLink = document.getElementById("download-link");

  if (downloadLink) {
    downloadLink.addEventListener("click", function (e) {
      e.preventDefault();

      const element = document.getElementById("resume-content");

      html2pdf()
        .set({
          margin: 0.5,
          filename: "Karen_Berglund_Resume.pdf",
          html2canvas: { scale: 2 },
          jsPDF: { format: "a4", orientation: "portrait" }
        })
        .from(element)
        .save();
    });
  }

});