document.addEventListener('DOMContentLoaded', () => {
  const downloadLink = document.getElementById('download-link');
  if (!downloadLink) throw new Error('downloadLink element not found');

  downloadLink.addEventListener("click", function (e) {
    e.preventDefault();
    e.stopPropagation();

  const resumeContent = document.getElementById("resume-content");
  const start = document.querySelector(".resume-header");
  if (!resumeContent || !start) return;

  const container = document.createElement("div");
  container.style.background = "#fff";
  container.style.boxSizing = "border-box";
  container.style.padding = "16px";
  container.style.fontFamily = getComputedStyle(document.body).fontFamily || "Arial, sans-serif";
  container.style.color = getComputedStyle(document.body).color || "#000";

  let append = false;
  Array.from(resumeContent.children).forEach(child => {
    if (child === start) append = true;
    if (append) container.appendChild(child.cloneNode(true));
  });

  container.querySelectorAll("h1,h2,h3").forEach(h => h.style.margin = "0 0 8px 0");
  container.querySelectorAll("p, ul, li").forEach(el => el.style.margin = "0 0 8px 0");

  const opt = {
    margin: [10, 10],
    filename: "Resume.pdf",
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true },
    jsPDF: { unit: "mm", format: "a4", orientation: "portrait" }
  };

  const winRef = window.open("", "_blank");

  html2pdf().from(container).set(opt).outputPdf('blob').then(pdfBlob => {
    const blobUrl = URL.createObjectURL(pdfBlob);

    if (winRef && !winRef.closed) {
      try {
        const html = `<!doctype html>
<html>
<head><meta charset="utf-8"><title>Resume PDF</title></head>
<body style="margin:0">
  <iframe id="pdfFrame" style="border:0;width:100%;height:100vh"></iframe>
  <script>
    window.addEventListener('message', function(e) {
      try {
        var data = e.data || {};
        if (!data.blobUrl) return;
        var iframe = document.getElementById('pdfFrame');
        iframe.src = data.blobUrl;
        iframe.onload = function() {
          try { window.focus(); window.print(); } catch (err) {}
        };
      } catch (err) {}
    }, false);

    try { if (window.opener) window.opener.postMessage({ popupReady: true }, '*'); } catch (err) {}
  <\/script>
</body>
</html>`;

        winRef.document.open();
        winRef.document.write(html);
        winRef.document.close();

        function handleMessage(e) {
          if (e.data && e.data.popupReady) {
            try { winRef.postMessage({ blobUrl: blobUrl }, '*'); } catch (err) {}
            window.removeEventListener('message', handleMessage);
          }
        }
        window.addEventListener('message', handleMessage);

        setTimeout(() => {
          try { winRef.postMessage({ blobUrl: blobUrl }, '*'); } catch (err) {}
        }, 500);

      } catch (err) {
        const a = document.createElement('a');
        a.href = blobUrl;
        a.download = opt.filename;
        document.body.appendChild(a);
        a.click();
        a.remove();
        try { winRef.close(); } catch (_) {}
      }
    } else {
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = opt.filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
    }

    setTimeout(() => URL.revokeObjectURL(blobUrl), 60000);
  })
  .catch(err => {
    console.error('html2pdf error:', err);
    try { html2pdf().from(container).set(opt).save(); } catch (saveErr) { console.error(saveErr); }
  });
  }, { passive: false });
});
