import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;

export function createPDFtoFrame(docDefinition: any, elementId: string) {
  const childElementId = `${elementId}hfhmitofyypb`;
  const pdfDocGenerator = pdfMake.createPdf(docDefinition);

  pdfDocGenerator.getDataUrl((dataUrl) => {
    const targetElement = document.querySelector(elementId);

    if (document.getElementById(childElementId)) {
      document.getElementById(childElementId)?.remove();
    }

    const iframe = document.createElement('iframe');
    iframe.id = childElementId;
    iframe.src = dataUrl;
    // iframe.frameBorder = '0';
    iframe.height = '600px';
    iframe.width = '100%';
    targetElement?.appendChild(iframe);
  });
}
