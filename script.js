document.addEventListener("DOMContentLoaded", function () {

  const navbar = document.querySelector(".navbar");

  if (navbar) {
    window.addEventListener("scroll", () => {
      navbar.classList.toggle("scrolled", window.scrollY > 20);
    });
  }

  const btn = document.querySelector(".back-to-top");

  if (btn) {
    window.addEventListener("scroll", () => {
      btn.classList.toggle("show", window.scrollY > 100);
    });

    btn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  const downloadLink = document.getElementById("download-link");

  if (downloadLink) {
    downloadLink.addEventListener("click",
      function (e) {
      e.preventDefault();

      const resumeContent =
      document.getElementById("resume-content");
        const start = document.querySelector(".resume-header");
        if (!resumeContent || !start) return;

        const container = document.createElement("div");
        container.style.background = "#fff";
        container.style.padding = "16px";
        container.style.boxSizing = "border-box";
        container.style.fontFamily =
        getComputedStyle(document.body).fontFamily || "Arial,sans-serif";
        container.style.color =
        getComputedStyle(document.body).color || "#000";

        let append = false;
        Array.from(resumeContent.children).forEach(child => {
          if (child === start) append = true;
          if (append)

            container.appendChild(child.cloneNode(true));
        });

        container.querySelectorAll("h1").forEach(h=> {
          h.style.margin = "0 0 8px 0"; });
        container.querySelectorAll("p, ul, li").forEach(el => {
          el.style.margin = "0 0 8px 0"; });
          
          const opt = {
            margin: [10,10],
            filename: "Karen_Berglund_Resume.pdf",
            image: {type:"jpeg", quality: 0.98},
            html2canvas: {scale: 2, userCORS: true},
            jsPDF: { format: "a4", orientation: "portrait" }
          };

          html2pdf().from(container).set(opt).outputPdf('blob').then(function (pdfBlob) {
            const blobUrl = URL.createObjectURL(pdfBlob);

            const iframe = 
            document.createElement ("iframe");
            iframe.style.position = "fixed";
            iframe.style.right = "0";
            iframe.style.bottom = "0";
            iframe.style.width = "0";
            iframe.style.height = "0";
            iframe.style.border = "0";
            iframe.src = blobUrl;
            document.body.appendChild(iframe);

            iframe.onload = function () {
              setTimeout (function () {
                try {
                  iframe.contentWindow.focus ();
                  iframe.contentWindow.print ();
                } catch (printErr) {
                  const newWin = window.open(blobUrl, "_blank");
                  if (!newWin) {
                    const a =
                    document.createElement ("a");
                    a.href = blobUrl;
                    a.download = opt.filename;
                    document.body.appendChild(a);
                    a.click();
                    a.remove();
                  }
                }
              }, 300);
            };

            setTimeout(function () {
              if (iframe.parentNode)
                iframe.parentNode.removeChild(iframe);
              URL.revokeObjectURL(blobUrl);
            }, 60000);
          })
          .catch(function (err) {
            console.error("html2pdf error:", err);

            try {
              html2pdf().from(container).set(opt).save();
            } catch (saveErr) {
              console.error ("Fallback save error:", saveErr);
            }
          });
        });
      }
    });