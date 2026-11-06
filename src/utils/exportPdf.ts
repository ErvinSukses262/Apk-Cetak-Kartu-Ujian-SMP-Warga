
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

async function waitForImages(element: HTMLElement) {
  const images = element.querySelectorAll('img');
  const promises = Array.from(images).map(img => {
    if (img.complete) return Promise.resolve();
    return new Promise<void>((resolve) => {
      img.onload = () => resolve();
      img.onerror = () => resolve(); // jangan gagal karena 1 foto
      setTimeout(() => resolve(), 2000);
    });
  });
  await Promise.all(promises);
  // kasih waktu render font
  await new Promise(r => setTimeout(r, 400));
}

export async function downloadElementAsPdf(
  element: HTMLElement,
  fileName: string,
  orientation: 'landscape' | 'portrait' = 'landscape'
) {
  try {
    await waitForImages(element);
    
    // Paksa background putih biar tidak transparan di PDF
    const originalBg = element.style.background;
    element.style.background = 'white';

    const canvas = await html2canvas(element, {
      scale: 2.5, // 2.5 itu sweet spot: HD tapi tidak bikin Mac memory crash
      useCORS: true,
      allowTaint: false, // HARUS false biar tidak tainted canvas error
      backgroundColor: '#ffffff',
      logging: false,
      imageTimeout: 0,
      removeContainer: true,
      foreignObjectRendering: false,
      onclone: (clonedDoc) => {
        // Di dalam clone, paksa semua warna tercetak
        const clonedEl = clonedDoc.body;
        clonedEl.style.setProperty('-webkit-print-color-adjust', 'exact');
        clonedEl.style.setProperty('print-color-adjust', 'exact');
        // hilangkan shadow yang bikin buram di PDF
        const all = clonedDoc.querySelectorAll('*');
        all.forEach((el: any) => {
          if (el.style) {
            el.style.boxShadow = 'none';
            el.style.textShadow = 'none';
          }
        });
      }
    });

    element.style.background = originalBg;

    const isLandscape = orientation === 'landscape';
    const widthMM = isLandscape ? 297 : 210;
    const heightMM = isLandscape ? 210 : 297;

    // Pakai JPEG 92% biar ukuran PDF tidak 50MB (PNG 3x itu 40MB+)
    const imgData = canvas.toDataURL('image/jpeg', 0.92);
    
    const pdf = new jsPDF({
      orientation: orientation,
      unit: 'mm',
      format: 'a4',
      compress: true
    });

    // FULL BLEED - 0,0,297,210 = 100% persis layar, tanpa margin
    pdf.addImage(imgData, 'JPEG', 0, 0, widthMM, heightMM, undefined, 'FAST');
    pdf.save(`${fileName}.pdf`);
    
  } catch (error) {
    console.error('PDF Export Error:', error);
    throw error;
  }
}
