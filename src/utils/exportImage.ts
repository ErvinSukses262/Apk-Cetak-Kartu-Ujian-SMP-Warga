
import html2canvas from 'html2canvas';

async function waitForImages(element: HTMLElement) {
  const images = element.querySelectorAll('img');
  const promises = Array.from(images).map(img => {
    if (img.complete) return Promise.resolve();
    return new Promise<void>((resolve) => {
      img.onload = () => resolve();
      img.onerror = () => resolve();
      setTimeout(() => resolve(), 2000);
    });
  });
  await Promise.all(promises);
  await new Promise(r => setTimeout(r, 300));
}

export async function downloadElementAsPng(
  element: HTMLElement,
  fileName: string,
  scale: number = 3.0
) {
  await waitForImages(element);
  const canvas = await html2canvas(element, {
    scale: scale,
    useCORS: true,
    allowTaint: false,
    backgroundColor: '#ffffff',
    logging: false,
    imageTimeout: 0
  });
  const link = document.createElement('a');
  link.download = `${fileName}.png`;
  link.href = canvas.toDataURL('image/png', 1.0);
  link.click();
}
